var Game = {};

var gameProperties = {
    gameWidth: 4329, 
    gameHeight: 1080,
    in_game: false,
}

var arrow;
var target;
var circle;

var circleWorks;
var spriteWorks;
var radius = 50;
var cX;
var cY;
var theta;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('background', './assets/backgrounds/long_scene_uncropped.png');
    game.load.image('sprite', 'assets/coin.png');

    game.load.image('circle', './assets/circle.png');
    game.load.image('arrow', './assets/arrow.png');
    game.load.image('ball', './assets/pangball.png');

    game.load.image('ballWorks', './assets/pangball.png');

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

    //-----------------------------------------------------
    circle = game.add.sprite(150, 730, 'circle');

    game.physics.arcade.enable(circle);

    circle.anchor.set(0.5);

    circle.body.setCircle(112);
    circle.body.collideWorldBounds = true;
    circle.body.gravity.y = 0;

    arrow = game.add.sprite(200, 850, 'arrow');
    arrow.anchor.setTo(0.1, 0.5);

    target = game.add.sprite(200, 850, 'ball');
    target.anchor.setTo(0.5, 0.5);
    target.inputEnabled = true;
    target.input.enableDrag(true);
    target.input.boundsSprite = circle.body;
    //-----------------------------------------------------

    //--------------------Working Example-----------------------
    //---------------------Working Example-----------------------

    cX = 400
    cY = 800

    circleWorks = game.add.graphics()    
    circleWorks.lineStyle(2,0xFF0000)
    circleWorks.drawCircle(cX,cY,radius*2)
    
    spriteWorks = game.add.sprite(0, 0, 'phaser');
    spriteWorks.anchor.set(0.5)

    //---------------------Working Example-----------------------
    //---------------------Working Example-----------------------
};

Game.update = function(){
    arrow.rotation = game.physics.arcade.angleBetween(arrow, target);

    //---------------------Working Example-----------------------
    //---------------------Working Example-----------------------
    var mouseX = game.input.x;
    var mouseY = game.input.y;
    
    theta = Math.atan2(mouseX-cX, mouseY-cY)
    
    var newX = Math.sin(theta) * radius;
    var newY = Math.cos(theta) * radius;
    
    spriteWorks.x=cX + newX;
    spriteWorks.y=cY + newY;
    //---------------------Working Example-----------------------
    //---------------------Working Example-----------------------
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