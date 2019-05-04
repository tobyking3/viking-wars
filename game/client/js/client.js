let Client = {};
Client.socket = io('http://localhost:55000');

Client.socket.on('connectionChange', (connectionState) => {
    Boot.setConnectionCount(connectionState);
    Game.setConnectionCount(connectionState);
});

Client.askNewPlayer = () => {
    Client.socket.emit('newPlayer');
};

Client.playerHit = () => {
    Client.socket.emit('playerHit');
};

Client.groundHit = () => {
    Client.socket.emit('groundHit');
};

Client.randomAngle = () => {
    Client.socket.emit('randomAngle');
};

Client.socket.on('groundHit', (playerId) => {
    Game.setCamera(playerId);
});

Client.turnTaken = () => {
    Client.socket.emit('turnTaken');
};

Client.socket.on('turnUpdated', (player) => {
    Game.turnUpdated(player);
});

Client.socket.on('newPlayer', (data) => {
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.decreaseTurretPower = (decrease) => {
    Client.socket.emit('decreaseTurretPower', decrease);
};

Client.increaseTurretPower = (increase) => {
    Client.socket.emit('increaseTurretPower', increase);
};

Client.socket.on('healthChange', (id, health) => {
    Game.setPlayerHealth(id, health);
    Game.setCamera(id);
});

Client.socket.on('playerDied', (playerId) => {
    Game.killPlayer(playerId);
});

Client.socket.on('updateTurretAngle', (player) => {
    Game.updateTurretAngle(player);
});

Client.socket.on('updateTurretPower', (player) => {
    Game.updateTurretPower(player);
});

Client.sendSpace = () => {
    Client.socket.emit('space');
};

Client.socket.on('fire', (player) => {
    Game.fireBullet(player);
});

Client.socket.on('allPlayers', (data) => {

    for (let i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('remove', (id) => {
        Game.removePlayer(id);
    });
});


