var schedule = require('node-schedule');


function Scheduler() {





	this.jobsArray = [];
	this.recurringTime = 1000*60*60*1;
	this.startingTime = new Date();


	var rule = new schedule.RecurrenceRule();
	//rule.minute = 30;

	rule.second = new schedule.Range(0, 59, 5);



	this.addSchedule = function(date , schedulingFunction ){

		this.jobsArray.push(schedulingFunction);

	}




this.executingFunction = function(){

console.log("hii"+new Date())


this.jobsArray.forEach(function(executingFun){

	console.log("hiiiii2");

	executingFun();

});


}


schedule.scheduleJob(rule , this.executingFunction.bind(this));





}	


var scheduler = new Scheduler();


// setTimeout(function() {

// console.log("hii")

// scheduler.addSchedule(new Date(Date.now() + 10000) , function(){
// 	console.log("hii3")
// })

// }, 10000);


module.exports = scheduler;

