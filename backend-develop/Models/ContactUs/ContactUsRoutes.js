var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');

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


function ContactUsRoute(controller, requestSchema, mainKey, subKey , payload) {



    // this.createApi = true;
    // this.editApi = true;
    // this.readApi = true;
    // this.getByIdApi = true;
    // this.deleteByIdApi = true;
    // this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

ContactUsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ContactUsRoute.prototype.getParentRoutes = ContactUsRoute.prototype.getRoutes;
//ContactUsRoute.prototype.overridedParantFunction = ContactUsRoute.prototype.ParantFunction;

ContactUsRoute.prototype.postUserQuery = function(request, reply) {

    let data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.postUserQuery(data));

}

ContactUsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes =[

    // You can write new routes here
    //

    {
            method: 'POST',
            path: `/v1/${this.apiName}`,
            handler: this.postUserQuery.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        // firstName: Joi.string().trim().required(),
                        // lastName: Joi.string().trim().allow(""),
                        // businessName: Joi.string().trim().required(),
                        // email: Joi.string().trim().email().required(),
                        subject: Joi.string().trim().required(),
                        query: Joi.string().trim().required(),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()
                        }))
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'post user query',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'contactUs': new ContactUsRoute(Controller.makeModule.contactUs, schema, 'admins', 'contactUs')
};
