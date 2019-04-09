module.exports = class Game {
    constructor() {
        this.playerOne = 0;
        this.playerTwo = 1;
        this.connectedPlayers = 0;
        this.minPlayers = 1;
        this.maxPlayers = 2;
        this.gameReady = false;
        this.gameInProgress = false;
    }

    addPlayer(client, playerID) {
        client.player = {
            id: playerID,
            x: playerID === 0 ? 100 : 4150,
            y: 900,
            health: 100,
            turn: playerID === 0 ? true : false
        };

        if (playerID === this.playerTwo) {
            client.broadcast.emit('newplayer', client.player);
        }

        this.connectedPlayers++;
    }

    getAllPlayers(io) {
        let players = [];
        Object.keys(io.sockets.connected).forEach(function(socketID) {
            let player = io.sockets.connected[socketID].player;
            if (player) players.push(player);
        });

        return players;
    }

    checkSlotAvailable() {
        return this.connectedPlayers < 2;
    }

    disconnect() {
        this.connectedPlayers--;
    }
};