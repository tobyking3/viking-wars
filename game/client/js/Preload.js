VikingWars.Preload = function () {
};

VikingWars.Preload.prototype = {

    preload: function () {
        this.load.image("btn-join-game", 'assets/btn-join-game.png');
        this.load.image('sprite', 'assets/coin.png');
    },

    create: function () {
        this.state.start("Menu");
    }
};