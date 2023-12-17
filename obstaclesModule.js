import { startGame } from "./script.js";

randomNumber();
const timeStart = Date.now();
// generate random number
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


// levels & powerups
export function getLevel(score, lvlcount, rightPaddle, powerUpArray) {  
    if (lvlcount === 1) {
      rightPaddle.speed = 150;
    }

    //lvl MEDIUM
    if (lvlcount === 2 && powerUpArray.length == 0) {
      rightPaddle.speed = 250;
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
      powerUpX = randomNumber(100, 500);
      powerUpY = randomNumber(20, 280);
      powerUpArray.push(makepowerUp(powerUpX, powerUpY));
    }

    //lvl HARD
    if (lvlcount === 3 && powerUpArray.length >= 0 && powerUpArray.length <= 0) {
      rightPaddle.speed = 300;
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
      powerUpX = randomNumber(100, 500);
      powerUpY = randomNumber(20, 280);
      powerUpArray.push(makepowerUp(powerUpX, powerUpY));
    }
  
}

// skapa hinder
export function createObstacle(score, lvlcount, planetArray, ufoArrayArray) {
  
  if (score >= 100 && planetArray.length <= 0 && lvlcount >= 2) {
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
  if (score === 400 && ufoArrayArray.length <= 0 && lvlcount >= 2) {
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
    ufoArray.push(ufo(ufoX + 23, ufoY));
    ufoArray.push(ufo(ufoX + 46, ufoY));
    ufoArray.push(ufo(ufoX, ufoY + 23));
    ufoArray.push(ufo(ufoX + 23, ufoY + 23));
    ufoArray.push(ufo(ufoX + 46, ufoY + 23));
    ufoArray.push(ufo(ufoX, ufoY + 46));
    ufoArray.push(ufo(ufoX + 23, ufoY + 46));
    ufoArray.push(ufo(ufoX + 46, ufoY + 46));
    ufoArrayArray.push(ufoArray);
  }
}