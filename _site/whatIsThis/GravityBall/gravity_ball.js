const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const numBalls = 1;
const ballRadius = 80;
const ballSizeUp = 1;

const gravity = 0.5; // 중력 가속도
const friction = 0.99; // 마찰 계수

function createBall(x, y, color) {
  return {
    x: x,
    y: y,
    radius: ballRadius,
    color: color,
    mass: 1,
    velocityX: 0,
    velocityY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastDragX: 0,
    lastDragY: 0,
    dragStartTime: 0,
    dragEndTime: 0,
  };
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function applyGravity(ball) {
  ball.velocityY += gravity;
}

function applyFriction(ball) {
  ball.velocityX *= friction;
  ball.velocityY *= friction;
}

function update(ball) {
  if (!ball.isDragging) {
    ball.y += ball.velocityY;
    ball.x += ball.velocityX;
  }

  // 바닥에 닿았을 때 튕기도록 설정
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.velocityY *= -0.6;
    applyFriction(ball);
  }

  // 좌우 벽에 닿았을 때 튕기도록 설정
  if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.velocityX *= -0.8;
    applyFriction(ball);
  } else if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.velocityX *= -0.8;
    applyFriction(ball);
  }

  // 화면 위로 빠져나갔을 때 화면 내부로 되돌리기
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.velocityY *= -0.6;
    applyFriction(ball);
  }

  for (let i = 0; i < balls.length; i++) {
    if (balls[i] !== ball) {
      detectCollision(ball, balls[i]);
    }
  }
}


function detectCollision(ballA, ballB) {
  const dx = ballB.x - ballA.x;
  const dy = ballB.y - ballA.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < ballA.radius + ballB.radius) {
    const angle = Math.atan2(dy, dx);
    const targetX = ballA.x + Math.cos(angle) * (ballA.radius + ballB.radius);
    const targetY = ballA.y + Math.sin(angle) * (ballA.radius + ballB.radius);
    const ax = (targetX - ballB.x) * 0.1;
    const ay = (targetY - ballB.y) * 0.1;

    ballA.velocityX -= ax;
    ballA.velocityY -= ay;
    ballB.velocityX += ax;
    ballB.velocityY += ay;

    applyFriction(ballA);
    applyFriction(ballB);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  clearCanvas();

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    drawBall(ball);
    applyGravity(ball);
    update(ball);
  }

  requestAnimationFrame(animate);
}

// Create balls with random positions
for (let i = 0; i < numBalls; i++) {
  const randomX = Math.random() * (canvas.width - ballRadius * 2) + ballRadius;
  const randomY = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
  const randomColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
  const ball = createBall(randomX, randomY, randomColor);
  balls.push(ball);
}

animate();

canvas.addEventListener('mousemove', function(e) {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    if (ball.isDragging) {
      // 드래그 중에 공의 크기를 키웁니다.
      ball.radius = ball.originalRadius * ballSizeUp;
      
      const offsetX = e.clientX - ball.dragStartX;
      const offsetY = e.clientY - ball.dragStartY;

      ball.x += offsetX;
      ball.y += offsetY;

      ball.lastDragX = ball.dragStartX;
      ball.lastDragY = ball.dragStartY;
      ball.dragStartX = e.clientX;
      ball.dragStartY = e.clientY;
    }
  }
});

canvas.addEventListener('mousedown', function(e) {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    const distX = e.clientX - ball.x;
    const distY = e.clientY - ball.y;

    if (Math.sqrt(distX * distX + distY * distY) < ball.radius) {
      ball.isDragging = true;
      ball.originalRadius = ball.radius; // 공의 초기 크기 저장
      ball.radius = ball.radius * ballSizeUp; // 드래그 중에 공의 크기를 키움
      ball.dragStartX = e.clientX;
      ball.dragStartY = e.clientY;
      ball.lastDragX = e.clientX;
      ball.lastDragY = e.clientY;
      ball.velocityX = 0;
      ball.velocityY = 0;
      ball.dragStartTime = Date.now();
    }
  }
});

canvas.addEventListener('mouseup', function(e) {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    if (ball.isDragging) {
      ball.isDragging = false;
      ball.radius = ball.originalRadius; // 드래그가 끝나면 다시 원래 크기로 돌아감
      ball.dragEndTime = Date.now();
      const dragDuration = ball.dragEndTime - ball.dragStartTime;

      if (dragDuration > 50) {
        const distX = ball.dragStartX - ball.lastDragX;
        const distY = ball.dragStartY - ball.lastDragY;

        ball.velocityX = distX * 0.05;
        ball.velocityY = distY * 0.05;
      }
    }
  }
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    if (ball.x + ball.radius > canvas.width) {
      ball.x = canvas.width - ball.radius;
    }
    if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius;
    }
  }
}

window.addEventListener('resize', function() {
  resizeCanvas();
});