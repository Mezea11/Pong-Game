// Get the canvas element and its context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 300;

// audio
let paddleBall = new Audio('Assets/click.wav');
paddleBall.volume = 0.2;
let laserSound = new Audio('Assets/laser2.wav');
laserSound.volume = 0.1;
let laserBall = new Audio('Assets/laser.wav');
laserBall.volume = 0.05;
let obstacleBall = new Audio('Assets/click2.wav');
obstacleBall.volume = 0.1;

let laser;
let laserArray = [];

let obstacleArray = [];

let score = 0;

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
  speed: 5,
  hit: true,
};

// Create the ball
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speedX: 5, speedY: 5 };

// generate random number
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// skapa hinder
function CreateObstacle() {
  if (score === 200 && obstacleArray.length == 0) {
    let obstacleX = getRandomNumber(100, 200);
    let obstacleY = obstacleX;

      let makeObstacle = (x, y) => ({
        x: x,
        y: y,
        width: 20,
        height: 20,
        status: 1,
      });

      obstacleArray.push(makeObstacle (obstacleX, obstacleY));
      obstacleArray.push(makeObstacle (obstacleX + 20, obstacleY));
      obstacleArray.push(makeObstacle (obstacleX, obstacleY + 20));
      obstacleArray.push(makeObstacle (obstacleX + 20, obstacleY + 20));
    }
  }

// Event listeners för att hantera spelarens rörelse + laser
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
    // audio will trigger everytime you push space by resetting audio
    laserSound.currentTime = 0;
    laserSound.play();
   }
});

// move function for left side (player controlled)
function moveLeftPaddle() {
  if (leftPaddle.keys.up && leftPaddle.y > 0) {
    leftPaddle.y -= leftPaddle.speed;
  } else if (leftPaddle.keys.down && leftPaddle.y + leftPaddle.height < canvas.height) {
    leftPaddle.y += leftPaddle.speed;
  }
}

// move function for right side (computer controlled) paddle
function moveRightpaddle() {
  // resets variable so paddle can move again
  if (ball.x < 100) {
    rightPaddle.hit = true;
  }
  // paddle can't move before ball is on right side of screen
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
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();

  // draw obsactle
  for (i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    if (obstacle.status === 1) {
    ctx.fillStyle = 'grey';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }

  // draw laser
  for (let i = 0; i < laserArray.length; i++) {
    let laser = laserArray[i];
    laser.x += laser.speed;
    ctx.fillStyle = "orange";
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  }

  ctx.fillStyle = "white";
  ctx.font = "16px courier";
  ctx.fillText(score, 5, 20);
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
    paddleBall.play();
    // right paddle stop moving after ball hits paddle
    rightPaddle.hit = false;
  } 
  // make right paddle move if ball leaves canvas
  if (ball.x + ball.radius > canvas.width) {
    rightPaddle.hit = true;
  }
  // ball and object collision
  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
      if (
        (ball.x + ball.radius > obstacle.x && 
        ball.x - ball.radius < obstacle.x + obstacle.width &&
        ball.y > obstacle.y &&
        ball.y < obstacle.y + obstacle.height) 
      ) {
        ball.speedX = -ball.speedX;
        rightPaddle.hit = true;
        obstacle.status = 0;
        obstacleArray.splice(i, 1);
        i--;
        obstacleBall.play();
    }
  }
  // check for and handle collision between laser and ball, and handle laserArray when laser leaves canvas
  for (let i = 0; i < laserArray.length; i++) {
    let laser = laserArray[i];
    // check for collision
    if (
      laser.x < ball.x + ball.radius &&
      laser.x + laser.width > ball.x &&
      laser.y < ball.y + ball.radius &&
      laser.y + laser.height > ball.y
    ) {
      // change direction and remove laser from array
      ball.speedX = -ball.speedX;
      laserArray.splice(i, 1);
      i--;
      laserBall.play();
    }
    // remove laser from array when leaving canvas
    if (laser.x - laser.width > canvas.width) {
      laserArray.splice(i, 1);
    }
  }
  
  // Check for scoring
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    // Reset ball position
    score += 100;
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
    speed: 12,
//    used: false,
  };
  laserArray.push(laser); 
}

// Game loop
function gameLoop() { 
  moveLeftPaddle();
  moveRightpaddle();
  CreateObstacle(); 
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();