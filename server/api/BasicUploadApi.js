'use strict';
const Boom = require('boom');
const Whoosh = require('../utils/whoosh');
const multiparty = require('multiparty');
const fs = require('fs');
const stream = require('stream');

const BasicRestApiPlugin = {
    register: function(server, options, next) {

        server.route({
            method: 'POST',
            path: '/store/file/',
            config: {
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                tags: ['api'],
                payload: {
                    maxBytes: 1048576,
                    parse: true,
                    output: 'file'
                }
            },
            handler: function(request, reply) {
                const oPayload = request.payload.file;
                const oPayloadDesc = request.payload.name;
                oPayload.name = oPayloadDesc;

                if (!request.app.Template) {
                    request.app.Template = [];
                }
                //remove in the preResponse asyn
                request.app.Template.push(oPayload);


                const response = reply(Whoosh.Created(oPayload));
                response.statusCode = Whoosh.Created().statusCode;
            }

        });
        server.route({
            method: 'POST',
            path: '/stream/file/',
            config: {
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                tags: ['api'],
                payload: {
                    maxBytes: 209715200,
                    parse: false,
                    output: 'stream',
                }
            },
            handler: function(requset, reply) {
                var form = new multiparty.Form();

                form.parse(requset.payload, function(err, fields, files) {
                    if (err) {
                        console.log(err);
                        return reply(err);
                    } else {
                        console.log(err, files, fields);
                        reply(Whoosh.OK({ originalFilename: files.file[0].originalFilename }));
                    }
                });
            }

        });
        server.route({
            method: 'POST',
            path: '/stream/parse/file/',
            config: {
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                tags: ['api'],
                payload: {
                    maxBytes: 209715200,
                    parse: true,
                    output: 'stream',
                    allow: 'multipart/form-data'
                }
            },
            handler: function(requset, reply) {
                console.log(requset.payload.name);
                console.log(requset.payload.file.hapi);
                var sPath = "./temp/" + requset.payload.file.hapi.filename;
                var oWriteStream = fs.createWriteStream(sPath);
                var rs = requset.payload.file;
                rs.on("data", function(data) {
                    var flag = oWriteStream.write(data);
                    if (!flag) { //缓冲区已满 the buffer is full
                        rs.pause(); //停止触发data事件 stop read data
                    }
                });
                oWriteStream.on("drain", function() {
                    rs.resume(); //如果当前的缓冲区写入完毕，就重新触发data事件 if buffer write finish,re-trigger the date event
                });
                rs.on("end", function() {
                    oWriteStream.end(); //将剩下的数据全部写入，并且关闭写入的文件 write all data and close the writable file
                })
                requset.payload.file.hapi.serverFilePath = sPath;
                reply(Whoosh.OK(requset.payload.file.hapi))
            }

        });

        next();
    }
};


BasicRestApiPlugin.register.attributes = {
    name: 'Basic Restful Upload files API Template',
    version: '1.0.0'
};
module.exports = BasicRestApiPlugin