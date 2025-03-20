// survivalMode.js

// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state variables
let gameInterval, spawnInterval;
let survivalTimer = 0;
let lastTime = performance.now();
let gameOver = false;
let difficultyMultiplier = 1;

// Player object (single player)
const player = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  radius: 25,
  health: 100,
  color: "blue"
};

// Enemy class definition with different types
class Enemy {
  constructor(type) {
    this.type = type;
    this.x = Math.random() * canvas.width;
    this.y = -50;
    // Base attributes
    if (type === "fast") {
      this.speed = 3 * difficultyMultiplier;
      this.health = 20 * difficultyMultiplier;
      this.color = "orange";
    } else if (type === "tank") {
      this.speed = 1.5 * difficultyMultiplier;
      this.health = 50 * difficultyMultiplier;
      this.color = "green";
    } else if (type === "shielded") {
      this.speed = 2 * difficultyMultiplier;
      this.health = 30 * difficultyMultiplier;
      this.color = "purple";
      this.shield = true;
    } else {
      // default enemy
      this.speed = 2 * difficultyMultiplier;
      this.health = 30 * difficultyMultiplier;
      this.color = "red";
    }
    this.radius = 20;
  }
  
  update() {
    // Simple downward movement
    this.y += this.speed;
  }
  
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const enemies = [];

// Function to spawn an enemy with random type
function spawnEnemy() {
  const rand = Math.random();
  let type;
  if (rand < 0.33) type = "fast";
  else if (rand < 0.66) type = "tank";
  else type = "shielded";
  enemies.push(new Enemy(type));
}

// Function to update difficulty over time
function updateDifficulty(deltaTime) {
  survivalTimer += deltaTime / 1000; // timer in seconds
  // Every 10 seconds, increase difficulty multiplier
  if (Math.floor(survivalTimer) % 10 === 0) {
    difficultyMultiplier = 1 + survivalTimer / 30;
  }
}

// Function to update game objects
function updateGame(deltaTime) {
  updateDifficulty(deltaTime);
  
  // Update enemies and remove if off-canvas
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    if (enemies[i].y - enemies[i].radius > canvas.height) {
      enemies.splice(i, 1);
    }
  }
  
  // (Collision detection, shooting, etc. would be added here)
  
  // For demonstration, simulate player damage if an enemy reaches player zone
  enemies.forEach(enemy => {
    if (enemy.y + enemy.radius >= player.y - player.radius) {
      // Simplistic collision: reduce player health
      player.health -= 0.05 * difficultyMultiplier;
    }
  });
  
  if (player.health <= 0) {
    gameOver = true;
    clearInterval(spawnInterval);
  }
}

// Function to render game objects and UI
function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw player
  ctx.beginPath();
  ctx.fillStyle = player.color;
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw enemies
  enemies.forEach(enemy => enemy.draw());
  
  // Draw UI (survival timer and health)
  ctx.fillStyle = "#fff";
  ctx.font = "24px Roboto";
  ctx.fillText(`Time: ${Math.floor(survivalTimer)}s`, 20, 40);
  ctx.fillText(`Health: ${Math.floor(player.health)}`, 20, 70);
}

// Main game loop using requestAnimationFrame
function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  updateGame(deltaTime);
  renderGame();
  
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    // Show game over overlay (if needed)
    document.getElementById("gameOverScreen").classList.remove("hidden");
  }
}

// Start Survival Mode: hide start overlay, initialize variables, and begin game loop and enemy spawning
function startSurvivalMode() {
  // Hide the start screen
  document.getElementById("startScreen").classList.add("hidden");
  // Optionally, hide Player 2 name input if present
  const p2Input = document.getElementById("p2Name");
  if (p2Input) {
    p2Input.style.display = "none";
  }
  
  // Reset game variables
  player.health = 100;
  survivalTimer = 0;
  difficultyMultiplier = 1;
  enemies.length = 0;
  gameOver = false;
  lastTime = performance.now();
  
  // Start spawning enemies at an interval (spawn rate decreases over time)
  spawnInterval = setInterval(spawnEnemy, 1500 / difficultyMultiplier);
  
  // Start the game loop
  requestAnimationFrame(gameLoop);
  
  // Optionally, update the spawn interval over time for increasing spawn rate.
  setInterval(() => {
    if (!gameOver) {
      clearInterval(spawnInterval);
      // Increase spawn frequency as difficulty increases
      spawnInterval = setInterval(spawnEnemy, Math.max(500, 1500 / difficultyMultiplier));
    }
  }, 5000);
}

// Expose the startSurvivalMode function globally
window.startSurvivalMode = startSurvivalMode;
