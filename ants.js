var width = 800;
let height = 400;

numAnts = 1;
margin = 100; 
turnFactor = 1; 
speedLimit = 15;
minDistance = 20; 

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

window.onload = () => { // Initialization Function
  initAnts();
  window.requestAnimationFrame(animationLoop);
};

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