const gameSection = document.getElementById('game-section');
const welcomeSection = document.getElementById('welcome-screen-section');

export function hideAllSections() {
  gameSection.style.display = 'none';
  welcomeSection.style.display = 'none';
}

export function showGameSection() {
  hideAllSections();
  gameSection.style.display = 'inline';
}

export function showWelcomeSection() {
  hideAllSections();
  welcomeSection.style.display = 'inline';
}
