'use strict';
const mongodb = require('../../mongodb');
const mongoose = mongodb.mongoose;
const SessionSchema = mongoose.Schema({
    token: String,
    createdAt: { type: Date,  default: Date.now,expires: '1.5h' },
    _user : { type: mongoose.Schema.ObjectId, ref: 'user' }
}, { collection: 'session' });




exports = module.exports = SessionSchema