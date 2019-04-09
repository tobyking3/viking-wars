const PORT = 55000;
// Make a new HTTP server
let server = require('http').createServer();

// client takes in the HTTP server created above, and adds it's own
// layer on top of it for ease of use. 'io' is the client.io server object. You could call it
// 'clientIOServer' or something similar if you wish, but all of the documentation for client.io uses just 'io'.
let io = require('socket.io')(server);

// Lobby class
let Game = require('./game.js');
// Players
let players = {};

main();

function main() {
    let game = new Game(io);

    if (game.checkSlotAvailable()) {
        io.on('connection', function(client) {
            client.on('newplayer', function() {

                let playerID = server.lastPlayerID++;
                game.addPlayer(client, playerID);
                client.emit('allplayers', game.getAllPlayers(io));

                client.on('click', function(data) {
                    client.player.x = data.x;
                    client.player.y = data.y;
                    io.emit('move', client.player);
                });

                client.on('disconnect', function(client, io) {
                    client.lastPlayerID--;
                    game.disconnect();
                });
            });

            client.on('space', function(data) {
                io.emit('fire', data.power, data.angle, client.player);
            });

            client.on('turntaken', function() {
                client.player.turn = !client.player.turn;
            });

            client.on('playerhit', function() {
                if (client.player.turn) {
                    if (client.player.health > 20) {
                        client.player.health -= 20;
                    } else {
                        io.emit('playerdied', client.player.id);
                    }
                }
            });

            client.on('turretangle', function(turretAngle) {
                io.emit('updateturretangle', turretAngle, client.player);
            });

            client.on('turretpower', function(turretPower) {
                io.emit('updateturretpower', turretPower, client.player);
            });
        });
    } else {
        console.log('NOT AVAILABLE');
    }
}

server.lastPlayerID = 0;

server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});