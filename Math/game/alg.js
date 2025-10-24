console.log('Скрипт загружен');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM готов');
    const questionEl = document.getElementById('question');
    console.log('Элемент вопроса:', questionEl);
    startGame();
});


let currentLevel = 'primary'; // primary, intermediate, advanced
let correctAnswers = 0;
let incorrectAnswers = 0;
let questionCount = 0;
let timer;
let timeLeft = 270;
let usedQuestions = new Set();
let currentQuestion = null;

const levelNameEl = document.getElementById('levelName');
const timerEl = document.getElementById('timer');
const questionEl = document.getElementById('question');
const answerInputEl = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const resultEl = document.getElementById('result');
const correctCountEl = document.getElementById('correctCount');
const incorrectCountEl = document.getElementById('incorrectCount');
const messageEl = document.getElementById('message');
const endButtonsEl = document.getElementById('endButtons');
const endMessageEl = document.getElementById('endMessage');
const restartBtn = document.getElementById('restartBtn');
const exitBtn = document.getElementById('exitBtn');

// Названия уровней
const levelNames = {
    primary: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
};

function startGame() {
    resetGame();
    startTimer();
    generateQuestion();
}

function resetGame() {
    currentLevel = 'primary';
    correctAnswers = 0;
    incorrectAnswers = 0;
    questionCount = 0;
    usedQuestions.clear();
    timeLeft = 270;
    updateStats();
    levelNameEl.textContent = levelNames[currentLevel];
    messageEl.classList.add('hidden');
    endButtonsEl.classList.add('hidden');
    endMessageEl.classList.add('hidden');
    resultEl.textContent = '';
    answerInputEl.value = '';
    questionEl.textContent = 'Загрузка...';
    submitBtn.disabled = false;
}

// Запуск таймера
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame('Время вышло!');
            return;
        }
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `Время: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Генерация вопроса
function generateQuestion() {
    if (questionCount >= 10) {
        checkLevelCompletion();
        return;
    }

    let questionText, correctAnswer, questionKey;
    do {
        switch (currentLevel) {
            case 'primary':
                ({ questionText, correctAnswer } = generatePrimaryQuestion());
                break;
            case 'intermediate':
                ({ questionText, correctAnswer } = generateIntermediateQuestion());
                break;
            case 'advanced':
                ({ questionText, correctAnswer } = generateAdvancedQuestion());
                break;
        }
        questionKey = `${questionText}_${currentLevel}`;
    } while (usedQuestions.has(questionKey));

    usedQuestions.add(questionKey);

    usedQuestions.add(`${questionText}_${currentLevel}`);
    currentQuestion = { text: questionText, answer: correctAnswer };
    questionEl.textContent = questionText;
    answerInputEl.focus();
}

// Генерация вопроса для начального уровня (арифметика)
function generatePrimaryQuestion() {
    const operations = ['+', '-', '*', '/'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer;

    switch (op) {
        case '+':
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * a) + 1;
            answer = a - b;
            break;
        case '*':
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
            answer = a * b;
            break;
        case '/':
            b = Math.floor(Math.random() * 10) + 1;
            a = b * (Math.floor(Math.random() * 10) + 1);
            answer = a / b;
            break;
    }

    return { questionText: `${a} ${op} ${b}`, correctAnswer: answer };
}

// Генерация вопроса для среднего уровня (сравнения)
function generateIntermediateQuestion() {
    const operations = ['+', '-', '*', '/', '<', '>', '='];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer, questionText;

    if (['<', '>', '='].includes(op)) {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        switch (op) {
            case '<': answer = a < b; break;
            case '>': answer = a > b; break;
            case '=': answer = a === b; break;
        }
        questionText = `${a} ${op} ${b}`;
    } else {
        // Арифметика как в начальном уровне
        switch (op) {
            case '+':
                a = Math.floor(Math.random() * 20) + 1;
                b = Math.floor(Math.random() * 20) + 1;
                answer = a + b;
                break;
            case '-':
                a = Math.floor(Math.random() * 20) + 10;
                b = Math.floor(Math.random() * a) + 1;
                answer = a - b;
                break;
            case '*':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                answer = a * b;
                break;
            case '/':
                b = Math.floor(Math.random() * 10) + 1;
                a = b * (Math.floor(Math.random() * 10) + 1);
                answer = a / b;
                break;
        }
        questionText = `${a} ${op} ${b}`;
    }

    return { questionText, correctAnswer: answer };
}

// Генерация вопроса для продвинутого уровня (логика / бинарные)
function generateAdvancedQuestion() {
    const types = ['logic', 'binary'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'logic') {
        const ops = ['&&', '||', '!'];
        const op = ops[Math.floor(Math.random() * ops.length)];

        if (op === '!') {
            const a = Math.random() > 0.5;
            const answer = !a;
            return { questionText: `!${a}`, correctAnswer: answer };
        } else {
            const a = Math.random() > 0.5;
            const b = Math.random() > 0.5;
            let answer;
            if (op === '&&') answer = a && b;
            else if (op === '||') answer = a || b;
            return { questionText: `${a} ${op} ${b}`, correctAnswer: answer };
        }
    } else { // binary
        const a = Math.floor(Math.random() * 16); // 0-15
        const b = Math.floor(Math.random() * 16); // 0-15
        const operations = ['&', '|', '^'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        let answer;
        switch (op) {
            case '&': answer = a & b; break;
            case '|': answer = a | b; break;
            case '^': answer = a ^ b; break;
        }
        return {
            questionText: `${a.toString(2)} ${op} ${b.toString(2)}`,
            correctAnswer: answer
        };
    }
}

// Проверка ответа
function checkAnswer() {
    if (!currentQuestion) return;

    const userAnswer = answerInputEl.value.trim();
    if (!userAnswer) {
        resultEl.textContent = 'Введите ответ!';
        resultEl.style.color = '#e74c3c';
        return;
    }

    let isCorrect = false;
    let expected = currentQuestion.answer;

    // Для логических операций: true/false
    if (typeof expected === 'boolean') {
        isCorrect = (userAnswer.toLowerCase() === 'true' && expected === true) ||
            (userAnswer.toLowerCase() === 'false' && expected === false);
    } else if (typeof expected === 'number') {
        // Для чисел: округляем до целых, если деление
        const parsed = parseFloat(userAnswer);
        if (!isNaN(parsed)) {
            isCorrect = Math.abs(parsed - expected) < 0.001;
        }
    }

    if (isCorrect) {
        correctAnswers++;
        resultEl.textContent = 'Правильно!';
        resultEl.style.color = '#27ae60';
    } else {
        incorrectAnswers++;
        resultEl.textContent = `Неправильно! Правильный ответ: ${expected}`;
        resultEl.style.color = '#e74c3c';
    }

    updateStats();
    questionCount++;
    answerInputEl.value = '';
    answerInputEl.focus();

    if (questionCount < 10) {
        setTimeout(generateQuestion, 1000);
    } else {
        checkLevelCompletion();
    }
}

function updateStats() {
    correctCountEl.textContent = correctAnswers;
    incorrectCountEl.textContent = incorrectAnswers;
}

function checkLevelCompletion() {
    clearInterval(timer);

    const accuracy = (correctAnswers / 10) * 100;
    const passed = accuracy >= 80;

    if (currentLevel === 'advanced') {
        endGame(`Поздравляем! Вы прошли все уровни!\nПравильных ответов: ${correctAnswers}/10`);
        return;
    }

    if (passed) {
        messageEl.textContent = `Вы набрали ${accuracy}% — переходите на следующий уровень!`;
        messageEl.style.backgroundColor = '#d5f5e3';
        messageEl.style.borderLeftColor = '#27ae60';
        messageEl.classList.remove('hidden');

        setTimeout(() => {
            if (currentLevel === 'primary') {
                currentLevel = 'intermediate';
            } else if (currentLevel === 'intermediate') {
                currentLevel = 'advanced';
            }
            levelNameEl.textContent = levelNames[currentLevel];
            questionCount = 0;
            correctAnswers = 0;
            incorrectAnswers = 0;
            usedQuestions.clear();
            timeLeft = 270;
            updateStats();
            startTimer();
            generateQuestion();
            messageEl.classList.add('hidden');
        }, 2000);
    } else {
        endGame(`Вы набрали ${accuracy}% — недостаточно для перехода на следующий уровень.`);
    }
}

function endGame(message) {
    clearInterval(timer);
    submitBtn.disabled = true;
    answerInputEl.disabled = true;
    endMessageEl.textContent = message;
    endMessageEl.classList.remove('hidden');
    endButtonsEl.classList.remove('hidden');
}

function restartGame() {
    startGame();
}

function exitGame() {
    alert('Спасибо за игру!');
    window.close(); // или location.reload() для перезагрузки страницы
}

submitBtn.addEventListener('click', checkAnswer);
answerInputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
restartBtn.addEventListener('click', restartGame);
exitBtn.addEventListener('click', exitGame);

// Запуск игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    startGame();
});