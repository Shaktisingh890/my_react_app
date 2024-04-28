'use strict';

const mongoose = require('mongoose');
const Config = require('../constant');
const SocketManager = require('../Lib/SocketManager');
const Service = require('../Services');
const async = require('async');
const DataTable = require('mongoose-datatable');
const Models = require('../Models');
const config = require('config');
mongoose.Promise = global.Promise;
var bcrypt = require('bcryptjs');
const saltRounds = 10;

//Connect to MongoDB

const dbConfig = config.get('mongoUri');


mongoose.connect(dbConfig, function(err) {
    console.log(err);
    if (err) {

        process.exit(1);
    } else {

    }
});
// mongoose.set('debug', true);

// DataTable.configure({ debug: false, verbose: false });
// mongoose.plugin(DataTable.init);


exports.bootstrapAdmin = function(callback) {

    const adminExpanter1 = {
        email: 'hello@expanter.com',
        password: 'admin@Expanter2022',
        name: 'Expanter Admin'
    };

    const adminExpanter2 = {
        email: 'jasmine@expanter.com',
        password: 'admin@Expanter2022',
        name: 'Expanter Admin'
    };

    const adminCharpixel1 = {
        email: 'info@charpixel.com',
        password: 'admin@Expanter2022',
        name: 'Expanter Admin'
    };

    async.parallel([
        function(cb) {
            insertAdminData(adminExpanter1.email, adminExpanter1, cb)
        },
        function(cb) {
            insertAdminData(adminExpanter2.email, adminExpanter2, cb)
        },
        function(cb) {
            insertAdminData(adminCharpixel1.email, adminCharpixel1, cb)
        }
    ], function(err, done) {
        callback(err, 'Bootstrapping finished for admins');
    })


};


exports.bootstrapAppVersion = function(callback) {

    const appVersion = {
        latestIOSVersion: '100',
        latestAndroidVersion: '100',
        criticalAndroidVersion: '100',
        criticalIOSVersion: '100',
        appType: Config.APP_CONSTANTS.DATABASE.userType.User
    };

    async.parallel([
        function(cb) {
            insertVersionData(appVersion.appType, appVersion, cb)
        }
    ], function(err, done) {
        callback(err, 'Bootstrapping finished For App Version');
    })


};

function insertVersionData(appType, versionData, callback) {
    let needToCreate = true;
    async.series([
        function(cb) {
            const criteria = {
                appType: appType
            };
            Service.AppVersionService.getAppVersion(criteria, {}, {}, function(err, data) {
                if (data && data.length > 0) {
                    needToCreate = false;
                }
                cb();
            })
        },
        function(cb) {
            if (needToCreate) {
                Service.AppVersionService.createAppVersion(versionData, function(err, data) {
                    cb(err, data)
                })
            } else {
                cb();
            }
        }
    ], function(err, data) {

        callback(err, 'Bootstrapping finished For version Data')
    })
}




function insertAdminData(email, adminData, callback) {
    let needToCreate = true;
    async.series([function(cb) {
        const criteria = {
            email: email
        };
        Service.makeModule.admins.view(criteria, {}, {}, function(err, data) {
            if (data && data.length > 0) {
                needToCreate = false;
                Config.APP_CONSTANTS.ADMIN_ACCESS_TOKEN = data[0].accessToken;
            }
            cb()
        })
    }, function(cb) {
        if (needToCreate) {

            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(adminData.password, salt);

            adminData.password = hash;

            Service.makeModule.admins.add(adminData, function(err, data) {
                cb(err, data)
            })
        } else {
            cb();
        }
    }], function(err, data) {

        callback(err, 'Bootstrapping finished')
    })
}


require('./initialData');


//Start Socket Server
exports.connectSocket = SocketManager.connectSocket;


exports.createApiPaths = function(pathArr) {


    const criteria = {};
    const options = { upsert: true }


    createSuperDuperAdminRole(function(err, result) {

        pathArr.forEach(function(route) {

            if (Service.makeModule.apiPaths) {
                Service.makeModule.apiPaths.edit({ method: route.method, path: route.path }, { method: route.method, path: route.path }, options, function(err, result) {


                })

            }

        });


    })

}


exports.createOrgApiPaths = function(pathArr) {

    //console.log(pathArr)

    const criteria = {};
    const options = { upsert: true }


    createSuperDuperAdminRole(function(err, result) {

        pathArr.forEach(function(route) {

            if (Service.makeModule.apiPaths) {
                Service.makeModule.orgAuthApis.edit({ method: route.method, path: route.path, name: route.method + ":" + route.path }, { method: route.method, path: route.path }, options, function(err, result) {


                })

            }

        });


    })

}


//createCompneyZoneRates();

var crudPermission = ['READ', 'ADD', 'EDIT', 'DELETE']

exports.createPermissionsForEachRole = function createPermissionsForEachRole() {

    if (Service.makeModule.roles) {
        Service.makeModule.roles.view({}, {}, {}, function(err, result) {

            result.forEach(function(role) {


                Object.keys(Service.makeModule).forEach(function(model) {

                    crudPermission.forEach(function(operation) {

                        Service.makeModule.accessControlList.edit({ roleId: role._id, model: model, isAllow: false, permission: operation }, { roleId: role._id, model: model, permission: operation }, { upsert: true, new: true }, function(err, result) {


                        })
                    })
                })
            })
        })

    }


}


function createSuperDuperAdminRole(callback) {
    if (Service.makeModule.roles) {
        Service.makeModule.roles.edit({ name: "SUPER_ADMIN" }, { name: "SUPER_ADMIN" }, { upsert: true, new: true }, callback);

    }
}




function createNewAdminConstant() {
    Service.makeModule.adminConstants.add({}, {}, {}, function(err, result) {

    })
}



// exports.bootstrapAdminConstants = function() {

//     Service.makeModule.adminConstants.view({}, {}, {}, function(err, result) {


//         if (!result.length) {

//             createNewAdminConstant();
//         }
//     })

// }


