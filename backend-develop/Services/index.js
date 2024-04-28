
var Models = require('../Models');

var serviceModule = require('./ServiceModule').ServiceModule;

var makeModule = {


 'users' : Models.Users

,'admins' : Models.Admins

,'accessTokens' : Models.AccessTokens

,'serviceProviders' : Models.ServiceProviders

,'brands' : Models.Brands

,'projects' : Models.Projects

,'contactUs' : Models.ContactUs

,'talkToExperts' : Models.TalkToExperts

,'shortlistedServiceProviders' : Models.ShortlistedServiceProviders

,'chats' : Models.Chats

,'messages' : Models.Messages

,'proposals' : Models.Proposals

,'proposalInvites' : Models.ProposalInvites

,'expanterConnects' : Models.ExpanterConnects

,'invoices' : Models.Invoices

,'contracts' : Models.Contracts

,'hirings' : Models.Hirings

,'sentProjectBriefs' : Models.SentProjectBriefs

,'notifications' : Models.Notifications
}

var objectToExport = {
  makeModule: {},
};


for (key in makeModule) {
  objectToExport.makeModule[key] = new serviceModule(makeModule[key]);
}


module.exports = objectToExport;
