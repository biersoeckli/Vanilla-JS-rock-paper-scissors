/*
 * You are allowed to change the code here.
 * However, you are not allowed to change the signature of the exported functions and objects.
 */

import { addMoveHistoryItem, getMoveHistory } from './game-move-history-service.js';
import { FOUNTAIN, PAPER, SCISSORS, STONE, MATCH } from '../models/constants.js';
import MoveHistoryItem from '../models/move-history-item.js';
import RankingItem from '../models/ranking-item.js';
import { groupArrayBy } from '../utils.js';

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

async function getRankingsFromPlayerStats() {
  let playerStats = {};
  if (isConnected()) {
    playerStats = await (await fetch('https://stone.sifs0005.infs.ch/ranking')).json();
  } else {
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
  getRankingsFromPlayerStats().then((rankingsArray) => rankingsCallbackHandlerFn(rankingsArray));
}

function getGameEval(playerHand, systemHand) {
  if (playerHand === systemHand) {
    return 0;
  }
  const userWins = gameRuleMap.get(playerHand)
    .some((winnerAnswer) => systemHand === winnerAnswer);
  return userWins ? 1 : -1;
}

function mapGameEvalServerResponse(serverResonse) {
  if (serverResonse === undefined) {
    return 0;
  }
  return serverResonse ? 1 : -1;
}

function mapLocalHandToServerFriendlyHand(localHand) {
  return new Map([
    [SCISSORS, 'Schere'],
    [PAPER, 'Stein'],
    [STONE, 'Papier'],
    [FOUNTAIN, 'Brunnen'],
    [MATCH, 'Streichholz'],
  ]).get(localHand);
}

function mapServerFriendlyHandToLocalHand(serverFriendlyHand) {
  return new Map([
    ['Schere', SCISSORS],
    ['Stein', PAPER],
    ['Papier', STONE],
    ['Brunnen', FOUNTAIN],
    ['Streichholz', MATCH],
  ]).get(serverFriendlyHand);
}

export async function evaluateHand(playerName, playerHand, gameRecordHandlerCallbackFn) {
  let systemHand;
  let gameEval;
  if (isConnected()) {
    const serverFriendlyUserHand = mapLocalHandToServerFriendlyHand(playerHand);
    const serverResult = await (await fetch(`https://stone.sifs0005.infs.ch/play?playerName=${playerName}&playerHand=${serverFriendlyUserHand}`)).json();
    systemHand = mapServerFriendlyHandToLocalHand(serverResult.choice);
    gameEval = mapGameEvalServerResponse(serverResult.win);
  } else {
    systemHand = HANDS[Math.floor(Math.random() * 3)];
    gameEval = getGameEval(playerHand, systemHand);
  }
  const moveHistoryItem = new MoveHistoryItem(gameEval, playerHand, systemHand, playerName);
  addMoveHistoryItem(moveHistoryItem);
  gameRecordHandlerCallbackFn({
    playerHand,
    systemHand,
    gameEval,
  });
}
