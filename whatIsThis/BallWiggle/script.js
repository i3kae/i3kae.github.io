// script.js
const ball = document.getElementById('ball');
const screenWidth = window.innerWidth;
const ballWidth = 50; // Width of the ball

let direction = 1; // 1 for right, -1 for left
let speed = 5; // Movement speed

// Set the initial position and style of the ball
ball.style.position = 'absolute';
ball.style.left = '50%';
ball.style.transform = 'translateX(-50%)';
ball.style.top = '50px'; // You can adjust the vertical position as needed
ball.style.backgroundColor = 'red'; // Set the background color

function moveBall() {
    const currentLeft = parseInt(ball.style.left);

    if (currentLeft + ballWidth >= screenWidth || currentLeft <= 0) {
        direction = -direction; // Change direction when hitting the screen edges
    }

    ball.style.left = (currentLeft + direction * speed) + 'px';
    requestAnimationFrame(moveBall);
}

moveBall(); // Start the animation
