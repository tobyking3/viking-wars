let canvas_width = 1300;
let canvas_height = 800;

var game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, '');

game.state.add('Game', Game);
game.state.start('Game');