import { getCookie } from "/js/__utils.js"

let fullscore = getCookie('fullscore')
if (fullscore === 'true') {
    fullscore = true
} else {
    fullscore = false
}

export { fullscore }