import {getCookie} from "/js/_utils.js"

let fullscore = getCookie('fullscore')
if (fullscore === 'true') {
    fullscore = true
} else {
    fullscore = false
}

export {fullscore}