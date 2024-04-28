var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Messages extends Model {

}

return




const messages = new Messages('messages')

messages.setData({

})

describe('Testing crud module messages ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create messages model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                messages.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get messages model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          messages.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit messages model', function(done){

          messages.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete messages model', function(done){

          messages.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all messages', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          messages.get(function(err , data){
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

module.exports = Messages
