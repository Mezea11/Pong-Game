// Get the canvas element and its context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

//console.log(canvas.width);
//console.log(canvas.height);

// Create the paddles
const paddleWidth = 10, paddleHeight = 60;
const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 10,
  keys: {
    up: false,
    down: false,
  }
};

const rightPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 3,
  hit: true,
};

// Create the ball
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speedX: 5, speedY: 5 };

let laser;
let laserArray = [];

// Event listeners för att hantera spelarens rörelse.
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    leftPaddle.keys.up = true;
  } else if (event.key === "ArrowDown") {
    leftPaddle.keys.down = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    leftPaddle.keys.up = false;
  }

  if (event.key === "ArrowDown") {
    leftPaddle.keys.down = false;
  }

  if (event.key === ' ') {
    shoot(); 
   }
});

function moveLeftPaddle() {
  if (leftPaddle.keys.up && leftPaddle.y > 0) {
    leftPaddle.y -= leftPaddle.speed; //leftPaddle.speed * game.deltaTime;
  } else if (leftPaddle.keys.down && leftPaddle.y + leftPaddle.height < canvas.height) {
    leftPaddle.y += leftPaddle.speed; //leftPaddle.speed * game.deltaTime;
  }
}

//move function for right side (computer controlled) paddle
function moveRightpaddle() {
  //resets variable so paddle can move again
  if (ball.x < 100) {
    rightPaddle.hit = true;
  }
  //paddle can't move before ball is on right side of screen
  if (ball.x >= 150 && rightPaddle.hit) {
    if (ball.y > rightPaddle.y + rightPaddle.height / 2) {
      rightPaddle.y += rightPaddle.speed;
    } else if (ball.y < rightPaddle.y + rightPaddle.height / 2) {
      rightPaddle.y -= rightPaddle.speed;
    }
  }
}

// Draw function to render the paddles and ball
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  // draw laser
  for (let i = 0; i < laserArray.length; i++) {
    let laser = laserArray[i];
    laser.x += laser.speed;
    ctx.fillStyle = "white";
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  }
}

// Update function to handle game logic
function update() {
  // Move the ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Bounce off the top and bottom edges
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedY = -ball.speedY;
  }

  // Bounce off paddles
  if (
    (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) ||
    (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height)
  ) {
    ball.speedX = -ball.speedX;
    //makes paddle stop moving after ball hits paddle
    rightPaddle.hit = false;
  } 

  for (let i = 0; i < laserArray.length; i++) {
    let laser = laserArray[i];
    if (
      laser.x < ball.x + ball.radius &&
      laser.x + laser.width > ball.x &&
      laser.y < ball.y + ball.radius &&
      laser.y + laser.height > ball.y
    ) {
      ball.speedX = -ball.speedX;
    }
  }
  
  // Check for scoring
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    // Reset ball position
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
}

function shoot() {
  let laser = {
    x: leftPaddle.x / 2,
    y: leftPaddle.y + leftPaddle.height / 2,
    width: 20,
    height: 20,
    speed: 8,
//    used: false,
  };
  laserArray.push(laser);
}

// Game loop
function gameLoop() { 
  moveLeftPaddle();
  moveRightpaddle();
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();