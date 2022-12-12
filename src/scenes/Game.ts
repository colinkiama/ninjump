import Phaser from "phaser";

const PLAYER_SIZE = 32;
const WALL_WIDTH = 20;

enum PlayerCollisionState {
  OnLeftWall,
  OnRightWall,
  JumpingToWall,
  SLIPPED,
}

export default class Demo extends Phaser.Scene {
  private _player!: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  private _keySpace!: Phaser.Input.Keyboard.Key;
  private _leftWall!: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody;
  private _rightWall!: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody;
  private _currentPlayerCollisionState!: PlayerCollisionState;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("wall", "assets/wall.png");
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

    this.physics.add.collider(this._player, this._leftWall, (player, wall) =>
      this.handleWallCollision(player, wall)
    );
    this.physics.add.collider(this._player, this._rightWall, (player, wall) =>
      this.handleWallCollision(player, wall)
    );

    this._player.body.setGravityY(300);
    this._keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this._currentPlayerCollisionState = PlayerCollisionState.OnLeftWall;
  }

  handleWallCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    wall: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    if (wall === this._leftWall) {
      this._currentPlayerCollisionState = PlayerCollisionState.OnLeftWall;
    } else {
      this._currentPlayerCollisionState = PlayerCollisionState.OnRightWall;
    }
  }

  update() {
    if (this._keySpace.isDown) {
      switch (this._currentPlayerCollisionState) {
        case PlayerCollisionState.OnLeftWall:
          this._player.body.setVelocity(300, -200);
          this._currentPlayerCollisionState =
            PlayerCollisionState.JumpingToWall;
          break;
        case PlayerCollisionState.OnRightWall:
          this._player.body.setVelocity(-300, -200);
          this._currentPlayerCollisionState =
            PlayerCollisionState.JumpingToWall;
          break;
      }
    }
  }

  playerOnWall() {
    // return (
    //   this.physics.collide(this._player, this._leftWall) ||
    //   this.physics.collide(this._player, this._rightWall)
    // );
  }
}
