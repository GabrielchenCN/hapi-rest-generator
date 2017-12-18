'use strict';
const mongodb = require('../../mongodb');
const mongoose = mongodb.mongoose;
const SessionSchema = mongoose.Schema({
    token: String,
    createdAt: { type: Date, expires: '1.5h' },
    _user : { type: Schema.Types.ObjectId, ref: 'user' }
}, { collection: 'session' });

UserSchema.methods.show = function() {
    console.log(this.name, this.age);
}

exports = module.exports = SessionSchema