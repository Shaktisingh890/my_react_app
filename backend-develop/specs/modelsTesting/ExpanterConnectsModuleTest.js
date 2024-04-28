var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class ExpanterConnects extends Model {

}

return




const expanterConnects = new ExpanterConnects('expanterConnects')

expanterConnects.setData({

})

describe('Testing crud module expanterConnects ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create expanterConnects model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                expanterConnects.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get expanterConnects model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          expanterConnects.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit expanterConnects model', function(done){

          expanterConnects.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete expanterConnects model', function(done){

          expanterConnects.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all expanterConnects', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          expanterConnects.get(function(err , data){
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

module.exports = ExpanterConnects
