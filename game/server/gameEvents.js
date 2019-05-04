module.exports = {
    fire (io, client) {

        let clientRoom1 = Object.keys( io.sockets.adapter.sids[client.id] )[1];

        io.sockets.to(clientRoom1).emit('fire', client.player);
    },

    turnTaken (client) {
        client.player.turn = !client.player.turn;
    },

    hit (io, client) {

        let clientRoom2 = Object.keys( io.sockets.adapter.sids[client.id] )[1];

        if (client.player.turn) {
            if (client.player.health > 20) {
                client.player.health -= 20;
                io.sockets.to(clientRoom2).emit('healthChange', client.player.id, client.player.health);
            } else {
                client.player.health -= 20;
                io.sockets.to(clientRoom2).emit('healthChange', client.player.id, client.player.health);
                io.sockets.to(clientRoom2).emit('playerDied', client.player.id);
            }
        }
    },

    groundHit(io, client){
        let clientRoom3 = Object.keys( io.sockets.adapter.sids[client.id] )[1];
        if (client.player.turn) {
            io.sockets.to(clientRoom3).emit('groundHit', client.player.id);
        }
    },

    randomAngle(io, client) {
        if (client.player.turn) {
            this.updatePlayerAngle(client.player);
        }
    },

    updatePlayerAngle(player) {
        let currentAngle = player.turretAngle;
        let currentDirection = player.currentDirection;
        let angleMoveAmount = 1;

        if (currentAngle >= 0 && currentDirection === +1) {
            currentAngle = 0;
            currentDirection = -1;
        }
        if (currentAngle <= -90 && currentDirection === -1) {
            currentAngle = -90;
            currentDirection = +1;
        }

        currentAngle = currentAngle + (angleMoveAmount * currentDirection);
        player.turretAngle = currentAngle;
        player.currentDirection = currentDirection;
    },

    decreaseTurretPower(io, decrease, client) {
        if (decrease && client.player.turretPower > 400) {
            client.player.turretPower = client.player.turretPower - 20;
        }
    },

    increaseTurretPower(io, increase, client) {
        if (increase && client.player.turretPower < 3000) {
            client.player.turretPower = client.player.turretPower + 20;
        }
    },

    updateTurretPower(io, client) {
        let clientRoom4 = Object.keys( io.sockets.adapter.sids[client.id] )[1];
        io.sockets.to(clientRoom4).emit('updateTurretPower', client.player);
    },

    updateTurretAngle(io, client) {
        let clientRoom5 = Object.keys( io.sockets.adapter.sids[client.id] )[1];
        io.sockets.to(clientRoom5).emit('updateTurretAngle', client.player);
    }
};
