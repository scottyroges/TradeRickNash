var fs = require('fs');
var _ = require('lodash');
var mongodb = require('mongodb');
var cheerio = require("cheerio");


var years = ['2014', '2013', '2012'];
var categories = ['cash', 'cap-hit','contract-value'];

var completeData = [];


var i = 0,
	k = 0;


//cash = Total Salary

var unmatchedplayers = 0;
var matchedplayers = 0;
var initialunmatched = 0;
function init(){
	loopYears(years, function(){
		console.log("finished looping");
		//console.log(completeData);
		connectToMongo(function(){
			console.log("Initial unmatched players = " + initialunmatched );
			console.log("Unmatched players = " + unmatchedplayers );
			console.log("Matched players by last name = " + matchedplayers );
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

	pulldata(years[i], categories[k],function(data){

		_.forEach(data, function(player){
				var result = _.find(completeData, { name : player.name});
				if(!result){
					var obj = {
						name : player.name
						
					};
					obj[years[i]] = {};
					obj[years[i]][categories[k]] = player.salary;
					
					completeData.push(obj);
				} else {
					if(!result[years[i]]){
						result[years[i]] = {};
					}
					result[years[i]][categories[k]] = player.salary;;
					
				}
			});


		k++;
        // any more items in array? continue loop
        if(k < categories.length) {
            loopCategories(categories, _cb);   
        } else {
        	k = 0;
        	_cb();
        }
	});
	

}


function pulldata(year, category, _cb){
	var filename = 'salarypages/' + year + '_' + category + '.htm';
	console.log(filename);
	fs.readFile(filename, function(err,data){
		if(err){
			console.log("issue reading file");
			_cb && _cb();
		}
		var results = [];
		var $ = cheerio.load(data);
		var name_dom = $(".rank-name h3 a");
		console.log("number of results  : " + name_dom.length );
		var salary_dom = $(".rank-value .info");
		var position_dom = $(".rank-position");
		for(var t = 0; t < name_dom.length; t++){
			var name = name_dom[t].children[0].data;


			//special cases name edits
			if(name === "Nicklas Grossman") {
				name = "Nicklas Grossmann"
			} else if(name === "Thomas Wilson") {
				name = "Tom Wilson"
			} else if(name === "Mats Zuccarello-Aasen"){
				name = "Mats Zuccarello";
			} else if(name === "Marcus Johannson"){
				name = "Marcus Johansson";
			}
			var salary = salary_dom[t].children[0].data;
			var position = position_dom[t].children[0].data;
			var obj = {
		   		name : name,
		   		salary : salary
		   	};
		   	if(position !== "Goaltender") {
		   		results.push(obj);
		   	}
		   
		}
		_cb && _cb(results);
	})
	// var path = '/nhl/rankings/' + year + '/' + category + '/';
	// console.log(path);
	// http.request({
	//     host: 'www.spotrac.com',
	//     path: path,
	//     method: 'GET'
	//   }, function(response) {
	//     var str = '';

	//     //another chunk of data has been recieved, so append it to `str`
	//     response.on('data', function (chunk) {
	//       str += chunk;
	//     });

	//     //the whole response has been recieved, so we just print it out here
	//     response.on('end', function () {

	//        var results = [];
	//        console.log(str);
	//        var $ = cheerio.load(str);
	//        var name_dom = $(".rank-name h3 a");
	//        console.log("number of results  : " + name_dom.length );
	//        var salary_dom = $(".rank-value .info");
	//        for(var t = 0; t < name_dom.length; t++){
	//        		var name = name_dom[t].children[0].data;
	//        		var salary = salary_dom[t].children[0].data;
	//        		var obj = {
	// 	       		name : name,
	// 	       		salary : salary
	// 	       };
	// 	       results.push(obj);
	//        }
	//        console.log(results);
	//        _cb(results);
	//     });
	//   }).end();
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
      var counter = 0;
      
      _.forEach(completeData, function(player){
      		var regex = new RegExp(["^", player.name, "$"].join(""), "i");
      		players.find({"playerinfo.playerName": regex}).toArray(function(err,docs){
      			if(err){
      				console.log(err);
      			}
      			if(!docs || docs.length === 0){
      				var nameparts = player.name.split(" ");
      				var lastname = nameparts[nameparts.length -1];
      				//console.log("couldnt find player " + player.name);
      				initialunmatched++;
      				//var lastnameregex = new RegExp(["^", nameparts[nameparts.length -1], "$"].join(""), "i");
      				players.find({"playerinfo.playerLastName": lastname}).toArray(function(lnerr,lndocs){
      					if(lnerr){
      						console.log(lnerr);
      					}
      					if(!lndocs || lndocs.length === 0){
      						//console.log("couldnt find player " + player.name + " by last name either " + lastname);
      						// if(player['2014']){
      						// 	if(player['2014']['cap-hit']){
      						// 		var number = Number(player['2014']['cap-hit'].replace(/[^0-9\.]+/g,""));
	      					// 		if(number > 500000){
	      					// 			console.log("!!!!!!!!!!!!!!!!!!!!! " + player.name + " 2014 cap-hit " + player['2014']['cap-hit']);
	      					// 		} else {
	      					// 			console.log(player.name + " 2014 cap-hit " + player['2014']['cap-hit']);
	      					// 		}
      						// 	} else if (player['2014']['cash']) {
      						// 		var number = Number(player['2014']['cash'].replace(/[^0-9\.]+/g,""));
	      					// 		if(number > 500000){
	      					// 			console.log("!!!!!!!!!!!!!!!!!!!!! " + player.name + " 2014 cash " + player['2014']['cash']);
	      					// 		} else {
	      					// 			console.log(player.name + " 2014 cash " + player['2014']['cash']);
	      					// 		}
      						// 	} else {
      						// 		console.log(player.name + " 2014 cap-hit " + player['2014']['cap-hit']);
      						// 	}
      							
      							
      						// } else if(player['2013']){
      						// 	console.log(player.name + " 2013 cap-hit "  + player['2013']['cap-hit']);
      						// } else if(player['2012']){
      						// 	console.log(player.name + " 2012 cap-hit "  + player['2012']['cap-hit']);
      						// }
      						unmatchedplayers++;

      						counter++;
		      				if(counter === completeData.length){
		      					_cb && _cb();
		      				}
      					} else if(lndocs && lndocs.length > 1){
      						//console.log("too many last names to match " + player.name);
      						// if(player['2014']){
      						// 	if(player['2014']['cap-hit']){
      						// 		var number = Number(player['2014']['cap-hit'].replace(/[^0-9\.]+/g,""));
	      					// 		if(number > 500000){
	      					// 			console.log("!!!!!!!!!!!!!!!!!!!!! " + player.name + " 2014 cap-hit " + player['2014']['cap-hit']);
	      					// 		} else {
	      					// 			console.log(player.name + " 2014 cap-hit " + player['2014']['cap-hit']);
	      					// 		}
      						// 	} else if (player['2014']['cash']) {
      						// 		var number = Number(player['2014']['cash'].replace(/[^0-9\.]+/g,""));
	      					// 		if(number > 500000){
	      					// 			console.log("!!!!!!!!!!!!!!!!!!!!! " + player.name + " 2014 cash " + player['2014']['cash']);
	      					// 		} else {
	      					// 			console.log(player.name + " 2014 cash " + player['2014']['cash']);
	      					// 		}
      						// 	} else {
      						// 		console.log(player.name + " 2014 cap-hit " + player['2014']['cap-hit']);
      						// 	}
      							
      							
      						// } else if(player['2013']){
      						// 	console.log(player.name + " 2013 cap-hit "  + player['2013']['cap-hit']);
      						// } else if(player['2012']){
      						// 	console.log(player.name + " 2012 cap-hit "  + player['2012']['cap-hit']);
      						// }
      						unmatchedplayers++;

      						counter++;
		      				if(counter === completeData.length){
		      					_cb && _cb();
		      				}
      					} else {
      						matchedplayers++;

      						var updatedplayer = lndocs[0];
		      				for(var key in player){
		      					if(player.hasOwnProperty(key)){
		      						if(key !== "name"){
		      							var yearend = Number(key) + 1;
		      							var newkey = key + "" + yearend;

		      							var mongostats = updatedplayer[newkey];
		      							var salarystats = player[key];
		      							var combined = _.extend(mongostats, salarystats);

		      							updatedplayer[newkey] = combined;
		      							
		      							
		      						}
		      					}
		      				}
		      				players.save(updatedplayer,{}, function(err, doc){
		      					if(err){
		      						console.log(err);
		      					}
		      					counter++;
			      				if(counter === completeData.length){
			      					_cb && _cb();
			      				}
		      				});	
      					}
      				});
      			} else {
      				var updatedplayer = docs[0];
      				for(var key in player){
      					if(player.hasOwnProperty(key)){
      						if(key !== "name"){
      							var yearend = Number(key) + 1;
      							var newkey = key + "" + yearend;

      							var mongostats = updatedplayer[newkey];
      							var salarystats = player[key];
      							var combined = _.extend(mongostats, salarystats);

      							updatedplayer[newkey] = combined;
      							
      							
      						}
      					}
      				}
      				players.save(updatedplayer,{}, function(err, doc){
      					if(err){
      						console.log(err);
      					}
      					counter++;
	      				if(counter === completeData.length){
	      					_cb && _cb();
	      				}
      				});	
      			}
      			
      		});
      });
      

      
    }
  });
}

function closeMongoConnection(){
  //Close connection
  dbConnection.close();
  console.log("Connection closed");
}

