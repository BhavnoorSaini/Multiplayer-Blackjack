//-------------------------------------------------------------------------------
//Santiago Ramirez
//server.js
//runs a local server using node.js 
//-------------------------------------------------------------------------------


// const http = require('http');
// const fs = require('fs');           // Require the file system module
var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

//Get access to request body for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Apply CORS to allow cross origin acccess
app.use(cors());

//use routes modue for /
app.use('/', routes);

//Listen for connections on port 3000
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
    // blackjackAdvice.resetOutcomes();        // reset outcomes file on server start
});


// Extra
// const blackjackAdvice = require('./blackjackadvice'); 

// const server = http.createServer((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');      // set CORS header

//     const parsedUrl = url.parse(req.url, true);
//     const userScoreParam = parsedUrl.query.userscore;
//     const dealerScoreParam = parsedUrl.query.dealerscore;
//     const outcomeParam = parsedUrl.query.outcome;

//     let myCallback = function(responseData) {       // callback function to send the response
//         if (responseData.status === 'Success') {
//             res.statusCode = 200;
//         } else {
//             res.statusCode = 400; // Bad Request for invalid outcomes
//         }
//         res.setHeader('Content-Type', 'application/json');
//         res.end(JSON.stringify(responseData));
//         console.log(`Response sent: ${JSON.stringify(responseData)}`);      // log the response
//     };
//     if (outcomeParam) {
//         // Handle outcome reporting
//         blackjackAdvice.reportOutcome(outcomeParam, myCallback);
//     } else if (userScoreParam !== undefined && dealerScoreParam !== undefined) {
//         // Parse scores as integers
//         const userScore = parseInt(userScoreParam, 10);
//         const dealerScore = parseInt(dealerScoreParam, 10);

//         // Handle the advice generation asynchronously
//         blackjackAdvice.generateAdvice(userScore, dealerScore, myCallback);   
//     }
// });