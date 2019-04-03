const PORT = 55000;

var gameProperties = {
    gameWidth: 4329, 
    gameHeight: 1080,
}

// Make a new HTTP server
var server = require('http').createServer();

//Socket takes in the HTTP server created above, and adds it's own
//layer on top of it for ease of use. 'io' is the Socket.io server object. You could call it
// 'socketIOServer' or something similar if you wish, but all of the documentation for Socket.io uses just 'io'.
var io = require('socket.io')(server);

//Use to manage the players in the game
var players = {};

/*
 *  socket.on('event_name', function(optionalData){ ... );  - Adds an event listener to this socket.
 *  io.emit('event_name', optionalData);                    - Sends an event to all sockets.
 *  socket.emit('event_name', optionalData);                - Sends an event to this socket.
 *  socket.broadcast.emit('event_name', optionalData);      - Sends an event to all sockets except this one.
 *  io.in('room-name').emit('event_name', optionalData);    - Sends an event to all sockets that are in the specified room.
 *  socket.join('room-name');                               - Adds a socket to a room.
 *  socket.leave('room-name');                              - Removes a socket from a room.
*/

// A 'socket' it just an object that manages a client's connection to the server. For each client that connects to
// this server, they will get their own socket object. These socket objects are stored internally on the io object,
// and can be accessed manually with 'io.sockets' to get a list of the connected sockets, but you shouldn't really need to.

// The first time a connection is made with a new socket (a client), the 'connection' event is triggered
// on io (the Socket.io server object), and it runs the 'connection' callback function (the 'function(socket){ ... }' part).
// The socket object for the client that connected is sent to the callback, and this allows us to do stuff with that
// socket, such as adding event listeners to that socket, which is what is done below.
// The socket object is passed in automatically by io when a connection is made.

io.on('connection', function(socket) {

    console.log(getAllPlayers().length);

    console.log("Connect made and socket ID is: " + socket.id);

    //add to socket object
    socket.username = 'DEFAULT NAME';
    socket.score = 0;
    socket.isInGame = false;

    // Using the socket object that was passed in, events can be sent to the client that socket belongs to using .emit(...)
    
    if(getAllPlayers().length <= 1){

        socket.on('newplayer',function() {
            console.log(socket.score);
            console.log(socket.isInGame);

            if(socket.isInGame === false){
                socket.isInGame = true;

                socket.player = {
                    id: server.lastPlayerID++,
                    x: getAllPlayers().length == 0 ? 100 : gameProperties.gameWidth - 100,
                    y: gameProperties.gameHeight - 100
                };

                socket.emit('allplayers',getAllPlayers());

                socket.broadcast.emit('newplayer',socket.player);

                socket.on('click',function(data) {
                    socket.player.x = data.x;
                    socket.player.y = data.y;
                    io.emit('move',socket.player);
                });

                socket.on('disconnect',function() {
                    io.emit('remove', socket.player.id);
                    console.log('disconnecting: ' + socket.player.id);
                });
            } else {
                console.log("* " + socket.username + " is already in a game.");
            }
        });

    } else {
        console.log("NO GAME AVAILABLE");
    }
    
});

//--------------------------------------------------------------------------------

server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});

server.lastPlayerID = 0;

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

