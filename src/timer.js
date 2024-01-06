const stopwatchTabButton_el = document.getElementById('stopwatchTabButton');
const timerTabButton_el = document.getElementById('timerTabButton');

const timerText_el = document.getElementById('timerText');
const timerStartButton_el = document.getElementById('timerStartButton');
const timerResetButton_el = document.getElementById('timerResetButton');
const timerPauseButton_el = document.getElementById('timerPauseButton');
const timerUserInputDiv_el = document.getElementById('timerUserInputDiv');
const timerResumeButton_el = document.getElementById('timerResumeButton');

// Timer User Inputs
const hours_el = document.getElementById('hours');
const minutes_el = document.getElementById('minutes');
const seconds_el = document.getElementById('seconds');

let timeInSeconds = 0;
let timerInterval;
const timerTextDiv_el = document.getElementById('timerTextDiv');

let isPaused = false;

const preTimerButtons_el = document.querySelectorAll('[id^="preTimeButton"]');
const preTimerContainer_el = document.getElementById('preTimerContainer');

const notificationAudioSource = document.getElementById('notificationAudioSource');
const popupSetting_el = document.getElementById('foregroundDisplay');
const playerAlertSoundSetting_el = document.getElementById('playAlertSound');
notificationAudioSource.volume = 0.1;


preTimerButtons_el.forEach(button => {
    button.addEventListener('click', () => {
        switch(button.textContent){
            case '15 Minutes':
                hours_el.value = '0';
                seconds_el.value = '0';
                minutes_el.value = '15';
                break;
            case '30 Minutes':
                hours_el.value = '0';
                seconds_el.value = '0';
                minutes_el.value = '30';
                break;
            case '45 Minutes':
                hours_el.value = '0';
                seconds_el.value = '0';
                minutes_el.value = '45';
                break;
            case '1 Hour':
                minutes_el.value = '0';
                seconds_el.value = '0';
                hours_el.value = '1';
                break;
        }
    });
});

let timerWorker;

timerStartButton_el.addEventListener('click', () => {
  const hours = parseInt(hours_el.value) || 0;
  const minutes = parseInt(minutes_el.value) || 0;
  const seconds = parseInt(seconds_el.value) || 0;

  const timeInSeconds = hours * 3600 + minutes * 60 + seconds;

  if (timeInSeconds === 0) {
    timerStartButton_el.textContent = 'Add time to clock!';
    return false;
  } else {
    timerStartButton_el.textContent = 'Start';
  }

  timerText_el.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  enableTimer(true);
  timerWorker.postMessage({ command: 'start', timeInSeconds });
});

timerPauseButton_el.addEventListener('click', () => {
  if (!isPaused) {
    timerPauseButton_el.style.display = 'none';
    timerResumeButton_el.style.display = 'inline-block';
    timerResetButton_el.style.display = 'inline-block';
    timerWorker.postMessage({ command: 'pause' });
    isPaused = true;
  }
});

timerResumeButton_el.addEventListener('click', () => {
  if (isPaused) {
    timerResumeButton_el.style.display = 'none';
    timerPauseButton_el.style.display = 'inline-block';
    timerResetButton_el.style.display = 'none';
    timerWorker.postMessage({ command: 'resume' });
    isPaused = false;
  }
});

timerResetButton_el.addEventListener('click', () => {
  enableTimer(false);
  timerWorker.postMessage({ command: 'pause' }); // Pause the timer when resetting
  clearInterval(timerInterval);
  timerResumeButton_el.style.display = 'none';
  isPaused = false;
});

// Create a Web Worker
timerWorker = new Worker('timer-worker.js');

// Handle messages from the Web Worker
timerWorker.onmessage = function (event) {
  const { command, timeInSeconds } = event.data;

  if (command === 'update') {
    // Update the timer display
    const displayHours = Math.floor(timeInSeconds / 3600);
    const displayMinutes = Math.floor((timeInSeconds % 3600) / 60);
    const displaySeconds = timeInSeconds % 60;
    timerText_el.textContent = `${displayHours}:${displayMinutes < 10 ? '0' : ''}${displayMinutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
  } else if (command === 'timesUp') {
    // Handle timesUp event (e.g., show notification, play sound)
    timerText_el.textContent = 'Times Up!';
    timerPauseButton_el.style.display = 'none';
    timerResetButton_el.style.display = 'inline-block';
    if (playerAlertSoundSetting_el.checked) {
      notificationAudioSource.play();
    }
    if (popupSetting_el.checked) {
      api.appFocus();
    }
  }
};

function enableTimer(isEnabled){
    if (isEnabled){
        timerText_el.style.display = 'inline-block';
        timerTextDiv_el.style.display = 'inline-block';
        timerStartButton_el.style.display = 'none';
        timerResetButton_el.style.display = 'none';
        timerPauseButton_el.style.display = 'inline-block';
        timerUserInputDiv_el.style.display = 'none';
        preTimerContainer_el.style.display = 'none';
    } else {
        timerPauseButton_el.style.display = 'none';
        timerText_el.style.display = 'none';
        timerStartButton_el.style.display = 'inline-block';
        timerResetButton_el.style.display = 'none';
        timerUserInputDiv_el.style.display = 'inline-block';
        timerTextDiv_el.style.display = 'none';
        preTimerContainer_el.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    stopwatchTabButton_el.style.backgroundColor = '';

    timerTabButton_el.style.backgroundColor = '#1D88B9';
    timerTabButton_el.style.color = '#1B1B1B'
});

stopwatchTabButton_el.addEventListener('click', () => {
    timerTabButton_el.style.backgroundColor = '';
    stopwatchTabButton_el.style.backgroundColor = 'green';
    
    const stopwatchLocation = 'index.html';
    window.location.href = stopwatchLocation;
    window.resizeTo(350, 450);
});

