'use strict';

const TestApiPlugin = {
    register: function(server, options, next) {
        server.route({
            method: 'GET',
            path: '/test',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: function(request, reply) {
                reply('test passed');
            }
        });
        server.route({
            method: 'GET',
            path: '/',
            config: {
                tags: ['api'], // ADD THIS TAG

            },
            handler: function(request, reply) {
                reply('Hello, world!');
            }
        });

        next();
    }
};


TestApiPlugin.register.attributes = {
    name: 'test api',
    version: '1.0.0'
};
module.exports = TestApiPlugin