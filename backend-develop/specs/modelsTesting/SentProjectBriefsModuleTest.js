var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class SentProjectBriefs extends Model {

}

return




const sentProjectBriefs = new SentProjectBriefs('sentProjectBriefs')

sentProjectBriefs.setData({

})

describe('Testing crud module sentProjectBriefs ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create sentProjectBriefs model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                sentProjectBriefs.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get sentProjectBriefs model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          sentProjectBriefs.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit sentProjectBriefs model', function(done){

          sentProjectBriefs.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete sentProjectBriefs model', function(done){

          sentProjectBriefs.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all sentProjectBriefs', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          sentProjectBriefs.get(function(err , data){
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

module.exports = SentProjectBriefs
