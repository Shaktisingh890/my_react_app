var UniversalFunctions = require('../Utils/UniversalFunctions');


var Config = require('../constant');
var async = require('async');
const _ = require("underscore");


function ServiceModule(model) {

    this.model = model;

}

// array should contain {
// query : {} , 
// dataToUpdate : {}
// } type object

var bulkUpdate = function(updateArray, callback) {

    // var bulk =  this.model.collection.initializeOrderedBulkOp();

    // updateArray.forEach(function (singleUpdateData) {
    //   bulk.find(singleUpdateData.query).updateOne(singleUpdateData.dataToUpdate);
    // })

    // bulk.execute(callback); 


    this.model.bulkWrite(updateArray, {}, callback)

}

ServiceModule.prototype.bulkUpdate = bulkUpdate;


var bulkUpdateAsync = function(updateArray, callback) {


    //console.log("=---------------bulkUpdateAsyncbulkUpdateAsync", updateArray)

    return new Promise((resolve, reject) => {

        bulkUpdate.call(this, updateArray, function(err, result) {

            if (err) {
                reject(err)
            }

            resolve(result);

        });

    })


}

ServiceModule.prototype.bulkUpdateAsync = bulkUpdateAsync;



var add = function(objToSave, callback) {
    new this.model(objToSave).save(

        function(err, result) {
            if (err) {

                var modifiedError = UniversalFunctions.advancedFunctions.checkingMongoDbErrors(err);
                if (modifiedError != -1) {
                    return callback(modifiedError)
                }
            }

            callback(err, result)


        })
};

ServiceModule.prototype.add = add;

var addAsync = function(objToSave) {


    return new Promise((resolve, reject) => {

        add.call(this, objToSave, function(err, result) {

            console.log("addAsync=====>", err, result)

            if (err) {
                reject(err)
            }

            try {
                const jsonResult = result.toJSON();
                resolve(jsonResult);
            } catch (e) {
                console.log(e);
                resolve(result);
            }

        });

    })
};

ServiceModule.prototype.addAsync = addAsync;




var insertMany = function(objsToSave, callback) {

    var seriesArray = [];
    var _this = this;


    objsToSave.forEach(function(objToSave) {

        seriesArray.push(function(cb) {
            new _this.model(objToSave).save(cb)
        });

    })


    async.series(seriesArray, callback)
}

ServiceModule.prototype.insertMany = insertMany;


var insertManySync = function(objsToSave, callback) {


    return new Promise((resolve, reject) => {
        var seriesArray = [];
        var _this = this;


        objsToSave.forEach(function(objToSave) {

            seriesArray.push(function(cb) {
                new _this.model(objToSave).save(cb)
            });

        })


        async.series(seriesArray, function(err, result) {
            if (err)
                reject(err);

            resolve(result);


        })



    })

}

ServiceModule.prototype.insertManySync = insertManySync;


var view = function(criteria, projection, options, callback) {

    var population = _.clone(criteria.population);

    delete criteria.population;

    console.log(criteria, population);

    var query = this.model.find(criteria, projection, options);
    if (population) {

        query.populate(population)
    }
    query.exec(function(err, result) {

        if (err) {
            console.log(err)
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }


        callback(err, result);
    });


}

ServiceModule.prototype.view = view;

var viewAsync = function(criteria, projection, options) {

    console.log(criteria, projection, options);

    return new Promise((resolve, reject) => {


        this.view(criteria, projection, options, function(err, result) {
            if (err) {
                console.error(err)
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
            } else {
                resolve(result);
            }

        })

    })

}

var viewAsyncById = function(criteria, projection, options) {


    return new Promise((resolve, reject) => {

        this.view(criteria, projection, options, function(err, result) {
            if (err) {
                console.error(err)
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
            } else {
                if (result.length) {
                    resolve(result[0]);
                } else {
                    reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID)
                }

            }

        })

    })

}

ServiceModule.prototype.viewAsync = viewAsync;
ServiceModule.prototype.getAsync = viewAsync;
ServiceModule.prototype.getAsyncById = viewAsyncById;
ServiceModule.prototype.viewAsyncById = viewAsyncById;



var dataTable = function(query, options, callback) {

    this.model.dataTable(query, query.criteria, callback);

};
ServiceModule.prototype.dataTable = dataTable;


var edit = function(criteria, dataToSave, options, callback) {
    this.model.findOneAndUpdate(criteria, dataToSave, options, function(err, doc) {
        if (err) {
            console.log(err)
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }

        callback(err, doc)
    });
}
ServiceModule.prototype.edit = edit;

var editAsync = function(criteria, dataToSave, options) {

    return new Promise((resolve, reject) => {

        edit.call(this, criteria, dataToSave, options, function(err, result) {

            if (err) {
                reject(err)
            }

            try {
                const jsonResult = result.toJSON();
                resolve(jsonResult);
            } catch (e) {
                console.log(e);
                resolve(result);
            }

        });

    })

}
ServiceModule.prototype.editAsync = editAsync;


var multiEdit = function(criteria, dataToSave, options, callback) {
    this.model.update(criteria, dataToSave, options, function(err, doc) {
        if (err) {
            console.log(err)
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }
        callback(err, doc)
    });
}
ServiceModule.prototype.multiEdit = multiEdit;

var multiEditAsync = function(criteria, dataToSave, options) {

    return new Promise((resolve, reject) => {

        multiEdit.call(this, criteria, dataToSave, options, function(err, result) {

            if (err) {
                reject(err)
            }

            resolve(result);

        });

    })

}
ServiceModule.prototype.multiEditAsync = multiEditAsync;

function remove(criteria, callback) {
    this.model.remove(criteria, function(err, result) {
        if (err) {
            console.log(err)
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }

        callback(err, result);
    });
}

ServiceModule.prototype.remove = remove;

function removeAsync(criteria) {

    return new Promise((resolve, reject) => {
        remove.call(this, criteria, (err, res) => {
            if (err)
                return reject(err);

            return resolve({});
        })
    })
}

ServiceModule.prototype.removeAsync = removeAsync;

function count(criteria, callback) {
    this.model.count(criteria, callback);
}
ServiceModule.prototype.count = count;

function countAsync(criteria) {

    return new Promise((resolve, reject) => {
        count.call(this, criteria, (err, res) => {
            if (err)
                return reject(err);

            return resolve(res);
        })
    })
}

ServiceModule.prototype.countAsync = countAsync;

var viewDistinct = function(field, criteria, options, callback) {

    var population = criteria.population;

    delete criteria.population
    var query = this.model.find(criteria, {}, options).distinct(field);

    query.exec(function(err, result) {

        if (err) {
            console.log(err)
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }

        callback(err, result);
    });


}

ServiceModule.prototype.viewDistinct = viewDistinct;

var aggregate = function(query, population, populationModel, callback) {

    this.model.aggregate(query).exec(function(err, result) {

        if (err) {
            console.log(err)
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR)
        }

        if (population) {

            var Models = require('../Models');

            Models[populationModel].populate(result, population, callback);
        } else {
            return callback(err, result);
        }

    });


}

ServiceModule.prototype.aggregate = aggregate;

function aggregateAsync(query, population, populationModel) {

    return new Promise((resolve, reject) => {
        aggregate.call(this, query, population, populationModel, (err, res) => {
            if (err)
                return reject(err);

            return resolve(res);
        })
    })
}

ServiceModule.prototype.aggregateAsync = aggregateAsync;

exports.ServiceModule = ServiceModule;