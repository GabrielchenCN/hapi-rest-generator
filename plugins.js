'use strict'

const Config = require('./pluginsConfig')
const Good = require('good')
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const BasicRestApi = require('./server/api/BasicRestApi')
const BasicUploadApi = require('./server/api/BasicUploadApi')
const TokenAuthApi = require('./server/api/TokenAuthApi')
const StaticServerPlugin = require('./server/api/StaticFilesHandler')
const FaceRecognitionApiPlugin = require('./server/api/FaceRecognitionApi')
const HapiAuth = require('./server/api/HapiAuthPlugin');

const plugins = [
    HapiAuth,
    {
        register: Good,
        options: Config.plugin.Good.options
    },
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: Config.plugin.swagger.options
    },
    //static server handler
    StaticServerPlugin,
    //api route
    BasicRestApi,
    BasicUploadApi,
    TokenAuthApi,
    FaceRecognitionApiPlugin
]


module.exports = plugins