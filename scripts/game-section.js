import { getCurrentUser, resetCurrentUser } from './user-service.js';
import { BRUNNEN, PAPIER, SCHERE, STEIN, STREICHHOLZ } from './models/constants.js';
import { sleep } from './utils.js';
import { showWelcomeSection } from './page-navigation-service.js';
import GameHistory from './models/game-history.js';

const usernameLabel = document.getElementById('username-label');
const logoutButton = document.getElementById('logout-button');

const schereButton = document.getElementById('schere-button');
const steinButton = document.getElementById('stein-button');
const papierButton = document.getElementById('papier-button');
const streichholzButton = document.getElementById('streichholz-button');
const brunnenButton = document.getElementById('brunnen-button');
const userGuessButtons = [
    schereButton,
    steinButton,
    papierButton,
    streichholzButton,
    brunnenButton,
];

const gameHistoryDiv = document.getElementById('game-history');
const countdownLabel = document.getElementById('countdown-label');

const ruleMap = new Map([
    [SCHERE, [PAPIER, STREICHHOLZ]],
    [PAPIER, [STEIN, BRUNNEN]],
    [STEIN, [SCHERE, STREICHHOLZ]],
    [BRUNNEN, [STEIN, SCHERE]],
    [STREICHHOLZ, [PAPIER, BRUNNEN]],
]);

const gameHistory = [];

function updateGameHistoryTable() {
    const tableContent = gameHistory.map((item) => `<tr>
        <td>${item.userWins}</td>
        <td>${item.guessUser}</td>
        <td>${item.guessComputer}</td>
        </tr>`);
    gameHistoryDiv.innerHTML = `<table>${tableContent}</table>`;
}

function addGameHistoryItem(gameHistoryItem) {
    gameHistory.push(gameHistoryItem);
    updateGameHistoryTable();
}

function getComputerGuess() {
    const possibleResults = Array.from(ruleMap.keys());
    return possibleResults[Math.floor(Math.random() * possibleResults.length)];
}

async function showCountdown(numberStart) {
    countdownLabel.innerText = `${numberStart} sek bis zum nächsten Zug`;
    if (numberStart <= 0) {
        return;
    }
    await sleep(1000);
    await showCountdown(numberStart - 1);
}

async function evaluateUserAnswer(userAnswer, event) {
    console.log(event);
    const computerGuess = getComputerGuess();
    const evalZeroPoints = userAnswer === computerGuess;
    if (evalZeroPoints) {
        addGameHistoryItem(new GameHistory(undefined, userAnswer, computerGuess));
    } else {
        const userWins = ruleMap.get(userAnswer)
            .some((winnerAnswer) => computerGuess === winnerAnswer);
        addGameHistoryItem(new GameHistory(userWins, userAnswer, computerGuess));
    }
    userGuessButtons.forEach((button) => { button.disabled = true; });
    await showCountdown(3);
    countdownLabel.innerText = 'vs';
    userGuessButtons.forEach((button) => { button.disabled = false; });
}

export function startGame() {
    usernameLabel.innerText = getCurrentUser().name;
    logoutButton.addEventListener('click', () => {
        resetCurrentUser();
        showWelcomeSection();
        countdownLabel.innerText = 'vs';
    });
}

schereButton.addEventListener('click', (ev) => evaluateUserAnswer(SCHERE, ev));
steinButton.addEventListener('click', (ev) => evaluateUserAnswer(STEIN, ev));
papierButton.addEventListener('click', (ev) => evaluateUserAnswer(PAPIER, ev));
streichholzButton.addEventListener('click', (ev) => evaluateUserAnswer(STREICHHOLZ, ev));
brunnenButton.addEventListener('click', (ev) => evaluateUserAnswer(BRUNNEN, ev));
