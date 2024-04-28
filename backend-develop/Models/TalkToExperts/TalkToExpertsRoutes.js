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


function TalkToExpertsRoute(controller, requestSchema, mainKey, subKey , payload) {



    // this.createApi = true;
    // this.editApi = true;
    // this.readApi = true;
    // this.getByIdApi = true;
    // this.deleteByIdApi = true;
    // this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

TalkToExpertsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


TalkToExpertsRoute.prototype.getParentRoutes = TalkToExpertsRoute.prototype.getRoutes;
//TalkToExpertsRoute.prototype.overridedParantFunction = TalkToExpertsRoute.prototype.ParantFunction;


TalkToExpertsRoute.prototype.postUserQuery = function(request, reply) {

    let data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.postUserQuery(data));

}
TalkToExpertsRoute.prototype.getRoutes = function(request, reply) {

    var seperator = '';
    if (this.apiName) {
        seperator = '/'
    }

    var newRoutes =[

    {
            method: 'POST',
            path: `/v1/${this.apiName}`,
            handler: this.postUserQuery.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        // firstName: Joi.string().trim().required(),
                        // lastName: Joi.string().trim().allow(""),
                        // businessName: Joi.string().trim().required(),
                        // email: Joi.string().trim().email().required(),
                        topic: Joi.string().trim().required(),
                        query: Joi.string().trim().required()
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
    'talkToExperts': new TalkToExpertsRoute(Controller.makeModule.talkToExperts, schema, 'admins', 'talkToExperts')
};
