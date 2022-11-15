import MoveHistoryItem from './models/move-history-item.js';

const LOCAL_STORAGE_RANKING_KEY = 'SSS_RANKING';

export function getMoveHistory() {
    const userFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_RANKING_KEY);
    return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : [];
}

export function addMoveHistoryItem(moveHistoryItem) {
    if (!moveHistoryItem || !(moveHistoryItem instanceof MoveHistoryItem)) {
        return;
    }
    const moveHistory = getMoveHistory();
    moveHistory.push(moveHistoryItem);
    localStorage.setItem(LOCAL_STORAGE_RANKING_KEY, JSON.stringify(moveHistory));
}

export function resetRanking() {
    localStorage.removeItem(LOCAL_STORAGE_RANKING_KEY);
}
