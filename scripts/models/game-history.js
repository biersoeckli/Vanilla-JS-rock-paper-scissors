export default class GameHistory {
    constructor(userWins, guessUser, guessComputer) {
        this.userWins = userWins;
        this.guessUser = guessUser;
        this.guessComputer = guessComputer;
        this.points = new Map([
            [undefined, 0],
            [false, -1],
            [true, 1],
        ]).get(userWins);
    }
}
