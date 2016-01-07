console.log("starting nhlstats");

var http = require('http');
var _ = require('lodash');
var mongodb = require('mongodb');




connectToMongo(function(){
  closeMongoConnection();
});

var dbConnection,
  players;
function connectToMongo(_cb){
  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;

  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://localhost:27017/nhldb';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);
      dbConnection = db;
      // do some work here with the database.

      players = db.collection('players');
      _cb && _cb();

      
    }
  });
}

function closeMongoConnection(){
  //Close connection
  dbConnection.close();
  console.log("Connection closed");
}

var regularseason
function get20142015RegularSeasonStats(_cb){
  http.request({
    host: 'www.nhl.com',
    path: '/stats/rest/individual/skaters/season/goals?cayenneExp=seasonId=20142015%20and%20gameTypeId=2'
  }, function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
       regularseason= JSON.parse(str).data;
       _cb && _cb();
    });
  }).end();

}

var postseason;
function get20142015PostSeasonStats(_cb){
  http.request({
    host: 'www.nhl.com',
    path: '/stats/rest/individual/skaters/season/goals?cayenneExp=seasonId=20142015%20and%20gameTypeId=3'
  }, function(response){
      var str = '';
      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
          postseason = JSON.parse(str).data;
          _cb && _cb();
      });
  }).end();
}

var GPG = [];
function manipulation(){
  _.forEach(postseason,function(post_stats){
      reg_stats = _.find(regularseason, function(obj) { return obj.playerId == post_stats.playerId });
      if(typeof reg_stats != "undefined"){
        var mystat = post_stats.goalsPerGame/reg_stats.goalsPerGame;
        GPG.push({name:reg_stats.playerName,regular_GPG:reg_stats.goalsPerGame, post_GPG:post_stats.goalsPerGame, mystat:mystat });
      }
      
  });
  function regSort(a,b){
    if (a.regular_GPG > b.regular_GPG)
      return -1;
    if (a.regular_GPG < b.regular_GPG)
      return 1;
    return 0;
  }
  GPG.sort(regSort);

  var mystatarray = [];
  for(var i = 0; i < 50; i++){
    mystatarray.push(GPG[i]);
  }

  function mystatSort(a,b){
    if (a.mystat > b.mystat)
      return -1;
    if (a.mystat < b.mystat)
      return 1;
    return 0;
  }
  mystatarray.sort(mystatSort);
  for(var i = 0; i < 50; i++){
    console.log((i+1)+ ". " + mystatarray[i].name + "  " + mystatarray[i].mystat + "      " + mystatarray[i].regular_GPG + "      " + mystatarray[i].post_GPG );
  }
}







