import { getCurrentUser, resetCurrentUser } from './user-service.js';
import { BRUNNEN, GAME_LOST_CLASS, GAME_WON_CLASS, PAPIER, SCHERE, STEIN, STREICHHOLZ } from './models/constants.js';
import { sleep } from './utils.js';
import { showWelcomeSection } from './page-navigation-service.js';
import { evaluateHand, getRankings } from './game-service.js';
import { getMoveHistory } from './game-move-history.js';

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

function updateGameHistoryTable() {
    const tableContent = getMoveHistory()
    .filter((item) => item.playerName === getCurrentUser().name)
    .map((item) => `<tr>
        <td>${item.points}</td>
        <td>${item.guessUser}</td>
        <td>${item.guessComputer}</td>
        </tr>`);
    gameHistoryDiv.innerHTML = `<table>${tableContent}</table>`;
}

async function showCountdown(numberStart) {
    countdownLabel.innerText = `${numberStart} sek bis zum nächsten Zug`;
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
        getRankings(); // todo remove
        userGuessButtons.forEach((button) => { button.disabled = true; });
        await showCountdown(3);
        countdownLabel.innerText = 'vs';
        userGuessButtons.forEach((button) => { button.disabled = false; });
        event.target.classList.remove(res.gameEval === -1 ? GAME_LOST_CLASS : GAME_WON_CLASS);
    });
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
