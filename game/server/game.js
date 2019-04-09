module.exports = class Game {
    constructor() {
        this.clientID = 0;
        this.connectedPlayers = 0;
        this.minPlayers = 1;
        this.maxPlayers = 2;
        this.gameReady = false;
        this.gameInProgress = false;
    }

    addPlayer(client) {
        client.player = {
            x: this.clientID === 0 ? 100 : 1000,
            y: 900,
            health: 100,
            turn: this.clientID === 0 ? true : false,
            id: this.clientID++
        };

        this.connectedPlayers++;
    }

    getAllPlayers(io) {
        let players = [];
        Object.keys(io.sockets.connected).forEach(function(clientID) {
            let player = io.sockets.connected[clientID].player;
            if (player) {
                players.push(player);
            }

        });

        return players;
    }

    checkSlotAvailable() {
        return this.connectedPlayers < 2;
    }

    disconnect(client, io) {
        this.connectedPlayers--;
        io.emit('remove', client.player.id);
    }
};