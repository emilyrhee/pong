const startCanvas = document.getElementById('startCanvas');
const sC = startCanvas.getContext('2d');

const pongCanvas = document.createElement("canvas");
pongCanvas.id = "pongCanvas"
const pC = pongCanvas.getContext('2d');
pongCanvas.width = startCanvas.width;
pongCanvas.height = startCanvas.height;

const wrapper = document.getElementById("wrapper");

function startGame() {
  sC.font = '50px arial';
  sC.textBaseline = 'middle'; 
  sC.textAlign = 'center'; 
  sC.fillText("click to start", startCanvas.width / 2, startCanvas.height / 2);
}

gameStarted = false;

startCanvas.addEventListener('click', (event) => {
  startCanvas.remove();
  gameStarted = true;
  wrapper.insertBefore(pongCanvas, startCanvas.nextSibling);
});


function dashes() {
  for (let i = 0; i < (pongCanvas.height / 10); i++) {
   pC.beginPath();
   pC.moveTo(pongCanvas.width / 2,  5 + (i * 20));    
   pC.lineTo(pongCanvas.width / 2, 15 + (i * 20));
   pC.stroke();
   pC.closePath();
  }
}

var paddleSound = new Audio("sounds/paddle.mp3");
var wallSound = new Audio("sounds/wall.mp3");

const playerOne = {
  x: 10,
  y: 0,
  deltaY: 5,
  top: pongCanvas.height / 2 - 25,
  bottom: pongCanvas.height / 2 + 25,
  scoreX: (pongCanvas.width / 4) - 20,
  score: 0,
  
  draw: function() {
   pC.beginPath();
   pC.moveTo(this.x, this.top    - this.y);
   pC.lineTo(this.x, this.bottom - this.y);
   pC.stroke();
   pC.closePath();
  },
  
  up: function() {
    this.y += this.deltaY;
  },

  down: function() {
    this.y -= this.deltaY;
  },

  passedBottom: function() {
    return this.bottom - this.y >= pongCanvas.height;
  },

  passedTop: function() {
    return this.top - this.y <= 0;
  },
  
  scoreDraw: function() {
   pC.font = '48px arial';   
   sC.textBaseline = 'middle'; 
   sC.textAlign = 'center';  
   pC.fillText(this.score, this.scoreX, 50);
  }
};
  
const playerTwo = {
  x: 490,
  score: 0,
  scoreX: (3 * pongCanvas.width / 4) - 20
};
Object.setPrototypeOf(playerTwo, playerOne);
playerTwo.up();
playerTwo.down();

var keyMap = {};

function keys(){
  if (keyMap["d"]) {
    if (!playerOne.passedTop()) {
      playerOne.up();
    }
  } else if (keyMap["f"]) {
    if (!playerOne.passedBottom()) {
      playerOne.down();
    }
  }
  
  if (keyMap["k"]) {
    if (!playerTwo.passedTop()) {
      playerTwo.up();
    }
  } else if (keyMap["j"]) {
    if (!playerTwo.passedBottom()) {
      playerTwo.down();
    }
  }
}

document.addEventListener('keydown', (event) => {
  keyMap[event.key] = event.type == 'keydown'; // true
});

document.addEventListener('keyup', (event) => {
  keyMap[event.key] = event.type == 'keydown'; //false
});

function randomNum(min, max) {
  return Math.random() * (max - min) + min;
}

const ball = {
  x: 0, 
  y: 0,
  deltaX: 2,
  deltaY: 2,
  ballSize: 15,
  p1WonLastPoint: true,
  
  init: function() {
    this.x = pongCanvas.width / 2 - this.ballSize / 2;
    this.y = randomNum(this.ballSize, pongCanvas.height - this.ballSize);
  },

  draw: function() {
   pC.fillRect(this.x, this.y, this.ballSize, this.ballSize);
  },
  
  move: function () {
    this.changeDirection();

    if (this.p1WonLastPoint) {
      this.x += -this.deltaX; // move left
      this.y += -this.deltaY;
    }

    if (this.p1WonLastPoint == false) {
      this.x += this.deltaX; // move right
      this.y += this.deltaY;
    }

    this.bounceBack();
  },

// moveLeft: function () {
//   this.x += -this.deltaX; 
//   this.y += -this.deltaY;
// },

// moveRight: function() {
//   this.x += this.deltaX; 
//   this.y += this.deltaY;
// }
  
  changeDirection: function () {
    if (this.y + this.ballSize >= pongCanvas.height
       || this.y <= 0) {
      this.deltaY = -this.deltaY;
      wallSound.play();
    }
  },
  
  reset: function() {
    if (this.x > pongCanvas.width) {
      this.init();
      playerOne.score++;
      this.p1WonLastPoint == true;
    }
    if (this.x < -this.ballSize) {
      this.init();
      playerTwo.score++;
      this.p1WonLastPoint == false;
    }
  },

  bounceBack: function() {
    if (this.x + 1 <= playerOne.x 
        && this.y >= playerOne.top - playerOne.y 
        && this.y <= playerOne.bottom - playerOne.y) {
      this.x = playerOne.x + 1;
      this.deltaX = -this.deltaX;
      paddleSound.play();
    } else if (this.x + this.ballSize >= playerTwo.x 
        && this.y >= playerTwo.top - playerTwo.y 
        && this.y <= playerTwo.bottom - playerTwo.y) {
      this.x = playerTwo.x - this.ballSize;
      this.deltaX = -this.deltaX;
      paddleSound.play();
    }
  }
}
ball.init();

function animate () {
  requestAnimationFrame(animate);
  pC.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
  sC.clearRect(0, 0, startCanvas.width, startCanvas.height);

  startGame();
  
  keys();

  dashes();
  
  ball.draw();
  playerOne.draw();
  playerTwo.draw();
  playerOne.scoreDraw();
  playerTwo.scoreDraw();

  if (gameStarted == true) {
    ball.move();
    ball.reset();
  }
}
animate();