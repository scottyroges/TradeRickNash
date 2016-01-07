var _ = require('lodash');
var mongodb = require('mongodb');


connectToMongo(function(){
	closeMongoConnection();
});


function goalsPerGameReg_ThreeYears(_cb){
	players.find({"playerinfo.playerPositionCode" : { "$in": [ "C", "R", "L" ]}}).toArray(function(err,docs){
		if(err){
			console.log(err);
			_cb && _cb();
		}

		var counter = 0;

		var data = [];
		_.forEach(docs,function(player){
			

			var games = 0;
			var goals = 0;

			var caphit = 0;

			//console.log(JSON.stringify(player) + "\n");
			for(var key in player){
				if(player.hasOwnProperty(key) && key[0] === '2'){
					if(player[key]['reg']){
						games = games + player[key]['reg']['gamesPlayed'];
						goals = goals + player[key]['reg']['goals'];
					}

					if(player[key]['cap-hit'] && player[key]['cap-hit'] > caphit){
						caphit = player[key]['cap-hit'];
					}
				}
			}

			var goalspergame = goals/games;

			if(games > 100){
				var obj = {
					name : player.playerinfo.playerName,
					games : games,
					goals : goals,
					gPg : goalspergame,
					caphit : numberWithCommas(caphit)
				};

				data.push(obj);
			}
			
			
			

			counter++;
			if(counter === docs.length){
				data.sort(compare);
				for(var i = 0; i < 100; i++){
					console.log((i+1) + " ----------");
					console.log(data[i]);
				}
				reg_gPg = data;
				_cb && _cb();
			}
		});
	});
};

function pointsPerGameReg_ThreeYears(_cb){
	players.find({"playerinfo.playerPositionCode" : { "$in": [ "C", "R", "L" ]}}).toArray(function(err,docs){
		if(err){
			console.log(err);
			_cb && _cb();
		}

		var counter = 0;

		var data = [];
		_.forEach(docs,function(player){
			

			var games = 0;
			var points = 0;

			var caphit = 0;

			//console.log(JSON.stringify(player) + "\n");
			for(var key in player){
				if(player.hasOwnProperty(key) && key[0] === '2'){
					if(player[key]['reg']){
						games = games + player[key]['reg']['gamesPlayed'];
						points = points + player[key]['reg']['points'];
					}

					if(player[key]['cap-hit'] && player[key]['cap-hit'] > caphit){
						caphit = player[key]['cap-hit'];
					}
				}
			}

			var pointspergame = points/games;

			if(games > 100){
				var obj = {
					name : player.playerinfo.playerName,
					games : games,
					points : points,
					pPg : pointspergame,
					caphit : numberWithCommas(caphit)
				};

				data.push(obj);
			}
			
			
			

			counter++;
			if(counter === docs.length){
				data.sort(compare);
				var ricknash = 0;
				for(var i = 0; i < 200; i++){
					console.log((i+1) + " ----------");
					console.log(data[i]);
					if(data[i].name === "Rick Nash"){
						ricknash = i+1;
					}
				}
				console.log("Rick Nash ---- " + ricknash);
				_cb && _cb();
			}
		});
	});
};


function goalsPerGamePlayoffs_ThreeYears(_cb){

	players.find({"playerinfo.playerPositionCode" : { "$in": [ "C", "R", "L" ]}}).toArray(function(err,docs){
		if(err){
			console.log(err);
			_cb && _cb();
		}

		var counter = 0;

		var data = [];
		_.forEach(docs,function(player){
			

			var games = 0;
			var goals = 0;

			var caphit = 0;

			//console.log(JSON.stringify(player) + "\n");
			for(var key in player){
				if(player.hasOwnProperty(key) && key[0] === '2'){
					if(player[key]['playoffs']){
						games = games + player[key]['playoffs']['gamesPlayed'];
						goals = goals + player[key]['playoffs']['goals'];
					}

					if(player[key]['cap-hit'] && player[key]['cap-hit'] > caphit){
						caphit = player[key]['cap-hit'];
					}
				}
			}

			var goalspergame = goals/games;

			if(games > 10){
				var obj = {
					name : player.playerinfo.playerName,
					games : games,
					goals : goals,
					gPg : goalspergame,
					caphit : numberWithCommas(caphit)
				};

				data.push(obj);
			}
			
			
			

			counter++;
			if(counter === docs.length){
				data.sort(compare);
				var ricknash = 0;
				for(var i = 0; i < 200; i++){
					console.log((i+1) + " ----------");
					console.log(data[i]);
					if(data[i].name === "Rick Nash"){
						ricknash = i+1;
					}
				}

				console.log("Rick Nash ---- " + ricknash);
				playoffs_gPg = data;
				_cb && _cb();
			}
		});
	});
};


function pointsPerGamePlayoffs_ThreeYears(_cb){

	players.find({"playerinfo.playerPositionCode" : { "$in": [ "C", "R", "L" ]}}).toArray(function(err,docs){
		if(err){
			console.log(err);
			_cb && _cb();
		}

		var counter = 0;

		var data = [];
		_.forEach(docs,function(player){
			

			var games = 0;
			var points = 0;

			var caphit = 0;

			//console.log(JSON.stringify(player) + "\n");
			for(var key in player){
				if(player.hasOwnProperty(key) && key[0] === '2'){
					if(player[key]['playoffs']){
						games = games + player[key]['playoffs']['gamesPlayed'];
						points = points + player[key]['playoffs']['points'];
					}

					if(player[key]['cap-hit'] && player[key]['cap-hit'] > caphit){
						caphit = player[key]['cap-hit'];
					}
				}
			}

			var pointspergame = points/games;

			if(games > 10){
				var obj = {
					name : player.playerinfo.playerName,
					games : games,
					points : points,
					pPg : pointspergame,
					caphit : numberWithCommas(caphit)
				};

				data.push(obj);
			}
			
			
			

			counter++;
			if(counter === docs.length){
				data.sort(compare);
				var ricknash = 0;
				for(var i = 0; i < 200; i++){
					console.log((i+1) + " ----------");
					console.log(data[i]);
					if(data[i].name === "Rick Nash"){
						ricknash = i+1;
					}
				}
				console.log("Rick Nash ---- " + ricknash);
				_cb && _cb();
			}
		});
	});
};

function compare(a,b) {
  if (a.gPg > b.gPg)
    return -1;
  if (a.gPg < b.gPg)
    return 1;
  return 0;
}

function numberWithCommas(x) {
    return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeNulls(_cb){
	players.find().toArray(function(err,docs){
		if(err){
			console.log(err);
			_cb && _cb();
		}

		var counter = 0;

		var data = [];
		_.forEach(docs,function(player){
			
			for(var key in player){
				if(player.hasOwnProperty(key) && key[0] === '2'){
					if(player[key] === null){
						delete player[key];
					}
				}
			}

			players.save(player, function(err){
				if(err){
					console.log("issue saving");
				}
				counter++;
				if(counter === docs.length){
					_cb && _cb();
				}
			});
			
			
		});
	});
};


function playoff_clutchness(_cb){

	var differenceArray = [];

	_.forEach(playoffs_gPg,function(player){
		var result = _.find(reg_gPg, {name:player.name});
		if(result){
			var difference = player.gPg/result.gPg;
			var obj = {
				name : player.name,
				reg : result.gPg,
				playoffs: player.gPg,
				diff : difference,
				caphit : player.caphit
			};
			differenceArray.push(obj);
		}
	});

		differenceArray.sort(diff_compare);
		var ricknash = 0;
		for(var i = 0; i < differenceArray.length; i++){
			console.log((i+1) + " ----------");
			console.log(differenceArray[i]);
			if(differenceArray[i].name === "Rick Nash"){
				ricknash = i+1;
			}
		}

		console.log("Rick Nash ---- " + ricknash);
		_cb && _cb();
	

}

function diff_compare(a,b){
	if (a.diff > b.diff)
    return -1;
  if (a.diff < b.diff)
    return 1;
  return 0;
}

var dbConnection,
  players;

var reg_gPg, playoffs_gPg;
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
      goalsPerGameReg_ThreeYears(function(){
      		goalsPerGamePlayoffs_ThreeYears(function(){
      			playoff_clutchness(function(){
			      	_cb();
			      });
      		})
      });
      
    }
  });
}

function closeMongoConnection(){
  //Close connection
  dbConnection.close();
  console.log("Connection closed");
}

