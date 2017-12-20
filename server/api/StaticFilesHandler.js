'use strict';
const Joi = require('joi');


const StaticServerPlugin = {
    register: function(server, options, next) {

        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: 'public',
                    listing: true,
                    index:['index.html', 'default.html']
                }
            }
        });


        next();
    }
};

StaticServerPlugin.register.attributes = {
    name: 'Static Server',
    version: '1.0.0'
};
module.exports = StaticServerPlugin