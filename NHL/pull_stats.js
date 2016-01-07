var http = require('http');
var _ = require('lodash');
var mongodb = require('mongodb');

console.log("pull stats");


var completeData = [];

var categories = ['skatersummary', 'goals', 'points', 'assists', 'plusminus'];
var years = ['20142015', '20132014', '20122013'];
var gameTypes = [2,3];


var i = 0;
var j = 0;
var k = 0;

function init(){
	loopYears(years, function(){
		console.log("finished looping");
		connectToMongo(function(){
		  closeMongoConnection();
		});
	});
}

init();


function loopYears(years, _cb){
	loopCategories(categories, function(){
        i++;

        // any more items in array? continue loop
        if(i < years.length) {
            loopYears(years,_cb);   
        } else {
        	i = 0;
        	_cb();
        }
	});
}

function loopCategories(categories, _cb){
	loopGameTypes(gameTypes, function(){
        j++;

        // any more items in array? continue loop
        if(j < categories.length) {
            loopCategories(categories,_cb);   
        } else {
        	j= 0;
        	_cb();
        }
	});

}

function loopGameTypes(gameTypes, _cb){
	statsCall(categories[j], years[i], gameTypes[k], function(data){
		var type;
		if(gameTypes[k] === 2){
			type = "reg";
		} else if (gameTypes[k] === 3){
			type = "playoffs";
		}

		if(categories[j] === 'skatersummary') {
			_.forEach(data, function(player){
				var result = _.find(completeData, { playerId : player.playerId});
				if(!result){
					var obj = {
						playerId : player.playerId,
						playerinfo : {
							playerFirstName : player.playerFirstName,
							playerLastName : player.playerLastName,
							playerName : player.playerName,
							playerPositionCode : player.playerPositionCode
						}
					};
					obj[years[i]] = {};
					obj[years[i]][type] = {
						playerTeamsPlayedFor : player.playerTeamsPlayedFor,
						assists : player.assists,
						faceoffWinPctg : player.faceoffWinPctg,
						gamesPlayed : player.gamesPlayed,
						goals : player.goals,
						penaltyMinutes : player.penaltyMinutes,
						plusMinus : player.plusMinus,
						points : player.points,
						shiftsPerGame : player.shiftsPerGame,
						shootingPctg : player.shootingPctg,
						shots : player.shots,
						timeOnIcePerGame : player.timeOnIcePerGame
					};
					completeData.push(obj);
				} else {
					if(!result[years[i]]){
						result[years[i]] = {};
					}
					result[years[i]][type] = {
						playerTeamsPlayedFor : player.playerTeamsPlayedFor,
						assists : player.assists,
						faceoffWinPctg : player.faceoffWinPctg,
						gamesPlayed : player.gamesPlayed,
						goals : player.goals,
						penaltyMinutes : player.penaltyMinutes,
						plusMinus : player.plusMinus,
						points : player.points,
						shiftsPerGame : player.shiftsPerGame,
						shootingPctg : player.shootingPctg,
						shots : player.shots,
						timeOnIcePerGame : player.timeOnIcePerGame
					};
					
				}
			});
		
		} else if(categories[j] === 'goals'){
			_.forEach(data, function(player){
				var result = _.find(completeData, { playerId : player.playerId});
				result[years[i]][type]['goals_details'] = {
					enGoals : player.enGoals,
					evGoals : player.evGoals,
					firstGoals : player.firstGoals,
					gameWinningGoals : player.gameWinningGoals,
					goalsPerGame : player.goalsPerGame,
					otGoals : player.otGoals,
					penaltyShotAttempts : player.penaltyShotAttempts,
					penaltyShotGoals : player.penaltyShotGoals,
					ppGoals : player.ppGoals,
					shGoals : player.shGoals
				};
			});

		} else if(categories[j] === 'points'){
			_.forEach(data, function(player){
				var result = _.find(completeData, { playerId : player.playerId});
				result[years[i]][type]['points_details'] = {
					evPoints : player.evPoints,
					pointsPerGame : player.pointsPerGame,
					ppPoints : player.ppPoints,
					shPoints : player.shPoints
				};
			});

			
		} else if(categories[j] === 'assists'){
			_.forEach(data, function(player){
				var result = _.find(completeData, { playerId : player.playerId});
				result[years[i]][type]['assists_details'] = {
					assistsPerGame : player.assistsPerGame,
					evAssists : player.evAssists,
					ppAssists : player.ppAssists,
					shAssists : player.shAssists
				};
			});
			
		} else if(categories[j] === 'plusminus'){
			_.forEach(data, function(player){
				var result = _.find(completeData, { playerId : player.playerId});
				result[years[i]][type]['plusminus_details'] = {
					homePlusMinus : player.homePlusMinus,
					roadPlusMinus : player.roadPlusMinus
				};
				result[years[i]][type]['ppTeamGoalsAgainst'] = player.ppTeamGoalsAgainst;
				result[years[i]][type]['ppTeamGoalsFor'] = player.ppTeamGoalsFor;
				result[years[i]][type]['teamGoalsAgainst'] = player.teamGoalsAgainst;
				result[years[i]][type]['teamGoalsFor'] = player.teamGoalsFor;
			});
			
		}

        k++;
        // any more items in array? continue loop
        if(k < gameTypes.length) {
            loopGameTypes(gameTypes, _cb);   
        } else {
        	k = 0;
        	_cb();
        }
	} );
}



function statsCall(category, year, gameType, _cb){
	var path = '/stats/rest/individual/skaters/season/' + category + '?cayenneExp=seasonId=' + year + '%20and%20gameTypeId=' + gameType;
	console.log(path);
	http.request({
	    host: 'www.nhl.com',
	    path: path
	  }, function(response) {
	    var str = '';

	    //another chunk of data has been recieved, so append it to `str`
	    response.on('data', function (chunk) {
	      str += chunk;
	    });

	    //the whole response has been recieved, so we just print it out here
	    response.on('end', function () {
	       _cb && _cb(JSON.parse(str).data);
	    });
	  }).end();

}




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
      players.insertMany(completeData, function(err, result) {
	  	if(err){
	  		console.log("issue uploading to mongo");
	  		_cb && _cb();
	  	} else {
	  		console.log("mongo upload successful");
	  		_cb && _cb();
	  	}
	    
	  });
      

      
    }
  });
}

function closeMongoConnection(){
  //Close connection
  dbConnection.close();
  console.log("Connection closed");
}

