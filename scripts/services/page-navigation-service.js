const gameSection = document.getElementById('game-section');
const welcomeSection = document.getElementById('welcome-screen-section');
const registeredSectionChangedFunctions = [];

function triggerSectionChanged() {
    registeredSectionChangedFunctions.forEach((func) => func());
}

export function hideAllSections() {
    gameSection.style.display = 'none';
    welcomeSection.style.display = 'none';
}

export function showGameSection() {
    hideAllSections();
    gameSection.style.display = 'inline';
    triggerSectionChanged();
}

export function showWelcomeSection() {
    hideAllSections();
    welcomeSection.style.display = 'inline';
    triggerSectionChanged();
}

/**
 * function "func" will be called (for every registration) when user navigated to another section.
 */
export function onSectionChanged(func) {
    registeredSectionChangedFunctions.push(func);
}
