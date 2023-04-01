// https://github.com/js-cookie/js-cookie
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

function removeCookie(cookieName) {
    jsCookie.remove(cookieName)
    console.log("cookie", cookieName, "removed")
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

// https://stackoverflow.com/a/41621478/1070215
function getFunctionCallerName() {
    // gets the text between whitespace for second part of stacktrace
    return (new Error()).stack.match(/at (\S+)/g)[1].slice(3);
}

// https://code.tutsplus.com/the-binary-search-algorithm-in-javascript--cms-30003t
function binaryRangeSearch(value, list, getValue) {
    if (typeof getValue === 'undefined') getValue =(i, arr) => arr[i]

    let low = 0;                  // left endpoint 
    let high = list.length - 1;   // right endpoint 
    let mid
    let minValue, maxValue

    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        minValue = getValue(mid, list)
        maxValue = mid < list.length - 1 ? getValue(mid + 1, list) : Number.MAX_VALUE

        if (value < minValue) {
            high = mid - 1;
        } else if (maxValue <= value) {
            low = mid + 1;
        } else {
            return mid;
        }
    }
    return 0 // something is wrong, return first array element
}


export { getCookie, setCookie, removeCookie, shuffleArray, binaryRangeSearch };
