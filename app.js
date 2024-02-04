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
      width: SIZE_UNIT,
      height: SIZE_UNIT,
    };

    this.spawn(); // set position
    this.initController(); // player controls
  }

  spawn() {
    this.position = {
      x: (Math.floor(Math.random() * (CANVAS_WIDTH / SIZE_UNIT))) * SIZE_UNIT,
      y: (COLUMN_HEIGHT / SIZE_UNIT - 2) * SIZE_UNIT, // 1 more than object's height
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
        this.position.x -= SIZE_UNIT;
        if (this.checkBoundaryCollision()) this.position.x += SIZE_UNIT;
        break;
      case "right":
        this.position.x += SIZE_UNIT;
        if (this.checkBoundaryCollision()) this.position.x -= SIZE_UNIT;
        break;
      case "up":
        this.position.y -= SIZE_UNIT;
        if (this.checkBoundaryCollision()) this.position.y += SIZE_UNIT;
        break;
      case "down":
        this.position.y += SIZE_UNIT;
        if (this.checkBoundaryCollision()) this.position.y -= SIZE_UNIT;
        break;
      default:
        break;
    }
  }

  checkBoundaryCollision() {
    //check collision with canvas boundary
    if (
      this.position.y + this.size.height > CANVAS_HEIGHT ||
      this.position.y < 0 ||
      this.position.x + this.size.width > CANVAS_WIDTH ||
      this.position.x < 0
    )
      return true;

    return false;
  }

  checkObstacleCollision() {
    //check collision with obstacle
    const bug_xmin = this.position.x;
    const bug_ymin = this.position.y;
    const bug_xmax = this.position.x + this.size.width;
    const bug_ymax = this.position.y + this.size.height;

    for (let i = 0; i < obstacles.length; ++i) {
      const obstacle_xmin = obstacles[i].position.x;
      const obstacle_ymin = obstacles[i].position.y;
      const obstacle_xmax = obstacles[i].position.x + obstacles[i].size.width;
      const obstacle_ymax = obstacles[i].position.y + obstacles[i].size.height;
      if (
        bug_xmin <= obstacle_xmax &&
        bug_xmax >= obstacle_xmin &&
        bug_ymin <= obstacle_ymax &&
        bug_ymax >= obstacle_ymin
      ) {
        console.log('player', {
          xmin: bug_xmin,
          ymin: bug_ymin,
          xmax: bug_xmax,
          ymax: bug_ymax
        });
        console.log('obstacle', {
          xmin: obstacle_xmin,
          ymin: obstacle_ymin,
          xmax: obstacle_xmax,
          ymax: obstacle_ymax
        });

        obstacles[i].color = "blue";
        return true;
      }

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
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );

    // ctx.strokeStyle = "black";
    // ctx.strokeRect(
    //   this.position.x,
    //   this.position.y,
    //   this.size.width,
    //   this.size.height
    // );
  }
}

class Obstacle {
  constructor(color = "red") {
    this.color = color;
    this.speed = 0.09; // speed of obstacle
    this.size = {
      width: SIZE_UNIT,
      height: SIZE_UNIT,
    };

    this.spawn(); // set position
  }

  spawn() {
    this.position = {
      x: (Math.floor(Math.random() * (CANVAS_WIDTH / SIZE_UNIT))) * SIZE_UNIT,
      y: (-Math.floor(Math.random() * (COLUMN_HEIGHT / SIZE_UNIT))) * SIZE_UNIT,
    };
  }

  checkBoundary() {
    //check collision with canvas boundary
    if (this.position.y + this.size.height > CANVAS_HEIGHT) {
      this.spawn();
    }
  }

  update() {
    this.checkBoundary();
    this.position.y += SIZE_UNIT * this.speed;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );

    // ctx.strokeStyle = "black";
    // ctx.strokeRect(
    //   this.position.x,
    //   this.position.y,
    //   this.size.width,
    //   this.size.height
    // );
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
