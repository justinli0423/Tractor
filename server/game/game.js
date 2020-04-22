class Game {
    constructor(p1, p2, p3, p4) {
        this._team1 = [p1, p2]
        this._team2 = [p3, p4]
        this._team1_level = '2'
        this._team2_level = '2'
    }

    get team1() {
        return this._team1
    }

    get team2() {
        return this._team2
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

