export default class Score extends Phaser.Scene {
  private _amount!: number;
  private _labelText!: Phaser.GameObjects.Text;
  private _scoreText!: Phaser.GameObjects.Text;
  constructor() {
    super("Score");
  }

  create() {
    this._amount = 0;

    this._labelText = this.add
      .text(0, 0, "Score", {
        fontFamily: '"Arial", sans-serif',
        fontSize: "0.75rem",
        fontStyle: "strong",
      })
      .setDepth(2);

    this._scoreText = this.add
      .text(0, 0, "0", {
        fontFamily: '"Arial", sans-serif',
        fontSize: "1.25rem",
        align: "right",
      })
      .setDepth(2);

    this._scoreText.setX(this._labelText.x).setY(this._labelText.height + 2);

    this.add.container(28, 12, [this._labelText, this._scoreText]);

    let mainGame = this.scene.get("MainGame");

    mainGame.events.on("IncrementScore", () => {
      this._amount = this._amount + 1;
      this.updateText();
    });

    mainGame.events.on("ResetScore", () => {
      this._amount = 0;
      this.setScoreText(this._amount);
    });

    mainGame.events.on("PlayerHit", () => {
      this.cameras.main.shake(200, 0.02);
    });

    mainGame.events.on("PlayerFellDownPit", () => {
      this.cameras.main.shake(1000, 0.02);
    });
  }

  increment() {
    this._amount = this._amount + 1;
    this.updateText();
  }

  updateText() {
    this.setScoreText(this._amount);
    this.tweens.add({
      targets: this._scoreText,
      scale: 1.2,
      ease: "quadratic",
      yoyo: true,
      duration: 100,
    });
  }

  setScoreText(value: number) {
    this._scoreText.setText(`${value}`);
  }
}
