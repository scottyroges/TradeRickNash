/**
 * Created by scottrogener on 12/30/15.
 */
'use strict';


var _ = require('lodash'),
    path = require('path'),
    mongo = require(path.resolve('./config/lib/mongo')),
    players = mongo.db().collection('players');

/**
 * test api
 */
exports.test = function (req, res) {
    players.findOne(function(err,doc){
        if(err){
            res.json({error:"sorry"});
        } else {
            res.json({message: doc});
        }
    });
};



/**
 * threeyears_reg_gPg api
 */
exports.threeyears_reg_gPg = function (req, res) {
    players.find({"playerinfo.playerPositionCode" : { "$in": [ "C", "R", "L" ]}}).toArray(function(err,docs){
        if(err){
            res.json({error:"sorry"});
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
                    if(player[key].reg){
                        games = games + player[key].reg.gamesPlayed;
                        goals = goals + player[key].reg.goals;
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
                    //caphit : numberWithCommas(caphit)
                    caphit : caphit
                };

                data.push(obj);
            }




            counter++;
            if(counter === docs.length){
                data.sort(compare_gPg);
                for(var i = 0; i < data.length; i++){
                    data[i].rank = i + 1;
                }
                res.json({data:data});
            }
        });
    });
};


/**
 * threeyears_playoffs_gPg api
 */
exports.threeyears_playoffs_gPg = function (req, res) {
    players.find({"playerinfo.playerPositionCode" : { "$in": [ "C", "R", "L" ]}}).toArray(function(err,docs){
        if(err){
            res.json({error:"sorry"});
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
                    if(player[key].playoffs){
                        games = games + player[key].playoffs.gamesPlayed;
                        goals = goals + player[key].playoffs.goals;
                    }

                    if(player[key]['cap-hit'] && player[key]['cap-hit'] > caphit){
                        caphit = player[key]['cap-hit'];
                    }
                }
            }

            var goalspergame = goals/games;

            if(games > 20){
                var obj = {
                    name : player.playerinfo.playerName,
                    games : games,
                    goals : goals,
                    gPg : goalspergame,
//                    caphit : numberWithCommas(caphit),
                    caphit : caphit
                };

                data.push(obj);
            }




            counter++;
            if(counter === docs.length){
                data.sort(compare_gPg);
                for(var i = 0; i < data.length; i++){
                    data[i].rank = i + 1;
                }
                res.json({data:data});
            }
        });
    });
};


function compare_gPg(a,b) {
    if (a.gPg > b.gPg)
        return -1;
    if (a.gPg < b.gPg)
        return 1;
    return 0;
}

function numberWithCommas(x) {
    return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}