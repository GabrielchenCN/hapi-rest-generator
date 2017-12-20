const Boom = require('boom');
const Whoosh = require('../../utils/whoosh');
const User = require('../../models/user');
const Session = require('../../models/session');
const crypto = require('crypto');
const requestClient = require('request');



module.exports.tokenAuth = {
    handler: function(request, reply) {
        let email = request.payload.email;
        let res = null;
        let docPOJO = null;
        let oSession = null;
        User.findOne({ email: email }, function(err, docs) {

            if (err) return reply(Boom.badRequest());
            if (!docs) {
                reply(Whoosh.NoContent(docs, 'user is not exist'));
            } else {
                docPOJO = docs.toObject();
                res = Object.assign({}, docPOJO, { token: UUIDGenerator() });
                oSession = new Session({ _user: docs, token: res.token });
                Session.findOneAndUpdate({ '_user': docs }, { 'token': oSession.toObject().token }, { new: true }, function(err, docs) {
                    console.log(docs);
                    if (err) {

                        return reply(Boom.badRequest());
                    }
                    if (!docs) {
                        oSession.save();
                        console.log("-------------not match------------")
                        reply(Whoosh.Created(res));
                    } else {
                        reply(Whoosh.OK(res));
                    }
                })

            }

        })
    }
};


module.exports.wxLogin = {
    handler: function(request, reply) {
        let sCode = request.payload.code,
            appid = Config.wx.appId,
            secret = Config.wx.secret;

        requestClient(
            "https://api.weixin.qq.com/sns/jscode2session?appid=" +
            appid +
            "&secret=" +
            secret +
            "&js_code=" +
            sCode +
            "&grant_type=authorization_code",
            function(error, response, body) {
                if (response.statusCode == 200) {
                    console.log(body);
                } else {
                    console.log('error: ' + response.statusCode)
                    console.log(body)
                }
            }
        )
    }
};


module.exports.wxUser = {
    handler: function(request, reply) {
        let oUserInfo = request.payload.userInfo,
            rawData = request.payload.rawData,
            signature = request.payload.signature,
            sEncryptedData = request.payload.encryptedData,
            iv = request.payload.iv;
            decryptData(sEncryptedData, iv);
            reply(Whoosh.OK(res));


    }
};


const UUIDGenerator = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.randomBytes(256)[0] & 15 >> c / 4).toString(16)
    );

const decryptData = (eData, oIv) => {
    let sessionKey = new Buffer(sessionKey, 'base64'),
        encryptedData = new Buffer(eData, 'base64'),
        iv = new Buffer(oIv, 'base64')

    try {
        // 解密
        let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true)
        let decoded = decipher.update(encryptedData, 'binary', 'utf8')
        decoded += decipher.final('utf8')

        decoded = JSON.parse(decoded)

    } catch (err) {
        throw new Error('Illegal Buffer')
    }

    if (decoded.watermark.appid !== Config.wx.appId) {
        throw new Error('Illegal Buffer')
    }

    if (getTimestampDiffWithNow(decoded.watermark.timestamp) > 30 * 60 * 1000) {
        throw new Error('wx session time out')
    }
    return decoded
}

const getTimestampDiffWithNow = (sTimeStampInitial) => {
    sTimeStampInitial = new Number(sTimeStampInitial).toString().length === 10 ? sTimeStampInitial * 1000 : sTimeStampInitial;
    return new Date().getTime() - sTimeStampInitial;
}