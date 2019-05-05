let End = {};

End.init = function() {
    game.stage.disableVisibilityChange = true;
};

End.preload = function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.load.image('background', 'assets/long_scene.png');
    game.load.image('game_over', 'assets/game_over.png');
};

End.create = function() {
    game.add.sprite(0, 0, 'background');
    waitingMessage = waitingMessage = game.add.sprite(0, 0, 'game_over');
    waitingMessage.scale.setTo(0.5, 0.5);
    waitingMessage.x = game.width / 2 - waitingMessage.width / 2;
    waitingMessage.y = game.height / 2 - waitingMessage.height / 2;
};