var fs = require("fs");
const puppeteer = require('puppeteer');

(async () => {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1200, height: 628 });

    const novid = [
        'adolfbusch',
        'amandinebeyer',
        'christiantetzlaff',
        'hilaryhahn',
        'isabellefaust',
        'juliafischer',
        'rachelpodger',
    ]
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

            fs.rmSync(`./artists/${performer}`, { force: true, recursive: true });
            fs.mkdirSync(`artists/${performer}`);

            const website_url = `http://localhost:1010/video/${performer}.html`;
            // const website_url = `https://api.countapi.xyz/create?namespace=ciaccona.cthiebaud.com&enable_reset=1&key=${performer}`

            console.log(website_url)

            // Open URL in current page  
            await page.goto(website_url, { waitUntil: 'networkidle0' });

            let i = 0
            let intervalObj
            const promiseVariations = new Promise(async (resolveVariation, rejectVariation) => {

                async function myFunc(performer) {
                    const variation = i.toString()
                    i++

                    // https://stackoverflow.com/a/50869650/1070215
                    await page.evaluate((sel) => {
                        var elements = document.querySelectorAll(sel);
                        for(var i=0; i< elements.length; i++){
                            elements[i].style.visibility = 'visible'
                        }
                    }, '#gridContainerCol')

                    // Query for an element handle.
                    const element = await page.waitForSelector(`#gb${variation} > div > div.score`);

                    console.log(`seeking to variation ${variation}`)

                    let max = 34;
                    // Do something with element...
                    /* if (!novid.includes(performer)) { */
                    await element.click();
                    /* } else {
                        max = 1
                    } */
                    await page.evaluate((sel) => {
                        var elements = document.querySelectorAll(sel);
                        for(var i=0; i< elements.length; i++){
                            elements[i].style.visibility = 'hidden'
                        }
                    }, '#videos-menu, #config-menu, #gridContainerCol')

                    const playerControls = await page.$$('#playerWrapper > div > div.plyr__controls');
                    for (let playerControl of playerControls) {
                        //hover on each element handle
                        await playerControl.hover();
                        setTimeout(async () => {
                            // Capture screenshot
                            const path = `artists/${performer}/${performer}-${variation}.jpg`
                            console.log(`saving screenshot to ${path}`)
                            await page.screenshot({
                                path: path
                            });

                            // Dispose of handle
                            await element.dispose();

                            if (max <= i) {
                                console.log('resolving promiseVariations')
                                console.log('clearInterval')
                                clearInterval(intervalObj);
                                resolveVariation()
                            }
                        }, 1000, performer, variation)
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