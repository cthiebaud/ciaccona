import { getCookie, setCookie, removeCookie } from "/js/utils-1.js"

class Config {
    #scoreDisplay
    #playing
    #startBarOfLastSelectedVariation
    #autoplay

    constructor() {
        // 
        this.scoreDisplay = getCookie('scoreDisplay')

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