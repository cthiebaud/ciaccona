import jsYaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm'
import lodashMerge from 'https://cdn.jsdelivr.net/npm/lodash.merge@4.6.2/+esm'

const theDayWhenIReadTheVideoMeters = moment('2023-04-08T00:00:00Z')

class Artist {
    constructor(a) {
        lodashMerge(this, a)

        this.fullname = `${a.firstname} ${a.lastname}`
        this.fullnameNoSpace = this.fullname.replace(/\s/gi, '')
        this.fullnameNoSpaceLowercaseNoDiacritics = this.fullnameNoSpace.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '') // https://stackoverflow.com/a/37511463/1070215

        this.thisUrl = `/video/${this.fullnameNoSpaceLowercaseNoDiacritics}.html`
        this.social = `https://www.facebook.com/sharer/sharer.php?u=https://ciaccona.cthiebaud.com${this.thisUrl}`

        const vid = this['▶']
        vid.youtubeUrl = `https://youtu.be/${vid.id}`
        if (vid.trueId) vid.youtubeTrueUrl = `https://youtu.be/${vid.trueId}`
        vid.timingsUrl = `timings/${this.fullnameNoSpace}-${vid.id}.js`

        const videoIdNoHyphen = vid.id.replace(/-/gi, '_')
        const videoIdNoHyphenNoStartingNumber = videoIdNoHyphen.replace(/^(\d.*)/i, '_$1')
        vid.javascriptizedId = videoIdNoHyphenNoStartingNumber

        if (true) { // calc viewsPerMonth ?
            vid.publishedMoment = moment(vid.published)
            vid.duration = theDayWhenIReadTheVideoMeters.diff(vid.publishedMoment)
            vid.durationMoment = moment.duration(vid.duration)
            vid.viewsPerMonth = Math.floor(vid.views / vid.durationMoment.asMonths())
        }
        this.v = vid
    }
}

class Artists {
    artists = []
    #mapNameNoSpaceLowercaseNoDiacritics2Artist = new Map()
    dump = () => {
        this.artists.forEach((a) => {
            console.log(a)
        })
    }
    addArtist = (a) => {
        this.#mapNameNoSpaceLowercaseNoDiacritics2Artist.set(a.fullnameNoSpaceLowercaseNoDiacritics, a)
        this.artists.push(a)
    }
    getArtistFromNameNoSpaceLowercaseNoDiacritics = (nameNoSpaceLowercaseNoDiacritics) => {
        return this.#mapNameNoSpaceLowercaseNoDiacritics2Artist.get(nameNoSpaceLowercaseNoDiacritics)
    }
    size = () => this.artists.length
    sort = (f) => this.artists.sort(f)
}

function loadArtists() {
    return new Promise((resolve, reject) => {
        const urlArtistsYAML = "/_artists.yaml?v=0.8.20"
        const artistsRequest = new Request(urlArtistsYAML);
        const artists = new Artists()

        fetch(artistsRequest).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error fetching ${urlArtistsYAML}! Status: ${response.status}`);
            }
            return response.text()
        }).then((artistsAsYAMLText) => {

            const artistsAsJSONObject = jsYaml.load(artistsAsYAMLText)
            artistsAsJSONObject.forEach((a) => {
                artists.addArtist(new Artist(a))
            })

            console.log('# artists', artists.size())

            resolve(artists)
        }).catch((error) => {
            console.log("script loading error", urlArtistsYAML, error);
            reject(error)
        })
    })
}

export { loadArtists }
