// timer-worker.js
let timeInSeconds = 0;
let timerInterval;

self.onmessage = function (event) {
  if (event.data.command === 'start') {
    timeInSeconds = event.data.timeInSeconds;
    timerInterval = setInterval(updateTimer, 1000);
  } else if (event.data.command === 'pause') {
    clearInterval(timerInterval);
  } else if (event.data.command === 'resume') {
    timerInterval = setInterval(updateTimer, 1000);
  }
};

function updateTimer() {
  if (timeInSeconds === 0) {
    self.postMessage({ command: 'timesUp' });
    clearInterval(timerInterval);
  } else {
    timeInSeconds--;
    self.postMessage({ command: 'update', timeInSeconds });
  }
}
