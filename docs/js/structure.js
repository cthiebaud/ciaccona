class Codec {
    #variations = []
    #bars = []
    #barsCount
    #variationsCount = 1 /* theme */ + 32 /* variations */ + 1 /* final chord */
    #variationIndex2BarCount = (i) =>
        (i == 10 || i == 15 || i == 19 || i == 29) ? 4 :
            ((i == 8 || i == 30) ? 12 :
                (i == 33) ? 1 :
                    8)
    constructor() {
        let bar = 0
        for (let v = 0; v < this.#variationsCount; v++) {
            const variation = {
                startBarIndex: bar,
                barsCount: this.#variationIndex2BarCount(v)
            }
            this.#variations.push(variation)
            for (let d = 0; d < variation.barsCount; d++) {
                this.#bars.push({
                    variationIndex: v
                })
                bar++
            }
        }
        this.#barsCount = bar
        console.log('we have', this.#barsCount, 'bars')
    }
    variation2bar = (v) => {
        if (v < 0 || this.#variations.length <= v) {
            return -1
        }
        return this.#variations[v].startBarIndex
    }
    variation2barsCount(v) {
        if (v < 0 || this.#variations.length <= v) {
            return 0
        }
        return this.#variations[v].barsCount
    }
    bar2variation = (b) => {
        if (b < 0 || this.#bars.length <= b) {
            return -1
        }
        return this.#bars[b].variationIndex
    }
}

const codec = new Codec()

export default codec
