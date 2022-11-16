import { startGame } from './game-section.js';
import { getRankings } from './services/game-service.js';
import { hideAllSections, showGameSection, showWelcomeSection } from './services/page-navigation-service.js';
import { getCurrentUser, initUserService, setCurrentUser } from './services/user-service.js';
import { isEmpty } from './utils.js';

const usernameInput = document.getElementById('username-input');
const rankingSection = document.getElementById('ranking-section');
const usernameInputButton = document.getElementById('username-input-button');

function init() {
  hideAllSections();
  initUserService();
  if (getCurrentUser()) {
    showGameSection();
    startGame();
    return;
  }
  showWelcomeSection();
  usernameInputButton.disabled = true;
  usernameInput.addEventListener('keyup', () => {
    usernameInputButton.disabled = (usernameInput.value ?? '').split(' ').join('') === '';
  });
  usernameInputButton.addEventListener('click', () => {
    if (!usernameInput.value) {
      return;
    }
    showGameSection();
    setCurrentUser(usernameInput.value);
    startGame();
  });
}
init();

getRankings((rankings) => {
  if (isEmpty(rankings)) {
    rankingSection.innerHTML = '';
    return;
  }
  rankingSection.innerHTML = rankings
    .map((rankingEntry) => `<p>${rankingEntry.rank}. ${rankingEntry.wins} wins<br /><span>${rankingEntry.players.join(', ')}</span></p>`)
    .join('');
});
