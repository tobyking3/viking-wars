let Game = {
    worldWidth: 4329,
    worldHeight: 1080,
};

let gameStarted = false;

let playerHealth = {
    0: 100,
    1: 100
};

let clickable = true;
let target = null;

let turret = null;
let playerOneHealthBar = null;
let playerTwoHealthBar = null;
let bullet = null;
let angle = 0;
let power = 800;
let powerText = null;

let cursors = null;
let fireButton = null;
let fireAllowed = false;

let readyButton;
let ground;

Game.init = function() {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
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

Game.create = function() {
    Game.vikingMap = {};

    game.add.sprite(0, 0, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);

    ground = game.add.sprite(0, 1020, 'ground');
    ground.width = 4329;
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;
    ground.body.gravity.y = 0;

    game.world.setBounds(0, 0, Game.worldWidth, Game.worldHeight, false, false, false, false);

    power = 800;
    powerText = game.add.text(8, 8, 'Power: 800', {font: "18px Arial", fill: "#ffffff"});
    powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
    powerText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(Game.fireProperties, this);

    readyButton = game.add.button(400, 300, 'ready_button', onReadyClick);
    readyButton.scale.setTo(0.5, 0.5);
};

Game.update = function() {
    if (cursors.left.isDown && power > 800) {
        power -= 5;
        Client.turretPower(power / 4);

    } else if (cursors.right.isDown && power < 3000) {
        power += 5;
        Client.turretPower(power / 4);
    }

    if (cursors.up.isDown && angle > -90) {
        let angleToSend = angle--;
        Client.turretAngle(angleToSend);

    } else if (cursors.down.isDown && angle < 0) {
        let angleToSend = angle++;
        Client.turretAngle(angleToSend);
    }

    if (bullet) {
        bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
        if (game.physics.arcade.collide(bullet, target)) {
            Client.playerHit();
        }
        if (game.physics.arcade.collide(bullet, ground)) {
            bullet.body.velocity.x = 0;
        }
    }

    powerText.text = 'Power: ' + power;
};

Game.updateTurretAngle = function(turretAngle, playerId) {
    if (playerId === 0) {
        Game.vikingMap[playerId].children[1].angle = turretAngle;
    } else {
        Game.vikingMap[playerId].children[1].angle = -turretAngle;
    }
};

Game.updateTurretPower = function(turretPower, playerId) {
    if (playerId === 0) {
        Game.vikingMap[playerId].children[1].width = turretPower;
    } else {
        Game.vikingMap[playerId].children[1].width = turretPower;
    }
};

Game.fireProperties = function() {
    Client.sendSpace(power, angle);
};

Game.addNewPlayer = function(id, x, y) {
    let playerGroup = game.add.group(game.world, 'playerGroup');
    let viking;

    if (id === 0) {
        viking = game.add.sprite(x, y, 'brown_viking');
        viking.scale.setTo(-0.5, 0.5);
        turret = game.add.sprite(viking.x + 100, viking.y + 14, 'turret_player_1');
        turret.anchor.x = 0;
        turret.anchor.y = 0;
        // Player health
        let barConfig = {
            x: viking.x + 35,
            y: viking.y - 200,
            width: 150,
            height: 30,
            bg: {
                color: '#E2574C'
            },
            bar: {
                color: '#59FF8A'
            }
        };
        playerOneHealthBar = new HealthBar(game, barConfig);
        playerOneHealthBar.setPercent(playerHealth[0]);
        game.camera.x = x + (viking.width / 2);
    } else if (id === 1) {
        viking = game.add.sprite(x, y, 'red_viking');
        viking.scale.setTo(0.5, 0.5);
        turret = game.add.sprite(viking.x - 100, viking.y + 14, 'turret_player_2');
        turret.anchor.x = 1;
        turret.anchor.y = 0;
        // Player health
        let barConfig = {
            x: viking.x - 35,
            y: viking.y - 200,
            width: 150,
            height: 30,
            bg: {
                color: '#E2574C'
            },
            bar: {
                color: '#59FF8A'
            }
        };
        playerTwoHealthBar = new HealthBar(game, barConfig);
        playerTwoHealthBar.setPercent(playerHealth[1]);

        let playerOneTween = game.add.tween(game.camera).to( { x: 4000 - viking.width / 2 }, 4000, Phaser.Easing.Linear.None);
        let playerTwoTween = game.add.tween(game.camera).to( { x: 100 - viking.width / 2 }, 4000, Phaser.Easing.Linear.None);
        playerOneTween.chain(playerTwoTween);
        playerTwoTween.onComplete.add(allowFire, this);
        playerOneTween.start();
    }

    viking.animations.add('death', [0,1,2,3,4,5,6,7], 10);
    viking.animations.add('shoot', [8,9,10,11,12,13], 10);
    viking.animations.add('idle', [14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38], 10, true);
    viking.animations.play('idle');

    turret.width = power / 4;

    viking.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(viking);

    viking.body.enable = true;
    viking.body.setSize(240, 800, 240, 200);
    viking.body.immovable = true;
    viking.body.gravity.y = 0;

    playerGroup.add(viking);
    playerGroup.add(turret);

    game.camera.y = y;
    Game.vikingMap[id] = playerGroup;
};

function allowFire() {
    fireAllowed = true;
}

Game.setPlayerHealth = function(playerID, health) {
    playerHealth[playerID] = health;
    playerID === 0 ? playerOneHealthBar.setPercent(playerHealth[playerID]) : playerTwoHealthBar.setPercent(playerHealth[playerID]);
};

Game.fireBullet = function(power, angle, player) {
    // && fireAllowed
    if (player.turn && fireAllowed) {
        bullet = game.add.sprite(Game.vikingMap[player.id].children[1].x, Game.vikingMap[player.id].children[1].y, 'arrow');
        bullet.scale.setTo(0.2, 0.2);

        game.physics.arcade.enable(bullet);
        bullet.body.gravity.y = 900;
        bullet.body.bounce.set(0.1);
        bullet.anchor.setTo(0.5, 0.5);

        Game.vikingMap[player.id].children[0].animations.play('shoot').onComplete.add(function() {
            Game.vikingMap[player.id].children[0].animations.play('idle');
        });

        game.camera.follow(bullet);

        let p = new Phaser.Point(turret.x, turret.y);
        p.rotate(p.x, p.y, turret.rotation, false, 34);

        if (player.id === 0) {
            game.physics.arcade.velocityFromRotation(Game.vikingMap[player.id].children[1].rotation, power, bullet.body.velocity);
            target = Game.vikingMap[player.id + 1].children[0];
        } else {
            game.physics.arcade.velocityFromRotation(Game.vikingMap[player.id].children[1].rotation + 3.14159, power, bullet.body.velocity);
            target = Game.vikingMap[player.id - 1].children[0];
        }

        registerTurn();
    }
};

Game.killPlayer = function(playerId) {
    Game.vikingMap[playerId].children[0].animations.stop();
    Game.vikingMap[playerId].children[0].animations.play('death');
    game.state.start('Start');
};

function onReadyClick() {
    readyButton.destroy();
    Client.askNewPlayer();
};

function registerTurn() {
    Client.turnTaken();
    clickable = true;
};

Game.removePlayer = function(id) {
    Game.vikingMap[id].destroy();

    if (id === 0) {
        game.camera.follow(Game.vikingMap[1].children[0]);
    };

    if (id === 1) {
        game.camera.follow(Game.vikingMap[0].children[0]);
    };
};

Game.setConnectionCount = function(connectionState) {
    if (connectionState) {
        gameStarted = true;
    } else if (!connectionState && gameStarted) {
        game.state.start('End');
    }
};