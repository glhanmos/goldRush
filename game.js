let game;

let gameOptions = {

    platformSpeedRange: [300, 300],
    spawnRange: [80, 300],
    platformSizeRange: [90, 300],
    platformHeightRange: [-5, 5],
    platformHeighScale: 20,
    platformVerticalLimit: [0.4, 0.8],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2,
    goldPercent: 25,
    spikePercent: 25
}

window.onload = function() {

    let gameConfig = {
        type: Phaser.AUTO,
        width: 1200,
        height: 750,
        backgroundColor: 0x000000,
        scene: [preload, playGame, gameOver],
        physics: {
            default: "arcade",

        }
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
let cameras;
let player;
let bg;
let mtn0;
let mtn1;
let ground;
let score;
let scoreLabel;