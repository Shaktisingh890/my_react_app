var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
return
class Images extends Model {

      create(callback) {


        console.log( "Authorization", "bearer " + adminData.accessToken)

        json('post', '/v1/admin/images')
            .expect(200)
            .set("Authorization", "bearer " + adminData.accessToken)
            .attach('imageFile', getRandomImage())
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    return callback(err)
                }
                var response = res.body;
                log(response)
                assert(typeof response == "object");
                assert(response.statusCode == 201);

                this._id = response.data._id

                console.log("id of model"+ this._id)

                // getData["userData"] = response.data;
                callback(err, response)
            });
    }

    update(callback) {


        console.log( "Authorization", "bearer " + adminData.accessToken)

         console.log("id of model"+ this._id)
        json('put', '/v1/admin/images/'+this._id)
            .expect(201)
            .set("Authorization", "bearer " + adminData.accessToken)
            .attach('imageFile', getRandomImage())
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






const images = new Images('images')

images.setData({
  file : true
})

describe('logging in user ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create images model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                images.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get images model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          images.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit images model', function(done){

          images.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete images model', function(done){

          images.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all images', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          images.get(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

});


