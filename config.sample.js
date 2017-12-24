const config = {
    server:{
        host:'localhost',
        port:3001
    },

};
const swagger= {
        uri:config.server.host+":"+config.server.port+'/documentation'
    }
const mongodb= {
        uri:'mongodb://localhost/hapi'
    }

const wx= {
        appid:'',
        secret:""
    }

const microsoftAzure= {
        emotionRecognitionEndPoint:"https://westus.api.cognitive.microsoft.com/emotion/v1.0",
        emotionkey1:"",
        emotionkey2:"",
        faceRecognitionEndPoint:"https://westcentralus.api.cognitive.microsoft.com/face/v1.0",
        facekey1:"",
        facekey2:"",
    }

const facePlus= {
        faceRecognitionEndPoint:"https://api-cn.faceplusplus.com/facepp/v3",
        faceKey:"",
        faceSecret:"_87hW8R3ro9--2Jq",
    }

config.swagger=swagger;
config.mongodb=mongodb;
config.wx=wx;
config.microsoftAzure=microsoftAzure;
config.facePlus=facePlus;


module.exports = config