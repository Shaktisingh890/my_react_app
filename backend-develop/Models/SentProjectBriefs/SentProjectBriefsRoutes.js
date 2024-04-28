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


function SentProjectBriefsRoute(controller, requestSchema, mainKey, subKey, payload) {



    //this.createApi = true;
    //this.editApi = true;
    //this.readApi = true;
    //this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

SentProjectBriefsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


SentProjectBriefsRoute.prototype.getParentRoutes = SentProjectBriefsRoute.prototype.getRoutes;
//SentProjectBriefsRoute.prototype.overridedParantFunction = SentProjectBriefsRoute.prototype.ParantFunction;

SentProjectBriefsRoute.prototype.addSentProjectBriefDetails = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.addSentProjectBriefDetails(data));

}

SentProjectBriefsRoute.prototype.getRoutes = function(request, reply) {

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
            handler: this.addSentProjectBriefDetails.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        chatId: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'add sent project brief',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'sentProjectBriefs': new SentProjectBriefsRoute(Controller.makeModule.sentProjectBriefs, schema, 'admins', 'sentProjectBriefs')
};