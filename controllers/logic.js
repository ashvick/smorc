const settings = require('./settings');

let hexes = [];
let relief = [];
let players = {};
const hexCount = settings.cols * settings.rows;

module.exports = {
    getRandomPosition() {
        return Math.floor(Math.random() * hexCount)
    },

    initializeHexes(rows, cols) {
        for (let i = 0; i < rows * cols; i++) {
            hexes.push({lay: 0, troops: 0, player: 0});
        }
        this.addRelief(settings.density, 11, 15);
    },

    doCycle(rows, cols) {
        for(let i = 0; i < rows * cols; i++) {
            if (hexes[i].player) hexes[i].troops++
        }
    },

    addRelief(density, rows, cols) {
        let random = 0;
        for(let i = 0; i < rows * cols; i++) {
            hexes[i].lay = 0;
            random = Math.floor(Math.random() * 100);
            if (random < density) {
                hexes[i].lay = 1;
            }
            random = random = Math.floor(Math.random() * 100);
            if(hexes[i].lay === 1) {
                if (random < 60) hexes[i].lay = 1;
                else if (random < 80 && random > 60) hexes[i].lay = 2;
                else hexes[i].lay = 3;
            }
        }
    },

    getRandomColor() {
        const color = [0, 0, 0];
        for (let i = 0; i < 3; i += 1) {
            color[i] = Math.floor(Math.random() * 256);
        }
        return color;
    },

    addPlayer(id) {
        const startPosition = this.getRandomPosition();
        const rgbArray = this.getRandomColor();
        const ID = id.toString().substr(0, 4);
        hexes[startPosition].troops = 100;
        hexes[startPosition].player = ID;
        if (!this.existingPlayer(id)) {
            players[ID] = {
                id,
                color: `rgba(${rgbArray[0]},${rgbArray[1]},${rgbArray[2]}, 0.6)`,
            };
        }
    },

    getPlayerById(id) {
        let player;
        players.forEach(((element, index, array) => {
            if (element.id === id) {
                player = array[index];
            }
        }));
        return player;
    },

    getHexes() {
        return hexes;
    },

    existingPlayer(id) {
        const ID = id.toString().substr(0, 4);
        return players[ID] !== undefined;
    },

    getPlayers() {
        return players;
    },

    getHex(hex) {
        return hexes[hex];
    },

    removePlayer(id) {
        const ID = id.toString().substr(0, 4);
        delete players[ID];
        for(let i = 0; i < hexCount; i++) {
            if (hexes[i].player === ID) {
                hexes[i].troops = 0;
                hexes[i].player = 0;
            }
        }
    },

    moveArmy(lastHex, selectedHex, countTroops) {
        if(hexes[lastHex].troops >= countTroops) {
            hexes[lastHex].troops = hexes[lastHex].troops - countTroops;
            hexes[selectedHex].troops = countTroops + hexes[selectedHex].troops;
            hexes[selectedHex].player = hexes[lastHex].player;
        }
    },

    abs(number) {
        if(number >= 0) {
            return number;
        } else {
            return -number;
        }
    },

    attackArmy(lastHex, selectedHex, countTroops) {
        hexes[lastHex].troops = hexes[lastHex].troops - countTroops;
        console.log(hexes[selectedHex].troops);
        let result = hexes[selectedHex].troops - countTroops;
        console.log(result + ' result');
        if(result > 0) {
            hexes[selectedHex].troops = result;
        } else if (result < 0) {
            hexes[selectedHex].troops = this.abs(result);
            console.log(hexes[selectedHex].troops + 'result after');
            hexes[selectedHex].player = hexes[lastHex].player;
        }
    }
};
