// Get the canvas element and its context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
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
let obstacleTwoArray = [];

let onHitArray = [];

let deltaTime;
let lastTime;

let isPaused = true;

let score = 0;
let score2 = 0;

// Create the paddles
const paddleWidth = 10, paddleHeight = 60;
const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 350,
  hit: true,
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
  speed: 350,
  hit: true,
  keys: {
    up: false,
    down: false,
  }
};

// Create the ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speedX: 200,
  speedY: 200
};

let gameStarted = false;

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    // Reset game state or perform any necessary initialization
    resetGame();
    // Start the game loop
    gameLoop();
  } else {
    // Toggle the game pause state
    isPaused = !isPaused;
    // If unpausing, resume the game loop
    if (!isPaused) {
      gameLoop();
    }
  }
}
getRandomNumber();

// generate random number
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// create obstacle
function CreateObstacle() {
  if (score === 2 && obstacleArray.length == 0) {
    let obstacleX = getRandomNumber(100, 300);
    let obstacleY = 50;
    // hinder bestående av 4 stora block
    let makeObstacle = (x, y) => ({
      x: x,
      y: y,
      width: 20,
      height: 20,
      status: 1,
      speed: 0,
    });
    obstacleArray.push(makeObstacle(obstacleX, obstacleY));
    obstacleArray.push(makeObstacle(obstacleX + 20, obstacleY));
    obstacleArray.push(makeObstacle(obstacleX, obstacleY + 20));
    obstacleArray.push(makeObstacle(obstacleX + 20, obstacleY + 20));
  }
  if (score === 4 && obstacleArray.length <= 4) {
    let obstacleX = getRandomNumber(100, 200);
    let obstacleY = obstacleX;
    // obstacle consistant of 9 smaller blocks
    let makeObstacle = (x, y) => ({
      x: x,
      y: y,
      width: 10,
      height: 10,
      status: 1,
      speed: 3,
    });
    obstacleArray.push(makeObstacle(obstacleX, obstacleY));
    obstacleArray.push(makeObstacle(obstacleX + 10, obstacleY));
    obstacleArray.push(makeObstacle(obstacleX, obstacleY + 10));
    obstacleArray.push(makeObstacle(obstacleX + 10, obstacleY + 10));
    obstacleArray.push(makeObstacle(obstacleX + 20, obstacleY));
    obstacleArray.push(makeObstacle(obstacleX, obstacleY + 20));
    obstacleArray.push(makeObstacle(obstacleX + 10, obstacleY + 20));
    obstacleArray.push(makeObstacle(obstacleX + 20, obstacleY + 10));
    obstacleArray.push(makeObstacle(obstacleX + 20, obstacleY + 20));
  }
  if (score === 6 && obstacleTwoArray.length <= 4) {
    let obstacleX = getRandomNumber(100, 200);
    let obstacleY = obstacleX;
    // obstacle consistant of 9 smaller blocks
    let makeObstacle = (x, y) => ({
      x: x,
      y: y,
      width: 10,
      height: 10,
      status: 1,
      speed: 3,
      hit: false,
    });
    obstacleTwoArray.push(makeObstacle(obstacleX, obstacleY));
    obstacleTwoArray.push(makeObstacle(obstacleX + 10, obstacleY));
    obstacleTwoArray.push(makeObstacle(obstacleX, obstacleY + 10));
    obstacleTwoArray.push(makeObstacle(obstacleX + 10, obstacleY + 10));
    obstacleTwoArray.push(makeObstacle(obstacleX + 20, obstacleY));
    obstacleTwoArray.push(makeObstacle(obstacleX, obstacleY + 20));
    obstacleTwoArray.push(makeObstacle(obstacleX + 10, obstacleY + 20));
    obstacleTwoArray.push(makeObstacle(obstacleX + 20, obstacleY + 10));
    obstacleTwoArray.push(makeObstacle(obstacleX + 20, obstacleY + 20));
  }
}
// crate onHit effect when ball hits a paddle
function collisionEffect() {
  let newSpeedX = 2;
  let newSpeedY = 2;

  let onHit = (speedX, speedY) => ({
    x: ball.x,
    y: ball.y,
    width: 5,
    height: 5,
    speedX: speedX,
    speedY: speedY
  });
  onHitArray.push(onHit(newSpeedX, newSpeedY));
  onHitArray.push(onHit(newSpeedX + 0.5, newSpeedY - 0.5));
  onHitArray.push(onHit(newSpeedX - 0.5, newSpeedY + 0.5));
  onHitArray.push(onHit(newSpeedX - 0.2, newSpeedY + 0.2));
}

// Event listeners for handling player movement
window.addEventListener("keydown", (event) => {
  if (event.code === "KeyW") {
    leftPaddle.keys.up = true;
  } else if (event.code === "KeyS") {
    leftPaddle.keys.down = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "KeyW") {
    leftPaddle.keys.up = false;
  }

  if (event.code === "KeyS") {
    leftPaddle.keys.down = false;
  }

  if (event.key === ' ') {
    shoot();
    // audio will trigger everytime you push space by resetting audio
    laserSound.currentTime = 0;
    laserSound.play();
  }

  if (event.key === 'p') {
    isPaused = !isPaused;
  }
});

// move function for left side (player controlled)
function moveLeftPaddle() {
  if (leftPaddle.keys.up && leftPaddle.y > 0) {
    leftPaddle.y -= leftPaddle.speed * deltaTime;;
  } else if (leftPaddle.keys.down && leftPaddle.y + leftPaddle.height < canvas.height) {
    leftPaddle.y += leftPaddle.speed * deltaTime;
  }
}

// Event listeners for handling player movement + laser
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    rightPaddle.keys.up = true;
  } else if (event.key === "ArrowDown") {
    rightPaddle.keys.down = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowUp") {
    rightPaddle.keys.up = false;
  }

  if (event.key === "ArrowDown") {
    rightPaddle.keys.down = false;
  }
});

// move function for right side (player controlled) paddle
function moveRightpaddle() {
  if (rightPaddle.keys.up && rightPaddle.y > 0) {
    rightPaddle.y -= rightPaddle.speed * deltaTime;
  } else if (rightPaddle.keys.down && rightPaddle.y + rightPaddle.height < canvas.height) {
    rightPaddle.y += rightPaddle.speed * deltaTime;
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

  // draw obstactle
  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    if (obstacle.status === 1) {
      ctx.fillStyle = 'pink';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }
  // draw obstacleTwo
  for (let i = 0; i < obstacleTwoArray.length; i++) {
    let obstacle = obstacleTwoArray[i];
    if (!obstacle.hit && obstacle.status === 1) {
      ctx.fillStyle = 'brown';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else if (obstacle.hit && obstacle.status === 1) {
      ctx.fillStyle = 'red';
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
  // draw collisionEffect
  for (let i = 0; i < onHitArray.length; i++) {
    let onHit = onHitArray[i];
    ctx.fillStyle = 'white';
    ctx.fillRect(onHit.x, onHit.y, onHit.width, onHit.height);
    //if (onHit.x > 50 && onHit.x < canvas.width - 50) {
    if (leftPaddle.hit && ball.x < 100 || rightPaddle.hit && ball.x > 200) {
      onHitArray.splice(i, 1);
    }
  }
  // draw score
  ctx.fillStyle = "white";
  ctx.font = "16px courier";
  ctx.fillText("player 1: " + score, 15, 20);

  ctx.fillStyle = "white";
  ctx.font = "16px courier";
  ctx.fillText("player 2: " + score2, 460, 20);
}

// Update function to handle game logic
function update() {
  // Move the ball
  ball.x += ball.speedX * deltaTime;
  ball.y += ball.speedY * deltaTime;

  // reset leftPaddle.hit
  if (ball.x > 210) {
    leftPaddle.hit = true;
  }

  // movement hinder
  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    obstacle.y += obstacle.speed;
    // hinder bounce off top and bottom edges    
    if (obstacle.y - obstacle.height < 0 || obstacle.y + obstacle.height > canvas.height) {
      obstacle.speed = -obstacle.speed;
    }
  }

  // Ball bounce off the top and bottom edges
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
    // right paddle stop moving after ball hits paddle + control onHit effect for right paddle
    rightPaddle.hit = false;
    //control onHit effect for left paddle
    leftPaddle.hit = false;
    // on paddle hit effect
    collisionEffect();
  }

  // direction for onHit effect
  for (let i = 0; i < onHitArray.length; i++) {
    let onHit = onHitArray[i];
    if (!leftPaddle.hit && i >= 2) {
      onHit.y += onHit.speedY;
      onHit.x += onHit.speedX;
    } else if (!leftPaddle.hit && i <= 1) {
      onHit.y -= onHit.speedY;
      onHit.x += onHit.speedX;
    } else if (!rightPaddle.hit && i >= 2) {
      onHit.y += onHit.speedY;
      onHit.x -= onHit.speedX;
    } else if (!rightPaddle.hit && i <= 1) {
      onHit.y -= onHit.speedY;
      onHit.x -= onHit.speedX;
    }
  }
  // make right paddle move if ball leaves canvas
  if (ball.x + ball.radius > canvas.width) {
    rightPaddle.hit = true;
  }
  // ball and obstacle collision
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
  // ball and obstacleTwo collision
  for (let i = 0; i < obstacleTwoArray.length; i++) {
    let obstacle = obstacleTwoArray[i];
    if (
      (!obstacle.hit && ball.x + ball.radius > obstacle.x &&
        ball.x - ball.radius < obstacle.x + obstacle.width &&
        ball.y > obstacle.y &&
        ball.y < obstacle.y + obstacle.height)
    ) {
      obstacle.hit = true;
      ball.speedX = -ball.speedX;
      rightPaddle.hit = true;
      obstacleBall.play();
    } else if (
      (obstacle.hit && ball.x + ball.radius > obstacle.x &&
        ball.x - ball.radius < obstacle.x + obstacle.width &&
        ball.y > obstacle.y &&
        ball.y < obstacle.y + obstacle.height)
    ) {
      ball.speedX = -ball.speedX;
      rightPaddle.hit = true;
      obstacle.status = 0;
      obstacleTwoArray.splice(i, 1);
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
  if (ball.x - ball.radius > canvas.width) {
    // Reset ball position
    score += 1;
    ball.x = canvas.width / 2;
    ball.y = getRandomNumber(8, 292);
  }

  if (ball.x + ball.radius  < 0) {
    score2 += 1;
    ball.x = canvas.width / 2;
    ball.y = getRandomNumber(8, 292);
  }
}

let instructionsDiv = document.getElementById("instructions");

function showInstructions() {
    if (instructionsDiv.style.display === "none") {
        instructionsDiv.style.display = "block";
    } else {
        instructionsDiv.style.display = "none";
    }
}

// Game loop
function gameLoop() {
  let now = Date.now();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  draw();
  //if game is paused skip these lines 

  if (isPaused == false) {
    moveLeftPaddle();
    moveRightpaddle();
    CreateObstacle();
    update();
  }
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

document.getElementById("instructions-btn").addEventListener("click", showInstructions);