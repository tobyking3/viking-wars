let Game = {};

let gameProperties = {
    gameWidth: 4329, 
    gameHeight: 1080,
    in_game: false,
};

let vikings;

let tank = null;
let turret = null;
let bullet = null;

let background = null;
let targets = null;

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

    background = game.add.tileSprite(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, 'background');
    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1000;
    game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
    game.input.onTap.add(Game.getCoordinates, this);


    targets = game.add.group(game.world, 'targets', false, true, Phaser.Physics.ARCADE);
    targets.create(400, 1000, 'house');
    targets.create(500, 1000, 'house');
    targets.create(600, 1000, 'house');
    targets.create(700, 1000, 'house');
    targets.scale.setTo(0.3, 0.3);
    targets.setAll('body.allowGravity', false);

    bullet = game.add.sprite(0, 0, 'bullet');
    bullet.exists = false;

    // const rightViking = game.add.sprite(24, 800, 'brown_viking');

    game.physics.arcade.enable(bullet);
    bullet.body.collideWorldBounds=true;
    bullet.body.bounce.setTo(0.1, 0.5);

    power = 800;
    powerText = game.add.text(8, 8, 'Power: 800', { font: "18px Arial", fill: "#ffffff"});
    powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
    powerText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(fire, this);
    
    Client.askNewPlayer();
};

function fire() {
    if (bullet.exists){return;}
    bullet.reset(turret.x, turret.y);

    let p = new Phaser.Point(turret.x, turret.y);
    p.rotate(p.x, p.y, turret.rotation, false, 34);

    game.camera.follow(bullet);
    game.physics.arcade.velocityFromRotation(turret.rotation, power, bullet.body.velocity);
}

Game.update = function() {
    if (cursors.left.isDown && power > 100) {
        power -= 5;
    }
    else if (cursors.right.isDown && power < 1200) {
        power += 5;
    }

    if (cursors.up.isDown && turret.angle > -90) {
        turret.angle--;
    }
    else if (cursors.down.isDown && turret.angle < 0) {
        turret.angle++;
    }

    powerText.text = 'Power: ' + power;
};

Game.getCoordinates = function(pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
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

Game.movePlayer = function(id, x, y) {
    let player = Game.playerMap[id];
};

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};