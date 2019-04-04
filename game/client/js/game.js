let Game = {};

let gameProperties = {
    gameWidth: 4329, 
    gameHeight: 1080,
    in_game: false,
};

let vikings;

let tank = null;
let turret = null;

let background = null;
let targets = null;

let angle = 0;
let power = 300;
let powerText = null;

let cursors = null;
let fireButton = null;

let viking = null;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('background', './assets/backgrounds/long_scene_uncropped.png');
    game.load.image('turret', './assets/turret.png');
    game.load.image('house', './assets/viking-houses/pngs/large_house_complete.png');
    game.load.atlas('brown_viking', 'assets/brown_idle.png', 'assets/brown_idle.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas('red_viking', 'assets/red_idle.png', 'assets/red_idle.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('bullet', './assets/coin.png');
};

Game.create = function(){
    Game.playerMap = {};
    Game.bulletMap = {};

    background = game.add.tileSprite(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, 'background');
    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1000;
    game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);

    targets = game.add.group(game.world, 'targets', false, true, Phaser.Physics.ARCADE);
    targets.create(400, 1000, 'house');
    targets.create(500, 1000, 'house');
    targets.create(600, 1000, 'house');
    targets.create(700, 1000, 'house');
    targets.scale.setTo(0.3, 0.3);
    targets.setAll('body.allowGravity', false);

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
    }
    else if (cursors.right.isDown && power < 1200) {
        power += 5;
    }

    if (cursors.up.isDown && turret.angle > -90) {
        angle = turret.angle--;
    }
    else if (cursors.down.isDown && turret.angle < 0) {
        angle = turret.angle++;
    }

    powerText.text = 'Power: ' + power;
};

Game.fireProperties = function(space) {
    console.log('fireProperties');
    Client.sendSpace(power, angle);
};

Game.addNewPlayer = function(id,x,y){

    let vikingGroup = game.add.group(game.world, 'vikingGroup');
    let viking;

    if (id === 0) {
        viking = game.add.sprite(x, y, 'brown_viking');
        viking.scale.setTo(-0.5, 0.5);
        turret = game.add.sprite(viking.x + 100, viking.y + 14, 'turret');
        turret.anchor.x = 0;
        turret.anchor.y = 0;
    } else if (id === 1) {
        viking = game.add.sprite(x, y, 'brown_viking');
        viking.scale.setTo(0.5, 0.5);
        turret = game.add.sprite(viking.x - 100, viking.y + 14, 'turret');
        turret.anchor.x = 1;
        turret.anchor.y = 0;
    }

    viking.anchor.setTo(0.5,0.5);
    viking.animations.add('idle');
    viking.animations.play('idle', 10, true);

    vikingGroup.add(viking);
    vikingGroup.add(turret);

    game.camera.follow(viking);

    Game.playerMap[id] = vikingGroup;
};


Game.fireBullet = function(activeId, activePower, activeAngle) {

    console.log(activePower);

    let bullet = game.add.sprite(turret.x, turret.y, 'bullet');

    game.physics.arcade.enable(bullet);
    bullet.body.collideWorldBounds=true;
    bullet.body.bounce.setTo(0.1, 0.5);

    Game.bulletMap[activeId] = bullet;

    let p = new Phaser.Point(turret.x, turret.y);
    p.rotate(p.x, p.y, turret.rotation, false, 34);

    game.camera.follow(bullet);
    game.physics.arcade.velocityFromRotation(turret.rotation, activePower, bullet.body.velocity);

    console.log(turret.rotation);
};

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};