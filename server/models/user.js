'use strict';
const mongodb = require('../../mongodb');
const mongoose = mongodb.mongoose;
const UserSchema = require('../schema/user');
let User = null;
try {
    User = mongoose.model('User', UserSchema);
} catch (e) {
    throw e
}



exports = module.exports = User