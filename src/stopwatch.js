const startButton_el = document.getElementById('startButton');
const stopButton_el = document.getElementById('stopButton');
const lapButton_el = document.getElementById('lapButton');
const resetButton_el = document.getElementById('resetButton');
const resumeButton_el = document.getElementById('resumeButton');
const timeText_el = document.getElementById('timeText');
const lapTimeText_el = document.getElementById('lapTimeText');

const stopwatchTabButton_el = document.getElementById('stopwatchTabButton');
const timerTabButton_el = document.getElementById('timerTabButton');

const lapTimes_el = document.getElementById('lapTimes');

let timerInterval;
let lapNumber = 1;

let isPaused = false;
let pauseStart = 0;

function formatTime(milliseconds){
    const date = new Date(milliseconds);
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const millisecondsPart = date.getUTCMilliseconds();

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${millisecondsPart.toString().padStart(3, '0')}`;
};

function updateTimer() {
    if (!isPaused){
        const currentTime = Date.now() - startTime;
        const currentLapTime = Date.now() - startLapTime;
        timeText_el.textContent = formatTime(currentTime);
        lapTimeText_el.textContent = formatTime(currentLapTime);
    }
};

startButton_el.addEventListener('click', () => {
    stopwatchTabButton_el.style.display = 'none';
    timerTabButton_el.style.display = 'none';
    startTime = Date.now();
    startLapTime = Date.now();
    timerInterval = setInterval(updateTimer, 10);
    startButton_el.style.display = 'none';
    stopButton_el.style.display = 'inline-block';
    lapButton_el.style.display = 'inline-block';
    resetButton_el.style.display = 'none';
});

resumeButton_el.addEventListener('click', () => {
    if (isPaused){
        const pauseDuration = Date.now() - pauseStart;
        startTime += pauseDuration;
        startLapTime += pauseDuration;
        
        isPaused = false;
        timerInterval = setInterval(updateTimer, 10);
        resumeButton_el.style.display = 'none';
        resetButton_el.style.display = 'none';
        stopButton_el.style.display = 'inline-block';
        lapButton_el.style.display = 'inline-block';
    }
});


stopButton_el.addEventListener('click', () => {
    if (!isPaused){
        stopwatchTabButton_el.style.display = 'inline-block';
        timerTabButton_el.style.display = 'inline-block';
    
        clearInterval(timerInterval);

        pauseStart = Date.now();

        isPaused = true;
        resumeButton_el.style.display = 'inline-block';
        stopButton_el.style.display = 'none';
        lapButton_el.style.display = 'none';
        resetButton_el.style.display = 'inline-block';
    }
});

lapButton_el.addEventListener('click', () => {
    // Lap Elements
    const lapTimeContainer_el = document.createElement('div');
    lapTimeContainer_el.className = 'horizontal-container lap-style';
    lapTimeContainer_el.style = 'border-radius: 3px';

    const lapIndex_el = document.createElement('h5');
    const currentLapTime_el = document.createElement('h5');
    const overallTime_el = document.createElement('h5');

    lapTimeContainer_el.append(lapIndex_el, currentLapTime_el, overallTime_el);

    const lapTime = formatTime(Date.now() - startLapTime);
    const currentTime = formatTime(Date.now() - startTime);

    lapIndex_el.textContent = lapNumber;
    currentLapTime_el.textContent = lapTime;
    overallTime_el.textContent = currentTime;


    lapTimes_el.append(lapTimeContainer_el);


    lapTimeText_el.textContent = "00:00:000";
    startLapTime = Date.now();
    lapNumber++;
});

resetButton_el.addEventListener('click', () => {
    clearInterval(timerInterval);
    isPaused = false;
    startTime = 0;
    startLapTime = 0;
    timeText_el.textContent = "00:00:000";
    lapTimeText_el.textContent = "00:00:000";
    lapTimes_el.innerHTML = '';

    resumeButton_el.style.display = 'none';
    startButton_el.style.display = 'inline-block';
    pauseLapButton_el.style.display = 'none';
});

timerTabButton_el.addEventListener('click', () => {
    const timerLocation = 'timer.html';
    window.location.href = timerLocation;
    //window.resizeTo(350, 350);
});

document.addEventListener('DOMContentLoaded', () => {
    stopButton_el.style.display = 'none';
    lapButton_el.style.display = 'none';
    resumeButton_el.style.display = 'none';
    stopwatchTabButton_el.style.backgroundColor = '#1D88B9';
    stopwatchTabButton_el.style.color = '#1B1B1B'
    pauseLapButton_el.style.display = 'none';
});



