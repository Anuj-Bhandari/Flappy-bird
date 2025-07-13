let board;
let boardWidth = 450;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 10;
let birdY = boardHeight / 2;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight
};

let velocityX = -2; // pipes moving left
let velocityY = 0;
let gravity = 0.3;

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
let gameover = false;

let gameoverScreen, scoreText, highScoreText;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");


  gameoverScreen = document.getElementById("game-over-screen");
  scoreText = document.getElementById("score-text");
  highScoreText = document.getElementById("high-score-text");

  birdImg = new Image();
  birdImg.src = "./flappybird.png";

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  bgImg = new Image();
  bgImg.src = "./flappybirdbg.png";

  birdImg.onload = () => {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  requestAnimationFrame(update);
  setInterval(placePipe, 1500);
  document.addEventListener("keydown", moveBird);
};

function update() {
  if (gameover) {
    drawGameOver();
    return;
  }

  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  context.drawImage(bgImg, 0, 0, board.width, board.height);

  // Update bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // Top boundary
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameover = true;
  }

  // Pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    // Scoring
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score += 0.5; // each pipe adds 0.5, top+bottom = 1
    }

    if (detectCollision(bird, pipe)) {
      gameover = true;
    }
  }

  // Remove off-screen pipes
  pipeArray = pipeArray.filter(pipe => pipe.x + pipe.width > 0);

  // Score text
  context.fillStyle = "black";
  context.font = "45px sans-serif";
  context.fillText(Math.floor(score), 5, 45);
}

function drawGameOver() {

  // Show UI
  gameoverScreen.style.display = "block";
  scoreText.innerText = `Score: ${Math.floor(score)}`;

  if (score > highscore) {
    highscore = Math.floor(score);
    localStorage.setItem("highscore", highscore);
  }

  highScoreText.innerText = `High Score: ${highscore}`;
}

function placePipe() {
  if (gameover) return;

  let randomY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let gap = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomY + pipeHeight + gap,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };

  pipeArray.push(topPipe);
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code === "Space" || e.code === "ArrowUp") {
    velocityY = -6;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function restartGame() {
  gameover = false;
  score = 0;
  velocityY = 0;
  bird.y = boardHeight / 2;
  pipeArray = [];
  gameoverScreen.style.display = "none";
  requestAnimationFrame(update);
}
