var dependencies = require('./dependencies')
var routes = require('./routes.js')
var Services = dependencies.Service;
var UniversalFunctions = dependencies.UniversalFunctions;

//console.log(Services.makeModule)


exports.register = function(server, options, next) {

    server.route(routes(options));
    server.ext('onPreHandler', function(request, reply) {


        if (request.route.settings.auth && request.route.settings.auth.strategies && request.route.settings.auth.strategies[0] == 'AdminAuth') {

            if (request.auth.credentials.adminData && request.auth.credentials.adminData.isSuperDuperAdmin) {
                return reply.continue();
            }
            Services.makeModule.apiPaths.view({
                $or: [{
                    isPublic:true,
                    method: request.route.method,
                     path: request.route.path

                    },{

                        method: request.route.method,
                     path: request.route.path,
                     allow: request.auth.credentials.adminData.roleId
                       
                        
                    }
                    
                ]
            }, {}, { lean: true }, function(err, result) {

                if (err) {
                    console.log(err);

                    return reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR));
                }

                if (result.length) {
                    return reply.continue();
                } else {
                    return reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS));
                }


            })

        } else {
            return reply.continue();
        }

    })
    next();
}



exports.register.attributes = {
    pkg: require('./package.json')
};
