var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Chats extends Model {

}

return




const chats = new Chats('chats')

chats.setData({

})

describe('Testing crud module chats ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create chats model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                chats.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get chats model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          chats.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit chats model', function(done){

          chats.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete chats model', function(done){

          chats.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all chats', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          chats.get(function(err , data){
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

module.exports = Chats
