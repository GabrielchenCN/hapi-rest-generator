const Boom = require('boom');
const Whoosh = require('../../utils/whoosh');
const User = require('../../models/user');



module.exports.OK = {
    handler: function(request, reply) {

        reply(Whoosh.OK());
    }
};


module.exports.BadRequest = {
    handler: function(request, reply) {

        reply(Whoosh.OK());
    }
};


module.exports.GetUsers = {
    handler: function(request, reply) {
        User.find({}, function(err, docs) {
            // docs 此时只包含文档的部分键值
            console.log(docs);
            reply(Whoosh.OK(docs));
        })

    }
};


module.exports.GetUser = {
    handler: function(request, reply) {
        const sId = request.params._id;
        console.log(sId);
        User.find({_id:sId}, function(err, docs) {
            // docs 此时只包含文档的部分键值
            if (err) return reply(Boom.badRequest());
            console.log(docs);
            reply(Whoosh.OK(docs));
        })

    }
};

module.exports.SaveUsers = {
    handler: function(request, reply) {
        let oPayload = request.payload;
        oPayload.roles =['USER'];
        User.findOneAndUpdate({'email':oPayload.email},oPayload,{ upsert: true, new: true },function(err, docs) {
            if (err) return reply(Boom.badRequest());
            reply(Whoosh.Created(docs)).code(201);
            // response.statusCode = Whoosh.Created().statusCode;
        })

    }
};



module.exports.PutUsers = {
    handler: function(request, reply) {
        const oPayload = request.payload;
        User.findOneAndUpdate({'_id':oPayload._id}, oPayload, { new: true }, function(err, docs) {
            if (err) return reply(Boom.badRequest());
            reply(Whoosh.OK(docs));
        })

    }
};


module.exports.DelUsers = {
    handler: function(request, reply) {
        const oPayload = request.payload;
        User.findOneAndRemove(oPayload, function(err, docs) {
            if (err) return reply(Boom.badRequest());
            reply(Whoosh.Del(docs));
        })

    }
};