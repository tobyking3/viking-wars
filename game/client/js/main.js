var game = new Phaser.Game(400, 400, Phaser.AUTO, '');

game.state.add('Game', Game);
game.state.start('Game');