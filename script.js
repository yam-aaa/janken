const choices = ['✊', '✌️', '🖐️'];

let wins = 0;
let losses = 0;
let draws = 0;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, startTime = 0) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type; // 'sine', 'square', 'triangle', 'sawtooth'
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
}

// 各場面の効果音
const sounds = {
  click: () => {
    playTone(400, 'sine', 0.05);
  },
  win: () => {
    // 勝利音
    playTone(523.25, 'triangle', 0.1, 0);     // C5
    playTone(659.25, 'triangle', 0.1, 0.08);  // E5
    playTone(783.99, 'triangle', 0.1, 0.16);  // G5
    playTone(1046.50, 'triangle', 0.3, 0.24); // C6
  },
  lose: () => {
    // 敗北音
    playTone(300, 'sawtooth', 0.15, 0);
    playTone(220, 'sawtooth', 0.25, 0.12);
  },
  draw: () => {
    // 引き分け音
    playTone(440, 'sine', 0.08, 0);
    playTone(440, 'sine', 0.08, 0.1);
  },
  reset: () => {
    playTone(250, 'sine', 0.1, 0);
  }
};

// ==========================================
// ゲーム本体ロジック
// ==========================================
function playGame(playerChoice) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // コンピューターの手をランダムに決定
  const randomIndex = Math.floor(Math.random() * choices.length);
  const computerChoice = choices[randomIndex];

  const outcomeElement = document.getElementById('outcome');
  outcomeElement.className = 'outcome';

  // 勝敗判定とサウンド再生
  let resultText = '';
  if (playerChoice === computerChoice) {
    resultText = 'あいこ';
    outcomeElement.classList.add('draw');
    draws++;
    sounds.draw();
  } else if (
    (playerChoice === '✊' && computerChoice === '✌️') ||
    (playerChoice === '✌️' && computerChoice === '🖐️') ||
    (playerChoice === '🖐️' && computerChoice === '✊')
  ) {
    resultText = 'あなたの勝ち！';
    outcomeElement.classList.add('win');
    wins++;
    sounds.win();
  } else {
    resultText = 'あなたの負け...';
    outcomeElement.classList.add('lose');
    losses++;
    sounds.lose();
  }

  // 画面の更新
  document.getElementById('player-choice').textContent = playerChoice;
  document.getElementById('computer-choice').textContent = computerChoice;
  outcomeElement.textContent = resultText;

  document.getElementById('win-count').textContent = wins;
  document.getElementById('lose-count').textContent = losses;
  document.getElementById('draw-count').textContent = draws;
}

function resetGame() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  sounds.reset();

  wins = 0;
  losses = 0;
  draws = 0;

  const outcomeElement = document.getElementById('outcome');
  outcomeElement.className = 'outcome default';
  outcomeElement.textContent = 'ボタンを押してスタート';

  document.getElementById('player-choice').textContent = '❓';
  document.getElementById('computer-choice').textContent = '❓';

  document.getElementById('win-count').textContent = 0;
  document.getElementById('lose-count').textContent = 0;
  document.getElementById('draw-count').textContent = 0;
}