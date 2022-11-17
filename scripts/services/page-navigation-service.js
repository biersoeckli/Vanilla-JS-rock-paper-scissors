const gameSection = document.getElementById('game-section');
const welcomeSection = document.getElementById('welcome-screen-section');
const registeredSectionChangedFunctions = [];

function triggerSectionChanged() {
    registeredSectionChangedFunctions.forEach((func) => func());
}

export function hideAllSections() {
    gameSection.classList.add('hidden');
    welcomeSection.classList.add('hidden');
}

export function showGameSection() {
    hideAllSections();
    gameSection.classList.remove('hidden');
    triggerSectionChanged();
}

export function showWelcomeSection() {
    hideAllSections();
    welcomeSection.classList.remove('hidden');
    triggerSectionChanged();
}

/**
 * function "func" will be called (for every registration) when user navigated to another section.
 */
export function onSectionChanged(func) {
    registeredSectionChangedFunctions.push(func);
}
