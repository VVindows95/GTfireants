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


function initAnts() {
  antVelocity = 0.08;
  console.log("Initializing", numAnts);
  ants = [];
  for (var i = 0; i < numAnts; i += 1) {
    ants[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * 10 - 5,
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

function flyTowardsCenter(ant) {

  let centerX = 0;
  let centerY = 0;
  let numNeighbors = 0;

  for (let otherAnt of ants) {
    if (distance(ant, otherAnt) < visualRange) {
      centerX += otherAnt.x;
      centerY += otherAnt.y;
      numNeighbors += 1;
    }
  }

  if (numNeighbors) {
    centerX = centerX / numNeighbors;
    centerY = centerY / numNeighbors;
    // Updates Velocity
    ant.dx += (centerX - ant.x) * centeringFactor;
    ant.dy += (centerY - ant.y) * centeringFactor;
  }
}

function keepWithinBounds(ant) {

  if (ant.x < margin) {
    ant.dx += turnFactor;
  }
  if (ant.x > width - margin) {
    ant.dx -= turnFactor
  }
  if (ant.y < margin) {
    ant.dy += turnFactor;
  }
  if (ant.y > height - margin) {
    ant.dy -= turnFactor;
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

  ant.dx += moveX * avoidFactor;
  ant.dy += moveY * avoidFactor;
}

function matchVelocity(ant) {
  let avgDX = 0;
  let avgDY = 0;
  let numNeighbors = 0;

  for (let otherAnt of ants) {
    if (distance(ant, otherAnt) < visualRange) {
      avgDX += otherAnt.dx;
      avgDY += otherAnt.dy;
      numNeighbors += 1;
    }
  }

  if (numNeighbors) {
    avgDX = avgDX / numNeighbors;
    avgDY = avgDY / numNeighbors;

    ant.dx += (avgDX - ant.dx) * matchingFactor;
    ant.dy += (avgDY - ant.dy) * matchingFactor;
  }
}

function limitSpeed(ant) {

  const speed = Math.sqrt(ant.dx * ant.dx + ant.dy * ant.dy);
  if (speed > speedLimit) {
    ant.dx = (ant.dx / speed) * speedLimit;
    ant.dy = (ant.dy / speed) * speedLimit;
  }
}

var fs = require('fs');
fs.writeFile('antData1.txt','Number of Ants: ', function(err){
	if(err){
	return console.log(err);
	}
});

fs.appendFile('antData1.txt',ant.dx, function(err){
	if(err){
	return console.log(err);
	}
	console.log("Number of Ants Logged Successfully!");
});
