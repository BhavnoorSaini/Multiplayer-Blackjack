// Santiago Ramirez & Bhavnoor Saini
// CSCE 315 - Blackjack Multiplayer Routes

var express = require('express');       // utilize routes
var router = express.Router();
var mydb = require('./dbmgr.js');       // use database manager module
const url = require('url');             //use the url module

//Setup database, only need to run this once. Unblock to run once then block this line again
//mydb.setup();     

// username route
// accepts POST requests with uesrnames and stores in database
router.post('/username', function (req, res) {
    console.log(req.body);
});

// Player 1 route
// accepts GET req with players name, stats, and status
router.get('/player1', function (req, res) {
    a++;
    mydb.insertRec({username: 'Player1', 'score': a});
    res.send("Hello Player1! Inserting score b: " + b);
});

// Player 2 Route
router.get('/player2', function (req, res) {
    b++;
    mydb.insertRec({username: 'Player2', 'score': b});
    res.send("Hello Player2! Inserting score a: " + a);
});

// Highscore Route
// responds with JSON highscore list
router.get('/highscore', function (req, res) {
    mydb.findRec();
    res.send("Finding 1 record");
});

module.exports = router;
