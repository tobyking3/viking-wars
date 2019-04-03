var Game = {};

var gameProperties = {
    gameWidth: 4329, 
    gameHeight: 1080,
    in_game: false,
}

var circle
var spriteGroup
var sprite
var hitZone
var radius = 150
var cX
var cY
var theta 

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('background', './assets/backgrounds/long_scene_uncropped.png');
    game.load.image('sprite', 'assets/coin.png');

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

    cX = 400
    cY = 800

    circle = game.add.graphics()    
    circle.lineStyle(2,0xFF0000)
    circle.drawCircle(cX,cY,radius*2)
    
    spriteGroup = game.add.group()
    
    sprite = game.add.sprite(0, 0, 'phaser');
    sprite.anchor.set(0.5)
    
    hitZone = game.add.sprite(0,0)
    hitZone.anchor.set(0.5)
    hitZone.inputEnabled=true
    hitZone.input.useHandCursor=true
    
    spriteGroup.add(hitZone)
    spriteGroup.add(sprite)

    var g = game.add.graphics(0,0)
    g.beginFill(0xFF0000,0.5)
    g.drawCircle(0,0,100)
    g.endFill();
    
    hitZone.addChild(g)

    this.game.input.mouse.mouseMoveCallback = onMouseMove;
   
    moveSpriteOnCircle(cX,0)

};

function onMouseMove(e) {
   console.log("move", hitZone.input.pointerDown())
   if(hitZone.input.pointerDown() && hitZone.input.pointerOver()) {
       moveSpriteOnCircle(e.x,e.y)
   }

}

function moveSpriteOnCircle(x,y) {
    
    theta = Math.atan2(x-cX, y-cY)
    
    var newX = Math.sin(theta) * radius;
    var newY = Math.cos(theta) * radius;
    
    spriteGroup.x=cX + newX;
    spriteGroup.y=cY + newY;
}

Game.getCoordinates = function(pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    //uses Phaser’s graphics to draw a circle
    player = game.add.graphics(x, y);
    player.radius = 50;

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

    game.camera.follow(player);

    if(id === 0){
        player.body.velocity.x = 1000;
        player.body.velocity.y = -1000;
    } else {
        player.body.velocity.x = -1000;
        player.body.velocity.y = -1000;
    }
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};