'use strict';

const Config = require('../constant');
const TokenManager = require('./TokenManager');
const Service = require('../Services');
const NotificationManager = require('./NotificationManager');

exports.connectSocket = function(server) {

    if (!server.app) {
        server.app = {}
    }
    server.app.socketConnections = {};

    const socket = require('socket.io').listen(server.listener);

    socket.on('connection', function(socket) {

        socket.on('beOnline', function(data) {
            //Update SocketConnections
            if (data && data.token) {

                TokenManager.verifyToken(data.token, handlerFunction);

                function handlerFunction(err, decodedData) {

                    if (!err && decodedData.userData.id) {
                        server.app.socketConnections[decodedData.userData.id] = socket.id;

                        socket.userId = decodedData.userData.id;

                        socket.userData = {
                            _id: decodedData.userData.id,
                            name: decodedData.userData.name,
                            profilePicURL: decodedData.userData.profilePicURL,
                            email: decodedData.userData.email,
                            userType: decodedData.userData.userType
                        }

                        socket.emit('messageFromServer', { message: 'Socket id Updated', performAction: 'INFO' });

                    } else {
                        socket.emit('messageFromServer', { message: 'Invalid Token', performAction: 'ERROR' });
                    }
                }
            } else {
                socket.emit('messageFromServer', { message: 'Invalid Action', performAction: 'ERROR' });
            }
        });

        socket.emit('messageFromServer', { message: 'WELCOME TO MEDREXA', performAction: 'beOnline' });

        socket.on('disconnect', function() {

            try {
                delete server.app.socketConnections[socket.userId];
            } catch (err) {
                console.log("=== err ===", err);
            }

        });

        socket.on('newMessage', function(data) {

            if (socket.userId) {

                var dataToCheck = {
                    payload: {
                        chatId: data.chatId,
                        sentBy: socket.userId,
                        msgType: Config.APP_CONSTANTS.DATABASE.MSG_TYPES.MSG,
                        msgText: data.msgText,
                        localMsgId: data.localMsgId || ""
                    },
                    userData: socket.userData
                }

                var pushObj = {
                    message: data.msgText,
                    payload: {
                        flag: Config.APP_CONSTANTS.NOTIFICATIONS.PUSH.NEW_MSG.FLAG,
                        type: Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.CHAT,
                        extraData: {
                            msgType: dataToCheck.payload.msgType,
                            msgText: dataToCheck.payload.msgText,
                            isMedia: false,
                            mediaType: "NA",
                            mediaUrl: ''
                        },
                        sentBy: {
                            _id: socket.userId,
                            name: socket.userData.name,
                            profilePicURL: socket.userData.profilePicURL
                        },
                        id: dataToCheck.payload.chatId
                    }
                };

                var msgController = require("../Controllers").makeModule.messages;

                msgController.sendNewMessage(dataToCheck, function(err, ctrlResponse) {
                    if (err) {
                        socket.emit('messageFromServer', { message: 'Error occured in sending this message.', performAction: 'ERROR', localMsgId: dataToCheck.payload.localMsgId })
                    } else {

                        var sparkId = '';

                        pushObj.payload.extraData._id = ctrlResponse._id;
                        pushObj.payload.extraData.createdAt = ctrlResponse.createdAt;
                        pushObj.payload.extraData.updatedAt = ctrlResponse.updatedAt;
                        

                            var dataToSend = {
                                chatId: ctrlResponse.chatId,
                                sentBy: {
                                    _id: socket.userId,
                                    name: socket.userData.name,
                                    email: socket.userData.email,
                                    profilePicURL: socket.userData.profilePicURL,
                                    userType: socket.userData.userType
                                },
                                msgType: ctrlResponse.msgType,
                                msgText: ctrlResponse.msgText,
                                isMedia: ctrlResponse.isMedia,
                                mediaType: "NA",
                                mediaUrl: '',
                                _id: ctrlResponse._id,
                                createdAt: ctrlResponse.createdAt,
                                updatedAt: ctrlResponse.updatedAt
                            };

                            ctrlResponse.sentTo.forEach(function(eachRecipient) {

                                sparkId = server.app.socketConnections[eachRecipient];

                                console.log("sparkId: ", sparkId);

                                try {

                                    socket.to(sparkId).emit(Config.APP_CONSTANTS.DATABASE.socketConstants.NewMessage, { message: 'Message Received.', data: dataToSend });

                                    

                                    console.log("===getUserDeviceTokenAndSendPush==eachRecipient=", eachRecipient);

                                    pushObj.payload.userId = eachRecipient;

                                    NotificationManager.getUserDeviceTokenAndSendPush(pushObj, eachRecipient);

                                } catch (err) {

                                    console.log("err: ", err);

                                    // NotificationManager.getUserDeviceTokenAndSendPush(pushObj, eachRecipient);

                                }

                            })

                            socket.emit('messageAck', { message: 'Message Sent.', data: dataToSend, localMsgId: dataToCheck.payload.localMsgId });
                        
                    }
                })

            } else {
                socket.emit('messageFromServer', { message: 'Error occured in sending this message.', performAction: 'ERROR', localMsgId: data.localMsgId });
            }

        });

    });

    process.on(Config.APP_CONSTANTS.DATABASE.socketConstants.NewFileMsg, function(ctrlResponse) {
        if (ctrlResponse.msgData.sentTo.length) {

            var sparkId = '';

            var pushObj = {
                    message: Config.APP_CONSTANTS.NOTIFICATIONS.PUSH.NEW_MSG.MESSAGE,
                    payload: {
                        flag: Config.APP_CONSTANTS.NOTIFICATIONS.PUSH.NEW_MSG.FLAG,
                        type: Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.CHAT,
                        id: ctrlResponse.msgData.chatId,
                        extraData: {
                            msgType: ctrlResponse.msgData.msgType,
                            msgText: ctrlResponse.msgData.msgText,
                            isMedia: ctrlResponse.msgData.isMedia,
                            mediaType: ctrlResponse.msgData.mediaType,
                            mediaUrl: ctrlResponse.msgData.mediaUrl,
                            _id: ctrlResponse.msgData._id,
                            createdAt: ctrlResponse.msgData.createdAt,
                            updatedAt: ctrlResponse.msgData.updatedAt
                        },
                        sentBy: {
                            _id: ctrlResponse.userData.userId,
                            name: ctrlResponse.userData.name,
                            profilePicURL: ctrlResponse.userData.profilePicURL
                        }
                    }
                };


                var dataToSend = {
                    chatId: ctrlResponse.msgData.chatId,
                    sentBy: {
                        _id: ctrlResponse.userData._id,
                        name: ctrlResponse.userData.name,
                        email: ctrlResponse.userData.email,
                        profilePicURL: ctrlResponse.userData.profilePicURL,
                        userType: ctrlResponse.userData.userType
                    },
                    msgType: ctrlResponse.msgData.msgType,
                    msgText: ctrlResponse.msgData.msgText,
                    isMedia: ctrlResponse.msgData.isMedia,
                    mediaType: ctrlResponse.msgData.mediaType,
                    mediaUrl: ctrlResponse.msgData.mediaUrl,
                    _id: ctrlResponse.msgData._id,
                    createdAt: ctrlResponse.msgData.createdAt,
                    updatedAt: ctrlResponse.msgData.updatedAt
                };

                ctrlResponse.msgData.sentTo.forEach(function(eachRecipient) {

                    sparkId = server.app.socketConnections[eachRecipient];

                    console.log("sparkId: ", sparkId);

                    try {

                        socket.to(sparkId).emit(Config.APP_CONSTANTS.DATABASE.socketConstants.NewMessage, { message: 'Message Received.', data: dataToSend });

                        pushObj.payload.userId = eachRecipient;

                         NotificationManager.getUserDeviceTokenAndSendPush(pushObj, eachRecipient);

                    } catch (err) {

                        console.log("=== err ===", err);
                        

                    }

                })

                var ackSparkId = server.app.socketConnections[ctrlResponse.userData._id];

                socket.to(ackSparkId).emit('messageAck', { message: 'Message Sent.', data: dataToSend, localMsgId: ctrlResponse.msgData.localMsgId });

        } else {
            console.log('User id not found');
        }
    });


};