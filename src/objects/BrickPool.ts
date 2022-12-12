import { Scene } from "phaser";

const BRICK_WIDTH = 40;
const BRICK_HEIGHT = 20;

const MIN_BRICK_GRAVITY = 100;
const MAX_BRICK_GRAVITY = 300;

enum DropArea {
  Left,
  Middle,
  Right,
}

const MIN_SPAWN_INTERVAL = 500; // Milliseconds
const MAX_SPAWN_INTERVAL = 1000; // Milliseconds

export default class BrickPool {
  private _bricks: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody[];
  private _player: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  private _scene: Phaser.Scene;
  private _brickCollisionCallback: () => void;
  private _timerId!: number;

  static generateSpawnTimeout(): number | undefined {
    return (
      Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) +
      MIN_SPAWN_INTERVAL
    );
  }

  constructor(
    scene: Phaser.Scene,
    player: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody,
    brickCollisionCallback: () => void
  ) {
    this._bricks = [];
    this._player = player;
    this._scene = scene;
    this._brickCollisionCallback = brickCollisionCallback;
  }

  start() {
    this._timerId = setInterval(
      () => this.add(),
      BrickPool.generateSpawnTimeout()
    );
  }

  add() {
    let dropArea = BrickPool.decideDropArea();
    let startingPosition = BrickPool.decideStartingPosition(
      dropArea,
      this._scene
    );

    let addedBrick = this._scene.physics.add.image(
      startingPosition.x,
      startingPosition.y,
      "brick"
    );

    addedBrick.body.setImmovable(true);

    this._scene.physics.add.collider(
      addedBrick,
      this._player,
      (brick, player) => this._brickCollisionCallback()
    );

    addedBrick.setGravityY(BrickPool.generateGravity());
  }
  static generateGravity(): number {
    return (
      Math.random() * (MAX_BRICK_GRAVITY - MIN_BRICK_GRAVITY) +
      MIN_BRICK_GRAVITY
    );
  }
  static decideStartingPosition(dropArea: DropArea, scene: Scene) {
    // Left area  = Possible 20% left of screen area
    // Middle area = Possible 60% of screen area
    // Right area = Possible 20% of right area
    const possibleXRange = scene.renderer.width - BRICK_WIDTH;

    switch (dropArea) {
      case DropArea.Left:
        return new Phaser.Math.Vector2(
          BrickPool.generateStartingXPosition(0, possibleXRange * 0.2),
          -BRICK_WIDTH / 2
        );
      case DropArea.Middle:
        return new Phaser.Math.Vector2(
          BrickPool.generateStartingXPosition(
            possibleXRange * 0.2,
            possibleXRange * 0.8
          ),
          -BRICK_WIDTH / 2
        );
      case DropArea.Right:
        return new Phaser.Math.Vector2(
          BrickPool.generateStartingXPosition(
            possibleXRange * 0.8,
            possibleXRange * 1.0
          ),
          -BRICK_WIDTH / 2
        );
    }
  }

  static generateStartingXPosition(minValue: number, maxValue: number) {
    return Math.random() * (maxValue - minValue) + minValue + BRICK_WIDTH / 2;
  }

  static decideDropArea() {
    let randomValue = Math.random();

    if (randomValue < 0.1) {
      return DropArea.Middle;
    } else if (randomValue < 0.55) {
      return DropArea.Left;
    } else {
      return DropArea.Right;
    }
  }

  stop() {
    clearInterval(this._timerId);
  }
}
