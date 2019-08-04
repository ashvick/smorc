radius = 35;

height = Math.sqrt(3) * radius;
width = 2 * radius;
side = (3 / 2) * radius;

canvas = document.getElementById('canvas');
context = canvas.getContext('2d');

canvasOriginX = 0;
canvasOriginY = 0;

mouseStates = [];  //массив состояний
hexColor = "rgb(235,235,235)";

canvas.addEventListener("mousedown", clickEvent, false);
canvas.addEventListener("mousemove", moveEvent, false);
maxRows = 0;
maxCols = 0;

function initMouseStates(rows, cols) {
    for (let i = 0; i < rows * cols; i++) {
        mouseStates.push({state: '0'});
    }
}

function initializeHexes(rows, cols) {
    for (let i = 0; i < rows * cols; i++) {
        hexes.push({lay: null, troops: 0, player: 0});
    }
}

function drawHexGrid(rows, cols, isDebug) {
    context.fillStyle = 'rgb(142,192,101)';
    context.fillRect(0,0,805,700);
    let currentHexX, currentHexY, debugText = '';
    this.maxRows = rows;
    this.maxCols = cols;
    const size = rows * cols;

    let offsetColumn = false;
    let hex = 0;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            hex = col * rows + row;
            let lay = hexes[hex].lay;
            let ID = hexes[hex].player;
            let troops = hexes[hex].troops;

            if (!offsetColumn) {
                currentHexX = col * this.side;
                currentHexY = row * this.height;
            } else {
                currentHexX = col * this.side;
                currentHexY = row * this.height + this.height * 0.5;
            }

            if (isDebug) {
                debugText = hexes[hex].troops;
            }

            paintLay(currentHexX, currentHexY, lay, hex);

            if (mouseStates[hex].state === '0') this.drawHex(currentHexX, currentHexY, 0, "rgba(71, 15, 59, 0.1)", debugText);
            //else if (mouseStates[hex].state === 'p-selected') this.drawHex(currentHexX, currentHexY, "rgb(200,200,200)", "#fff", debugText);
            if (mouseStates[hex].state === 'n-selected') this.drawHex(currentHexX, currentHexY, 0, "#fff", debugText);
            else if (mouseStates[hex].state === 'selected') this.drawHex(currentHexX, currentHexY, 0, "#fff", debugText);

            if(ID && players[ID].color) {
                if (ID === myID) this.drawHex(currentHexX, currentHexY, players[ID].color, "#000", debugText);
                else if (ID !== 0) this.drawHex(currentHexX, currentHexY, players[ID].color, "#fff", debugText);
            }
        }
        offsetColumn = !offsetColumn;
    }
}

function text(x0, y0, text, color, fontSize) {
    context.font = fontSize;
    context.fillStyle = color;
    context.fillText(text, x0 + (width / 2) - (width / 4), y0 + (height - 5));
}

function doRandom(array) {
    return Math.round(Math.random() * array.length);
}

let relief = [];
function paintLay(x0, y0, lay, hex) {
    if(relief[hex]) {
        switch(lay) {
            case 0:
                context.drawImage(relief[hex], x0, y0, 70, 60);
                break;
            case 1:
                text(x0, y0, 'forest', "#000", "8px");
                context.drawImage(relief[hex], x0, y0, 70, 60);
                break;
            case 2:
                text(x0, y0, 'mount', "#000", "8px");
                context.drawImage(relief[hex], x0, y0, 70, 60);
                break;
            case 3:
                text(x0, y0, 'lake', "#000", "8px");
                context.drawImage(relief[hex], x0, y0, 70, 60);
                break;
        }
    } else {
        switch(lay) {
            case 0:
                relief[hex] = ground[doRandom(ground)];
                break;
            case 1:
                relief[hex] = trees[0];
                break;
            case 2:
                relief[hex] = hills[0];
                break;
            case 3:
                relief[hex] = lake[0];
                break;
        }
    }
}

function drawHexAtColRow(column, row, color) {
    let drawy = column % 2 == 0 ? (row * height) + canvasOriginY :
        (row * height) + canvasOriginY + (height / 2);
    let drawx = (column * side) + canvasOriginX;

    drawHex(drawx, drawy, color, '');
}

function drawHex(x0, y0, fillColor, border, debugText) {
    context.strokeStyle = border;
    context.beginPath();
    context.moveTo(x0 + width - side, y0);
    context.lineTo(x0 + side, y0);
    context.lineTo(x0 + width, y0 + (height / 2));
    context.lineTo(x0 + side, y0 + height);
    context.lineTo(x0 + width - side, y0 + height);
    context.lineTo(x0, y0 + (height / 2));

    if (fillColor) {
        context.fillStyle = fillColor;
        context.fill();
    }

    context.closePath();
    context.stroke();

    if (debugText) {
        text(x0, y0, debugText, "#ccc", "8px");
    }
}

function getRelativeCanvasOffset() {
    let x = 0, y = 0;
    let layoutElement = canvas;
    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement = layoutElement.offsetParent);

        return {x: x, y: y};
    }
}

function getNeighbors(col, row) {
    let neighbors;
    let neighborsId = [];

    if (row === 0 && col % 2) {
        neighbors = [
            {col: col - 1, row: row},
            {col: col + 1, row: row},
            {col: col - 1, row: row + 1},
            {col: col, row: row + 1},
            {col: col + 1, row: row + 1}
        ]
    }
    else if (row === 0) {
        neighbors = [
            {col: col - 1, row: row},
            {col: col, row: row + 1},
            {col: col + 1, row: row}
        ]
    }

    else if (row === 10 && col % 2) {
        neighbors = [
            {col: col - 1, row: row},
            {col: col, row: row - 1},
            {col: col + 1, row: row},
        ]
    }

    else if (row === 10) {
        neighbors = [
            {col: col - 1, row: row},
            {col: col - 1, row: row - 1},
            {col: col + 1, row: row},
            {col: col, row: row - 1},
            {col: col + 1, row: row - 1},
        ]
    }

    else if (col % 2) {
        neighbors = [
            {col: col - 1, row: row},
            {col: col, row: row - 1},
            {col: col + 1, row: row},
            {col: col - 1, row: row + 1},
            {col: col, row: row + 1},
            {col: col + 1, row: row + 1}
        ];

    } else {
        neighbors = [
            {col: col - 1, row: row - 1},
            {col: col, row: row - 1},
            {col: col + 1, row: row - 1},
            {col: col - 1, row: row},
            {col: col, row: row + 1},
            {col: col + 1, row: row}
        ];
    }
    for (let i = 0; i < neighbors.length; i++) {
        let hex = neighbors[i].col * maxRows + neighbors[i].row;
        if(hex >= 0 && hex < maxRows * maxCols) neighborsId.push(hex);
    }
    return neighborsId;
}

function getHexId(col, row, maxRows) {
    return col * maxRows + row;
}

function getCoords(hex) {
    let col = Math.floor(hex / maxRows);
    let row = hex % col;
    return [col, row]
}

function getSelectedTile(mouseX, mouseY) {
    let offSet = getRelativeCanvasOffset();

    mouseX -= offSet.x;
    mouseY -= offSet.y;

    let column = Math.floor((mouseX - 1) / side);
    let row = Math.floor(column % 2 == 0 ?
        Math.floor((mouseY) / height) :
        Math.floor(((mouseY + (height * 0.5)) / height)) - 1);
    if (mouseX > (column * side - 5)
        && mouseX < (column * side) + width - side) {

        var p1 = {};                                    //Top left triangle points
        p1.x = column * side;
        p1.y = column % 2 == 0
            ? row * height
            : (row * height) + (height / 2);

        var p2 = {};
        p2.x = p1.x;
        p2.y = p1.y + (height / 2);

        var p3 = {};
        p3.x = p1.x + width - side;
        p3.y = p1.y;

        var mousePoint = {};
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;//

            if (column % 2 != 0) {
                row--;
            }
        }

        var p4 = {};                                    //Bottom left triangle points
        p4 = p2;

        var p5 = {};
        p5.x = p4.x;
        p5.y = p4.y + (height / 2);

        var p6 = {};
        p6.x = p5.x + (width - side);
        p6.y = p5.y;

        if (isPointInTriangle(mousePoint, p4, p5, p6)) {
            column--;

            if (column % 2 == 0) {
                row++;
            }
        }
    }

    return {row: row, column: column};
}

function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function isPointInTriangle(pt, v1, v2, v3) {
    let b1, b2, b3;

    b1 = sign(pt, v1, v2) < 0.0;
    b2 = sign(pt, v2, v3) < 0.0;
    b3 = sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}

let lastHex = 0;
function moveArmy(selectedHex) {
    let countTroops = +prompt('How troops?');
    if(countTroops > 0 && countTroops <= hexes[lastHex].troops) {
        if(hexes[selectedHex].player) {
            socket.emit('attack', {lastHex, selectedHex, countTroops});
        } else {
            socket.emit('move', {lastHex, selectedHex, countTroops});
        }

    } else alert('Нет');
}

let selectedNeighbors = 0;
let selectedHex = 0;
function clickEvent(e)
{
    let mouseX = e.pageX;
    let mouseY = e.pageY;

    let localX = mouseX - canvasOriginX;
    let localY = mouseY - canvasOriginY;

    let tile = getSelectedTile(localX, localY);

    if (tile.column >= 0 && tile.row >= 0) {
        let hex = getHexId(tile.column, tile.row, maxRows);
        mouseStates[selectedHex].state = '0';        //сброс выделения

        if(hexes[hex].player === myID) {
            let neighborsId = getNeighbors(tile.column, tile.row);
            mouseStates[hex].state = 'p-selected';
            if (mouseStates[hex].state === 'p-selected') {     //убираем выделение соседних клеток
                for (let i = 0; i < selectedNeighbors.length; i++) {
                    changeState(selectedNeighbors[i], "0");
                }
                console.log('work');
            }
            for (let i = 0; i < neighborsId.length; i++) {
                changeState(neighborsId[i], "n-selected");
            }
            selectedNeighbors = neighborsId;
            lastHex = hex;                           //из какого тайла идут войска

        } else if (mouseStates[hex].state === "n-selected" ) {
            moveArmy(hex);
        } else if (mouseStates[hex].state === '0') {
            mouseStates[hex].state = 'selected';
            selectedHex = hex;                       //необходима для сброса выделения
            console.log(hexes[hex]);
        }
        console.log(relief[hex]);
    }
}

function changeState(hex, wantedState)
{
    mouseStates[hex].state = wantedState;
}

function moveEvent(e)
{
    let mouseX = e.pageX;
    let mouseY = e.pageY;

    let localX = mouseX - canvasOriginX;
    let localY = mouseY - canvasOriginY;

    let tile = getSelectedTile(localX, localY);

    if (tile.column >= 0 && tile.row >= 0 && tile.column <= maxCols - 1
        && tile.row <= maxRows - 1) {
        let scopeHexId = getHexId(tile.column, tile.row, maxRows);
    }
}







