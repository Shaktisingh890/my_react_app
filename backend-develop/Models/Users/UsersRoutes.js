var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

const mediaPayload = {
    maxBytes: 20000000,
    parse: true,
    output: 'file',
    allow: 'multipart/form-data',
    timeout: false,
    multipart: true
}

var payload = {
    maxBytes: 50000000,
    parse: true,
    output: 'file',
    multipart: true,
    timeout: false
}

const timeoutObj = {
    server: 60000 * 20,
    socket: 60000 * 30

}

const corsObj = {

    credentials: true,
    origin: ['*'],
    headers: ['cache-control', 'x-requested-with', 'Authorization', 'Content-Type', 'If-None-Match']


}

var schema = {
    put: {
        approvedByAdmin: Joi.boolean(),
        isBlocked: Joi.boolean(),
        isDeleted: Joi.boolean()
    },
    post: {

    }
}


function UsersRoute(controller, requestSchema, mainKey, subKey, payload) {



    // this.createApi = true;
    this.editApi = true;
    this.readApi = true;
    this.getByIdApi = true;
    this.deleteByIdApi = true;
    // this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

UsersRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


UsersRoute.prototype.getParentRoutes = UsersRoute.prototype.getRoutes;
//UsersRoute.prototype.overridedParantFunction = UsersRoute.prototype.ParantFunction;

UsersRoute.prototype.getConstantValues = function(request, reply) {

    return UniversalFunctions.sendSuccess(null, UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS, UniversalFunctions.CONFIG.APP_CONSTANTS.EXTRA_VARS);

}

UsersRoute.prototype.createNewBrand = function(request, reply) {

    var data = {};

    data.payload = request.payload;
    data.payload.stepsCompleted = 1;
    data.payload.userRole = UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.userRole.brand;

    return commonRoutes.handlePromise(this.controller.createNewUser(data));

}

UsersRoute.prototype.createNewServiceProvider = function(request, reply) {

    var data = {};

    data.payload = request.payload;
    data.payload.stepsCompleted = 1;
    data.payload.userRole = UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.userRole.serviceProvider;

    return commonRoutes.handlePromise(this.controller.createNewUser(data));

}

UsersRoute.prototype.loginUser = function(request, reply) {

    var data = {};

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.loginUser(data));

}

UsersRoute.prototype.getUserDetailsById = function(request, reply) {

    let data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = {...request.params, ...request.query};


    return commonRoutes.handlePromise(this.controller.getUserDetailsById(data));

}

UsersRoute.prototype.completeUserOnboarding = function(request, reply) {

    let data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    if (data.userData._id != request.params._id)
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS, null, reply);

    data.payload = request.payload;

    data.payload.stepsCompleted = 0;

    data.payload._id = request.params._id;

    return commonRoutes.handlePromise(this.controller.updateUserProfile(data));

}

UsersRoute.prototype.getResetPasswordToken = function(request, reply) {

    let data = {};

    data.payload = request.query;

    return commonRoutes.handlePromise(this.controller.getResetPasswordToken(data));

}

UsersRoute.prototype.verifyResetPasswordToken = function(request, reply) {

    let data = {};

    data.payload = request.query;

    return commonRoutes.handlePromise(this.controller.verifyResetPasswordToken(data));

}

UsersRoute.prototype.resetUserPassword = function(request, reply) {

    let data = {};

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.resetUserPassword(data));

}

UsersRoute.prototype.uploadFile = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    console.log("uploadFile===>",request.payload);

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.uploadFile(data));

}

UsersRoute.prototype.updateUserProfile = function(request, reply) {

    let data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    if (data.userData._id != request.params._id)
        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS, null, reply);

    data.payload = request.payload;

    data.payload.stepsCompleted = 0;

    data.payload._id = request.params._id;

    return commonRoutes.handlePromise(this.controller.updateUserProfile(data));

}

UsersRoute.prototype.logoutUser = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    return commonRoutes.handlePromise(this.controller.logoutUser(data));
}

UsersRoute.prototype.verifyEmail = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return commonRoutes.handlePromise(this.controller.verifyEmail(data));
}

UsersRoute.prototype.getExpanterBankAccountDetails = function(request, reply) {

    return UniversalFunctions.sendSuccess(null, UniversalFunctions.CONFIG.APP_CONSTANTS.ADMIN_BANK_ACCOUNT_DETAILS);

}

UsersRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes = [

        // You can write new routes here
        //

        {
            method: 'GET',
            path: '/v1/constants',
            handler: this.getConstantValues.bind(this),
            config: {
                validate: {
                    failAction: UniversalFunctions.failActionFunction
                },
                cors: true,
                description: 'get constants',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'POST',
            path: '/v1/auth/email/registration/brand',
            handler: this.createNewBrand.bind(this),
            config: {
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().trim().min(1).required(),
                        lastName: Joi.string().trim().allow(""),
                        email: Joi.string().trim().email().lowercase().options({ convert: true }).required(),
                        password: Joi.string().required().min(5).trim(),
                        businessName: Joi.string().trim(),
                        industryExperience: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.industryExperience.server))
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'register brand',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'POST',
            path: '/v1/auth/email/registration/serviceProvider',
            handler: this.createNewServiceProvider.bind(this),
            config: {
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().trim().min(1).required(),
                        lastName: Joi.string().trim().allow(""),
                        email: Joi.string().trim().email().lowercase().options({ convert: true }).required(),
                        password: Joi.string().required().min(5).trim(),
                        businessName: Joi.string().trim(),
                        industryExperience: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.industryExperience.server)),
                        mainSpecialities: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server)),
                        // otherMainSpecialities: Joi.array().items(Joi.string().trim())
                        //     .when('mainSpecialities', {
                        //         is: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.mainSpecialities.other,
                        //         then: Joi.required()
                        //     }),
                        distributorType: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.distributorType.server)),
                        companyType: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.companyTypes.server)
                    }),
                    failAction: UniversalFunctions.failActionFunction

                },
                description: 'register service provider',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'POST',
            path: '/v1/auth/email/login',
            handler: this.loginUser.bind(this),
            config: {
                validate: {
                    payload: Joi.object({
                        email: Joi.string().trim().email().lowercase().options({ convert: true }).required(),
                        password: Joi.string().required().min(5).trim()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'login user',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.getUserDetailsById.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    query: Joi.object({
                        projectId: Joi.objectId()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get user by id',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/setup/{_id}`,
            handler: this.completeUserOnboarding.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        firstName: Joi.string().trim().min(1),
                        lastName: Joi.string().trim().allow(""),
                        serviceProviderType: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.serviceProviderTypes.server),
                        businessName: Joi.string().trim(),
                        industryExperience: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.industryExperience.server)),
                        mainSpecialities: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server)),
                        // otherMainSpecialities: Joi.array().items(Joi.string().trim())
                        //     .when('mainSpecialities', {
                        //         is: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.mainSpecialities.other,
                        //         then: Joi.required()
                        //     }),
                        distributorType: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.distributorType.server)),
                        description: Joi.string().trim().allow(""),
                        companyType: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.companyTypes.server),
                        businessModel: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.businessModel.server),
                        additionalCapacities: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server)),
                        // otherAdditionalCapacities: Joi.array().items(Joi.string().trim())
                        //     .when('additionalCapacities', {
                        //         is: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.mainSpecialities.other,
                        //         then: Joi.required()
                        //     }),
                        businessSize: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.businessSize.server),
                        originCountry: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.countries.server),
                        hqLocation: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.countries.server),
                        internationalPresence: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.countries.server)),
                        presenceInChina: Joi.boolean(),
                        experienceInChina: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.experienceInChina.server),
                        locationsInChina: Joi.array().items(Joi.string().trim()),
                        languagesSpoken: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.languageSpoken.server)),
                        website: Joi.string().lowercase().options({ convert: true }).trim().regex(urlRegex).allow("").messages({
                          'string.pattern.base': `"Website" should be a valid url`
                        }),
                        otherDetails: Joi.string().trim().allow(""),
                        foundingYear: Joi.string().trim().length(4),
                        foundingHistory: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.foundingHistory.server),
                        companyRegistrationType: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.companyRegistrationTypes.server),
                        segmentExperience: Joi.array().items(Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server)),
                        annualTurnover: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.annualTurnover.server),
                        staffSize: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.staffSize.server),
                        logo: Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()
                        }),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            _id: Joi.string(),
                            name: Joi.string().trim()
                        })),
                        linkedinUrl: Joi.string().lowercase().options({ convert: true }).trim().regex(urlRegex).allow("").messages({
                          'string.pattern.base': `"Linkedin Url" should be a valid url`
                        }),
                        contactPerson: Joi.object().keys({
                            name: Joi.string().trim(),
                            title: Joi.string().trim(),
                            email: Joi.string().trim()
                        }),
                        globalNoPOS: Joi.number().integer().min(0),
                        notableClients: Joi.string().trim().allow(""),
                        services: Joi.string().trim().allow(""),
                        caseStudies: Joi.string().trim().allow(""),
                        retainerBasedFeeUSD: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                        projectBasedFeeUSD: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server)

                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'complete user setup',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/reset-password`,
            handler: this.getResetPasswordToken.bind(this),
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
            handler: this.verifyResetPasswordToken.bind(this),
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
            handler: this.resetUserPassword.bind(this),
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
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.updateUserProfile.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        firstName: Joi.string().trim().min(1),
                        lastName: Joi.string().trim().allow(""),
                        serviceProviderType: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.serviceProviderTypes.server),
                        businessName: Joi.string().trim(),
                        industryExperience: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.industryExperience.server)),
                        mainSpecialities: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server)),
                        // otherMainSpecialities: Joi.array().items(Joi.string().trim())
                        //     .when('mainSpecialities', {
                        //         is: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.mainSpecialities.other,
                        //         then: Joi.required()
                        //     }),
                        distributorType: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.distributorType.server)),
                        description: Joi.string().trim().allow(""),
                        companyType: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.companyTypes.server),
                        businessModel: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.businessModel.server),
                        additionalCapacities: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.mainSpecialities.server)),
                        // otherAdditionalCapacities: Joi.array().items(Joi.string().trim())
                        //     .when('additionalCapacities', {
                        //         is: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.mainSpecialities.other,
                        //         then: Joi.required()
                        //     }),
                        businessSize: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.businessSize.server),
                        originCountry: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.countries.server),
                        hqLocation: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.countries.server),
                        internationalPresence: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.countries.server)),
                        presenceInChina: Joi.boolean(),
                        experienceInChina: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.experienceInChina.server),
                        languagesSpoken: Joi.array().items(Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.languageSpoken.server)),
                        locationsInChina: Joi.array().items(Joi.string().trim()),
                        website: Joi.string().lowercase().options({ convert: true }).trim().regex(urlRegex).allow("").messages({
                          'string.pattern.base': `"Website" should be a valid url`
                        }),
                        otherDetails: Joi.string().trim().allow(""),
                        foundingYear: Joi.string().trim().length(4),
                        foundingHistory: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.foundingHistory.server),
                        companyRegistrationType: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.companyRegistrationTypes.server),
                        segmentExperience: Joi.array().items(Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.segmentExperience.server)),
                        annualTurnover: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.annualTurnover.server),
                        staffSize: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.staffSize.server),
                        logo: Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()

                        }),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            _id: Joi.string(),
                            name: Joi.string().trim()
                        })),
                        linkedinUrl: Joi.string().lowercase().options({ convert: true }).trim().regex(urlRegex).allow("").messages({
                          'string.pattern.base': `"Linkedin Url" should be a valid url`
                        }),
                        contactPerson: Joi.object().keys({
                            name: Joi.string().trim(),
                            title: Joi.string().trim(),
                            email: Joi.string().trim()
                        }),
                        globalNoPOS: Joi.number().integer().min(0),
                        notableClients: Joi.string().trim().allow(""),
                        services: Joi.string().trim().allow(""),
                        caseStudies: Joi.string().trim().allow(""),
                        retainerBasedFeeUSD: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                        projectBasedFeeUSD: Joi.string().trim().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.projectStartingFee_USD.server),
                        bankAccDetails: Joi.object().keys({
                            accountName: Joi.string().trim().required(),
                            accountNumber: Joi.string().trim().required(),
                            bankName: Joi.string().trim().required(),
                            bankAddress: Joi.string().trim().required(),
                            bankCode: Joi.string().trim().required(),
                            swiftCode: Joi.string().trim().required(),
                            country: Joi.string().trim().required()
                        })
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'update user profile',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'POST',
            path: `/v1/${this.apiName}/upload`,
            handler: this.uploadFile.bind(this),
            config: {
                auth: 'UserAuth',
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
                description: 'upload a file',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        },  {
            method: 'PUT',
            path: `/v1/${this.apiName}/logout`,
            handler: this.logoutUser.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'logout user',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/verifyEmail/{token}`,
            handler: this.verifyEmail.bind(this),
            config: {
                validate: {
                    params: Joi.object({
                        token: Joi.string().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'Verify Email for User',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: '/v1/expanterBankAccounts',
            handler: this.getExpanterBankAccountDetails.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction
                },
                cors: true,
                description: 'get expanter bank account details',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}
module.exports = {
    'users': new UsersRoute(Controller.makeModule.users, schema, 'admins', 'users')
};