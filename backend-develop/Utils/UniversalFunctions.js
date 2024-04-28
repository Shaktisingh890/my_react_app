const Joi = require('joi');
const async = require('async');
const MD5 = require('md5');
const Boom = require('boom');
const CONFIG = require('../constant');
const Models = require('../Models');
const randomstring = require("randomstring");
const GeoPoint = require('geopoint');
const distance = require('google-distance-matrix');
distance.key(CONFIG.APP_CONSTANTS.SERVER.GOOGLE_API_KEY);
const NotificationManager = require('../Lib/NotificationManager');
const validator = require('validator');
const advancedFunctions = require('./commonAdvanceFunctions')

const pdf = require('html-pdf-node');

var bcrypt = require('bcryptjs');
const saltRounds = 10;

const VALID_ERRAND_STATUS_ARRAY = [];
for (let key in CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS) {
    if (CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS.hasOwnProperty(key)) {
        VALID_ERRAND_STATUS_ARRAY.push(CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS[key])
    }
}

const calculateDeliveryCost = function(originLatlong, destLatLong, callback) {
    const estimatedCost = CONFIG.APP_CONSTANTS.SERVER.BASE_DELIVERY_FEE;
    calculateDistanceViaGoogleDistanceMatrix(originLatlong, destLatLong, function(err, distanceInMiles) {
        console.log('distances', err, distanceInMiles)
        if (err) {
            callback(err)
        } else {
            distanceInMiles = distanceInMiles && distanceInMiles.toFixed() || 0;
            estimatedCost = estimatedCost + distanceInMiles * CONFIG.APP_CONSTANTS.SERVER.COST_PER_KM;
            callback(null, estimatedCost)
        }
    })
};

const calculateDistanceViaGoogleDistanceMatrix = function(origin, destination, callback) {
    //TODO return distance instance of duration or both
    const origins = [origin];
    const destinations = [destination];
    let duration = null;

    distance.matrix(origins, destinations, function(err, distances) {
        if (err) {
            callback(err)
        } else if (distances.status == 'OK' && distances.rows && distances.rows[0] && distances.rows[0].elements &&
            distances.rows[0].elements[0] && distances.rows[0].elements[0].duration && distances.rows[0].elements[0].duration.hasOwnProperty('value')) {
            duration = (distances.rows[0].elements[0].duration.value) / 60;
        }
        callback(null, duration);
    });
};

const sendError = function(data, language, reply) {

    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        let errorToSend = Boom.create(data.statusCode, data.customMessage);
        errorToSend.output.payload.responseType = data.type;
        if(reply){
            return reply.response(data).code(data.statusCode || 400);
        }
        return errorToSend;
    } else {
        const errorToSend = '';
        if (typeof data == 'object') {
            if (data.name == 'MongoError') {
                // errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                if (data.code = 11000) {
                    let duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
                    duplicateValue = duplicateValue.replace('}', '');
                    errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1') > -1) {
                        errorToSend = CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
                    }
                }
            } else if (data.name == 'ApplicationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name == 'ValidationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name == 'CastError') {
                // errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }
        } else {
            errorToSend = data
        }
        let customErrorMessage = errorToSend;
        if (typeof customErrorMessage == 'string') {
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        let errorResponse = Boom.create(400, customErrorMessage);
        errorResponse.success = false;

        console.log(errorResponse)
        return errorResponse;
    }
};

const sendSuccess = function(successMsg, data, extraData) {
    successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return { statusCode: successMsg.statusCode, message: successMsg.customMessage, data: data || {}, success: successMsg.success || null };

    } else {
        return { statusCode: 200, message: successMsg, success: true, data: data || null, extraData: extraData || null };

    }
};

const checkDuplicateValuesInArray = function(array) {
    console.log('array', array)
    let storeArray = [];
    let duplicateFlag = false;
    if (array && array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            if (storeArray.indexOf(array[i]) == -1) {
                console.log('push', array[i])
                storeArray.push(array[i])
            } else {
                console.log('break')
                duplicateFlag = true;
                break;
            }
        }
    }
    storeArray = [];
    return duplicateFlag;
};

const failActionFunction = function(request, reply, error) {

    console.log(request, reply, error)
    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation
    return error
};


const customQueryDataValidations = function(type, key, data, callback) {
    let schema = {};
    switch (type) {
        case 'PHONE_NO':
            schema[key] = Joi.string().regex(/^[0-9]+$/).length(10);
            break;
        case 'NAME':
            schema[key] = Joi.string().regex(/^[a-zA-Z ]+$/).min(2);
            break;
        case 'BOOLEAN':
            schema[key] = Joi.boolean();
            break;
    }
    let value = {};
    value[key] = data;

    Joi.validate(value, schema, callback);
};


const authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required().default("bearer " + CONFIG.APP_CONSTANTS.ADMIN_ACCESS_TOKEN)
}).unknown();

const getEmbeddedDataFromMongo = function(dataAry, keyToSearch, referenceIdToSearch, embeddedFieldModelName, variableToAttach, callback) {
    if (!dataAry || !keyToSearch || !variableToAttach || !embeddedFieldModelName || !Models[embeddedFieldModelName]) {
        callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
    } else {
        if (dataAry.length > 0) {
            let taskToRunInParallel = [];
            dataAry.forEach(function(dataObj) {
                taskToRunInParallel.push((function(dataObj) {
                    return function(embeddedCB) {
                        if (!dataObj[referenceIdToSearch]) {
                            callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                        } else {
                            let criteria = {};
                            criteria[keyToSearch] = dataObj[referenceIdToSearch];
                            Models[embeddedFieldModelName].find(criteria, function(err, modelDataAry) {
                                if (err) {
                                    embeddedCB(err)
                                } else {
                                    if (modelDataAry) {
                                        dataObj[variableToAttach] = modelDataAry
                                    }
                                    embeddedCB()
                                }
                            })
                        }

                    }
                })(dataObj));
            });

            async.parallel(taskToRunInParallel, function(err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, dataAry)
                }
            })

        } else {
            callback(null, dataAry)
        }
    }
};

const CryptData = function(stringToCrypt) {
    if (stringToCrypt) {
        return MD5(MD5(stringToCrypt));
    }
    return 0

};

var CryptPassword = function(stringToCrypt, callback) {

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(stringToCrypt, salt);

    return callback(null, hash);
};

var matchPassword = function(password, hash, callback) {

    var res = bcrypt.compareSync(password, hash);

    if (!res) {
        return callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
    } else {
        return callback(null, res);
    }

};

const matchPasswordPromise = function(password, hash) {

    return new Promise((resolve, reject) => {
        var res = bcrypt.compareSync(password, hash);

        if (!res) {
            reject(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
        } else {
           resolve(res);
        }
    })

};

const generateRandomString = function() {
    return randomstring.generate(7);
};

const filterArray = function(array) {
    return array.filter(function(n) {
        return n != undefined && n != ''
    });
};

const sanitizeName = function(string) {
    return filterArray(string && string.split(' ') || []).join(' ')
};

const verifyEmailFormat = function(string) {
    return validator.isEmail(string)
};

const getFileNameWithUserId = function(thumbFlag, fullFileName, userId) {
    var prefix = CONFIG.APP_CONSTANTS.DATABASE.profilePicPrefix.Original;
    // var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);

    var ext = fullFileName;

    if (thumbFlag) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.profilePicPrefix.Thumb;
    }

    if (!userId) {
        return prefix + ext;
    } else {
        return prefix + userId + ext;
    }


};

const getFileNameWithUserIdWithCustomPrefix = function(thumbFlag, fullFileName, type, userId) {
    var prefix = '';
    if (type == CONFIG.APP_CONSTANTS.DATABASE.FILE_TYPES.LOGO) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.LOGO_PREFIX.ORIGINAL;
    } else if (type == CONFIG.APP_CONSTANTS.DATABASE.FILE_TYPES.DOCUMENT) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.DOCUMENT_PREFIX;
    }
    var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    if (thumbFlag && type == CONFIG.APP_CONSTANTS.DATABASE.FILE_TYPES.LOGO) {
        prefix = CONFIG.APP_CONSTANTS.DATABASE.LOGO_PREFIX.THUMB;
    }
    return prefix + userId + ext;
};

const getDistanceBetweenPoints = function(origin, destination) {
    let start = new GeoPoint(origin.lat, origin.long);
    let end = new GeoPoint(destination.lat, destination.long);
    return start.distanceTo(end, true);
};

const validateLatLongValues = function(lat, long) {
    let valid = true;
    if (lat < -90 || lat > 90) {
        valid = false;
    }
    if (long < -180 || long > 180) {
        valid = false;
    }
    return valid;
};
const deleteUnnecessaryUserData = function(userObj) {
    console.log('deleting>>', userObj)
    delete userObj['__v'];
    delete userObj['password'];
    delete userObj['accessToken'];
    delete userObj['emailVerificationToken'];
    delete userObj['passwordResetToken'];
    delete userObj['registrationDate'];
    delete userObj['OTPCode'];
    delete userObj['facebookId'];
    delete userObj['codeUpdatedAt'];
    delete userObj['deviceType'];
    delete userObj['deviceToken'];
    delete userObj['appVersion'];
    delete userObj['isBlocked'];
    console.log('deleted', userObj)
    return userObj;
};


const convertCamelCaseString = function(string, seperator) {
    let s = string;
    //console.log(string)
    return capitalizeFirstLetter(s.replace(/\.?([A-Z]+)/g, function(x, y) { return seperator + y }).replace(/^_/, ""));

}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function decimalToTwoPoints(num) {
    return parseInt(Math.round(num * 100)) / 100;
}

function updateServerValuesToShow(item, key) {

    const obj = CONFIG.APP_CONSTANTS.USER_CONSTANTS[key];

    // console.log(item, key, obj, typeof item);

    if(!obj)
        return item;

    if(typeof item === "object" && Array.isArray(item)) {
        let arr = [];

        item.forEach(x => {

            const ind = obj.server.indexOf(x);

            // console.log(ind);

            const showVal = obj.show[ind];

            if(showVal) {
                arr.push(showVal);
            } else {
                arr.push(x);
            }

        })
        return arr;

    } else if (typeof item === "string") {

        const ind = obj.server.indexOf(item);

        const showVal = obj.show[ind];

        return showVal ? showVal : item;

    } else {
        return item;
    }

}

function renderMessageFromTemplateAndVariables(templateData, variablesData) {
    const Handlebars = require('handlebars');
    if (!templateData) {
        templateData = "test";
    }
    return Handlebars.compile(templateData)(variablesData);
}

function createPdfFromHTML(updatedHtml, pdfOptions, filepath) {

    return new Promise((resolve, reject) => {

        console.log("createPdfFromHTML==>")

        const pdfObj = { content: updatedHtml }

        pdf.generatePdf(pdfObj, pdfOptions).then((pdfBuffer) => {
                console.log(pdfBuffer); // { filename: '/app/businesscard.pdf' }
                // fs.writeFile(filepath, pdfBuffer, (err, res) => {
                //     if(err)
                //         reject();
                //     else
                //         resolve({filename: filepath});
                // })
                resolve({ filename: filepath });
            })
            .catch((err) => {
                console.log(err);
                reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
            })

    })

}

module.exports = {
    sendError: sendError,
    sendSuccess: sendSuccess,
    calculateDeliveryCost: calculateDeliveryCost,
    checkDuplicateValuesInArray: checkDuplicateValuesInArray,
    CryptData: CryptData,
    failActionFunction: failActionFunction,
    NotificationManager: NotificationManager,
    authorizationHeaderObj: authorizationHeaderObj,
    getEmbeddedDataFromMongo: getEmbeddedDataFromMongo,
    verifyEmailFormat: verifyEmailFormat,
    sanitizeName: sanitizeName,
    deleteUnnecessaryUserData: deleteUnnecessaryUserData,
    getDistanceBetweenPoints: getDistanceBetweenPoints,
    validateLatLongValues: validateLatLongValues,
    filterArray: filterArray,
    CONFIG: CONFIG,
    VALID_ERRAND_STATUS_ARRAY: VALID_ERRAND_STATUS_ARRAY,
    generateRandomString: generateRandomString,
    getFileNameWithUserId: getFileNameWithUserId,
    getFileNameWithUserIdWithCustomPrefix: getFileNameWithUserIdWithCustomPrefix,
    customQueryDataValidations: customQueryDataValidations,
    advancedFunctions: advancedFunctions,
    convertCamelCaseString: convertCamelCaseString,
    decimalToTwoPoints: decimalToTwoPoints,
    CryptPassword: CryptPassword,
    matchPassword: matchPassword,
    updateServerValuesToShow: updateServerValuesToShow,
    matchPasswordPromise: matchPasswordPromise,
    renderMessageFromTemplateAndVariables: renderMessageFromTemplateAndVariables,
    createPdfFromHTML: createPdfFromHTML
};