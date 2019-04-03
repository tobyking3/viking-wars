//Client.askNewPlayer();

socket.on('join_game_success', function () {
    _this.state.start("Game");
});


VikingWars = {};

VikingWars.Boot = function () {
};

VikingWars.Boot.prototype = {

    create: function () {
        _this = this;
        this.state.start('Preload');
    },

    events: (function () {
        socket.on('disconnect', function () {
            console.log("The server disconnected.")
        });
    })()
};