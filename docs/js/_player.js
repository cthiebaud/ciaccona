import plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/+esm'
import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import { getCookie, setCookie } from "/js/_utils.js"

/* import Promise from 'https://cdn.jsdelivr.net/npm/bluebird@3.7.2/+esm'
Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
}); */
function scrolltoVariation(variation, options) {
    let selector = `.grid-brick#gb${variation}`
    if (variation === 0) {
        selector = '.grid-brick#gb-ciaccona'
    } else if (33 <= variation) {
        selector = '.grid-brick#gb-bwv1004'
    }
    // console.log(selector, 'to scroll into view', selector)
    document.querySelector(selector).scrollIntoView(options ? options : { block: "nearest" })
}

function showPlay(currentTime, timings) {
    const barIndex = timings.time2bar(currentTime)
    const variation = timings.bars[barIndex].variation
    console.log('showing play of variation', variation)
    jquery('.grid-brick.playing .score').scrollLeft(0)
    jquery('.grid-brick.playing').removeClass('playing')
    jquery(`.grid-brick#gb${variation}`).addClass('playing')
}
function hidePlay() {
    console.log('hidding play')
    jquery('.grid-brick.playing .score').scrollLeft(0)
    jquery('.grid-brick.playing').removeClass('playing')
}

const feedbackOnCurrentTime = (currentTime, timings, noSave) => {
    const doSave = typeof noSave === 'undefined' || noSave === false
    const barIndex = timings.time2bar(currentTime)
    const variation = timings.bars[barIndex].variation
    const startBarIndexOfVariation = timings.bars[barIndex].variationStartsAtBarIndex
    if (timings.previousPlayOnBar != startBarIndexOfVariation) {
        timings.previousPlayOnBar = startBarIndexOfVariation
        if (doSave) {
            setCookie('previousPlayOnBar', timings.previousPlayOnBar)
        }
        scrolltoVariation(variation)
    }
    
    if (true) {
        const oldBrickplaying = jquery(".grid-brick.playing")
        const newBrick = jquery(`.grid-brick#gb${variation}`)
        const avoidSwap = (
            !oldBrickplaying ||
            oldBrickplaying.length === 0 ||
            !oldBrickplaying[0].id ||
            !newBrick || 
            !newBrick.length === 0 ||
            !newBrick[0].id ||
            oldBrickplaying[0].id === newBrick[0].id 
        )
        console.log('swap from', oldBrickplaying.attr('id'), 'to', newBrick.attr('id'), '?', avoidSwap ? "no!" : "yes!")
        if (!avoidSwap) {
            // swap
            oldBrickplaying.find('.score').scrollLeft(0)
            oldBrickplaying.removeClass('playing')
            newBrick.addClass('playing')
        }
    }

    /*

    { behavior: "smooth", block: "nearest", inline: "nearest" }
        jquery(".grid-brick.seeking").removeClass("seeking")
        jquery(".grid-brick.seeking").removeClass("seeking")
        jquery(`.grid-brick#gb${bar.variation}`).addClass("seeking")
    */
}

const setBrickClickEvent = (_plyer, timings) => {

    function handleBrickClick(event) {
        event.stopImmediatePropagation()

        _plyer.muted = false

        const isPlaying = _plyer.playing

        // DOM element has bar index in data
        const thisBar = parseInt(this.dataset.bar)

        if (timings.previousPlayOnBar === thisBar) {
            // just toggle play state
            if (isPlaying) {
                _plyer.pause()
            } else {
                _plyer.play()
            }
        } else {
            // get bar data from timings
            let startBar = timings.bars[thisBar]
            console.log('we are on bar ', thisBar, timings.bars[thisBar]["Time Recorded"], 'variation', timings.bars[thisBar].variation, 'starts at bar', startBar.index)

            // seek to the duration
            _plyer.currentTime = startBar.duration.asMilliseconds() / 1000

            if (!isPlaying) {
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
        })
        _plyer.on('playing', (event) => {
            console.log("Plyr playing event")
            setCookie('playing', 'true')
            showPlay(event.detail.plyr.currentTime, timings)
        })
        _plyer.on('pause', (event) => {
            console.log("Plyr pause event")
            setCookie('playing', 'false')
            hidePlay()
        })
        _plyer.on('ended', (event) => {
            console.log("Plyr ended event")
            setCookie('playing', 'false')
            timings.previousPlayOnBar = 0
            setCookie('previousPlayOnBar', 0)
            hidePlay()
        })
        _plyer.on('timeupdate', (event) => {
            // console.log("Plyr timeupdate event")
            feedbackOnCurrentTime(event.detail.plyr.currentTime, timings)
        })
        _plyer.on('seeking', (event) => {
            console.log("Plyr seeking event")
            const seekTime = event.detail.plyr.media.duration * (event.detail.plyr.elements.inputs.seek.value / 100)
            feedbackOnCurrentTime(seekTime, timings, true /* no save*/)
        })
        _plyer.on('seeked', (event) => {
            console.log("Plyr seeked event")
            feedbackOnCurrentTime(event.detail.plyr.currentTime, timings)
        })
        _plyer.on('ready', (event) => {
            console.log("Plyr ready event")
            setBrickClickEvent(_plyer, timings)

            const previousBar = timings.bars[timings.previousPlayOnBar]
            console.log("Dear plyr, as you are ready, can you seek at bar <", previousBar.index, "> (", previousBar["Time Recorded"], ") ?")
            _plyer.currentTime = previousBar.duration.asSeconds()
            scrolltoVariation(previousBar.variation, { block: "center" })

            /* NO AUTOPLAY - TOO BUGGY
            const wasPlaying = getCookie('playing')
            if (wasPlaying === 'true') {
                setTimeout(() => {
                    try {
                        console.log("---> one second is elapsed, trying to play UMUTED")
                        console.log("Dear plyr, last time we met, you where playing, weren't you? May I politely ask you to resume playing? (in one second) --->")
                        // youtube annoying "feature" (no sound before play/pause)
                        // https://github.com/sampotts/plyr/issues/1527#issuecomment-519398492
                        _plyer.muted = true
                        _plyer.muted = false
                        _plyer.play()
                        _plyer.pause()
                        _plyer.play()
                        jquery(`.grid-brick#gb${previousBar.variation}`).addClass('playing')
                    } catch (error) {
                        console.error(error)
                    } 
                    console.log('previousBar.variation', previousBar.variation)
                }, 1000)
            }
            */

            resolve({
                key: thisFunctionName,
                value: _plyer
            })
        })
    })
}