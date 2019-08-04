/**
 * Created by enigma on 14.11.17.
 */
const socket = io.connect('localhost:3000');

let hexes = [];
let players = {};   //{id, startPos, color}

initializeHexes(11, 15);
initMouseStates(11, 15);

let myID = 0;

function mainLoop() {
    drawHexGrid(11, 15, true);
    requestAnimationFrame(mainLoop);
}

socket.on('create', (data) => {
    myID = (data.id).toString().substr(0, 4);
});

socket.on('gamedata', (data) => {
    //console.log(data);
    hexes = data;
});

socket.on('players', (data) => {
    //console.log(data);
    players = data;
    //console.log(players);

});


requestAnimationFrame(mainLoop);










