import {getCurrentUser, resetCurrentUser} from './services/user-service.js';
import {
    FOUNTAIN,
    GAME_LOST_CLASS,
    GAME_WON_CLASS,
    PAPER,
    SCISSORS,
    STONE,
    MATCH,
} from './models/constants.js';
import {escape, isEmpty, sleep} from './utils.js';
import {showWelcomeSection} from './services/page-navigation-service.js';
import {evaluateHand} from './services/game-service.js';
import {getMoveHistory} from './services/game-move-history-service.js';

const usernameLabel = document.getElementById('username-label');
const computerHandLabel = document.getElementById('computer-hand-label');
const logoutButton = document.getElementById('logout-button');

const scissorsButton = document.getElementById('scissors-button');
const stoneButton = document.getElementById('stone-button');
const paperButton = document.getElementById('paper-button');
const matchButton = document.getElementById('match-button');
const fountainButton = document.getElementById('fountain-button');
const userGuessButtons = [
    scissorsButton,
    stoneButton,
    paperButton,
    matchButton,
    fountainButton,
];

const gameHistorySection = document.getElementById('game-history-section');
const countdownLabel = document.getElementById('countdown-label');

function getMoveResultText(moveResultNumber) {
    if (moveResultNumber === 0) {
        return 'draw';
    }
    return moveResultNumber === 1 ? 'won' : 'lost';
}

function updateGameHistoryTable() {
    const tableContent = getMoveHistory()
        .reverse()
        .filter((item) => item.playerName === getCurrentUser().name)
        .map((item) => `<tr>
            <td>${escape(getMoveResultText(item.points))}</td>
            <td>${escape(item.playerHand)}</td>
            <td>${escape(item.systemHand)}</td>
            </tr>`);
    if (isEmpty(tableContent)) {
        gameHistorySection.innerHTML = '';
        return;
    }
    gameHistorySection.innerHTML = `<table><thead><tr><td>result</td><td>player</td><td>computer</td></tr></thead>${tableContent.join('')}</table>`;
}

async function showCountdown(numberStart) {
    countdownLabel.innerText = `${numberStart} seconds until next move`;
    if (numberStart <= 0) {
        return;
    }
    await sleep(1000);
    await showCountdown(numberStart - 1);
}

// todo show what computer result was

async function evaluateUserAnswer(playerHand, event) {
    userGuessButtons.forEach((button) => {
        button.disabled = true;
    });
    evaluateHand(getCurrentUser().name, playerHand, async (res) => {
        event.target.classList.add(res.gameEval === -1 ? GAME_LOST_CLASS : GAME_WON_CLASS);
        updateGameHistoryTable();
        computerHandLabel.innerText = `computer had ${res.systemHand}`;
        await showCountdown(3);
        countdownLabel.innerText = 'vs';
        computerHandLabel.innerText = '?';
        event.target.classList.remove(res.gameEval === -1 ? GAME_LOST_CLASS : GAME_WON_CLASS);
        userGuessButtons.forEach((button) => {
            button.disabled = false;
        });
    });
}

export default function startGame() {
    usernameLabel.innerText = getCurrentUser().name;
    logoutButton.addEventListener('click', () => {
        resetCurrentUser();
        showWelcomeSection();
        window.location.reload();
    });
    updateGameHistoryTable();
    countdownLabel.innerText = 'vs';
    computerHandLabel.innerText = '?';
}

scissorsButton.addEventListener('click', (ev) => evaluateUserAnswer(SCISSORS, ev));
stoneButton.addEventListener('click', (ev) => evaluateUserAnswer(STONE, ev));
paperButton.addEventListener('click', (ev) => evaluateUserAnswer(PAPER, ev));
matchButton.addEventListener('click', (ev) => evaluateUserAnswer(MATCH, ev));
fountainButton.addEventListener('click', (ev) => evaluateUserAnswer(FOUNTAIN, ev));
