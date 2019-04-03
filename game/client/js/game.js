var Game = {};

var gameProperties = {
    gameWidth: 4329, 
    gameHeight: 1080,
    in_game: false,
}

var tank = null;
var turret = null;
var flame = null;
var bullet = null;

var background = null;
var targets = null;

var power = 300;
var powerText = null;

var cursors = null;
var fireButton = null;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('background', './assets/backgrounds/long_scene_uncropped.png');
    game.load.image('ball', './assets/pangball.png');
    game.load.image('circle', './assets/circle.png');
    game.load.image('arrow', './assets/arrow.png');
    game.load.image('bullet', './assets/coin.png');
    game.load.image('tank', './assets/tank.png');
    game.load.image('turret', './assets/turret.png');

};

Game.create = function(){
    Game.playerMap = {};

    background = game.add.tileSprite(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, 'background');
    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.gravity.y = 1000;

    game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
    
    game.input.onTap.add(Game.getCoordinates, this);

    //--------------------------------------------------------------------------------------------------------

    targets = game.add.group(game.world, 'targets', false, true, Phaser.Physics.ARCADE);

    targets.create(400, 800, 'ball');
    targets.create(500, 800, 'ball');
    targets.create(600, 800, 'ball');
    targets.create(700, 800, 'ball');

    targets.setAll('body.allowGravity', false);

    bullet = game.add.sprite(0, 0, 'bullet');

    bullet.exists = false;

    tank = game.add.sprite(24, 800, 'tank');

    turret = game.add.sprite(tank.x + 100, tank.y + 14, 'turret');

    game.physics.arcade.enable(bullet);
    bullet.body.collideWorldBounds=true;
    bullet.body.bounce.setTo(0.1, 0.5);

    power = 800;
    powerText = game.add.text(8, 8, 'Power: 800', { font: "18px Arial", fill: "#ffffff" });
    powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
    powerText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(fire, this);

    //--------------------------------------------------------------------------------------------------------
    
    Client.askNewPlayer();

};

function fire() {
    if (bullet.exists){return;}

    bullet.reset(turret.x, turret.y);

    var p = new Phaser.Point(turret.x, turret.y);

    p.rotate(p.x, p.y, turret.rotation, false, 34);

    game.camera.follow(bullet);

    game.physics.arcade.velocityFromRotation(turret.rotation, power, bullet.body.velocity);
}

Game.update = function() {
        if (cursors.left.isDown && power > 100){
            power -= 5;
        }
        else if (cursors.right.isDown && power < 1200){
            power += 5;
        }

        if (cursors.up.isDown && turret.angle > -90){
            turret.angle--;
        }
        else if (cursors.down.isDown && turret.angle < 0){
            turret.angle++;
        }

        powerText.text = 'Power: ' + power;
}


Game.getCoordinates = function(pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    //uses Phaser’s graphics to draw a circle
    player = game.add.graphics(x, y);
    player.radius = 30;

    if(id === 0){
        player.beginFill(0x0000ff);
        player.lineStyle(2, 0x0000ff, 1);
    } else {
        player.beginFill(0xff0000);
        player.lineStyle(2, 0xff0000, 1);
    }

    player.drawCircle(0, 0, player.radius * 2);
    player.endFill();
    player.anchor.setTo(0.5,0.5);
    player.body_size = player.radius;

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds=true;
    player.body.bounce.setTo(0.1, 0.5);

    Game.playerMap[id] = player;
    game.camera.follow(player);
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];

    if(id === 0){
        player.body.velocity.x = 1000;
        player.body.velocity.y = -1000;
    } else {
        player.body.velocity.x = 1000;
        player.body.velocity.y = -1000;
    }
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};