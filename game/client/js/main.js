let canvas_width = 1300;
let canvas_height = 800;
let game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, '');

game.state.add('Boot', Boot);
game.state.add('Game', Game);
game.state.add('End', End);

game.state.start('Boot');