import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import lodash from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm'
import { getCookie } from "/js/_utils.js"
import { binaryRangeSearch } from "/js/_utils.js"

const mapVideoId2ArtistName = {
    mg9kT7XiLoU: "Amandine Beyer",
    Ilb3no_cwnI: "Veronika Eberle",
    r67BASAgP5Q: "Isabelle Faust",
    KgSKvOAJMb8: "Midori Gotō",
    ngjEVKxQCWs: "Hilary Hahn",
    XkfsGCIiHb4: "Bella Hristova",
    dyAcRqpjbqU: "Lisa Jacobs",
    NCTDf8dNT5s: "Sigiswald Kuijken",
    _1HSJufg7I1I: "Rachel Podger",
    KWcGsRKbe_U: "Virginie Robilliard",
    _59KFAY_qf_Q: "Rachell Ellen Wong",
    lxZqC_J0C74: "Petra Poláčková",
    Jcy7E4uHYK8: "Raphaella Smits",
    oxWq93mlAyc: "Andrea De Vitis",
    SzxzLtwK_eo: "Chiara Massini",
    JETARLGbUJo : "Genzoh Takehisa", /* original: ze_QPWuyZLo */
    KHwsHXtVWks: "Anneleen Lenaerts",
    BYg7Di8CH9w: "Mika Stoltzman",
    _5ITydjLkYUk: "Yun Park",
    P93o202UJRs: "Marta Femenía",
    X5_F_w_rX4k: "Von Hansen",
    maDgVXxV1b0: "Florentin Ginot",
    Vslz1tDsaWw: "Christophe Thiebaud",
}

const index2duration = (i) => (i == 10 || i == 15 || i == 19 || i == 29) ? 4 : ((i == 8 || i == 30) ? 12 : 8)

function validateVideoIdAndGetInterestingData(videoId) {
    if (!videoId) {
        return undefined;
    }

    const videoIdNoHyphen = videoId.replace(/-/gi, '_')
    const videoIdNoHyphenNoStartingNumber = videoIdNoHyphen.replace(/^(\d.*)/i, '_$1')
    const artist = mapVideoId2ArtistName[videoIdNoHyphenNoStartingNumber]
    if (!artist) {
        return undefined
    }

    return {
        videoID: videoId,
        videoIdNoHyphenNoStartingNumber: videoIdNoHyphenNoStartingNumber,
        artist: artist,
        url: `timings/${artist.replace(/\s/gi, '')}-${videoId}.js`,
        yt: `https://youtu.be/${videoId}`,
    }
}

class Codec {
    #variationsBars = []
    constructor() {
        for (let i = 0, bar = 0; i < 34; i++) {
            const duration = index2duration(i)
            this.#variationsBars.push(bar)
            bar = bar + duration
        }
        this.variation2bar = (variation) => {
            return this.#variationsBars[variation]
        }
        this.bar2variation = (bar) => {
            return binaryRangeSearch(bar, this.#variationsBars)
        }
    }
}

class Timings {

    #codec = new Codec()

    #initializeBarObject = (bar, index) => {
        if (typeof bar === 'undefined' || typeof index === 'undefined') {
            throw new Error(bar, typeof bar, index, typeof index)
        }
        if (typeof bar.m === 'undefined') {
            bar.m = moment(bar["Time Recorded"])
        }
        bar.duration = moment.duration(bar.m.diff(this.start))
        if (this.offset) {
            bar.duration.add(this.offset)
        }
        if (this.adjust) {
            bar.duration.subtract(this.adjust)
        }
        bar.index = index
        bar.variation = this.#codec.bar2variation(index)
        bar.variationStartBarIndex = this.#codec.variation2bar(bar.variation)
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

    #isDefinedAndNotAMoment = (o) => {
        if (typeof o === 'undefined') return false
        return !(o instanceof moment)
    }

    #isDefinedAndNotADuration = (o) => {
        if (typeof o === 'undefined') return false
        if (!(o instanceof moment)) return false
        return o.isDuration()
    }

    constructor(interestingData, data) {
        lodash.merge(this, interestingData)
        lodash.merge(this, data)

        if (this.#isDefinedAndNotADuration(this.offset)) {
            this.offset = moment.duration(this.offset)
        }
        if (this.#isDefinedAndNotADuration(this.adjust)) {
            this.adjust = moment.duration(this.adjust)
        }
        if (this.#isDefinedAndNotAMoment(this.start)) {
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

        this.previousPlayOnBar = getCookie('previousPlayOnBar')
        if (typeof this.previousPlayOnBar !== 'undefined') {
            this.previousPlayOnBar = Number(this.previousPlayOnBar)
            if (this.previousPlayOnBar === NaN) this.previousPlayOnBar = undefined
        }

        this.bars.forEach((bar, index) => this.#initializeBarObject(bar, index))
    }
}

function createTimings(videoId) {
    return new Promise((resolve, reject) => {
        let interestingData = validateVideoIdAndGetInterestingData(videoId)
        if (!interestingData) {
            reject(`no artist associated with videoId: < ${videoId} >`)
            return
        }

        console.log('script loading', interestingData.url)
        jquery.ajax({
            url: interestingData.url,
            dataType: "script",
        }).done(function () {
            console.log("script loaded", interestingData.url);
            const data = eval(interestingData.videoIdNoHyphenNoStartingNumber)
            const timings = new Timings(interestingData, data)
            resolve(timings)
        }).fail(function (jqXHR, textStatus, error) {
            console.log("script loading error", url, jqXHR, textStatus, error);
            reject(error)
        })

    })
}

export {
    index2duration,
    createTimings,
    validateVideoIdAndGetInterestingData as validateVideoId
}
