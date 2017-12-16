'use strict';

const Hapi = require('hapi');
const Config = require('./config');
const Plugins = require('./plugins');
const fs = require('fs');


const server = new Hapi.Server();
server.connection(Config.server);

const preResponse = function(request, reply) {

    const response = request.response;
    if (request.app.Template) {
        console.log("remove:" + request.app.Template[0]);
        fs.stat(request.app.Template[0].path, function(err,stats) {
            if (stats) {
                //Show in green
               
                fs.unlink(request.app.Template[0].path);
            } else {
                //Show in red
              	console.log("not found")
            }
        });
    }

    return reply.continue();
};

server.ext('onPreResponse', preResponse);
server.register(Plugins, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
        server.log('info', 'Swagger running at: ' + Config.swagger.uri);
    });
});