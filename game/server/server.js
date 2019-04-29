const PORT = 55000;
// Make a new HTTP server
let server = require('http').createServer();

// Client takes in the HTTP server created above, and adds it's own
// layer on top of it for ease of use. 'io' is the client.io server object. You could call it
// 'clientIOServer' or something similar if you wish, but all of the documentation for client.io uses just 'io'.
let io = require('socket.io')(server);

// Lobby class
let Player = require('./player.js');
// Player functions
let GameEvent = require('./gameEvents.js');

// Count for connected player
let connectionCounter = 0;

io.on('connection', function(client) {
    connectionCounter++;
    client.emit('connectionChange', checkConnectionState());
    client.broadcast.emit('connectionChange', checkConnectionState());

    client.on('disconnect', function() {
        connectionCounter--;
        client.lastPlayerID--;
        client.emit('connectionChange', checkConnectionState());
        client.broadcast.emit('connectionChange', checkConnectionState());
    });

    client.on('newPlayer', function() {
        let playerID = server.lastPlayerID++;
        Player.addPlayer(client, playerID);
        client.emit('allPlayers', Player.getAllPlayers(io));
    });

    client.on('space', function(data) {
        GameEvent.fire(io, data, client);
    });

    client.on('turnTaken', function() {
        GameEvent.turnTaken(client);
    });

    client.on('playerHit', function() {
        GameEvent.hit(io, client);
    });

    client.on('groundHit', function() {
        GameEvent.groundHit(io, client);
    });

    client.on('turretAngle', function(turretAngle) {
        GameEvent.updateTurretAngle(io, turretAngle, client);
    });

    client.on('turretPower', function(turretPower) {
        GameEvent.updateTurretPower(io, turretPower, client);
    });
});

function checkConnectionState() {
    return connectionCounter === 2 ? true : false;
};

server.lastPlayerID = 0;

server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});