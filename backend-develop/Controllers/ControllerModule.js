'use strict';

var controllerHelper = require('./commonControllerFunctions');
var charts = require('../Utils/charts')
var UploadManager = require('../Lib/UploadManager');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Config = require('../constant');

var config = require('config');

function startSection(sectionName) {

}


var ControllerModule = function(service) {
    this.service = service;
    this.debug = true;
}

ControllerModule.prototype.getFromService = function(data, callback) {


    data.criteria.isDeleted = {
        $ne: true
    }

    this.service.view(data.criteria, data.projection, data.options, callback);
}

ControllerModule.prototype.getTotalCount = function(data, callback) {

    this.service.count(data.criteria, callback);
}

ControllerModule.prototype.list = function (payloadData, callback) {

    var parallelArray = {};
    parallelArray.dataList = this.getFromService.bind(this, payloadData);

    if(payloadData.pageData) {
        parallelArray.count = this.getTotalCount.bind(this, payloadData);
    }

    controllerHelper.handleParallelFunctions(parallelArray, function(err, response) {
        if (err)
            return callback(err);

        if(response.count) {
            var extraData = {
                page: payloadData.pageData.page,
                perPage: payloadData.pageData.perPage,
                total: response.count
            }

            return callback(null, response.dataList, null, extraData);

        } else {
            return callback(null, response.dataList);
        }

    })

};

ControllerModule.prototype.listAsync = function(payloadData, callback) {


    return new Promise( (resolve, reject) => {

        this.getFromService.call(this, payloadData, (err , result)=>{

            if(err){
                reject(err);
            } else {
                resolve(result)
            }

        })

    });


};


ControllerModule.prototype.getGraph = function(data, callback) {


    this.graphOption.data = data;


    var chart = charts(this.graphOption);

    process.nextTick(callback.bind(null, null, chart));
}





ControllerModule.prototype.graph = function(payloadData, callback) {
    this.graphOption = payloadData.graphOption;

    var waterfallArray = [];
    waterfallArray.push(this.getFromService.bind(this, payloadData));
    waterfallArray.push(this.getGraph.bind(this));


    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};




ControllerModule.prototype.listById = function(payloadData, callback) {


    var waterfallArray = [];
    waterfallArray.push(this.getFromService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, function(err, result) {

        if (err) {
            return callback(err)
        }


        return callback(null, result[0])

    })
};

ControllerModule.prototype.listByIdAsync = function(payloadData, callback) {

     console.log("in ControllerModule listByIdAsync", payloadData);


    return new Promise( (resolve, reject) => {

         console.log("in ControllerModule listByIdAsync Promise");

        this.getFromService.call(this, payloadData, (err , result)=>{

            console.log("ControllerModule.prototype.listByIdAsync", err , result);

            if(err){
                reject(err);
            } else {
                resolve(result[0])
            }

        })

    });

};

ControllerModule.prototype.editAsync = function(criteria, projection, options) {

return new Promise( (resolve, reject) => {

    this.service.edit(criteria, projection || {} , options || {}, function(err, result){
            if(err){
                reject(err);
            } else {
                resolve(result)
            }

    });

});

};

ControllerModule.prototype.editUpsertAsync = function(criteria, projection) {

    console.log("---------", criteria, projection)

return this.editAsync(criteria,projection, { new : true , upsert : true , lean : true})

};


ControllerModule.prototype.addService = function(data, callback) {


    if (this.fakeDelete && this.uniqueKeys) {



        var criteria = {}

        

        this.uniqueKeys.forEach(function(key) {

            criteria[key] = data[key]

        })


        data.isDeleted = false;



        this.service.edit(criteria, data, { upsert: true, lean: true, new: true, setDefaultsOnInsert: true }, callback);

    } else {
        this.service.add(data, callback);
    }





}

ControllerModule.prototype.add = function(payloadData, callback) {

    var waterfallArray = [];

    if (this.imageUpload) {

        waterfallArray.push(this.uploadImage.bind(this, payloadData));
        waterfallArray.push(this.addService.bind(this));

    } else {
        waterfallArray.push(this.addService.bind(this, payloadData));
    }

    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};


ControllerModule.prototype.addAsync = function (payloadData) {
    return new Promise((resolve , reject)=>{
       // console.log("------------>>>> in promise", payloadData)
        var waterfallArray = [];

        if (this.imageUpload) {

            waterfallArray.push(this.uploadImage.bind(this, payloadData));
            waterfallArray.push(this.addService.bind(this));

        } else {
            waterfallArray.push(this.addService.bind(this, payloadData));
        }

        controllerHelper.handleWaterFallFunctions(waterfallArray, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }  

        })
    });
}



ControllerModule.prototype.editService = function(data, callback) {

    this.service.edit(data.criteria, data.projection, data.options, callback);
}

ControllerModule.prototype.multiEditService = function(data, callback) {

    this.service.multiEdit(data.criteria, data.projection, data.options, callback);
}


ControllerModule.prototype.edit = function(payloadData, callback) {

    var waterfallArray = [];


    if (this.imageUpload) {
        waterfallArray.push(this.uploadImage.bind(this, payloadData));
        waterfallArray.push(this.editService.bind(this));

    } else {
        waterfallArray.push(this.editService.bind(this, payloadData));
    }
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};



ControllerModule.prototype.multiEdit = function(payloadData, callback) {

    var waterfallArray = [];
    waterfallArray.push(this.multiEditService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};

ControllerModule.prototype.deleteService = function(data, callback) {

    if (this.fakeDelete) {
        this.service.edit(data.criteria, { isDeleted: true }, { lean: true }, function(err, result) {


            if (err) {
                return callback(err);
            }

            if (result == null) {
                return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID_PROVIDED)
            }


            callback(err, result)

        });

    } else {


        this.service.remove(data.criteria, callback);


    }



}


ControllerModule.prototype.delete = function(payloadData, callback) {

    var waterfallArray = [];
    waterfallArray.push(this.deleteService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};

ControllerModule.prototype.dataTableService = function(data, callback) {


    if (data.extraCondition) {
        data.criteria = data.extraCondition

    }
    this.service.dataTable(data, {}, callback);
}


ControllerModule.prototype.dataTable = function(payloadData, callback) {


    var waterfallArray = [];
    waterfallArray.push(this.dataTableService.bind(this, payloadData));
    controllerHelper.handleWaterFallFunctions(waterfallArray, callback)
};


ControllerModule.prototype.uploadImage = function(data, callback) {



    console.log(data)

    var imageFile = this.imageFile
    var imageURL = this.imageURL
    var isAdvancedImageObject = this.isAdvancedImageObject

    var fullData = data;

    if (fullData.projection) {
        data = data.projection
    }


    if (data && data[imageURL] && data[imageURL].thumbnail == 'null') {
        data[imageURL] = {
            thumbnail: null,
            original: null

        }
    }
    if (data[imageFile] && data[imageFile].filename) {

        data[imageURL] = data[imageFile];
        data[imageURL].size = {
            height: 200,
            width: 320
        }
        var time = new Date().getTime();

        UploadManager.uploadFileToS3WithThumbnail(data[imageURL], time + "", function(err, uploadedInfo) {

            if (err) {
                callback(err)
            } else {


                data[imageURL] = {};
                        data[imageURL].size = {
            height: 200,
            width: 320
        }

                if(!isAdvancedImageObject)
                {


                data[imageURL].original = uploadedInfo && uploadedInfo.original && config.get('s3Bucket').bucketUrl +"/files/"+ uploadedInfo.original || null;
                data[imageURL].thumbnail = uploadedInfo && uploadedInfo.thumbnail && config.get('s3Bucket').bucketUrl +"/files/"+ uploadedInfo.thumbnail || null;


                }else{


                data[imageURL].original = {
                    url : uploadedInfo && uploadedInfo.original && config.get('s3Bucket').bucketUrl +"/files/"+ uploadedInfo.original || null ,
                    height : 0 ,
                    width : 0

                }
                data[imageURL].thumbnail ={

                    url : uploadedInfo && uploadedInfo.thumbnail && config.get('s3Bucket').bucketUrl+"/files/" + uploadedInfo.thumbnail || null ,
                    height : data[imageURL].size.height,
                    width : data[imageURL].size.width


                }



                }

                if (fullData.projection) {
                    fullData.projection = data
                }

                console.log("--------------fulldata"+fullData)
                callback(null, fullData);

            }
        })

    } else {
        if (fullData.projection) {
            fullData.projection = data
        }

        process.nextTick(callback.bind(this, null, fullData));
    }

}




exports.ControllerModule = ControllerModule;
