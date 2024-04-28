var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Invoices extends Model {

}

return




const invoices = new Invoices('invoices')

invoices.setData({

})

describe('Testing crud module invoices ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create invoices model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                invoices.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get invoices model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          invoices.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit invoices model', function(done){

          invoices.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete invoices model', function(done){

          invoices.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all invoices', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          invoices.get(function(err , data){
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

module.exports = Invoices
