const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

const socketClients = require('./controllers/server')(io);

// Запуск сервера
server.listen(3000, () => {
    console.log('Game running');
});