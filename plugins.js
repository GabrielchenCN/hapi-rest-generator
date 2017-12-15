'use strict'

const Config = require('./pluginsConfig')
const Good = require('good');
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Test = require('./server/api/test')

const plugins = [
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
    //api route
    Test
]


module.exports = plugins