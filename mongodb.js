'use strict';
const Config = require('./config');
const mongoose = require('mongoose');
const mongoosed = mongoose.connect(Config.mongodb.uri);
const connector = mongoosed.connection;
module.exports.connector = connector
module.exports.mongoose = mongoosed