import { getCookie } from "/js/_utils2.js"

let fullscore = getCookie('fullscore')
if (!fullscore || fullscore === 'false') {
    fullscore = false
} else {
    fullscore = true
}

let scoreDisplay = getCookie('scoreDisplay')
if (!scoreDisplay) scoreDisplay = 'firstBar'

let showHelpAtStart = getCookie('showHelpAtStart')
if (!showHelpAtStart || showHelpAtStart === 'true') {
    showHelpAtStart = true
} else {
    showHelpAtStart = false
}

export { fullscore, scoreDisplay, showHelpAtStart }