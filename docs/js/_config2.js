import { getCookie, setCookie, removeCookie } from "/js/_utils2.js"

class Config {
    #scoreDisplay
    #playing
    #startBarOfLastSelectedVariation

    constructor() {
        // 
        this.#scoreDisplay = getCookie('scoreDisplay')
        if (!this.#scoreDisplay || !(this.#scoreDisplay === 'fullScore' || this.#scoreDisplay === 'noScore')) this.#scoreDisplay = 'firstBar'

        // 
        this.#playing = getCookie('playing')
        if (this.#playing && this.#playing === 'true') {
            this.#playing = true
        } else {
            this.#playing = false
        }

        // 
        this.#startBarOfLastSelectedVariation = getCookie('startBarOfLastSelectedVariation')
        if (!this.#startBarOfLastSelectedVariation) this.#startBarOfLastSelectedVariation = 0
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
        this.#startBarOfLastSelectedVariation = startBarOfLastSelectedVariation
        if (!this.#startBarOfLastSelectedVariation) {
            removeCookie('startBarOfLastSelectedVariation')
        } else {
            setCookie('startBarOfLastSelectedVariation', this.#startBarOfLastSelectedVariation)
        }
    }
}

const config = new Config()

export default config