import isotopeLayout from 'https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/+esm'
import config from "/js/config.js?v=0.10.6"
import codec from "/js/structure.js?v=0.10.6"
import createColoredBadges from "/js/colors.js?v=0.10.6"
import createTimings from "/js/timings.js?v=0.10.6"
import resizeSVGs from "/js/resizeSVGs.js?v=0.10.6"
import createPlayer from "/js/player.js?v=0.10.6"
import Ω from "/js/dom.js?v=0.10.6.1"

// transform windows loaded event into promise
const windowLoaded = new Promise((resolve) => {
    window.addEventListener('load', (event) => {
        resolve(event)
    })
})

const about = new Ω.About()

// tidyfication of menu items
document.querySelectorAll('#videos-menu span.c').forEach((e) => e.innerHTML = "")
if (fullameNoSpaceLowercaseNoDiacritics) {
    const menuItem = document.querySelector(`#videos-menu a[data-name-no-space-lowercase-no-diacritics="${fullameNoSpaceLowercaseNoDiacritics}"]`)
    if (menuItem) {
        menuItem.classList.add('disabled')
        menuItem.querySelector(`span.c`).innerHTML = "&#10004;&nbsp;"
    }
    const gridContainerCol = document.getElementById('gridContainerCol')
    if (gridContainerCol) gridContainerCol.classList.add('push2right')
} else {
    const menuItem = document.querySelector(`#videos-menu a[data-name-no-space-lowercase-no-diacritics=""]`)
    if (menuItem) {
        menuItem.classList.add('disabled')
        menuItem.querySelector('span.c').innerHTML = "&#10004;&nbsp;"
    }
    [...document.getElementsByTagName('body')].forEach(e => e.style['background-color'] = 'transparent')
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * 
createColoredBadges(fullameNoSpaceLowercaseNoDiacritics);
Ω.showScoreDisplay()
Ω.showScoreInBricks()

// elaborate a bit some config values 
const autoplayChecked = document.getElementById('autoplayChecked')
if (autoplayChecked) {
    if (config.autoplay) autoplayChecked.checked = true
}

; (e => { if (e) e.innerHTML = config.views })(document.getElementById('views'));

; (grid => {
    if (grid) {
        const gridradioId = `${config.scoreDisplay}Checked`
        document.getElementById(gridradioId).checked = true
        grid.dataset.scoreDisplay = config.scoreDisplay

        const gridradioId2 = `${config.scoreInBricks}Checked`
        document.getElementById(gridradioId2).checked = true
        grid.dataset.scoreInBricks = config.scoreInBricks

    }
})(document.getElementById('grid'));


// loading 
const hideLoading = (hasPlayer) => {
    if (hasPlayer) document.getElementById('playerWrapper').style.visibility = 'visible'
    const loadingE = document.getElementById('loading')
    if (loadingE) {
        document.getElementById('config-menu').style.display = 'flex'
        document.getElementById('videos-menu').style.display = 'flex'
        loadingE.style.display = 'none'
        console.log('loading dismissed')
    }
}

// everything
const allPromises = new Map()
// name of main promises, for bookkeeping
const RESIZE = "RESIZE", PLAYER = "PLAYER", ISOTOPE = "ISOTOPE";

// 1. promise resolves when 1) windows is loaded, then 2) all SVGs for scores have been loaded and resized
allPromises.set(
    RESIZE,
    windowLoaded.then((result) => {
        const SVGs = document.querySelectorAll('#grid .brick > .score > object')
        if (SVGs.length === 0) {
            throw new Error('no SVG to resize')
        }
        document.getElementById('resizeScores').addEventListener('click', () => {
            resizeSVGs(
                document.querySelectorAll('#grid .brick > .score > object'),
                config.scoreDisplay !== 'fullScore'
            )
        });
        return resizeSVGs(
            SVGs,
            config.scoreDisplay !== 'fullScore', // full width IS NOT checked -> true: honor X offset to hide clef signature, else full width IS checked -> false: no offset
            (obj) => {
                // console.log('done', obj.id)
            }).then(result => {
                if (config.scoreInBricks === 'allBricks') {
                    Ω.animateUnveilScores()
                } else {
                    document.querySelectorAll('.score').forEach((score) => {
                        score.classList.remove('init')
                    })
                }
                return result
            })
    })
)

// 2. promises resolves when 1) timings for this artist have been loeaded, then 2) video player is ready
if (fullameNoSpaceLowercaseNoDiacritics) {

    allPromises.set(
        PLAYER,
        createTimings(fullameNoSpaceLowercaseNoDiacritics).then((artist) => {

            // we have more info bout the artist
            Ω.showArtist(artist)

            const selectorPlyr = Ω.beforeCreatePlayer(artist['▶'].id) // big buffer of everything that needs to be done BEFORE creating the player

            return createPlayer(selectorPlyr, artist, no_plyr_event)
        }).catch((error) => {
            console.log(error);
            document.getElementById('gridContainerCol').classList.remove('push2right')
            throw error
        })
    )
}

// 3. create and flood color bricks into isotope
allPromises.set(
    ISOTOPE,
    new Promise((resolve, reject) => {
        if (!document.querySelector('#grid')) {
            reject('no grid')
        } else {
            const theIsotope = new isotopeLayout('#grid', {
                itemSelector: ".grid-brick",
                sortBy: 'id',
                getSortData: {
                    id: '[data-sort]'
                },
                percentPosition: true,
            })
            theIsotope.on('layoutComplete', function () {
                console.log("isotope layout complete");
            })

            // big buffer of everything that needs to be done AFTER bricks are ready
            Ω.afterIsotope(theIsotope)

            resolve({ key: ISOTOPE, value: theIsotope })
        }
    })
)

// when all these three are done
Promise.allSettled([...allPromises.values()]).then((results) => {

    // transform results in something more readable (well, really?)
    const map = new Map(results
        .filter((result) => {
            const add = (
                result.status === 'fulfilled' &&
                result.value != null &&
                result.value.key != null &&
                result.value.value != null)
            if (!add) {
                console.log('some issue with this promise', result)
            }
            return add
        })
        .map((result) => {
            return [result.value.key, result.value.value]
        }));

    console.log(`All promises settled. Promises fullfilled: ${map.size} / ${results.length}`, results)

    const isotopeResult = map.get(ISOTOPE)
    const playerResult = map.get(PLAYER)

    if (isotopeResult) {
        isotopeResult.on('arrangeComplete', function (filteredItems) {
            hideLoading(playerResult);
        })
        if (!playerResult) {
            console.log("change isotope filter to hide artist name")
            isotopeResult.arrange({ filter: ':not(.artist)' })

            // select last variation
            let theLastStartingBarIndex = config.startBarOfLastSelectedVariation
            const varation = codec.bar2variation(theLastStartingBarIndex)
            const e = document.getElementById(`gb${varation}`)
            if (e) {
                e.classList.add('selected')
                e.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        } else {
            ; ((e, a) => { if (e) {e.dataset.a = a; e.href="#"} })(document.querySelector("#gb-bwv1004 a"), fullameNoSpaceLowercaseNoDiacritics)
            console.log("change isotope filter to show artist name")
            isotopeResult.arrange({ filter: '*' })
        }
    }

}).catch((error) => {

    hideLoading();

    alert(error)

    return error
})

