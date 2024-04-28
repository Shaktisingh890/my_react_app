var debugging_enabled = true;
var logs = {

  logResponse: function(eventFired, error, result) {


    var stream = process.stdout;
    if (error) {

      stream = process.stderr;
      stream.write(new Error().stack)
    }

    if (debugging_enabled) {
      stream.write("Event: " + eventFired);
      stream.write("\tError: " + JSON.stringify(error));
      stream.write("\tResult: " + JSON.stringify(result));

    }
  }
}



module.exports = logs;
