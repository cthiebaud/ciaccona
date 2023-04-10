import { getCookie } from "/js/_utils2.js"

let fullscore = getCookie('fullscore')
if (!fullscore || fullscore === 'false') {
    fullscore = false
} else {
    fullscore = true
}

let showHelpAtStart = getCookie('showHelpAtStart')
if (!showHelpAtStart || showHelpAtStart === 'true') {
    showHelpAtStart = true
} else {
    showHelpAtStart = false
}

export { fullscore, showHelpAtStart }