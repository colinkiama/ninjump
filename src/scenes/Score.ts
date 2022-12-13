export default class Score extends Phaser.Scene {
  private _amount!: number;
  private _text!: Phaser.GameObjects.Text;
  constructor() {
    super("Score");
  }

  create() {
    this._amount = 0;

    this._text = this.add
      .text(0, 0, "0", {
        fontFamily: "Helvetica",
        fontSize: "0.75rem",
      })
      .setDepth(2);

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
    this._text.setText(`${this._amount}`);
  }
}
