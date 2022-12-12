import { Game } from "phaser";
import Button from "../objects/Button";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver", active: true });
  }

  create() {
    let gameOverText = this.add
      .text(0, 0, "Game Over", {
        color: "#ffffff",
        fontSize: "2rem",
        fontFamily: "Helvetica",
        align: "center",
      })
      .setDepth(2);

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
      () => this.scene.start("Game")
    );

    playAgainButton.setPosition(
      this.renderer.width / 2 - playAgainButton.width / 2,
      this.renderer.height / 2 - playAgainButton.height / 2 + 50
    );
  }
}
