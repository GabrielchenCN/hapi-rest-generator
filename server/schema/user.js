'use strict';
const mongodb = require('../../mongodb');
const mongoose = mongodb.mongoose;
const UserSchema = mongoose.Schema({
    email: { type: String, required: true,unique: true , validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ },
    name: String,
    age: String,
    createdAt: { type: Date,default: Date.now, expires: '1.5h' },
}, { collection: 'user' });

UserSchema.methods.show = function() {
    console.log(this.name, this.age);
}

exports = module.exports = UserSchema