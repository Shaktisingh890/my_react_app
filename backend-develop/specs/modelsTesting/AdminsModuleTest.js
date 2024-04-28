var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Admins extends Model {

}

return




const admins = new Admins('admins')

admins.setData({

})

describe('Testing crud module admins ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create admins model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                admins.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get admins model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          admins.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit admins model', function(done){

          admins.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete admins model', function(done){

          admins.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all admins', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          admins.get(function(err , data){
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

module.exports = Admins
