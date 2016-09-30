var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var score = 0;
var scoreText;

function preload() {}

function create() {
    scoreText = game.add.text(50, 50, "", { fontSize: '32px', fill: '#FFF' });
}

function update() {
    score++;
    scoreText.text = score;
}