/**
 * Created by scottrogener on 12/30/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    chalk = require('chalk'),
    path = require('path'),
    mongodb = require('mongodb').MongoClient,
    dbConnection = null;

module.exports.db = function(){
    return dbConnection;
};

// Initialize Mongoose
module.exports.connect = function (cb) {
    var _this = this;


    mongodb.connect(config.db.uri, config.db.options,function (err, db) {
        if (err) {
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(err);
        } else {

            dbConnection = db;

            // Call callback FN
            if (cb) cb(db);
        }
    });
};

module.exports.disconnect = function (cb) {

    dbConnection.close(function (err) {
        console.info(chalk.yellow('Disconnected from MongoDB.'));
        cb(err);
    });
};
