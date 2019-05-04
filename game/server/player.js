module.exports = {
    addPlayer(client, io, pID) {

        playerRoom = Object.keys( io.sockets.adapter.sids[client.id] )[1];

        let playerID;

        if(pID % 2 == 0){
            playerID = 0;
        } else {
            playerID = 1;
        }

        client.player = {
            room: playerRoom,
            id: playerID,
            x: playerID === 0 ? 100 : 4150,
            y: 900,
            health: 100,
            turretPower: 800,
            turretAngle: 0,
            currentDirection: +1,
            turn: playerID === 0 ? true : false
        };

        // If it's player two,
        // emit to add the player for player one
        if (playerID % 2 != 0) {
            let clientRoom = Object.keys( io.sockets.adapter.sids[client.id] )[1];
            client.broadcast.to(clientRoom).emit('newPlayer', client.player);
        }
    },

    getAllPlayers(io, client) {

        let thisRoom = Object.keys( io.sockets.adapter.sids[client.id] )[1];

        let socketsInRoom = io.sockets.adapter.rooms[thisRoom].sockets;

        io.sockets.adapter.rooms[thisRoom]['playersInRoom'] = [];

        Object.keys(socketsInRoom).forEach(function(socketID) {

            let player = io.sockets.connected[socketID].player;

            if (player) io.sockets.adapter.rooms[thisRoom]['playersInRoom'].push(player);

        });

        return io.sockets.adapter.rooms[thisRoom]['playersInRoom'];

    }
};