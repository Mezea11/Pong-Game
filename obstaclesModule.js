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
    let planetX = randomNumber(100, 500);
    let planetY = randomNumber(50, 250);
    let planet = (x, y) => ({
      x: x,
      y: y,
      width: 40,
      height: 40,
      hit: false
    })
    planetArray.push(planet(planetX, planetY));
  }
  
  let ufoArray = [];
  if (score === 400 && ufoArrayArray.length <= 0) {
    let ufoX = randomNumber(100, 500);
    let ufoY = randomNumber(50, 250);
    let ufo = (x, y) => ({
      x: x,
      y: y,
      width: 20,
      height: 20,
      status: 1,
      speed: 3
    })
    ufoArray.push(ufo(ufoX, ufoY));
    ufoArray.push(ufo(ufoX + 20, ufoY));
    ufoArray.push(ufo(ufoX + 40, ufoY));
    ufoArray.push(ufo(ufoX, ufoY + 23));
    ufoArray.push(ufo(ufoX, ufoY + 46));
    ufoArray.push(ufo(ufoX + 20, ufoY + 23));
    ufoArray.push(ufo(ufoX + 40, ufoY + 23));
    ufoArray.push(ufo(ufoX + 20, ufoY + 23));
    ufoArray.push(ufo(ufoX + 40, ufoY + 46));
    ufoArrayArray.push(ufoArray);
  }
}