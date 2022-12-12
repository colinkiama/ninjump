export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    let gameOverText = this.add
      .text(0, 0, "Game Over", {
        color: "#ffffff",
        fontSize: "2rem",
        align: "center",
      })
      .setDepth(2);

    gameOverText.x = this.renderer.width / 2 - gameOverText.width / 2;
    gameOverText.y = this.renderer.height / 2 - gameOverText.height / 2;
    gameOverText.visible = true;
  }
}
