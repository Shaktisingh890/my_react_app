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

var dir = __dirname;
var base = dir.split('/config')[0];
module.exports = {
    webUrl: {
        user: 'https://app.expanter.com',
        admin: 'https://admin.expanter.com',
        adminResetPassword: 'https://admin.expanter.com/admin/resetPassword',
        userResetPassword: 'https://app.expanter.com/user/changePassword',
        userEmailVerification: 'https://app.expanter.com/user/verifyEmail',
        chatUrl: 'https://app.expanter.com/dashboard/discussion_room/',
        proposalUrl: 'https://app.expanter.com/dashboard/proposal_management/',
        projectDetailUrl: 'https://app.expanter.com/dashboard/view_project/marketplace/',
        adminProjectDetailUrl: 'https://admin.expanter.com/dashboard/view_project/projectBriefing/',
        brandPaymentListUrl: 'https://app.expanter.com/dashboard/payments/'
    },
    defaultUrl: {

    },
    THUMB_HEIGHT: 100,
    THUMB_WIDTH: 100,
    s3Bucket: {
        name: 'expanter-dev-media',
        bucketUrl: 'https://expanter-dev-media.s3.ap-east-1.amazonaws.com',
        region: 'ap-east-1',
        endpoint: 's3.ap-east-1.amazonaws.com',
        folders: {
            profile: 'profilePicture',
            thumb: 'thumb'
        }
    },
    s3Notification: {
        snsRegion: 'ap-southeast-1'
    },
    ses: {
        sesRegion: 'ap-southeast-1',
        sesSourceEmail: 'Expanter Notification <hello@expanter.com>'
    },
    iosUserSettings: {
        gateway: 'gateway.sandbox.push.apple.com',
        production: false,
        bundleId: '',
        iosApnCertificate: base + "/",
        passphrase: "",
        p8File: base + "/",
        teamId: "",
        keyId: "",
    },
    androidUserSettings: {
        brandName: '',
        gcmSender: '',
    },
    webGoogle: {
        peopleApiUrl: 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
        accessTokenUrl: 'https://accounts.google.com/o/oauth2/token'
    },
    webFb: {
        accessTokenUrl: 'https://graph.facebook.com/v2.5/oauth/access_token',
        graphApiUrl: 'https://graph.facebook.com/v2.5/me?fields='
    },
    mobileGoogle: {
        verificationUrl: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='
    },
    emailConfig : {
        defaultSender: "Expanter Notification <hello@expanter.com>",
        contactUsReceiver: "hello@expanter.com",
        sendCcToAdmin: true,
        ccEmailTo: "hello@expanter.com"
    },
    sampleBusinessLogo: "https://expntr-public-images.s3.ap-east-1.amazonaws.com/user-icon.png"
    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    // models: {
    //   connection: 'someMongodbServer'
    // }

};
