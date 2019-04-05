const PORT = 55000;

// Make a new HTTP server
var server = require('http').createServer();

//Socket takes in the HTTP server created above, and adds it's own
//layer on top of it for ease of use. 'io' is the Socket.io server object. You could call it
// 'socketIOServer' or something similar if you wish, but all of the documentation for Socket.io uses just 'io'.
let io = require('socket.io')(server);

// Use to manage the players in the game
let players = {};
let activePlayer = 0;

io.on('connection', function(socket) {

    socket.on('newplayer',function() {

        let playerId = server.lastPlayerID++;

        socket.player = {
            id: playerId,
            x: playerId === 0 ? 200 : 780,
            y: 450,
            health: 100,
            turn: playerId === 0 ? true : false
        };

        socket.emit('allplayers', getAllPlayers());

        socket.broadcast.emit('newplayer', socket.player);

        socket.on('click', function(data) {
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('disconnect', function() {
            socket.lastPlayerID--;
            io.emit('remove', socket.player.id);
        });

    });

    socket.on('space', function(data) {
        io.emit('fire', data.power, data.angle, socket.player);
    });

    socket.on('turntaken', function() {
        socket.player.turn = !socket.player.turn;
    });

    socket.on('playerhit', function() {
        if (socket.player.turn) {
            if (socket.player.health > 20) {
                socket.player.health -= 20;
                console.log(socket.player.health);
            } else {
                console.log('Player dead', socket.player.id);
            }
        }
    });

    socket.on('turretangle', function(turretAngle) {
        io.emit('updateturretangle', turretAngle, socket.player);
    });
    
});


server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});

server.lastPlayerID = 0;

function getAllPlayers(){
    let players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        let player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });

    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

