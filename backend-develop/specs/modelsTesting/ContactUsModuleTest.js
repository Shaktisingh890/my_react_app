var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class ContactUs extends Model {

}

return




const contactUs = new ContactUs('contactUs')

contactUs.setData({

})

describe('Testing crud module contactUs ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create contactUs model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                contactUs.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get contactUs model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          contactUs.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit contactUs model', function(done){

          contactUs.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete contactUs model', function(done){

          contactUs.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all contactUs', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          contactUs.get(function(err , data){
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

module.exports = ContactUs
