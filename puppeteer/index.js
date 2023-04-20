var fs = require("fs");
const puppeteer = require('puppeteer');

(async () => {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1200, height: 628 });

    const performer = 'miguelrincon'

    fs.rmSync(`./performers/${performer}`, {force: true, recursive: true});
    fs.mkdirSync(`performers/${performer}`);

    const cookies = [{
        name: 'scoreDisplay',
        value: 'firstBar',
        domain: 'localhost'
    }, {
        name: 'scoreInBricks',
        value: 'selectedBrick',
        domain: 'localhost'
    }]

    await page.setCookie(...cookies);

    console.log('cookies done!')

    const website_url = `http://localhost:1010/video/${performer}.html`;

    console.log(website_url)

    // Open URL in current page  
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    let i = 0
    let intervalObj
    const promise = new Promise(resolve => {

        async function myFunc(performer) {
            const variation = i.toString()
            i++
            // Query for an element handle.
            const element = await page.waitForSelector(`#gb${variation} > div > div.score`);

            console.log(`seeking to variation ${variation}`)

            // Do something with element...
            await element.click();

            const playerControls = await page.$$('#playerWrapper > div > div.plyr__controls');
            for (let qwe of playerControls) {
                //hover on each element handle
                await qwe.hover();
                setTimeout(async () => {
                    // Capture screenshot
                    const path = `performers/${performer}/${performer}-${variation}.jpg`
                    console.log(`saving screenshot to ${path}`)
                    await page.screenshot({
                        path: path
                    });

                    // Dispose of handle
                    await element.dispose();

                    if (34 <= i) {
                        resolve()
                    }
                }, 1500, performer, variation)
                break;
            }
        }
        intervalObj = setInterval(myFunc, 2000, performer)
    });

    promise.then(async () => {
        clearInterval(intervalObj);
        await browser.close()
    })

})();