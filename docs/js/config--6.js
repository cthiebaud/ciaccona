import { getCookie, setCookie, removeCookie } from "/js/utils--6.js"

class Config {
    #scoreDisplay
    #scoreInBricks
    #playing
    #startBarOfLastSelectedVariation
    #autoplay

    constructor() {
        // 
        this.scoreDisplay = getCookie('scoreDisplay')

        // 
        this.scoreInBricks = getCookie('scoreInBricks')

        // 
        this.playing = getCookie('playing')

        // 
        this.startBarOfLastSelectedVariation = getCookie('startBarOfLastSelectedVariation')

        // 
        this.autoplay = getCookie('autoplay')
    }

    // 
    get scoreDisplay() {
        return this.#scoreDisplay
    }
    set scoreDisplay(scoreDisplay) {
        if (scoreDisplay !== 'firstBar' && scoreDisplay !== 'fullScore') scoreDisplay = 'firstBar'

        this.#scoreDisplay = scoreDisplay

        if (!this.#scoreDisplay || this.#scoreDisplay === 'firstBar') {
            removeCookie('scoreDisplay')
        } else {
            setCookie('scoreDisplay', this.#scoreDisplay)
        }
    }

    // 
    get scoreInBricks() {
        return this.#scoreInBricks
    }
    set scoreInBricks(scoreInBricks) {
        if (scoreInBricks !== 'allBricks' && scoreInBricks !== 'selectedBrick') scoreInBricks = 'allBricks'

        this.#scoreInBricks = scoreInBricks

        if (!this.#scoreInBricks || this.#scoreInBricks === 'firstBar') {
            removeCookie('scoreInBricks')
        } else {
            setCookie('scoreInBricks', this.#scoreInBricks)
        }
    }
    // 
    get playing() {
        return this.#playing
    }
    set playing(playing) {
        if (playing && (playing === 'true' || playing === true)) {
            this.#playing = true
        } else {
            this.#playing = false
        }

        if (!this.#playing) {
            removeCookie('playing')
        } else {
            setCookie('playing', this.#playing ? 'true' : 'false')
        }
    }

    // 
    get startBarOfLastSelectedVariation() {
        return this.#startBarOfLastSelectedVariation
    }
    set startBarOfLastSelectedVariation(startBarOfLastSelectedVariation) {
        let temp
        if (!startBarOfLastSelectedVariation) {
            temp = 0
        } else {
            temp = parseInt(startBarOfLastSelectedVariation)
            if (isNaN(temp)) temp = 0
        }

        this.#startBarOfLastSelectedVariation = temp

        if (this.#startBarOfLastSelectedVariation === 0) {
            removeCookie('startBarOfLastSelectedVariation')
        } else {
            // https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
            var in30Minutes = 1/48;            
            setCookie('startBarOfLastSelectedVariation', this.#startBarOfLastSelectedVariation, in30Minutes)
        }
    }

    // 
    get autoplay() {
        return this.#autoplay
    }
    set autoplay(autoplay) {
        if (autoplay && (autoplay === 'true' || autoplay === true)) {
            this.#autoplay = true
        } else {
            this.#autoplay = false
        }

        if (!this.#autoplay || this.#autoplay === false) {
            removeCookie('autoplay')
        } else {
            setCookie('autoplay', 'true')
        }
    }
}

const config = new Config()

export default config