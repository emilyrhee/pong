const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

function dashes() {
  for (let i = 0; i < (canvas.height / 10); i++) {
    c.beginPath();
    c.moveTo(canvas.width / 2,  5 + (i * 20));    
    c.lineTo(canvas.width / 2, 15 + (i * 20));
    c.stroke();
    c.closePath();
  }
}

var paddleSound = new Audio("sounds/paddle.mp3");
var wallSound = new Audio("sounds/wall.mp3");

const playerOne = {
  x: 10,
  y: 0,
  deltaY: 5,
  top: canvas.height / 2 - 25,
  bottom: canvas.height / 2 + 25,
  scoreX: (canvas.width / 4) - 20,
  score: 0,
  
  draw: function() {
    c.beginPath();
    c.moveTo(this.x, this.top    - this.y);
    c.lineTo(this.x, this.bottom - this.y);
    c.stroke();
    c.closePath();
  },
  
  up: function() {
    this.y += this.deltaY;
  },

  down: function() {
    this.y -= this.deltaY;
  },

  passedBottom: function() {
    return this.bottom - this.y >= canvas.height;
  },

  passedTop: function() {
    return this.top - this.y <= 0;
  },
  
  scoreDraw: function() {
    c.font = '48px arial';    
    c.fillText(this.score, this.scoreX, 50, 40);
  }
};
  
const playerTwo = {
  x: 490,
  score: 0,
  scoreX: (3 * canvas.width / 4) - 20
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
    this.x = canvas.width / 2 - this.ballSize / 2;
    this.y = randomNum(this.ballSize, canvas.height - this.ballSize);
  },

  draw: function() {
    c.fillRect(this.x, this.y, this.ballSize, this.ballSize);
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
    if (this.y + this.ballSize >= canvas.height
       || this.y <= 0) {
      this.deltaY = -this.deltaY;
      wallSound.play();
    }
  },
  
  reset: function() {
    if (this.x > canvas.width) {
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
  c.clearRect(0, 0, canvas.width, canvas.height);

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