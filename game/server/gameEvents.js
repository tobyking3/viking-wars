module.exports = {
    fire (io, data, client) {
        io.emit('fire', data.power, data.angle, client.player);
    },

    turnTaken (client) {
        client.player.turn = !client.player.turn;
    },

    hit (io, client) {
        if (client.player.turn) {
            if (client.player.health > 20) {
                client.player.health -= 20;
                io.emit('healthChange', client.player.id, client.player.health);
            } else {
                client.player.health -= 20;
                io.emit('healthChange', client.player.id, client.player.health);
                io.emit('playerDied', client.player.id);
            }
        }
    },

    groundHit (io, client){
        if (client.player.turn) {
            io.emit('groundHit', client.player.id);
        }
    },

    decreaseTurretAngle(io, decrease, client) {
        if (decrease && client.player.turretAngle >= -90) {
            client.player.turretAngle--;
        }
    },

    increaseTurretAngle(io, increase, client) {
        if (increase && client.player.turretAngle <= 0) {
            client.player.turretAngle++;
        }
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
        io.emit('updateTurretPower', client.player);
    },

    updateTurretAngle(io, client) {
        io.emit('updateTurretAngle', client.player);
    }
};
