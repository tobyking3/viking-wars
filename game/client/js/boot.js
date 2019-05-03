let Boot = {};

let playersReady = false;

let waitingMessage;

Boot.init = function() {
    game.stage.disableVisibilityChange = true;
};

Boot.preload = function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.load.image('background', 'assets/backgrounds/long_scene.png');
    game.load.image('waiting', 'assets/waiting.png');
};

Boot.create = function() {
    powerText = game.add.text(400, 200, 'START GAME', {font: "40px Arial", fill: "#ffffff"});
    game.add.sprite(0, 0, 'background');
    waitingMessage = waitingMessage = game.add.sprite(0, 0, 'waiting');
    waitingMessage.scale.setTo(0.5, 0.5);
    waitingMessage.x = game.width / 2 - waitingMessage.width / 2;
    waitingMessage.y = game.height / 2 - waitingMessage.height / 2;
};

Boot.setConnectionCount = function(connectionState) {
    playersReady = connectionState;

    if (playersReady) {
        Boot.startGame();
    }
};

Boot.startGame = function() {
    game.state.start('Game');
};