var Service = require('../../Services');
var advancedFunctions = require('../commonAdvanceFunctions');

var parallel = advancedFunctions.handleParallelFunctions;
var waterfall = advancedFunctions.handleWaterFallFunctions;

// here we are writing some mongo queries autogenerate data or default values


// if we are going to add new keys in mongodb 

// test details in user 



/**
 * [dataUpdateModel description]
 * @param  {[type]} service [service of perticuler model]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */
function dataUpdateModel(service, configData) {

  this.service = service;
  this.configData = configData;
}


dataUpdateModel.prototype.get = function(key, conditionFlag,  callback) {
  var self = this;


  var condition = {};

  condition[key] = {
      "$exists": conditionFlag
    };


  this.service.view(condition, {
    _id: true
  }, {}, function(err, result) {

    self.totalResult = result;

    callback(err, result);

  });
};


dataUpdateModel.prototype.edit = function(id, valueToAdd) {
  var self = this;

  this.service.edit({
    _id: id
  }, valueToAdd, {}, function(err, result) {
    self.totalResult = result;

  });
};


var testDetailsNewKeys = {
  isPaid: true,
  amount : 500,
  isShowUser : true
};


testDetailsRemoveKeys = {
  amount : ""
};


// var userNewKeys = {
//   testDetails : {}
// };


var cuisines = [["South indian" , "muglai"] , ["North" , "chikin"] , ["family" , "awesome"]  , ["hydrabadi" , "South indian"] ]

var restaurantNewKeys = {
  cuisine :  returnCuisine  ,
  budget :  returnBudget
}

var postsNewKeys = {
  totalLikes : 0
}

var userNewKeys = {
  aboutText : "sample text"
}

function returnCuisine(){
  return  cuisines[ Math.floor((Math.random() * cuisines.length))];

}

function returnBudget(){
  return Math.floor((Math.random() * 4) + 1)
}

var vendorNewKey = {

  companyCut : 20

}
var weightRangeNewKeys = {

  vendorCutWeightFactor : 1

}


// addKey(Service.makeModule.posts, postsNewKeys);

// updateKey(Service.makeModule.usersModel, userNewKeys);
// addKey(Service.makeModule.vendors, vendorNewKey);
// addKey(Service.makeModule.weightRanges, weightRangeNewKeys);


//removeKeys(Service.makeModule.testDetails, testDetailsRemoveKeys)



function addKey(model, keys) {

  var testDetails = new dataUpdateModel(model, keys);

  for (var key in keys) {
    testDetails.get( key, false,function(err, result) {

      console.log("=================================" , result);
      result.forEach(function(test) {
        var valueToSet = {};
        valueToSet[key] = keys[key];

        var valueToAdd = {
          '$set' : valueToSet
        };
        testDetails.edit(test._id, valueToAdd);
      });
    });
  }
}

function updateKey(model, keys) {

  var testDetails = new dataUpdateModel(model, keys);

  for (key in keys) {
    testDetails.get(key, true,function(err, result) {

      console.log("=================================" , result);
      result.forEach(function(test) {
        var valueToSet = {};
        valueToSet[key] = typeof keys[key] == 'function' ?   keys[key].call() : keys[key];

        var valueToAdd = {
          '$set' : valueToSet
        };
        testDetails.edit(test._id, valueToAdd);
      });
    });
  }
}

function removeKeys(model, keys) {

  var testDetails = new dataUpdateModel(model, keys);

  for (key in keys) {
    testDetails.get(key, true,function(err, result) {
      result.forEach(function(test) {
        var valueToSet = {};
        valueToSet[key] = keys[key];

        var valueToAdd = {
          '$unset' : valueToSet
        };
        testDetails.edit(test._id, valueToAdd);
      });
    });
  }
}





