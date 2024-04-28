'use strict';

var Controller = require('../Controllers');
var Models = require('../Models');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Joi = require('joi');
var routes = require('./RoutesModule').Routes;
var _ = require('underscore')

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
console.log("**********----------->>>")
var joiValidations = {
    String : "String",
    Date : "Date",
    Number : "Number"

}




function getModelSchema(schemas, model){
    var schema = {
                      data : [],
                      singularName: model ,


                   }




        _.keys(_.omit(schemas.paths,[  '_id',
      'createdAt',
      'updatedAt',
      '__v'])).forEach((key)=>{

          var d = {
            feild : key,
            name : key.capitalize(),

          }



     if(joiValidations[schemas.paths[key].instance])
     {

        if(schemas.paths[key].instance == "Array"){

            // if(schemas.paths[key].caster.constructor.name == "ObjectId"){
            //    schema[key] =  Joi.array().items(Joi.string())
            // } else
            // if(schemas.paths[key].caster.constructor.name == "SchemaString"){
            //    schema[key] =  Joi.array().items(Joi.string())
            // }else  if(schemas.paths[key].caster.constructor.name == "SchemaNumber"){
            //    schema[key] =  Joi.array().items(Joi.number())
            // }else if(schemas.paths[key].caster.constructor.name == "Function"){


            //         schema[key] = Joi.array().items(Joi.object().keys(getModelSchema(schemas.paths[key].caster.schema)))

            // } else {
            //     schema[key] = joiValidations[schemas.paths[key].instance]
            // }


           //

            //schema[key] = Joi.array.items(Joi.object.keys(getModelSchema(schemas.paths[key].schema)))

            } else {

                d.type = joiValidations[schemas.paths[key].instance]
            }



         }

         schema.data.push(d)
     })


  return schema




}

module.exports = [

  {
        method: 'GET',
        path: '/v1/modelsSchema',
        handler: function(request, reply) {

            var totalSchema = {

            }


            for(var key in Models){
              // console.log(Models[key].modelName)
              // console.log(Models[key].schema.paths)
              totalSchema[Models[key].modelName.toLocaleLowerCase()] =  getModelSchema(Models[key].schema,Models[key].modelName)

            }

           return UniversalFunctions.sendSuccess(null, totalSchema);
        },
        config: {
            description: 'Get Schema for models for admin',

            tags: ['api', 'models'],
            validate: {

                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
]
