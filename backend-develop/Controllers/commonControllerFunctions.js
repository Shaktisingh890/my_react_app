var async = require('async');

function waterFallHandler(err, response, statusMsg) {
if(err == 1) {
  this.callback(err, response, statusMsg)
} else {
  if (err) {

    console.trace(err);
    this.callback(err);
  } else {
    this.callback(null, response);
  }
}
 
}

function handleWaterFallFunctions(waterfallArray , callback) {

  async.waterfall(waterfallArray, waterFallHandler.bind({
    callback: callback
  }));

}
exports.handleWaterFallFunctions = handleWaterFallFunctions;

function handleParallelFunctions(parallelArray , callback) {

  async.parallel(parallelArray, waterFallHandler.bind({
    callback: callback
  }));

}


exports.handleParallelFunctions = handleParallelFunctions;
