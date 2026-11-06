const COLORS = ["red", "blue", "yellow", "green"];

// Time between consecutive sequence flashes
const SPEEDS = {
  easy: 900,
  normal: 650,
  hard: 420,
  pro: 300,
};

// How long each pad remains illuminated
const FLASH_DURATIONS = {
  easy: 350,
  normal: 260,
  hard: 180,
  pro: 110,
};

const STORAGE = {
  best: "simon-says-best-v1",
  theme: "simon-says-theme-v1",
  sound: "simon-says-sound-v1",
  progress: "simon-says-progress-v1",
};

// Achievement milestones
const ACHIEVEMENTS = [
  {
    id: "level-5",
    icon: "🎯",
    title: "Getting Started",
    description: "Reach Level 5.",
    requirement: "Level 5",
  },
  {
    id: "level-10",
    icon: "🧠",
    title: "Memory Master",
    description: "Reach Level 10.",
    requirement: "Level 10",
  },
  {
    id: "level-15",
    icon: "⚡",
    title: "Quick Thinker",
    description: "Reach Level 15.",
    requirement: "Level 15",
  },
  {
    id: "level-20",
    icon: "👑",
    title: "Simon Legend",
    description: "Reach Level 20.",
    requirement: "Level 20",
  },
  {
    id: "level-25",
    icon: "🔥",
    title: "Unstoppable",
    description: "Reach Level 25.",
    requirement: "Level 25",
  },
  {
    id: "level-30",
    icon: "💎",
    title: "Perfect Recall",
    description: "Reach Level 30.",
    requirement: "Level 30",
  },
  {
    id: "level-40",
    icon: "🏆",
    title: "Grand Champion",
    description: "Reach Level 40.",
    requirement: "Level 40",
  },
  {
    id: "level-50",
    icon: "🌟",
    title: "Ultimate Genius",
    description: "Reach Level 50.",
    requirement: "Level 50",
  },
];

// Restore saved achievement progress
function readSavedProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE.progress) || "{}");

    return {
      highestLevel: Number(saved.highestLevel) || 0,
      unlocked: Array.isArray(saved.unlocked)
        ? saved.unlocked.filter((id) =>
            ACHIEVEMENTS.some((item) => item.id === id),
          )
        : [],
    };
  } catch {
    return {
      highestLevel: 0,
      unlocked: [],
    };
  }
}

const savedProgress = readSavedProgress();

let highestLevel = savedProgress.highestLevel;
let unlockedAchievements = new Set(savedProgress.unlocked);

// Save achievement progress
function saveProgress() {
  localStorage.setItem(
    STORAGE.progress,
    JSON.stringify({
      highestLevel,
      unlocked: [...unlockedAchievements],
    }),
  );
}

// Render achievement cards
function renderAchievements() {
  const grid = $("#achievements-grid");
  const count = $("#achievement-count");

  if (!grid || !count) return;

  count.textContent = `${unlockedAchievements.size} / ${ACHIEVEMENTS.length}`;

  grid.innerHTML = ACHIEVEMENTS.map((achievement) => {
    const unlocked = unlockedAchievements.has(achievement.id);

    return `
      <article class="achievement-card ${
        unlocked ? "is-unlocked" : "is-locked"
      }">
        <div class="achievement-icon" aria-hidden="true">
          ${achievement.icon}
        </div>

        <div class="achievement-copy">
          <h3>${achievement.title}</h3>
          <p>${achievement.description}</p>

          <span class="achievement-status">
            ${unlocked ? "✓ Unlocked" : `🔒 ${achievement.requirement}`}
          </span>
        </div>
      </article>
    `;
  }).join("");
}

// Unlock an achievement once
function unlockAchievement(id) {
  if (unlockedAchievements.has(id)) return;

  const achievement = ACHIEVEMENTS.find((item) => item.id === id);

  if (!achievement) return;

  unlockedAchievements.add(id);

  saveProgress();
  renderAchievements();

  setStatus(
    "Achievement unlocked!",
    `${achievement.icon} ${achievement.title} — ${achievement.description}`,
  );
}

// Check the eight level milestones
function checkLevelAchievements() {
  highestLevel = Math.max(highestLevel, level);

  saveProgress();

  const milestones = {
    5: "level-5",
    10: "level-10",
    15: "level-15",
    20: "level-20",
    25: "level-25",
    30: "level-30",
    40: "level-40",
    50: "level-50",
  };

  if (milestones[level]) {
    unlockAchievement(milestones[level]);
  }
}

const $ = (selector) => document.querySelector(selector);
const pads = [...document.querySelectorAll(".game-pad")];

const levelValue = $("#level-value");
const scoreValue = $("#score-value");
const bestValue = $("#best-value");
const statusTitle = $("#game-status");
const message = $("#game-message");
const progress = $("#progress-bar");
const progressLabel = $("#progress-label");
const roundLabel = $("#round-label");
const sequenceHint = $("#sequence-hint");

const startButton = $("#start-button");
const pauseButton = $("#pause-button");
const restartButton = $("#restart-button");
const difficultySelect = $("#difficulty-select");
const dialog = $("#game-over-dialog");

let gameSequence = [];
let userSequence = [];

let level = 0;
let score = 0;
let best = Number(localStorage.getItem(STORAGE.best) || 0);

let state = "ready";
let soundEnabled = localStorage.getItem(STORAGE.sound) !== "false";

let playbackTimer = null;
let audioContext = null;
let playbackToken = 0;

bestValue.textContent = best;

updateSoundButton();
loadTheme();

// Update game status
function setStatus(title, copy) {
  statusTitle.textContent = title;
  message.textContent = copy;
}

// Update scoreboard
function updateDashboard() {
  levelValue.textContent = level;
  scoreValue.textContent = score;
  bestValue.textContent = best;

  roundLabel.textContent = `ROUND ${String(level).padStart(2, "0")}`;

  sequenceHint.textContent = `SEQUENCE LENGTH: ${gameSequence.length}`;

  const completed = userSequence.length;

  progress.max = Math.max(gameSequence.length, 1);
  progress.value = completed;

  progressLabel.textContent = `${completed} / ${gameSequence.length}`;
}

// Load saved theme
function loadTheme() {
  const saved = localStorage.getItem(STORAGE.theme) || "forest";
  const selector = $("#theme-select");

  const valid = [...selector.options].some((option) => option.value === saved);

  const theme = valid ? saved : "forest";

  document.documentElement.setAttribute("data-theme", theme);
  selector.value = theme;
}

// Theme selection
$("#theme-select").addEventListener("change", (event) => {
  const theme = event.target.value;

  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE.theme, theme);
});

// Sound controls
function updateSoundButton() {
  $("#sound-icon").textContent = soundEnabled ? "♫" : "♪";
  $("#sound-label").textContent = soundEnabled ? "Sound on" : "Muted";

  $("#sound-toggle").setAttribute("aria-pressed", String(soundEnabled));
}

$("#sound-toggle").addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  localStorage.setItem(STORAGE.sound, String(soundEnabled));

  updateSoundButton();

  if (soundEnabled) playTone(520, 0.07);
});

// Generate sound
function playTone(frequency, duration = 0.16) {
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    audioContext ||= new AudioContextClass();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);

    gain.gain.exponentialRampToValueAtTime(
      0.12,
      audioContext.currentTime + 0.012,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration,
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch (error) {
    console.warn("Audio is unavailable.", error);
  }
}

function toneFor(color) {
  const tones = {
    red: 329.63,
    blue: 440,
    yellow: 523.25,
    green: 659.25,
  };

  playTone(tones[color]);
}

// Flash game pads
function flashPad(color, kind = "sequence") {
  const pad = pads.find((item) => item.dataset.color === color);

  if (!pad) return;

  const className = kind === "user" ? "is-user-flash" : "is-flashing";

  pad.classList.add(className);

  toneFor(color);

  const duration =
    kind === "user" ? 160 : FLASH_DURATIONS[difficultySelect.value];

  window.setTimeout(() => {
    pad.classList.remove(className);
  }, duration);
}

// Enable and disable controls
function setControls() {
  const active = state === "showing" || state === "input";

  startButton.disabled = active || state === "paused";

  startButton.textContent = state === "over" ? "↻ Play again" : "▶ Start game";

  pauseButton.disabled = !active && state !== "paused";

  pauseButton.textContent = state === "paused" ? "▶ Resume" : "Ⅱ Pause";

  difficultySelect.disabled = active || state === "paused";
}

// Clear pending playback
function clearPlayback() {
  playbackToken++;

  if (playbackTimer) {
    clearTimeout(playbackTimer);
    playbackTimer = null;
  }
}

// Start new game
function beginGame() {
  clearPlayback();

  dialog.close();

  gameSequence = [];
  userSequence = [];

  level = 0;
  score = 0;

  state = "showing";

  updateDashboard();
  setControls();

  setStatus(
    "Get ready...",
    "Watch the pads carefully. Your first sequence is coming up.",
  );

  window.setTimeout(() => {
    if (state === "showing" && level === 0) {
      nextRound();
    }
  }, 450);
}

// Start next level
function nextRound() {
  if (state === "paused" || state === "over") return;

  userSequence = [];

  level++;

  // Check achievement milestones for the new level
  checkLevelAchievements();

  const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];

  gameSequence.push(nextColor);

  state = "showing";

  updateDashboard();
  setControls();

  setStatus(
    "Watch the sequence",
    "Remember the colors in the order they light up.",
  );

  playSequence();
}

// Play sequence
function playSequence() {
  clearPlayback();

  const token = playbackToken;
  const delay = SPEEDS[difficultySelect.value];

  let index = 0;

  const showNext = () => {
    if (token !== playbackToken || state !== "showing") return;

    if (index >= gameSequence.length) {
      state = "input";

      setControls();

      setStatus(
        "Your turn!",
        "Repeat the sequence by clicking the pads or pressing 1–4.",
      );

      return;
    }

    flashPad(gameSequence[index]);

    index++;

    playbackTimer = window.setTimeout(showNext, delay);
  };

  playbackTimer = window.setTimeout(showNext, 420);
}

// Handle user input
function handlePadPress(color) {
  if (state !== "input") return;

  flashPad(color, "user");

  userSequence.push(color);

  const index = userSequence.length - 1;

  updateDashboard();

  // Check answer
  if (userSequence[index] !== gameSequence[index]) {
    endGame();
    return;
  }

  // Sequence completed successfully
  if (userSequence.length === gameSequence.length) {
    // Score increases only after completing a level
    score = level;

    // Update personal best
    if (score > best) {
      best = score;

      localStorage.setItem(STORAGE.best, String(best));
    }

    updateDashboard();

    state = "showing";

    setControls();

    setStatus("Perfect sequence!", "You got it. Get ready for the next level.");

    window.setTimeout(() => {
      if (state === "showing") {
        nextRound();
      }
    }, 850);
  }
}

// Game over
function endGame() {
  clearPlayback();

  state = "over";

  setControls();

  $("#final-score").textContent = score;
  $("#final-best").textContent = best;

  setStatus("Game over", `You reached level ${level}. Give it another shot!`);

  playTone(180, 0.35);

  window.setTimeout(() => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }, 350);
}

// Pause and resume
function togglePause() {
  if (state === "showing" || state === "input") {
    clearPlayback();

    state = "paused";

    setControls();

    setStatus("Game paused", "Take a breath. Resume when you're ready.");
  } else if (state === "paused") {
    state = "showing";

    setControls();

    setStatus(
      "Watch the sequence",
      "The full sequence will replay so you can pick up where you left off.",
    );

    playSequence();
  }
}

// Button events
startButton.addEventListener("click", beginGame);
restartButton.addEventListener("click", beginGame);
pauseButton.addEventListener("click", togglePause);

$("#play-again-button").addEventListener("click", beginGame);

$("#close-dialog-button").addEventListener("click", () => {
  dialog.close();
});

// Game pad events
pads.forEach((pad) => {
  pad.addEventListener("click", () => {
    handlePadPress(pad.dataset.color);
  });
});

// Keyboard controls
document.addEventListener("keydown", (event) => {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;

  const keyMap = {
    1: "red",
    2: "blue",
    3: "yellow",
    4: "green",
  };

  if (keyMap[event.key]) {
    event.preventDefault();

    handlePadPress(keyMap[event.key]);

    return;
  }

  if ((event.code === "Space" || event.key === "Enter") && state === "ready") {
    event.preventDefault();

    beginGame();
  }

  if (
    event.code === "Escape" &&
    (state === "showing" || state === "input" || state === "paused")
  ) {
    togglePause();
  }
});

// Initial setup
updateDashboard();
setControls();
renderAchievements();

$("#copyright-year").textContent = new Date().getFullYear();

document.documentElement.classList.add("styles-ready");

setStatus("Ready when you are", "Press Start game to begin your first round.");
