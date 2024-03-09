
import Button from "../objects/Button";

export default class TitleScreen extends Phaser.Scene {
    private _is_first_created: boolean;
    private _background!: Phaser.GameObjects.Graphics;

    constructor() {
        super("TitleScreen");
        this._is_first_created = false;
    }

    preload() {
        this.load.image("logo", "assets/logo.png");

    }

    create() {
        this._background = this.add.graphics();
        this.add.image(this.game.renderer.width / 2, 95
        , "logo");

        this.resizeBackground();
        if (!this._is_first_created) {
            this._is_first_created = true;
            this.scale.on(Phaser.Scale.Events.RESIZE, this.onResize.bind(this));
        }

        let playButton = new Button(
            this,
            0,
            0,
            "Play",
            {
              color: "#ffffff",
              fontSize: "1rem",
              align: "center",
              fontFamily: "sans-serif",
            },
            {
              backgroundColor: 0x000000,
              padding: {
                top: 8,
                left: 24,
                right: 24,
                bottom: 8,
              },
            },
            () => {
              this.scene.start('MainGame');
              this.scene.stop();
            }
          );
        
        const container = this.add.container(this.game.renderer.width / 2, 192, [playButton/* Items here please! */]);
        container.setY(192 - (container.height / 2));
    }

    onResize(
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
      ) {
        this.resizeBackground();
    }

    resizeBackground() {
        this._background.fillGradientStyle(0xd00b0b, 0xd00b0b, 0x550c0c, 0x550c0c, 1);
        this._background.fillRect(0, 0, this.game.renderer.width, this.game.renderer.height);
    }
}