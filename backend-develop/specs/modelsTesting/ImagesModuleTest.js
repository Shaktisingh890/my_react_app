var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Images extends Model {

}

return




const images = new Images('images')

images.setData({

})

describe('Testing crud module images ', function() {

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

module.exports = Images
