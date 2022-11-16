import { getCurrentUser, resetCurrentUser } from './services/user-service.js';
import { FOUNTAIN, GAME_LOST_CLASS, GAME_WON_CLASS, PAPER, SCISSORS, STONE, MATCH } from './models/constants.js';
import { isEmpty, sleep } from './utils.js';
import { showWelcomeSection } from './services/page-navigation-service.js';
import { evaluateHand, getRankings } from './services/game-service.js';
import { getMoveHistory } from './services/game-move-history-service.js';

const usernameLabel = document.getElementById('username-label');
const computerHandLabel = document.getElementById('computer-hand-label');
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

function updateGameHistoryTable() {
    const tableContent = getMoveHistory()
        .filter((item) => item.playerName === getCurrentUser().name)
        .map((item) => `<tr>
            <td>${item.points === 1 ? 'won' : 'lost'}</td>
            <td>${item.playerHand}</td>
            <td>${item.systemHand}</td>
            </tr>`);
    if (isEmpty(tableContent)) {
        gameHistoryDiv.innerHTML = '';
        return;
    }
    gameHistoryDiv.innerHTML = `<table><thead><tr><td>result</td><td>player</td><td>computer</td></tr></thead>${tableContent.join('')}</table>`;
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
    evaluateHand(getCurrentUser().name, playerHand, async (res) => {
        event.target.classList.add(res.gameEval === -1 ? GAME_LOST_CLASS : GAME_WON_CLASS);
        updateGameHistoryTable();
        computerHandLabel.innerText = `computer had ${res.systemHand}`;
        userGuessButtons.forEach((button) => { button.disabled = true; });
        await showCountdown(3);
        countdownLabel.innerText = 'vs';
        userGuessButtons.forEach((button) => { button.disabled = false; });
        computerHandLabel.innerText = '?';
        event.target.classList.remove(res.gameEval === -1 ? GAME_LOST_CLASS : GAME_WON_CLASS);
    });
}

export function startGame() {
    usernameLabel.innerText = getCurrentUser().name;
    logoutButton.addEventListener('click', () => {
        resetCurrentUser();
        showWelcomeSection();
        location.reload();
    });
    updateGameHistoryTable();
    countdownLabel.innerText = 'vs';
    computerHandLabel.innerText = '?';
}

schereButton.addEventListener('click', (ev) => evaluateUserAnswer(SCISSORS, ev));
steinButton.addEventListener('click', (ev) => evaluateUserAnswer(STONE, ev));
papierButton.addEventListener('click', (ev) => evaluateUserAnswer(PAPER, ev));
streichholzButton.addEventListener('click', (ev) => evaluateUserAnswer(MATCH, ev));
brunnenButton.addEventListener('click', (ev) => evaluateUserAnswer(FOUNTAIN, ev));
