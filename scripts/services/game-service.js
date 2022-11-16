/*
 * You are allowed to change the code here.
 * However, you are not allowed to change the signature of the exported functions and objects.
 */

import { addMoveHistoryItem, getMoveHistory } from './game-move-history-service.js';
import { FOUNTAIN, PAPER, SCISSORS, STONE, MATCH } from '../models/constants.js';
import MoveHistoryItem from '../models/move-history-item.js';
import RankingItem from '../models/ranking-item.js';
import { groupArrayBy } from '../utils.js';

const DELAY_MS = 1000;
const playerStats = {
  Markus: {
    user: 'Markus',
    win: 3,
    lost: 6,
  },
  Michael: {
    user: 'Michael',
    win: 4,
    lost: 5,
  },
  Lisa: {
    user: 'Lisa',
    win: 4,
    lost: 5,
  },
};

export const HANDS = [SCISSORS, STONE, PAPER, FOUNTAIN, MATCH];

const gameRuleMap = new Map([
  [SCISSORS, [PAPER, MATCH]],
  [PAPER, [STONE, FOUNTAIN]],
  [STONE, [SCISSORS, MATCH]],
  [FOUNTAIN, [STONE, SCISSORS]],
  [MATCH, [PAPER, FOUNTAIN]],
]);

let isConnectedState = false;

export function setConnected(newIsConnected) {
  isConnectedState = Boolean(newIsConnected);
}

export function isConnected() {
  return isConnectedState;
}

function getRankingsFromPlayerStats() {
  if (!isConnected()) {
    const offlineHistory = getMoveHistory();
    // adding history data from local storage to player stats (really ugly)
    const historyByUser = groupArrayBy(offlineHistory, 'playerName');
    Object.keys(historyByUser).forEach((playerName) => {
      const playerHistory = historyByUser[playerName];
      const sumOfWins = playerHistory.filter((historyItem) => historyItem.points === 1).length;
      const sumOfLost = playerHistory.filter((historyItem) => historyItem.points === -1).length;
      playerStats[playerName] = {
        win: (playerStats[playerName]?.win ?? 0) + sumOfWins,
        lost: (playerStats[playerName]?.lost ?? 0) + sumOfLost,
        user: playerName,
      };
    });
  }

  const ranking = [];

  Object.keys(playerStats).forEach((playerName) => {
    const playerStat = playerStats[playerName];
    let existingRankingItem = ranking.find((rankItem) => rankItem.wins === playerStat.win);
    if (!existingRankingItem) {
      existingRankingItem = new RankingItem(undefined, playerStat.win);
      ranking.push(existingRankingItem);
    }
    existingRankingItem.players.push(playerStat.user);
  });

  const sortedRanking = ranking.sort((a, b) => {
    if (a.wins === b.wins) {
      return 0;
    }
    return a.wins < b.wins ? 1 : -1;
  }).map((rankingItem, index) => {
    rankingItem.rank = index + 1;
    return rankingItem;
  });
  return sortedRanking;
}

export function getRankings(rankingsCallbackHandlerFn) {
  const rankingsArray = getRankingsFromPlayerStats();
  setTimeout(() => rankingsCallbackHandlerFn(rankingsArray), DELAY_MS);
}

function getGameEval(playerHand, systemHand) {
  if (playerHand === systemHand) {
    return 0;
  }
  const userWins = gameRuleMap.get(playerHand)
    .some((winnerAnswer) => systemHand === winnerAnswer);
  return userWins ? 1 : -1;
}

export function evaluateHand(playerName, playerHand, gameRecordHandlerCallbackFn) {
  // TODO: Replace calculation of didWin and update rankings while doing so.
  // optional: in local-mode (isConnected == false) store rankings in the browser localStorage https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  const systemHand = HANDS[Math.floor(Math.random() * 3)];
  const gameEval = getGameEval(playerHand, systemHand);
  if (!isConnected()) {
    const moveHistoryItem = new MoveHistoryItem(gameEval, playerHand, systemHand, playerName);
    addMoveHistoryItem(moveHistoryItem);
  }
  setTimeout(() => gameRecordHandlerCallbackFn({
    playerHand,
    systemHand,
    gameEval,
  }, DELAY_MS));
}
