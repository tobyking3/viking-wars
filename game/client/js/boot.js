let Boot = {};

let playerCount = false;

let waitingMessage;

Boot.init = function() {
    game.stage.disableVisibilityChange = true;
};

Boot.preload = function() {
    game.load.image('background', 'assets/backgrounds/long_scene.png');
    game.load.image('waiting', 'assets/waiting.png');
    game.load.atlas('brown_viking', 'assets/brown_viking.png', 'assets/brown_viking.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('red_viking', 'assets/red_viking.png', 'assets/red_viking.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('arrow', './assets/left_arrow.png');
    game.load.image('turret_player_1', './assets/turret-player1.png');
    game.load.image('turret_player_2', './assets/turret-player2.png');
    game.load.image('ground', './assets/ground.png');
    game.load.spritesheet('ready_button', 'assets/ready.png', 1000, 365);
};

Boot.create = function() {
    powerText = game.add.text(400, 200, 'START GAME', {font: "40px Arial", fill: "#ffffff"});
    game.add.sprite(0, 0, 'background');
    waitingMessage = waitingMessage = game.add.sprite(0, 0, 'waiting');
    waitingMessage.scale.setTo(0.5, 0.5);
    waitingMessage.x = game.width / 2 - waitingMessage.width / 2;
    waitingMessage.y = game.height / 2 - waitingMessage.height / 2;
};

Boot.setConnectionCount = function(connectionCounter) {
    playerCount = connectionCounter;
    if (playerCount === 2) {
        Boot.startGame();
    } 
}

Boot.startGame = function() {
    game.state.start('Game');
}