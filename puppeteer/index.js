var fs = require("fs");
const puppeteer = require('puppeteer');

(async () => {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 628 });

    const performers = [
        'adolfbusch',
        'amandinebeyer',
        'andreadevitis',
        'anneleenlenaerts',
        'bellahristova',
        'chiaramassini',
        'christiantetzlaff',
        'moi',
        'florentinginot',
        'genzohtakehisa',
        'hilaryhahn',
        'isabellefaust',
        'juliafischer', 
        'lisajacobs',
        'lizaferschtman',
        'martafemenia',
        'martinbaker',
        'michaelleontchik',
        'midorigoto',
        'miguelrincon',
        'mikastoltzman',
        'moranwasser',
        'petrapolackova',
        'polinaosetinskaya',
        'rachellellenwong',
        'rachelpodger',
        'raphaellasmits',
        'sigiswaldkuijken',
        'veronikaeberle',
        'veroniquederaedemaeker',
        'virginierobilliard',
        'vonhansen',
        'yunpark',
    ]

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

    const promisePerformers = new Promise(async resolvePerformers => {

        for (let p = 0; p < performers.length; p++) {
            const performer = performers[p]

            console.log(performer)

            fs.rmSync(`./performers/${performer}`, { force: true, recursive: true });
            fs.mkdirSync(`performers/${performer}`);

            const website_url = `http://localhost:1010/video/${performer}.html`;
            // const website_url = `https://api.countapi.xyz/create?namespace=ciaccona.cthiebaud.com&enable_reset=1&key=${performer}`

            console.log(website_url)

            // Open URL in current page  
            await page.goto(website_url, { waitUntil: 'networkidle0' });

            /*
            let i = 0
            let intervalObj
            const promiseVariations = new Promise(async (resolveVariation, rejectVariation) => {

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
                                console.log('resolving promiseVariations')
                                console.log('clearInterval')
                                clearInterval(intervalObj);
                                resolveVariation()
                            }
                        }, 1500, performer, variation)
                        break;
                    }
                }
                console.log('setinterval')
                intervalObj = setInterval(myFunc, 2000, performer)
            });
            await promiseVariations.then(async (result) => {
                console.log('promiseVariations then', p)
                return result
            }).catch(error => {
                console.log(error)
                throw error
            })
            */
            console.log('now we should go to next performer, or no ?', p)
        }
        console.log('finito with performers. resolving promisePerformers')
        resolvePerformers()
    })

    await promisePerformers.then(async (result) => {
        console.log('promisePerformers then')
        await browser.close()
        return result
    }).catch(error => {
        console.log(error)
        throw error
    })

})();