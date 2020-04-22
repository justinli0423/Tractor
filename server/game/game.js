class Game {
    constructor(players) {
        this._players = players
        this._team1_level = '2'
        this._team2_level = '2'
    }

    get players() {
        return this._players
    }

    get team1_level() {
        return this._team1_level
    }

    set team1_level(level) {
        this._team1_level = level
    }

    get team2_level() {
        return this._team2_level
    }
    set team2_level(level) {
        this._team2_level = level
    }
}

