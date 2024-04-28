
function routes(server) {


}


{
    method: 'GET',
    path: '/v1/' + this.apiName ,
    handler: this.newFunction.bind(this),
    config: {
        validate: {
            query: {
            }

        },
        description: 'get a module by its id',
        tags: ['api', this.moduleName],
        plugins: commonRoutes.routesPlugin
    }
}