import { startGame } from './script.js';

randomNumber();



// generate random number
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function lives (livesArray) {
  let liveX = 5;
  let live = (x) => ({
    x: x,
    y: 40,
    width: 4,
    height: 15 
  });
  livesArray.push(live(liveX));
  livesArray.push(live(liveX + 5));
  livesArray.push(live(liveX + 10));
  livesArray.push(live(liveX + 15));
  livesArray.push(live(liveX + 20));
  //console.log(livesArray);
}
// levels & powerups
export function getLevel(score, lvlcount, rightPaddle, powerUpArray) {
    if (score == 200) {
      lvlcount = 2;
    //  rightPaddle.speed = 0.2;
  
      if (score === 200 && powerUpArray.length == 0) {
        let powerUpX = randomNumber(100, 500);
        let powerUpY = randomNumber(20, 280);
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
    if (score >= 400) {
//      lvlcount = 3;
//      rightPaddle.speed = 7;
      if (powerUpArray.length >= 0 && powerUpArray.length <= 0) {
        let powerUpX = randomNumber(100, 500);
        let powerUpY = randomNumber(20, 280);
        let makepowerUp = (x, y) => ({
          x: x,
          y: y,
          width: 20,
          height: 20,
          status: 1,
          speed: 2,
        })
        powerUpArray.push(makepowerUp(powerUpX, powerUpY));
        powerUpX = randomNumber(100, 500);
        powerUpY = randomNumber(20, 280);
        powerUpArray.push(makepowerUp(powerUpX, powerUpY));
      }
    }
    }
// skapa hinder
export function createObstacle(score, obstacleStaticArray, obstacleArrayArray, obstacleTwoArray) {
  let obstacleArray = [];
  if (score === 200 && obstacleStaticArray.length <= 0) {
    let obstacleX = randomNumber(100, 300);
    let obstacleY = 50;

    let makeObstacle = (x, y, width, height) => ({
      x: x,
      y: y,
      width: width,
      height: height,
      status: 1,
      speed: 0,
    });

    const patternConfig = [
      { width: 3, height: 3, count: 1 },
      { width: 3, height: 3, count: 3 },
      { width: 3, height: 3, count: 5 },
      { width: 3, height: 3, count: 7 },
      { width: 3, height: 3, count: 9 },
      { width: 3, height: 3, count: 11 },
      { width: 3, height: 3, count: 9 },
      { width: 3, height: 3, count: 7 },
      { width: 3, height: 3, count: 5 },
      { width: 3, height: 3, count: 3 },
      { width: 3, height: 3, count: 1 },
    ];

    for (const config of patternConfig) {
      for (let i = 0; i < config.count; i++) {
        obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY, config.width, config.height));
        obstacleX += config.width;
      }
      obstacleX -= (config.count + 1) * config.width;
      obstacleY += config.height;
    }

    // Print the result
    console.log(obstacleStaticArray);
    makeObstacle = (x, y) => ({
      x: x,
      y: y,
      width: 3,
      height: 3,
      status: 1,
      speed: 0,
    });

    console.log(obstacleStaticArray);
    for (let i = 0; i < 1; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX -= 3;
      obstacleY += 3;
    }
    for (let i = 0; i < 3; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 12;
    obstacleY += 3;
    for (let i = 0; i < 5; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 18;
    obstacleY += 3;
    for (let i = 0; i < 7; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 24;
    obstacleY += 3;
    for (let i = 0; i < 9; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 30;
    obstacleY += 3;
    for (let i = 0; i < 11; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 30;
    obstacleY += 3;
    for (let i = 0; i < 9; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 24;
    obstacleY += 3;
    for (let i = 0; i < 7; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 18;
    obstacleY += 3;
    for (let i = 0; i < 5; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 12;
    obstacleY += 3;
    for (let i = 0; i < 3; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
    obstacleX -= 6;
    obstacleY += 3;
    for (let i = 0; i < 1; i++) {
      obstacleStaticArray.push(makeObstacle(obstacleX, obstacleY));
      obstacleX += 3;
    }
  }

  if (score === 400 && obstacleArrayArray.length <= 0) {
    let obstacleX = randomNumber(100, 200);
    let obstacleY = obstacleX;
    // hinder bestående av 9 mindre block
    let makeObstacle = (x, y) => ({
      x: x,
      y: y,
      width: 10,
      height: 10,
      status: 1,
      speed: 3
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
    obstacleArrayArray.push(obstacleArray);
  } //lägg arrayen i  en array och kolla för den i loopen
  if (score === 500 && obstacleTwoArray.length <= 0) {
    let obstacleX = randomNumber(100, 200);
    let obstacleY = obstacleX;
    // hinder bestående av 9 mindre block
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