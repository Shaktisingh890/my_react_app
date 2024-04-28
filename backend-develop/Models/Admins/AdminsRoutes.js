var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');

var payload = {
    maxBytes: 50000000,
    parse: true,
    output: 'file',
    multipart: true
}

var schema = {
    put: {

    },
    post: {

    }
}


function AdminsRoute(controller, requestSchema, mainKey, subKey , payload) {



    // this.createApi = true;
    // this.editApi = true;
    // this.readApi = true;
    // this.getByIdApi = true;
    // this.deleteByIdApi = true;
    // this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

AdminsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


AdminsRoute.prototype.getParentRoutes = AdminsRoute.prototype.getRoutes;
//AdminsRoute.prototype.overridedParantFunction = AdminsRoute.prototype.ParantFunction;

AdminsRoute.prototype.adminLogin = function(request, reply) {

    var data = {};

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.adminLogin(data));

}

AdminsRoute.prototype.adminLogout = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    data.token = request.auth && request.auth.credentials && request.auth.credentials.token;

    return commonRoutes.handlePromise(this.controller.adminLogout(data));

}

AdminsRoute.prototype.uploadFileFromAdmin = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    console.log("uploadFile===>",request.payload);

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.uploadFileFromAdmin(data));

}

AdminsRoute.prototype.getAdminResetPasswordToken = function(request, reply) {

    let data = {};

    data.payload = request.query;

    return commonRoutes.handlePromise(this.controller.getAdminResetPasswordToken(data));

}

AdminsRoute.prototype.verifyAdminResetPasswordToken = function(request, reply) {

    let data = {};

    data.payload = request.query;

    return commonRoutes.handlePromise(this.controller.verifyAdminResetPasswordToken(data));

}

AdminsRoute.prototype.resetAdminPassword = function(request, reply) {

    let data = {};

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.resetAdminPassword(data));

}

AdminsRoute.prototype.updateAdminProfile = function(request, reply) {

    let data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    if (data.adminData._id != request.params._id)
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS, null, reply);

    data.payload = request.payload;

    data.payload._id = request.params._id;

    return commonRoutes.handlePromise(this.controller.updateAdminProfile(data));

}

AdminsRoute.prototype.changeAdminPassword = function(request, reply) {

    let data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    console.log(reply);

    if (data.adminData._id != request.params._id)
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS, null, reply);

    data.payload = request.payload;

    data.payload._id = request.params._id;

    return commonRoutes.handlePromise(this.controller.changeAdminPassword(data));


}

AdminsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes =[

    // You can write new routes here
    //

    {
            method: 'POST',
            path: '/v1/' + this.apiName + '/login',
            handler: this.adminLogin.bind(this),
            config: {
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Login for Super Admin',
                tags: ['api', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        },
        {
            method: 'PUT',
            path: '/v1/' + this.apiName + '/logout',
            handler: this.adminLogout.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'logout for Super Admin',
                tags: ['api', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'POST',
            path: `/v1/${this.apiName}/upload`,
            handler: this.uploadFileFromAdmin.bind(this),
            config: {
                auth: 'AdminAuth',
                payload: payload,
                // timeout: timeoutObj,
                // cors: corsObj,
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        file: Joi.any()
                            .meta({
                                swaggerType: 'file'
                            })
                            .required()
                            .description('file')
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'upload a file from admin',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/reset-password`,
            handler: this.getAdminResetPasswordToken.bind(this),
            config: {
                validate: {
                    query: Joi.object({
                        email: Joi.string().trim().email().lowercase().options({ convert: true }).required(),
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get reset password token',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/reset-password/verify`,
            handler: this.verifyAdminResetPasswordToken.bind(this),
            config: {
                validate: {
                    query: Joi.object({
                        token: Joi.string().trim().required(),
                        id: Joi.string().trim().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'verify reset password token',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/reset-password`,
            handler: this.resetAdminPassword.bind(this),
            config: {
                validate: {
                    payload: Joi.object({
                        token: Joi.string().trim().required(),
                        id: Joi.string().trim().required(),
                        password: Joi.string().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'reset user password with token',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: '/v1/' + this.apiName + '/{_id}',
            handler: this.updateAdminProfile.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        email: Joi.string().trim().email().lowercase().options({ convert: true }).required(),
                        name: Joi.string().trim().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'update admin profile',
                tags: ['api', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: '/v1/' + this.apiName + '/{_id}/change-password',
            handler: this.changeAdminPassword.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        oldPassword: Joi.string().required(),
                        newPassword: Joi.string().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'change admin password',
                tags: ['api', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'admins': new AdminsRoute(Controller.makeModule.admins, schema, 'admins', 'admins')
};
