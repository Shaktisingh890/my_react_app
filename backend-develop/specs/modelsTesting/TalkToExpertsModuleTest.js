var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class TalkToExperts extends Model {

}

return




const talkToExperts = new TalkToExperts('talkToExperts')

talkToExperts.setData({

})

describe('Testing crud module talkToExperts ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create talkToExperts model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                talkToExperts.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get talkToExperts model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          talkToExperts.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit talkToExperts model', function(done){

          talkToExperts.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete talkToExperts model', function(done){

          talkToExperts.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all talkToExperts', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          talkToExperts.get(function(err , data){
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

module.exports = TalkToExperts
