//Author: Nnamdi Nwanze
//Description: This routes module creates custom routes and demonstrates the use of routes using the database manager module
// Santiago Ramirez
// CSCE 315

var express = require('express');
var router = express.Router();
//use database manager module
var mydb = require('./dbmgr.js');

//use the url module
const url = require('url');

//test variables
var a = 0;
var b = 0;

//Setup database, only need to run this once. Unblock to run once then block this line again
//mydb.setup();     


//Demo / route to print hello
router.get('/', function (req, res) {
    res.send("Hello a is " + a + ", b  is " + b);
});

//Demo / route to print hello
router.post('/username', function (req, res) {
    console.log(req.body);
    res.send("Hello a is " + a + ", b  is " + b);
});

//Demo / route to print hello
router.get('/username', function (req, res) {
    let myURL = url.parse(req.url, true);
    console.log(myURL);
    res.send("Hello we're using a get");
});

//Demo /p1 route to insert record into the database
router.get('/p1', function (req, res) {
    a++;
    mydb.insertRec({username: 'Player1', 'score': a});
    res.send("Hello Player1! Inserting score b: " + b);
});
//Demo /p2 route to insert a different record into the database
router.get('/p2', function (req, res) {
    b++;
    mydb.insertRec({username: 'Player2', 'score': b});
    res.send("Hello Player2! Inserting score a: " + a);
});
//Demo /p3 route to find a record in the database
router.get('/p3', function (req, res) {
    mydb.findRec();
    res.send("Finding 1 record");
});
//Demo /p route to find all records in the database
router.get('/p4', function (req, res) {
    mydb.findAll(0);
    res.send("Finding all records");
});
//Demo /p5 route to update record the database
router.get('/p5', function (req, res) {
    queryData = {username: 'Player1'};
    upData = {'score': 100};
    mydb.updateData(queryData, upData);
    res.send("Updating " + JSON.stringify(queryData) + " score to " + JSON.stringify(upData));
});
//Demo /p6 route to delete collection in the database
router.get('/p6', function (req, res) {
    mydb.deleteCollection();
    res.send("Deleted Collection");
});

module.exports = router;
