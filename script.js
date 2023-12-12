import { lives, getLevel, createObstacle } from "./obstaclesModule.js";

// export startgame function to other modules
export { startGame };

// Get the canvas element and its context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let startButton = document.getElementById('menu-btn');
startButton.addEventListener('click', startGame);


canvas.width = 600;
canvas.height = 300;

// menu
getRandomNumber();

// generate random number
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


/////////////////////////////////////////////////////////////////////////////////////////

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
let livesArray = [];
let onHitArray = [];

//let now = Date.now();
let deltaTime;
let lastTime;

let isPaused = true;

let score = 0;
let lvlcount = 1;

let leftLives = 5;
let rightLives = 5;

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
  speed: 200,
  hit: true,
};

//////////////////////////////////////////////////////////////////////////////////////////
// MENU FUNCTION
let gameStarted = false;

document.getElementById('menu-btn').addEventListener('click', startGame);

function togglePause() {
  isPaused = !isPaused;

  if (!isPaused) {
    return;
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    // Start the game loop
    gameLoop();
  } else {
       // Toggle the game pause state
       togglePause();
    }
  }



function showInstructions() {
  let x = document.getElementById("instructions");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function selectDifficulty() {
  difficultyDiv.style.display = 'block';
  instructionsDiv.style.display = 'none';
}

function startMultiplayer() {
  
}
// Create the ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speedX: 200,
  speedY: 200
};

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
  onHitArray.push(onHit(newSpeedX, newSpeedY - 0.5));
  onHitArray.push(onHit(newSpeedX -0.5, newSpeedY + 0.5));
  onHitArray.push(onHit(newSpeedX, newSpeedY));
  onHitArray.push(onHit(newSpeedX, newSpeedY - 0.5));
  onHitArray.push(onHit(newSpeedX -0.5, newSpeedY + 0.5));
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
    togglePause();
  }
});

// move function for left side (player controlled)
function moveLeftPaddle(gameLoop) {
  if (leftPaddle.keys.up && leftPaddle.y > 0) {
    leftPaddle.y -= leftPaddle.speed * deltaTime;
  } else if (leftPaddle.keys.down && leftPaddle.y + leftPaddle.height < canvas.height) {
    leftPaddle.y += leftPaddle.speed * deltaTime;
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
      rightPaddle.y += rightPaddle.speed * deltaTime;
    } else if (ball.y < rightPaddle.y + rightPaddle.height / 2) {
      rightPaddle.y -= rightPaddle.speed * deltaTime;
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
    if (!leftPaddle.hit && ball.x > 100 || !rightPaddle.hit && ball.x < canvas.width - 100) {
      onHitArray = [];
    }
  }
  // draw score
  ctx.fillStyle = "white";
  ctx.font = "16px courier";
  ctx.fillText(score, 5, 20);

  for (let i = 0; i < livesArray.length; i++) {
    let live = livesArray[i];
    ctx.fillStyle = "white";
    ctx.font = "16px courier";
    ctx.fillRect(live.x, live.y, live.width, live.height);
  }
}

// Update function to handle game logic
function update() {
  // Move the ball
  ball.x += ball.speedX * deltaTime;
  ball.y += ball.speedY * deltaTime;
  // reset leftPaddle.hit
  if (ball.x > 300) {
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
  // Bounce off left paddle
  if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
    ball.speedX = -ball.speedX;
    paddleBall.play();
    //control onHit effect for left paddle
    leftPaddle.hit = false;
    // on paddle hit effect
    collisionEffect();
    // bounce off rigght paddle
  } if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
    ball.speedX = -ball.speedX;
    paddleBall.play();
    // right paddle stop moving after ball hits paddle + control onHit effect for right paddle
    rightPaddle.hit = false;
    // on paddle hit effect
    collisionEffect();
  }
  // direction for onHit effect
  for (let i = 0; i < onHitArray.length; i++) {
    let onHit = onHitArray[i];
    if (!leftPaddle.hit && i >= 3) {
      onHit.y += onHit.speedY;
      onHit.x += onHit.speedX;
    } else if (!leftPaddle.hit && i <= 2) {
      onHit.y -= onHit.speedY;
      onHit.x += onHit.speedX;
    }
    if (!rightPaddle.hit && i >= 3) {
      onHit.y += onHit.speedY;
      onHit.x -= onHit.speedX;
    } else if (!rightPaddle.hit && i <= 2) {
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
      const temp = getRandomNumber(1, 3);
      if (temp == 1) {
        leftPaddle.height = leftPaddle.height -= 5;
        powerUp.status = 0;
      }
      if (temp == 2) {
        ball.speedX = ball.speedX += 50;
        ball.speedY = ball.speedY += 50;
      }
      if (temp == 3) {
        rightPaddle.height = rightPaddle.height -= 5;
      }
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
      obstacleBall.play();
      obstacleTwoArray.splice(i, 1);
      i--;
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
    console.log("hallo");
    score += 100;
    ball.x = canvas.width / 2;
    ball.y = getRandomNumber(8, 292);

  }

  if (ball.x + ball.radius  < 0) {
    score -= 100;
    rightLives -= 1;
    livesArray.shift();
    ball.x = canvas.width / 2;
    ball.y = getRandomNumber(8, 292);
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
  let now = Date.now();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  draw();
  //if game is paused skip these lines 

  if (isPaused == false) {
    moveLeftPaddle();
    moveRightpaddle();
    createObstacle(score, obstacleStaticArray, obstacleArrayArray, obstacleTwoArray);
    getLevel(score, lvlcount, rightPaddle, powerUpArray);
    lives(livesArray);
    update();
  }
  requestAnimationFrame(gameLoop);
}