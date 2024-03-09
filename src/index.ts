import Phaser from "phaser";
import config from "./config";
import MainGame from "./scenes/MainGame";
import GameOver from "./scenes/GameOver";
import Score from "./scenes/Score";
import TitleScreen from "./scenes/TitleScreen";

const game = new Phaser.Game(
  Object.assign(config, {
    scene: [TitleScreen, MainGame, Score, GameOver],
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
