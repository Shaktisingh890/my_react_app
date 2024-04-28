var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Proposals extends Model {

}

return




const proposals = new Proposals('proposals')

proposals.setData({

})

describe('Testing crud module proposals ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create proposals model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                proposals.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get proposals model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          proposals.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit proposals model', function(done){

          proposals.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete proposals model', function(done){

          proposals.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all proposals', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          proposals.get(function(err , data){
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

module.exports = Proposals
