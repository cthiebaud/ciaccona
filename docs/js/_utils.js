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
function binaryRangeSearch(value, array, getValue) {
    if (getValue == null) getValue = (ind, arr) => arr[ind]

    let low = 0;
    let high = array.length - 1;
    let mid
    let minValue, maxValue

    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        minValue = getValue(mid, array)
        maxValue = mid < array.length - 1 ? getValue(mid + 1, array) : Number.MAX_VALUE

        if (value < minValue) {
            high = mid - 1;
        } else if (maxValue <= value) {
            low = mid + 1;
        } else {
            return mid;
        }
    }
    return 0 // something went wrong, return index of first element in array 
}


export { getCookie, setCookie, removeCookie, shuffleArray, binaryRangeSearch };
