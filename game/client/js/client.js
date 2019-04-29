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

Client.groundHit = function() {
    Client.socket.emit('groundHit');
};

Client.randomAngle = function() {
    Client.socket.emit('randomAngle');
};

Client.socket.on('groundHit', function(playerId) {
    Game.setCamera(playerId);
});

Client.turnTaken = function(activePlayerID) {
    Client.socket.emit('turnTaken', activePlayerID);
};

Client.socket.on('newPlayer',function(data) {
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.decreaseTurretAngle = function(decrease) {
    Client.socket.emit('decreaseTurretAngle', decrease);
};

Client.increaseTurretAngle = function(increase) {
    Client.socket.emit('increaseTurretAngle', increase);
};

Client.decreaseTurretPower = function(decrease) {
    Client.socket.emit('decreaseTurretPower', decrease);
};

Client.increaseTurretPower = function(increase) {
    Client.socket.emit('increaseTurretPower', increase);
};

Client.socket.on('healthChange', function(id, health) {
    Game.setPlayerHealth(id, health);
    Game.setCamera(id);
});

Client.socket.on('playerDied', function(playerId) {
    Game.killPlayer(playerId);
});

Client.socket.on('updateTurretAngle', function(player) {
    Game.updateTurretAngle(player);
});

Client.socket.on('updateTurretPower', function(player) {
    Game.updateTurretPower(player);
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


