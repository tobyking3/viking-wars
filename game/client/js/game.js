let Game = {
    worldWidth: 4329,
    worldHeight: 1080,
};

let clickable = true;
let target = null;

let turret = null;
let bullet = null;
let fakeAngle = 0;
let power = 800;
let powerText = null;

let cursors = null;
let fireButton = null;

let fireAllowed = false;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('background', 'assets/backgrounds/long_scene.png');
    game.load.atlas('brown_viking', 'assets/brown_viking.png', 'assets/brown_viking.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('red_viking', 'assets/red_viking.png', 'assets/red_viking.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('arrow', './assets/left_arrow.png');
    game.load.image('turret_player_1', './assets/turret-player1.png');
    game.load.image('turret_player_2', './assets/turret-player2.png');
};

Game.create = function() {
    Game.playerMap = {};
    Game.vikingMap = {};

    game.add.sprite(0, 0, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, Game.worldWidth, Game.worldHeight, false, false, false, false);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    power = 800;
    powerText = game.add.text(8, 8, 'Power: 800', {font: "18px Arial", fill: "#ffffff"});
    powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
    powerText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(Game.fireProperties, this);

    Client.askNewPlayer();
};

Game.update = function() {
    if (cursors.left.isDown && power > 800) {
        power -= 5;
        Client.turretPower(power / 3);

    } else if (cursors.right.isDown && power < 2200) {
        power += 5;
        Client.turretPower(power / 3);
    }

    if (cursors.up.isDown && fakeAngle > -90) {
        let angleToSend = fakeAngle--;
        Client.turretAngle(angleToSend);

    } else if (cursors.down.isDown && fakeAngle < 0) {
        let angleToSend = fakeAngle++;
        Client.turretAngle(angleToSend);
    }

    if (bullet) {
        bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
        if (game.physics.arcade.collide(bullet, target)) {
            Client.playerHit();
        }
    }

    // if(bullet.body.touching.down){
    //     bullet.body.velocity.x = 0;
    // }

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
    Client.sendSpace(power, fakeAngle);
};

Game.getCoordinates = function(pointer) {
    if (clickable) {
        Client.sendClick(pointer.worldX, pointer.worldY);
    }
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
        game.camera.x = x + (viking.width / 2);
    } else if (id === 1) {
        viking = game.add.sprite(x, y, 'red_viking');
        viking.scale.setTo(0.5, 0.5);
        turret = game.add.sprite(viking.x - 100, viking.y + 14, 'turret_player_2');
        turret.anchor.x = 1;
        turret.anchor.y = 0;

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

    turret.width = power / 3;

    viking.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(viking);
    viking.body.setSize(303, 167, 0, 0);
    viking.body.immovable = true;
    viking.body.gravity.y = 0;

    playerGroup.add(viking);
    playerGroup.add(turret);

    game.camera.y = y;

    Game.vikingMap[id] = playerGroup;
};

function allowFire() {
    console.log("allow fire called");
    fireAllowed = true;
}

Game.fireBullet = function(power, angle, player) {
    if (player.turn && fireAllowed) {
        console.log("SHOTS FIRED");
        bullet = game.add.sprite(Game.vikingMap[player.id].children[1].x, Game.vikingMap[player.id].children[1].y, 'arrow');
        bullet.scale.setTo(0.2, 0.2);
        game.physics.arcade.enable(bullet);
        bullet.body.collideWorldBounds = true;
        bullet.body.gravity.y = 900;

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
};

function registerTurn() {
    Client.turnTaken();
    clickable = true;
}

Game.removePlayer = function(id) {
    // Game.playerMap[id].destroy();
    // delete Game.playerMap[id];
};