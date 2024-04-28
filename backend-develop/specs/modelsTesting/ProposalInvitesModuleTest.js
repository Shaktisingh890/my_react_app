var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class ProposalInvites extends Model {

}

return




const proposalInvites = new ProposalInvites('proposalInvites')

proposalInvites.setData({

})

describe('Testing crud module proposalInvites ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create proposalInvites model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                proposalInvites.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get proposalInvites model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          proposalInvites.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit proposalInvites model', function(done){

          proposalInvites.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete proposalInvites model', function(done){

          proposalInvites.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all proposalInvites', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          proposalInvites.get(function(err , data){
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

module.exports = ProposalInvites
