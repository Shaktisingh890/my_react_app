var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Hirings extends Model {

}

return




const hirings = new Hirings('hirings')

hirings.setData({

})

describe('Testing crud module hirings ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create hirings model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                hirings.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get hirings model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          hirings.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit hirings model', function(done){

          hirings.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete hirings model', function(done){

          hirings.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all hirings', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          hirings.get(function(err , data){
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

module.exports = Hirings
