'use strict';

const async = require('async');
const _ = require('underscore');
const UniversalFunctions = require('../Utils/UniversalFunctions');

const Services = require('../Services');

var generateRandomNumber = function(minNum, maxNum) {

    var randm = Math.random();

    return  randm*maxNum < minNum ?  Math.floor(minNum + randm*maxNum) : Math.floor(randm*maxNum);
    
}

exports.generateRandomNumber = generateRandomNumber;