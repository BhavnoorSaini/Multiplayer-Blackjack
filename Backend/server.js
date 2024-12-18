//-------------------------------------------------------------------------------
//Santiago Ramirez & Bhavnoor Saini
//server.js
//runs a local server using node.js 
//-------------------------------------------------------------------------------


var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const app = express();
const port = 3000;

var http = require('http').Server(app);
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});

//Get access to request body for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Apply CORS to allow cross origin acccess
app.use(cors());

//use routes modue for /
app.use('/', routes);

//Listen for connections on port 3000
http.listen(port, function() {
    console.log('listening on http://127.0.0.1:3000');
});

let userCount = 0;
let usernames = {};
let bet = {};

// Handle socket connections
io.on('connection', (socket) => {
    userCount++;

    io.emit('broadcast', { description: userCount });
    console.log(`A user connected. Total users: ${userCount}`);

    socket.on('username', (data) => {
        usernames[socket.id] = data.username;

        // Emit the username to all other clients except the sender
        socket.broadcast.emit('setp2Username', { username: data.username });
    });

    socket.on('bet', (data) => {
        bet[socket.id] = data.bet;

        // Emit the bet to all other clients except the sender
        socket.broadcast.emit('setp2Bet', { bet: data.bet });
    });

    socket.on('playerCards', (data) => {
        // Emit the player's cards to all other clients except the sender
        socket.broadcast.emit('setp2PlayerCards', { cards: data.cards });
    });

    socket.on('dealerCards', (data) => {
        // Emit the dealer's cards to all other clients except the sender
        socket.broadcast.emit('setp2DealerCards', { cards: data.cards });
    });

    socket.on('disconnect', () => {
        userCount--;
        delete usernames[socket.id]; // Remove the user from the usernames object
        io.emit('broadcast', { description: userCount });
        console.log(`A user disconnected. Total users: ${userCount}`);
    });
});