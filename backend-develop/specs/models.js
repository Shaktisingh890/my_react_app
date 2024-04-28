'use strict'

var async = require('async');

class Model {

    constructor(modelName) {
        this._id = null
        this.data = {

        }
        this.model = modelName;
        this.getQuery = {
            criteria: {

            },
            projection: {

            },
            options: {

                // limit : 10
            }
        };

        this.postQuery = {

        }

        this.putQuery = {

        }

        this.setupViewQueryString();

    }


    setData(data){

        this.data = data;

    }

    addNewValue(key , val){
        console.log(key, val)
        this.data[key] = val;

        console.log("fetesting module data ------>  "+JSON.stringify(this.data))
    }



    setUpdateData(data){
        this.editData = data;
    }
    getData(){
        return this.data
    }

    setupViewQueryString() {
        this.getQueryString = "?criteria=" + JSON.stringify(this.getQuery.criteria) + "&&projection=" + JSON.stringify(this.getQuery.projection) + "&&options={}";
    }


    setPostQuery(query) {
        this.postQuery = query;
        return this;
    }

    setEditQuery(editQuery) {
        this.editQuery = editQuery;
        return this
    }


    setGetQuery(query) {
        this.getQuery = query
        this.setupViewQueryString()
        return this;


    }

    view(done) {
        var _this = this;

        json('get', '/api/admins/' + this.model + this.getQueryString)
            .set("Authorization", "bearer " + adminData.accessToken)
            .expect(200)
            .send({

            })
            .end(function(err, res) {
                var response = res.body;
                //log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                getData[_this.model] = response.data;

                // adminData.accessToken = response.data.token;
                done();
            });

    }

    create(callback) {

        delete this.data._id

        json('post', '/v1/admin/' + this.model)
            .set("Authorization", "bearer " + adminData.accessToken)
            .expect(200)
            .send(this.data)
            .end((err, res) => {
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                this._id = response.data._id;
                // this.data._id = this._id
                // adminData.accessToken = response.data.token;
               callback(response)
            });

    }

 createAsync(data) {


        return new Promise( (resolve , reject) =>{

        delete data._id

        json('post', '/v1/admin/' + this.model)
            .set("Authorization", "bearer " + adminData.accessToken)
            .expect(200)
            .send(data)
            .end((err, res) => {
                if(err){
                    console.error(err);
                    reject(err);
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                // this.data._id = this._id
                // adminData.accessToken = response.data.token;
               resolve(response)
            });

        });



    }

    createMultiple(done) {

        var _this = this;

        var waterfallArray = [];
        _this.postQuery.forEach(function(data, index) {
            waterfallArray.push(post.bind(null, _this.model, data))
        });

        async.series(waterfallArray, function(err, result) {

            done();

        })
    }

    update(done) {

        json('put', '/v1/admin/' + this.model+"/"+this._id)
            .set("Authorization", "bearer " + adminData.accessToken)
            .expect(200)
            .send(this.editData || this.data)
            .end((err, res) =>  {
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                // adminData.accessToken = response.data.token;
                done();
            });
    }


        getById(callback) {


         console.log( "Authorization", "bearer " + adminData.accessToken)

         console.log("id of model"+ this._id)
        json('get', '/v1/admin/'+this.model+'/'+this._id)
            .expect(201)
            .set("Authorization", "bearer " + adminData.accessToken)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    return callback(err)
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                this._id = response.data._id
                // getData["userData"] = response.data;
                callback(err, response)
            });
    }

        get(callback) {


         console.log( "Authorization", "bearer " + adminData.accessToken)

         console.log("id of model"+ this._id)
         this.setupViewQueryString();
        json('get', '/v1/admin/'+this.model+this.getQueryString)
            .expect(201)
            .set("Authorization", "bearer " + adminData.accessToken)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    return callback(err)
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                this._id = response.data._id
                // getData["userData"] = response.data;
                callback(err, response)
            });
    }

    delete(callback) {


        console.log( "Authorization", "bearer " + adminData.accessToken)

         console.log("id of model"+ this._id)
        json('delete', '/v1/admin/'+this.model+'/'+this._id)
            .expect(201)
            .set("Authorization", "bearer " + adminData.accessToken)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    return callback(err)
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                this._id = response.data._id
                // getData["userData"] = response.data;
                callback(err, response)
            });
    }

}

function post(model, data, callback) {

    json('post', '/api/admins/' + model)
        .set("Authorization", "bearer " + adminData.accessToken)

    .send(data)
        .end(function(err, res) {
            var response = res.body;
            log(response)
                // assert(typeof response == "object");
                // assert(response.statusCode == 201);
                // adminData.accessToken = response.data.token;
                //
            callback(err, res);
        });

}


class Users extends Model {



      login(userData , callback) {

        var _this = this;
        json('post', '/v1/auth/email/login')
            //.expect(200)
            .send(userData)
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return  callback(err)
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                getData["userData"] = response.data;

                CURRENT_ACCESS_TOKEN = response.data.accessToken
                USER_ACCESS_TOKEN = response.data.accessToken

                callback(response)
                // done();
            });
    }





    loginUser(done) {

        var _this = this;
        json('post', '/v1/auth/email/login')
            //.expect(200)
            .send({
                email: getData['userToLogin'].email,
                password: getData['userToLogin'].password,
                deviceToken: getData['userToLogin'].deviceToken,
                deviceType: getData['userToLogin'].deviceType,
                deviceId: getData['userToLogin'].deviceId,
                appVersion: getData['userToLogin'].appVersion
            })
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                getData["userData"] = response.data;
                done();
            });
    }

    createUser(done) {

        var _this = this;
        json('post', '/v1/auth/email/registration')
            // .expect(200)
            .send({
                email: getData['userToCreate'].email,
                password: getData['userToCreate'].password,
                name: getData['userToCreate'].name,
                deviceToken: getData['userToCreate'].deviceToken,
                deviceType: getData['userToCreate'].deviceType,
                deviceId: getData['userToCreate'].deviceId,
                countryCode: getData['userToCreate'].countryCode,
                phone: getData['userToCreate'].phone,
                appVersion: getData['userToCreate'].appVersion,
                dob: getData['userToCreate'].dob
            })
            // .attach('profilePic', '/home/saurabh/Documents/new web images/development-work-flow.png')
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                getData["userData"] = response.data;
                done();
            });
    }

        create(userData) {

        var _this = this;
        json('post', '/v1/auth/email/registration')
            // .expect(200)
            .send(userData)
            // .attach('profilePic', '/home/saurabh/Documents/new web images/development-work-flow.png')
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                getData["userData"] = response.data;
                done();
            });
    }


    userForgotPassword(done) {

        var _this = this;
        json('get', '/v1/users/getResetPasswordToken/' + getData['userToResetPass'].email)
            //.expect(200)
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                getData["forgotPassData"] = response.data;
                done();
            });
    }

    resetUserForgotPassword(done) {

        var _this = this;
        json('put', '/v1/users/resetPassword')
            //.expect(200)
            .send({
                email: getData['userToResetPass'].email,
                passwordResetToken: getData["forgotPassData"].password_reset_token,
                newPassword: "12345678"
            })
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                // getData["forgotPassData"] = response.data;
                done();
            });
    }


    // checkUserNameAvailability(done) {

    //     var _this = this;
    //     json('get', '/api/users/available/' + getData['userToCreate'].userName)
    //         //.expect(200)
    //         .end(function(err, res) {
    //             if (err) {
    //                 console.log(err)
    //                 return done()
    //             }
    //             var response = res.body;
    //             log(response)
    //             assert(typeof response == "object");
    //             assert(response.statusCode == 200);
    //             // getData["userData"] = response.data;
    //             done();
    //         });
    // }

    userChangePassword(done) {

        var _this = this;
        json('put', '/v1/users/changePassword')
            //.expect(200)
            .set("Authorization", "bearer " + getData["userData"].accessToken)
            .send({
                password: '123456',
                newPassword: '12345678'
            })
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                // getData["userData"] = response.data;
                done();
            });
    }

    updateUserProfilePic(done) {

        var _this = this;
        json('post', '/v1/users/upload')
            //.expect(200)
            .set("Authorization", "bearer " + getData["userData"].accessToken)
            .field('isProfile', "true")
            .attach('file', '/Users/sauru/Desktop/me.jpg')
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 201);
                // getData["userData"] = response.data;
                done();
            });
    }

    getUserProfile(done) {

        var _this = this;
        json('get', '/v1/users/' + getData["userData"]._id)
            //.expect(200)
            .set("Authorization", "bearer " + getData["userData"].accessToken)
            .end(function(err, res) {
                if (err) {
                    console.log(err)
                    return done()
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                getData["userProfileData"] = response.data;
                done();
            });
    }

}


const users = new Users('users')



module.exports = {
    users: users,
    Model : Model
}
