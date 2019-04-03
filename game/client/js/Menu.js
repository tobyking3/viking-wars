VikingWars.Menu = function () {
};

VikingWars.Menu.prototype = {

    create: function () {
        // This button will cause the 'join_game' event to be emitted.
        this.add.button(150, 80, 'btn-join-game', this.joinGamePressed, this);
    },

    joinGamePressed: function () {
        Client.askNewPlayer();
        console.log(Client.askNewPlayer());
    }
};