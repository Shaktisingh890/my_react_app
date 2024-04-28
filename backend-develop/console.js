var repl = require("repl");

var epa = require("epa");
var db = require("db");

// connect to databases
db.connect(epa.mongo, function(err){
  if (err){ throw err; }

  // open the repl session
  var replServer = repl.start({});

  // attach modules to the repl context
  replServer.context.epa = epa;
  replServer.context.db = db;
});
