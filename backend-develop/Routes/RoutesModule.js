var Controller = require('../Controllers');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var Joi = require('joi');
var commonRoutes = require('./commonRoutesThings');
var _ = require('underscore')




var joiValidations = {
    String: Joi.string(),
    Date: Joi.date(),
    Number: Joi.number(),
    ObjectID: Joi.string(),
    Array: Joi.array(),
    Boolean: Joi.boolean()
}



function RoutesModule(controller, requestSchemas, moduleName, apiName, payload, isNotAutherize) {


    this.controller = controller;
    this.requestSchemas = requestSchemas;
    this.moduleName = moduleName;
    this.apiName = apiName;
    this.payload = payload;
    this.isNotAutherize = isNotAutherize
    this.extraRoutes = [];













    // var schema = getModelSchema(this.controller.service.model.schema,false)

    // if(this.requestSchemas){
    //       _.defaults(this.requestSchemas.post,schema)
    //       _.defaults(this.requestSchemas.put,schema)
    //   }else{

    //   }




}


function getModelSchema(schemas, isNested) {
    var schema = {

    }



    _.keys(_.omit(schemas.paths, ['_id',
        'createdAt',
        'updatedAt',
        '__v'
    ])).forEach((key) => {



        if (joiValidations[schemas.paths[key].instance]) {

            if (schemas.paths[key].instance == "Array") {

                if (schemas.paths[key].caster.constructor.name == "ObjectId") {
                    schema[key] = Joi.array().items(Joi.string())
                } else
                if (schemas.paths[key].caster.constructor.name == "SchemaString") {
                    schema[key] = Joi.array().items(Joi.string())
                } else if (schemas.paths[key].caster.constructor.name == "SchemaNumber") {
                    schema[key] = Joi.array().items(Joi.number())
                } else if (schemas.paths[key].caster.constructor.name == "Function") {


                    schema[key] = Joi.array().items(Joi.object().keys(getModelSchema(schemas.paths[key].caster.schema, true)))

                } else {
                    schema[key] = joiValidations[schemas.paths[key].instance]
                }


                //

                //schema[key] = Joi.array.items(Joi.object.keys(getModelSchema(schemas.paths[key].schema)))

            } else {

                schema[key] = joiValidations[schemas.paths[key].instance]
            }



        }
    })


    if (isNested) {
        schema._id = joiValidations.String;
    }


    return schema




}






RoutesModule.prototype.controller = function(controller) {
    this.controller = controller;
    return this;
}

RoutesModule.prototype.requestSchemas = function(requestSchemas) {
    this.requestSchemas = requestSchemas;
    return this;
}

RoutesModule.prototype.moduleName = function(moduleName) {
    this.moduleName = moduleName;
    return this;
}
RoutesModule.prototype.apiName = function(apiName) {
    this.apiName = apiName;
    return this;
}
RoutesModule.prototype.payload = function(payload) {
    this.payload = payload;
    return this;
}

RoutesModule.prototype.isNotAutherize = function(isNotAutherize) {
    this.isNotAutherize = isNotAutherize;
    return this;
}

RoutesModule.prototype.get = function(request, reply) {

    // var token = request.auth.credentials.token;
    // var userData = request.auth.credentials.userData;


    try {

        var data = {
            criteria: JSON.parse(request.query.criteria),
            projection: JSON.parse(request.query.projection),
            options: JSON.parse(request.query.options)
        };

        if (request.query.page >= 0 && request.query.perPage >= 1) {
            var skip = request.query.page * request.query.perPage;
            data.options.skip = skip;
            data.options.limit = request.query.perPage;
            data.pageData = {
                page: request.query.page,
                perPage: request.query.perPage
            }
        }

        if (this.controller.projectionRestriction) {

            this.controller.projectionRestriction.forEach(function(eachKey) {
                data.projection[eachKey] = 0;
            })

        }

        var population = []

        if (request.query.population) {
            try {

                population = JSON.parse(request.query.population);

            } catch (err) {

                console.log(err);

                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR));
                return;

            }
        }


        if (population && population.length) {
            if(!data.criteria.population)
                data.criteria.population = [];

            var _this = this;

            population.forEach(function(eachKey) {

                var populateObj = {};

                if (typeof eachKey == "string") {
                    populateObj = {
                        path: eachKey
                    }
                }

                if (typeof eachKey == "object") {
                    populateObj = eachKey
                }

                if (populateObj && !populateObj.select) {
                    if (_this.controller.populationKeys && _this.controller.populationKeys[populateObj.path]) {
                        populateObj.select = _this.controller.populationKeys[populateObj.path];
                    }
                }

                if (populateObj && !populateObj.match) {
                    populateObj.match = { isDeleted: { $ne: true } }
                }

                if (Object.keys(populateObj).length) {
                    data.criteria.population.push(populateObj);
                }

            })
        }

        if (request.query.search && this.controller.searchInKeys) {

            data.criteria["$or"] = [];

            this.controller.searchInKeys.forEach(function(eachKey) {

                var searchObj = {}

                searchObj[eachKey] = { $regex: request.query.search, $options: '-i' };

                data.criteria["$or"].push(searchObj);

            })


        }

        if (request.query.sortKey) {

            data.options.sort = {};
            data.options.sort[request.query.sortKey] = request.query.sortOrder || 1;

        } else {
            data.options.sort = {
                createdAt: -1
            }
        }

        if (request.extraPayloadCondition && request.extraPayloadCondition.id && request.organisationId) {

            data.criteria[request.extraPayloadCondition.id] = request.organisationId

        } else if (request.extraPayloadCondition && request.extraPayloadCondition.id) {

            data.criteria[request.extraPayloadCondition.id] = request.auth.credentials[request.extraPayloadCondition.dataKey]._id
        }

    } catch (err) {
        console.error(err);

        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);

    }

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.list, data);


    // this.controller.list(data, commonRoutes.handleControllerResponse.bind({
    //     reply: reply,
    //     request: request
    // }));
};

RoutesModule.prototype.getUnAuth = function(request, reply) {

    // var token = request.auth.credentials.token;
    // var userData = request.auth.credentials.userData.hii;


    try {
        var data = {
            criteria: JSON.parse(request.query.criteria),
            projection: JSON.parse(request.query.projection),
            options: JSON.parse(request.query.options)
        };

    } catch (err) {

        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);

    }


    // this.controller.list(data, commonRoutes.handleControllerResponseWithoutAuth.bind({
    //     reply: reply,
    //     request: request
    // }));


    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.list, data);
};




RoutesModule.prototype.graph = function(request, reply) {

    var data = request.query;


    var token = request.auth.credentials.token;
    var userData = request.auth.credentials.userData;

    if (typeof request.query.graphOption != 'object') {

        data = {
            criteria: JSON.parse(request.query.criteria),
            projection: JSON.parse(request.query.projection),
            options: JSON.parse(request.query.options),
            graphOption: JSON.parse(request.query.graphOption)
        };

    }

    if (!data.criteria) {
        data.criteria = {};
    }


    // this.controller.graph(data, commonRoutes.handleControllerResponse.bind({
    //     reply: reply,
    //     request: request
    // }));

    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.graph, data);

};

RoutesModule.prototype.getById = function(request, reply) {

    var token = request.auth.credentials.token;
    var userData = request.auth.credentials.userData;

    var data = {
        criteria: JSON.parse(request.query.criteria),
        projection: JSON.parse(request.query.projection),
        options: JSON.parse(request.query.options)
    };


    data.criteria._id = request.params._id;
    // this.controller.listById(data, commonRoutes.handleControllerResponse.bind({
    //     reply: reply,
    //     request: request
    // }));



    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.listById, data);




};


RoutesModule.prototype.deleteById = function(request, reply) {


    var token = request.auth.credentials.token;
    var userData = request.auth.credentials.userData;


    var data = {
        criteria: {
            _id: request.params._id
        }
    };


    // this.controller.delete(data, commonRoutes.handleControllerResponse.bind({
    //     reply: reply,
    //     request: request
    // }));



    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.delete, data);

};


RoutesModule.prototype.put = function(request, reply) {


    var token = request.auth.credentials.token;
    var userData = request.auth.credentials.userData;

    var data = {
        criteria: {
            _id: request.params._id
        },
        projection: request.payload,
        options: {
            new: true
        }
    }


    // this.controller.edit(data, commonRoutes.handleControllerResponse.bind({
    //     reply: reply,
    //     request: request
    // }));


    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.edit, data);

}




RoutesModule.prototype.options = function(request, reply) {

    return UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, {})

}


RoutesModule.prototype.post = function(request, reply) {


    var callingFunction = commonRoutes.handleControllerResponsePromise;

    if (this.isNotAutherize) {
        callingFunction = commonRoutes.handleControllerResponseWithoutAuthPromise;
    }

    // this.controller.add(request.payload, callingFunction.bind({
    //     reply: reply,
    //     request: request
    // }));



    return callingFunction.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.add, request.payload);

}

RoutesModule.prototype.dataTable = function(request, reply) {

    var payloadDataArray = JSON.parse(request.payload.data);
    var newPayloadData = {};
    payloadDataArray.forEach(function(arrayObject) {

        newPayloadData[arrayObject.name] = arrayObject.value;

    });




    try {

        if (request.query.isExtraOptions && request.query.overCritaria) {

            if (typeof request.query.overCritaria == 'string') {

                newPayloadData.extraCondition = JSON.parse(request.query.overCritaria);
            } else {

                newPayloadData.extraCondition = null
            }

        }

        if (request.extraPayloadCondition && request.extraPayloadCondition.id) {

            if (newPayloadData.extraCondition && newPayloadData.extraCondition.conditions) {

                newPayloadData.extraCondition.conditions[request.extraPayloadCondition.id] = request.auth.credentials[request.extraPayloadCondition.dataKey]._id

            } else {

                newPayloadData.extraCondition = {
                    conditions: {
                        [request.extraPayloadCondition.id]: request.auth.credentials[request.extraPayloadCondition.dataKey]._id
                    }


                }

            }



        }

        if (Array.isArray(request.extraPayloadCondition)) {

            if (newPayloadData.extraCondition && newPayloadData.extraCondition.conditions) {



            } else {

                newPayloadData.extraCondition = {
                    conditions: {

                    }


                }

            }

            request.extraPayloadCondition.forEach(function(conditionData) {


                if (conditionData.isAuthenticatedKey) {

                    newPayloadData.extraCondition.conditions[conditionData.id] = request.auth.credentials[conditionData.dataKey]._id


                } else {

                    newPayloadData.extraCondition.conditions[conditionData.key] = conditionData.value;

                }

            })



        }

    } catch (exception) {

        return UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);

    }




    // this.controller.dataTable(newPayloadData, function(err, result) {
    //     reply(result).code(201);
    // });


    return commonRoutes.handleControllerResponsePromise.call({
        reply: reply,
        request: request
    }, this.controller, this.controller.dataTable, newPayloadData);
};



RoutesModule.prototype.getRoutes = function() {

    var seperator = "";
    if (this.apiName) {
        seperator = "/"
    }


    var routes = [];


    if (this.readApi) {
        routes.push({
            method: 'GET',
            path: '/v1/admin/' + this.apiName,
            handler: this.get.bind(this),
            config: {
                auth: 'AdminAuth',
                cors: true,
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        criteria: Joi.string().default("{}"),
                        projection: Joi.string().default("{}"),
                        options: Joi.string().default("{}"),
                        search: Joi.string().optional(),
                        sortKey: Joi.string().optional(),
                        sortOrder: Joi.number().optional(),
                        page: Joi.number(),
                        perPage: Joi.number().when('page', { is: Joi.exist(), then: Joi.required() }),
                        population: Joi.string().optional()
                    })
                },
                description: 'list all ' + this.moduleName,
                tags: ['api', 'admin', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        });

    };


    if (this.getGraphsApi) {
        routes.push({
            method: 'GET',
            path: '/v1/admin/' + 'graphs/' + this.apiName,
            handler: this.graph.bind(this),
            config: {
                auth: 'AdminAuth',
                // cors : true,
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    query: Joi.object({
                        criteria: Joi.object(),
                        projection: Joi.object(),
                        options: Joi.object(),

                        graphOption: Joi.object().keys({

                            columns: Joi.array().items(
                                Joi.object().keys({
                                    name: Joi.string().required(),
                                    condition: Joi.object(),
                                })),
                            filterOn: Joi.string().required(),
                            startTime: Joi.date().required(),
                            endTime: Joi.date().required(),
                            parts: Joi.number()

                        })

                    })

                },
                description: 'get graph data ' + this.moduleName,
                tags: ['api', 'admin', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        });

    };
    if (this.createApi) {
        routes.push({
            method: 'POST',
            path: '/v1/admin/' + this.apiName,
            handler: this.post.bind(this),
            config: {
                description: 'add in ' + this.moduleName,
                tags: ['api', 'admin', this.moduleName],
                payload: this.payload,
                // cors : true,

                auth: this.isNotAutherize == true ? null : 'AdminAuth',
                validate: {
                    headers: this.isNotAutherize == true ? null : UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object(this.requestSchemas.post),

                    failAction: UniversalFunctions.failActionFunction
                },
                plugins: commonRoutes.routesPlugin
            }
        });

    };
    if (this.editApi) {
        routes.push({
            method: 'PUT',
            path: '/v1/admin/' + this.apiName + '/{_id}',
            handler: this.put.bind(this),
            config: {
                description: 'edit in ' + this.moduleName,
                tags: ['api', 'admin', this.moduleName],
                payload: this.payload,
                auth: 'AdminAuth',
                cors: true,
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    payload: Joi.object(this.requestSchemas.put),
                    params: Joi.object({
                        _id: Joi.string().required()
                    }),

                    failAction: UniversalFunctions.failActionFunction
                },
                plugins: commonRoutes.routesPlugin
            }
        });

    };
    if (this.getByIdApi) {
        routes.push({
            method: 'GET',
            path: '/v1/admin/' + this.apiName + '/{_id}',
            handler: this.getById.bind(this),
            config: {
                auth: 'AdminAuth',
                cors: true,
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.string().required()

                    }),
                    query: Joi.object({
                        criteria: Joi.string().default("{}"),
                        projection: Joi.string().default("{}"),
                        options: Joi.string().default("{}")
                    })
                },
                description: 'get a module by its id',
                tags: ['api', 'admin', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        });

    };
    if (this.deleteByIdApi) {
        routes.push({
            method: 'DELETE',
            path: '/v1/admin/' + this.apiName + '/{_id}',
            handler: this.deleteById.bind(this),
            config: {
                auth: 'AdminAuth',
                cors: true,
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    params: Joi.object({
                        _id: Joi.string().required()
                    })
                },
                description: 'get a module by its id',
                tags: ['api', 'admin', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        });

    };

    if (this.datatableApi) {
        routes.push({
            method: 'POST',
            path: '/v1/admin/' + "datatable/" + this.apiName + "",

            handler: this.dataTable.bind(this),
            config: {
                auth: 'AdminAuth',
                // cors :true ,
                validate: {
                    headers: UniversalFunctions.authorizationHeaderObj,
                    failAction: UniversalFunctions.failActionFunction

                },
                description: 'get datatable',
                tags: ['api', 'admin', this.moduleName],
                plugins: commonRoutes.routesPlugin
            }
        });

    };

    return routes.concat(this.extraRoutes);

}


RoutesModule.prototype.datatableRoute = function(auth, moduleOwnerName, extraConditions) {

    var seperator = "";
    if (this.apiName) {
        seperator = "/"
    }

    var _this = this;

    var route = {
        method: 'POST',
        path: '/v1/datatable/' + moduleOwnerName + (seperator.length > 0 ? '_' : "") + this.apiName,
        handler: function(request, reply) {

            request.extraPayloadCondition = extraConditions;

            //  if(request.auth.)

            _this.dataTable.call(_this, request, reply);

        },
        config: {
            auth: auth,
            // cors :true ,
            validate: {
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction

            },
            description: 'get datatable',
            tags: ['api', 'admin', this.moduleName],
            plugins: commonRoutes.routesPlugin
        }
    }

    this.extraRoutes.push(route)

    return this;

}

// {
//             method: 'GET',
//             path: '/v1/' + this.moduleName + seperator + this.apiName,
//             handler: this.get.bind(this),
//             config: {
//                 auth: 'OrgAdminAuth',
//                 validate: {
//                     headers: UniversalFunctions.authorizationHeaderObj,
//                     query: {
//                         criteria: Joi.string().default("{}"),
//                         projection: Joi.string().default("{}"),
//                         options: Joi.string().default("{}")
//                     }
//                 },
//                 description: 'list all ' + this.moduleName,
//                 tags: ['api','admin', this.moduleName],
//                 plugins: commonRoutes.routesPlugin
//             }
//         }




RoutesModule.prototype.getAllRoute = function(auth, moduleOwnerName, extraConditions, projectionRestriction, organisation, organisationId) {

    var seperator = "";
    if (this.apiName) {
        seperator = "/"
    }

    var _this = this;

    var getList = {
        method: 'GET',
        path: '/v1/' + moduleOwnerName + (organisation ? "/" + organisation + "/" + "{" + organisationId + "}" : "") + seperator + _this.apiName,
        handler: function(request, reply) {

            request.organisationId = request.params[organisationId];

            request.extraPayloadCondition = extraConditions;
            request.projectionRestriction = projectionRestriction;

            return _this.get.call(_this, request, reply);

        },
        config: {
            auth: auth,
            validate: {
                headers: UniversalFunctions.authorizationHeaderObj,
                query: Joi.object({
                    criteria: Joi.string().default("{}"),
                    projection: Joi.string().default("{}"),
                    options: Joi.string().default("{}")
                })
            },
            description: 'list all ' + this.moduleName,
            tags: ['api', 'admin', this.moduleName],
            plugins: commonRoutes.routesPlugin
        }
    }

    this.extraRoutes.push(getList)

    return this;

}






exports.Routes = RoutesModule;