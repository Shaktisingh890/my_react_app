var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class AccessTokens extends Model {

}

return




const accessTokens = new AccessTokens('accessTokens')

accessTokens.setData({

})

describe('Testing crud module accessTokens ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create accessTokens model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                accessTokens.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get accessTokens model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          accessTokens.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit accessTokens model', function(done){

          accessTokens.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete accessTokens model', function(done){

          accessTokens.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all accessTokens', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          accessTokens.get(function(err , data){
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

module.exports = AccessTokens
