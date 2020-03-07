// DRAWING MODULE


// Obtain a reference to the canvas element using its id.
var canvas = document.getElementById('nightSky');
// Obtain a graphics context on the canvas element for drawing.
var ctx = canvas.getContext('2d');

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function distance(s1, s2) {
  return Math.sqrt(Math.pow(s2.x-s1.x, 2) + Math.pow(s2.y-s1.y, 2) + Math.pow(s2.z-s1.z, 2))
}

function Star(x, y, r) {
  this.x = x;
  // NOTE: use percentage value
  this.y = y;
  this.r = r;
  this.z = 0;
  this.colour = chooseColour(); // random colour
  this.alpha = 0; // start at zero
  this.neighbours = [] // near neighbors

}

Star.prototype.constructor = Star;


function LocatorCircle(r) {
  this.x = 0.5;
  this.y = 0.5;
  this.r = r; // in terms of percentage
  this.z = 0;
}

LocatorCircle.prototype.constructor = LocatorCircle();

function chooseColour() {
  let colours = ["#e9e9e9", "#b6d3e9", "#ec8b69"]
  return (colours[Math.floor(Math.random()*(colours.length+1))])
}


let stars = []

function populateNeighbours(star) {

  j = Math.floor(Math.random()*(stars.length))

  DIST_LIMIT = 0.3

  // 8 attempts to connect new lines
  for (let i =0; i < 50 && star.neighbours.length <= 3; i+=1) {
    if (stars[j] != star && distance(stars[j], star) < DIST_LIMIT) { // TODO check equality
      star.neighbours.push(stars[j])
    }

  }
  
}

let circles = []

let paths = []


function printMousePos(event) {
    x = event.clientX;
    y = event.clientY;

    newStar(x, y)
}

function randomStar() {
  if (stars.length >= 5) {
    newStar(Math.floor(Math.random()*(window.innerWidth)), Math.floor(Math.random()*(window.innerHeight)));
  }
  
}

function newStar(x, y) {
  stars.push(new Star(x/window.innerWidth, y/window.innerHeight, 5))
  populateNeighbours(stars[stars.length-1]);
}

function locator() {
  circles.push(new LocatorCircle(1))
  
}

function draw() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    //...drawing code...

    //ctx.clearRect(0, 0, canvas.width, canvas.height); // clear rectangle
    
    /*
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = '5';
    ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    Debug
    */ 

    if (stars.length < 5) {
      ctx.font = "40px Roboto";
      ctx.fillText("Hello World", 10, 50);
    }

    stars.forEach(function(item, index, arr) {

      // DRAW LINES
      item.neighbours.forEach(function(s, index, arr) {
        ctx.beginPath();
        ctx.moveTo(item.x*ctx.canvas.width, item.y*ctx.canvas.height);
        ctx.lineTo(s.x*ctx.canvas.width, s.y*ctx.canvas.height);
        ctx.strokeStyle = "#e2ce80"
        ctx.stroke();
        ctx.closePath();
      })

      // DRAW STAR
      ctx.beginPath();
      ctx.globalAlpha = item.alpha

      deviationX = 0.5 - item.x;
      deviationY = 0.5 - item.y;

      ctx.arc(item.x*ctx.canvas.width, item.y*ctx.canvas.height, item.r, 0, 2 * Math.PI);
      ctx.fillStyle = item.colour;
      ctx.fill();

      item.alpha += 0.01

      ctx.globalAlpha = 1
      ctx.closePath();

      if (stars.length >= 5) {
        // CHANGE VALUES
        deviationX = 0.5 - item.x;
        deviationY = 0.5 - item.y;

        SPEEDFACTOR = 10

        deviationX /= (10000/SPEEDFACTOR);
        deviationY /= (10000/SPEEDFACTOR);

        item.x += deviationX;
        item.y += deviationY;
        item.r *= 0.999
        item.z += 0.0001 // effective change in z to prevent connections
      }
      

    })

    circles.forEach(function(item, index, arr) {
      // DRAW locator
      ctx.beginPath();
      ctx.globalAlpha =  0.5

      ctx.arc(0.5*ctx.canvas.width, 0.5*ctx.canvas.height, item.r*canvas.height, 0, 2 * Math.PI);

      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();

      item.r *= 0.999

      ctx.globalAlpha = 1
      ctx.closePath();  
    })
  
  }

  setInterval(draw, 10);
  // drawer

  setInterval(randomStar, 500);
  // star generator

  

  //setInterval(locator, 6000)

  document.addEventListener("click", printMousePos); // add event

  