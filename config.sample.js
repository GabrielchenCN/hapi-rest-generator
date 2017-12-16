const config = {
    server:{
        host:'localhost',
        port:3001
    },

};
const swagger= {
        uri:config.server.host+":"+config.server.port+'/documentation'
    }

config.swagger=swagger;

module.exports = config