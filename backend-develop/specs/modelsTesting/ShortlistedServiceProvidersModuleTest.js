var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class ShortlistedServiceProviders extends Model {

}

return




const shortlistedServiceProviders = new ShortlistedServiceProviders('shortlistedServiceProviders')

shortlistedServiceProviders.setData({

})

describe('Testing crud module shortlistedServiceProviders ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create shortlistedServiceProviders model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                shortlistedServiceProviders.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get shortlistedServiceProviders model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          shortlistedServiceProviders.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit shortlistedServiceProviders model', function(done){

          shortlistedServiceProviders.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete shortlistedServiceProviders model', function(done){

          shortlistedServiceProviders.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all shortlistedServiceProviders', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          shortlistedServiceProviders.get(function(err , data){
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

module.exports = ShortlistedServiceProviders
