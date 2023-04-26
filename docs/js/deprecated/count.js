import config from "/js/config.js?v=0.10.1"

// https://countapi.xyz/
// https://medium.com/@mignunez/how-to-count-the-number-of-visits-on-your-website-with-html-css-javascript-and-the-count-api-2f99b42b5990

// create
// https://api.countapi.xyz/create?namespace=ciaccona.cthiebaud.com&enable_reset=1&key=artists
// get
// https://api.countapi.xyz/get/ciaccona.cthiebaud.com/artists
// bump
// https://api.countapi.xyz/hit/ciaccona.cthiebaud.com/artists
// set 
// https://api.countapi.xyz/set/ciaccona.cthiebaud.com/artists?value=0

function count(key, elementId, test) {
    if (!config.countViews) return 
    let action = 'hit'
    if (config.incognito) {
        action = 'get'
    } else {
        if (test !== 'true') {
            const url = new URL(window.location)
            if (url.hostname === 'localhost') {
                action = 'get'
            }
        }
    }
    const countAPIURL = `https://api.countapi.xyz/${action}/ciaccona.cthiebaud.com/${key}`
    fetch(countAPIURL).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }        
        return response.json()
    }).then(json => {
        console.log(countAPIURL, json)
        config.views = json.value
        if (elementId) {
            const element = document.getElementById(elementId)
            if (element) element.innerHTML = config.views
        }
    }).catch(error => {
        config.countViews = false
        console.log(error)
    }) 
}

function fetchCountForKeyToSelector(key, selector) {
    if (!config.countViews) {
        const element = document.querySelector(selector)
        if (element) {
            element.innerHTML = ''
            element.dataset.number = -1
        }
        return false
    }
    const countAPIurl = `https://api.countapi.xyz/get/ciaccona.cthiebaud.com/${key}`
    fetch(countAPIurl).then(response => {
        return response.json()
    }).then(text => {
        const element = document.querySelector(selector) 
        if (element) {
            element.innerHTML = text.value
            element.dataset.number = parseInt(text.value)
        }
    })
    return true
}

export {count, fetchCountForKeyToSelector }