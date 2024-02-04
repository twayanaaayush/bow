const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let SCORE = 0;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const COLUMN = 4;
const COLUMN_WIDTH = CANVAS_WIDTH / COLUMN;
const COLUMN_HEIGHT = CANVAS_HEIGHT;

const SIZE_UNIT = COLUMN_WIDTH;

class Bug {
  constructor(color = "green") {
    this.color = color;
    this.size = {
      width: 1 * SIZE_UNIT,
      height: 1 * SIZE_UNIT,
    };

    this.spawn(); // set position
    this.initController(); // player controls
  }

  spawn() {
    this.position = {
      x: Math.floor(Math.random() * (CANVAS_WIDTH / SIZE_UNIT)),
      y: COLUMN_HEIGHT / SIZE_UNIT - 2, // 1 more than object's height
    };
  }

  initController() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.move("left");
          break;
        case "ArrowRight":
          this.move("right");
          break;
        case "ArrowUp":
          this.move("up");
          break;
        case "ArrowDown":
          this.move("down");
          break;

        default:
          break;
      }
    });
  }

  move(direction) {
    switch (direction) {
      case "left":
        this.position.x -= 1;
        if (this.checkBoundaryCollision()) this.position.x += 1;
        break;
      case "right":
        this.position.x += 1;
        if (this.checkBoundaryCollision()) this.position.x -= 1;
        break;
      case "up":
        this.position.y -= 1;
        if (this.checkBoundaryCollision()) this.position.y += 1;
        break;
      case "down":
        this.position.y += 1;
        if (this.checkBoundaryCollision()) this.position.y -= 1;
        break;
      default:
        break;
    }
  }

  checkBoundaryCollision() {
    //check collision with canvas boundary
    if (
      this.position.y * this.size.height >= CANVAS_HEIGHT ||
      this.position.y * this.size.height < 0 ||
      this.position.x * this.size.width >= CANVAS_WIDTH ||
      this.position.x * this.size.width < 0
    )
      return true;

    return false;
  }

  checkObstacleCollision() {
    //check collision with obstacle
    for (let i = 0; i < obstacles.length; ++i) {
      if (
        this.position.x * this.size.width > obstacles[i].position.x && 
        this.position.y < obstacles[i].position.y * obstacles[i].size.height &&
        this.position.y * this.size.height > obstacles[i].position.y &&
        this.position.x < obstacles[i].position.x * obstacles[i].size.width
      )
        return true;

      return false;
    }
  }

  update() {
    if (this.checkObstacleCollision()) {
      gameOver = true;
      alert("Game Over");
    }
    SCORE++;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x * SIZE_UNIT,
      this.position.y * SIZE_UNIT,
      this.size.width,
      this.size.height
    );

    ctx.strokeStyle = "black";
    ctx.strokeRect(
      this.position.x * SIZE_UNIT,
      this.position.y * SIZE_UNIT,
      this.size.width,
      this.size.height
    );
  }
}

class Obstacle {
  constructor(color = "red") {
    this.color = color;
    this.speed = 0.09; // speed of obstacle
    this.size = {
      width: 1 * SIZE_UNIT,
      height: 1 * SIZE_UNIT,
    };

    this.spawn(); // set position
  }

  spawn() {
    this.position = {
      x: Math.floor(Math.random() * (CANVAS_WIDTH / SIZE_UNIT)),
      y: -Math.floor(Math.random() * (COLUMN_HEIGHT / SIZE_UNIT)),
    };
  }

  checkBoundary() {
    //check collision with canvas boundary
    if (this.position.y * this.size.height > CANVAS_HEIGHT) {
      this.spawn();
    }
  }

  update() {
    this.checkBoundary();
    this.position.y = this.position.y + this.speed;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x * SIZE_UNIT,
      this.position.y * SIZE_UNIT,
      this.size.width,
      this.size.height
    );

    ctx.strokeStyle = "black";
    ctx.strokeRect(
      this.position.x * SIZE_UNIT,
      this.position.y * SIZE_UNIT,
      this.size.width,
      this.size.height
    );
  }
}

function update() {
  for (let i = 0; i < bugs.length; ++i) bugs[i].update();
  for (let i = 0; i < obstacles.length; ++i) obstacles[i].update();
}

function _drawColumn() {
  for (c = 0; c < COLUMN; c++) {
    ctx.strokeStyle = "black";
    ctx.strokeRect(c * COLUMN_WIDTH, 0, COLUMN_WIDTH, COLUMN_HEIGHT);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  _drawColumn();
  for (let i = 0; i < bugs.length; ++i) bugs[i].draw();
  for (let i = 0; i < obstacles.length; ++i) obstacles[i].draw();

  scoreElement.innerHTML = SCORE; // update score element in HTML
}

// global variables
var gameOver = false;
var timeInit = Date.now();

var bugs = [];
var obstacles = [];

bugs.push(new Bug());

for (let i = 0; i < 5; ++i) {
  obstacles.push(new Obstacle());
}
//

function loop() {
  const now = Date.now();
  const dt = now - timeInit;

  if (dt > 1000 / 60) {
    update();
    draw();
    timeInit = Date.now();
  }

  if (!gameOver) requestAnimationFrame(loop);
}

loop();
