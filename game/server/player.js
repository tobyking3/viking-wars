module.exports = {
    addPlayer(client, playerID) {
        client.player = {
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
        if (playerID === 1) {
            client.broadcast.emit('newPlayer', client.player);
        }
    },

    getAllPlayers(io) {
        let players = [];
        Object.keys(io.sockets.connected).forEach(function(socketID) {
            let player = io.sockets.connected[socketID].player;
            if (player) players.push(player);
        });

        return players;
    }
};