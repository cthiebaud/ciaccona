import { binaryRangeSearch } from "/js/utils--9.js"

class Codec {
    #variationsStartBars = []
    variationsCount = 1 + 32 + 1
    variationIndex2BarCount = (i) => (i == 10 || i == 15 || i == 19 || i == 29) ? 4 : ((i == 8 || i == 30) ? 12 : 8)
    constructor() {
        for (let v = 0, bar = 0; v < this.variationsCount; v++) {
            const duration = this.variationIndex2BarCount(v)
            this.#variationsStartBars.push(bar)
            bar = bar + duration
        }
        this.variation2bar = (v) => {
            return this.#variationsStartBars[v]
        }
        this.bar2variation = (b) => {
            return binaryRangeSearch(b, this.#variationsStartBars)
        }
    }
}

const codec = new Codec()

export default codec
