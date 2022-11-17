import startGame from './game-section.js';
import {getRankings, setConnected} from './services/game-service.js';
import {
    hideAllSections,
    onSectionChanged,
    showGameSection,
    showWelcomeSection,
} from './services/page-navigation-service.js';
import {getCurrentUser, initUserService, setCurrentUser} from './services/user-service.js';
import {escape, getLoader, isEmpty, loady} from './utils.js';

const usernameInput = document.getElementById('username-input');
const rankingSection = document.getElementById('ranking-section');
const usernameInputButton = document.getElementById('username-input-button');
const onlineOfflineCheckbox = document.getElementById('online-offline-checkbox');
const onlineOfflineLabel = document.getElementById('online-offline-label');

function loadUserRangings() {
    rankingSection.innerHTML = getLoader();
    getRankings((rankings) => {
        if (isEmpty(rankings)) {
            rankingSection.innerHTML = '';
            return;
        }
        rankingSection.innerHTML = rankings
            .map((rankingEntry) => `<p><span class="text-bold">${escape(rankingEntry.rank)}.</span><br> ${escape(rankingEntry.wins)} wins<br /><span>${escape(rankingEntry.players.join(', '))}</span></p>`)
            .join('');
    });
}

function startGameByUserInput() {
    if (!usernameInput.value) {
        return;
    }
    showGameSection();
    setCurrentUser(usernameInput.value);
    startGame();
}

function init() {
    hideAllSections();
    initUserService();
    if (getCurrentUser()) {
        showGameSection();
        startGame();
        return;
    }
    showWelcomeSection();
    loadUserRangings();
    usernameInputButton.disabled = true;
    usernameInput.addEventListener('keyup', () => {
        usernameInputButton.disabled = (usernameInput.value ?? '').split(' ')
            .join('') === '';
    });
    usernameInputButton.addEventListener('click', () => startGameByUserInput());
    usernameInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            startGameByUserInput();
        }
    });
}

onlineOfflineCheckbox.addEventListener('click', () => {
    onlineOfflineLabel.innerText = onlineOfflineCheckbox.checked ? 'online' : 'offline';
    setConnected(onlineOfflineCheckbox.checked);
    loadUserRangings();
});

loady(() => init());
onSectionChanged(() => loadUserRangings());
