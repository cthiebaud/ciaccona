import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import lodash from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm'
import { getCookie } from "/js/_utils.js"
import { binaryRangeSearch } from "/js/_utils.js"

const mapVideoId2ArtistName = {
    /* Beyer */  mg9kT7XiLoU: "Amandine Beyer",
    /* De Raedemaeker */  AbZxSocrvvs: "Veronique De Raedemaeker",
    /* De Vitis */  oxWq93mlAyc: "Andrea De Vitis",
    /* Eberle */  Ilb3no_cwnI: "Veronika Eberle",
    /* Faust */  r67BASAgP5Q: "Isabelle Faust",
    /* Femenía */  P93o202UJRs: "Marta Femenía",
    /* Ginot */  maDgVXxV1b0: "Florentin Ginot",
    /* Gotō */  KgSKvOAJMb8: "Midori Gotō",
    /* Hahn */  ngjEVKxQCWs: "Hilary Hahn",
    /* Hansen */  X5_F_w_rX4k: "Von Hansen",
    /* Hristova */  XkfsGCIiHb4: "Bella Hristova",
    /* Jacobs */  dyAcRqpjbqU: "Lisa Jacobs",
    /* Kuijken */  NCTDf8dNT5s: "Sigiswald Kuijken",
    /* Lenaerts */  KHwsHXtVWks: "Anneleen Lenaerts",
    /* Massini */  SzxzLtwK_eo: "Chiara Massini",
    /* Park */  _5ITydjLkYUk: "Yun Park",
    /* Podger */  _1HSJufg7I1I: "Rachel Podger",
    /* Poláčková */  lxZqC_J0C74: "Petra Poláčková",
    /* Robilliard */  KWcGsRKbe_U: "Virginie Robilliard",
    /* Smits */  Jcy7E4uHYK8: "Raphaella Smits",
    /* Stoltzman */  BYg7Di8CH9w: "Mika Stoltzman",
    /* Takehisa */  JETARLGbUJo: "Genzoh Takehisa",  /* original: ze_QPWuyZLo */
    /* Thiebaud */  Vslz1tDsaWw: "Christophe Thiebaud",
    /* Wong */  _59KFAY_qf_Q: "Rachell_Ellen Wong",
}

const variationsCount = 1 + 32 + 1
const variationIndex2BarCount = (i) => (i == 10 || i == 15 || i == 19 || i == 29) ? 4 : ((i == 8 || i == 30) ? 12 : 8)

function validateVideoIdAndGetInterestingData(videoId) {
    if (videoId == null) {
        return undefined;
    }

    const videoIdNoHyphen = videoId.replace(/-/gi, '_')
    const videoIdNoHyphenNoStartingNumber = videoIdNoHyphen.replace(/^(\d.*)/i, '_$1')
    const artist = mapVideoId2ArtistName[videoIdNoHyphenNoStartingNumber]
    if (artist == null) {
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

    #codec = new Codec()

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
        bar.variation = this.#codec.bar2variation(bar.index)
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

        this.previousPlayOnBar = getCookie('previousPlayOnBar')
        if (this.previousPlayOnBar != null) {
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
    variationIndex2BarCount as index2duration,
    createTimings,
    validateVideoIdAndGetInterestingData as validateVideoId
}
