// ==========================================
// 1. GLOBAL STATE VARIABLES
// ==========================================
let chosenWord = "";
let guessedLetters = [];
let livesRemaining = 10;
let isGameOver = false;

// ==========================================
// 2. GAME INITIALIZATION / FLOW
// ==========================================

// Start the process as soon as the script loads
loadGameWords();

function loadGameWords() {
  fetch("./assets/example-words.json")
    .then((response) => response.json())
    .then((wordsArray) => pickRandomWord(wordsArray))
    .catch((error) => console.error("Error loading words:", error));
}

function pickRandomWord(words) {
  const randomIndex = Math.floor(Math.random() * words.length);
  chosenWord = words[randomIndex].toUpperCase();
  console.log("The secret word is:", chosenWord);

  // Set up the initial screen visual state
  displayWordBlanks();
  generateKeyboard();
}

// ==========================================
// 3. DYNAMIC DOM RENDERING
// ==========================================

function displayWordBlanks() {
  const wordDisplay = document.getElementById("word-display");

  const displayString = chosenWord
    .split("")
    .map((letter) => {
      // If the letter has been guessed, reveal it; otherwise hide it
      if (guessedLetters.includes(letter)) {
        return letter;
      } else {
        return "*";
      }
    })
    .join(" ");

  wordDisplay.innerText = displayString;
}

function generateKeyboard() {
  const keyboardContainer = document.getElementById("keyboard-container");
  keyboardContainer.innerHTML = ""; // Clear keyboard for a fresh game

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  alphabet.forEach((letter) => {
    const button = document.createElement("button");
    button.innerText = letter;
    button.id = `btn-${letter}`;
    button.classList.add("letter-btn");

    // Click event handler
    button.addEventListener("click", () => {
      handleGuess(letter);
    });

    keyboardContainer.appendChild(button);
  });
}

// ==========================================
// 4. CORE GAME ENGINE LOGIC
// ==========================================

function handleGuess(letter) {
  letter = letter.toUpperCase();

  // If game is over or letter was already processed, reject input
  if (isGameOver || guessedLetters.includes(letter)) return;

  // Log the guess
  guessedLetters.push(letter);

  // Grey out and disable the corresponding screen button
  const button = document.getElementById(`btn-${letter}`);
  if (button) {
    button.disabled = true;
    button.classList.add("disabled");
  }

  // Evaluate the guess outcome
  if (chosenWord.includes(letter)) {
    displayWordBlanks();
    checkWinCondition();
  } else {
    livesRemaining--;

    // 1. Find the counter element on the screen
    const counterElement = document.getElementById("lives-counter");

    // 2. Update the text number
    counterElement.innerText = livesRemaining;

    // 3. Check if lives are low and switch the color to red
    if (livesRemaining <= 3) {
      counterElement.style.color = "#d9534f"; // Warning red color
      counterElement.style.fontWeight = "bold"; // Optional: make it pop extra!
    }
    // 🚀 2. DYNAMICALLY SWAP THE HANGMAN IMAGE HERE
    const imageNumber = 10 - livesRemaining; // Calculates 1, 2, 3, etc.
    const hangmanImage = document.getElementById("hangman-pic");

    if (hangmanImage) {
      // Updates the image path dynamically using a template literal
      hangmanImage.src = `./assets/img/h-${imageNumber}.jpg`;
      hangmanImage.alt = `hangman stage ${imageNumber}`;
    }

    console.log(`Wrong guess! Lives remaining: ${livesRemaining}`);

    if (livesRemaining <= 0) {
      endGame(false);
    }
  }
}

function checkWinCondition() {
  const wordDisplay = document.getElementById("word-display").innerText;
  if (!wordDisplay.includes("*")) {
    endGame(true);
  }
}

function endGame(isWin) {
  isGameOver = true;

  if (isWin) {
    alert("Congratulations! You guessed the word!");
  } else {
    alert("You are dead. Refresh the page to try again!");
    window.location.reload(); // Refresh window to reset game state
  }
}

// ==========================================
// 5. GLOBAL EVENT LISTENERS
// ==========================================

window.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();

  // Sanitize input to only fire on valid letters A-Z
  if (key.length === 1 && key >= "A" && key <= "Z") {
    handleGuess(key);
  }
});
