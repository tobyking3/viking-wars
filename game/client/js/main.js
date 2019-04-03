(function () {
    var game = new Phaser.Game(800, 450, Phaser.AUTO, '', null, false, false);

    game.state.add('Boot',          VikingWars.Boot);
    game.state.add('Preload',       VikingWars.Preload);
    game.state.add('Menu',          VikingWars.Menu);
    game.state.add('Game',          VikingWars.Game);

    game.state.start('Boot')
})();