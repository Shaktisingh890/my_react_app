


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var a = [];



function getUniqueRandom(){

   var b = getRandomInt(1,23);

  if(a.indexOf(b) > -1)
  {
      return getUniqueRandom();
  }
  return b;
}

while(a.length < 23){
  a.push(getUniqueRandom())
}


console.log(a)
