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
// exports.findRec = function (data, callbackFn) {
//     myMongoClient.connect(url)
//     .then(db => { 
//       var dbo = db.db(myDB);
//       dbo.collection(mycollection).findOne(data)
//       .then(results=>{
//         console.log("Results");
//         console.log(results);
//         db.close();
//       })
//     })
//     .catch(function (err) {
//         throw err;
//     })
// };

//finds a single record with information contained in data
exports.findRec = function (data, callbackFn) {
  myMongoClient.connect(url)
  .then(db => { 
    var dbo = db.db(myDB);
    dbo.collection(mycollection).findOne(data)
    .then(results=>{
      console.log("Results");
      console.log(results);
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

// finds all records and prints usernames
exports.printAllUsernames = function (callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
    var dbo = db.db(myDB);
    dbo.collection(mycollection).find({}).toArray()
    .then(results => {
      console.log("Usernames:");
      results.forEach(record => {
        console.log(record.username);
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
exports.updateData = function (queryData, newdata, callbackFn) {
    myMongoClient.connect(url)
    .then(db => { 
      var dbo = db.db(myDB);
      dbo.collection(mycollection).updateOne(queryData, {$set: newdata})
      .then(results=>{
        console.log("1 document updated");
        db.close();
      })
    })
    .catch(function (err) {
        throw err;
    })
};

