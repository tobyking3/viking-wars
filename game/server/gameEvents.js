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

    updateTurretAngle(io, turretAngle, client) {
        io.emit('updateturretangle', turretAngle, client.player);
    },

    updateTurretPower(io, turretPower, client) {
        io.emit('updateturretpower', turretPower, client.player);
    }
};
