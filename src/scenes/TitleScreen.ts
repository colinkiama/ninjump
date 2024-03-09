import Button from "../objects/Button";

export default class TitleScreen extends Phaser.Scene {
  private _is_first_created: boolean;
  private _background!: Phaser.GameObjects.Graphics;
  private _creditsContainer!: Phaser.GameObjects.Container;

  constructor() {
    super("TitleScreen");
    this._is_first_created = false;
  }

  preload() {
    this.load.image("logo", "assets/logo.png");
  }

  create() {
    this._background = this.add.graphics();
    this.add.image(this.game.renderer.width / 2, 95, "logo");

    this.resizeBackground();

    let playButton = new Button(
      this,
      0,
      0,
      "Play",
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
        this.scene.start("MainGame");
        this.scene.stop();
      }
    );

    const menuItemsContainer = this.add.container(
      this.game.renderer.width / 2,
      192,
      [playButton /* Items here please! */]
    );
    menuItemsContainer.setY(160 - menuItemsContainer.height / 2);

    const soundsCredits = this.add.text(0, 0, "Sounds: Kenney.nl", {
      fontFamily: '"Arial", sans-serif',
    });

    soundsCredits.x = -soundsCredits.width / 2;

    const gameCredits = this.add.text(0, 0, "Game: Colin Kiama - 2024", {
      fontFamily: '"Arial", sans-serif',
    });

    gameCredits.x = -gameCredits.width / 2;
    gameCredits.y = soundsCredits.y + soundsCredits.height;

    this._creditsContainer = this.add.container(
      this.game.renderer.width / 2,
      this.game.renderer.height,
      [soundsCredits, gameCredits]
    );
    this.repositionCreditsContainer();

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
    this.resizeBackground();
    this.repositionCreditsContainer();
  }

  resizeBackground() {
    this._background.fillGradientStyle(
      0xd00b0b,
      0xd00b0b,
      0x550c0c,
      0x550c0c,
      1
    );
    this._background.fillRect(
      0,
      0,
      this.game.renderer.width,
      this.game.renderer.height
    );
  }

  repositionCreditsContainer() {
    this._creditsContainer.setY(this.game.renderer.height - 60);
  }
}
