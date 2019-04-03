var Game = {};

var gameProperties = {
    gameWidth: 4329, 
    gameHeight: 1080,
    in_game: false,
}

var sprite
var radius = 150
var cX
var cY
var angle = 0
var speed=1
var fireAngle=0

var leftKey, rightKey

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('background', './assets/backgrounds/long_scene_uncropped.png');
    game.load.image('ball', './assets/pangball.png');

    game.load.image('circle', './assets/circle.png');
    game.load.image('arrow', './assets/arrow.png');
    game.load.image('ball', './assets/pangball.png');

};

Game.create = function(){

    this.mountainsBack = this.game.add.tileSprite(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, 'background');

    Game.playerMap = {};

    //scale manager resizes the canvas to fill the viewport
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
    
    game.input.onTap.add(Game.getCoordinates, this);
    
    Client.askNewPlayer();

    //---------------------------------------------------------------------------------------------

    game.forceSingleUpdate=true

    cX = 400
    cY = 800

    circle = game.add.graphics()    
    circle.lineStyle(2,0xFF0000)
    circle.drawCircle(cX,cY,radius*2)
    
    sprite = game.add.sprite(0, 0, 'ball');
    sprite.anchor.set(0.5)
    
    // give it an initial position
   moveSpriteOnCircle(angle)
   
   leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
   rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
   spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

};

Game.update = function(){

    var moved=false

    if(spaceKey.isDown) {
        fireAngle = angle
    }

    if(leftKey.isDown && angle < 0) {
        angle+=speed
        moved=true
    }
    
    if(rightKey.isDown  && angle > -90) {
        angle-=speed
        moved=true
    }
    
    if(angle>=360) 
    {
        angle=360-angle
    }
    
    if(moved) {
        moveSpriteOnCircle(angle)
    }
}

function moveSpriteOnCircle(deg) {
    if(deg >= -90 && deg <= 0){
        var p = new Phaser.Point(cX, cY)
        p.rotate(cX, cY, 270-deg, true, radius) 
        sprite.x = p.x
        sprite.y = p.y
        sprite.angle=0-deg
    }
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
    player.body.gravity.y = 1000;

    Game.playerMap[id] = player;
    game.camera.follow(player);
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];

    console.log(angle);
    fireX = -angle * 20;
    fireY = (angle + 90) * 40;

    console.log(fireX);

    game.camera.follow(player);

    if(id === 0){
        player.body.velocity.x = 400 + fireX;
        player.body.velocity.y = -fireY;
    } else {
        player.body.velocity.x = 400 + fireX;
        player.body.velocity.y = -fireY;
    }
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};