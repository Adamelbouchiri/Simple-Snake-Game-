const playBoard = document.querySelector(".play-board");
const gameScore = document.querySelector(".score");
const gameHighScore = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let foodX, foodY;

let snakeX = 5,
  snakeY = 10;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let gameOver = false;
let setIntervalId;
let score = 0;

// Getting High Score From Local Storage
let highScore = localStorage.getItem("highScore") || 0;
gameHighScore.innerHTML = `High Score : ${highScore}`;

const changeFoodPosition = () => {
  // Passing Random Food Position From 1 To 30.
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  // Clearing The Timer And Reload The Page
  clearInterval(setIntervalId);
  alert("Game Over, Press OK To Replay...");
  location.reload();
};

const changeDirection = (e) => {
  // Change Velocity Value On Key Press
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
};

controls.forEach((key) => {
  // Calling ChangeDirection On Each Key Click And Passing Key Dataset as an value
  key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});

const initGame = () => {
  if (gameOver === true) return handleGameOver();
  let htmlMarkeup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Checking if The Snake Hit Food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // Pushing Food Position To Snake Body Array
    score++; // increase Score By One

    highScore = score > highScore ? score : highScore;
    localStorage.setItem("highScore", highScore);

    gameScore.innerHTML = `Score : ${score}`;
    gameHighScore.innerHTML = `High Score : ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // Shifting Forward The Values Of The Elements In The Snake Body By One
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; // Setting First Element Of Snake Body To Current Snake Position

  // Update Snake Head Position Based On The Current Velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Checking If Snake Head Out Of The Wall
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // Adding a Div For Each Part Of The Snake
    htmlMarkeup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // Cheking If Snake Head Hit The Body, If So Set gameOver Variable True
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    )
      gameOver = true;
  }

  playBoard.innerHTML = htmlMarkeup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
