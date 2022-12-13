export default class Brick extends Phaser.Physics.Arcade.Image {
  avoided: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: number | undefined
  ) {
    super(scene, x, y, texture, frame);
    this.avoided = false;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
  }
}
