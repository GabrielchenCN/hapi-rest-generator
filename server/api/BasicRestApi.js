'use strict';
const Boom = require('boom');
const Whoosh = require('../utils/whoosh');
const Handler = require('./handlers/BasicRestHandler');

const BasicRestApiPlugin = {
    register: function(server, options, next) {

        server.route({
            method: 'GET',
            path: '/',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: function(request, reply) {

                reply(Whoosh.OK());
            }
        });
        server.route({
            method: 'GET',
            path: '/users',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: Handler.GetUsers.handler
        });
        server.route({
            method: 'GET',
            path: '/user/{_id}',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: Handler.GetUser.handler
        });
        server.route({
            method: 'POST',
            path: '/user',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: Handler.SaveUsers.handler
        });
        server.route({
            method: 'PUT',
            path: '/user',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: Handler.PutUsers.handler
        });
        server.route({
            method: 'DELETE',
            path: '/user',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: Handler.DelUsers.handler
        });

        /* 
         The supported mime types are:
        application/json
        application/x-www-form-urlencoded
        application/octet-stream
        text/*
        multipart/form-data
        */
        server.route({
            method: 'POST',
            path: '/parse/user',
            config: {
                tags: ['api'], // ADD THIS TAG

                payload: {
                    output: 'data',
                    parse: true,
                }

            },
            handler: function(request, reply) {
                const oPayload = request.payload;
                // if not encodeURIComponent, will be attack by content injection attacks
                // reply({ Params: sParams });
                // reply({ Params: encodeURIComponent(sParams) });
                const response = reply(Whoosh.Created(oPayload));
                response.statusCode = Whoosh.Created().statusCode;
            }
        });

        server.route({
            method: 'get',
            path: '/badRequest',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: function(request, reply) {

                reply(Boom.badRequest('invalid query'));
            }
        });

        next();
    }
};


BasicRestApiPlugin.register.attributes = {
    name: 'Basic Restful API Template',
    version: '1.0.0'
};
module.exports = BasicRestApiPlugin