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


function NotificationsRoute(controller, requestSchema, mainKey, subKey, payload) {



    //this.createApi = true;
    //this.editApi = true;
    //this.readApi = true;
    //this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

NotificationsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


NotificationsRoute.prototype.getParentRoutes = NotificationsRoute.prototype.getRoutes;
//NotificationsRoute.prototype.overridedParantFunction = NotificationsRoute.prototype.ParantFunction;

NotificationsRoute.prototype.getNotificationsList = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.query || {};

    return commonRoutes.handlePromise(this.controller.getNotificationsList(data));

}

NotificationsRoute.prototype.updateNotificationAsRead = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = { ...request.payload, ...request.params };

    return commonRoutes.handlePromise(this.controller.updateNotificationAsRead(data));

}

NotificationsRoute.prototype.updateNotificationAsViewed = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = {};

    return commonRoutes.handlePromise(this.controller.updateNotificationAsViewed(data));

}

NotificationsRoute.prototype.updateAllNotificationAsRead = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = {};

    return commonRoutes.handlePromise(this.controller.updateAllNotificationAsRead(data));

}


NotificationsRoute.prototype.deleteUserNotification = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.deleteUserNotification(data));

}

NotificationsRoute.prototype.getNotificationsCounts = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = {};

    return commonRoutes.handlePromise(this.controller.getNotificationsCounts(data));

}

NotificationsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes = [

        // You can write new routes here
        //

        {
            method: 'GET',
            path: `/v1/${this.apiName}`,
            handler: this.getNotificationsList.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        page: Joi.number().integer().min(0),
                        count: Joi.number().integer().min(1),
                        dateTime: Joi.date()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get list of notifications',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.updateNotificationAsRead.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        isRead: Joi.boolean().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'mark notification as read or unread',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/viewed`,
            handler: this.updateNotificationAsViewed.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'mark notifications as viewed',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/all/read`,
            handler: this.updateAllNotificationAsRead.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'mark all notifications as read',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'DELETE',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.deleteUserNotification.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'delete user notification',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/counts`,
            handler: this.getNotificationsCounts.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get notifications count',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }

    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'notifications': new NotificationsRoute(Controller.makeModule.notifications, schema, 'admins', 'notifications')
};