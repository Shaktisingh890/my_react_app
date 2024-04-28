
     var randomUserName = 'test';
      var fakeEmail = randomUserName+random(100)+""+random(100) + "@fakeEmail.com"
      var randomPhone = 22+""+random(100)+""+random(100)+"9999"+random(100)

function createUser(done) {



       var createUserData = {
                firstName : randomUserName,
                email : fakeEmail,
                phone : randomPhone,
                password : "ASHUashu11",
                dob : "1992",
                language : "EN",
                deviceType : "WEB",
                countryCode : "+91"

            }


            userData.email = createUserData.email;
            userData.password = createUserData.password
        json('post', '/api/users')
            .expect(200)
            .send(createUserData)
         //   .attach('profilePic', getRandomImage())

            .end(function(err, res) {
                var response = res.body;
                console.log(err)
                console.log("------------",response)

                // log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 201);
                authToken = response.data.token;
                //otp = response.data.userDetails.otpCode;
                done();
            });
    }


exports.createUser = createUser;


function loginUser (done) {
        json('post', '/api/users/login')
            .expect(200)
            .send({
                email: userData.email,
                password: userData.password
            })
            .end(function(err, res) {
                var response = res.body;
                console.log(response)

                //log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                 userData.accessToken = response.data.token;
                 userData._id = response.data._id


                // otp = response.data.otpCode;
                done();
            });
    }

    exports.loginUser = loginUser;

function updateUser (done) {
        json('put', '/api/users/'+userData._id)
            .expect(200)
            .set("Authorization", "bearer " + userData.accessToken)
            .field('name' , "randomUserName_"+randomUserName)
            .attach('profilePic', getRandomImage())
           // .attach('coverPic', getRandomImage())
           // .attach('coverPicOriginal', getRandomImage())

            .end(function(err, res) {
                var response = res.body;
                console.log(response)

                //log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                 userData.accessToken = response.data.token;
                // otp = response.data.otpCode;
                done();
            });
    }

exports.updateUser = updateUser;

function getUser (done) {
        json('get', '/api/users/'+userData._id)
            .expect(200)
            .set("Authorization", "bearer " + userData.accessToken)
            // .field('name' , "randomUserName_"+randomUserName)
            // .attach('profilePic', getRandomImage())
           // .attach('coverPic', getRandomImage())
           // .attach('coverPicOriginal', getRandomImage())

            .end(function(err, res) {
                var response = res.body;
                //console.log(response)
                //
                console.log("loginStatus is : ===== ",response.data.loginStatus)
                 console.log("initialTest is : ===== ",response.data.initialTest)

                //log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                 // userData.accessToken = response.data.token;
                // otp = response.data.otpCode;
                userData.loginStatus = response.data.loginStatus;
                userData.initialTest = response.data.initialTest;
                done();
            });
    }

exports.getUser = getUser;

function getOtherUser (done) {
        json('get', '/api/users/'+"578391653278b5080f0774b9")
            .expect(200)
            .set("Authorization", "bearer " + userData.accessToken)
            // .field('name' , "randomUserName_"+randomUserName)
            // .attach('profilePic', getRandomImage())
           // .attach('coverPic', getRandomImage())
           // .attach('coverPicOriginal', getRandomImage())

            .end(function(err, res) {
                var response = res.body;
                console.log(response)

                //log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 200);
                 userData.accessToken = response.data.token;
                // otp = response.data.otpCode;
                done();
            });
    }

exports.getOtherUser = getOtherUser;


function admin(){


}

admin.prototype.login =  function(done) {

        json('post', '/v1/admins/login')
          // .expect(200)
          .send({
            email: "admin@admin.in",
            password: "123456"
          })
          .end(function(err, res) {
            if(err){
                console.log("==============> err err, err <===============",err);
                return done()
            }

            console.log("==============> err 22222, res <===============");
            var response = res.body;
            console.log(response)
            id = res.body.data._id;
          //  authToken = res.body.data.token;
            log(response)

            assert(typeof response == "object");
            assert(response.statusCode == 200);
            adminData.accessToken = response.data.token;
            ADMIN_ACCESS_TOKEN = response.data.token;
            done();
          });

      }

exports.admin = new admin();
