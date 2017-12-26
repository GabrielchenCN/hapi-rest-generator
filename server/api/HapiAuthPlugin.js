'use strict';
const Boom = require('boom');
const Whoosh = require('../utils/whoosh');
const Session = require('../models/session');
const user = require('../models/user');
const plugins = {
    register: require('hapi-acl-auth'),
    options: {
        handler: function(request, callback) {
            // callback(err, obj) takes an error object and an arbitrary object, although
            // this object must contain a `roles` attribute that contains an array of
            // roles, or a function that returns an array of roles or returns a promise
            // that resolves an array of roles, that are possessed by the user
            let oHeader = request.headers
            if (!oHeader.token) {
                callback(null, { roles: [] });
            } else {
                Session.findOne({ token: oHeader.token }, function(err, session) {
                    if (err) {
                        callback(null, { roles: [] });
                    } else {
                        if (!session) {
                        	  console.log('no session');
                            callback(null, { roles: []});
                        } else {
                            Session.populate(session, { path: '_user' }, function(err, sessionPop) {
                                console.log(sessionPop._user.roles);
                            
                                callback(null, { roles: sessionPop._user.roles });
                            })
                        }
                    }


                })
            }

            // callback(null, { username: "", roles: ['USER']});

        },
        hierarchy: ['USER', 'ADMIN'],
        //enable cache, if use the token auth will has some issue.
        // cache: true,
        policy: "deny"
    },
}


plugins.register.attributes = {
    name: 'Basic token auth Template',
    version: '1.0.0'
};
exports = module.exports = plugins