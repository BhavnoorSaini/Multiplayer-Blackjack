//Author: Nnamdi Nwanze
//Description: This database manager demonstrates the use of database operations including creating/deleting collections and inserting, searching and updating entries.
const config = require('./config.json');

const mycollection = config.mycollection;
const myDB = config.myDB;
var myMongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://"+config.username+":" + config.pwd +"@cluster0.yjzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


//set up the database
exports.setup = function () {
    let cbackfunc;
    testConnection(cbackfunc);
    createMyCollection(cbackfunc);
};
//create the database
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

//creates collection
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

//inserts a record of myobj into the database
// exports.insertRec = function (myobj) {
//     myMongoClient.connect(url)
//     .then(db => {
//       var dbo = db.db(myDB);
//       dbo.collection(mycollection).insertOne(myobj)
//       .then(()=>{
//         console.log("1 document inserted");
//         db.close();
//       })
//     })
//     .catch(function (err) {
//         throw err;
//     })
// };

//inserts a record of myobj into the database
exports.insertRec = function (myobj, callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
    var dbo = db.db(myDB);
    dbo.collection(mycollection).insertOne(myobj)
    .then(()=>{
      console.log("1 document inserted");
      db.close();
      if (callbackFn) callbackFn(null);
    })
    .catch(err => {
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
    dbo.collection(mycollection).findOne(data)
    .then(results=>{
      console.log("Results:", results);
      db.close();
      if (callbackFn) callbackFn(null, results);
    })
    .catch(err => {
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
    dbo.collection(mycollection).find({}).toArray()
    .then(results => {
      console.log("Usernames with Scores:");
      results.forEach(record => {
        console.log(`Username: ${record.username}, Score: ${record.score}`);
      });
      db.close();
      if (callbackFn) callbackFn(null, results);
    })
    .catch(err => {
      db.close();
      if (callbackFn) callbackFn(err);
    });
  })
  .catch(function (err) {
    if (callbackFn) callbackFn(err);
  });
};

//finds all records using a limit (if limit is 0 all records are returned)
exports.findAll = function (limit,callbackFn) {
    myMongoClient.connect(url)
    .then(db => { 
      var dbo = db.db(myDB);
      dbo.collection(mycollection).find({}).limit(0).toArray()
      .then(results=>{
        console.log("Results");
        console.log(results);
        db.close();
      })
    })
    .catch(function (err) {
        throw err;
    })
};
exports.deleteRec = function (query, callbackFn) {
  myMongoClient.connect(url, function(err, client) {
      if (err) {
          console.error("Error connecting to database:", err);
          return callbackFn(err);
      }
      var dbo = client.db(myDB);
      dbo.collection(mycollection).deleteOne(query, function(err, result) {
          if (err) {
              console.error("Error deleting record:", err);
              client.close();
              return callbackFn(err);
          }
          console.log("1 document deleted");
          client.close();
          if (callbackFn) callbackFn(null, result);
      });
  });
};

//deletes a collection
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

//updates queryData's data in the database to newdata
exports.updateData = function (data, updateFields, callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
      var dbo = db.db(myDB);
      dbo.collection(mycollection).updateOne(
          data,
          { $set: updateFields }
      )
      .then(result => {
          console.log("1 document updated");
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

  exports.findRec({ username: username }, function (err, user) {
      if (err) {
          console.error('Error finding user:', err);
          return callbackFn(err);
      }
      console.log('User found:', user);
      if (user) {
          console.log('Current Score:', user.score);
          if (newScore > user.score) {
              exports.updateData({ username: username }, { score: newScore }, function (err) {
                  if (err) {
                      console.error('Error updating user score:', err);
                      return callbackFn(err);
                  }
                  console.log("User score updated.");
                  callbackFn(null);
              });
          } else {
              console.log("New score is not higher than existing score. No update performed.");
              callbackFn(null);
          }
      } else {
          console.log("User not found. Unable to update score.");
          // Optionally, handle user not found: add user or return an error
          return callbackFn(new Error('User not found.'));
      }
  });
};

// Retrieves top 5 high scores sorted by score in descending order
exports.getHighscores = function (callbackFn) {
  myMongoClient.connect(url)
      .then(db => {
          var dbo = db.db(myDB);
          dbo.collection(mycollection).find({}, { projection: { _id: 0, username: 1, score: 1 } })
              .sort({ score: -1 })
              .limit(5)
              .toArray()
              .then(results => {
                  db.close();
                  console.log("Highscores:", results);
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