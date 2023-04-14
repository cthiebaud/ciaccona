import { getCookie, setCookie, removeCookie } from "/js/_utils2.js"

class Config {
    #scoreDisplay
    #playing
    #startBarOfLastSelectedVariation

    constructor() {
        // 
        this.scoreDisplay = getCookie('scoreDisplay')

        // 
        this.playing = getCookie('playing')

        // 
        this.startBarOfLastSelectedVariation = getCookie('startBarOfLastSelectedVariation')
    }

    // 
    get scoreDisplay() {
        return this.#scoreDisplay
    }
    set scoreDisplay(scoreDisplay) {
        if (scoreDisplay !== 'firstBar' && scoreDisplay !== 'fullScore' && scoreDisplay !== 'noScore') scoreDisplay = 'firstBar'

        this.#scoreDisplay = scoreDisplay

        if (!this.#scoreDisplay || this.#scoreDisplay === 'firstBar') {
            removeCookie('scoreDisplay')
        } else {
            setCookie('scoreDisplay', this.#scoreDisplay)
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
        this.#playing = playing
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
            setCookie('startBarOfLastSelectedVariation', this.#startBarOfLastSelectedVariation)
        }
    }
}

const config = new Config()

export default config