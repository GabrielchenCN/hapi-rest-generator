'use strict';
const Boom = require('boom');
const Whoosh = require('../utils/whoosh');
const Joi = require('joi');
const requestClient = require('request');
const Config = require('../../config');
const multiparty = require('multiparty');
const fs = require('fs');


const FaceRecognitionApiPlugin = {
    register: function(server, options, next) {
        //support microsoft azure
        server.route({
            method: 'POST',
            path: '/faceRecognition/microsoft/json',
            config: {
                tags: ['api'], // ADD THIS TAG
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                validate: {
                    payload: {
                        url: Joi.string().required(),
                    }
                },
            },
            handler: function(requset, reply) {
                let oPayload = requset.payload;
                const params = {
                    "returnFaceId": "true",
                    "returnFaceLandmarks": "true",
                    "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
                };
                const options = {
                    url: Config.microsoftAzure.faceRecognitionEndPoint + "/detect",
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': Config.microsoftAzure.facekey1,
                    },
                    json: true,
                    qs: params,
                    body: oPayload

                };

                requestClient.post(options, function(err, rs, body) {
                    if (rs.statusCode === 200) {

                        reply(Whoosh.OK(rs.body));
                    }
                    if (rs.statusCode !== 200) {
                        reply(Boom.badRequest(rs.body));
                    }

                });
            }
        });

        server.route({
            method: 'POST',
            path: '/faceRecognition/microsoft/stream',
            config: {
                tags: ['api'], // ADD THIS TAG
                validate: {
                    payload: {
                        code: Joi.string().required(),
                    }
                },
            },
            handler: function(requset, reply) {
                reply(Whoosh.OK(requset.payloadType));

            }
        });

        server.route({
            method: 'POST',
            path: '/faceRecognition/facePlus/detect',
            config: {
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                tags: ['api'],
                payload: {
                    maxBytes: 2097152,
                    parse: true,
                    output: 'stream',
                    allow: 'multipart/form-data'
                },
                validate: {
                    payload: {
                        image_file: Joi.object().required().meta({ swaggerType: 'file' }),
                    }
                },
            },
            handler: function(requset, reply) {
                let oPayload = requset.payload;

                console.log(oPayload.image_file);
                var formData = {
                    api_key: Config.facePlus.faceKey,
                    api_secret: Config.facePlus.faceSecret,
                    image_file: {
                        value:Buffer.from(oPayload.image_file._data),
                        options: {
                            filename: 'face.jpg'
                        }
                    },
                    return_attributes: "gender,age,smiling,headpose,facequality,blur,eyestatus,emotion,ethnicity,beauty,mouthstatus,eyegaze,skinstatus",

                };
                const options = {
                    url: Config.facePlus.faceRecognitionEndPoint + "/detect",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    formData: formData

                };
                requestClient.post(options, function(err, res, body) {
             
                   
                    if (res.statusCode === 200) {

                        reply(Whoosh.OK(JSON.parse(res.body)));
                    }
                    if (res.statusCode !== 200) {
                        //the api return a json-like string.
                        var message = JSON.parse(res.body).error_message;

                        reply(Boom.badRequest(message));
                    }

                });

            }

        });


        next();
    }
};


FaceRecognitionApiPlugin.register.attributes = {
    name: 'Face Recognition integration API Template',
    version: '1.0.0'
};
module.exports = FaceRecognitionApiPlugin