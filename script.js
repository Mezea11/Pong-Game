import { createObstacle } from "./obstaclesModule.js";

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

//let laser;
let laserArray = [];

let obstacleStaticArray = [];
let obstacleArrayArray = [];
let obstacleTwoArray = [];
let powerUpArray = [];

let onHitArray = [];

let lastTime = Date.now();
let deltaTime;
let isPaused = false;

let score = 0;
let lvlcount = 1;
// Create the paddles
const paddleWidth = 10, paddleHeight = 60;
const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 10,
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
  speed: 5,
  hit: true,
};

// Create the ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speedX: 5,
  speedY: 5
};

getRandomNumber();

// generate random number
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// levels & powerups 

function getLevel() {
  if (score <= 200) {
    lvlcount = 2;
    rightPaddle.speed = 0.2;

    if (score === 200 && powerUpArray.length == 0) {
      let powerUpX = getRandomNumber(100, 500);
      let powerUpY = getRandomNumber(20, 280);
      let makepowerUp = (x, y) => ({
        x: x,
        y: y,
        width: 20,
        height: 20,
        status: 1,
        speed: 0,
      })

      powerUpArray.push(makepowerUp(powerUpX, powerUpY));
    }
  }
  }

if (score >= 400) {
  lvlcount = 3;
  rightPaddle.speed = 0.2;

  if (powerUpArray.length >= 0 && powerUpArray.length <= 0) {
    let powerUpX = getRandomNumber(100, 500);
    let powerUpY = getRandomNumber(20, 280);
    let makepowerUp = (x, y) => ({
      x: x,
      y: y,
      width: 20,
      height: 20,
      status: 1,
      speed: 2,
    })

    powerUpArray.push(makepowerUp(powerUpX, powerUpY));

    powerUpX = getRandomNumber(100, 500);

    powerUpY = getRandomNumber(20, 280);

    powerUpArray.push(makepowerUp(powerUpX, powerUpY));
  }
}

// skapa onHit effekt när boll träffar paddel
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

  if (event.key === 'p') {
    isPaused = !isPaused;
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
  if (ball.x >= 400 && rightPaddle.hit) {
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



  //draw powerup 

  for (let i = 0; i < powerUpArray.length; i++) {
    let powerUp = powerUpArray[i];
    if (powerUp.status === 1) {
      ctx.fillStyle = 'purple';
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    }
  }

  for (let i = 0; i < obstacleStaticArray.length; i++) {
    let obstacle = obstacleStaticArray[i];
    if (obstacle.status === 1) {
      ctx.fillStyle = 'pink';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }
  // draw obstactle
  for (let j = 0; j < obstacleArrayArray.length; j++) {
    let obstacleArray = obstacleArrayArray[j];
    for (let i = 0; i < obstacleArray.length; i++) {
      let obstacle = obstacleArray[i];
      if (obstacle.status === 1) {
        ctx.fillStyle = 'pink';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
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
  if (!isPaused) {
    for (let i = 0; i < laserArray.length; i++) {
      let laser = laserArray[i];
      laser.x += laser.speed;
      ctx.fillStyle = "orange";
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    }
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
  ctx.fillText(score, 5, 20);
}

// Update function to handle game logic
function update() {
  //  let now = Date.now();
  //  deltaTime = (now - lastTime) -1000;
  //  lastTime = now;

  // Move the ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  // reset leftPaddle.hit
  if (ball.x > 210) {
    leftPaddle.hit = true;
  }
  // initiera movement hinder 
  for (let i = 0; i < obstacleArrayArray.length; i++) {
    let obstacleArray = obstacleArrayArray[i];
    for (let j = 0; j < obstacleArray.length; j++) {
      let obstacle = obstacleArray[j];
      obstacle.y += obstacle.speed;
    }
  }
  // movement hinder when bounce
  for (let i = 0; i < obstacleArrayArray.length; i++) {
    let obstacleArray = obstacleArrayArray[i];
    for (let j = 0; j < obstacleArray.length; j++) {
      let obstacle = obstacleArray[j];
      // hinder bounce off top and bottom edges
      if (obstacle.y < 0 || obstacle.y + obstacle.height > canvas.height) {
        for (let l = 0; l < obstacleArray.length; l++) {
          let newObject = obstacleArray[l];
          newObject.speed = -newObject.speed;
        } break;
      }
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

  //pickup powerup with ball 
  for (let i = 0; i < powerUpArray.length; i++) {
    let powerUp = powerUpArray[i];
    if (
      (ball.x + ball.radius > powerUp.x &&
        ball.x - ball.radius < powerUp.x + powerUp.width &&
        ball.y > powerUp.y &&
        ball.y < powerUp.y + powerUp.height)
    ) {

      // ball.speedX = -ball.speedX; 
      // rightPaddle.hit = true; 
      rightPaddle.height = rightPaddle.height / 2;
      powerUp.status = 0;
      powerUpArray.splice(i, 1);
      i--;
    }
  }
  // ball and static obstacle collision
  for (let i = 0; i < obstacleStaticArray.length; i++) {
    let obstacle = obstacleStaticArray[i];
    if (
      (ball.x + ball.radius > obstacle.x + 5 &&
        ball.x - ball.radius < obstacle.x + obstacle.width + 5 &&
        ball.y > obstacle.y + 5 &&
        ball.y < obstacle.y + obstacle.height + 5)
    ) {
      ball.speedX = -ball.speedX;
      rightPaddle.hit = true;
      obstacle.status = 0;
      //      obstacleStaticArray.splice(i, 1);
      obstacleStaticArray = [];
      i--;
      obstacleBall.play();
    }
  }
  // ball and obstacle collision
  for (let j = 0; j < obstacleArrayArray.length; j++) {
    let obstacleArray = obstacleArrayArray[j];
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
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    // Reset ball position
    score += 100;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
}

// skapar laser-skott
function shoot() {
  let laser = {
    x: leftPaddle.x / 2,
    y: leftPaddle.y + leftPaddle.height / 2,
    width: 20,
    height: 20,
    speed: 12,
  };
  laserArray.push(laser);
}

// Game loop 

function gameLoop() {
  draw();
  //if game is paused skip these lines 

  if (isPaused == false) {
    moveLeftPaddle();
    moveRightpaddle();
    createObstacle(score, obstacleStaticArray, obstacleArrayArray, obstacleTwoArray);
    getLevel();
    update();
  }
  requestAnimationFrame(gameLoop);
}
// Start the game loop 
gameLoop();


// Game loop
/*
  function gameLoop() {
    moveLeftPaddle();
    moveRightpaddle();
    createObstacle();
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();*/