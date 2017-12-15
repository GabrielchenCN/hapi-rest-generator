'use strict';

const Hapi = require('hapi');
const Config = require('./config');
const Plugins = require('./plugins');


const server = new Hapi.Server();
server.connection({ port: 3001, host: 'localhost' });





server.register(Plugins, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});