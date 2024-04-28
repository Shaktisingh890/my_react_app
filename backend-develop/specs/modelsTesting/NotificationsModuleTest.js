var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Notifications extends Model {

}

return




const notifications = new Notifications('notifications')

notifications.setData({

})

describe('Testing crud module notifications ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create notifications model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                notifications.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get notifications model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          notifications.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit notifications model', function(done){

          notifications.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete notifications model', function(done){

          notifications.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all notifications', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          notifications.get(function(err , data){
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

module.exports = Notifications
