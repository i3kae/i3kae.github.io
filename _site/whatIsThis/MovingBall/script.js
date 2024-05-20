const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function Ball(x, y, radius, color, dx, dy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.dx = dx;
  this.dy = dy;

  this.draw = function () {
    const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.6, this.x, this.y, this.radius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
  };

  this.update = function () {
    this.x += this.dx;
    this.y += this.dy;

    // 화면 벗어나면 방향 변경
    if (this.x + this.radius > canvas.width + 200 || this.x - this.radius < -200) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height + 200 || this.y - this.radius < -200) {
      this.dy = -this.dy;
    }

    this.draw();
  };
}

function createRandomBall() {
  const radius = Math.random() * 200 + 300; // 반지름 범위 설정
  const x = Math.random() * (canvas.width - radius * 2) + radius;
  const y = Math.random() * (canvas.height - radius * 2) + radius;
  const dx = (Math.random() - 0.5) * 5; // x축 속도
  const dy = (Math.random() - 0.5) * 5; // y축 속도
  const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`; // 투명도를 1로 설정

  return new Ball(x, y, radius, color, dx, dy);
}

const balls = [];

for (let i = 0; i < 10; i++) {
  balls.push(createRandomBall());
}

function blendColors(color1, color2) {
  const r = Math.sqrt((color1.r * color1.r + color2.r * color2.r) / 2);
  const g = Math.sqrt((color1.g * color1.g + color2.g * color2.g) / 2);
  const b = Math.sqrt((color1.b * color1.b + color2.b * color2.b) / 2);
  return `rgba(${r}, ${g}, ${b}, 0.5)`; // 투명도 추가
}

function updateBallsColor() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const dx = balls[i].x - balls[j].x;
      const dy = balls[i].y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < balls[i].radius + balls[j].radius) {
        const color1 = balls[i].color;
        const color2 = balls[j].color;
        const blendedColor = blendColors(color1, color2);

        ctx.beginPath();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = blendedColor;
        ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2);
        ctx.arc(balls[j].x, balls[j].y, balls[j].radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateBallsColor();

  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
  }
}

animate();
