import {getCurrentUser, resetCurrentUser} from './services/user-service.js';
import {
    FANCY_BUTTON_CLASS,
    GAME_LOST_CLASS,
    GAME_WON_CLASS,
} from './models/constants.js';
import {escape, isEmpty, sleep} from './utils.js';
import {showWelcomeSection} from './services/page-navigation-service.js';
import {evaluateHand, HANDS} from './services/game-service.js';
import {getMoveHistory} from './services/game-move-history-service.js';

const usernameLabel = document.getElementById('username-label');
const computerHandLabel = document.getElementById('computer-hand-label');
const logoutButton = document.getElementById('logout-button');
const handButtons = document.getElementById('hand-buttons');
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
        gameHistorySection.innerHTML = 'no data to show';
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

function getHandButtons() {
    return Array.from(handButtons.childNodes)
        .filter((childNode) => childNode.type === 'button');
}

async function evaluateUserAnswer(playerHand, event) {
    getHandButtons()
        .forEach((button) => {
            button.disabled = true;
        });
    await evaluateHand(getCurrentUser().name, playerHand, async (res) => {
        if (res.gameEval !== 0) {
            event.target.classList.add(res.gameEval === -1 ? GAME_LOST_CLASS : GAME_WON_CLASS);
            event.target.classList.remove(FANCY_BUTTON_CLASS);
        }
        updateGameHistoryTable();
        computerHandLabel.innerHTML = `vs <span class="text-bold">${res.systemHand}</span>`;
        await showCountdown(3);
        countdownLabel.innerText = 'vs';
        computerHandLabel.innerHTML = '?';
        if (res.gameEval !== 0) {
            event.target.classList.add(FANCY_BUTTON_CLASS);
            event.target.classList.remove(res.gameEval === -1 ? GAME_LOST_CLASS : GAME_WON_CLASS);
        }
        getHandButtons()
            .forEach((button) => {
                button.disabled = false;
            });
    });
}

export default function startGame() {
    usernameLabel.innerText = getCurrentUser().name;
    updateGameHistoryTable();
    countdownLabel.innerText = 'vs';
    computerHandLabel.innerHTML = '?';
}

function initializeEventListeners() {
    handButtons.innerHTML = HANDS.map((hand) => `<button type="button" class="fancy-button bt-1" id="${hand}-button">${hand}</button>`)
        .join('');
    handButtons.addEventListener('click', async (event) => {
        if (event.target.type === 'button') {
            await evaluateUserAnswer(event.target.innerText, event);
        }
    });
    logoutButton.addEventListener('click', () => {
        resetCurrentUser();
        showWelcomeSection();
    });
}

initializeEventListeners();
