const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const SCORE = 0;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const COLUMN = 4;
const COLUMN_WIDTH = CANVAS_WIDTH / COLUMN;
const COLUMN_HEIGHT = CANVAS_HEIGHT;

const OBJECT_UNIT = COLUMN_WIDTH / 2;

const Bug = {
	color: "green",
	speed: 5,
	size: {
		width: 1 * OBJECT_UNIT,
		height: 1 * OBJECT_UNIT,
	},
	position: {
		x: undefined,
		y: undefined,
	},
	spawn: function () {
		this.position.x =
			Math.floor(Math.random() * (CANVAS_WIDTH / OBJECT_UNIT / 2)) * 2 + 0.5;
		this.position.y = COLUMN_HEIGHT / OBJECT_UNIT - 2; // 1 more than object's height
	},
	update: function () {},
	draw: function (context) {
		context.fillStyle = this.color;
		context.fillRect(
			this.position.x * OBJECT_UNIT,
			this.position.y * OBJECT_UNIT,
			this.size.width,
			this.size.height
		);
	},
};

const Obstacle = {
	color: "red",
	size: {
		width: 1 * OBJECT_UNIT,
		height: 1 * OBJECT_UNIT,
	},
	position: {
		x: undefined,
		y: undefined,
	},
	spawn: function () {
		this.position.x =
			Math.floor(Math.random() * (CANVAS_WIDTH / OBJECT_UNIT / 2)) * 2 + 0.5;
		this.position.y = Math.floor(
			Math.random() * (COLUMN_HEIGHT / OBJECT_UNIT / 2)
		);
	},
	update: function () {},
	draw: function (context) {
		context.fillStyle = this.color;
		context.fillRect(
			this.position.x * OBJECT_UNIT,
			this.position.y * OBJECT_UNIT,
			this.size.width,
			this.size.height
		);
	},
};

function update() {
	// scoreElement.innerHTML = score++;
	// if (
	// 	Bug.position.x * Bug.size.width ===
	// 		Obstacle.position.x * Obstacle.size.width &&
	// 	Bug.position.y * Bug.size.height ===
	// 		Obstacle.position.y * Obstacle.size.height
	// ) {
	// 	alert("Game over!");
	// 	return;
	// }
	// Bug.position.x += Bug.speed;
	// Obstacle.position.x -= Bug.speed;
	// if (Obstacle.position.x < 0) {
	// 	Obstacle.position.x = canvas.width / Obstacle.size.width;
	// 	Obstacle.position.y = Math.floor(
	// 		Math.random() * (canvas.height / Obstacle.size.height)
	// 	);
	// 	score++;
	// }
	// if (Bug.position.x > canvas.width / Bug.size.width) {
	// 	Bug.position.x = 0;
	// }
}

function _drawColumn() {
	for (c = 0; c < COLUMN; c++) {
		ctx.strokeStyle = "black";
		ctx.strokeRect(c * COLUMN_WIDTH, 0, COLUMN_WIDTH, COLUMN_HEIGHT);
	}
}

function draw(context) {
	_drawColumn();

	Bug.draw(context);
	Obstacle.draw(context);
}

function init() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	update();
	draw(ctx);

	requestAnimationFrame(init);
}

Bug.spawn();
Obstacle.spawn();
init();
