var fs = require('fs');
var d3 = require('d3');
var JSDOM = require('jsdom').JSDOM;

var chartWidth = 500,
  chartHeight = 500;

var arc = d3.arc()
  .outerRadius(chartWidth / 2 - 10)
  .innerRadius(0);

var labelArc = d3.arc()
  .outerRadius(chartWidth - 40)
  .innerRadius(chartWidth - 40);


var colours = ['#F00', '#000', '#675', '#000', '#000', '#000', '#000', '#000', '#000'];

module.exports = function (pieData, outputLocation) {
  if (!pieData) pieData = [20,30,34];
  if (!outputLocation) outputLocation = 'test.svg';
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document); //get d3 into the dom

  //do yr normal d3 stuff
  var svg = window.d3.select('body')
    .append('div').attr('class', 'container') //make a container div to ease the saving process
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', 'chartWidth')
    .attr('height', 'chartHeight')
    .append('g')
    .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartWidth / 2 + ')');

  var g = svg.selectAll('.arc')
    .data(d3.pie()(pieData))
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('d', arc)
    .attr('fill', function (d, i) {
      return colours[i];
    })
    .attr('stroke', '#fff');

  g.append("text")
    .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function (d) { 
      return d.data;
     });


  console.log(window.d3.select('.container').html())

  //write out the children of the container div
  fs.writeFileSync(outputLocation, window.d3.select('.container').html()) //using sync to keep the code simple
}

if (require.main === module) {
  module.exports();
}