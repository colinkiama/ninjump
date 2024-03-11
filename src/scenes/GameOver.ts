import { Game, Tilemaps } from "phaser";
import Button from "../objects/Button";

export default class GameOver extends Phaser.Scene {
  private _is_first_created: boolean;
  private _gameOverText!: Phaser.GameObjects.Text;
  private _playAgainButton!: Button;

  constructor() {
    super("GameOver");
    this._is_first_created = false;
  }

  create() {
    this._gameOverText = this.add
      .text(0, 0, "Game Over", {
        color: "#ffffff",
        fontSize: "2rem",
        fontFamily: '"Arial", sans-serif',
        align: "center",
      })
      .setDepth(3);


    this._playAgainButton = new Button(
      this,
      0,
      0,
      "Play Again",
      {
        color: "#ffffff",
        fontSize: "1rem",
        align: "center",
        fontFamily: '"Arial", sans-serif',
      },
      {
        backgroundColor: 0x000000,
        padding: {
          top: 8,
          left: 40,
          right: 40,
          bottom: 8,
        },
      },
      () => {
        let mainGame = this.scene.get("MainGame");
        mainGame.scene.restart();
        this.scene.stop();
      }
    );

  
    this.repositionUI();

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

    if (!this._is_first_created) {
      this._is_first_created = true;
      this.scale.on(Phaser.Scale.Events.RESIZE, this.onResize.bind(this));
    }
  }

  onResize(
    gameSize: Phaser.Structs.Size,
    baseSize: Phaser.Structs.Size,
    displaySize: Phaser.Structs.Size,
    previousWidth: number,
    previousHeight: number
  ) {
    this.repositionUI();
  }

  repositionUI() {
    this._gameOverText.x = this.renderer.width / 2 - this._gameOverText.width / 2;
    this._gameOverText.y = this.renderer.height / 2 - this._gameOverText.height / 2;

    this._playAgainButton.setPosition(
      this.renderer.width / 2 - this._playAgainButton.width / 2,
      this.renderer.height / 2 - this._playAgainButton.height / 2 + 50
    );
  }
}
