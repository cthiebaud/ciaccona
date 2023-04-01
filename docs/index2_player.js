import plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/+esm'

export default function createPlayer(selector) {
    return new Promise((resolve, reject) => {
        let _plyer = new plyr(selector, {
            mute: false
        })
        _plyer.on('playing', (event) => {
            console.log("Plyr playing event");
        })
        _plyer.on('pause', (event) => {
            console.log("Plyr pause event");
        })
        _plyer.on('ended', (event) => {
            console.log("Plyr ended event");
        })
        _plyer.on('timeupdate', (event) => {
            console.log("Plyr timeupdate event");
        })
        _plyer.on('seeking', (event) => {
            console.log("Plyr seeking event");
        })
        _plyer.on('seeked', (event) => {
            console.log("Plyr seeked event");
        })
        _plyer.on('ready', (event) => {
            resolve(true)
        })
    })
}