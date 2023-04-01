import plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/+esm'
import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import { setCookie } from "/index3_utils.js"

/* import Promise from 'https://cdn.jsdelivr.net/npm/bluebird@3.7.2/+esm'
Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
}); */


const feedbackOnCurrentTime = (currentTime, timings, noSave) => {
    const doSave = typeof noSave === 'undefined' || noSave === false
    const barIndex = timings.time2bar(currentTime)
    const variation = timings.bars[barIndex].variation
    const startBarOfVariation = timings.codec.variation2bar(variation)
    if (timings.previousPlayOnBar != startBarOfVariation) {
        timings.previousPlayOnBar = startBarOfVariation
        if (doSave) {
            setCookie('previousPlayOnBar', timings.previousPlayOnBar)
        } 
        if (true) { // avoid horrible flicker
            let selector = `.grid-brick#gb${variation}`
            if (variation === 0) {
                selector = '.grid-brick#gb-ciaccona'
            } else if (33 <= variation) {
                selector = '.grid-brick#gb-bwv1004'
            }
            console.log(selector, 'to scroll into view', selector)
            document.querySelector(selector).scrollIntoView({block: "nearest"})
        }

        jquery('.grid-brick.playing .score').scrollLeft(0)
        jquery(".grid-brick.playing").removeClass("playing")
        jquery(`.grid-brick#gb${variation}`).addClass("playing");
        /*

        { behavior: "smooth", block: "nearest", inline: "nearest" }
            jquery(".grid-brick.seeking").removeClass("seeking")
            jquery(".grid-brick.seeking").removeClass("seeking")
            jquery(`.grid-brick#gb${bar.variation}`).addClass("seeking");
        */
    }
}

const setBrickClickEvent = (_plyer, timings) => {

    function handleBrickClick(event) {
        event.stopImmediatePropagation()

        console.log("clicked on brick")

        const isPlaying = _plyer.playing

        // DOM element has bar index in data
        const thisBar = parseInt(this.dataset.bar)

        if (timings.previousPlayOnBar === thisBar) {
            // just toggle play state
            if (isPlaying) {
                jquery('.grid-brick.playing .score').scrollLeft(0)
                jquery('.grid-brick.playing').removeClass('playing')
                _plyer.pause();
            } else {
                jquery(event.currentTarget).parent().addClass('playing')
                _plyer.play()
            }
        } else {
            // get bar data from timings
            let startBar = timings.bars[thisBar]
            console.log('we are on bar ', thisBar, 'variation', thisBar.variation, 'variation starts at bar', startBar.index)

            // seek to the duration
            _plyer.currentTime = startBar.duration.asMilliseconds() / 1000

            if (!isPlaying) {
                jquery('.grid-brick.playing .score').scrollLeft(0)
                jquery('.grid-brick.playing').removeClass('playing')
                jquery(event.currentTarget).parent().addClass('playing')
                _plyer.play()
            }
        }

    }

    document.querySelectorAll(".brick.hasScore").forEach((b) => b.addEventListener('click', handleBrickClick, true))
}

export default function createPlayer(selector, timings) {
    const thisFunctionName = "createPlayer"

    return new Promise((resolve, reject) => {
        let _plyer = new plyr(selector, {
            mute: false
        })
        _plyer.on('playing', (event) => {
            console.log("Plyr playing event");
            setCookie('playing', 'true')
            feedbackOnCurrentTime(event.detail.plyr.currentTime, timings)
        })
        _plyer.on('pause', (event) => {
            console.log("Plyr pause event");
            setCookie('playing', 'false')
            jquery('.grid-brick.playing .score').scrollLeft(0)
            jquery(".grid-brick.playing").removeClass("playing")
        })
        _plyer.on('ended', (event) => {
            console.log("Plyr ended event");
            setCookie('playing', 'false')
            setCookie('previousPlayOnBar', 0)
            jquery('.grid-brick.playing .score').scrollLeft(0)
            jquery(".grid-brick.playing").removeClass("playing")
        })
        _plyer.on('timeupdate', (event) => {
            console.log("Plyr timeupdate event");
            feedbackOnCurrentTime(event.detail.plyr.currentTime, timings)
        })
        _plyer.on('seeking', (event) => {
            console.log("Plyr seeking event");
            const seekTime = event.detail.plyr.media.duration * (event.detail.plyr.elements.inputs.seek.value / 100);
            feedbackOnCurrentTime(seekTime, timings, true /* no save*/)
        })
        _plyer.on('seeked', (event) => {
            console.log("Plyr seeked event");
            feedbackOnCurrentTime(event.detail.plyr.currentTime, timings)
        })
        _plyer.on('ready', (event) => {
            setBrickClickEvent(_plyer, timings)
            resolve({ 
                key: thisFunctionName, 
                value: _plyer 
            })
        })
    })
}