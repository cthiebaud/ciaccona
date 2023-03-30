function getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
}

async function resizeSVGs(selection, withOffsetX,  elementCallback, finalCallback) {

    const lesPromessesDeLeSVG = []

    selection.forEach((o) => {
        lesPromessesDeLeSVG.push(new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                let SVG = o.contentDocument;
                if (!SVG || !SVG.children || SVG.children.length == 0) {
                    return
                }

                clearInterval(interval);

                const svg = SVG.children[0]

                resolve({ o: o, svg: svg, offset: o.dataset.svgOffsetX ? parseInt(o.dataset.svgOffsetX) : 0 })
            }, 10)
            setTimeout(() => {
                clearInterval(interval);
                reject({ o: o, svg: undefined })
            }, 10000) // kill it after 10 seconds
        }))
    })
    const setViewBoxes = (results) => {
        let maxWidth = 0
        let maxHeight = 0
        results.forEach((result) => {
            if (result.status === "fulfilled") {
                const svg = result.value.svg
                const box = svg.getBBox()
                maxWidth = Math.max(maxWidth, box.width)
                maxHeight = Math.max(maxHeight, box.height)
            }
        })
        results.forEach((result) => {
            if (result.status === "fulfilled") {
                // https://lists.gnu.org/archive/html/bug-lilypond/2017-07/msg00010.html
                const svg = result.value.svg

                const box = svg.getBBox()
                // où est le centre ?
                const centerX = box.x + box.width / 2
                const x = centerX - maxWidth / 2
                const centerY = box.y + box.height / 2
                const y = centerY - maxHeight / 2
                const viewBox = [box.x + (withOffsetX && result.value.offset ? result.value.offset: 0), y, box.width, maxHeight].join(" ")
                svg.setAttribute("viewBox", viewBox)
                svg.setAttribute("preserveAspectRatio", "xMinYMid meet")
                svg.removeAttribute("height")
                svg.removeAttribute("width") 
                if (elementCallback) elementCallback(result.value.o)
            }
        })
        if (finalCallback) finalCallback()
    }
    Promise.allSettled(lesPromessesDeLeSVG).then(setViewBoxes)
}

