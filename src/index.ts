import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/Game";
import GameOver from "./scenes/GameOver";
import Score from "./scenes/Score";

new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene, Score, GameOver],
  })
);
