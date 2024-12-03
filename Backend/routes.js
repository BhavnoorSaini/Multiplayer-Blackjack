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
    
    var username = req.body.username;
    console.log(username)
    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }
    /*
    mydb.findUser(username)
        .then(function(userExists) {
            if (userExists) {
                return res.status(409).json({ message: 'Username already exists.' });
            }
            return mydb.addUser(username);
        })
        .then(function() {
            res.status(201).json({ message: 'Username successfully registered.' });
        })
        .catch(function(error) {
            console.error('Error handling /username route:', error);
            res.status(500).json({ message: 'Internal server error.' });
        });
        */
});

// Player 1 route
// accepts GET req with players name, stats, and status
router.get('/player1', function (req, res) {
    var username = req.query.username;
    var roundStatus = req.query.roundStatus;
    var walletAmount = parseInt(req.query.walletAmount, 10);
    var rounds = parseInt(req.query.rounds, 10);

    if (!username || !roundStatus || isNaN(walletAmount) || isNaN(rounds)) {    // checks if parameters are valid
        return res.status(400).json({ message: 'Invalid parameters.' });
    }

    if (roundStatus === 'gameover') {
        mydb.findUser(username)
            // check if user is found in db, 
                // if not found, add user to database
            //then check if they had a better score (higher rounds)
                // if score is higher, update user's highscore
        .then(function() {
            res.status(200).json({ message: 'Player1 processed successfully.' });
        })
        .catch(function(error) {
            console.error('Error handling /player1 route:', error);
            res.status(500).json({ message: 'Internal server error.' });
        });
    }
});

// Player 2 Route
router.get('/player2', function (req, res) {
    var username = req.query.username;
    var roundStatus = req.query.roundStatus;
    var walletAmount = parseInt(req.query.walletAmount, 10);
    var rounds = parseInt(req.query.rounds, 10);

    if (!username || !roundStatus || isNaN(walletAmount) || isNaN(rounds)) {    // checks if parameters are valid
        return res.status(400).json({ message: 'Invalid parameters.' });
    }

    if (roundStatus === 'gameover') {
        mydb.findUser(username)
            // check if user is found in db, 
                // if not found, add user to database
            //then check if they had a better score (higher rounds)
                // if score is higher, update user's highscore
        .then(function() {
            res.status(200).json({ message: 'Player1 processed successfully.' });
        })
        .catch(function(error) {
            console.error('Error handling /player1 route:', error);
            res.status(500).json({ message: 'Internal server error.' });
        });
    }
});

// Highscore Route
// responds with JSON highscore list
router.get('/highscore', function (req, res) {
    console.log(req.body);
});

module.exports = router;
