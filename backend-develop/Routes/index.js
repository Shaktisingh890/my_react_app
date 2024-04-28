
'use strict';

var routes = require('./RoutesModule').Routes;
var Controller = require('../Controllers');
var Joi = require('joi');
var UniversalFunctions = require('../Utils/UniversalFunctions');


var joi = {
    string: Joi.string(),
    file: Joi.any().meta({
        swaggerType: 'file'
    }).optional().description('image file'),
    array: Joi.array(),
    number: Joi.number(),
    boolean: Joi.boolean(),
    object: Joi.object(),
    any: Joi.any()
};

var adminUserSchema = {

    put: {
        _id: Joi.string().required(),
        firstName: Joi.string().optional().min(2),
        lastName: Joi.string().optional().min(2),
        countryCode: Joi.string().max(4).optional().trim(),
        email: Joi.string().optional(),
        phone: Joi.number().min(5).optional(),
        isBlocked: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        deletedAt: Joi.date().optional(),
        lastBlockedAt: Joi.date().optional()
    },
    post: {}
};




var adminSchema = {

    put: {},
    post: {}
};


var all = [];


var emptySchema = {
    put: {},
    post: {}

};

var makeModule = {

};



var templateSchema = {
    put: {
        _id: Joi.string().required(),
        title: Joi.string(),
        subject: Joi.string().optional(),
        body: Joi.string().optional(),
        senderEmail: Joi.string().email().optional(),
        handlebarVars: Joi.array().items(Joi.string().required()),
    },
    post: {
        title: Joi.string().required(),
        subject: Joi.string().required(),
        body: Joi.string().required(),
        senderEmail: Joi.string().email().required(),
        handlebarVars: Joi.array().items(Joi.string().required()),
    }
};


function getSchema(key) {
    var schema = emptySchema;
    if (key == 'emailTemplates') {
        schema = templateSchema;
    }    else if (key == 'coupons') {
        schema = couponSchema;
    }  else {
        schema = emptySchema;
    }

    return schema;
}

var makeModuleSchemas = {};


// autometic generation of modules in make module define in services index



for (key in Controller.makeModule) {


// console.log(key , makeModule[key])

       if (key == 'users') {
 makeModule[key] = require('./../Models/Users/UsersRoutes').users;
}



       else if (key == 'admins') {
 makeModule[key] = require('./../Models/Admins/AdminsRoutes').admins;
}



       else if (key == 'accessTokens') {
 makeModule[key] = require('./../Models/AccessTokens/AccessTokensRoutes').accessTokens;
}



       else if (key == 'serviceProviders') {
 makeModule[key] = require('./../Models/ServiceProviders/ServiceProvidersRoutes').serviceProviders;
}



       else if (key == 'brands') {
 makeModule[key] = require('./../Models/Brands/BrandsRoutes').brands;
}



       else if (key == 'projects') {
 makeModule[key] = require('./../Models/Projects/ProjectsRoutes').projects;
}



       else if (key == 'contactUs') {
 makeModule[key] = require('./../Models/ContactUs/ContactUsRoutes').contactUs;
}



       else if (key == 'talkToExperts') {
 makeModule[key] = require('./../Models/TalkToExperts/TalkToExpertsRoutes').talkToExperts;
}



       else if (key == 'shortlistedServiceProviders') {
 makeModule[key] = require('./../Models/ShortlistedServiceProviders/ShortlistedServiceProvidersRoutes').shortlistedServiceProviders;
}



       else if (key == 'chats') {
 makeModule[key] = require('./../Models/Chats/ChatsRoutes').chats;
}



       else if (key == 'messages') {
 makeModule[key] = require('./../Models/Messages/MessagesRoutes').messages;
}



       else if (key == 'proposals') {
 makeModule[key] = require('./../Models/Proposals/ProposalsRoutes').proposals;
}



       else if (key == 'proposalInvites') {
 makeModule[key] = require('./../Models/ProposalInvites/ProposalInvitesRoutes').proposalInvites;
}



       else if (key == 'expanterConnects') {
 makeModule[key] = require('./../Models/ExpanterConnects/ExpanterConnectsRoutes').expanterConnects;
}



       else if (key == 'invoices') {
 makeModule[key] = require('./../Models/Invoices/InvoicesRoutes').invoices;
}



       else if (key == 'contracts') {
 makeModule[key] = require('./../Models/Contracts/ContractsRoutes').contracts;
}



       else if (key == 'hirings') {
 makeModule[key] = require('./../Models/Hirings/HiringsRoutes').hirings;
}



       else if (key == 'sentProjectBriefs') {
 makeModule[key] = require('./../Models/SentProjectBriefs/SentProjectBriefsRoutes').sentProjectBriefs;
}



       else if (key == 'notifications') {
 makeModule[key] = require('./../Models/Notifications/NotificationsRoutes').notifications;
}


all = all.concat(makeModule[key].getRoutes());
}


all = all.concat(require('./modelRoutes'));


module.exports = all;
