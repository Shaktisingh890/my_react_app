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


function ExpanterConnectsController(service) {


    //console.log('============================================ExpanterConnectsController controller initialised')
    ControllerModule.call(this, service);
}

ExpanterConnectsController.prototype = Object.create(ControllerModule.prototype)

ExpanterConnectsController.prototype.expanterConnects = async function expanterConnects(data) {

    const objToSave = data.payload;

    objToSave.brandId = data.userData._id;

    const query = await this.service.addAsync(objToSave);

    const serviceProvider = JSON.parse(query.otherDetails);

    const mail = await this.sendContactUsEmailToExpanter(serviceProvider, data.userData);

    return query;

}

ExpanterConnectsController.prototype.sendContactUsEmailToExpanter = async function sendContactUsEmailToExpanter(provider, brand) {

    return new Promise((resolve, reject) => {

        const obj = {
            "brandName": brand.businessName || "Brand",
            "expanterid": provider.expanterid,
            "name": provider.name,
            "primary_email": provider.primary_email,
            "url": provider.url,
            "linkedin_url": provider.linkedin_url,
            "description": provider.description,
            "tagline": provider.tagline,
            "specialities": provider.specialities,
            "additional_speciality": provider.additional_speciality,
            "linkedin_specialities": provider.linkedin_specialities,
            "capabilities": provider.capabilities,
            "industry": provider.industry
        }

        const emailObj = {
            title: "expanterConnectsTemplate",
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
    'expanterConnects': new ExpanterConnectsController(Service.makeModule.expanterConnects)
};;