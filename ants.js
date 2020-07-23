var width = 800;
let height = 400;
visualRange = 75;
centeringFactor = 0.005;
avoidFactor = 0.05;
matchingFactor = 0.05;

numAnts = 1;
margin = 100; 
turnFactor = 1; 
speedLimit = 15;
minDistance = 20; 

var fps = 1000;

var fpsInterval, startTime, now, then, elapsed;

var ants = [];

function sizeCanvas() {
  const canvas = document.getElementById("ants");
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function randn_bm()
{
  var u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function initAnts() {
  antVelocity = 0.08;
  console.log("Initializing", numAnts);
  ants = [];
  for (var i = 0; i < numAnts; i += 1) {
    ants[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      u: 1 * randn_bm(),
      v: 1 * randn_bm(),
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

window.onload = () => { // Initialization Function
  
  fpsInterval = 100000 / fps;
  then = Date.now();
  startTime = then;
  animationLoop();
};

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

// Drawing to canvas
function drawAnt(ctx, ant) {
  const angle = Math.atan2(ant.v, ant.u);
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

}

// **Main animation loop
function animationLoop() {
  // Update each ant
  for (let ant of ants) {
    keepWithinBounds(ant);

    // Update the position based on the current velocity
    ant.x += ant.u;
    ant.y += ant.v;
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

window.onload = () => {
  initAnts();
  window.requestAnimationFrame(animationLoop);
};

document.getElementById("reset").onclick = function(){
  console.log("Reset Clicked");
  initAnts();
};


// Slider Data for the Number of Ants Factor
document.getElementById("slider2").oninput = function() {
  document.getElementById("demo2").innerHTML = this.value;
  numAnts = this.value;
  initAnts();
  console.log("# of ants changed to  ", numAnts);
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