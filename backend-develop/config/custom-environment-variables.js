/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    "ENV": "NODE_ENV",
    "mongoUri": "MONGO_URI",
    "JWT_SECRET_KEY": "JWT_SECRET_KEY",
    "HAPI_PORT": "PORT",
    "s3Bucket": {
        "accessKeyId": "S3_BUCKET_ACCESS_KEY_ID",
        "secretAccessKey": "S3_BUCKET_SECRET_ACCESS_KEY"
    },
    "s3Notification": {
        "accessKeyId": "SNS_ACCESS_KEY_ID",
        "secretAccessKey": "SNS_SECRET_ACCESS_KEY",
    },
    "ses": {
        "accessKeyId": "SES_ACCESS_KEY_ID",
        "secretAccessKey": "SES_SECRET_ACCESS_KEY",
    },
    "webGoogle": {
        "secret": "WEB_GOOGLE_SECRET"
    },
    "webFb": {
        "secret": "WEB_FB_SECRET"
    },
    "mandrillMailer" : {
        "key" : "MENDRILL_SECRET_KEY"
    },
    "twilio" : {
        "accountSid": "TWILIO_ACCOUNT_SID",
        "authToken": "TWILIO_AUTH_TOKEN",
        "chatKey": "TWILIO_CHAT_API_KEY",
        "chatSecret": "TWILIO_CHAT_API_SECRET",
        "chatServiceSid": "TWILIO_CHAT_SERVICE_SID",
        "msgServiceSid": "TWILIO_MSG_SERVICE_SID"
    },
    "searchApiBaseUrl": "SEARCH_DATA_API_BASE_URL",
    "stripe": {
        "secretKey": "STRIPE_SECRET_KEY",
        "webhookSecret": "STRIPE_WEBHOOK_SECRET"
    }
    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    // models: {
    //   connection: 'someMongodbServer'
    // }

};
