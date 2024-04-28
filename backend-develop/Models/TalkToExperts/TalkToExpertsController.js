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


function TalkToExpertsController(service) {

 
   //console.log('============================================TalkToExpertsController controller initialised')
   ControllerModule.call(this, service);
}

TalkToExpertsController.prototype = Object.create(ControllerModule.prototype)

TalkToExpertsController.prototype.postUserQuery = async function postUserQuery(data) {

    const objToSave = data.payload;

    objToSave.userId = data.userData._id;

    const query = await this.service.addAsync(objToSave);

    const mail = await this.sendContactUsEmailToExpanter.call(this, query, data.userData);

    return query;

}

TalkToExpertsController.prototype.sendContactUsEmailToExpanter = async function sendContactUsEmailToExpanter(queryObj, user) {

    return new Promise((resolve, reject) => {

        const obj = {
            firstName: user.firstName,
            lastName: user.lastName ? user.lastName : "",
            businessName: user.businessName,
            email: user.email,
            userRole: user ? user.userRole : "-",
            topic: queryObj.topic,
            query: queryObj.query
        }

        const emailObj = {
            title: "talkToExpertTemplate",
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
   'talkToExperts': new TalkToExpertsController(Service.makeModule.talkToExperts)
};;