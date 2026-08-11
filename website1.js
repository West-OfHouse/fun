const game = document.body;


// --------------------------------
// PADDLES
// --------------------------------

let paddleLeft = {

	body: document.getElementById("left"),

	y: 37,

	speed: 1.05,

	pointerId: null
};


let paddleRight = {

	body: document.getElementById("right"),

	y: 37,

	speed: 1.05,

	pointerId: null
};


// --------------------------------
// BALL
// --------------------------------

let ball = {

	body: document.getElementById("ball"),

	x: 50,

	y: 50,

	speedX: 0,

	speedY: 0,

	startSpeedX: 0.45,

	maxSpeedX: 1.2
};


// --------------------------------
// SCORE
// --------------------------------

let leftScore = 0;

let rightScore = 0;


const leftScoreText =
	document.getElementById("leftScore");


const rightScoreText =
	document.getElementById("rightScore");


const countdownText =
	document.getElementById("countdown");


// --------------------------------
// GAME STATE
// --------------------------------

let roundActive = false;

let countdownTimer = null;


// --------------------------------
// AUDIO
// --------------------------------

const paddleSounds = [

	"audio1.m4a",

	"audio2.m4a",

	"audio3.m4a",

	"audio4.m4a"
];


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


// --------------------------------
// GAME SIZE FUNCTIONS
// --------------------------------

function getGameRect() {

	return game.getBoundingClientRect();
}


function getHeightPercent(element) {

	let gameRect =
		getGameRect();


	let elementRect =
		element.getBoundingClientRect();


	return (
		elementRect.height /
		gameRect.height
	) * 100;
}


function getWidthPercent(element) {

	let gameRect =
		getGameRect();


	let elementRect =
		element.getBoundingClientRect();


	return (
		elementRect.width /
		gameRect.width
	) * 100;
}


// --------------------------------
// PADDLE POSITION
// --------------------------------

function updatePaddlePosition(paddle) {

	paddle.body.style.top =
		paddle.y + "%";
}


function clampPaddle(paddle) {

	let paddleHeight =
		getHeightPercent(
			paddle.body
		);


	if (paddle.y < 0) {

		paddle.y = 0;
	}


	if (
		paddle.y +
		paddleHeight >
		100
	) {

		paddle.y =
			100 -
			paddleHeight;
	}


	updatePaddlePosition(
		paddle
	);
}


// --------------------------------
// DESKTOP KEYBOARD
// --------------------------------

let upPressed = false;

let downPressed = false;

let rightUpPressed = false;

let rightDownPressed = false;


document.addEventListener(
	"keydown",

	function(event) {

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
	}
);


document.addEventListener(
	"keyup",

	function(event) {

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
	}
);


// --------------------------------
// DRAGGING
// --------------------------------

function startDragging(
	paddle,
	event
) {

	event.preventDefault();


	paddle.pointerId =
		event.pointerId;


	paddle.body.setPointerCapture(
		event.pointerId
	);


	moveDraggedPaddle(
		paddle,
		event
	);
}


function moveDraggedPaddle(
	paddle,
	event
) {

	if (
		event.pointerId !==
		paddle.pointerId
	) {

		return;
	}


	let gameRect =
		getGameRect();


	let paddleHeight =
		getHeightPercent(
			paddle.body
		);


	let pointerY =
		(
			(event.clientY -
			gameRect.top) /
			gameRect.height
		) * 100;


	paddle.y =
		pointerY -
		paddleHeight / 2;


	clampPaddle(
		paddle
	);
}


function stopDragging(
	paddle,
	event
) {

	if (
		event.pointerId !==
		paddle.pointerId
	) {

		return;
	}


	paddle.pointerId = null;
}


// LEFT PADDLE

paddleLeft.body.addEventListener(
	"pointerdown",

	function(event) {

		startDragging(
			paddleLeft,
			event
		);
	}
);


paddleLeft.body.addEventListener(
	"pointermove",

	function(event) {

		moveDraggedPaddle(
			paddleLeft,
			event
		);
	}
);


paddleLeft.body.addEventListener(
	"pointerup",

	function(event) {

		stopDragging(
			paddleLeft,
			event
		);
	}
);


paddleLeft.body.addEventListener(
	"pointercancel",

	function(event) {

		stopDragging(
			paddleLeft,
			event
		);
	}
);


// RIGHT PADDLE

paddleRight.body.addEventListener(
	"pointerdown",

	function(event) {

		startDragging(
			paddleRight,
			event
		);
	}
);


paddleRight.body.addEventListener(
	"pointermove",

	function(event) {

		moveDraggedPaddle(
			paddleRight,
			event
		);
	}
);


paddleRight.body.addEventListener(
	"pointerup",

	function(event) {

		stopDragging(
			paddleRight,
			event
		);
	}
);


paddleRight.body.addEventListener(
	"pointercancel",

	function(event) {

		stopDragging(
			paddleRight,
			event
		);
	}
);


// --------------------------------
// KEYBOARD PADDLE MOVEMENT
// --------------------------------

function movePaddles() {

	if (
		paddleLeft.pointerId === null
	) {

		if (upPressed) {

			paddleLeft.y -=
				paddleLeft.speed;
		}


		if (downPressed) {

			paddleLeft.y +=
				paddleLeft.speed;
		}
	}


	if (
		paddleRight.pointerId === null
	) {

		if (rightUpPressed) {

			paddleRight.y -=
				paddleRight.speed;
		}


		if (rightDownPressed) {

			paddleRight.y +=
				paddleRight.speed;
		}
	}


	clampPaddle(
		paddleLeft
	);


	clampPaddle(
		paddleRight
	);
}


// --------------------------------
// COLLISION
// --------------------------------

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


// --------------------------------
// BALL POSITION
// --------------------------------

function updateBallPosition() {

	ball.body.style.left =
		ball.x + "%";


	ball.body.style.top =
		ball.y + "%";
}


// --------------------------------
// CENTER BALL
// --------------------------------

function centerBall() {

	let ballWidth =
		getWidthPercent(
			ball.body
		);


	let ballHeight =
		getHeightPercent(
			ball.body
		);


	ball.x =
		(100 - ballWidth) / 2;


	ball.y =
		(100 - ballHeight) / 2;


	updateBallPosition();
}


// --------------------------------
// BALL MOVEMENT
// --------------------------------

function moveBall() {

	if (!roundActive) {

		return;
	}


	ball.x +=
		ball.speedX;


	ball.y +=
		ball.speedY;


	let ballHeight =
		getHeightPercent(
			ball.body
		);


	// TOP WALL

	if (ball.y <= 0) {

		ball.y = 0;

		ball.speedY *= -1;
	}


	// BOTTOM WALL

	if (
		ball.y +
		ballHeight >=
		100
	) {

		ball.y =
			100 -
			ballHeight;


		ball.speedY *= -1;
	}


	updateBallPosition();
}


// --------------------------------
// PADDLE BOUNCE
// --------------------------------

function bounceOffPaddle(
	paddle
) {

	playRandomPaddleSound();


	let paddleRect =
		paddle.body
		.getBoundingClientRect();


	let ballRect =
		ball.body
		.getBoundingClientRect();


	let paddleCenter =
		paddleRect.top +
		paddleRect.height / 2;


	let ballCenter =
		ballRect.top +
		ballRect.height / 2;


	let hitPosition =
		(
			ballCenter -
			paddleCenter
		) /
		(
			paddleRect.height /
			2
		);


	hitPosition =
		Math.max(
			-1,
			Math.min(
				1,
				hitPosition
			)
		);


	// REVERSE BALL

	ball.speedX *= -1;


	// CHANGE ANGLE

	ball.speedY =
		hitPosition *
		0.65;


	// SPEED UP

	if (
		Math.abs(
			ball.speedX
		) <
		ball.maxSpeedX
	) {

		ball.speedX *=
			1.05;
	}
}


// --------------------------------
// COLLISION CHECK
// --------------------------------

function checkCollisions() {

	if (!roundActive) {

		return;
	}


	let gameRect =
		getGameRect();


	// LEFT

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
			(
				(
					paddleRect.right -
					gameRect.left
				) /
				gameRect.width
			) * 100;


		updateBallPosition();
	}


	// RIGHT

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


		let ballWidth =
			getWidthPercent(
				ball.body
			);


		ball.x =
			(
				(
					paddleRect.left -
					gameRect.left
				) /
				gameRect.width
			) * 100
			-
			ballWidth;


		updateBallPosition();
	}
}


// --------------------------------
// SCORE
// --------------------------------

function checkScore() {

	if (!roundActive) {

		return;
	}


	let gameRect =
		getGameRect();


	let ballRect =
		ball.body
		.getBoundingClientRect();


	// RIGHT SCORES

	if (
		ballRect.left <=
		gameRect.left
	) {

		rightScore++;


		rightScoreText.textContent =
			rightScore;


		startNextRound(
			-1
		);


		return;
	}


	// LEFT SCORES

	if (
		ballRect.right >=
		gameRect.right
	) {

		leftScore++;


		leftScoreText.textContent =
			leftScore;


		startNextRound(
			1
		);


		return;
	}
}


// --------------------------------
// ROUND COUNTDOWN
// --------------------------------

function startNextRound(
	direction
) {

	roundActive = false;


	ball.speedX = 0;

	ball.speedY = 0;


	centerBall();


	if (
		countdownTimer !== null
	) {

		clearInterval(
			countdownTimer
		);
	}


	let countdown = 3;


	countdownText.textContent =
		countdown;


	countdownTimer =
		setInterval(
			function() {

				countdown--;


				if (
					countdown > 0
				) {

					countdownText.textContent =
						countdown;
				}


				else if (
					countdown === 0
				) {

					countdownText.textContent =
						"GO!";
				}


				else {

					clearInterval(
						countdownTimer
					);


					countdownTimer =
						null;


					countdownText.textContent =
						"";


					startBall(
						direction
					);
				}

			},

			1000
		);
}


// --------------------------------
// START BALL
// --------------------------------

function startBall(
	direction
) {

	ball.speedX =
		ball.startSpeedX *
		direction;


	ball.speedY =
		(
			Math.random() -
			0.5
		) * 0.5;


	roundActive = true;
}


// --------------------------------
// RESIZING
// --------------------------------

function resizeGame() {

	clampPaddle(
		paddleLeft
	);


	clampPaddle(
		paddleRight
	);


	if (!roundActive) {

		centerBall();
	}


	else {

		updateBallPosition();
	}
}


window.addEventListener(
	"resize",
	resizeGame
);


window.addEventListener(
	"orientationchange",

	function() {

		setTimeout(
			resizeGame,
			150
		);
	}
);


// STOP LONG PRESS MENU

document.addEventListener(
	"contextmenu",

	function(event) {

		event.preventDefault();
	}
);


// --------------------------------
// GAME LOOP
// --------------------------------

setInterval(
	function() {

		movePaddles();

		moveBall();

		checkCollisions();

		checkScore();

	},

	10
);


// --------------------------------
// START GAME
// --------------------------------

requestAnimationFrame(
	function() {

		updatePaddlePosition(
			paddleLeft
		);


		updatePaddlePosition(
			paddleRight
		);


		centerBall();


		startNextRound(

			Math.random() < 0.5

				? -1

				: 1
		);
	}
);
