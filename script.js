  // Get the canvas element and its context
  const canvas = document.getElementById('pongCanvas');
  const ctx = canvas.getContext('2d');

  // Create the paddles
  const paddleWidth = 10, paddleHeight = 60;
  const leftPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
  const rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };

  // Create the ball
  const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speedX: 5, speedY: 5 };

  // Draw function to render the paddles and ball
  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }

  // Update function to handle game logic
  function update() {
    // Move the ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Bounce off the top and bottom edges
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.speedY = -ball.speedY;
    }

    // Bounce off paddles
    if (
      (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) ||
      (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height)
    ) {
      ball.speedX = -ball.speedX;
    }

    // Check for scoring
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      // Reset ball position
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }
  }

  // Game loop
  function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  gameLoop();
