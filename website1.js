let paddleLeft = {
	body: document.getElementById("left"),
	y: 37,
	height: 26,
	speed: 1.05
};


let paddleRight = {
	body: document.getElementById("right"),
	y: 37,
	height: 26,
	speed: 1.05
};


let ball = {
	body: document.getElementById("ball"),

	x: 50,
	y: 50,

	speedX: 0,
	speedY: 0,

	startSpeedX: 0.45,
	maxSpeedX: 1.2
};


// SCORE

let leftScore = 0;
let rightScore = 0;

let leftScoreText =
	document.getElementById("leftScore");

let rightScoreText =
	document.getElementById("rightScore");

let countdownText =
	document.getElementById("countdown");


// GAME STATE

let roundActive = false;


// AUDIO

let paddleSounds = [
	"audio1.m4a",
	"audio2.m4a",
	"audio3.m4a",
	"audio4.m4a"
];

let audioUnlocked = false;


function unlockAudio() {

	if (audioUnlocked) {
		return;
	}

	let sound =
		new Audio(paddleSounds[0]);

	sound.volume = 0;

	sound.play()
		.then(function() {

			sound.pause();

			sound.currentTime = 0;

			audioUnlocked = true;
		})
		.catch(function() {

			audioUnlocked = true;
		});
}


document.addEventListener(
	"click",
	unlockAudio,
	{ once: true }
);


document.addEventListener(
	"touchstart",
	unlockAudio,
	{ once: true }
);


function playRandomPaddleSound() {

	let randomNumber =
		Math.floor(
			Math.random() *
			paddleSounds.length
		);


	let sound =
		new Audio(
			paddleSounds[randomNumber]
		);


	sound.volume = 1;


	sound.play().catch(function(error) {

		console.log(
			"Audio error:",
			error
		);
	});
}


// STARTING POSITIONS

paddleLeft.body.style.top =
	paddleLeft.y + "vh";

paddleLeft.body.style.left =
	"0";


paddleRight.body.style.top =
	paddleRight.y + "vh";

paddleRight.body.style.right =
	"0";


// INPUT VARIABLES

let upPressed = false;
let downPressed = false;

let rightUpPressed = false;
let rightDownPressed = false;


// DESKTOP KEYBOARD CONTROLS

document.addEventListener("keydown", function(event) {

	if (event.key === "w") {
		upPressed = true;
	}


	if (event.key === "s") {
		downPressed = true;
	}


	if (event.key === "ArrowUp") {

		rightUpPressed = true;

		event.preventDefault();
	}


	if (event.key === "ArrowDown") {

		rightDownPressed = true;

		event.preventDefault();
	}
});


document.addEventListener("keyup", function(event) {

	if (event.key === "w") {
		upPressed = false;
	}


	if (event.key === "s") {
		downPressed = false;
	}


	if (event.key === "ArrowUp") {
		rightUpPressed = false;
	}


	if (event.key === "ArrowDown") {
		rightDownPressed = false;
	}
});


// MOBILE TOUCH CONTROLS

let leftUp =
	document.getElementById("leftUp");

let leftDown =
	document.getElementById("leftDown");

let rightUp =
	document.getElementById("rightUp");

let rightDown =
	document.getElementById("rightDown");


function addTouchControl(
	element,
	startFunction,
	endFunction
) {

	element.addEventListener(
		"touchstart",

		function(event) {

			event.preventDefault();

			startFunction();
		},

		{ passive: false }
	);


	element.addEventListener(
		"touchend",

		function(event) {

			event.preventDefault();

			endFunction();
		},

		{ passive: false }
	);


	element.addEventListener(
		"touchcancel",

		function() {

			endFunction();
		}
	);
}


addTouchControl(

	leftUp,

	function() {
		upPressed = true;
	},

	function() {
		upPressed = false;
	}
);


addTouchControl(

	leftDown,

	function() {
		downPressed = true;
	},

	function() {
		downPressed = false;
	}
);


addTouchControl(

	rightUp,

	function() {
		rightUpPressed = true;
	},

	function() {
		rightUpPressed = false;
	}
);


addTouchControl(

	rightDown,

	function() {
		rightDownPressed = true;
	},

	function() {
		rightDownPressed = false;
	}
);


// COLLISION

function isTouching(a, b) {

	let aRect =
		a.body.getBoundingClientRect();

	let bRect =
		b.body.getBoundingClientRect();


	return (
		aRect.right >= bRect.left &&
		aRect.left <= bRect.right &&
		aRect.bottom >= bRect.top &&
		aRect.top <= bRect.bottom
	);
}


// PADDLE MOVEMENT

function movePaddles() {

	if (upPressed) {

		paddleLeft.y -=
			paddleLeft.speed;
	}


	if (downPressed) {

		paddleLeft.y +=
			paddleLeft.speed;
	}


	if (rightUpPressed) {

		paddleRight.y -=
			paddleRight.speed;
	}


	if (rightDownPressed) {

		paddleRight.y +=
			paddleRight.speed;
	}


	// LEFT BOUNDARIES

	if (paddleLeft.y < 0) {

		paddleLeft.y = 0;
	}


	if (
		paddleLeft.y +
		paddleLeft.height >
		100
	) {

		paddleLeft.y =
			100 -
			paddleLeft.height;
	}


	// RIGHT BOUNDARIES

	if (paddleRight.y < 0) {

		paddleRight.y = 0;
	}


	if (
		paddleRight.y +
		paddleRight.height >
		100
	) {

		paddleRight.y =
			100 -
			paddleRight.height;
	}


	paddleLeft.body.style.top =
		paddleLeft.y + "vh";


	paddleRight.body.style.top =
		paddleRight.y + "vh";
}


// UPDATE BALL POSITION

function updateBallPosition() {

	ball.body.style.left =
		ball.x + "vw";

	ball.body.style.top =
		ball.y + "vh";
}


// BALL MOVEMENT

function moveBall() {

	if (!roundActive) {
		return;
	}


	ball.x += ball.speedX;

	ball.y += ball.speedY;


	let ballRect =
		ball.body.getBoundingClientRect();


	let ballHeightVH =
		(ballRect.height /
		window.innerHeight) *
		100;


	// TOP WALL

	if (ball.y <= 0) {

		ball.y = 0;

		ball.speedY *= -1;
	}


	// BOTTOM WALL

	if (
		ball.y +
		ballHeightVH >=
		100
	) {

		ball.y =
			100 -
			ballHeightVH;

		ball.speedY *= -1;
	}


	updateBallPosition();
}


// CENTER BALL

function centerBall() {

	let ballRect =
		ball.body.getBoundingClientRect();


	let ballWidthVW =
		(ballRect.width /
		window.innerWidth) *
		100;


	let ballHeightVH =
		(ballRect.height /
		window.innerHeight) *
		100;


	ball.x =
		(100 - ballWidthVW) / 2;


	ball.y =
		(100 - ballHeightVH) / 2;


	updateBallPosition();
}


// PADDLE BOUNCE

function bounceOffPaddle(paddle) {

	playRandomPaddleSound();


	let paddleRect =
		paddle.body.getBoundingClientRect();


	let ballRect =
		ball.body.getBoundingClientRect();


	let paddleCenter =
		paddleRect.top +
		paddleRect.height / 2;


	let ballCenter =
		ballRect.top +
		ballRect.height / 2;


	let hitPosition =
		(ballCenter -
		paddleCenter) /
		(paddleRect.height / 2);


	hitPosition =
		Math.max(
			-1,
			Math.min(
				1,
				hitPosition
			)
		);


	// REVERSE HORIZONTAL DIRECTION

	ball.speedX *= -1;


	// CHANGE ANGLE BASED ON HIT LOCATION

	ball.speedY =
		hitPosition * 0.65;


	// SPEED UP SLIGHTLY

	if (
		Math.abs(ball.speedX) <
		ball.maxSpeedX
	) {

		ball.speedX *= 1.05;
	}
}


// CHECK COLLISIONS

function checkCollisions() {

	if (!roundActive) {
		return;
	}


	// LEFT PADDLE

	if (
		ball.speedX < 0 &&
		isTouching(
			ball,
			paddleLeft
		)
	) {

		bounceOffPaddle(
			paddleLeft
		);


		let paddleRect =
			paddleLeft.body
			.getBoundingClientRect();


		ball.x =
			(paddleRect.right /
			window.innerWidth) *
			100;


		updateBallPosition();
	}


	// RIGHT PADDLE

	if (
		ball.speedX > 0 &&
		isTouching(
			ball,
			paddleRight
		)
	) {

		bounceOffPaddle(
			paddleRight
		);


		let paddleRect =
			paddleRight.body
			.getBoundingClientRect();


		let ballRect =
			ball.body
			.getBoundingClientRect();


		let ballWidthVW =
			(ballRect.width /
			window.innerWidth) *
			100;


		ball.x =
			(paddleRect.left /
			window.innerWidth) *
			100
			-
			ballWidthVW;


		updateBallPosition();
	}
}


// SCORE

function checkScore() {

	if (!roundActive) {
		return;
	}


	let ballRect =
		ball.body.getBoundingClientRect();


	// RIGHT PLAYER SCORES

	if (ballRect.left <= 0) {

		rightScore++;


		rightScoreText.textContent =
			rightScore;


		startNextRound(-1);

		return;
	}


	// LEFT PLAYER SCORES

	if (
		ballRect.right >=
		window.innerWidth
	) {

		leftScore++;


		leftScoreText.textContent =
			leftScore;


		startNextRound(1);

		return;
	}
}


// ROUND COUNTDOWN

function startNextRound(direction) {

	roundActive = false;


	ball.speedX = 0;

	ball.speedY = 0;


	centerBall();


	let countdown = 3;


	countdownText.textContent =
		countdown;


	let timer =
		setInterval(function() {

			countdown--;


			if (countdown > 0) {

				countdownText.textContent =
					countdown;
			}


			else if (countdown === 0) {

				countdownText.textContent =
					"GO!";
			}


			else {

				clearInterval(timer);


				countdownText.textContent =
					"";


				startBall(direction);
			}

		}, 1000);
}


// START BALL

function startBall(direction) {

	ball.speedX =
		ball.startSpeedX *
		direction;


	ball.speedY =
		(Math.random() - 0.5) *
		0.5;


	roundActive = true;
}


// HANDLE SCREEN ROTATION / RESIZE

window.addEventListener(
	"resize",

	function() {

		if (!roundActive) {

			centerBall();
		}
	}
);


// GAME LOOP

setInterval(function() {

	movePaddles();

	moveBall();

	checkCollisions();

	checkScore();

}, 10);


// START GAME

centerBall();


startNextRound(

	Math.random() < 0.5

		? -1

		: 1
);