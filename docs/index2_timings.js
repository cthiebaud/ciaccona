import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'

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
    Vslz1tDsaWw: "Christophe Thiebaud",
}

function initVideoTimings(videoTimings) {
    const initializeBarObject = (bar) => {
        if (!bar.m) {
            bar.m = new moment(bar["Time Recorded"])
        }
        bar.duration = moment.duration(bar.m.diff(videoTimings.start))
        if (videoTimings.offset) {
            bar.duration.add(videoTimings.offset)
        }
        if (videoTimings.adjust) {
            bar.duration.subtract(videoTimings.adjust)
        }
        return bar
    }
    videoTimings.ciacconaStart = initializeBarObject({ m: videoTimings.start })
    for (let bar of videoTimings.bars) {
        initializeBarObject(bar)
    }
}

export default function createTimings(videoId) {
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
                    initVideoTimings(timings)
                    /*
                    initUI(videoId) 
                    */
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
