let Client = {};
Client.socket = io('http://localhost:55000');

Client.askNewPlayer = function() {
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x, y) {
  Client.socket.emit('click',{x: x, y: y});
};

Client.playerHit = function() {
    Client.socket.emit('playerhit');
};

Client.turnTaken = function(activePlayerID) {
  Client.socket.emit('turntaken', activePlayerID);
};

Client.socket.on('newplayer',function(data) {
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.turretAngle = function(turretAngle) {
  Client.socket.emit('turretangle', turretAngle);
};

Client.socket.on('updateturretangle', function(turretAngle, player) {
    Game.updateTurretAngle(turretAngle, player.id);
});

Client.sendSpace = function(power, angle) {
    Client.socket.emit('space', {power: power, angle: angle});
};

Client.socket.on('fire', function(power, angle, player) {
    Game.fireBullet(power, angle, player);
});

Client.socket.on('allplayers',function(data) {
    for (let i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data) {
        Game.movePlayer(data.id,data.x,data.y,data.turn);
    });

    Client.socket.on('remove',function(id) {
        Game.removePlayer(id);
    });
});


