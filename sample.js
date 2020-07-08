let width = 800;
let height = 400;
visualRange = 75; 
centeringFactor = 0.005; 
avoidFactor = 0.05;
matchingFactor = 0.05;
numAnts = 4;
margin = 100;
turnFactor = 1; 
speedLimit = 15; 
minDistance = 20;
initAnts();
runLoop();

var fs = require('fs');
fs.writeFile('antData.txt','Number of Ants / Ant Velocity: ', function(err){
	if(err){
	return console.log(err);
	}
});

function initAnts() {
  antVelocity = 0.08;
  console.log("Initializing", numAnts);
  ants = [];
  for (var i = 0; i < numAnts; i += 1) {
    ants[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      u: Math.random(),
      v: Math.random(),
      history: [],
    };
  }

}

function distance(ant1, ant2) {
  return Math.sqrt(
    (ant1.x - ant2.x) * (ant1.x - ant2.x) +
      (ant1.y - ant2.y) * (ant1.y - ant2.y),
  );
}

function nClosestAnts(ant, n) {
  // Make a copy
  const sorted = ants.slice();
  // Sort the copy by distance from `ant`
  sorted.sort((a, b) => distance(ant, a) - distance(ant, b));
  // Return the `n` closest
  return sorted.slice(1, n + 1);
}


function keepWithinBounds(ant) {

  if (ant.x < margin) {
    ant.u += turnFactor;
  }
  if (ant.x > width - margin) {
    ant.u -= turnFactor
  }
  if (ant.y < margin) {
    ant.v += turnFactor;
  }
  if (ant.y > height - margin) {
    ant.v -= turnFactor;
  }
}

function avoidOthers(ant) {
  let moveX = 0;
  let moveY = 0;
  for (let otherAnt of ants) {
    if (otherAnt !== ant) {
      if (distance(ant, otherAnt) < minDistance) {
        moveX += ant.x - otherAnt.x;
        moveY += ant.y - otherAnt.y;
      }
    }
  }

  ant.u += moveX * avoidFactor;
  ant.v += moveY * avoidFactor;
}

function matchVelocity(ant) {
  let avgU = 0;
  let avgV = 0;
  let numNeighbors = 0;
  console.log("Number of Total Ants :" + numAnts);
  console.log("X Velocity of Ant :" + ant.u);
  console.log("Y Velocity of Ant :" + ant.v);

  fs.appendFile('antData.txt',numAnts.toString() + ' / ' + ant.u.toString(), function(err){
	if(err){
	return console.log(err);
	}
	console.log("Number of Ants and Ant Velocity Logged Successfully!");
});

  for (let otherAnt of ants) {
    if (distance(ant, otherAnt) < visualRange) {
      avgU += otherAnt.u;
      avgV += otherAnt.v;
      numNeighbors += 1;
    }
  }
}

function limitSpeed(ant) {

  const speed = Math.sqrt(ant.u * ant.u + ant.v * ant.v);
  if (speed > speedLimit) {
    ant.u = (ant.u / speed) * speedLimit;
    ant.v = (ant.v / speed) * speedLimit;
  }
}

function runLoop() {
  // Update each ant
  for (let ant of ants) {
    avoidOthers(ant);
    matchVelocity(ant);
    limitSpeed(ant);
    keepWithinBounds(ant);

    // Update the position based on the current velocity
    ant.x += ant.u;
    ant.y += ant.v;
    ant.history.push([ant.x, ant.y])
    ant.history = ant.history.slice(-50);
  }
 }

// \n For Creating Breaks --> Is effectively a 'tab' button

