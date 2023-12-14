import { getLevel, createObstacle } from "./obstaclesModule.js";

// export startgame function to other modules
export { startGame };

// Get the canvas element and its context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

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
let paddleBall = new Audio("Assets/click.wav");
paddleBall.volume = 0.2;
let laserSound = new Audio("Assets/laser2.wav");
laserSound.volume = 0.1;
let laserBall = new Audio("Assets/laser.wav");
laserBall.volume = 0.05;
let obstacleBall = new Audio("Assets/click2.wav");
obstacleBall.volume = 0.1;
let ufoMove = new Audio ("Assets/ufoMove.wav");
ufoMove.volume = 0.8;

// delcare arrays
let laserArray = [];
let obstacleArrayArray = [];
let obstacleTwoArray = [];
let planetArray = [];
let ufoArrayArray = [];
let powerUpArray = [];
let lifeArray = [];
let onHitArray = [];

//delcare images
let planet1Img = new Image();;
planet1Img.src = "Assets/RedPlanet.png";

let planet2Img = new Image();
planet2Img.src = "Assets/PurplePlanet.png"; 

let ufoGrey1Img = new Image();
ufoGrey1Img.src = "Assets/UfoGrey1.png"

let ufoGrey2Img = new Image();
ufoGrey2Img.src = "Assets/UfoGrey2.png"

let questionmarkImg = new Image();
questionmarkImg.src = "Assets/question-mark.png"

let deltaTime = 0;
let lastTime = 0;

let isPaused = false;

let score = 0;
let lvlcount = 1;

let leftLives = 5;
let rightLives = 5;

let life = {
  x: 5,
  y: 30,
  width: 4,
  height: 15 
};
lifeArray.push(life);
lifeArray.push(life);
lifeArray.push(life);
lifeArray.push(life);

let shotsArray = [];

let shots = {
  x: 25,
  y: 30,
  width: 4,
  height: 15 
};
shotsArray.push(shots);
shotsArray.push(shots);
shotsArray.push(shots);
shotsArray.push(shots);

// Create the paddles
const paddleWidth = 10,
      paddleHeight = 60;
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
  },
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

document.getElementById("start-btn").addEventListener("mousedown", startGame);
document.getElementById("start-btn").addEventListener("mouseup", function() {
  canvas.focus();
});

function togglePause() {
  isPaused = !isPaused;

  if (!isPaused) {
    return;
  }
}
function chooseDifficulty(difficulty) {
      // Customize the game based on the selected difficulty
      if (difficulty === 'easy') {
        // Set up the game for easy difficulty
        // For example, reduce the speed of the ball or increase paddle size
        ball.speedX = 150;
        leftPaddle.height = 80;
      } else if (difficulty === 'medium') {
        // Set up the game for medium difficulty
        // You can adjust various parameters here
        ball.speedX = 200;
        leftPaddle.height = 60;
      } else if (difficulty === 'hard') {
        // Set up the game for hard difficulty
        // You can make the game more challenging for hard difficulty
        ball.speedX = 250;
        leftPaddle.height = 40;
      }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;

    score = 400;

    // Start the game loop
    lastTime = Date.now();
    gameLoop();
  } else {
    // Toggle the game pause state
    togglePause();
  }
}

function resetGame() {
  // Reset all game-related variables to their initial values
  isPaused = true;
  score = 0;
  lvlcount = 1;
  leftLives = 5;
  rightLives = 5;

  // Reset paddles, ball, and other relevant objects
  leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
  rightPaddle.y = canvas.height / 2 - paddleHeight / 2;

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = 200;
  ball.speedY = 200;

  // Reset arrays
  laserArray = [];
  obstacleArrayArray = [];
  obstacleTwoArray = [];
  planetArray = [];
  ufoArrayArray = [];
  powerUpArray = [];
  lifeArray = [];
  onHitArray = [];

  // Reset other game-related settings
  isPaused = false;

  // Reset paddle heights if they were modified during gameplay
  leftPaddle.height = 60;
  rightPaddle.height = 60;

  // Reset other settings and configurations as needed

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the initial state of the game
  draw();
}

let instructionsDiv = document.getElementById("instructions");

function showInstructions() {
    if (instructionsDiv.style.display === "none") {
        instructionsDiv.style.display = "block";
    } else {
        instructionsDiv.style.display = "none";
    }
}


function startMultiplayer() {}
// Create the ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speedX: 200,
  speedY: 200,
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
    speedY: speedY,
  });
  onHitArray.push(onHit(newSpeedX, newSpeedY));
  onHitArray.push(onHit(newSpeedX, newSpeedY - 0.5));
  onHitArray.push(onHit(newSpeedX - 0.5, newSpeedY + 0.5));
  onHitArray.push(onHit(newSpeedX, newSpeedY));
  onHitArray.push(onHit(newSpeedX, newSpeedY - 0.5));
  onHitArray.push(onHit(newSpeedX - 0.5, newSpeedY + 0.5));
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

  if (event.key === " ") {
    if (shotsArray.length > 0) {
    shoot();
    // audio will trigger everytime you push space by resetting audio
    laserSound.currentTime = 0;
    laserSound.play();
    shotsArray.pop();
    }
  }

  if (event.key === "p") {
    togglePause();
  }
});

// move function for left side (player controlled)
function moveLeftPaddle(gameLoop) {
  if (leftPaddle.keys.up && leftPaddle.y > 0) {
    leftPaddle.y -= leftPaddle.speed * deltaTime;
  } else if (
    leftPaddle.keys.down &&
    leftPaddle.y + leftPaddle.height < canvas.height
  ) {
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
  ctx.fillStyle = "white";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();

  //draw powerup
  for (let i = 0; i < powerUpArray.length; i++) {
    let powerUp = powerUpArray[i];
    if (powerUp.status === 1) {
      //ctx.fillStyle = "purple";
      ctx.drawImage(questionmarkImg, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    }
  }

  // draw object
  for (let i = 0; i < planetArray.length; i++) {
    let object = planetArray[i];
    if (!object.hit) {
      ctx.drawImage(planet1Img, object.x, object.y, object.width, object.height)
    } else if (object.hit) {
      ctx.drawImage(planet2Img, object.x, object.y, object.width, object.height)
    }
  }

  // draw obstactle
  for (let j = 0; j < obstacleArrayArray.length; j++) {
    let obstacleArray = obstacleArrayArray[j];
    for (let i = 0; i < obstacleArray.length; i++) {
      let obstacle = obstacleArray[i];
      if (obstacle.status === 1) {
        ctx.fillStyle = "pink";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    }
  }
  // draw ufo
  for (let j = 0; j < ufoArrayArray.length; j++) {
    let ufoArray = ufoArrayArray[j];
    for (let i = 0; i < ufoArray.length; i++) {
      let ufo = ufoArray[i];
      if (ufo.status === 1) {
        ctx.drawImage(ufoGrey1Img, ufo.x, ufo.y, ufo.width, ufo.height);
      } else if (ufo.status === 0) {
        ctx.drawImage(ufoGrey2Img, ufo.x, ufo.y, ufo.width, ufo.height);
      }
    }
  }


  // draw obstacleTwo
  for (let i = 0; i < obstacleTwoArray.length; i++) {
    let obstacle = obstacleTwoArray[i];
    if (!obstacle.hit && obstacle.status === 1) {
      ctx.fillStyle = "brown";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else if (obstacle.hit && obstacle.status === 1) {
      ctx.fillStyle = "red";
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
    ctx.fillStyle = "white";
    ctx.fillRect(onHit.x, onHit.y, onHit.width, onHit.height);
    if (
      (!leftPaddle.hit && ball.x > 100) ||
      (!rightPaddle.hit && ball.x < canvas.width - 100)
    ) {
      onHitArray = [];
    }
  }
  // draw score
  ctx.fillStyle = "white";
  ctx.font = "16px courier";
  ctx.fillText(score, 5, 20);
  
  // draw lives
  for (let i = 0; i < lifeArray.length; i++) {
    let life = lifeArray[i];
    ctx.fillStyle = "white";
//    ctx.font = "16px courier";
    ctx.fillRect(life.x + i * 5, life.y, life.width, life.height);
  }

  // draw shots
  for (let i = 0; i < shotsArray.length; i++) {
    let shot = shotsArray[i];
    ctx.fillStyle = 'red';
//    ctx.font = "16px courier";
    ctx.fillRect(shot.x + i * 5, shot.y, shot.width, shot.height);
//    ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
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
  
  if (shotsArray > 4) {
  shotsArray.slice(0,4);
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
        }
        break;
      }
    }
  }
    // initiera movement ufo
    for (let i = 0; i < ufoArrayArray.length; i++) {
      let ufoArray = ufoArrayArray[i];
      for (let j = 0; j < ufoArray.length; j++) {
        let ufo = ufoArray[j];
        ufo.y += ufo.speed;
      }
    }  

    // movement ufo when bounce
    for (let i = 0; i < ufoArrayArray.length; i++) {
      let ufoArray = ufoArrayArray[i];
      for (let j = 0; j < ufoArray.length; j++) {
        let ufo = ufoArray[j];
        // ufo bounce off top and bottom edges
        if (ufo.y < 0 || ufo.y + ufo.height > canvas.height) {
          for (let l = 0; l < ufoArray.length; l++) {
            let newUfo = ufoArray[l];
            newUfo.speed = -newUfo.speed;
            if (newUfo.status === 1) {
            newUfo.status = 0;
            ufoMove.play();
            } else if (newUfo.status === 0) {
              newUfo.status = 1;
              ufoMove.pause();
              ufoMove.currentTime = 0;
            }
          }
          break;
        }
      }
    }

  // Ball bounce off the top and bottom edges
  if (ball.y - ball.radius < 0) {
    ball.y += ball.radius;
    ball.speedY = -ball.speedY;
  }
  if  (ball.y + ball.radius > canvas.height) {
    ball.y -= ball.radius;
    ball.speedY = -ball.speedY;
  }

  // Bounce off left paddle
  if (
    ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    ball.x = leftPaddle.width + ball.radius;
    ball.speedX = -ball.speedX;
    paddleBall.play();
    //control onHit effect for left paddle
    leftPaddle.hit = false;
    // on paddle hit effect
    collisionEffect();
    shotsArray.push(shots);
  }
  // bounce off right paddle
  if (
    ball.x + ball.radius > rightPaddle.x &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    ball.x = canvas.width - rightPaddle.width - ball.radius;
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
      ball.x + ball.radius > powerUp.x &&
      ball.x - ball.radius < powerUp.x + powerUp.width &&
      ball.y > powerUp.y &&
      ball.y < powerUp.y + powerUp.height
    ) {
      const temp = getRandomNumber(1, 3);
      if (temp == 1) {
        if (leftPaddle.height == 60) {
          leftPaddle.height = leftPaddle.height / 2;
        }else {
          leftPaddle.height = 60;
        }
      }
      if (temp == 2) {
        if (ball.speedX == 600 || ball.speedX == -600) {
          ball.speedX = 200;
        }
        if (ball.speedX < 0) {
          ball.speedX = ball.speedX -= 100;
        }else if (ball.speedX > 0) {
          ball.speedX = ball.speedX += 100;
        }
      }
      if (temp == 3) {
        if (rightPaddle.height == 60) {
          rightPaddle.height = rightPaddle.height / 2;
        }else {
          rightPaddle.height = 60;
        }      }
      powerUpArray.splice(i, 1);
      i--;
    }
  }
  // ball and obstacle collision
  for (let j = 0; j < obstacleArrayArray.length; j++) {
    let obstacleArray = obstacleArrayArray[j];
    for (let i = 0; i < obstacleArray.length; i++) {
      let obstacle = obstacleArray[i];
      if (
        ball.x + ball.radius > obstacle.x &&
        ball.x - ball.radius < obstacle.x + obstacle.width &&
        ball.y + ball.radius > obstacle.y &&
        ball.y - ball.radius < obstacle.y + obstacle.height
      ) {
        ball.x = obstacle.x + obstacle.width + ball.radius;
        ball.speedX = -ball.speedX;
        rightPaddle.hit = true;
        obstacle.status = 0;
        obstacleArray.splice(i, 1);
        i--;
        obstacleBall.play();
      }
    }
  }
  for (let j = 0; j < ufoArrayArray.length; j++) {
    let ufoArray = ufoArrayArray[j];
    for (let i = 0; i < ufoArray.length; i++) {
      let ufo = ufoArray[i];
      if (
        ball.x + ball.radius > ufo.x &&
        ball.x - ball.radius < ufo.x + ufo.width &&
        ball.y + ball.radius > ufo.y &&
        ball.y - ball.radius < ufo.y + ufo.height
      ) {
        ball.x = ufo.x + ufo.width + ball.radius;
        ball.speedX = -ball.speedX;
        rightPaddle.hit = true;
        ufo.status = 0;
        ufoArray.splice(i, 1);
        i--;
        obstacleBall.play();
      }
    }
  }
  //ball and planet collision
  for (let i = 0; i < planetArray.length; i++) {
    let object = planetArray[i];
    if (!object.hit &&
      ball.x + ball.radius > object.x &&
      ball.x - ball.radius < object.x + object.width &&
      ball.y > object.y &&
      ball.y < object.y + object.height
    ) {
      if (ball.x >= object.x + object.width / 2) {
        ball.x = object.x + object.width + ball.radius
      } else if (ball.x <= object.x + object.width / 2) {
        ball.x = object.x - ball.radius;
      }
      object.hit = true;
      ball.speedX = -ball.speedX;
      obstacleBall.play();
    } else if (object.hit &&
      ball.x + ball.radius > object.x &&
      ball.x - ball.radius < object.x + object.width &&
      ball.y > object.y &&
      ball.y < object.y + object.height
    ) {
      ball.speedX = -ball.speedX;
      planetArray.splice(i, 1);
      obstacleBall.play();
    }
  }
  // ball and obstacleTwo collision
  for (let i = 0; i < obstacleTwoArray.length; i++) {
    let obstacle = obstacleTwoArray[i];
    if (
      !obstacle.hit &&
      ball.x + ball.radius > obstacle.x &&
      ball.x - ball.radius < obstacle.x + obstacle.width &&
      ball.y + ball.radius > obstacle.y &&
      ball.y - ball.radius < obstacle.y + obstacle.height
    ) {
      obstacle.hit = true;
      ball.speedX = -ball.speedX;
      rightPaddle.hit = true;
      obstacleBall.play();
    } else if (
      obstacle.hit &&
      ball.x + ball.radius > obstacle.x &&
      ball.x - ball.radius < obstacle.x + obstacle.width &&
      ball.y > obstacle.y &&
      ball.y < obstacle.y + obstacle.height
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
    score += 100;
    ball.x = canvas.width / 2;
    ball.y = getRandomNumber(8, 292);
  }

  if (ball.x + ball.radius < 0) {
    score -= 100;
    leftLives -= 1;
    lifeArray.pop();
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
    createObstacle(
      score,
      obstacleArrayArray,
      obstacleTwoArray,
      planetArray,
      ufoArrayArray
    );
    getLevel(score, lvlcount, rightPaddle, powerUpArray);
    update();
  }

  requestAnimationFrame(gameLoop);
}

draw();


// EVENTLISTENERS
document.getElementById("instructions-btn").addEventListener("click", showInstructions);

document.getElementById("easy-btn").addEventListener("click", function() {
  chooseDifficulty('easy');
});

document.getElementById("medium-btn").addEventListener("click", function() {
  chooseDifficulty('medium');
});

document.getElementById("hard-btn").addEventListener("click", function() {
  chooseDifficulty('hard');
});

document.getElementById("reset-btn").addEventListener("click", function(){
  resetGame();
})