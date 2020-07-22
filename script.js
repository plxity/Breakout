const closeRules = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const showRules = document.getElementById("rules-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const playButton = document.getElementById("start-game");
const popup = document.getElementById("popup");
const playAgain = document.getElementById("play-again");
const ScoreCard = document.getElementById("score-card");
const sound = document.getElementById('sound');

let score = 0;
var startGame = false;
let finalScore ;
//create ball
const colors = ['#66ff97','#ff4747','#47ffff']
const brickRowCount = 9;
const brickColCount = 5;
const brickInfo = {
  width: 70,
  height: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
  color: '#0095dd'
};
const ball = {
  x: canvas.width / 2,
  y: canvas.width / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};
const brick = [];
//Create bricks
function createBricks() {
  for (let i = 0; i < brickRowCount; i++) {
    brick[i] = [];
    for (let j = 0; j < brickColCount; j++) {
      const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
      brick[i][j] = { x, y, ...brickInfo };
    }
  }
}
createBricks();
//Draw a ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//Draw score on canvas
function drawScore() {
  ctx.font = "20px arial";
  ctx.fillText(`Score:${score}`, canvas.width - 100, 30);
}

//Draw bricks
function drawBrick() {
  brick.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.visible ? brick.color : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

//Draw Everything
function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBrick();
}

function movepaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

function moveball() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.speed = ball.speed + 0.5;
    ball.dy = -ball.speed;
  }
  brick.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.width &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.height
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
          finalScore = score;
        }
      }
    });
  });
  if (ball.y + ball.size > canvas.height) {
    score = 0;
    ball.speed = 4;
    ball.dy = -0;
    ball.dx = 0;
    startGame = false;
    showScoreCard()
  }
}
function showScoreCard() {
  let x = document.createElement("h1");
  x.innerText = `Final Score: ${finalScore}`;
  x.style.textAlign ='center';
  ScoreCard.append(x);
  ScoreCard.classList.add("show");
  showAllBrick();
}
function increaseScore() {
  score++;
  sound.play();
  if (score % (brickColCount * brickRowCount) === 0) {
    showAllBrick();
    showScoreCard();
    score = 0;
  }
}
function showAllBrick() {
  brick.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
}
// function changeColor(){
//   console.log("hello")
//   brick.forEach((column) => {
//     column.forEach((brick) => {
//       if(brick.visible === true){
//         brick.color = colors[Math.floor(Math.random()*colors.length)]
//       }
//     });
//   });

// }
function update() {
  // changeColor();
  drawScore();
  moveball();
  movepaddle();
  drawEverything();
}

function checkStatus() {
  if (startGame === true) {
    update();
  }
  requestAnimationFrame(checkStatus);
}
checkStatus();

function keyDown(e) {
  if (e.key === "Right" || e.key == "ArrowRight") {
    paddle.dx = paddle.speed;
  } else {
    if (e.key === "Left" || e.key === "ArrowLeft") {
      paddle.dx = -paddle.speed;
    }
  }
}
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key == "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}
playAgain.addEventListener("click", () => {
  window.location.reload();
});
playButton.addEventListener("click", () => {
  popup.classList.add("hide");
  startGame = true;
});
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

closeRules.addEventListener("click", () => {
  rules.classList.remove("show");
});
showRules.addEventListener("click", () => {
  rules.classList.add("show");
});
function randomColor(){

}