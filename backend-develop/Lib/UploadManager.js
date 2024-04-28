const Config = require('../constant');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const async = require('async');
const Path = require('path');
const knox = require('knox');
const fsExtra = require('fs-extra');
const config = require('config');
const s3BucketCredentials = config.get('s3Bucket');
/**
 * Upload file to S3 bucket
 * @param file
 * @param folder
 * @param callback
 */
function uploadImageFileToS3Bucket(file, folder, s3Credentials, callback) {

    const fs = require('fs');
    const AWS = require('aws-sdk');

    let filename = Config.APP_CONSTANTS.DATABASE.profilePicPrefix.Original + file.filename; // actual filename of file
    let path = file.path; //will be put into a temp directory
    let mimeType = file.type;


    if (!mimeType) {
        mimeType = file.headers['content-type'];
    }

    fs.readFile(path, function(error, file_buffer) {

        if (error) {
            return callback(0);
        } else {

            const s3bucket = new AWS.S3({
                accessKeyId: s3BucketCredentials.accessKeyId,
                secretAccessKey: s3BucketCredentials.secretAccessKey,
                // endpoint: s3BucketCredentials.endpoint,
                signatureVersion: 'v4',
                region: s3BucketCredentials.region
            });
            const params = {
                Bucket: s3BucketCredentials.name,
                Key: folder + '/' + filename,
                Body: file_buffer,
                ACL: 'public-read',
                ContentType: mimeType
            };


            s3bucket.putObject(params, function(err, data) {

                fs.unlink(path, function(err) {
                    if (err) console.log(err);
                });

                if (err) {
                    return callback(0);
                } else {
                    return callback(filename);
                }
            });
        }
    });
};


function uploadFileToS3Bucket(file, folder, s3Credentials, callback) {

    const fs = require('fs');
    const AWS = require('aws-sdk');

    let path = file.path; //will be put into a temp directory
    let mimeType = file.type;

    if (!mimeType) {
        mimeType = file.headers['content-type'];
    }

    const fileExt = mimeType.split("/")[1];

    let filename = Config.APP_CONSTANTS.DATABASE.profilePicPrefix.original + folder + "_" + new Date().getTime() + "." + fileExt; // new filename of file

    fs.readFile(path, function(error, file_buffer) {

        if (error) {
            console.log(error);

            return callback(0);
        } else {

            var s3bucket = new AWS.S3({
                accessKeyId: s3BucketCredentials.accessKeyId,
                secretAccessKey: s3BucketCredentials.secretAccessKey,
                // endpoint: s3BucketCredentials.endpoint,
                signatureVersion: 'v4',
                region: s3BucketCredentials.region
            });
            var params = {
                Bucket: s3BucketCredentials.name,
                Key: folder + '/' + filename,
                Body: file_buffer,
                ACL: 'public-read',
                ContentType: mimeType
            };


            s3bucket.putObject(params, function(err, data) {

                fs.unlink(path, function(err) {
                    if (err) console.log(err);
                });

                if (err) {
                    console.log(err);
                    return callback(0);
                } else {
                    return callback(filename);
                }
            });
        }
    });
};

function uploadImageFileToS3BucketWithThumbnail(fileData, folder, userId, s3Credentials, callbackParent) {

    let profilePicURL = {
        original: null,
        thumbnail: null
    };
    let originalPath = null;
    let thumbnailPath = null;
    let dataToUpload = [];
    let mimeType = fileData.type;
    if (!mimeType) {
        mimeType = fileData.headers['content-type'];
    }


    async.series([
        function(cb) {
            //Validate fileData && userId
            if (!fileData || !fileData.filename) {
                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            } else {
                // TODO Validate file extensions
                cb();
            }
        },
        function(cb) {
            //Set File Names
            profilePicURL.original = UniversalFunctions.getFileNameWithUserId(false, fileData.filename, userId);
            profilePicURL.thumbnail = UniversalFunctions.getFileNameWithUserId(true, fileData.filename, userId);
            cb();
        },
        function(cb) {
            //Save File
            let path = Path.join(Path.resolve("."), "uploads", profilePicURL.original);


            saveFile(fileData.path, path, function(err, data) {


                cb(err, data)
            })
        },
        function(cb) {
            //Create Thumbnail
            originalPath = Path.join(Path.resolve("."), "uploads", profilePicURL.original);
            thumbnailPath = Path.join(Path.resolve("."), "uploads", profilePicURL.thumbnail);

            createThumbnailImage(originalPath, thumbnailPath, fileData.size, function(err, data) {


                dataToUpload.push({
                    originalPath: originalPath,
                    nameToSave: profilePicURL.original,
                    mimeType: mimeType
                });
                dataToUpload.push({
                    originalPath: data,
                    nameToSave: profilePicURL.thumbnail,
                    mimeType: mimeType
                });
                cb(err, data)
            })
        },
        function(cb) {
            //Upload both images on S3
            ImageParallelUploadToS3(dataToUpload, folder, s3Credentials, cb);
        }
    ], function(err, result) {
        callbackParent(err, profilePicURL);
    });
};

function ImageParallelUploadToS3(dataToUpload, folder, s3Credentials, callback) {

    const fs = require('fs');
    const AWS = require('aws-sdk');

    async.parallel([
            function(cb) {
                upload(dataToUpload[0].originalPath, dataToUpload[0].nameToSave, dataToUpload[0].mimeType, cb);
            },
            function(cb) {
                upload(dataToUpload[1].originalPath, dataToUpload[1].nameToSave, dataToUpload[1].mimeType, cb);
            }
        ],
        function(err, result2) {
            return callback(err, result2);

        });

    function upload(path, filename, mimeType, cb) {

        fs.readFile(path, function(error, file_buffer) {

            if (error) {
                return cb(error);
            } else {



                let s3bucket = new AWS.S3({
                    accessKeyId: s3BucketCredentials.accessKeyId,
                    secretAccessKey: s3BucketCredentials.secretAccessKey,
                    // endpoint: s3BucketCredentials.endpoint,
                    signatureVersion: 'v4',
                    region: s3BucketCredentials.region
                });
                let params = {
                    Bucket: s3BucketCredentials.name,
                    Key: folder + '/' + filename,
                    Body: file_buffer,
                    ACL: 'public-read',
                    ContentType: mimeType
                };

                s3bucket.putObject(params, function(err, data) {

                    fs.unlink(path, function(err) {
                        if (err) console.log(err);
                    });

                    if (err) {
                        console.log('ImageParallelUploadToS3 ERROR', err);

                        return cb(err);
                    } else {
                        return cb(null, filename);
                    }
                });
            }
        });
    }
}



/*
 1) Save Local Files
 2) Create Thumbnails
 3) Upload Files to S3
 4) Delete Local files
 */

//Set Base URL for Images
let baseFolder = s3BucketCredentials.folders.profile + '/';
let baseURL = s3BucketCredentials.bucketUrl + '/' + baseFolder;

function uploadFileToS3WithThumbnail(fileData, userId, callbackParent) {
    //Verify File Data
    let profilePicURL = {
        original: null,
        thumbnail: null
    };
    let originalPath = null;
    let thumbnailPath = null;
    let dataToUpload = [];

        let mimeType = fileData.type;
    if (!mimeType) {
        mimeType = fileData.headers['content-type'];
    }



    async.series([
        function(cb) {
            //Validate fileData && userId
            if (!fileData || !fileData.filename) {
                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            } else {
                // TODO Validate file extensions
                cb();
            }
        },
        function(cb) {
            //Set File Names
            profilePicURL.original = UniversalFunctions.getFileNameWithUserId(false, fileData.filename, userId);
            profilePicURL.thumbnail = UniversalFunctions.getFileNameWithUserId(true, fileData.filename, userId);
            cb();
        },
        function(cb) {
            //Save File
            let path = Path.join(Path.resolve("."), "uploads", profilePicURL.original);
            saveFile(fileData.path, path, function(err, data) {
                cb(err, data)
            })
        },
        function(cb) {
            //Create Thumbnail
            originalPath = Path.join(Path.resolve("."), "uploads", profilePicURL.original);
            thumbnailPath = Path.join(Path.resolve("."), "uploads", profilePicURL.thumbnail);
            createThumbnailImage(originalPath, thumbnailPath, fileData.size, function(err, data) {
                dataToUpload.push({
                    originalPath: originalPath,
                    nameToSave: profilePicURL.original,
                       mimeType: mimeType
                });
                dataToUpload.push({
                    originalPath: data,
                    nameToSave: profilePicURL.thumbnail,
                       mimeType: mimeType
                });
                cb(err, data)
            })
        },
        function(cb) {
            //Upload both images on S3
            parallelUploadTOS3(dataToUpload, cb);
        }
    ], function(err, result) {
        callbackParent(err, profilePicURL);
    });
}

function uploadFile(fileData, userId, type, callbackParent) {
    //Verify File Data
    let imageURL = {
        original: null,
        thumbnail: null
    };
    let logoURL = {
        original: null,
        thumbnail: null
    };
    let documentURL = null;

    let originalPath = null;
    let thumbnailPath = null;
    let dataToUpload = [];

    async.series([
        function(cb) {
            //Validate fileData && userId
            if (!userId || !fileData || !fileData.filename) {

                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            } else {
                // TODO Validate file extensions
                cb();
            }
        },
        function(cb) {
            //Set File Names
            imageURL.original = UniversalFunctions.getFileNameWithUserIdWithCustomPrefix(false, fileData.filename, type, userId);
            imageURL.thumbnail = UniversalFunctions.getFileNameWithUserIdWithCustomPrefix(true, fileData.filename, type, userId);
            cb();
        },
        function(cb) {
            //Save File
            let path = Path.join(Path.resolve("."), "uploads", imageURL.original);
            saveFile(fileData.path, path, function(err, data) {
                cb(err, data)
            })
        },
        function(cb) {
            //Create Thumbnail if its a logo
            originalPath = Path.join(Path.resolve("."), "uploads", imageURL.original);
            dataToUpload.push({
                originalPath: originalPath,
                nameToSave: imageURL.original
            });
            if (type == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.fileType.Logo) {
                thumbnailPath = Path.join(Path.resolve("."), "uploads", imageURL.thumbnail);
                createThumbnailImage(originalPath, thumbnailPath, function(err, data) {
                    dataToUpload.push({
                        originalPath: data,
                        nameToSave: imageURL.thumbnail
                    });
                    cb(err, data)
                })
            } else {
                cb();
            }

        },
        function(cb) {
            //Upload both images on S3
            parallelUploadTOS3(dataToUpload, cb);
        }
    ], function(err, result) {
        callbackParent(err, imageURL)
    });
}


function parallelUploadTOS3(filesArray, callback) {
    //Create S3 Client



    async.map(filesArray, pushFileDataToS3.bind({}) , callback)
}


function pushFileDataToS3(fileData , callback){



    const fs = require('fs');
    const AWS = require('aws-sdk');

                let s3bucket = new AWS.S3({
                    accessKeyId: s3BucketCredentials.accessKeyId,
                    secretAccessKey: s3BucketCredentials.secretAccessKey,
                    // endpoint: s3BucketCredentials.endpoint,
                    signatureVersion: 'v4',
                    region: s3BucketCredentials.region
                });




                  fs.readFile(fileData.originalPath, function(error, file_buffer) {

            if (error) {
                return callback(error);
            } else {




                let params = {
                    Bucket: s3BucketCredentials.name,
                    Key: "files" + '/' + fileData.nameToSave,
                    Body: file_buffer,
                    ACL: 'public-read',
                    ContentType: fileData.mimeType
                };


                console.log("s3 bucket params ",params)

                s3bucket.putObject(params, function(err, data) {

                    // fs.unlink(fileData.originalPath, function(err) {
                    //     if (err) console.log(err);
                    // });

                    if (err) {
                        console.log('ImageParallelUploadToS3 ERROR', err);

                        return callback(err);
                    } else {
                        return callback(null, fileData.nameToSave);
                    }
                });

            }
        });

}

/*
 Save File on the disk
 */
function saveFile(fileData, path, callback) {
    fsExtra.copy(fileData, path, callback);
}

function deleteFile(path) {
    fsExtra.remove(path, function(err) {
        console.log('error deleting file>>', err)
    });
}

/*
 Create thumbnail image using graphics magick
 */

function createThumbnailImage(originalPath, thumbnailPath, size, callback) {

    var imageSize = {
        height: config.get('THUMB_HEIGHT'),
        width: config.get('THUMB_WIDTH')

    }

    if (typeof size != 'undefined') {
        imageSize = size;
    }

    var gm = require('gm').subClass({
        imageMagick: true
    });

    gm(originalPath)
        .resize(imageSize.width, imageSize.height)
        .autoOrient()
        .write(thumbnailPath, function(err, data) {
            if (err) {
                return callback(null, originalPath);
            }
            callback(null, thumbnailPath)
        })
}

function getS3File(bucket, key) {
    return new Promise(function (resolve, reject) {

        const AWS = require('aws-sdk');

        const s3bucket = new AWS.S3({
                accessKeyId: s3BucketCredentials.accessKeyId,
                secretAccessKey: s3BucketCredentials.secretAccessKey,
                // endpoint: s3BucketCredentials.endpoint,
                signatureVersion: 'v4',
                region: s3BucketCredentials.region
            });

        s3bucket.getObject(
            {
                Bucket: bucket,
                Key: key
            },
            function (err, data) {
                if (err) return reject(err);
                else return resolve(data);
            }
        );
    })
}

module.exports = {
    uploadFileToS3WithThumbnail: uploadFileToS3WithThumbnail,
    uploadFile: uploadFile,
    uploadFileToS3Bucket: uploadFileToS3Bucket,
    uploadImageFileToS3BucketWithThumbnail: uploadImageFileToS3BucketWithThumbnail,
    uploadImageFileToS3Bucket: uploadImageFileToS3Bucket,
    getS3File: getS3File
};
