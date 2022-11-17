import {LOCAL_STORAGE_HISTORY_KEY} from '../models/constants.js';
import MoveHistoryItem from '../models/move-history-item.js';

export function getMoveHistory() {
    const userFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : [];
}

export function addMoveHistoryItem(moveHistoryItem) {
    if (!moveHistoryItem || !(moveHistoryItem instanceof MoveHistoryItem)) {
        return;
    }
    const moveHistory = getMoveHistory();
    moveHistory.push(moveHistoryItem);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(moveHistory));
}

export function resetRanking() {
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
}
