import { getCookie } from "/js/_utils2.js"

let scoreDisplay = getCookie('scoreDisplay')
if (!scoreDisplay) scoreDisplay = 'firstBar'


export { scoreDisplay }