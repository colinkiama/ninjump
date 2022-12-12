import Phaser from "phaser";

const PLAYER_SIZE = 32;
export default class Demo extends Phaser.Scene {
  private _player!: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
  }

  create() {
    this._player = this.physics.add.image(
      PLAYER_SIZE / 2,
      this.renderer.height / 2 - PLAYER_SIZE / 2 - 50,
      "player"
    );

    this._player.body.setGravityY(300);
  }
}
