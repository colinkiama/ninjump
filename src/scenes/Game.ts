import Phaser from "phaser";

const PLAYER_SIZE = 32;
const WALL_WIDTH = 20;

export default class Demo extends Phaser.Scene {
  private _player!: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  private _keySpace!: Phaser.Input.Keyboard.Key;

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
      PLAYER_SIZE / 2 + WALL_WIDTH,
      this.renderer.height / 2 - PLAYER_SIZE / 2 - 50,
      "player"
    );

    let leftWall = this.physics.add.staticImage(
      WALL_WIDTH / 2,
      this.renderer.height / 2,
      "wall"
    );

    let rightWall = this.physics.add.staticImage(
      this.renderer.width - WALL_WIDTH / 2,
      this.renderer.height / 2,
      "wall"
    );

    leftWall.height = this.renderer.height;

    this._player.body.setGravityY(300);
    this._keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    // if (this._player.body.coll)
  }
}
