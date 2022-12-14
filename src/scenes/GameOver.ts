import { Game, Tilemaps } from "phaser";
import Button from "../objects/Button";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    let gameOverText = this.add
      .text(0, 0, "Game Over", {
        color: "#ffffff",
        fontSize: "2rem",
        fontFamily: "Helvetica",
        align: "center",
      })
      .setDepth(3);

    gameOverText.x = this.renderer.width / 2 - gameOverText.width / 2;
    gameOverText.y = this.renderer.height / 2 - gameOverText.height / 2;
    gameOverText.visible = true;

    let playAgainButton = new Button(
      this,
      0,
      0,
      "Play Again",
      {
        color: "#ffffff",
        fontSize: "1rem",
        align: "center",
        fontFamily: "Helvetica",
      },
      {
        backgroundColor: 0xff0000,
        padding: {
          top: 4,
          left: 7,
          right: 7,
          bottom: 4,
        },
      },
      () => {
        let gameScene = this.scene.get("GameScene");
        gameScene.scene.restart();
        this.scene.stop();
      }
    );

    playAgainButton.setPosition(
      this.renderer.width / 2 - playAgainButton.width / 2,
      this.renderer.height / 2 - playAgainButton.height / 2 + 50
    );

    let orginalCameraY = this.cameras.main.y;
    this.cameras.main.y = -this.renderer.height;

    this.tweens.add({
      targets: this.cameras.main,
      y: orginalCameraY,
      duration: 700,
      delay: 300,
      ease: "Elastic",
      easeParams: [1.25, 1.5],
    });
  }
}
