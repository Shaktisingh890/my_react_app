var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');

const _ = require("underscore");
const config = require("config");
const moment = require("moment");

const accountSid = config.get("twilio").accountSid;
const authToken = config.get("twilio").authToken;

const twilioChatApiKey = config.get("twilio").chatKey;
const twilioChatApiSecret = config.get("twilio").chatSecret;

const twilioChatServiceSid = config.get("twilio").chatServiceSid;
const twilioMsgServiceSid = config.get("twilio").msgServiceSid;

const client = require('twilio')(accountSid, authToken);

const AccessToken = require('twilio').jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
var NotificationManager = require('../../Lib/NotificationManager');


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function ChatsController(service) {


   //console.log('============================================ChatsController controller initialised')
   ControllerModule.call(this, service);
}

ChatsController.prototype = Object.create(ControllerModule.prototype)

ChatsController.prototype.initiateChat = async function initiateChat(data) {

   const participants = [data.userData._id, data.payload.otherUser];

   const chat = await this.service.viewAsync({ projectId: data.payload.projectId, participants: { $all: participants } }, {}, {lean: true, limit: 1});

   let chatObj = chat[0];

   if(!chatObj) {

      const otherUserData = await Service.makeModule.users.viewAsyncById({_id: data.payload.otherUser, isDeleted: false}, {password: 0}, {lean: true, limit: 1});

      if(otherUserData.userRole === data.userData.userRole) {
         const userRole = Config.APP_CONSTANTS.DATABASE.userRole[data.userData.userRole];
         return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.CANT_CHAT_WITH_SAME_USER_ROLE(userRole));
      }

      const brandId = (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) ? data.userData._id : data.payload.otherUser;

      const project = await Service.makeModule.projects.viewAsyncById({_id: data.payload.projectId, brandId: brandId, isDeleted: false}, {}, {lean: true, limit: 1});

      const chatInitSource = project.isPublished ? Config.APP_CONSTANTS.DATABASE_KEYS.chatInitSources.marketplace : Config.APP_CONSTANTS.DATABASE_KEYS.chatInitSources.search;

      let chat_unique_name = data.payload.projectId;

      if(project.brandId === data.userData._id) {
         chat_unique_name += `_${data.payload.otherUser}_${new Date().getTime()}`;
      } else {
         chat_unique_name += `_${data.userData._id}_${new Date().getTime()}`;
      }

      const friendlyName = `${project.name}`;

      const conversationObj = { friendlyName: friendlyName, uniqueName: chat_unique_name, messagingServiceSid: twilioMsgServiceSid };

      const twilioChat = await client.conversations.services(twilioChatServiceSid)
                                                   .conversations.create(conversationObj);

      const objToSave = {
         projectId: data.payload.projectId,
         title: project.name,
         initiatedBy: data.userData._id,
         otherUser: data.payload.otherUser,
         participants: participants,
         twilioConversationSid: twilioChat.sid,
         twilioChatSid: twilioChat.chatServiceSid,
         twilioChatObj: JSON.stringify(twilioChat),
         initSource: chatInitSource
      }

      if(data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {
         objToSave.brandId = data.userData._id;
         objToSave.serviceProviderId = data.payload.otherUser;
      } else {
         objToSave.brandId = data.payload.otherUser;
         objToSave.serviceProviderId = data.userData._id;
      }

      chatObj = await this.service.addAsync(objToSave);

      const chatInitiater = await client.conversations.services(twilioChatServiceSid)
                                                      .conversations(chatObj.twilioConversationSid)
                                                      .participants
                                                      .create({identity: chatObj.initiatedBy.toString()});

      const otherParticipant = await client.conversations.services(twilioChatServiceSid)
                                                         .conversations(chatObj.twilioConversationSid)
                                                         .participants
                                                         .create({identity: chatObj.otherUser.toString()});

   }

   return chatObj;

}

ChatsController.prototype.getChats = async function getChats(data) {

   const criteria = {
      participants: data.userData._id,
      deletedFor: {$ne: data.userData._id},
      population: [{ path: "projectId", select: "name createdAt briefType isPublished", match: {isDeleted: false} }, { path: "participants", select: "businessName userRole logo" }, { path: "brandId", select: "businessName userRole logo", match: {isDeleted: false} }, { path: "serviceProviderId", select: "businessName userRole logo", match: {isDeleted: false} }]
   }

   const projection = { archivedFor: 0, deletedFor: 0 };

   const options = { lean: true, sort: { updatedAt: -1 } };

   let chats = await this.service.viewAsync(criteria, projection, options);

   chats = chats.filter(x => x.projectId && x.brandId && x.serviceProviderId);

   return chats;

}

ChatsController.prototype.updateChatLastMessage = async function updateChatLastMessage(data) {

   const viewCriteria = {
      _id: data.payload._id,
      participants: data.userData._id,
      population: [{path: "projectId"}, {path: "brandId", select: "businessName email"}, {path: "serviceProviderId", select: "businessName email"}]
   }

   const chatDetails = await this.service.viewAsyncById(viewCriteria, {}, {lean: true, limit: 1});

   console.log("updateChatLastMessage==>", chatDetails);

   const criteria = {
      _id: data.payload._id,
      participants: data.userData._id
   }

   const projection = { lastMessage: data.payload.lastMessage, lastMessageBy: data.userData._id };

   const options = { new: true };

   let chat = await this.service.editAsync(criteria, projection, options);

   let sendEmail = false;

   const receiverData =  (data.userData._id.toString() === chat.brandId.toString()) ? _.clone(chatDetails.serviceProviderId) : _.clone(chatDetails.brandId);

   console.log("receiverData===>", receiverData)

   if(!chat.lastMessageEmailTime || !chat.lastMessageEmailTime[receiverData._id.toString()]) {
      sendEmail = true;
   } else if(chat.lastMessageEmailTime[receiverData._id.toString()]) {
      const a = moment(chat.lastMessageEmailTime[receiverData._id.toString()]);
      const b = moment();
      const diff = b.diff(a, "minutes");
      sendEmail = (diff >= 60) ? true : false;
   }

   if(sendEmail) {

      const senderData = data.userData;
      const project = chatDetails.projectId;
      const chatEmail = await this.sendNewMessageEmail(senderData, receiverData, project, chat);

      const lastMessageEmailTime = chat.lastMessageEmailTime || {};

      lastMessageEmailTime[receiverData._id.toString()] = new Date();

      chat = await this.service.editAsync(criteria, {lastMessageEmailTime: lastMessageEmailTime}, options);

      await addNewMessageNotification(senderData, receiverData, chat);

   }

   return chat;

}

function addNewMessageNotification(sender, receiver, chat) {

   const handlebarObj = {
      userName: sender.businessName
   }

   const notifObj = Config.APP_CONSTANTS.NOTIFICATIONS.PUSH.NEW_MESSAGE;

   notifObj.message = UniversalFunctions.renderMessageFromTemplateAndVariables(notifObj.message, handlebarObj);

   notifObj.userId = receiver._id;
   notifObj.sentBy = sender._id;
   notifObj.notificationType = Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.MESSAGE;

   notifObj.extraData = { _id: chat._id, lastMessage: chat.lastMessage };

   return Service.makeModule.notifications.addAsync(notifObj);

}

ChatsController.prototype.sendNewMessageEmail = function sendNewMessageEmail(sender, receiver, project, chat) {

    return new Promise((resolve, reject) => {

      console.log("sendNewMessageEmail==>", receiver)

        const obj = {
            userName: receiver.businessName,
            senderName: sender.businessName,
            projectName: project.name,
            chatUrl: config.get("webUrl").chatUrl + chat._id
        }

        const emailObj = {
            title: "newMessageReceived",
            handlebarData: obj,
            email: receiver.email
        }

        NotificationManager.sendEmailToUser(emailObj, (err, res) => {

            console.log("sendNewMessageEmail===>", err, res);

            resolve({});

        })

    })

}

ChatsController.prototype.getChatDetails = async function getChatDetails(data) {

   const criteria = {
      _id: data.payload._id,
      participants: data.userData._id,
      deletedFor: {$ne: data.userData._id},
      population: [{ path: "projectId", select: "name createdAt briefType isPublished" }, { path: "participants", select: "businessName userRole logo" }, { path: "brandId", select: "businessName userRole logo" }, { path: "serviceProviderId", select: "businessName userRole logo" }]
   }

   const projection = { archivedFor: 0, deletedFor: 0 };

   const options = { lean: true, limit: 1, sort: { updatedAt: -1 } };

   const chat = await this.service.viewAsyncById(criteria, projection, options);

   const shortlistCriteria = { projectId: chat.projectId._id, brandId: chat.brandId, serviceProviderId: chat.serviceProviderId, isDeleted: false };

   const shortlisted = await Service.makeModule.shortlistedServiceProviders.viewAsync(shortlistCriteria, {}, { lean: true, limit: 1 });

   chat.isShortlisted = shortlisted.length ? true : false;

   const proposalInvite = await Service.makeModule.proposalInvites.viewAsync({projectId: chat.projectId._id, brandId: chat.brandId, serviceProviderId: chat.serviceProviderId, isDeleted: false}, {}, {lean: true, limit: 1});

   chat.askedForProposal = proposalInvite.length ? true : false;

   const proposalSent = await Service.makeModule.proposals.viewAsync({projectId: chat.projectId._id, brandId: chat.brandId, serviceProviderId: chat.serviceProviderId, isDeleted: false}, {}, {lean: true, limit: 1, sort: {createdAt: -1}});

   chat.proposalSent = proposalSent.length ? true : false;

   if(chat.proposalSent) {
      chat.proposalId = proposalSent[0]._id;
   }

   return chat;

}

ChatsController.prototype.getTwilioToken = async function getTwilioToken(data) {

   const criteria = {_id: data.payload._id }

   const projection = {};

   const options = { lean: true, limit: 1 };

   const chatObj = await this.service.viewAsyncById(criteria, projection, options);

   const serviceSid = chatObj.twilioChatSid;
   const identity = data.userData._id.toString();

   const chatGrant = new ChatGrant({
     serviceSid: serviceSid,
   });

   const TTL = 86400;

   // Create an access token which we will sign and return to the client,
   // containing the grant we just created
   const token = new AccessToken(
     accountSid,
     twilioChatApiKey,
     twilioChatApiSecret,
     {identity: identity},
     TTL
   );

   token.addGrant(chatGrant);

   // Serialize the token to a JWT string
   console.log(token.toJwt());

   return {token: token.toJwt()};

}

module.exports = {
   'chats': new ChatsController(Service.makeModule.chats)
};;