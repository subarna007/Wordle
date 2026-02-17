const ROWS = 6;
const COLS = 5;

const boardEl = document.getElementById('board');
const msgEl = document.getElementById('message');
const playedEl = document.getElementById('played');
const wonEl = document.getElementById('won');
const streakEl = document.getElementById('streak');
const playerDisplayEl = document.getElementById('current-player-display');
const loginModal = document.getElementById('login-modal');
const nameInput = document.getElementById('player-name-input');
const leaderList = document.getElementById('leader-list');

let currentPlayer = null;
let secret = '';
let row = 0;
let col = 0;
let gameOver = false;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(''));

const KEYBOARD_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ENTERZXCVBNMBKSP'];
const keyStatePriority = { none: 0, absent: 1, present: 2, correct: 3 };
const keyStates = {};

function getPlayers() {
  return JSON.parse(localStorage.getItem('wordlePlayers') || '{}');
}

function savePlayers(players) {
  localStorage.setItem('wordlePlayers', JSON.stringify(players));
}

function getPlayerStats(name) {
  const players = getPlayers();
  if (!players[name]) players[name] = { played: 0, won: 0, streak: 0, bestStreak: 0 };
  savePlayers(players);
  return players[name];
}

function setPlayerStats(name, stats) {
  const players = getPlayers();
  players[name] = stats;
  savePlayers(players);
}

function updateStatsUI() {
  const s = getPlayerStats(currentPlayer);
  playedEl.textContent = s.played;
  wonEl.textContent = s.won;
  streakEl.textContent = s.streak;
}

function renderLeaderboard() {
  const players = getPlayers();
  const rows = Object.entries(players)
    .sort((a, b) => b[1].bestStreak - a[1].bestStreak)
    .slice(0, 10);

  leaderList.innerHTML = rows.length
    ? rows.map(([name, s], i) => `<div class="leader-row"><span>#${i + 1} ${name}</span><span>${s.bestStreak}</span></div>`).join('')
    : '<div class="leader-row"><span>No players yet</span><span>0</span></div>';
}

function showMessage(text, timeout = 1500) {
  msgEl.textContent = text;
  if (timeout) setTimeout(() => { if (msgEl.textContent === text) msgEl.textContent = ''; }, timeout);
}

function buildBoard() {
  boardEl.innerHTML = '';
  for (let r = 0; r < ROWS; r += 1) {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    for (let c = 0; c < COLS; c += 1) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.id = `tile-${r}-${c}`;
      rowEl.appendChild(tile);
    }
    boardEl.appendChild(rowEl);
  }
}

function buildKeyboard() {
  const [r1, r2, r3] = [document.getElementById('krow1'), document.getElementById('krow2'), document.getElementById('krow3')];
  [r1, r2, r3].forEach((rowEl) => { rowEl.innerHTML = ''; });

  KEYBOARD_ROWS[0].split('').forEach((k) => r1.appendChild(makeKey(k)));
  KEYBOARD_ROWS[1].split('').forEach((k) => r2.appendChild(makeKey(k)));

  r3.appendChild(makeKey('ENTER', true));
  'ZXCVBNM'.split('').forEach((k) => r3.appendChild(makeKey(k)));
  r3.appendChild(makeKey('⌫', true, 'BKSP'));
}

function makeKey(label, wide = false, keyValue = label) {
  const el = document.createElement('button');
  el.className = `key${wide ? ' wide' : ''}`;
  el.textContent = label;
  el.dataset.key = keyValue;
  el.addEventListener('click', () => handleInput(keyValue));
  return el;
}

function chooseWord() {
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
}

function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
  row = 0;
  col = 0;
  gameOver = false;
  secret = chooseWord();
  Object.keys(keyStates).forEach((k) => { delete keyStates[k]; });
  buildBoard();
  buildKeyboard();
  msgEl.textContent = '';
}

function fillTile() {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const tile = document.getElementById(`tile-${r}-${c}`);
      const letter = board[r][c];
      tile.textContent = letter;
      tile.classList.toggle('filled', !!letter);
    }
  }
}

function handleInput(rawKey) {
  if (!currentPlayer || gameOver) return;
  const key = rawKey.toUpperCase();

  if (key === 'ENTER') {
    submitGuess();
    return;
  }
  if (key === 'BACKSPACE' || key === 'BKSP' || key === '⌫') {
    if (col > 0) {
      col -= 1;
      board[row][col] = '';
      fillTile();
    }
    return;
  }
  if (/^[A-Z]$/.test(key) && col < COLS) {
    board[row][col] = key;
    col += 1;
    fillTile();
  }
}

function updateKey(letter, state) {
  const prev = keyStates[letter] || 'none';
  if (keyStatePriority[state] <= keyStatePriority[prev]) return;
  keyStates[letter] = state;
  const keyEl = document.querySelector(`.key[data-key="${letter}"]`);
  if (!keyEl) return;
  keyEl.classList.remove('absent', 'present', 'correct');
  keyEl.classList.add(state);
}

function scoreGuess(guess, target) {
  const result = Array(COLS).fill('absent');
  const counts = {};

  for (let i = 0; i < COLS; i += 1) {
    const ch = target[i];
    counts[ch] = (counts[ch] || 0) + 1;
  }

  for (let i = 0; i < COLS; i += 1) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
      counts[guess[i]] -= 1;
    }
  }

  for (let i = 0; i < COLS; i += 1) {
    if (result[i] === 'correct') continue;
    if (counts[guess[i]] > 0) {
      result[i] = 'present';
      counts[guess[i]] -= 1;
    }
  }
  return result;
}

function endGame(win) {
  const stats = getPlayerStats(currentPlayer);
  stats.played += 1;
  if (win) {
    stats.won += 1;
    stats.streak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  setPlayerStats(currentPlayer, stats);
  updateStatsUI();
  renderLeaderboard();
  gameOver = true;
}

function submitGuess() {
  if (col < COLS) {
    showMessage('Not enough letters');
    return;
  }
  const guess = board[row].join('').toLowerCase();
  // Accept any 5-letter input from the in-game keyboard.
  const score = scoreGuess(guess, secret);
  for (let i = 0; i < COLS; i += 1) {
    const tile = document.getElementById(`tile-${row}-${i}`);
    tile.classList.add(score[i]);
    updateKey(guess[i].toUpperCase(), score[i]);
  }

  if (guess === secret) {
    showMessage('You got it! 🎉', 2000);
    endGame(true);
    return;
  }

  row += 1;
  col = 0;

  if (row >= ROWS) {
    showMessage(`The word was ${secret.toUpperCase()}`, 4000);
    endGame(false);
  }
}

function setPlayer(name) {
  currentPlayer = name;
  playerDisplayEl.textContent = name;
  getPlayerStats(name);
  updateStatsUI();
  renderLeaderboard();
  loginModal.style.display = 'none';
  resetGame();
}

document.getElementById('login-btn').addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name.length < 2) {
    showMessage('Please enter at least 2 characters');
    return;
  }
  setPlayer(name);
  nameInput.value = '';
});

document.getElementById('new-game-btn').addEventListener('click', resetGame);
document.getElementById('switch-user-btn').addEventListener('click', () => {
  loginModal.style.display = 'flex';
  nameInput.focus();
});

document.addEventListener('keydown', (e) => {
  if (loginModal.style.display === 'flex' && e.key !== 'Enter') return;
  if (e.key === 'Enter' && loginModal.style.display === 'flex') {
    document.getElementById('login-btn').click();
    return;
  }
  handleInput(e.key === 'Backspace' ? 'BKSP' : e.key);
});

buildBoard();
buildKeyboard();
renderLeaderboard();
