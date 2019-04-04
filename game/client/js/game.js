var Game = {};
var clickable = true;



Game.init = function(){
    game.stage.disableVisibilityChange = true;
};




Game.preload = function() {
    game.load.image('sprite', 'assets/coin.png');
};




Game.create = function(){
    Game.playerMap = {};
    game.input.onDown.add(Game.getCoordinates, this);

    Client.askNewPlayer();
};




Game.getCoordinates = function(pointer){
    if(clickable){
        Client.sendClick(pointer.worldX,pointer.worldY);
    }
};




Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};




Game.movePlayer = function(id,x,y,turn){
    if(turn){
        clickable = false;
        var player = Game.playerMap[id];
        var distance = Phaser.Math.distance(player.x,player.y,x,y);
        var tween = game.add.tween(player);
        var duration = distance*10;
        tween.to({x:x,y:y}, duration);
        tween.start();

        this.id = id;

        tween.onComplete.add(registerTurn, this);
    }
};


function registerTurn(that) {
    Client.turnTaken(that.id);
    clickable = true;
}



Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};