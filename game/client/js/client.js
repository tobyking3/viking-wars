let Client = {};
Client.socket = io('http://localhost:55000');

Client.socket.on('connectionChange', function(connectionState){
    Boot.setConnectionCount(connectionState);
    Game.setConnectionCount(connectionState);
});

Client.askNewPlayer = function() {
    Client.socket.emit('newPlayer');
};

Client.playerHit = function() {
    Client.socket.emit('playerHit');
};

Client.turnTaken = function(activePlayerID) {
  Client.socket.emit('turnTaken', activePlayerID);
};

Client.socket.on('newPlayer',function(data) {
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.turretAngle = function(turretAngle) {
  Client.socket.emit('turretAngle', turretAngle);
};

Client.turretPower = function(turretPower) {
  Client.socket.emit('turretPower', turretPower);
};

Client.socket.on('healthChange', function(id, health) {
    console.log('healthChange', id, health);
    Game.setPlayerHealth(id, health);
});

Client.socket.on('playerDied', function(playerId) {
    Game.killPlayer(playerId);
});

Client.socket.on('updateTurretAngle', function(turretAngle, player) {
    Game.updateTurretAngle(turretAngle, player.id);
});

Client.socket.on('updateTurretPower', function(turretPower, player) {
    Game.updateTurretPower(turretPower, player.id);
});

Client.sendSpace = function(power, angle) {
    Client.socket.emit('space', {power: power, angle: angle});
};

Client.socket.on('fire', function(power, angle, player) {
    Game.fireBullet(power, angle, player);
});

Client.socket.on('allPlayers',function(data) {
    for (let i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('remove', function(id) {
        Game.removePlayer(id);
    });
});


