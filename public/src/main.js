const canvas1 = document.getElementById('canvas1');
const c1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('canvas2');
const c2 = canvas2.getContext('2d');

canvas2.addEventListener('click', (event) => {
  canvas2.remove();
});

function startGame() {
  c2.font = '50px arial';
  c2.textBaseline = 'middle'; 
  c2.textAlign = 'center'; 
  c2.fillText("click to start", canvas2.width / 2, canvas2.height / 2);
}

function dashes() {
  for (let i = 0; i < (canvas1.height / 10); i++) {
    c1.beginPath();
    c1.moveTo(canvas1.width / 2,  5 + (i * 20));    
    c1.lineTo(canvas1.width / 2, 15 + (i * 20));
    c1.stroke();
    c1.closePath();
  }
}

var paddleSound = new Audio("sounds/paddle.mp3");
var wallSound = new Audio("sounds/wall.mp3");

const playerOne = {
  x: 10,
  y: 0,
  deltaY: 5,
  top: canvas1.height / 2 - 25,
  bottom: canvas1.height / 2 + 25,
  scoreX: (canvas1.width / 4) - 20,
  score: 0,
  
  draw: function() {
    c1.beginPath();
    c1.moveTo(this.x, this.top    - this.y);
    c1.lineTo(this.x, this.bottom - this.y);
    c1.stroke();
    c1.closePath();
  },
  
  up: function() {
    this.y += this.deltaY;
  },

  down: function() {
    this.y -= this.deltaY;
  },

  passedBottom: function() {
    return this.bottom - this.y >= canvas1.height;
  },

  passedTop: function() {
    return this.top - this.y <= 0;
  },
  
  scoreDraw: function() {
    c1.font = '48px arial';    
    c1.fillText(this.score, this.scoreX, 50, 40);
  }
};
  
const playerTwo = {
  x: 490,
  score: 0,
  scoreX: (3 * canvas1.width / 4) - 20
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
    this.x = canvas1.width / 2 - this.ballSize / 2;
    this.y = randomNum(this.ballSize, canvas1.height - this.ballSize);
  },

  draw: function() {
    c1.fillRect(this.x, this.y, this.ballSize, this.ballSize);
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
    if (this.y + this.ballSize >= canvas1.height
       || this.y <= 0) {
      this.deltaY = -this.deltaY;
      wallSound.play();
    }
  },
  
  reset: function() {
    if (this.x > canvas1.width) {
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
  c1.clearRect(0, 0, canvas1.width, canvas1.height);
  c2.clearRect(0, 0, canvas2.width, canvas2.height);

  startGame();

  keys();

  dashes();
  
  ball.draw();
  playerOne.draw();
  playerTwo.draw();
  playerOne.scoreDraw();
  playerTwo.scoreDraw();

  ball.move();
  ball.reset();
}
animate();