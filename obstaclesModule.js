import { startGame } from './script.js';

randomNumber();


// generate random number
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
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
    lvlcount = 3;
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
export function createObstacle(score, obstacleArrayArray, obstacleTwoArray, planetArray, ufoArrayArray) {
  if (score == 200 && planetArray.length <= 0) {
    let objectX = randomNumber(100, 500);
    let objectY = randomNumber(50, 250);
    let object = (x, y) => ({
      x: x,
      y: y,
      width: 40,
      height: 40,
      hit: false
    })
    planetArray.push(object(objectX, objectY));
  }
  
  let ufoArray = [];
  if (score === 400 && ufoArrayArray.length <= 0) {
    let ufoX = randomNumber(100, 500);
    let ufoY = randomNumber(50, 250);
    let ufo = (x, y) => ({
      x: x,
      y: y,
      width: 15,
      height: 15,
      status: 1,
      speed: 3
    })
    ufoArray.push(ufo(ufoX, ufoY));
    ufoArray.push(ufo(ufoX + 15, ufoY));
    ufoArray.push(ufo(ufoX + 30, ufoY));
    ufoArray.push(ufo(ufoX, ufoY + 15));
    ufoArray.push(ufo(ufoX, ufoY + 30));
    ufoArray.push(ufo(ufoX + 15, ufoY + 15));
    ufoArray.push(ufo(ufoX + 30, ufoY + 15));
    ufoArray.push(ufo(ufoX + 15, ufoY + 15));
    ufoArray.push(ufo(ufoX + 30, ufoY + 30));
    ufoArrayArray.push(ufoArray);
  }

  let obstacleArray = [];
  if (score === 400 && obstacleArrayArray.length <= 0) {
    let obstacleX = randomNumber(100, 500);
    let obstacleY = randomNumber(50, 250);
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
    let obstacleX = randomNumber(100, 500);
    let obstacleY = obstacleX;
    // hinder bestående av 9 mindre block
    let makeObstacle = (x, y) => ({
      x: x,
      y: y,
      width: 10,
      height: 10,
      status: 1,
      speed: 3,
      hit: false
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