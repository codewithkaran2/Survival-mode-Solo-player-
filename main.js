// main.js
// Utility function to load a script dynamically with error handling.
function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.defer = true;
  script.onload = callback;
  script.onerror = () => console.error(`Failed to load script: ${url}`);
  document.body.appendChild(script);
}

// Generic function to start any game mode by loading its script and calling its initializer.
function startMode(scriptUrl, startFunctionName) {
  loadScript(scriptUrl, () => {
    const startFunc = window[startFunctionName];
    if (typeof startFunc === "function") {
      startFunc();
    } else {
      console.error(`Function ${startFunctionName} not found.`);
    }
  });
}

// Start Duo Mode: loads duoMode.js and calls duoStartGame.
function startGame() {
  startMode("duoMode.js", "duoStartGame");
}

// Start Survival Mode: loads survivalMode.js and calls survivalStartGame.
// Survival Mode Features:
// - Single Player (Player 1 fights alone)
// - Endless AI Enemies (keep spawning over time)
// - Different Enemy Types (fast, tanky, shielded)
// - Difficulty Scaling (enemies get stronger over time)
// - Game over condition when Player 1 dies
// - UI & Score System to display a survival timer or score
function startSurvivalMode() {
  startMode("survivalMode.js", "survivalStartGame");
}

// Expose the game start functions globally.
window.startGame = startGame;
window.startSurvivalMode = startSurvivalMode;
