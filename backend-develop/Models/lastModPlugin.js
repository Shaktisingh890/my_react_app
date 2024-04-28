module.exports = exports = function lastModifiedPlugin (schema, options) {
  
  schema.pre('save', function (next) {
  	console.log("======================here in pre save")
    this.lastUpdated = new Date();
    next();
  })
  
}