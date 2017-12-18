'use strict';
const Boom = require('boom');
const Whoosh = require('../utils/whoosh');
// const Handler = require('./handlers/TokenAuthHandler');
const Joi = require('joi');
const User = require('../models/user');
const crypto = require('crypto');


const TokenAuthApiPlugin = {
    register: function(server, options, next) {

        server.route({
            method: 'POST',
            path: '/login',
            config: {
                tags: ['api'], // ADD THIS TAG
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().min(6).max(12).required(),
                    }
                },
            },
            handler: function(request, reply) {
                let email = request.payload.email;
                let res = null;
                let docPOJO = null;
                User.findOne({ email: email }, function(err, docs) {

                    if (err) return reply(Boom.badRequest());
                    if (!docs) {
                        reply(Whoosh.NoContent(docs, 'user is not exist'));
                    } else {
                        docPOJO = docs.toObject();
                        res = Object.assign({}, docPOJO, { token: UUIDGenerator() });
                        console.log(res);
                        reply(Whoosh.OK(res));
                    }

                })
            }
        });


        next();
    }
};
const UUIDGenerator = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.randomBytes(256)[0] & 15 >> c / 4).toString(16)
    );


TokenAuthApiPlugin.register.attributes = {
    name: 'Token Auth API Template',
    version: '1.0.0'
};
module.exports = TokenAuthApiPlugin