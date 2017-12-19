'use strict';
const mongodb = require('../../mongodb');
const mongoose = mongodb.mongoose;
const SessionSchema = require('../schema/session');
let Session = null;
try {
    Session = mongoose.model('Session', SessionSchema);
} catch (e) {
    throw e
}



exports = module.exports = Session