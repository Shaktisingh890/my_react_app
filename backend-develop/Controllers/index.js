

var ControllerModule = require('./ControllerModule').ControllerModule;
var Service = require('../Services');



var objectToExport = {
  makeModule: {}
};


for (key in Service.makeModule) {
  objectToExport.makeModule[key] = new ControllerModule(Service.makeModule[key]);

}



objectToExport.makeModule['users'] = require('../Models/Users/UsersController').users;



objectToExport.makeModule['admins'] = require('../Models/Admins/AdminsController').admins;



objectToExport.makeModule['accessTokens'] = require('../Models/AccessTokens/AccessTokensController').accessTokens;



objectToExport.makeModule['serviceProviders'] = require('../Models/ServiceProviders/ServiceProvidersController').serviceProviders;



objectToExport.makeModule['brands'] = require('../Models/Brands/BrandsController').brands;



objectToExport.makeModule['projects'] = require('../Models/Projects/ProjectsController').projects;



objectToExport.makeModule['contactUs'] = require('../Models/ContactUs/ContactUsController').contactUs;



objectToExport.makeModule['talkToExperts'] = require('../Models/TalkToExperts/TalkToExpertsController').talkToExperts;



objectToExport.makeModule['shortlistedServiceProviders'] = require('../Models/ShortlistedServiceProviders/ShortlistedServiceProvidersController').shortlistedServiceProviders;



objectToExport.makeModule['chats'] = require('../Models/Chats/ChatsController').chats;



objectToExport.makeModule['messages'] = require('../Models/Messages/MessagesController').messages;



objectToExport.makeModule['proposals'] = require('../Models/Proposals/ProposalsController').proposals;



objectToExport.makeModule['proposalInvites'] = require('../Models/ProposalInvites/ProposalInvitesController').proposalInvites;



objectToExport.makeModule['expanterConnects'] = require('../Models/ExpanterConnects/ExpanterConnectsController').expanterConnects;



objectToExport.makeModule['invoices'] = require('../Models/Invoices/InvoicesController').invoices;



objectToExport.makeModule['contracts'] = require('../Models/Contracts/ContractsController').contracts;



objectToExport.makeModule['hirings'] = require('../Models/Hirings/HiringsController').hirings;



objectToExport.makeModule['sentProjectBriefs'] = require('../Models/SentProjectBriefs/SentProjectBriefsController').sentProjectBriefs;



objectToExport.makeModule['notifications'] = require('../Models/Notifications/NotificationsController').notifications;


module.exports = objectToExport;
