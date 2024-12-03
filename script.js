const wordContainer = document.querySelector('.word');
const correctCountElement = document.querySelector('.correct-count');
const wrongCountElement = document.querySelector('.wrong-count');
const wordMistakesElement = document.querySelector('.word-mistakes');
const timerElement = document.querySelector('#timer');

const words = ['apple', 'keyboard', 'programming', 'computer', 'javascript', 'python', 'developer'];

let currentWord = '';
let currentCharIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let mistakes = 0;
let gameOver = false;
let timerInterval;
let startTime = Date.now();

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function displayWord(word) {
    wordContainer.innerHTML = '';
    word.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        wordContainer.append(span);
    });
}

function startNewWord() {
    mistakes = 0;
    checkGameOver();
    updateStats();
    currentWord = getRandomWord();
    currentCharIndex = 0;
    displayWord(currentWord);
}

function updateStats() {
    correctCountElement.textContent = correctCount;
    wrongCountElement.textContent = wrongCount;
    wordMistakesElement.textContent = mistakes;
}

function getElapsedTime() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return { minutes, seconds };
}

function updateTimer() {
    const { minutes, seconds } = getElapsedTime();
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function getFormattedTime() {
    const { minutes, seconds } = getElapsedTime();
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function checkGameOver() {
    if (correctCount === 5) {
        gameOver = true;
        if (confirm(`Победа! Ваше время ${getFormattedTime()}. Хотите сыграть снова?`)) {
            initGame();
        } else {
            stopTimer();
        }
        return;
    } else if (wrongCount === 5) {
        gameOver = true;
        if (confirm(`Вы проиграли! Ваше время ${getFormattedTime()}. Хотите сыграть снова?`)) {
            initGame();
        } else {
            stopTimer();
        }
        return;
    }
}

function initGame() {
    gameOver = false;
    correctCount = 0;
    wrongCount = 0;
    startNewWord();
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    const currentChar = currentWord[currentCharIndex];
    const inputChar = event.key.toLowerCase();

    if (!/^[a-zA-Z]$/.test(inputChar)) return;

    if (inputChar === currentChar) {
        wordContainer.children[currentCharIndex].classList.add('c');
        wordContainer.children[currentCharIndex].classList.remove('w');
        currentCharIndex++;
    } else {
        wordContainer.children[currentCharIndex].classList.add('w');
        mistakes++;
    }
    updateStats();

    if (currentCharIndex === currentWord.length) {
        if (mistakes === 0) {
            correctCount++;
        } else {
            wrongCount++;
        }

        updateStats();

        setTimeout(() => {
            startNewWord();
        }, 100);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});