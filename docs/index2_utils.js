import jsCookie from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/+esm'

function getCookie(cookieName) {
    const value = jsCookie.get(cookieName)
    console.log("cookie", cookieName, "is", value)
    return value
}

function setCookie(cookieName, cookieValue) {
    jsCookie.set(cookieName, cookieValue, { expires: 2 })
    console.log("cookie", cookieName, "set to", cookieValue)
}

// http://stackoverflow.com/questions/20789373/shuffle-array-in-ng-repeat-angular
// -> Fisher–Yates shuffle algorithm
function shuffleArray(array) {
    let m = array.length,
        t, i;
    // While there remain elements to shuffle
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

export { getCookie, setCookie, shuffleArray };
