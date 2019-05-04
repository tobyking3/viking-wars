module.exports = {
    fire (io, client) {
        io.sockets.to(client.player.room).emit('fire', client.player);
    },

    turnTaken (io, client) {
        client.player.turn = !client.player.turn;
    },

    checkTurn (client) {
        client.emit('turnUpdate', client.player.turn);
    },

    hit (io, client) {
        if (client.player.turn) {
            if (client.player.health > 20) {
                client.player.health -= 20;
                io.sockets.to(client.player.room).emit('healthChange', client.player);
            } else {
                client.player.health -= 20;
                io.sockets.to(client.player.room).emit('healthChange', client.player);
                io.sockets.to(client.player.room).emit('playerDied', client.player.id);
            }
        }
    },

    groundHit(io, client){
        if (client.player.turn) {
            io.sockets.to(client.player.room).emit('groundHit', client.player);
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
        io.sockets.to(client.player.room).emit('updateTurretPower', client.player);
    },

    updateTurretAngle(io, client) {
        io.sockets.to(client.player.room).emit('updateTurretAngle', client.player);
    }
};
