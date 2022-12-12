type ButtonStyle = {
  padding: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  backgroundColor?: number | undefined;
  border?:
    | {
        width?: number;
        color?: number;
        radius?: number;
      }
    | undefined;
};

export default class Button extends Phaser.GameObjects.Container {
  private _text: Phaser.GameObjects.Text;
  private _buttonGraphics!: Phaser.GameObjects.Rectangle;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[],
    textStyle: Phaser.Types.GameObjects.Text.TextStyle,
    buttonStyle: ButtonStyle,
    clickCallback: () => void
  ) {
    let textObject = new Phaser.GameObjects.Text(scene, 0, 0, text, textStyle);
    textObject.setDepth(2);

    let buttonGraphics = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      textObject.width + buttonStyle.padding.left + buttonStyle.padding.right,
      textObject.height + buttonStyle.padding.top + buttonStyle.padding.bottom,
      buttonStyle?.backgroundColor
    );

    super(scene, x, y, [buttonGraphics, textObject]);
    this._text = textObject;
    this._buttonGraphics = buttonGraphics;

    // In future, use: Phaser.Display.Align.In.Center(textObject, this);
    textObject.x = this.width / 2 - textObject.width / 2;
    textObject.y = this.height / 2 - textObject.height / 2;

    this.setInteractive(
      this._buttonGraphics,
      (hitArea: Phaser.GameObjects.Rectangle, x, y, gameObject) => {
        // REMEMBER: the origin (0, 0) refers to the center, not here, NOT the top left

        let hitAreaXRange = {
          min: hitArea.x - hitArea.width / 2,
          max: hitArea.x - hitArea.width / 2 + hitArea.width,
        };
        let hitAreaYRange = {
          min: hitArea.y - hitArea.height / 2,
          max: hitArea.y - hitArea.height / 2 + hitArea.height,
        };

        return Button.checkIfPointIsInHitArea(
          hitAreaXRange,
          hitAreaYRange,
          new Phaser.Math.Vector2(x, y)
        );
      }
    );

    this.on("pointerover", () => {
      this._buttonGraphics.fillColor = 0x0000ff;
    });

    this.scene.add.existing(this);
  }
  static checkIfPointIsInHitArea(
    hitAreaXRange: { min: number; max: number },
    hitAreaYRange: { min: number; max: number },
    point: Phaser.Math.Vector2
  ): Boolean {
    return (
      point.x >= hitAreaXRange.min &&
      point.x <= hitAreaXRange.max &&
      point.y >= hitAreaYRange.min &&
      point.y <= hitAreaYRange.max
    );
  }
}
