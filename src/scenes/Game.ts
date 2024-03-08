import Phaser, { Tilemaps } from "phaser";
import BrickPool from "../objects/BrickPool";
import SlipTimer from "../objects/SlipTimer";
import Brick from "../objects/Brick";
import Score from "./Score";

const PLAYER_SIZE = 32;
const PLAYER_GRAVITY = 200;

const WALL_WIDTH = 20;

const JUMP_X_VELOCITY = 700;
const JUMP_Y_VELOCITY = 300;

enum PlayerCollisionState {
  OnLeftWall,
  OnRightWall,
  JumpingToWall,
  Slipped,
  Hit,
}

export default class Demo extends Phaser.Scene {
  private _player!: Phaser.Physics.Arcade.Image;
  private _keySpace!: Phaser.Input.Keyboard.Key;
  private _leftWall!: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
  private _rightWall!: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
  private _currentPlayerCollisionState!: PlayerCollisionState;
  private _slipTimer!: SlipTimer;
  private _canSlip!: boolean;
  private _brickPool!: BrickPool;
  private _pit!: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody;
  private _playerFellDownPit!: boolean;
  private _afterImageEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private _dustParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private _wallSquashTween!: Phaser.Tweens.Tween;
  private _background!: Phaser.GameObjects.Image;
  private _is_first_created: boolean;

  constructor() {
    super("GameScene");
    this._is_first_created = false;
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("wall", "assets/wall.png");
    this.load.image("brick", "assets/brick.png");
    this.load.image("dust", "assets/dust.png");
    this.load.image("background", "assets/background.png");
  }

  create() {
    this.add.image(this.game.renderer.width / 2, 300, "background");
    this._player = this.physics.add
      .sprite(
        PLAYER_SIZE / 2 + WALL_WIDTH - 1,
        this.renderer.height / 2 - PLAYER_SIZE / 2 - 50,
        "player"
      )
      .setScale(0.1);

    this._player.width = this._player.width * 0.1;
    this._player.height = this._player.height * 0.1;
    this._wallSquashTween = this.tweens.add({
      targets: this._player,
      scaleY: 0.09,
      ease: "bounce",
      yoyo: true,
      duration: 50,
      paused: true,
    });

    this._playerFellDownPit = false;

    let afterImageParticles = this.add.particles("player");

    this._afterImageEmitter = afterImageParticles.createEmitter({
      scale: 0.1,
      speed: 0.1,
      alpha: { start: 0.5, end: 0 },
      lifespan: 100,
      on: false,
      follow: this._player,
    });

    let dustParticles = this.add.particles("dust");

    this._dustParticleEmitter = dustParticles.createEmitter({
      speed: { min: -150, max: 150 },
      scale: { start: 0.3, end: 0 },
      on: false,
      lifespan: 300,
      gravityY: 800,
    });

    this._leftWall = this.physics.add.staticImage(
      WALL_WIDTH / 2,
      this.renderer.height / 2,
      "wall"
    );

    this._leftWall.body.immovable = true;

    this._rightWall = this.physics.add.staticImage(
      this.renderer.width - WALL_WIDTH / 2,
      this.renderer.height / 2,
      "wall"
    );

    this._rightWall.body.immovable = true;

    this.resizeWalls();

    let ceiling = <Phaser.Types.Physics.Arcade.GameObjectWithStaticBody>(
      this.add.zone(this.renderer.width / 2, 1 / 2, this.renderer.width, 1)
    );

    this.physics.add.existing(ceiling);
    ceiling.body.immovable = true;

    this._pit = <Phaser.Types.Physics.Arcade.GameObjectWithStaticBody>(
      this.add.zone(
        this.renderer.width / 2,
        this.renderer.height + 100,
        this.renderer.width,
        1
      )
    );

    this.physics.add.existing(this._pit);
    this._pit.body.immovable = true;

    this._slipTimer = new SlipTimer();

    this.physics.add.collider(this._player, this._leftWall, (player, wall) =>
      this.handleWallCollision(player, wall)
    );

    this.physics.add.collider(this._player, this._rightWall, (player, wall) =>
      this.handleWallCollision(player, wall)
    );

    this.physics.add.collider(this._player, ceiling);

    this.physics.add.overlap(this._player, this._pit, (player, pit) => {
      this.handlePitFall();
    });

    this._player.setGravityY(PLAYER_GRAVITY);

    this._keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this._currentPlayerCollisionState = PlayerCollisionState.OnLeftWall;

    let dropAreaRange = {
      min: WALL_WIDTH,
      max: this.renderer.width - WALL_WIDTH,
    };

    this._brickPool = new BrickPool(
      this,
      dropAreaRange,
      (brick) => this.checkIfBrickFellIntoPit(brick),
      [
        (brick) => this.updateScore(brick),
        (brick) => this.checkIfbrickHitPlayer(brick),
      ]
    );

    if (!this.scene.isActive("Score")) {
      this.scene.launch("Score");
    } else {
      this.events.emit("ResetScore");
    }

    this._brickPool.start();

    if (!this._is_first_created) {
      this._is_first_created = true;
      this.scale.on(Phaser.Scale.Events.RESIZE, this.onResize.bind(this));
    }
  }

  handlePitFall() {
    if (this._playerFellDownPit) {
      return;
    }

    this.events.emit("PlayerFellDownPit");
    this.cameras.main.shake(1000, 0.02, true);
    this._brickPool.freeze();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameOver();
      },
    });
    this._playerFellDownPit = true;
    // this._brickPool.stop();
  }

  checkIfbrickHitPlayer(brick: Brick) {
    let brickCollidedWithPlayer = this.physics.collide(brick, this._player);
    if (!brick.hitPlayer && brickCollidedWithPlayer) {
      this._afterImageEmitter.stop();
      this.cameras.main.shake(200, 0.02);
      this.events.emit("PlayerHit");
      this._player.setVelocityY(100);
      this._currentPlayerCollisionState = PlayerCollisionState.Hit;
      brick.hitPlayer = true;
      this._brickPool.stop();
    }
  }

  slip(): void {
    switch (this._currentPlayerCollisionState) {
      case PlayerCollisionState.OnLeftWall:
        this._player.setVelocityX(100);
        break;
      case PlayerCollisionState.OnRightWall:
        this._player.setVelocityX(-100);
        break;
    }

    this._currentPlayerCollisionState = PlayerCollisionState.Slipped;
    this._afterImageEmitter.stop();
  }

  handleWallCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    wall: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    if (
      this._currentPlayerCollisionState === PlayerCollisionState.Hit ||
      this._currentPlayerCollisionState === PlayerCollisionState.Slipped
    ) {
      return;
    }

    if (
      (this._currentPlayerCollisionState === PlayerCollisionState.OnLeftWall ||
        this._currentPlayerCollisionState ===
          PlayerCollisionState.OnRightWall) === false
    ) {
      this._slipTimer.start(() => this.setCanSlip(false));
      this.setCanSlip(true);
      player.body.velocity.y = 0;
      player.body.velocity.x = 0;
    }

    if (wall === this._leftWall) {
      this._currentPlayerCollisionState = PlayerCollisionState.OnLeftWall;
    } else {
      this._currentPlayerCollisionState = PlayerCollisionState.OnRightWall;
    }

    this.updatePlayerFlip(this._currentPlayerCollisionState);
    this._afterImageEmitter.stop();

    this._wallSquashTween.play();
  }

  updatePlayerFlip(_currentPlayerCollisionState: PlayerCollisionState) {
    switch (this._currentPlayerCollisionState) {
      case PlayerCollisionState.OnLeftWall:
        this._player.setFlipX(false);
        break;
      case PlayerCollisionState.OnRightWall:
        this._player.setFlipX(true);
        break;
    }
  }

  update() {
    this._brickPool.update();

    if (!this.playerCanJump()) {
      return;
    }

    if (this._keySpace.isDown || this.input.activePointer.primaryDown) {
      if (this._canSlip) {
        this.slip();
        return;
      }

      switch (this._currentPlayerCollisionState) {
        case PlayerCollisionState.OnLeftWall:
          this._player.setVelocity(JUMP_X_VELOCITY, -JUMP_Y_VELOCITY);
          this._currentPlayerCollisionState =
            PlayerCollisionState.JumpingToWall;
          this._afterImageEmitter.start();
          this._dustParticleEmitter.explode(5, this._player.x, this._player.y);
          break;
        case PlayerCollisionState.OnRightWall:
          this._player.setVelocity(-JUMP_X_VELOCITY, -JUMP_Y_VELOCITY);
          this._currentPlayerCollisionState =
            PlayerCollisionState.JumpingToWall;
          this._afterImageEmitter.start();
          this._dustParticleEmitter.explode(5, this._player.x, this._player.y);
          break;
      }
    }
  }

  playerCanJump() {
    return (
      (this._currentPlayerCollisionState ===
        PlayerCollisionState.JumpingToWall ||
        this._currentPlayerCollisionState === PlayerCollisionState.Slipped) ===
      false
    );
  }

  setCanSlip(value: boolean) {
    this._canSlip = value;
  }

  updateScore(brick: Brick) {
    if (brick.avoided || brick.hitPlayer) {
      return;
    }

    if (this._player.y + this._player.height / 2 < brick.y - brick.height / 2) {
      this.events.emit("IncrementScore");
      brick.avoided = true;
    }
  }

  checkIfBrickFellIntoPit(brick: Brick) {
    return this.physics.overlap(brick, this._pit);
  }

  gameOver() {
    if (this.scene.isActive("GameOver")) {
      return;
    }

    this.scale.off(Phaser.Scale.Events.RESIZE, this.onResize.bind(this));

    this.scene.pause();
    this.scene.launch("GameOver");
  }

  onResize(
    gameSize: Phaser.Structs.Size,
    baseSize: Phaser.Structs.Size,
    displaySize: Phaser.Structs.Size,
    previousWidth: number,
    previousHeight: number
  ) {
    this.resizeWalls();
  }

  resizeWalls() {
    this._leftWall.setScale(
      1,
      this.game.scale.parentSize.height / this._leftWall.height
    );

    this._leftWall.refreshBody();    


    this._rightWall.setScale(
      1,
      this.game.scale.parentSize.height / this._rightWall.height
    );
   
    this._rightWall.refreshBody();
  }
}
