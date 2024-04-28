var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Brands extends Model {

}

return




const brands = new Brands('brands')

brands.setData({

})

describe('Testing crud module brands ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create brands model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                brands.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get brands model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          brands.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit brands model', function(done){

          brands.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete brands model', function(done){

          brands.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all brands', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          brands.get(function(err , data){
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

module.exports = Brands
