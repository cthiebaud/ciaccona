import {getCookie} from "/index3_utils.js"

const index2duration = (i) => (i == 10 || i == 15 || i == 19 || i == 29) ? 4 : ((i == 8 || i == 30) ? 12 : 8)

let fullscore = getCookie('fullscore')
if (fullscore === 'true') {
    fullscore = true
} else {
    fullscore = false
}

export {index2duration, fullscore}