import plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/+esm'
import jquery from 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/+esm'
import { setCookie, removeCookie } from "/js/_utils.js"

function scrollScore(selector, timings, variation, currentTime) {
    if (variation === 33) return -1
    const sco = document.querySelector(selector)
    if (sco == null) return -1
    const obj = sco.firstElementChild
    if (obj == null) return -1

    const scoWidth = sco.getBoundingClientRect().width
    const objWidth = obj.getBoundingClientRect().width
    if (objWidth <= scoWidth)
        return -1
    const maxScroll = objWidth

    const curr = timings.codec.variation2bar(variation)
    const next = timings.codec.variation2bar(variation + 1)
    const thisStartBar = timings.bars[curr]
    const nextStartBar = timings.bars[next]
    const thisStartTime = thisStartBar.duration.asMilliseconds() / 1000
    const nextStartTime = nextStartBar.duration.asMilliseconds() / 1000
    const ellapsed = currentTime - thisStartTime
    const maximum = nextStartTime - thisStartTime
    // règle de trois : 
    /* 
    scrollLeft / maxScroll = ellapsed / maximum
    */
    const scrollLeft = Math.floor(((ellapsed * maxScroll) / maximum) - (scoWidth / 2))
    if (scrollLeft < 0 || objWidth - scoWidth <= scrollLeft) return -1

    sco.scrollLeft = scrollLeft

    return scrollLeft
}

function selectAndScrollToVariation(source, variation, options) {
    const selector = `.grid-brick#gb${variation}`
    let scrollToSelector = selector
    if (variation === 0) {
        scrollToSelector = '.grid-brick#gb-ciaccona'
    } else if (33 <= variation) {
        scrollToSelector = '.grid-brick#gb-bwv1004'
    }

    jquery('.grid-brick').removeClass('selected')
    document.querySelector(selector)?.classList.add('selected')

    const scrollToElement = document.querySelector(scrollToSelector)
    console.log(source, selector, 'to scroll into view', options)
    scrollToElement?.scrollIntoView(options)
}

function showPlay(currentTime, timings) {
    const barIndex = timings.time2bar(currentTime)
    if (barIndex == null || barIndex === -1) {
        console.log('no variation here', currentTime)
        jquery('.grid-brick.gbPlaying .score').scrollLeft(0)
        jquery('.grid-brick').removeClass('gbPlaying').removeClass('selected')
        return
    }
    const variation = timings.bars[barIndex].variation
    console.log('showing play of variation', variation)
    jquery('.grid-brick.gbPlaying .score').scrollLeft(0)
    jquery('.grid-brick').removeClass('gbPlaying').removeClass('selected')
    jquery(`.grid-brick#gb${variation}`).addClass('gbPlaying').addClass('selected')
}

function hidePlay(cause) {
    console.log('hidding play')
    if (cause !== 'pause') jquery('.grid-brick.gbPlaying .score').scrollLeft(0)
    jquery('.grid-brick.gbPlaying').removeClass('gbPlaying')
}

const feedbackOnCurrentTime = (source, currentTime, timings, noSave, isPlaying, scrollToVariation, scrollOptions) => {

    const doSave = noSave == null || noSave === false

    const barIndex = timings.time2bar(currentTime)
    if (barIndex == null || barIndex === -1) {
        console.log('no variation here', currentTime)
        jquery('.grid-brick.gbPlaying .score').scrollLeft(0)
        jquery('.grid-brick').removeClass('gbPlaying').removeClass('selected')
        if (doSave) {
            timings.setStartBarOfLastSelectedVariation(undefined)
        }
        return
    }
    const variation = timings.bars[barIndex].variation
    const startBarOfThisVariation = timings.bars[barIndex].variationStartBarIndex

    // changement de variation 
    if (timings.getStartBarOfLastSelectedVariation() != startBarOfThisVariation) {
        timings.setStartBarOfLastSelectedVariation(startBarOfThisVariation)
    }

    if (isPlaying) {
        const selector = `#gb${variation} > div > div.score`
        const scrollLeft = scrollScore(selector, timings, variation, currentTime)

    }
    if (true) {

        const doSwap = (alt, neu) => {
            if (neu == null) return false
            if (alt == neu) return false
            return true
        }
        const oldBrickplaying = jquery(".grid-brick.gbPlaying")
        const newBrick = jquery(`.grid-brick#gb${variation}`)
        const altID = oldBrickplaying.attr('id')
        const neuID = newBrick.attr('id')
        const doIt = doSwap(altID, neuID)
        if (altID == null && neuID === 'gb0') {
            console.log("quel est le con qui m'envoie ça ?", altID, neuID)
        }
        // console.log(source, 'SWAP from', altID, 'to', neuID, '?', doIt ? "yes!" : "no!")
        if (doIt) {
            // swap
            oldBrickplaying.find('.score').scrollLeft(0)
            if (isPlaying) {
                jquery('.grid-brick').removeClass('gbPlaying').removeClass('selected')
                newBrick.addClass('gbPlaying').addClass('selected')
            } else {
                jquery('.grid-brick').removeClass('selected')
                newBrick.addClass('selected')
            }
            if (scrollToVariation) {
                selectAndScrollToVariation(source, variation, scrollOptions)
            }
        }
    }
}

const setBrickClickEvent = (_plyer, timings) => {

    function handleBrickClick(event) {
        event.stopImmediatePropagation()

        setTimeout(() => {
            _plyer.muted = false
        }, 200)

        const isPlaying = _plyer.playing

        // DOM element has bar index in data
        const thisBar = parseInt(this.dataset.bar)

        if (timings.getStartBarOfLastSelectedVariation() === thisBar) {
            // just toggle play state
            if (isPlaying) {
                _plyer.pause()
            } else {
                _plyer.play()
            }
        } else {
            // get bar data from timings
            let startBar = timings.bars[thisBar]
            console.log(`CLICKED on bar ${thisBar} [${timings.bars[thisBar]["Time Recorded"]}], variation ${timings.bars[thisBar].variation}, variation starts at bar ${startBar.index}`)

            // seek to the duration
            _plyer.currentTime = startBar.duration.asMilliseconds() / 1000

            if (!isPlaying) {
                _plyer.play()
            }
        }

    }

    document.querySelectorAll(".brick.hasScore").forEach((b) => b.addEventListener('click', handleBrickClick, true))
}

export default function createPlayer(selector, timings, ignore_all_events) {
    const thisFunctionName = "createPlayer"

    return new Promise((resolve, reject) => {
        let _plyer = new plyr(selector, {
        })

        function INIT_EVENT_HANDLERS() {
            /*
            _plyer.on('volumechange', (event) => {
                console.log("Plyr volumechange event", event.detail.plyr.media.volume)
            })

            _plyer.on('canplay', (event) => {
                console.log("Plyr canplay event", event)
            })

            _plyer.on('canplaythrough', (event) => {
                console.log("Plyr canplaythrough event", event)
            })
            _plyer.on('statechange', (event) => {
                console.log("Plyr statechange event")
            })
            _plyer.on('waiting', (event) => {
                console.log("Plyr waiting event")
            })
            _plyer.on('progress', (event) => {
                console.log("Plyr progress event", event.detail.plyr.buffered)
            })
            */

            _plyer.on('pause', (event) => {
                console.log("Plyr pause event")
                setCookie('playing', 'false')
                hidePlay('pause')
            })
            _plyer.on('ended', (event) => {
                console.log("Plyr ended event")
                removeCookie('playing')
                timings.setStartBarOfLastSelectedVariation(0)
                hidePlay()
            })
            _plyer.on('playing', (event) => {
                console.log("Plyr playing event")
                setCookie('playing', 'true')
                showPlay(event.detail.plyr.currentTime, timings)
                feedbackOnCurrentTime('playing', event.detail.plyr.currentTime, timings, undefined /* save variation */, _plyer.playing, true, { behavior: "smooth", block: "nearest" })
            })
            _plyer.on('timeupdate', (event) => {
                // console.log("Plyr timeupdate event")
                if (!_plyer.playing) {
                    // console.log("Plyr timeupdate event: do nothing when not playing")
                } else {
                    // console.log("Plyr timeupdate event while plying")
                    feedbackOnCurrentTime('timeupdate', event.detail.plyr.currentTime, timings, undefined /* save variation */, _plyer.playing, true, { behavior: "smooth", block: "nearest" })
                }
            })
            _plyer.on('seeking', (event) => {
                console.log("Plyr seeking event")

                if (event.detail.plyr.elements.inputs.seek.value == 0) {
                    console.log("never do nothing when not seeking something else than 0 - comprenne qui pourra")
                    return
                }

                const seekTime = event.detail.plyr.media.duration * (event.detail.plyr.elements.inputs.seek.value / 100)
                feedbackOnCurrentTime('seeking', seekTime, timings, true /* do not save variation */, _plyer.playing, true, { behavior: "instant", block: "center" })
            })
            _plyer.on('seeked', (event) => {
                console.log("Plyr seeked event")
                feedbackOnCurrentTime('seeked', event.detail.plyr.currentTime, timings, undefined /* save variation */, _plyer.playing, true, { behavior: "smooth", block: "center" })
            })
        }

        _plyer.on('ready', (event) => {
            console.log("Plyr ready event")

            setBrickClickEvent(_plyer, timings)

            function closeInitializationCallback(closecloseCallback) {

                if (!ignore_all_events) {
                    INIT_EVENT_HANDLERS()

                    let theStartingBar = timings.bars[0]
                    let theLastStartingBarIndex = timings.getStartBarOfLastSelectedVariation()
                    if (theLastStartingBarIndex != null) {
                        theStartingBar = timings.bars[theLastStartingBarIndex]
                    }
                    console.log("Dear plyr, I'd like you to seek at bar <", theStartingBar.index, "> (", theStartingBar["Time Recorded"], "), thanks.")
                    _plyer.currentTime = theStartingBar.duration.asMilliseconds() / 1000
                }
                if (closecloseCallback) closecloseCallback()

            }

            resolve({
                key: thisFunctionName,
                value: {
                    player: _plyer,
                    closeInitializationCallback: closeInitializationCallback
                }
            })
        })
    })
}