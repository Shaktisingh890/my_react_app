// TODO: create a module
// for charts to show to the frontend

// params to send to front end
// 
// 
// 
//
//data to send : 
//
// array of data 
//         series: [{
//             data: [10, 15, 12, 8, 7],
//             name : "name of series"
//         }]



function charts(option) {
  if (option.type == 'LINE_CHART') {

    return graphChart(option);


  }

}




/**
 * [graphChart description]
 * @param  {[type]} option [description]
 * @return {[type]}        [description]
 */

// option : {
//   columns : [ {"name":"blocked users" , condition : { "isBlocked" : true} } , 
//   {"name":"deleted users" , condition : { "isDeleted" : true} } , 
//   { name : "active users" , condition : { "isDeleted" : false , "isBlocked" : false }  }   ]
//   data : [{"date":"121212121" }],
//   filterOn : "date",
//   startTime : "",
//   endTime : "" ,
//   part : "" // in millis
//   
// }




function maxPossibleIndex(searchElement) {
  'use strict';

  var minIndex = 0;
  var maxIndex = this.length - 1;
  var currentIndex;
  var currentElement;
  var resultIndex;

  while (minIndex <= maxIndex) {
    resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
    currentElement = this[currentIndex];

    if (currentElement < searchElement) {
      minIndex = currentIndex + 1;
    } else if (currentElement > searchElement) {
      maxIndex = currentIndex - 1;
    } else {
      return currentIndex;
    }
  }

  return maxIndex;
}

Array.prototype.maxPossibleIndex = maxPossibleIndex;

function graphChart(option) {

  var counts = {};

  var dateNodes = createDiscreateTime(option.startTime, option.endTime, option.part);

  var dateArray = dateNodes.discreteTime;
  var dateObject = dateNodes.discreteTimeObject;

  

   option.columns.forEach(function(graphType) {

// initialising with zeros
    if (!counts[graphType.name]) {
        counts[graphType.name] = Array.apply(null, Array(dateArray.length)).map(Number.prototype.valueOf, 0) //_.clone(dateObject) 
      }
   })

  option.data.forEach(function(data) {

    //console.log("data -------------" , data)

    option.columns.forEach(function(graphType) {

      //console.log("=========" , graphType)


      var test = true;
      //console.log(graphType.condition)
      for (key in graphType.condition) {

        //console.log(data[key])

        //console.log(graphType.condition[key])


        if (data[key] == graphType.condition[key]) {

        } else if (typeof data[key] == 'undefined') {

          test = false;

        } else {
          test = false;
        }

      }

      if (test) {
        //console.log("yeyyyyyyy.... :D")

        //console.log(dateArray.maxPossibleIndex(data[option.filterOn]))

        if (dateArray.maxPossibleIndex(data[option.filterOn]) < dateArray.length) {
          counts[graphType.name][dateArray.maxPossibleIndex(data[option.filterOn])] += 1;

        }

      }
    });

  });






  var formatedData = {};

  dateArray.forEach(function(date, index) {



    for (key in counts) {

      if (formatedData[key]) {
        formatedData[key].push([date.getTime(), counts[key][index]])
      } else {
        formatedData[key] = [
          [date.getTime(), counts[key][index]]
        ]
      }

    }

  });



var dataToSend = [];



for (key in formatedData){

  var data = {
    name : key,
    data : formatedData[key]
  };
  dataToSend.push(data)

}



  /// console.log(counts[graphType.name][dateArray[dateArray.maxPossibleIndex(data[option.filterOn])]])

  //if (counts[graphType.name][dateArray[dateArray.maxPossibleIndex(data[option.filterOn])]]) {


  // }
  // 
  // 


  return dataToSend;


}


function binarySearch(array, key) {


}



function createDiscreteTimes(option) {
  // var type = option.type;
  // if(type == 'HOUR')
  // {

  // }




}


// time = millis > sec > mins > hours > days

function createDiscreateTime(startTime, endTime, part) {

  console.log(startTime, endTime, part)
  var discreteTime = [];
  var discreteTimeObject = {};


  var start = new Date(startTime);
  var end = new Date(endTime);
  var currentTime = start;
  var n = 0;

  while (currentTime < end) {


    currentTime = parseInt(new Date(currentTime) / part) * (part) + (part)

    discreteTime.push(new Date(currentTime));
    discreteTimeObject[new Date(currentTime)] = 0;
  }
  console.log("======================================")
  console.log(discreteTime.length)
  console.log(discreteTime)

  return {
    discreteTime: discreteTime,
    discreteTimeObject: discreteTimeObject

  }
}



module.exports = charts;
