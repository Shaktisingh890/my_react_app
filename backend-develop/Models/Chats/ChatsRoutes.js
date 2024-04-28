var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

var payload = {
    maxBytes: 20000000,
    parse: true,
    output: 'file',
}

var schema = {
    put: {

    },
    post: {

    }
}


function ChatsRoute(controller, requestSchema, mainKey, subKey, payload) {



    //this.createApi = true;
    //this.editApi = true;
    //this.readApi = true;
    //this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

ChatsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ChatsRoute.prototype.getParentRoutes = ChatsRoute.prototype.getRoutes;
//ChatsRoute.prototype.overridedParantFunction = ChatsRoute.prototype.ParantFunction;

ChatsRoute.prototype.initiateChat = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    if(data.userData._id.toString() === data.payload.otherUser.toString()) {
        return reply.response(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.CANT_CHAT_WITH_SELF));
    }

    return commonRoutes.handlePromise(this.controller.initiateChat(data));

}

ChatsRoute.prototype.updateChatLastMessage = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;
    data.payload._id = request.params._id;

    return commonRoutes.handlePromise(this.controller.updateChatLastMessage(data));

}

ChatsRoute.prototype.getChats = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = {};

    return commonRoutes.handlePromise(this.controller.getChats(data));

}

ChatsRoute.prototype.getChatDetails = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.getChatDetails(data));

}


ChatsRoute.prototype.getTwilioToken = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.getTwilioToken(data));

}


ChatsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes = [

        // You can write new routes here
        //

        {
            method: 'POST',
            path: `/v1/${this.apiName}`,
            handler: this.initiateChat.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        projectId: Joi.objectId().required(),
                        otherUser: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'initiate discussion',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.updateChatLastMessage.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        lastMessage: Joi.string().trim()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'update last message',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}`,
            handler: this.getChats.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get all discussions',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.getChatDetails.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required().description("chat _id")
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get discussion details',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}/token`,
            handler: this.getTwilioToken.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required().description("chat _id")
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get twilio token',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'chats': new ChatsRoute(Controller.makeModule.chats, schema, 'admins', 'chats')
};