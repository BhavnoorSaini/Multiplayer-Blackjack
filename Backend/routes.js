// Santiago Ramirez & Bhavnoor Saini
// CSCE 315 - Blackjack Multiplayer Routes
// --- Sets up routes on the express server ---

var express = require('express');       // utilize routes
var router = express.Router();
var mydb = require('./dbmgr.js');       // use database manager module
const url = require('url');             //use the url module

//Setup database, only need to run this once. Unblock to run once then block this line again
//mydb.setup();      

// username route accepts POST requests with usernames and stores in database, ensures username is unique
router.post('/username', function (req, res) {
    var username = req.body.username;
    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });          // error if the username is missing
    }
    mydb.findRec({ username: username}, function (err, result) {                    // check if username already exists in the database else insert it
        if (err) {
            console.error('Error finding username:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (result) {                                                               // username already exists
            return res.status(409).json({ message: 'Username already exists.' });
        } else {
            mydb.insertRec({ username: username, score:0 }, function (err) {        // inserts the new username into the database
                if (err) {
                    console.error('Error inserting username:', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }
                return res.status(201).json({ message: 'Username stored successfully.' });
            });
        }
    });
});

// Player 1 route
// accepts GET req with players name, round status, and wallet amount
router.get('/player1', function (req, res) {
    var username = req.query.username;
    var roundStatus =req.query.status;
    var walletAmount = parseInt(req.query.wallet, 10);
    console.log(JSON.stringify(req.query));
    if (!username || !roundStatus || isNaN(walletAmount)) {             // checks if parameters are valid
        return res.status(400).json({ message: 'Invalid parameters.' });
    }
    if (roundStatus === 'gameover') {                                   // if round status is gameover, then compare and update the highscores
        mydb.updateUserScore(username, walletAmount, function (err) {
            if (err) {                                                  // error handling for existing names or other error
                if (err.message === 'Username already exists.') {
                    return res.status(409).json({ message: 'Username already exists.' });
                }
                console.error('Error updating user score:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }
            res.status(200).json({ message: 'Player1 processed successfully.' });
        });
    }     
});

// Player 2 Route
router.get('/player2', function (req, res) {
    var username = req.query.username;
    var roundStatus =req.query.status;
    var walletAmount = parseInt(req.query.wallet, 10);
    console.log(JSON.stringify(req.query));
    if (!username || !roundStatus || isNaN(walletAmount)) {    
        return res.status(400).json({ message: 'Invalid parameters.' });
    }
    
    if (roundStatus === 'gameover') {
        mydb.updateUserScore(username, walletAmount, function (err) {
            if (err) {
                if (err.message === 'Username already exists.') {
                    return res.status(409).json({ message: 'Username already exists.' });
                }
                console.error('Error updating user score:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            res.status(200).json({ message: 'Player2 processed successfully.' });
        });
    }     
});

// Highscore Route
// responds with JSON highscore list
router.get('/highscore', function (req, res) {
    mydb.getHighscores(function (err, highscores) {             // calls the getHighscores database function that returns an array of 5 top scores
        if (err) {
            console.error('Error handling /highscores route:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        res.status(200).json({ highscores: highscores });       // set 200 status and respond with the json highscores list
    });
});

// Route to print all usernames
router.get('/printUsernames', function (req, res) {
    mydb.printAllUsernames(function (err, results) {            // calls the printAllUsernames function and finds all data in the db
      if (err) {
        console.error('Error printing usernames:', err);
        return res.status(500).json({ message: 'Internal server error.' });
      }
      return res.status(200).json({ message: 'Usernames printed successfully.' });      // resonds with a successful message
    });
});

// Route to show if database is connected (default route)
router.get('/' , function(req, res) {
    res.send('Hello World!');
});
  

module.exports = router;