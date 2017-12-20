'use strict';
const Boom = require('boom');
const Whoosh = require('../utils/whoosh');
const Handler = require('./handlers/AuthHandler');
const Joi = require('joi');
const User = require('../models/user');
const Session = require('../models/session');
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
                        password: Joi.string().min(6).max(12).required()
                    }
                },
            },
            handler: Handler.tokenAuth.handler
        });

        server.route({
            method: 'POST',
            path: '/wxlogin',
            config: {
                tags: ['api'], // ADD THIS TAG
                validate: {
                    payload: {
                        code: Joi.string().required(),
                    }
                },
            },
            handler: Handler.wxLogin.handler
        });

        server.route({
            method: 'POST',
            path: '/wxUser',
            config: {
                tags: ['api'], // ADD THIS TAG
                validate: {
                    payload: {
                        rawData: Joi.string().required(),
                        signature: Joi.string().required(),
                        encryptedData: Joi.string().required(),
                        iv: Joi.string().required()

                    }
                },
            },
            handler: Handler.wxUser.handler
        });


        next();
    }
};


TokenAuthApiPlugin.register.attributes = {
    name: 'Token Auth API Template',
    version: '1.0.0'
};
module.exports = TokenAuthApiPlugin