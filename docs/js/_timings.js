import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import lodash from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm'
import { getCookie, setCookie, removeCookie } from "/js/_utils.js"
import { binaryRangeSearch } from "/js/_utils.js"
import { loadArtists } from "/js/_artists.js"


const variationsCount = 1 + 32 + 1
const variationIndex2BarCount = (i) => (i == 10 || i == 15 || i == 19 || i == 29) ? 4 : ((i == 8 || i == 30) ? 12 : 8)
class Codec {
    #variationsStartBars = []
    constructor() {
        for (let v = 0, bar = 0; v < variationsCount; v++) {
            const duration = variationIndex2BarCount(v)
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

class Timings {

    codec = new Codec()
    #startBarOfLastSelectedVariation = undefined

    loadStartBarOfLastSelectedVariation() {
        const cook = getCookie('startBarOfLastSelectedVariation')
        if (cook != null) {
            const cookAsANumber = Number(cook)
            if (Number.isNaN(cookAsANumber)) {
                this.#startBarOfLastSelectedVariation = undefined
            } else {
                this.#startBarOfLastSelectedVariation = cookAsANumber
            }
        }
    }
    getStartBarOfLastSelectedVariation() {
        return this.#startBarOfLastSelectedVariation
    }
    setStartBarOfLastSelectedVariation(sbolsv) {
        if (this.#startBarOfLastSelectedVariation != sbolsv) {
            this.#startBarOfLastSelectedVariation = sbolsv
            if (this.#startBarOfLastSelectedVariation == null) {
                removeCookie('startBarOfLastSelectedVariation')
            } else {
                setCookie('startBarOfLastSelectedVariation', this.#startBarOfLastSelectedVariation)
            }
        }
    }

    #initializeBarObject = (bar, barIndex) => {
        if (bar == null || barIndex == null) {
            throw new Error(bar, typeof bar, barIndex, typeof barIndex)
        }
        if (bar.m == null) {
            bar.m = moment(bar["Time Recorded"])
        }
        bar.duration = moment.duration(bar.m.diff(this.start))
        if (this.offset) {
            bar.duration.add(this.offset)
        }
        if (this.adjust) {
            bar.duration.subtract(this.adjust)
        }
        bar.index = barIndex
        bar.variation = this.codec.bar2variation(bar.index)
        bar.variationStartBarIndex = this.codec.variation2bar(bar.variation)
        if (this.freezedBecauseOFPub &&
            this.freezedBecauseOFPub.fromVariation &&
            this.freezedBecauseOFPub.from &&
            this.freezedBecauseOFPub.to) {
            if (this.freezedBecauseOFPub.fromVariation <= bar.variation) {
                const freezeDuration = moment(this.freezedBecauseOFPub.to).diff(this.freezedBecauseOFPub.from)
                bar.duration.subtract(freezeDuration)
            }
        }
        return bar
    }

    #isDefinedNotNullAndNotAMoment = (o) => {
        if (o == null) return false
        return !(o instanceof moment)
    }

    #isDefinedNotNullAndNotADuration = (o) => {
        if (o == null) return false
        if (!(o instanceof moment)) return false
        return o.isDuration()
    }

    constructor(interestingData, data) {
        lodash.merge(this, interestingData)
        lodash.merge(this, data)

        if (this.#isDefinedNotNullAndNotADuration(this.offset)) {
            this.offset = moment.duration(this.offset)
        }
        if (this.#isDefinedNotNullAndNotADuration(this.adjust)) {
            this.adjust = moment.duration(this.adjust)
        }
        if (this.#isDefinedNotNullAndNotAMoment(this.start)) {
            this.start = moment(this.start)
        }

        this.bar2time = function (bar) {
            return bar.duration.asMilliseconds() / 1000
        }

        this.time2bar = function (time) {
            return binaryRangeSearch(time, this.bars, (barIndex, bars) => {
                return this.bar2time(bars[barIndex])
            })
        }

        this.loadStartBarOfLastSelectedVariation()

        this.bars.forEach((bar, index) => this.#initializeBarObject(bar, index))

        /*
        */
        if (256 <= this.bars.length) {
            // get duration of first variation 
            console.log('var 0', this.bars[0].m.format())
            const lastvarbar = this.codec.variation2bar(33)
            console.log('var 0', this.bars[0].m.format(), 'last var bar', lastvarbar, this.bars[lastvarbar].m.format())
            // from 0 to 256 bar :
            const from0to256 = this.bars[lastvarbar].m.diff(this.bars[0].m)
            const lastD = 3 * (from0to256 / 256)
            const duration = moment.duration(from0to256 + lastD)
            this.lengthAsAString = `${duration.minutes()}′${duration.seconds()}″`
            console.log(this.lengthAsAString)
        }
    }
}

function createTimings(fullameNoSpaceLowercaseNoDiacritics) {
    return new Promise((resolve, reject) => {
        loadArtists().then((artists) => {

            let artistObject = artists.getArtistFromNameNoSpaceLowercaseNoDiacritics(fullameNoSpaceLowercaseNoDiacritics)
            if (!artistObject) {
                reject(`no artist associated with : < ${fullameNoSpaceLowercaseNoDiacritics} >`)
                return
            }

            const timingsURL = artistObject['▶'].timingsUrl
            const javascriptizedId = artistObject['▶'].javascriptizedId
            console.log('script loading', timingsURL)
            jquery.ajax({
                url: timingsURL,
                dataType: "script",
            }).done(function () {
                console.log("script loaded", timingsURL);
                const data = eval(javascriptizedId)
                const timings = new Timings(artistObject, data)
                resolve(timings)
            }).fail(function (jqXHR, textStatus, error) {
                console.log("script loading error", timingsURL, jqXHR, textStatus, error);
                reject(error)
            })
        }).catch((error) => {
            console.log('loadArtists error', error)
            reject(error)
        })
    })
}

export {
    variationIndex2BarCount as index2duration,
    createTimings
}
