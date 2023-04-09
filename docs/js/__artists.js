import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import jsYaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm'
import lodash from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm'

const meterDay = moment('Apr 8, 2023')
class Artist {
    constructor(a) {
        lodash.merge(this, a)

        this.fullname = `${a.firstname} ${a.lastname}`
        this.fullnameNoSpace = this.fullname.replace(/\s/gi, '')
        this.fullnameNoSpaceLowercaseNoDiacritics = this.fullnameNoSpace.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") // https://stackoverflow.com/a/37511463/1070215

        this.social = `https://www.facebook.com/sharer/sharer.php?u=https://ciaccona.cthiebaud.com/video/${this.fullnameNoSpaceLowercaseNoDiacritics}.html`

        const vid = this['▶']
        const videoId = vid.id
        vid.url = `https://youtu.be/${videoId}`
        vid.timingsUrl = `timings/${this.fullnameNoSpace}-${videoId}.js`

        const videoIdNoHyphen = videoId.replace(/-/gi, '_')
        const videoIdNoHyphenNoStartingNumber = videoIdNoHyphen.replace(/^(\d.*)/i, '_$1')
        vid.javascriptizedId = videoIdNoHyphenNoStartingNumber

        const started = moment(vid.published)
        const diff = meterDay.diff(started)
        const durationInMonths = moment.duration(diff).asMonths()
        vid.viewPerMonth =  Math.floor(vid.views / durationInMonths)
    }
}

class Artists {
    artists = []
    #mapVideoId2Artist = new Map()
    #mapJavascriptizedVideoId2Artist = new Map()
    #mapNameNoSpaceLowercaseNoDiacritics2Artist = new Map()
    dump = () => {

        this.artists.forEach((a) => {
            console.log(`'${a['▶'].id}', `)
            // console.log(a.fullnameNoSpaceLowercaseNoDiacritics)
        })
    }
    addArtist = (a) => {
        this.#mapVideoId2Artist.set(a['▶'].id, a)
        this.#mapJavascriptizedVideoId2Artist.set(a['▶'].javascriptizedId, a)
        this.#mapNameNoSpaceLowercaseNoDiacritics2Artist.set(a.fullnameNoSpaceLowercaseNoDiacritics, a)
        this.artists.push(a)
    }
    validateVideoIdThenGetArtist = (videoId) => {
        if (videoId == null) {
            return undefined;
        }

        const artist = artists.getArtistFromVideoId(videoId)
        if (artist == null) {
            return undefined
        }

        return artist
    }
    getArtistFromVideoId = (id) => {
        return this.#mapVideoId2Artist.get(id)
    }
    getArtistFromJavascriptizedVideoId = (javascriptizedId) => {
        return this.#mapJavascriptizedVideoId2Artist.get(javascriptizedId)
    }
    getArtistFromNameNoSpaceLowercaseNoDiacritics = (nameNoSpaceLowercaseNoDiacritics) => {
        return this.#mapNameNoSpaceLowercaseNoDiacritics2Artist.get(nameNoSpaceLowercaseNoDiacritics)
    }
    size = () => this.artists.length
}

function loadArtists() {
    return new Promise((resolve, reject) => {
        const urlArtistsYAML = '/_artists.yaml'
        const artists = new Artists()
        jquery.ajax({
            url: urlArtistsYAML,
            dataType: "text",
        }).done(function (artistsAsYAMLText) {
            const artistsAsJSONObject = jsYaml.load(artistsAsYAMLText)
            artistsAsJSONObject.forEach((a) => {
                const a2 = new Artist(a)
                artists.addArtist(a2)
            })

            console.log('# artists', artists.size())

            resolve(artists)
        }).fail(function (jqXHR, textStatus, error) {
            console.log("script loading error", urlArtistsYAML, jqXHR, textStatus, error);
            reject(error)
        }).always(function () {
            // artists.dump()
        })
    })
}

export { loadArtists }

/*
                    const qwe = jsYaml.load(artistsAsYAMLText)
                    // console.log(qwe)
                    const today = moment('Apr 8, 2023')
                    const res = []
                    const oneMonth = moment.duration(1, 'months')
                    Object.keys(qwe).forEach((k) => {

                        const firstVid = qwe[k]['▶'][0]
                        const yt = firstVid.url
                        const views = firstVid.views
                        const started = moment(firstVid.started)
                        const diff = today.diff(started)
                        const durationInMonths = moment.duration(diff).asMonths()
                        // console.log(k, asd, durationInMonths)
                        // console.log(k, yt, )

                        // console.log(k, yt, views, Math.floor(duration.asMonths()), Math.floor(views / Math.floor(duration.asMonths())))
                        res.push({
                            artist: k,
                            video: yt,
                            views: views,
                            started: started,
                            viewPerMonth: Math.floor(views / durationInMonths)
                        })
                    })
                    res.sort((a, b) => {
                        return b.viewPerMonth - a.viewPerMonth;
                        // return a.started.diff(b.started)
                    })
                    const ff = new Intl.NumberFormat('fr-FR')

                    const s = `${"artist".padEnd(26)} | video since | ${"total views".padStart(11)} | ${"per month".padStart(10)}`
                    console.log(s)
                    console.log("---------------------------+-------------+-------------+-----------")
                    res.forEach((r) => {
                        const s = `${r.artist.padEnd(26)} |    ${r.started.format('MMM YYYY')} | ${ff.format(r.views).padStart(11)} | ${ff.format(r.viewPerMonth).padStart(10)}`
                        console.log(s)
                    })

    }
    */
