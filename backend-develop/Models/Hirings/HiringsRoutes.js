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


function HiringsRoute(controller, requestSchema, mainKey, subKey, payload) {



    //this.createApi = true;
    //this.editApi = true;
    //this.readApi = true;
    //this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

HiringsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


HiringsRoute.prototype.getParentRoutes = HiringsRoute.prototype.getRoutes;
//HiringsRoute.prototype.overridedParantFunction = HiringsRoute.prototype.ParantFunction;

HiringsRoute.prototype.hireServiceProvider = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.hireServiceProvider(data));

}

HiringsRoute.prototype.getRoutes = function(request, reply) {

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
            handler: this.hireServiceProvider.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        proposalId: Joi.objectId().required(),
                        docs: Joi.array().items(Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()
                        })),
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'send invoice',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'hirings': new HiringsRoute(Controller.makeModule.hirings, schema, 'admins', 'hirings')
};