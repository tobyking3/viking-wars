let Game = {
    worldWidth: 4329,
    worldHeight: 1080,
};

let gameStarted = false;
let thisGamesTurn = false;

let playerHealth = {
    0: 100,
    1: 100
};

let clickable = true;
let target = null;

// Turn UI
let turnSprite = null;
let enemiesTurnSprite = null;
let shotsFired = 0;

let turret = null;
let playerOneHealthBar = null;
let playerTwoHealthBar = null;
let bullet = null;
let angle = 0;
let power = 800;

let cursors = null;
let fireButton = null;
let fireAllowed = false;
let whooshSound = undefined;
let deathSound = undefined;

let readyButton;
let ground;

let playerOneTween;
let playerTwoTween;

Game.init = function() {
    game.stage.disableVisibilityChange = true;
};

Game.preload = () => {
    game.load.image('background', 'assets/long_scene.png');
    game.load.image('waiting', 'assets/waiting.png');
    game.load.atlas('brown_viking', 'assets/brown_viking.png', 'assets/brown_viking.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('red_viking', 'assets/red_viking.png', 'assets/red_viking.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('arrow', './assets/arrow.png');
    game.load.image('turn_arrow', './assets/turn_arrow.png');
    game.load.image('enemies_turn', './assets/enemies_turn.png');
    game.load.image('turret_player_1', './assets/turret-player1.png');
    game.load.image('turret_player_2', './assets/turret-player2.png');
    game.load.image('ground', './assets/ground.png');
    game.load.spritesheet('ready_button', 'assets/ready.png', 1000, 365);
    game.load.audio('whoosh', 'assets/whoosh.wav');
    game.load.audio('death', 'assets/death_sound.wav');
    game.load.audio('music', 'assets/viking_wars.mp3');
};

Game.create = () => {
    Game.vikingMap = {};

    game.add.sprite(0, 0, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.camera.x = 0;
    playerOneTween = game.add.tween(game.camera).to( { x: 4000 }, 4000, Phaser.Easing.Linear.None);
    playerTwoTween = game.add.tween(game.camera).to( { x: 0 }, 4000, Phaser.Easing.Linear.None);

    ground = game.add.sprite(0, 1020, 'ground');
    ground.width = 4329;
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;
    ground.body.gravity.y = 0;

    game.world.setBounds(0, 0, Game.worldWidth, Game.worldHeight, false, false, false, false);
    power = 800;

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(Game.fireProperties, this);
    whooshSound = game.add.audio('whoosh');
    deathSound = game.add.audio('death');

    readyButton = game.add.button(400, 300, 'ready_button', onReadyClick);
    readyButton.scale.setTo(0.5, 0.5);
};

Game.update = () => {
    if (cursors.left.isDown) {
        Client.decreaseTurretPower(cursors.left.isDown);
    } else if (cursors.right.isDown) {
        Client.increaseTurretPower(cursors.right.isDown);
    }

    if (Object.keys(Game.vikingMap).length === 2) {
        Client.randomAngle();
        Client.checkGameTurn();
    }

    if (bullet) {
        bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);

        game.physics.arcade.collide(bullet, target, function () {
            if (!bullet.hasCollided) {
                bullet.hasCollided = true;
                bullet.body.moves = false;
                Client.playerHit();
            }
        });

        game.physics.arcade.collide(bullet, ground, function () {
            if (!bullet.hasCollided) {
                bullet.hasCollided = true;
                bullet.body.moves = false;
                Client.groundHit();
            }
        });

        if (bullet.x < 0 || bullet.x > Game.worldWidth) {
            if (!bullet.hasCollided) {
                bullet.hasCollided = true;
                Client.outOfBounds();
            }
        }
    }
};

Game.setCamera = (player) => {
    game.camera.target = null;
    let distanceToPlayer = calculateDistanceToPlayer(player.id);

    if (distanceToPlayer > 200 || distanceToPlayer < -200) {
        game.time.events.add(Phaser.Timer.SECOND, function() {
            if (player.id === 0) {
                let toPlayerTwo = game.add.tween(game.camera).to( { x: 0, y: 280 }, distanceToPlayer, Phaser.Easing.Linear.None, true);
                toPlayerTwo.onComplete.add(() => {
                    turnMessage(player);
                    allowFire();
                });
            }

            if (player.id === 1) {
                let toPlayerOne = game.add.tween(game.camera).to( { x: 4000, y: 280 }, distanceToPlayer, Phaser.Easing.Linear.None, true);
                toPlayerOne.onComplete.add(() => {
                    turnMessage(player);
                    allowFire();
                });
            }
        });
    } else {
        let resetCameraTween = game.add.tween(game.camera).to( {y: 280 }, distanceToPlayer, Phaser.Easing.Linear.None, true);
        resetCameraTween.onComplete.add(() => {
            turnMessage(player);
            allowFire();
        });
    }
};

Game.updateTurretAngle = (player) => {
    angle = player.turretAngle;
    if (player.id === 0) {
        Game.vikingMap[player.id].children[1].angle = angle;
    } else {
        Game.vikingMap[player.id].children[1].angle = -angle;
    }
    firstTurnUI(player);
};

Game.updateTurretPower = (player) => {
    power = player.turretPower;
    if (player.id === 0) {
        Game.vikingMap[player.id].children[1].width = power / 4;
    } else {
        Game.vikingMap[player.id].children[1].width = power / 4;
    }
};

Game.fireProperties = () => {
    Client.sendSpace();
};

Game.addNewPlayer = (id, x, y) => {
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

allowFire = () => fireAllowed = true;

Game.setPlayerHealth = (playerID, health) => {
    playerHealth[playerID] = health;
    playerID === 0 ? playerOneHealthBar.setPercent(playerHealth[playerID]) : playerTwoHealthBar.setPercent(playerHealth[playerID]);
};

Game.fireBullet = (player) => {
    if (player.turn && fireAllowed) {
        shotsFired++;
        fireAllowed = false;
        bullet = game.add.sprite(Game.vikingMap[player.id].children[1].x, Game.vikingMap[player.id].children[1].y, 'arrow');
        bullet.scale.setTo(0.2, 0.2);

        game.physics.arcade.enable(bullet);
        bullet.body.gravity.y = 900;
        bullet.anchor.setTo(0.5, 0.5);

        Game.vikingMap[player.id].children[0].animations.play('shoot').onComplete.add(function() {
            Game.vikingMap[player.id].children[0].animations.play('idle');
        });

        game.camera.follow(bullet);

        let p = new Phaser.Point(turret.x, turret.y);
        p.rotate(p.x, p.y, turret.rotation, false, 34);

        if (player.id === 0) {
            game.physics.arcade.velocityFromRotation(Game.vikingMap[player.id].children[1].rotation, player.turretPower, bullet.body.velocity);
            whooshSound.play();
            target = Game.vikingMap[player.id + 1].children[0];
        } else {
            game.physics.arcade.velocityFromRotation(Game.vikingMap[player.id].children[1].rotation + 3.14159, player.turretPower, bullet.body.velocity);
            whooshSound.play();
            target = Game.vikingMap[player.id - 1].children[0];
        }

        registerTurn();
    }
};

Game.killPlayer = (playerId) => {
    Game.vikingMap[playerId].children[0].animations.stop();
    deathSound.play();
    Game.vikingMap[playerId].children[0].animations.play('death').onComplete.add(() => {
        game.state.start('End');
    });
};

onReadyClick = () => {
    let music = new Phaser.Sound(game,'music', 1, true); music.volume = 0.2; music.play();
    readyButton.destroy();
    Client.askNewPlayer();
};

registerTurn = () => {
    Client.turnTaken();
    clickable = true;
};

Game.outOfBounds = (player) => {
    turnMessage(player);
};

turnMessage = (player) => {
    if (thisGamesTurn) {
        if (enemiesTurnSprite) {
            enemiesTurnSprite.destroy();
            enemiesTurnSprite = null;
        }

        if (!turnSprite) {
            spawnTurnArrow(player);
        }
    } else {
        if (turnSprite) {
            turnSprite.destroy();
            turnSprite = null;
        }

        if (!enemiesTurnSprite) {
            spawnTurnText(player);
        }
    }
};

firstTurnUI = (player) => {
    if (shotsFired === 0) {
        if (thisGamesTurn) {
            if (enemiesTurnSprite) {
                enemiesTurnSprite.destroy();
                enemiesTurnSprite = null;
            }

            if (!turnSprite) {
                spawnTurnArrow(player);
            }
        } else {
            if (turnSprite) {
                turnSprite.destroy();
                turnSprite = null;
            }

            if (!enemiesTurnSprite) {
                spawnTurnText(player);
            }
        }
    }
};

calculateDistanceToPlayer = (id) => Game.vikingMap[id].children[0].x - bullet.body.x;

Game.removePlayer = (id) => {
    Game.vikingMap[id].destroy();

    if (id === 0) {
        game.camera.follow(Game.vikingMap[1].children[0]);
    };

    if (id === 1) {
        game.camera.follow(Game.vikingMap[0].children[0]);
    };
};

spawnTurnArrow = (player) => {
    let turnSpriteX = (player.id === 0) ? Game.vikingMap[player.id].children[0].x : Game.vikingMap[player.id].children[0].x - 75;
    turnSprite = game.add.sprite(turnSpriteX, Game.vikingMap[player.id].children[0].y - 375, 'turn_arrow');
    turnSprite.scale.setTo(0.5, 0.5);
    let turnTween = game.add.tween(turnSprite).to( { y: '-50' }, 500, Phaser.Easing.Linear.None, true).loop(true);
    turnTween.yoyo(true, 100);
};

spawnTurnText = () => {
    enemiesTurnSprite = game.add.sprite(0, 0, 'enemies_turn');
    enemiesTurnSprite.x = game.width / 2 - enemiesTurnSprite.width / 2;
    enemiesTurnSprite.y = game.height / 4 - enemiesTurnSprite.height / 2;
    enemiesTurnSprite.fixedToCamera = true;
    let enemiesTurnTween = game.add.tween(enemiesTurnSprite).to( { alpha: 0.5 }, 500, Phaser.Easing.Linear.None, true).loop(true);
    enemiesTurnTween.yoyo(true, 100);
};

Game.turnUpdate = (turn) => {
    thisGamesTurn = turn;
};

Game.setConnectionCount = (connectionState) => {
    if (connectionState) {
        gameStarted = true;
    } else if (!connectionState && gameStarted) {
        game.state.start('End');
    }
};