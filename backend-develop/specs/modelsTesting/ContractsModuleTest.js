var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Contracts extends Model {

}

return




const contracts = new Contracts('contracts')

contracts.setData({

})

describe('Testing crud module contracts ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create contracts model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                contracts.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get contracts model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          contracts.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit contracts model', function(done){

          contracts.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete contracts model', function(done){

          contracts.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all contracts', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          contracts.get(function(err , data){
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

module.exports = Contracts
