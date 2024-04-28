var routesModule = require('../../Routes/RoutesModule').Routes;
var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var commonRoutes = require('../../Routes/commonRoutesThings');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const fs = require('fs');

var payload = {
    maxBytes: 20000000,
    parse: true,
    output: 'file',
}

var schema = {
    put: {
        paymentStatus: Joi.string().valid(UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.inProcess, UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.completed),
        completedAt: Joi.date()
    },
    post: {

    }
}


function InvoicesRoute(controller, requestSchema, mainKey, subKey, payload) {



    //this.createApi = true;
    this.editApi = true;
    this.readApi = true;
    this.getByIdApi = true;
    //this.deleteByIdApi = true;
    //this.getGraphsApi = true;



    // binding this controller with the controller in the p arent module i.e. routesModule
    routesModule.call(this, controller, requestSchema, mainKey, subKey, payload);
}

InvoicesRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


InvoicesRoute.prototype.getParentRoutes = InvoicesRoute.prototype.getRoutes;
//InvoicesRoute.prototype.overridedParantFunction = InvoicesRoute.prototype.ParantFunction;

InvoicesRoute.prototype.sendInvoices = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.payload;

    return commonRoutes.handlePromise(this.controller.sendInvoices(data));

}

InvoicesRoute.prototype.getInvoicesForBrand = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.query;

    return commonRoutes.handlePromise(this.controller.getInvoicesForBrand(data));

}

InvoicesRoute.prototype.getInvoicesForServiceProvider = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.query;

    return commonRoutes.handlePromise(this.controller.getInvoicesForServiceProvider(data));

}

InvoicesRoute.prototype.updateInvoiceDetails = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = { ...request.payload, ...request.params };

    return commonRoutes.handlePromise(this.controller.updateInvoiceDetails(data));

}

InvoicesRoute.prototype.getStripePaymentWebhook = function(request, reply) {

    var data = {};

    data.body = request.payload;
    data.sig = request.headers["stripe-signature"];

    return commonRoutes.handlePromise(this.controller.getStripePaymentWebhook(data));

}

InvoicesRoute.prototype.updatePaymentStatusByBrand = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = { ...request.payload, ...request.params };

    return commonRoutes.handlePromise(this.controller.updatePaymentStatusByBrand(data));

}

InvoicesRoute.prototype.downloadInvoice = function(request, reply) {

    var data = {};

    data.userData = request.auth && request.auth.credentials && request.auth.credentials.userData;

    data.payload = request.params;

    return this.controller.downloadInvoice(data).then((response) => {

        const fileToSend = fs.readFileSync(response.filename);

        const fileName = "invoice.pdf"

        return reply.response(fileToSend)
            .bytes(fileToSend.length)
            .type('application/pdf')
            .header('content-disposition', fileName);

    }).catch((err) => {

        console.log(err);

        return UniversalFunctions.sendError(err, null, reply);

    })

}

InvoicesRoute.prototype.downloadInvoiceByAdmin = function(request, reply) {

    var data = {};

    data.adminData = request.auth && request.auth.credentials && request.auth.credentials.adminData;

    data.payload = { ...request.params, ...request.query };

    return this.controller.downloadInvoiceByAdmin(data).then((response) => {

        const fileToSend = fs.readFileSync(response.filename);

        const fileName = "invoice.pdf"

        return reply.response(fileToSend)
            .bytes(fileToSend.length)
            .type('application/pdf')
            .header('content-disposition', fileName);

    }).catch((err) => {

        console.log(err);

        return UniversalFunctions.sendError(err, null, reply);

    })

}


InvoicesRoute.prototype.getRoutes = function(request, reply) {

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
            handler: this.sendInvoices.bind(this),
            config: {
                auth: 'ServiceProviderAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object({
                        proposalId: Joi.objectId().required(),
                        invoice: Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()
                        }),
                        milestone: Joi.string().trim().required(),
                        services: Joi.string().trim().required(),
                        invoiceAmount: Joi.number().positive().required(),
                        dueDate: Joi.date().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'send invoice',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/serviceProvider`,
            handler: this.getInvoicesForServiceProvider.bind(this),
            config: {
                auth: 'ServiceProviderAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        proposalId: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get invoice list for SP',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/brand`,
            handler: this.getInvoicesForBrand.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        proposalId: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get invoice list for brand',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/{_id}`,
            handler: this.updateInvoiceDetails.bind(this),
            config: {
                auth: 'ServiceProviderAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        invoice: Joi.object().keys({
                            fileType: Joi.string().trim(),
                            mimeType: Joi.string().trim(),
                            original: Joi.string().trim().uri(),
                            thumbnail: Joi.string().trim().uri(),
                            name: Joi.string().trim()
                        }),
                        milestone: Joi.string().trim().required(),
                        services: Joi.string().trim().required(),
                        invoiceAmount: Joi.number().positive().required(),
                        dueDate: Joi.date().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'update invoice',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'POST',
            path: `/v1/webhooks/stripe-payments`,
            handler: this.getStripePaymentWebhook.bind(this),
            config: {
                payload: {
                    output: 'data',
                    parse: false
                },
                validate: {
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'get stripe webhook',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'PUT',
            path: `/v1/${this.apiName}/brand/{_id}`,
            handler: this.updatePaymentStatusByBrand.bind(this),
            config: {
                auth: 'BrandAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    payload: Joi.object({
                        paymentMethod: Joi.string().valid(UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.paymentMethods.bankTransfer).required(),
                        paymentStatus: Joi.string().valid(UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.inProcess).required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'update payment status by brand',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/${this.apiName}/{_id}/download`,
            handler: this.downloadInvoice.bind(this),
            config: {
                auth: 'UserAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'dowbload invoice',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }, {
            method: 'GET',
            path: `/v1/admin/${this.apiName}/{_id}/download`,
            handler: this.downloadInvoiceByAdmin.bind(this),
            config: {
                auth: 'AdminAuth',
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.objectId().required()
                    }),
                    query: Joi.object({
                        userRole: Joi.string().valid(...UniversalFunctions.CONFIG.APP_CONSTANTS.USER_CONSTANTS.userRole.server)
                    }),
                    failAction: UniversalFunctions.failActionFunction
                },
                description: 'dowbload invoice by admin',
                tags: ['api', 'user'],
                plugins: commonRoutes.routesPlugin
            }
        }



    ]


    return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
    'invoices': new InvoicesRoute(Controller.makeModule.invoices, schema, 'admins', 'invoices')
};