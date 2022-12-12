import Phaser from "phaser";
import BrickPool from "../objects/BrickPool";
import SlipTimer from "../objects/SlipTimer";

const PLAYER_SIZE = 32;
const PLAYER_GRAVITY = 500;

const WALL_WIDTH = 20;

const JUMP_X_VELOCITY = 350;
const JUMP_Y_VELOCITY = 300;

enum PlayerCollisionState {
  OnLeftWall,
  OnRightWall,
  JumpingToWall,
  Slipped,
}

export default class Demo extends Phaser.Scene {
  private _player!: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  private _keySpace!: Phaser.Input.Keyboard.Key;
  private _leftWall!: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody;
  private _rightWall!: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody;
  private _currentPlayerCollisionState!: PlayerCollisionState;
  private _slipTimer!: SlipTimer;
  private _canSlip!: boolean;
  private _brickPool!: BrickPool;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("wall", "assets/wall.png");
    this.load.image("brick", "assets/brick.png");
  }

  create() {
    this._player = this.physics.add.image(
      PLAYER_SIZE / 2 + WALL_WIDTH - 1,
      this.renderer.height / 2 - PLAYER_SIZE / 2 - 50,
      "player"
    );

    this._leftWall = this.physics.add.staticImage(
      WALL_WIDTH / 2,
      this.renderer.height / 2,
      "wall"
    );

    this._rightWall = this.physics.add.staticImage(
      this.renderer.width - WALL_WIDTH / 2,
      this.renderer.height / 2,
      "wall"
    );

    this._slipTimer = new SlipTimer();

    this.physics.add.collider(this._player, this._leftWall, (player, wall) =>
      this.handleWallCollision(player, wall)
    );

    this.physics.add.collider(this._player, this._rightWall, (player, wall) =>
      this.handleWallCollision(player, wall)
    );

    this._player.body.setGravityY(PLAYER_GRAVITY);

    this._keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this._currentPlayerCollisionState = PlayerCollisionState.OnLeftWall;

    this._brickPool = new BrickPool(this, this._player, () =>
      this.brickHitPlayer()
    );

    this._brickPool.start();
  }

  brickHitPlayer(): void {
    this.scene.pause();
    console.log("Game over");
    // TODO render a "GAME OVER" scene over this one
  }

  slip(): void {
    console.log("SLip collision state:", this._currentPlayerCollisionState);
    switch (this._currentPlayerCollisionState) {
      case PlayerCollisionState.OnLeftWall:
        this._player.body.setVelocityX(100);
        break;
      case PlayerCollisionState.OnRightWall:
        this._player.body.setVelocityX(-100);
        break;
    }

    this._currentPlayerCollisionState = PlayerCollisionState.Slipped;
  }

  handleWallCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    wall: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    if (
      (this._currentPlayerCollisionState == PlayerCollisionState.OnLeftWall ||
        this._currentPlayerCollisionState ==
          PlayerCollisionState.OnRightWall) === false
    ) {
      this._slipTimer.start(() => this.setCanSlip(false));
      this.setCanSlip(true);
    }

    if (wall === this._leftWall) {
      this._currentPlayerCollisionState = PlayerCollisionState.OnLeftWall;
    } else {
      this._currentPlayerCollisionState = PlayerCollisionState.OnRightWall;
    }
  }

  update() {
    if (!this.playerCanJump()) {
      return;
    }

    if (this._keySpace.isDown) {
      if (this._canSlip) {
        this.slip();
        return;
      }

      switch (this._currentPlayerCollisionState) {
        case PlayerCollisionState.OnLeftWall:
          this._player.body.setVelocity(JUMP_X_VELOCITY, -JUMP_Y_VELOCITY);
          this._currentPlayerCollisionState =
            PlayerCollisionState.JumpingToWall;
          break;
        case PlayerCollisionState.OnRightWall:
          this._player.body.setVelocity(-JUMP_X_VELOCITY, -JUMP_Y_VELOCITY);
          this._currentPlayerCollisionState =
            PlayerCollisionState.JumpingToWall;
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
}
