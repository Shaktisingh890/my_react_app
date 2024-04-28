var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class ServiceProviders extends Model {

}

return




const serviceProviders = new ServiceProviders('serviceProviders')

serviceProviders.setData({

})

describe('Testing crud module serviceProviders ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create serviceProviders model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                serviceProviders.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get serviceProviders model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          serviceProviders.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit serviceProviders model', function(done){

          serviceProviders.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete serviceProviders model', function(done){

          serviceProviders.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all serviceProviders', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          serviceProviders.get(function(err , data){
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

module.exports = ServiceProviders
