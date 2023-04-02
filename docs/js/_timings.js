import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import { getCookie } from "/js/_utils.js"
import { index2duration } from "/js/_config.js"
import { binaryRangeSearch } from "/js/_utils.js"

/* import Promise from 'https://cdn.jsdelivr.net/npm/bluebird@3.7.2/+esm'
Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
}); */
const $ = jquery

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
    ze_QPWuyZLo: "Genzoh Takehisa",
    KHwsHXtVWks: "Anneleen Lenaerts",
    BYg7Di8CH9w: "Mika Stoltzman",
    _5ITydjLkYUk: "Yun Park",
    P93o202UJRs: "Marta Femenía",
    X5_F_w_rX4k: "Von Hansen",
    maDgVXxV1b0: "Florentin Ginot",
    Vslz1tDsaWw: "Christophe Thiebaud",
}

class codec {
    constructor() {
        this.variationsBars = []
        let bar = 0
        for (let i = 0; i < 34; i++) {
            const duration = index2duration(i)
            this.variationsBars.push(bar)
            bar = bar + duration
        }
        this.variation2bar = (variation) => {
            return this.variationsBars[variation]
        }
        this.bar2variation = (bar) => {
            return binaryRangeSearch(bar, this.variationsBars)
        }
    }
}

function initTimings(timings) {
    timings.codec = new codec()

    const initializeBarObject = (bar, index) => {
        if (!bar.m) {
            bar.m = new moment(bar["Time Recorded"])
        }
        bar.duration = moment.duration(bar.m.diff(timings.start))
        if (timings.offset) {
            bar.duration.add(timings.offset)
        }
        if (timings.adjust) {
            bar.duration.subtract(timings.adjust)
        }
        if (typeof index !== 'undefined') {
            bar.index = index
            bar.variation = timings.codec.bar2variation(index)
            
            if (timings.pub) {
                if (timings.pub.fromVariation <= bar.variation ) {
                    bar.duration.subtract(timings.pub.duration)
                }
            }
        }

        return bar
    }

    timings.time2bar = function (time) {
        return binaryRangeSearch(time, timings.bars, (i, arr) => {
            return arr[i].duration.asMilliseconds() / 1000
        })
    }

    timings.ciacconaStart = initializeBarObject({ m: timings.start })

    timings.previousPlayOnBar = getCookie('previousPlayOnBar')
    if (!timings.previousPlayOnBar) {
        timings.previousPlayOnBar = 0
    } else {
        timings.previousPlayOnBar = parseInt(timings.previousPlayOnBar)
    }

    timings.bars.forEach((bar, index) => initializeBarObject(bar, index))
    console.log(timings)
}

function validateVideoId(videoId) {
    if (!videoId) {
        return false;
    }

    const videoIdNoHyphen = videoId.replace(/-/gi, '_')
    const videoIdNoHyphenNoStartingNumber = videoIdNoHyphen.replace(/^(\d.*)/i, '_$1')
    const artist = mapVideoId2ArtistName[videoIdNoHyphenNoStartingNumber]
    if (!artist) {
        return false
    }

    return true
}

function createTimings(videoId) {
    return new Promise((resolve, reject) => {
        if (!videoId) {
            reject(`invalid videoId: < ${videoId} >`)
        } else {
            const videoIdNoHyphen = videoId.replace(/-/gi, '_')
            const videoIdNoHyphenNoStartingNumber = videoIdNoHyphen.replace(/^(\d.*)/i, '_$1')
            const artist = mapVideoId2ArtistName[videoIdNoHyphenNoStartingNumber]
            if (!artist) {
                reject(`no artist associated with videoId: |${videoId}|`)
            } else {
                const artistNoSpace = artist.replace(/\s/gi, '')
                const url = `timings/${artistNoSpace}-${videoId}.js`
                const yt = `https://youtu.be/${videoId}`

                console.log('script loading', url)
                $.ajax({
                    url: url,
                    dataType: "script",
                }).done(function () {
                    console.log("script loaded", url);
                    const timings = eval(videoIdNoHyphenNoStartingNumber)
                    initTimings(timings)
                    resolve({
                        id: videoId,
                        artist: artist,
                        url: url,
                        yt: yt,
                        timings: timings
                    })
                }).fail(function (jqXHR, textStatus, error) {
                    console.log("script loading error", url, jqXHR, textStatus, error);
                    reject(error)
                })
            }
        }
    })
}

export { createTimings, validateVideoId }
