var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');

const mongoose = require('mongoose');

function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function ShortlistedServiceProvidersController(service) {


    //console.log('============================================ShortlistedServiceProvidersController controller initialised')
    ControllerModule.call(this, service);
}

ShortlistedServiceProvidersController.prototype = Object.create(ControllerModule.prototype)

ShortlistedServiceProvidersController.prototype.shortlistServiceProvider = async function shortlistServiceProvider(data) {

    const projectCriteria = { _id: data.payload.projectId, brandId: data.userData._id, isDeleted: false }

    const project = await Service.makeModule.projects.viewAsyncById(projectCriteria, {}, { lean: true, limit: 1 });

    const objToSave = data.payload;

    objToSave.brandId = data.userData._id;

    const shortlist = await this.service.editAsync(objToSave, { isDeleted: false }, { upsert: true, new: true });

    updateShortlistedCountForBrandAndSP(data.userData._id, data.payload.serviceProviderId);

    return {};

}

ShortlistedServiceProvidersController.prototype.removeShortlistedServiceProvider = async function removeShortlistedServiceProvider(data) {

    const projectCriteria = { _id: data.payload.projectId, brandId: data.userData._id, isDeleted: false }

    const project = await Service.makeModule.projects.viewAsyncById(projectCriteria, {}, { lean: true, limit: 1 });

    const criteria = data.payload;

    criteria.brandId = data.userData._id;

    const shortlist = await this.service.editAsync(criteria, { isDeleted: true }, { upsert: true, new: true });

    updateShortlistedCountForBrandAndSP(data.userData._id, data.payload.serviceProviderId);

    return {};

}

async function updateShortlistedCountForBrandAndSP(brandId, serviceProviderId) {

    const spQuery = [{
        $match: {serviceProviderId: mongoose.Types.ObjectId(serviceProviderId), isDeleted: false}
    }, {
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    }]

    const shortlistedTimes = await Service.makeModule.shortlistedServiceProviders.aggregateAsync(spQuery, null, null);

    console.log("shortlistedTimes===>", shortlistedTimes);

    const spCount = (shortlistedTimes[0] && shortlistedTimes[0].count) ? shortlistedTimes[0].count : 0;

    const sp = await Service.makeModule.users.editAsync({_id: serviceProviderId}, {shortlistedTimes: spCount}, {});

    const brandQuery = [{
        $match: {brandId: mongoose.Types.ObjectId(brandId), isDeleted: false}
    }, {
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    }]

    const shortlistedSpCount = await Service.makeModule.shortlistedServiceProviders.aggregateAsync(brandQuery, null, null);

    const brandCount = (shortlistedSpCount[0] && shortlistedSpCount[0].count) ? shortlistedSpCount[0].count : 0;

    console.log("shortlistedSpCount===>", shortlistedSpCount);

    const brand = await Service.makeModule.users.editAsync({_id: brandId}, {shortlistedSpCount: brandCount}, {});

    return;

}

module.exports = {
    'shortlistedServiceProviders': new ShortlistedServiceProvidersController(Service.makeModule.shortlistedServiceProviders)
};;