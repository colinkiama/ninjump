const BRICK_IMAGE = "brick";
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
  }

  drop(x: number, y: number, gravityY: number) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setGravityY(gravityY);
    this.setImmovable(true);

    this.avoided = false;
  }
}
