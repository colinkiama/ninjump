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
      .text(24, 12, "Score", {
        fontFamily: "Helvetica",
        fontSize: "0.75rem",
      })
      .setDepth(2);

    this._scoreText = this.add
      .text(0, 0, "0", {
        fontFamily: "Helvetica",
        fontSize: "1.25rem",
      })
      .setDepth(2);

    Phaser.Display.Align.In.BottomLeft(this._labelText, this._scoreText);

    let gameScene = this.scene.get("GameScene");

    gameScene.events.on("IncrementScore", () => {
      this._amount = this._amount + 1;
      this.updateText();
    });

    gameScene.events.on("ResetScore", () => {
      this._amount = 0;
      this.updateText();
    });
  }

  increment() {
    this._amount = this._amount + 1;
    this.updateText();
  }

  updateText() {
    this._scoreText.setText(`${this._amount}`);
  }
}
