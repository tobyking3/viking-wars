let Client = {};
Client.socket = io('http://localhost:55000');

Client.askNewPlayer = function() {
    Client.socket.emit('clientNewPlayer');
};

Client.sendSpace = function(power, angle) {
  Client.socket.emit('space', {power: power, angle: angle});
};

Client.socket.on('serverNewPlayer', function(data) {
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('allplayers', function(data) {
    for (let i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('fire', function(data) {
        console.log('fire', data);
        Game.fireBullet(data.id, data.power, data.angle);
    });

    Client.socket.on('remove', function(id) {
        Game.removePlayer(id);
    });
});


