// canvas_width = window.innerWidth; 
// canvas_height = window.innerHeight;

canvas_width = 800; 
canvas_height = 600;

var game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, '');

game.state.add('Game', Game);
game.state.start('Game');