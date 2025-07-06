let startTime = 0;
let elapsed = 0;
let interval;
let isRunning = false;
let lastLap = 0;
let lapCount = 0;
let soundEnabled = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const themeToggle = document.getElementById('themeToggle');
const laps = document.getElementById('laps');

function formatTime(ms) {
  const milliseconds = String(ms % 1000).padStart(3, '0');
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
  const now = Date.now();
  elapsed = now - startTime;
  display.textContent = formatTime(elapsed);

  if (soundEnabled && Math.floor(elapsed / 1000) % 60 === 0 && elapsed > 0) {
    beep.play();
  }
}

startBtn.addEventListener('click', () => {
  if (!isRunning) {
    startTime = Date.now() - elapsed;
    interval = setInterval(updateDisplay, 50);
    isRunning = true;
  }
});

pauseBtn.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(interval);
  isRunning = false;
  elapsed = 0;
  lastLap = 0;
  lapCount = 0;
  display.textContent = '00:00:00.000';
  laps.innerHTML = '';
  localStorage.removeItem('laps');
});

lapBtn.addEventListener('click', () => {
  if (isRunning) {
    const lapTime = elapsed;
    const diff = lapTime - lastLap;
    lastLap = lapTime;
    lapCount++;
    const li = document.createElement('li');
    li.textContent = `Lap ${lapCount}: ${formatTime(lapTime)} (+${formatTime(diff)})`;
    laps.appendChild(li);
    saveLap(li.textContent);
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});


function saveLap(text) {
  const existing = JSON.parse(localStorage.getItem('laps')) || [];
  existing.push(text);
  localStorage.setItem('laps', JSON.stringify(existing));
}

function loadLaps() {
  const storedLaps = JSON.parse(localStorage.getItem('laps')) || [];
  storedLaps.forEach(lap => {
    const li = document.createElement('li');
    li.textContent = lap;
    laps.appendChild(li);
  });
}

window.onload = loadLaps;
