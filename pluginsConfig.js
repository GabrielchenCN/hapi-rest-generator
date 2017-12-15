'use strict'
const config = {

    plugin: {
        swagger: {
            options: {
                info: {
                    'title': 'Test API Documentation',
                    'version': '0.0.1'
                }
            }
        },
        Good: {
            options: {
                reporters: {
                    console: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{
                            response: '*',
                            log: '*'
                        }]
                    }, {
                        module: 'good-console'
                    }, 'stdout']
                }
            }
        },
    }
}


module.exports = config