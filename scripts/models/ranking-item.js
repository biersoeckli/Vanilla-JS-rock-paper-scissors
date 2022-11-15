export default class RankingItem {
    constructor(rank, wins, players = []) {
        this.rank = rank;
        this.wins = wins;
        this.players = players;
    }
}
