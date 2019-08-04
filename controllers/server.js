const logic = require('./logic');
const gameSettings = require('./settings');

module.exports = function (io) {
    logic.initializeHexes(11, 15);
    //playerController.addRelief();
    //Broadcasting all players movement at defined intervals
    setInterval(() => {
        logic.doCycle(11, 15);
    }, 1000);
    setInterval(() => {
        io.sockets.emit('players', logic.getPlayers());
        io.sockets.emit('gamedata', logic.getHexes());
    }, gameSettings.fps);

    io.on('connection', (socket) => {
        console.log(`New connection ${socket.id}`);
        //on new connection, return canvas settings and id
        socket.emit('create', { id: socket.id });

        logic.addPlayer(socket.id);

        socket.on('disconnect', () => {
            console.log('Client left');
            logic.removePlayer(socket.id);
        });

        socket.on('move', (data) => {
            logic.getHex(data.lastHex);
            logic.moveArmy(data.lastHex, data.selectedHex, data.countTroops)
        });

        socket.on('attack', (data) => {
            logic.getHex(data.lastHex);
            logic.attackArmy(data.lastHex, data.selectedHex, data.countTroops)
        })
    });
};