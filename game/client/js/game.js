let Game = {
    width: 4329, 
    height: 1080,
};

let clickable = true;

let turret = null;
let fakeAngle = 0;
let power = 300;
let powerText = null;

let cursors = null;
let fireButton = null;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('sprite', 'assets/coin.png');
    game.load.atlas('brown_viking', 'assets/brown_idle.png', 'assets/brown_idle.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('red_viking', 'assets/red_idle.png', 'assets/red_idle.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('turret', './assets/viking-archer/body_parts_spriter_file/arrow.png');
};

Game.create = function() {
    Game.playerMap = {};
    Game.vikingMap = {};
    game.input.onDown.add(Game.getCoordinates, this);

    power = 800;
    powerText = game.add.text(8, 8, 'Power: 800', { font: "18px Arial", fill: "#ffffff"});
    powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
    powerText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(Game.fireProperties, this);

    Client.askNewPlayer();
};

Game.update = function() {
    if (cursors.left.isDown && power > 100) {
        power -= 5;

    } else if (cursors.right.isDown && power < 1200) {
        power += 5;
    }

    if (cursors.up.isDown && fakeAngle > -90) {
        let angleToSend = fakeAngle--;
        Client.turretAngle(angleToSend);

    } else if (cursors.down.isDown && fakeAngle < 0) {
        let angleToSend = fakeAngle++;
        Client.turretAngle(angleToSend);
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

Game.fireProperties = function() {
    Client.sendSpace(power, angle);
};

Game.getCoordinates = function(pointer) {
    if (clickable) {
        Client.sendClick(pointer.worldX,pointer.worldY);
    }
};

Game.addNewPlayer = function(id, x, y) {
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
    let playerGroup = game.add.group(game.world, 'playerGroup');
    let viking;

    if (id === 0) {
        viking = game.add.sprite(x, y, 'brown_viking');
        viking.scale.setTo(-0.5, 0.5);
        turret = game.add.sprite(viking.x + 100, viking.y + 14, 'turret');
        turret.anchor.x = 0;
        turret.anchor.y = 0;
    } else if (id === 1) {
        viking = game.add.sprite(x, y, 'red_viking');
        viking.scale.setTo(0.5, 0.5);
        turret = game.add.sprite(viking.x - 100, viking.y + 14, 'turret');
        turret.anchor.x = 1;
        turret.anchor.y = 0;
    }

    turret.scale.setTo(0.25, 0.25);       
    viking.anchor.setTo(0.5,0.5);
    viking.animations.add('idle');
    viking.animations.play('idle', 10, true);

    playerGroup.add(viking);
    playerGroup.add(turret);
    game.camera.follow(viking);

    Game.vikingMap[id] = playerGroup;
};

Game.movePlayer = function(id, x, y, turn){
    if (turn) {
        clickable = false;
        let player = Game.playerMap[id];
        let distance = Phaser.Math.distance(player.x, player.y, x, y);
        let tween = game.add.tween(player);
        let duration = distance*10;
        tween.to({x: x, y: y}, duration);
        tween.start();

        this.id = id;
        tween.onComplete.add(registerTurn, this);
    }
};

function registerTurn(that) {
    Client.turnTaken(that.id);
    clickable = true;
}

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};