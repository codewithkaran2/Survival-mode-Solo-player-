// Utility function to load a script dynamically with error handling.
function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.defer = true;
  script.onload = callback;
  script.onerror = function () {
    console.error(`Failed to load script: ${url}`);
  };
  document.body.appendChild(script);
}

// Start duo mode game function that loads duoMode.js
function startGame() {
  loadScript("duoMode.js", function () {
    if (typeof duoStartGame === "function") {
      duoStartGame();
    } else {
      console.error("Function duoStartGame not found.");
    }
  });
}

// Start survival mode game function that loads survivalMode.js
function startSurvivalModeLoader() {
  loadScript("survivalMode.js", function () {
    if (typeof startSurvivalMode === "function") {
      startSurvivalMode();
    } else {
      console.error("Function startSurvivalMode not found.");
    }
  });
}

// Expose functions globally.
window.startGame = startGame;
window.startSurvivalModeLoader = startSurvivalModeLoader;
