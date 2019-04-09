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
            } else {
                io.emit('playerdied', client.player.id);
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
