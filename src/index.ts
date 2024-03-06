import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/Game";
import GameOver from "./scenes/GameOver";
import Score from "./scenes/Score";

const game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene, Score, GameOver],
  })
);

function resize() {
  game.scale.setGameSize(
    game.scale.width,
    game.scale.width * calculateScreenRatio()
  );

  game.scale.setMaxZoom();
}

function calculateScreenRatio() {
  return window.innerHeight / window.innerWidth;
}

game.scale.setMaxZoom();
window.addEventListener("resize", resize);
