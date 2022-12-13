import Brick from "./Brick";
import { WallJump } from "./Range";

const BRICK_WIDTH = 16;
const BRICK_HEIGHT = 8;

const MIN_BRICK_GRAVITY = 200;
const MAX_BRICK_GRAVITY = 201;

enum DropArea {
  Left,
  Middle,
  Right,
}

const MIN_SPAWN_INTERVAL = 2000; // Milliseconds
const MAX_SPAWN_INTERVAL = 3000; // Milliseconds

export default class BrickPool extends Phaser.Physics.Arcade.Group {
  private _player: Phaser.Physics.Arcade.Image;
  private _scene: Phaser.Scene;
  private _walledDropAreaRange: WallJump.Range;
  private _cleanUpCallback: (brick: Brick) => boolean;
  private _stateCallbacks: ((brick: Brick) => void)[];
  private _timerId!: number;
  private _bricks: Brick[];

  static generateSpawnTimeout(): number | undefined {
    return (
      Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) +
      MIN_SPAWN_INTERVAL
    );
  }

  constructor(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Image,
    walledDropAreaRange: WallJump.Range,
    cleanUpCallback: (brick: Brick) => boolean,
    stateCallbacks: ((brick: Brick) => void)[]
  ) {
    super(scene.physics.world, scene);

    this._player = player;
    this._scene = scene;
    this._walledDropAreaRange = walledDropAreaRange;
    this._bricks = [];
    this._cleanUpCallback = cleanUpCallback;
    this._stateCallbacks = stateCallbacks;

    this.runChildUpdate = true;

    this.createMultiple({
      frameQuantity: 3,
      key: "brick",
      active: false,
      visible: false,
      classType: Brick,
    });
  }

  start() {
    this._timerId = setInterval(
      () => this.dropBrick(),
      BrickPool.generateSpawnTimeout()
    );
  }

  dropBrick() {
    let dropArea = BrickPool.decideDropArea();
    let startingPosition = BrickPool.decideStartingPosition(
      dropArea,
      this._walledDropAreaRange
    );

    let brick: Brick = this.getFirstDead(false);

    if (!brick) {
      return;
    }

    brick.drop(
      startingPosition.x,
      startingPosition.y,
      BrickPool.generateGravity()
    );
  }

  update() {
    this.children.iterate((item) => {
      let brick = <Brick>item;
      if (this._cleanUpCallback(brick)) {
        this.killAndHide(brick);
      }
      for (let i = 0; i < this._stateCallbacks.length; i++) {
        this._stateCallbacks[i](brick);
      }
    });
  }

  static generateGravity(): number {
    return (
      Math.random() * (MAX_BRICK_GRAVITY - MIN_BRICK_GRAVITY) +
      MIN_BRICK_GRAVITY
    );
  }
  static decideStartingPosition(
    dropArea: DropArea,
    walledDropAreaRange: WallJump.Range
  ) {
    // Left area  = Possible 20% left of screen area
    // Middle area = Possible 60% of screen area
    // Right area = Possible 20% of right area

    switch (dropArea) {
      case DropArea.Left:
        return new Phaser.Math.Vector2(
          BrickPool.generateStartingXPosition(walledDropAreaRange, {
            min: 0,
            max: 0.2,
          }),
          -BRICK_HEIGHT / 2
        );
      case DropArea.Middle:
        return new Phaser.Math.Vector2(
          BrickPool.generateStartingXPosition(walledDropAreaRange, {
            min: 0.2,
            max: 0.8,
          }),
          -BRICK_HEIGHT / 2
        );
      case DropArea.Right:
        return new Phaser.Math.Vector2(
          BrickPool.generateStartingXPosition(walledDropAreaRange, {
            min: 0.8,
            max: 1.0,
          }),
          -BRICK_HEIGHT / 2
        );
    }
  }

  static generateStartingXPosition(
    dropAreaRange: WallJump.Range,
    areaPortionRange: WallJump.Range
  ) {
    let randomPortion =
      Math.random() * (areaPortionRange.max - areaPortionRange.min) +
      areaPortionRange.min;
    return (
      randomPortion * (dropAreaRange.max - dropAreaRange.min) +
      dropAreaRange.min
    );
  }

  static decideDropArea() {
    let randomValue = Math.random();

    if (randomValue < 0.3) {
      return DropArea.Middle;
    } else if (randomValue < 0.65) {
      return DropArea.Left;
    } else {
      return DropArea.Right;
    }
  }

  stop() {
    clearInterval(this._timerId);
  }
}
