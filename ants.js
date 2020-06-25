// Size of canvas. These get updated to fill the whole browser.
var width = 800;
let height = 400;

// TODO: Display key parameters on the html numants visual range
visualRange = 75; // i.e.visual ragnge
centeringFactor = 0.005; // adjust velocity by this %   i.e. coherence from function flyTowardsCenter(bot)
avoidFactor = 0.05; // Adjust velocity by this %        i.e. separation from function avoidOthers()
matchingFactor = 0.05; // Adjust by this %              i.e. aligment from matchVelocity()
// Key parameter ends

numAnts = 1;
margin = 100; // from keepWithinBounds(ant)
turnFactor = 1; // from keepWithinBounds(ant)
speedLimit = 15; // from limitSpeed()
minDistance = 20; // The distance to stay away from other ants from avoidOthers()

var fps = 1000;

var fpsInterval, startTime, now, then, elapsed;

var ants = [];

// Called initially and whenever the window resizes to update the canvas
// size and width/height variables.
function sizeCanvas() {
  const canvas = document.getElementById("ants");
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

// Creates a random generator based off the 99.7-95-68 rule, aka the Empirical Rule

function randn_bm()
{
  var u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// Initialization step. FUTURE TODO: make sure that the old bots are cleared as well
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

function animationLoop() // Animation Function
{
  requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval)
  {
    then = now - (elapsed % fpsInterval);
  }
}

Window.onload = () => // Initialization Function
{
  fpsInterval = 100000 / fps;
  then = Date.now();
  startTime = then;
  animationLoop();
}

// Measuring distance from bot to bot 
function distance(ant1, ant2) {
  return Math.sqrt(
    (ant1.x - ant2.x) * (ant1.x - ant2.x) +
      (ant1.y - ant2.y) * (ant1.y - ant2.y),
  );
}

// Finding closest bots 
function nClosestAnts(ant, n) {
  // Make a copy
  const sorted = ants.slice();
  // Sort the copy by distance from `ant`
  sorted.sort((a, b) => distance(ant, a) - distance(ant, b));
  // Return the `n` closest
  return sorted.slice(1, n + 1);
}

////////////////////////////////////////////////////////////////////////////////
// RULES - Separation, Alignment, and Cohesion
////////////////////////////////////////////////////////////////////////////////

// Rule 1: Find the center of mass of the other ants and adjust velocity slightly to
// point towards the center of mass.
// Cohesion
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

// Rule 2: Move away from other ants that are too close to avoid colliding
// Separation
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

// Rule 3: Find the average velocity (speed and direction) of the other ants and
// adjust velocity slightly to match.
// Alignment
function matchVelocity(ant) {
  let avgDX = 0;
  let avgDY = 0;
  let numNeighbors = 0;
  console.log("Number of Total Ants :" + numAnts);
  console.log("Number of nearby Ants :" + numNeighbors);
  console.log("X Velocity of Ant :" + ant.dx);
  console.log("Y Velocity of Ant :" + ant.dy);

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



// Rule 4* Constrain a ant to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
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

// Rule 5* Speed will naturally vary in flocking behavior, but real animals can't go
// arbitrarily fast.
function limitSpeed(ant) {

  const speed = Math.sqrt(ant.dx * ant.dx + ant.dy * ant.dy);
  if (speed > speedLimit) {
    ant.dx = (ant.dx / speed) * speedLimit;
    ant.dy = (ant.dy / speed) * speedLimit;
  }
}

////////////////////////////////////////////////////////////////////////////////
// End of Rules
////////////////////////////////////////////////////////////////////////////////
const DRAW_TRAIL = false;

// Drawing to canvas
function drawAnt(ctx, ant) {
  const angle = Math.atan2(ant.dy, ant.dx);
  ctx.translate(ant.x, ant.y);
  ctx.rotate(angle);
  ctx.translate(-ant.x, -ant.y);
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.moveTo(ant.x, ant.y);
  ctx.lineTo(ant.x - 15, ant.y + 5);
  ctx.lineTo(ant.x - 15, ant.y - 5);
  ctx.lineTo(ant.x, ant.y);
  ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  if (DRAW_TRAIL) {
    ctx.strokeStyle = "#558cf466";
    ctx.beginPath();
    ctx.moveTo(ant.history[0][0], ant.history[0][1]);
    for (const point of ant.history) {
      ctx.lineTo(point[0], point[1]);
    }
    ctx.stroke();
  }
}

// **Main animation loop
function animationLoop() {
  // Update each ant
  for (let ant of ants) {
    // Update the velocities according to each rule
    flyTowardsCenter(ant);
    avoidOthers(ant);
    matchVelocity(ant);
    limitSpeed(ant);
    keepWithinBounds(ant);

    // Update the position based on the current velocity
    ant.x += ant.dx;
    ant.y += ant.dy;
    ant.history.push([ant.x, ant.y])
    ant.history = ant.history.slice(-50);
  }

  // Clear the canvas and redraw all the ants in their current positions
  const ctx = document.getElementById("ants").getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (let ant of ants) {
    drawAnt(ctx, ant);
  }

  // Schedule the next frame
  window.requestAnimationFrame(animationLoop);
}

// **Once the window is loaded, this main function is called
window.onload = () => {
  // Make sure the canvas always fills the whole window
  // window.addEventListener("resize", sizeCanvas, false);
  // sizeCanvas();

  // Randomly distribute the ants to start
  initAnts();

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
}

// Intearaction with the html

// old style
document.getElementById("reset").onclick = function(){
  console.log("Reset Clicked");
  initAnts();
}


// Slider Data for the Avoidance Factor
document.getElementById("slider1").oninput = function() {
  document.getElementById("demo1").innerHTML = this.value;
  avoidFactor = this.value / 100;
  console.log("Avoidance Factor changed to ", avoidFactor);
}

// Slider Data for the Number of Ants Factor
document.getElementById("slider2").oninput = function() {
  document.getElementById("demo2").innerHTML = this.value;
  numAnts = this.value;
  initAnts();
  console.log("# of ants changed to  ", numAnts);
}

// Slider Data for the Visual Range Factor
document.getElementById("slider3").oninput = function() {
  document.getElementById("demo3").innerHTML = this.value;
  visualRange = this.value;
  initAnts();
  console.log("Visual Range changed to  ", visualRange);
}

// Slider Data for the Centering Factor
document.getElementById("slider4").oninput = function() {
  document.getElementById("demo4").innerHTML = this.value;
  centeringFactor = this.value / 1000;
  initAnts();
  console.log("Centering Factor changed to  ", centeringFactor);
}

// Slider Data for the Speed Matching Factor
document.getElementById("slider5").oninput = function() {
  document.getElementById("demo5").innerHTML = this.value;
  matchingFactor = this.value / 100;
  initAnts();
  console.log("Speed Matching Factor changed to  ", matchingFactor);
}

// Slider Data for the Canvas Width Factor
document.getElementById("slider6").oninput = function() {
  document.getElementById("demo6").innerHTML = this.value;
  document.getElementById("ants").width = this.value;
  width = this.value;
  ctx.clearRect(0, 0, width, height);
  initAnts();
  console.log("Window width changed to  ", width);
}