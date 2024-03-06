import Phaser from "phaser";

let screenRatio = window.innerHeight / window.innerWidth;

export default {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#33A5E7",
  scale: {
    width: 300,
    height: 300 * screenRatio,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  physics: {
    default: "arcade",
  },
};
