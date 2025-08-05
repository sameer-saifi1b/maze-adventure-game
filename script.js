let playerName = "";
let health = 100;
let inventory = [];
let highScore = localStorage.getItem("highScore") || 0;

const playerNameInput = document.getElementById("playerNameInput");
const startButton = document.getElementById("startButton");
const gameText = document.getElementById("gameText");
const choices = document.getElementById("choices");
const playerNameDisplay = document.getElementById("playerName");
const healthDisplay = document.getElementById("health");
const inventoryDisplay = document.getElementById("inventory");
const highScoreDisplay = document.getElementById("highScore");

highScoreDisplay.textContent = highScore;

startButton.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }
  playerName = name;
  document.getElementById("nameInputArea").classList.add("hidden");
  gameText.classList.remove("hidden");
  startGame();
});

function startGame() {
  health = 100;
  inventory = [];
  updateStatus();
  gameText.innerText = `Welcome, ${playerName}! Do you want to enter the maze?`;
  showButtons(["Yes", "No"], handleMazeEntry);
}

function showButtons(options, callback) {
  choices.innerHTML = "";
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => callback(option);
    choices.appendChild(btn);
  });
}

function handleMazeEntry(choice) {
  if (choice === "Yes") {
    gameText.innerText = "You see two paths: Left or Right?";
    showButtons(["Left", "Right"], handleMazePath);
  } else {
    gameText.innerText = "Maybe next time!";
    showRestartButton();
  }
}

function handleMazePath(choice) {
  if (choice === "Left") {
    gameText.innerText = "You find a fragile bridge. Cross it?";
    showButtons(["Yes", "No"], handleBridgeChoice);
  } else {
    health = 0;
    updateStatus();
    gameText.innerText = "You fell into a pit. Game Over.";
    checkHighScore();
    showRestartButton();
  }
}

function handleBridgeChoice(choice) {
  if (choice === "Yes") {
    health -= 40;
    updateStatus();
    gameText.innerText = "Bridge broke! You survived but lost 40 health.\nYou see a glowing cave. Enter it?";
    showButtons(["Yes", "No"], handleCaveChoice);
  } else {
    inventory.push("Torch");
    updateStatus();
    gameText.innerText = "Smart move! You found a Torch.\nYou see a glowing cave. Enter it?";
    showButtons(["Yes", "No"], handleCaveChoice);
  }
}

function handleCaveChoice(choice) {
  if (choice === "Yes") {
    if (inventory.includes("Torch")) {
      inventory.push("Magic Scroll");
      updateStatus();
      gameText.innerText = "You used the torch. Found a Magic Scroll!\nNow a monster appears! Fight or Run?";
      showButtons(["Fight", "Run"], handleMonsterChoice);
    } else {
      health -= 30;
      updateStatus();
      gameText.innerText = "You were bitten by bats in the dark and lost 30 health.\nNow a monster appears! Fight or Run?";
      showButtons(["Fight", "Run"], handleMonsterChoice);
    }
  } else {
    gameText.innerText = "You rested and recovered 10 health.";
    health += 10;
    updateStatus();
    checkHighScore();
    showRestartButton();
  }
}

function handleMonsterChoice(choice) {
  if (choice === "Fight") {
    if (inventory.includes("Magic Scroll")) {
      gameText.innerText = "You used the Magic Scroll and defeated the monster!\n🎉 You win!";
    } else {
      health -= 70;
      updateStatus();
      if (health <= 0) {
        gameText.innerText = "Monster was too strong. You died. Game Over.";
      } else {
        gameText.innerText = "You fought bravely and barely survived!";
      }
    }
  } else {
    health -= 20;
    updateStatus();
    gameText.innerText = "You escaped but got hurt. -20 health.";
  }
  checkHighScore();
  showRestartButton();
}

function showRestartButton() {
  showButtons(["🔁 Restart Game"], () => {
    document.getElementById("nameInputArea").classList.remove("hidden");
    gameText.classList.add("hidden");
    playerNameInput.value = "";
    choices.innerHTML = "";
    gameText.innerText = "";
  });
}

function updateStatus() {
  playerNameDisplay.textContent = playerName;
  healthDisplay.textContent = health;
  inventoryDisplay.textContent = inventory.length ? inventory.join(", ") : "None";
}

function checkHighScore() {
  if (health > highScore) {
    highScore = health;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
    gameText.innerText += `\n🎖️ New High Score: ${health}!`;
  }
}
