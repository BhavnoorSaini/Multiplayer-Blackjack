// Santiago Ramirez & Bhavnoor Saini
// Multiplayer Blackjack Database Manager
// ------ Manages MongoDB database ------

const config = require('./config.json');

const mycollection = config.mycollection;
const myDB = config.myDB;
var myMongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://"+config.username+":" + config.pwd +"@cluster0.yjzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


// set up the database
exports.setup = function () {
    let cbackfunc;
    testConnection(cbackfunc);
    createMyCollection(cbackfunc);
};
// create the database
let testConnection = function (callbackFn) {
    console.log("Attempting connection to database...");
    myMongoClient.connect(url)
    .then(db => {
        console.log("Connected to database!");
        db.close();
    })
    .catch(function (err) {
        throw err;
    })
};

// creates collection
let createMyCollection = function (callbackFn) {
    if (!myDB) {
        console.log("ERROR: Collection undefind. Fix myDB in config file");
        return;
    }
    myMongoClient.connect(url)
    .then(db => {
      var dbo = db.db(myDB);
      dbo.createCollection(mycollection)
      .then(()=>{
        console.log("Collection created!");
        db.close();
      })
    })
    .catch(function (err) {
        throw err;
    })
};

// deletes a collection
exports.deleteCollection = function (callbackFn) {
  myMongoClient.connect(url)
  .then(db => { 
    var dbo = db.db(myDB);
    dbo.collection(mycollection).drop()
    .then(isDeleted=>{
      if (isDeleted)
          console.log("Collection deleted");
      db.close();
    })
  })
  .catch(function (err) {
      throw err;
  })
};

// inserts a record of myobj into the database
exports.insertRec = function (myobj, callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
    var dbo = db.db(myDB);
    dbo.collection(mycollection).insertOne(myobj)     // inserts a single object into mycollection
    .then(()=>{
      console.log("1 document inserted");             // prints to the console if successful, then closes the db
      db.close();
      if (callbackFn) callbackFn(null); 
    })
    .catch(err => {                                   // callback function for error handling
      db.close();
      if (callbackFn) callbackFn(err);
    });
  })
  .catch(function (err) {
      if (callbackFn) callbackFn(err);
  })
};

//finds a single record with information contained in data
exports.findRec = function (data, callbackFn) {
  myMongoClient.connect(url)
  .then(db => { 
    var dbo = db.db(myDB);
    dbo.collection(mycollection).findOne(data)      // searches the db for 'data'
    .then(results=>{
      console.log("Results:", results);             // if data is found, log it to the console
      db.close();
      if (callbackFn) callbackFn(null, results);
    })
    .catch(err => {                                 // else if not found, use callback function for err handling
      db.close();
      if (callbackFn) callbackFn(err);
    });
  })
  .catch(function (err) {
      if (callbackFn) callbackFn(err);
  })
};

// finds all records and prints usernames with scores
exports.printAllUsernames = function (callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
    var dbo = db.db(myDB);
    dbo.collection(mycollection).find({}).toArray()     // finds everything in mycollection as an array
    .then(results => {
      console.log("Usernames with Scores:");
      results.forEach(record => {                   // iterates through the results and prints each username with their corresponding score                        
        console.log(`Username: ${record.username}, Score: ${record.score}`);
      });
      db.close();
      if (callbackFn) callbackFn(null, results);    // sends the results to the callback function
    })
    .catch(err => {             // error handling
      db.close();
      if (callbackFn) callbackFn(err);
    });
  })
  .catch(function (err) {
    if (callbackFn) callbackFn(err);
  });
};

//finds all records using a limit
exports.findAll = function (limit,callbackFn) {
    myMongoClient.connect(url)
    .then(db => { 
      var dbo = db.db(myDB);
      dbo.collection(mycollection).find({}).limit(0).toArray()    // if limit is set to 0, all records are found 
      .then(results=>{                  // iterates through the results array and logs the data
        console.log("Results");
        console.log(results);
        db.close();
      })
    })
    .catch(function (err) {          
        throw err;
    })
};

//updates queryData's data in the database to newdata
exports.updateData = function (data, updateFields, callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
      var dbo = db.db(myDB);
      dbo.collection(mycollection).updateOne(     // updates the data inside the given field (updateFields)
          data,
          { $set: updateFields }
      )
      .then(result => {
          console.log("1 document updated");      // if sucessful, then log to console and send result to callback function
          db.close();
          if (callbackFn) callbackFn(null, result);
      })
      .catch(err => {
          console.error("Error updating record:", err);
          db.close();
          if (callbackFn) callbackFn(err);
      });
  })
  .catch(function (err) {
      console.error("Error connecting to database:", err);
      callbackFn(err, null);
  });
};

// Updates user's score if the new score is higher than the existing score
exports.updateUserScore = function (username, newScore, callbackFn) {
  console.log(`Attempting to update score for username: ${username} with newScore: ${newScore}`);
  exports.findRec({ username: username }, function (err, user) {      // finds the username in the database
      if (err) {
          console.error('Error finding user:', err);
          return callbackFn(err);
      }
      console.log('User found:', user);
      if (user) {
          console.log('Current Score:', user.score);                // once user is found, get their highscore
          if (newScore > user.score) {                              // compare with their current score
              exports.updateData({ username: username }, { score: newScore }, function (err) {    // if new score is higher, update score
                  if (err) {
                      console.error('Error updating user score:', err);
                      return callbackFn(err);
                  }
                  console.log("User score updated.");       // log to console if successful
                  callbackFn(null);
              });
          } else {
              console.log("New score is not higher than existing score. No update performed.");   // if score is not higher, dont update
              callbackFn(null);
          }
      } else {
          console.log("User not found. Unable to update score.");
          callbackFn(err);
      }
  });
};

// Retrieves top 5 high scores sorted by score in descending order
exports.getHighscores = function (callbackFn) {
  myMongoClient.connect(url)
      .then(db => {
          var dbo = db.db(myDB);
          dbo.collection(mycollection).find({}, { projection: { _id: 0, username: 1, score: 1 } })    // finds every username and score in the array
              .sort({ score: -1 })      // sorts the items by their score
              .limit(5)                 // only gets the top 5
              .toArray()                // puts the 5 into an array
              .then(results => {
                  db.close();
                  console.log("Highscores:", results);    // logs the results and sends it through the callback function
                  callbackFn(null, results);
              })
              .catch(err => {
                  console.error("Error retrieving high scores:", err);
                  db.close();
                  callbackFn(err, null);
              });
      })
      .catch(function (err) {
          console.error("Error connecting to database:", err);
          callbackFn(err, null);
      });
};