let paddleLeft = {

	body:
		document.getElementById("left"),

	y: 37,

	height: 26,

	speed: 1.05,

	pointerId: null
};


let paddleRight = {

	body:
		document.getElementById("right"),

	y: 37,

	height: 26,

	speed: 1.05,

	pointerId: null
};


let ball = {

	body:
		document.getElementById("ball"),

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


paddleRight.body.style.top =
	paddleRight.y + "vh";


// DESKTOP KEYBOARD INPUT

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


// DRAGGING


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


	let pointerY =
		(event.clientY /
		window.innerHeight) *
		100;


	// CENTER PADDLE ON FINGER

	paddle.y =
		pointerY -
		paddle.height / 2;


	// TOP BOUNDARY

	if (paddle.y < 0) {

		paddle.y = 0;
	}


	// BOTTOM BOUNDARY

	if (
		paddle.y +
		paddle.height >
		100
	) {

		paddle.y =
			100 -
			paddle.height;
	}


	paddle.body.style.top =
		paddle.y + "vh";
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


// LEFT PADDLE DRAGGING

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


// RIGHT PADDLE DRAGGING

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


// DESKTOP PADDLE MOVEMENT

function movePaddles() {

	// Don't use keyboard movement
	// while that paddle is being dragged


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


	// LEFT TOP LIMIT

	if (paddleLeft.y < 0) {

		paddleLeft.y = 0;
	}


	// LEFT BOTTOM LIMIT

	if (
		paddleLeft.y +
		paddleLeft.height >
		100
	) {

		paddleLeft.y =
			100 -
			paddleLeft.height;
	}


	// RIGHT TOP LIMIT

	if (paddleRight.y < 0) {

		paddleRight.y = 0;
	}


	// RIGHT BOTTOM LIMIT

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


// BALL POSITION

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


	ball.x +=
		ball.speedX;


	ball.y +=
		ball.speedY;


	let ballRect =
		ball.body.getBoundingClientRect();


	let ballHeightVH =
		(ballRect.height /
		window.innerHeight) *
		100;


	// TOP

	if (ball.y <= 0) {

		ball.y = 0;

		ball.speedY *= -1;
	}


	// BOTTOM

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


	// ANGLE DEPENDS ON HIT LOCATION

	ball.speedY =
		hitPosition * 0.65;


	// SPEED UP AFTER HIT

	if (
		Math.abs(ball.speedX) <
		ball.maxSpeedX
	) {

		ball.speedX *= 1.05;
	}
}


// COLLISION CHECK

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
		ball.body
		.getBoundingClientRect();


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


// NEXT ROUND

function startNextRound(direction) {

	roundActive = false;


	ball.speedX = 0;

	ball.speedY = 0;


	centerBall();


	let countdown = 3;


	countdownText.textContent =
		countdown;


	let timer =
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
						timer
					);


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


// SCREEN RESIZE / ROTATION

window.addEventListener(
	"resize",
	function() {

		if (!roundActive) {

			centerBall();
		}
	}
);


// GAME LOOP

setInterval(
	function() {

		movePaddles();

		moveBall();

		checkCollisions();

		checkScore();

	},

	10
);


// START GAME

centerBall();


startNextRound(

	Math.random() < 0.5

		? -1

		: 1
);
