let Client = {};
Client.socket = io('http://localhost:55000');

Client.askNewPlayer = function() {
    Client.socket.emit('clientNewPlayer');
};

Client.sendClick = function(x,y) {
  Client.socket.emit('click',{x: x, y: y});
};

Client.socket.on('serverNewPlayer', function(data) {
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('allplayers', function(data) {
    for (let i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move', function(data) {
        Game.movePlayer(data.id, data.x, data.y);
    });

    Client.socket.on('remove', function(id) {
        Game.removePlayer(id);
    });
});


