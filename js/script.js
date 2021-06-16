var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
var length = canvas.width;
var height = canvas.height;
var radius = length * 0.02;
var x = length / 2;
var paddleh = 8;
var y = height - radius - paddleh;
var paddlel = length * 0.2;
var paddlex = (length - paddlel) / 2;
var x2 = paddlex + paddlel;
var dpx = length * 0.02;
var moveleft = false;
var moveright = false;
var dx = length * 0.02;
var dy = height * 0.02;
var nrow = 4;
var ncolumn = 5;
var brickwidth = length * 0.14;
var brickheight = height * 0.07;
var leftoffset = length * 0.014;
var topoffset = height * 0.014;
var padding = length * 0.06;

document.addEventListener("keyup", keynotpressed, false);
document.addEventListener("keydown", keypressed, false);
document.addEventListener("mousemove", mousemovehandler, false);

function keynotpressed(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    moveright = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    moveleft = false;
  }
}
function keypressed(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    moveright = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    moveleft = true;
  }
}
function mousemovehandler(e) {
  var mousepos = e.clientX / screen.width;
  var canvaspos = canvas.width / screen.width;

  var gap = (e.clientX - canvas.offsetLeft) / screen.width;
  var mousrelcanvas = gap / 0.9;

  var mouseX = mousrelcanvas * length;

  if (mouseX > 0.09 * length && mouseX < 0.91 * length) {
    paddlex = mouseX - paddlel / 2;
  }
}
var arb = [];
for (let c = 0; c < ncolumn; c++) {
  arb[c] = [];
  for (let r = 0; r < nrow; r++) {
    arb[c][r] = { x: 0, y: 0, status: "active" };
  }
}
function collison() {
  for (let c = 0; c < ncolumn; c++) {
    for (let r = 0; r < nrow; r++) {
      let b = arb[c][r];

      if (x >= b.x - radius && x <= b.x + brickwidth + radius) {
        if (y >= b.y - radius && y <= b.y + brickheight + radius) {
          dy = -dy;
          b.x = 0;
          b.y = 0;
          b.status = "dead";
        }
      }
    }
  }
}
function drawbricks() {
  for (let c = 0; c < ncolumn; c++) {
    for (let r = 0; r < nrow; r++) {
      if (arb[c][r].status == "active") {
        var startx = c * (brickwidth + padding) + leftoffset;
        var starty = r * (brickheight + padding) + topoffset;
        arb[c][r].x = startx;
        arb[c][r].y = starty;
        ctx.beginPath();
        ctx.rect(startx, starty, brickwidth, brickheight);
        ctx.fillStyle = "#ed2800";
        ctx.fill();
      }
      // else if(arb[c][r].status == "dead"){
      //   console.log(l);
      //   l++;
      // }
    }
  }
}
function drawpaddle() {
  ctx.beginPath();
  ctx.rect(paddlex, height - paddleh, paddlel, paddleh);
  ctx.fillStyle = "#017a8a";
  ctx.fill();
  ctx.closePath();
}

function drawball() {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#502670";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, length, height);
  drawball();
  drawpaddle();
  collison();
  drawbricks();

  if (y + dy < radius) {
    dy = -dy;
  } else if (y + dy > height - radius - paddleh) {
    if (x >= paddlex - radius && x <= paddlex + paddlel + radius) {
      dy = -dy;
    } else if (
      y + dy >= height - radius - paddleh &&
      y + dy <= height - radius
    ) {
      dy = dy;
    } else if (y > height - radius) {
      alert("Game Over !!");
      document.location.reload();
      clearInterval(main);
    } else {
      //   console.log("something is wrong");
    }
  }
  if (x + dx > length - radius || x + dx < radius) {
    dx = -dx;
  }
  x += dx;
  y += dy;
  if (moveleft == true) {
    if (paddlex > 0) {
      paddlex -= dpx;
    }
  }
  if (moveright == true) {
    if (paddlex < length - paddlel) {
      paddlex += dpx;
    }
  }
  let x4 = checkstatus();
  if (x4 == 20) {
    alert("You Won!!");
    document.location.reload();
    clearInterval(main);
  }
}
var main = begin();
function checkstatus() {
  let dead = 0;
  let alive = 0;
  for (let c = 0; c < ncolumn; c++) {
    for (let r = 0; r < nrow; r++) {
      let status = arb[c][r].status;
      if (status == "active") {
        alive++;
      } else if (status == "dead") {
        dead++;
      }
    }
  }
  return dead;
}

function begin(){
  let c = confirm("Should we start?");
  if(c==true){
    return setInterval(draw, 40);
  }
  else{
    return window.close();
  }
}
