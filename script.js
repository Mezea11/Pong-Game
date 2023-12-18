import { getLevel, spawnTimer, createObject } from "./objectModule.js";

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
let objectBall = new Audio("Assets/click2.wav");
objectBall.volume = 0.1;
let ufoMove = new Audio ("Assets/ufoMove.wav");
ufoMove.volume = 0.5;
let powerUpSound = new Audio("Assets/powerup.wav");
powerUpSound.volume = 0.05;
let gameOverSound = new Audio("Assets/gameoverSound.wav");
gameOverSound.volume = 0.5;
let gameStartSound = new Audio("Assets/gameStartSound.wav");
gameStartSound.volume = 0.4;
let looseLifeSound = new Audio ("Assets/looseLife.wav");
looseLifeSound.volume = 0.4;
let objectSpawnSound1 = new Audio ('Assets/spawnSound1.wav');
objectSpawnSound1.volume = 0.3;
let objectSpawnSound2 = new Audio ('Assets/spawnSound2.wav');
objectSpawnSound2.volume = 0.3;
let objectSpawnSound3 = new Audio ('Assets/spawnSound3.wav');
objectSpawnSound3.volume = 0.3;
// delcare arrays
let laserArray = [];
let planetArray = [];
let ufoArrayArray = [];
let powerUpArray = [];
let lifeArray = [];
let onHitArray = [];
let shotsArray = [];

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

let gameOver = false;
let deltaTime = 0;
let lastTime = 0;

let isPaused = false;

let score = 0;
let lvlcount = 1;

let leftLives = 4;
let rightLives = 4;

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

function initArrays() {
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
  }
    
//////////////////////////////////////////////////////////////////////////////////////////
// MENU FUNCTION
let gameStarted = false;

document.getElementById("start-btn").addEventListener("mousedown", startGame);

function togglePause() {
  isPaused = !isPaused;
  if (!isPaused) {
    return;
  }
}
function chooseDifficulty(difficulty) {
      if (difficulty === 'easy') {
        // Set up the game for easy difficulty
        lvlcount = 1;
        ball.speedX = 150;
        leftPaddle.height = 80;
        
      } else if (difficulty === 'medium') {
        // Set up the game for medium difficulty
        lvlcount = 2;
        ball.speedX = 200;
        leftPaddle.height = 60;
  
      } else if (difficulty === 'hard') {
        // Set up the game for hard difficulty
        lvlcount = 3;
        ball.speedX = 400;
        leftPaddle.height = 60;
      }
}

function startGame() {
  if (!localStorage.getItem('highscore')) {
    console.log('hello world');
    localStorage.setItem('highscore', JSON.stringify([]));
  }
  if (!gameStarted) {
    gameStarted = true;
    gameOver = false;
    score = 0;
    isPaused = false;
    gameStartSound.play();
    // Start the game loop
    lastTime = Date.now();
    onHitArray = [];
    laserArray = [];
    shotsArray = [];
    lifeArray = [];
    ufoArrayArray = [];
    initArrays();
//    highscoreInput.style.visibility = 'hidden';
    highscoreForm.style.visibility = 'hidden';
    spawnTimer();
    gameLoop();
  } else {
    // Toggle the game pause state
    togglePause();
  }
}

function resetGame() {
  gameOver = false;
  gameStarted = false;
  score = 0;
  lvlcount = 1;
  leftLives = 4;
  rightLives = 4;

  // Reset paddles, ball, and other relevant objects
  leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
  rightPaddle.y = canvas.height / 2 - paddleHeight / 2;

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = 200;
  ball.speedY = 200;

  // Reset arrays
  laserArray = [];
  shotsArray = [];
  planetArray = [];
  ufoArrayArray = [];
  powerUpArray = [];
  lifeArray = [];
  initArrays();
  
  // Reset other game-related settings
  isPaused = true;

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
  let newSpeedX = 120;
  let newSpeedY = 120;
  let onHit = (speedX, speedY) => ({
    x: ball.x,
    y: ball.y,
    width: 5,
    height: 5,
    speedX: speedX,
    speedY: speedY,
    lifeSpan: 0
  });
  onHitArray.push(onHit(newSpeedX, newSpeedY));
  onHitArray.push(onHit(newSpeedX, newSpeedY - 30));
  onHitArray.push(onHit(newSpeedX - 30, newSpeedY + 30));
  onHitArray.push(onHit(newSpeedX, newSpeedY));
  onHitArray.push(onHit(newSpeedX, newSpeedY - 30));
  onHitArray.push(onHit(newSpeedX - 30, newSpeedY + 30));
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
    if (isPaused) {
      return;
    } else if (!isPaused) {
    if (shotsArray.length > 0) {
    shoot();
    // audio will trigger everytime you push space by resetting audio
    laserSound.currentTime = 0;
    laserSound.play();
    shotsArray.pop();
    }
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

  // draw planet
  for (let i = 0; i < planetArray.length; i++) {
    let object = planetArray[i];
    if (!object.hit) {
      ctx.drawImage(planet1Img, object.x, object.y, object.width, object.height)
    } else if (object.hit) {
      ctx.drawImage(planet2Img, object.x, object.y, object.width, object.height)
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

  // draw laser
  if (!isPaused) {
    for (let i = 0; i < laserArray.length; i++) {
      let laser = laserArray[i];
      laser.x += laser.speed * deltaTime;
      ctx.fillStyle = "orange";
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    }
  }
  // draw collisionEffect
  for (let i = 0; i < onHitArray.length; i++) {
    let onHit = onHitArray[i];
    ctx.fillStyle = "white";
    ctx.fillRect(onHit.x, onHit.y, onHit.width, onHit.height);
    onHit.lifeSpan += deltaTime;
    if (onHit.lifeSpan >= 0.500) {
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
    let shots = shotsArray[i];
    ctx.fillStyle = 'red';
    ctx.fillRect(shots.x + i * 5, shots.y, shots.width, shots.height);
  }
}


let highscoreForm = document.createElement('form');
highscoreForm.setAttribute('id', 'highscoreForm');
document.body.append(highscoreForm);
let highscoreLabel = document.createElement('label');
highscoreLabel.innerHTML = "Enter name:";
highscoreLabel.setAttribute('id', 'highscoreLabel');
highscoreForm.append(highscoreLabel);
let highscoreInput = document.createElement('input');
highscoreInput.setAttribute('id', 'highscoreInput');
highscoreForm.append(highscoreInput);
highscoreForm.style.visibility = 'hidden';

if (localStorage.getItem('highscore') == null) {
  localStorage.setItem('highscore', JSON.stringify([]));
}

highscoreInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    let name = highscoreInput.value;
    let entry = {
      score: score,
      name: name
    } 
    addToLocalStorage(entry); 
    highscoreForm.style.visibility = 'hidden';
//    highscoreInput.style.visibility = 'hidden';
  }
})

let highscoreList = document.createElement('table');
highscoreList.setAttribute('id', 'highscoreList');
highscoreList.innerHTML = 'Highscore';
document.body.append(highscoreList);

let titleRow = document.createElement('tr');
titleRow.setAttribute('id', 'title');
highscoreList.append(titleRow);
let titleName = document.createElement('td');
titleName.innerHTML = 'Name';
let titleScore = document.createElement('td');
titleScore.innerHTML = 'Score';
titleRow.append(titleName);
titleRow.append(titleScore);


function addToLocalStorage(entry) {
    let array = JSON.parse(localStorage.getItem('highscore'));
    array.push(entry);
    array.sort(function(a, b) { 
      return b.score - a.score;
  })
    localStorage.setItem('highscore', JSON.stringify(array));
    highscoreInput.value ='';
    renderLocalStorage();
  }

function renderLocalStorage() {
  let temp = JSON.parse(localStorage.getItem('highscore'));
  highscoreList.innerHTML = 'Highscore'; // Clear the existing content
  highscoreList.append(titleRow); // Re-add the title row
  for (let i = 0; i <  Math.min(temp.length, 5); i++) {
    let item = temp[i];
    let row = document.createElement('tr');
    let name = document.createElement('td');
    name.innerHTML = item.name;
    let score = document.createElement('td');
    score.innerHTML = item.score;
    row.append(name, score);
    highscoreList.append(row);
  }
}

renderLocalStorage();

// Update function to handle game logic
function update() {
  if (gameOver) {
    let canvas = document.getElementById('pongCanvas');
    let context = canvas.getContext('2d');

    context.beginPath();
    context.rect(150, 45, 310, 200);
    context.fillStyle = 'gray';
    context.fill();
    context.lineWidth = 7;
    context.strokeStyle = 'whitesmoke';
    context.stroke();

    ctx.fillStyle = "Red";
    ctx.font = "bold 30px Helvetica";
    let gameOverText = "GAME OVER";
    let textWidth = ctx.measureText(gameOverText).width;
    let textX = (canvas.width - textWidth) / 2;
    let textY = canvas.height / 3;
    ctx.fillText(gameOverText, textX, textY);
    ctx.fillStyle = "blue";
    ctx.font = "bold 25px Helvetica";
    ctx.fillText("Score: " + score, textX + 25, textY + 50);
//    highscoreInput.style.visibility = 'visible';
    highscoreForm.style.visibility = 'visible';
    return;
  }
  // Move the ball
  ball.x += ball.speedX * deltaTime;
  ball.y += ball.speedY * deltaTime;
  // reset leftPaddle.hit
  if (ball.x > 300) {
    leftPaddle.hit = true;
  }
 
    // initiera movement ufo
    for (let i = 0; i < ufoArrayArray.length; i++) {
      let ufoArray = ufoArrayArray[i];
      for (let j = 0; j < ufoArray.length; j++) {
        let ufo = ufoArray[j];
        ufo.y += ufo.speed * deltaTime;
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
    
    if (shotsArray.length < 4) {
      let shots = {
        x: 25,
        y: 30,
        width: 4,
        height: 15
      };
      shotsArray.push(shots);
    }
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

  // direction for objects in collisionEffect
  for (let i = 0; i < onHitArray.length; i++) {
    let onHit = onHitArray[i];
    if (!leftPaddle.hit && i >= 3) {
      onHit.y += onHit.speedY * deltaTime;
      onHit.x += onHit.speedX * deltaTime;
    } else if (!leftPaddle.hit && i <= 2) {
      onHit.y -= onHit.speedY * deltaTime;
      onHit.x += onHit.speedX * deltaTime;
    }
    if (!rightPaddle.hit && i >= 3) {
      onHit.y += onHit.speedY * deltaTime;
      onHit.x -= onHit.speedX * deltaTime;
    } else if (!rightPaddle.hit && i <= 2) {
      onHit.y -= onHit.speedY * deltaTime;
      onHit.x -= onHit.speedX * deltaTime;
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
      powerUpSound.currentTime = 0; 
      powerUpSound.play();
    }
  }
  // ball and ufoArrayArray collision
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
        objectBall.play();
      }
      if (ufoArrayArray <= 0) {
        ufoMove.pause();
        ufoMove.currentTime = 0;
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
      objectBall.play();
    } else if (object.hit &&
      ball.x + ball.radius > object.x &&
      ball.x - ball.radius < object.x + object.width &&
      ball.y > object.y &&
      ball.y < object.y + object.height
    ) {
      ball.speedX = -ball.speedX;
      planetArray.splice(i, 1);
      objectBall.play();
    }
  }

  // laser and ball collision, laserArray when laser leaves canvas
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
    if (leftLives > 0) {
      looseLifeSound.currentTime = 0;
      looseLifeSound.play();  
    }
    if (leftLives == 0) {
      gameOver = true;
      gameOverSound.play();
    }
  }
}

// skapar laser-skott
function shoot() {
  let laser = {
    x: leftPaddle.x / 2,
    y: leftPaddle.y + leftPaddle.height / 2,
    width: 20,
    height: 20,
    speed: 720,
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

  if (!isPaused) {
    moveLeftPaddle();
    moveRightpaddle();
    createObject(score, lvlcount, planetArray, ufoArrayArray, objectSpawnSound1, objectSpawnSound3);
    getLevel(score, lvlcount, rightPaddle, powerUpArray, objectSpawnSound2);
    update();
  }

  requestAnimationFrame(gameLoop);
}

draw();

// EVENTLISTENERS

const difficultyButtons = document.querySelectorAll('.difficulty-btn');

function removeSelectedClass() {
  difficultyButtons.forEach(button => {
    button.classList.remove('selected');
  });
}

document.getElementById("instructions-btn").addEventListener("click", showInstructions);

document.getElementById("reset-btn").addEventListener("mousedown", function(){
  resetGame();
});

document.getElementById("easy-btn").addEventListener("mousedown", function() {
  removeSelectedClass();
  chooseDifficulty('easy');
  this.classList.add('selected');
});

document.getElementById("medium-btn").addEventListener("mousedown", function() {
  removeSelectedClass();
  chooseDifficulty('medium');
  this.classList.add('selected');
});

document.getElementById("hard-btn").addEventListener("mousedown", function() {
  removeSelectedClass();
  chooseDifficulty('hard');
  this.classList.add('selected');
});
