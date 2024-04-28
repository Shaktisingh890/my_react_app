var Model = require('../models').Model;
var user = require('../models').users;
var login = require('../commonLoginFunction');
var admin = login.admin;
class Projects extends Model {

}

return




const projects = new Projects('projects')

projects.setData({

})

describe('Testing crud module projects ', function() {

    this.timeout(5000000);

        it('it should login a admin', admin.login)
        it('it should create projects model', function(done){


                var isExec = false;
            for (var i = 0; i < 1; i++) {
                projects.create(function(err , data){
                    console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }

                 })

            }


        })

        it('it should get projects model by id', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          projects.getById(function(err , data){
            console.log(err,data)

                    if(!isExec)
                    {
                        isExec = true;
                        done();
                    }
          })
      }
        })

        it('it should edit projects model', function(done){

          projects.update(function(err , data){
            console.log(err,data)
            done();
          })
        })
        it('it should delete projects model', function(done){

          projects.delete(function(err , data){
            console.log(err,data)
            done();
          })
        })

    it('it should get all projects', function(done){
            var isExec = false;
                for (var i = 0; i < 1; i++) {

          projects.get(function(err , data){
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

module.exports = Projects
