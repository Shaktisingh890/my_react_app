'use strict';

const Config = require('../constant');
const async = require('async');
const config = require('config');

const UploadManager = require('./UploadManager');

// console.log('***************** Notification Manager : ', config);

const isMailSendingAllowed = true;
const isMessageSendingAllowed = true;
const currentMailer = "AWS";
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.get('mandrillMailer').key);
const awsSDK = require('aws-sdk');

const sendSMSToUser = function(data, callback) {

    var waterfallArray = [];

    waterfallArray.push(getSmsBodyFromDB.bind(null, data));
    waterfallArray.push(updateHandleBarVariables.bind(null));
    waterfallArray.push(sendSMS.bind(null));

    async.waterfall(waterfallArray, waterFallHandler)

    function waterFallHandler(err, resData) {
        return callback(null, resData);
    }
};


function getSmsBodyFromDB(data, callback) {

    const Service = require('../Services');

    const criteria = {
        title: data.title
    };
    const projection = {};
    const options = {
        lean: true,
    }

    Service.makeModule.smsMessages.view(criteria, projection, options, function(err, result) {

        if (err || !result || !result.length) {
            data.body = Config.APP_CONSTANTS.smsNotificationMessages[data.title];
        } else {
            data.smsData = result[0];
            data.body = result[0].body;
        }

        return callback(null, data);
    })

}

function updateHandleBarVariables(data, callback) {
    data.message = renderMessageFromTemplateAndVariables(data.body, data.handlebarData);
    data.subject = renderMessageFromTemplateAndVariables(data.subject, data.handlebarData);
    return callback(null, data);
}


/**
 * [sendEmailToUser description]
 * @param  {[type]}   data     [data should be contain keys [
 * "title(string) : "email title",
 * "handlebarData(object) : "" ,  
 * "email(string)" : "recipients email id" ] ]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const sendEmailToUser = function(data, callback) {
    console.log('sendEmailToUser=====>', data);

    var waterfallArray = [];

    waterfallArray.push(getEmailBodyFromTitle.bind(null, data));
    waterfallArray.push(updateHandleBarVariables);
    if (data.sendAttachement && data.bucket && data.key) {
        waterfallArray.push(getFileFromS3);
    }
    waterfallArray.push(sendMailViaTransporter);

    async.waterfall(waterfallArray, waterFallHandler)

    function waterFallHandler(err, resData) {
        callback(err, resData);
    }
}

function getFileFromS3(data, callback) {

    console.log("getFileFromS3==>", data);

    UploadManager.getS3File(data.bucket, data.key).then((filedata) => {
        console.log("getFileFromS3===filedata=>", filedata);
        data.attachments = [{
            filename: data.filename,
            content: filedata.Body
        }]
        return callback(null, data);
    }).catch((err) => {
        console.log("getFileFromS3==err==>", err);
        return callback(null, data);
    })

}

const sendEmailToUserPromise = function(data) {

    return new Promise((resolve, reject) => {

        sendEmailToUser(data, function(err, resData) {

            console.error(err, data)

            if (err) {
                reject(err)
            } else {
                resolve(resData)
            }

        })

    });
}

function getEmailBodyFromTitle(data, callback) {
    const UniversalFunctions = require('../Utils/UniversalFunctions');

    const templateData = UniversalFunctions.CONFIG.APP_CONSTANTS.emailNotificationMessages[data.title];

    data.templateData = templateData;
    data.body = templateData.emailMessage;
    data.subject = templateData.emailSubject;
    data.sendCopyToAdmin = templateData.sendCopyToAdmin || false;
    return callback(null, data);

}

function renderMessageFromTemplateAndVariables(templateData, variablesData) {
    const Handlebars = require('handlebars');
    if (!templateData) {
        templateData = "test";
    }
    return Handlebars.compile(templateData)(variablesData);
}


/*
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 @ sendMailViaTransporter Function
 @ This function will initiate sending email as per the mailOptions are set
 @ Requires following parameters in mailOptions
 @ from:  // sender address
 @ to:  // list of receivers
 @ subject:  // Subject line
 @ html: html body
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
function sendMailViaTransporter(data, cb) {

    if (currentMailer == "AWS") {

        const sesCredentials = config.get("ses");

        var nodemailer = require('nodemailer');

        const ses = new awsSDK.SES({
            accessKeyId: sesCredentials.accessKeyId,
            secretAccessKey: sesCredentials.secretAccessKey,
            apiVersion: '2010-12-01',
            region: sesCredentials.sesRegion,
            correctClockSkew: true
        });

        var transporter = nodemailer.createTransport({
            SES: ses
        });

        // send to list
        var to = [data.email]

        // const destination = { ToAddresses: to };

        // if (data.sendCopyToAdmin && config.get("emailConfig").sendCcToAdmin) {
        //     destination["CcAddresses"] = [config.get("emailConfig").ccEmailTo];
        // }

        // this sends the email

        if (isMailSendingAllowed) {

            const mailOptions = {
                from: sesCredentials.sesSourceEmail,
                to: to,
                // cc: destination["CcAddresses"],
                subject: data.subject,
                html: data.message
                // Message: {
                //     Subject: {
                //         Data: data.subject
                //     },
                //     Body: {
                //         Html: {
                //             Data: data.message
                //         }
                //     }
                // }
            }

            if (data.sendCopyToAdmin && config.get("emailConfig").sendCcToAdmin) {
                mailOptions["cc"] = [config.get("emailConfig").ccEmailTo];
            }

            if(data.attachments && data.attachments.length) {
                mailOptions.attachments = data.attachments;
            }

            console.log(mailOptions);

            transporter.sendMail(mailOptions, function(err, data) {
                if (err) console.log('======= EMAIL ============ ERROR ============ : ', err);
                else console.log('======= EMAIL ============ Success ============  : ', data);
            });
        }
        cb(null, {}) // Callback is outside as mail sending confirmation can get delayed by a lot of time

    } else if (currentMailer == "MENDRILL") {

        // send to list
        var to = [{
            email: data.email
        }]

        // this sends the email

        var message = {
            html: data.message,
            subject: data.subject,
            from_email: config.get("mandrillMailer").defaultSender,
            to: to
        }

        if (isMailSendingAllowed) {

            mandrill_client.messages.send({
                "message": message
            }, function(err, data) {
                if (err) console.log('======= EMAIL ============ ERROR ============ : ', err);
                else console.log('======= EMAIL ============ Success ============  : ', data);
            });
        }
        cb(null, {}) // Callback is outside as mail sending confirmation can get delayed by a lot of time

    }



}


/*
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 @ sendSMS Function
 @ This function will initiate sending sms as per the smsOptions are set
 @ Requires following parameters in smsOptions
 @ from:  // sender address
 @ to:  // list of receivers
 @ Body:  // SMS text message
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
function sendSMS(smsOptions, cb) {

    var sms = new awsSDK.SNS({
        accessKeyId: s3NotificationCredentials.accessKeyId,
        secretAccessKey: s3NotificationCredentials.secretAccessKey,
        region: s3NotificationCredentials.snsRegion,
    });

    var index = smsOptions.phone.indexOf("+");

    if (index == -1) {
        var phone = '+' + smsOptions.phone;
    } else {
        var phone = smsOptions.phone;
    }
    console.log('======= sendSMS ============ PHONE ============ : ', phone);


    // this sends the email
    if (isMessageSendingAllowed) {

        sms.publish({
            Message: smsOptions.message,
            MessageStructure: 'string',
            PhoneNumber: phone
        }, function(err, data) {
            if (err) console.log('======= sendSMS ============ ERROR ============ : ', err);
            else console.log('======= sendSMS ============ Success ============  : ', data);
        });

    }
    cb(null, {}) // Callback is outside as mail sending confirmation can get delayed by a lot of time
}




function sendSmsAndEmailsTogether(smsData, emailData, callback) {

    var parallelArray = [];


    parallelArray.push(sendSMSToUser.bind(null, smsData));
    parallelArray.push(sendEmailToUser.bind(null, emailData));
    async.parallel(parallelArray, parallelHandler)

    function parallelHandler(err, result) {

        console.log("sendSmsAndEmailsTogether==>err", err);
        console.log("sendSmsAndEmailsTogether==>result", result);

        return callback(null, {});
    }
}

module.exports = {
    sendSMS: sendSMS,
    sendSMSToUser: sendSMSToUser,
    sendEmailToUser: sendEmailToUser,
    sendSmsAndEmailsTogether: sendSmsAndEmailsTogether,
    sendEmailToUserPromise: sendEmailToUserPromise
};