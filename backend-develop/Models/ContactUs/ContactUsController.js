var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');
var NotificationManager = require('../../Lib/NotificationManager');

const config = require('config');

function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function ContactUsController(service) {


    //console.log('============================================ContactUsController controller initialised')
    ControllerModule.call(this, service);
}

ContactUsController.prototype = Object.create(ControllerModule.prototype)

ContactUsController.prototype.postUserQuery = async function postUserQuery(data) {

    const objToSave = data.payload;

    if(data.userData) {
        objToSave.userId = data.userData._id;
    }

    const query = await this.service.addAsync(objToSave);

    const mail = await this.sendContactUsEmailToExpanter.call(this, query, data.userData);

    return query;

}

ContactUsController.prototype.sendContactUsEmailToExpanter = async function sendContactUsEmailToExpanter(queryObj, user) {

    return new Promise((resolve, reject) => {

        const obj = {
            firstName: user.firstName,
            lastName: user.lastName ? user.lastName : "",
            businessName: user.businessName,
            email: user.email,
            userRole: user ? user.userRole : "-",
            subject: queryObj.subject,
            query: queryObj.query
        }

        const emailObj = {
            title: "contactUsTemplate",
            handlebarData: obj,
            email: config.get("emailConfig").contactUsReceiver
        }

        NotificationManager.sendEmailToUser(emailObj, (err, res) => {

            console.log("sendContactUsEmailToExpanter===>", err, res);

            resolve({});

        })

    })

}


module.exports = {
    'contactUs': new ContactUsController(Service.makeModule.contactUs)
};;