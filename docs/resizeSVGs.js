async function resizeSVGs(elementCallback, finalCallback) {
    const lesPromessesDeLeSVG = []

    document.querySelectorAll('object').forEach((o) => {
        lesPromessesDeLeSVG.push(new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                let SVG = o.contentDocument;
                if (!SVG || !SVG.children || SVG.children.length == 0) {
                    console.log("not yet ...", o.id)
                    return
                }

                clearInterval(interval);

                const svg = SVG.children[0]

                resolve({ o: o, svg: svg })
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
                const svg = result.value.svg
                const box = svg.getBBox()
                // où est le centre ?
                const centerX = box.x + box.width/2
                const x = centerX - maxWidth/2
                const centerY = box.y + box.height/2
                const y = centerY - maxHeight/2
                const viewBox = [box.x+6, y, maxWidth, maxHeight].join(" ")
                svg.setAttribute("viewBox", viewBox)
                svg.setAttribute("preserveAspectRatio", "xMinYMid meet")
                console.log(viewBox)
                svg.removeAttribute("height")
                svg.removeAttribute("width")
                if (elementCallback) elementCallback(result.value.o)
            } else {
                console.log(result.status, result.value)
            }
        })
        if (finalCallback) finalCallback()
    }
    Promise.allSettled(lesPromessesDeLeSVG).then(setViewBoxes)
}

