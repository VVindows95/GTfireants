var width = 800;
var height = 400;

var numAnts = 1;
var margin = 5;
var speedLimit = 15;
var minDistance = 20; 
var antMass = 1;
var antForce = 0;
var deltaT = 1;


//numTrials = 2;
//timeStamp = 0;

/**

fs = require('fs');
fs.writeFile('AntData.txt', 'TimeStamp | X Position | Y Position | X Velocity | Y Velocity', function (err) {
  if (err) return console.log(err);
  console.log('AntData.txt has been created!');
});


**/

// RANDOM WALK STUFF

function randn_bm()
{
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
}

function randomWalk() 
{
  randn_bm();
  var movement = num * 10;
}

// RANDOM WALK END

function initAnts() 
{
  console.log("Initializing", numAnts);
  ants = [];
  for (var i = 0; i < numAnts; i += 1) {
    ants[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      u: 1,
      v: 1,
    };
  }
}

window.onload = () => // Initialization Function
{ 
  initAnts();
  animationLoop(); //Disable for NodeJS Trajectory Saving

  /** Enable for NodeJS Trajectory Saving
  for (i = 0; i < numTrials; i++)
  {
    timeStamp += 1;
    animationLoop();
  }
  **/
};

function keepWithinBounds(ant) 
{

  if (ant.x < margin) 
  {
    ant.u = -ant.u;
  }
  if (ant.x > width - margin) 
  {
    ant.u = -ant.u;
  }
  if (ant.y < margin) 
  {
    ant.v = -ant.v;
  }
  if (ant.y > height - margin) 
  {
    ant.v = -ant.v;
  }

}

// Drawing to canvas
function drawAnt(ctx, ant) 
{
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
function animationLoop() 
{
  // Update each ant
  for (let ant of ants) 
  {

    keepWithinBounds(ant);
    randomWalk();

    ant.x += deltaT * ant.u;
    ant.y += deltaT * ant.v;
    ant.u += deltaT * movement;
    ant.v += deltaT * movement;
  }
// saving for later     ant.u += deltaT * (antForce / antMass); ant.v += deltaT * (antForce / antMass);

/**
  fs.appendFile('AntData.txt', '\n' + timeStamp + ' ' + ant.x.toString() + ' ' + ant.y.toString() + ' ' + ant.u.toString() + ' ' + ant.v.toString(), function (err) {
    if (err) return console.log(err);
    console.log('Ant Data has been successfully logged to AntData.txt!');
});
**/

  // Clear the canvas and redraw all the ants in their current positions
  const ctx = document.getElementById("ants").getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (let ant of ants) {
    drawAnt(ctx, ant);
  }
  // Schedule the next frame
  window.requestAnimationFrame(animationLoop); // Disable for NodeJS Trajectory Saving
}

document.getElementById("reset").onclick = function()
{
  console.log("Reset Clicked");
  initAnts();
};

// Slider Data for the Number of Ants Factor
document.getElementById("slider2").oninput = function() 
{
  document.getElementById("demo2").innerHTML = this.value;
  numAnts = this.value;
  initAnts();
  console.log("# of ants changed to  ", numAnts);
};

// Slider Data for the deltaT Factor
document.getElementById("slider3").oninput = function() 
{
  document.getElementById("demo3").innerHTML = this.value;
  deltaT = this.value;
  initAnts();
  console.log("deltaT changed to  ", deltaT);
};

// Slider Data for the Canvas Width Factor
document.getElementById("slider6").oninput = function() 
{
  document.getElementById("demo6").innerHTML = this.value;
  document.getElementById("ants").width = this.value;
  width = this.value;
  ctx.clearRect(0, 0, width, height);
  initAnts();
  console.log("Window width changed to  ", width);
};