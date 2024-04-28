// var login =  require('./commonLoginFunction');
// var admin = login.admin;

var models = require('./models');
var fs = require("fs");
var path = require("path")
return
describe('logging in user ', function() {

    var otp = "";
    var date = new Date();

    var fakeName = "dummy old";
     var randomUserName = 'test'
      var fakeEmail = randomUserName + random(1000) + "@fakeEmail.com"



    this.timeout(5000000);

    var authToken = null;

    var otpCode = "";

    this.abc = 5;




    // it('it should login a admin',admin.login) // |/|/
    // 												|/|/
    // 												|/|/
    //     											|/|/
    //			User    Testingggggg				|/|/
    //											    |/|/
    // // // // // // // // // // // // // // // //	|/|/



      it('it will prepare data to create user ',function(done){

        getData.userToCreate = {
          name: "saurabh " + new Date().getTime(),
          email: new Date().getTime() + "@gmail.com",
          password: "123456",
          countryCode: "91",
          phone: "98765544333",
          deviceType: "ios",
          deviceId: "kjhzkjhc",
          deviceToken: "khkkjnxnxcnvm",
          appVersion: "100",
          dob : new Date()

        }

          done();
    })

    // it('it will check userName availabilty ',models.users.checkUserNameAvailability.bind(models.users))

   it('it will create user ',models.users.createUser.bind(models.users));

    it('it will prepare data to login user ',function(done){

        getData.userToLogin = {
          email: getData["userToCreate"].email,
          password: "123456",
          deviceType: "ios",
          deviceId: "kjhzkjhc",
          deviceToken: "khkkjnxnxcnvm",
          appVersion: "100"
        }

          done();
    })

    it('it will login user ',models.users.loginUser.bind(models.users));


    // it('it will update user profile pic ',models.users.updateUserProfilePic.bind(models.users));

    it('it will change user password',models.users.userChangePassword.bind(models.users));

    it('it will prepare data for user forgot password ',function(done){

        getData.userToResetPass = {
          email: getData["userData"].email
        }

          done();
    })

    it('it will get reset pass token ',models.users.userForgotPassword.bind(models.users));

    it('it will reset user password ',models.users.resetUserForgotPassword.bind(models.users));

    // it('it will prepare new data to login user ',function(done){

    //     getData.userToLogin = {
    //       email: "1482417746465@gmail.com",
    //       password: "12345678",
    //       deviceType: "IOS",
    //       deviceToken: "nkjzgjgjzgjgcj",
    //       appVersion: 100
    //     }

    //       done();
    // })

    // it('it will login user ',models.users.loginUser.bind(models.users));

    //it('it will get user profile ',models.users.getUserProfile.bind(models.users));


});

