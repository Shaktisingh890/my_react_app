var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Users extends Model {

}

return




const users = new Users('users')

users.setData({

})

describe('Testing crud module users ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create users model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                users.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get users model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          users.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit users model', function(done){

          users.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete users model', function(done){

          users.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all users', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          users.get(function(err , data){
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

module.exports = Users
