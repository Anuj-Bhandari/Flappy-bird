let board;
let boardwidth = 450;
let boardheight = 640;
let context;

let birdheight = 24;
let birdwidth = 34;
let birdX = boardwidth / 10;
let birdY = boardheight / 2;

let gameover = false
let score = 0 ; 

let bird = {
  x: birdX,
  y: birdY,
  width: birdwidth,
  height: birdheight
};

// pipes
let pipearrray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

// physics
let velocityX = -2;  //pipes to move left
let velocityY = 0 
let gravity = 0.3

// images
let birdimg, topPimg, bottomPimg;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardheight;
  board.width = boardwidth;
  context = board.getContext("2d");

  // images
  birdimg = new Image();
  birdimg.src = "./flappybird.png";

  topPimg = new Image();
  topPimg.src = "./toppipe.png";

  bottomPimg = new Image();
  bottomPimg.src = "./bottompipe.png";

  birdimg.onload = function () {
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
  };

  requestAnimationFrame(update);
  setInterval(placepipe, 1500);
  document.addEventListener("keydown" , movebird)
};

function update() {
  if(gameover){
    return ;
  }
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  //  bird
  velocityY += gravity ;  
  bird.y = Math.max(bird.y + velocityY , 0 ) // applying top boundary
  context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

 if( bird.y >  board.height ){
  gameover = true
 }

 if(bird.y > board.height){
  gameover = true ;
 }

  // draw pipes
  for (let i = 0; i < pipearrray.length; i++) {
    let pipe = pipearrray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
 
 

  if(detectcollision(bird , pipe)){
    gameover = true;
  }
  }

  context.fillstyle = "black"
  context.font = "45px"
  context.fillText(score , 5 , 45)
}



function placepipe() {

if(gameover){
  return ;
}

  let randompipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingspace = board.height / 4;

  let toppipe = {
    img: topPimg,
    x: pipeX,
    y: randompipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };
pipearrray.push(toppipe)

  let bottompipe = {
    img: bottomPimg,
    x: pipeX,
    y: randompipeY + pipeHeight + openingspace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };

  pipearrray.push(bottompipe);
}

function movebird(e){
  if (e.code == "space" || e.code == "ArrowUp"){
    velocityY = -6 
  }
}

function detectcollision(a , b){
  return a.x < b.x + b.width && 
  a.x + a.width > b.x && 
  a.y < b.y + b.height  &&
 a.y + a.height > b.y
}