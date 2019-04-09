let Client = {};
Client.socket = io('http://localhost:55000');

Client.socket.on('connection_change', function(connectionState){
    Boot.setConnectionCount(connectionState);
    Game.setConnectionCount(connectionState);
});

Client.askNewPlayer = function() {
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x, y) {
    Client.socket.emit('click', {x: x, y: y});
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

Client.turretPower = function(turretPower) {
  Client.socket.emit('turretpower', turretPower);
};

Client.socket.on('playerdied', function(playerId) {
    console.log('Kill the player!');
    Game.killPlayer(playerId);
});

Client.socket.on('updateturretangle', function(turretAngle, player) {
    Game.updateTurretAngle(turretAngle, player.id);
});

Client.socket.on('updateturretpower', function(turretPower, player) {
    Game.updateTurretPower(turretPower, player.id);
});

Client.sendSpace = function(power, angle) {
    console.log('sendSpace');
    Client.socket.emit('space', {power: power, angle: angle});
};

Client.socket.on('fire', function(power, angle, player) {
    Game.fireBullet(power, angle, player);
});

Client.socket.on('allplayers',function(data) {
    for (let i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('remove', function(id) {
        Game.removePlayer(id);
    });
});


