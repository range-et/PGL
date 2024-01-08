const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const fs = require('fs');

const app = express();
const port = 3000; // You can choose any available port

app.use('/js', express.static(path.join(__dirname, '..', 'Build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/test_1.html'));
});

app.listen(port);

console.log("Running a test script to check if visualisations match or not against a pre-configured test image");

console.log('Server started at http://localhost:' + port);

async function takeScreenshot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({ width: 900, height: 800 });

    await page.goto('http://localhost:3000/');
    await page.waitForSelector('#displayCanvas');
    const screenshot = await page.screenshot();
    // This is because some pages dont close
    const pages = await browser.pages();
    for (let i = 0; i < pages.length; i++) {
        await pages[i].close();
    }
    // try the native code 
    await browser.close();
    // then actually kill the process
    const browserPid = browser.process()?.pid;
    if (browserPid) {
        console.log("Closing Browser");
        try {
            process.kill(browserPid);
        }
        catch (error) {
            //pass
        }
    }
    return screenshot;
}

async function compareScreenshots(currentScreenshot) {
    return new Promise((resolve, reject) => {
        const img1 = PNG.sync.read(currentScreenshot);
        const img2 = PNG.sync.read(fs.readFileSync('test/test_1.png'));
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        const numDiffPixels = pixelmatch(
            img1.data, img2.data, diff.data, width, height,
            { threshold: 0.1 }
        );

        fs.writeFileSync('test/diff_image.png', PNG.sync.write(diff));

        resolve(numDiffPixels === 0); // true if images are the same
    });
}

(async () => {
    try {
        const screenshot = await takeScreenshot();
        const isMatching = await compareScreenshots(screenshot);
        console.log(`Do the images match? ${isMatching}`);
        process.exit(0);
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
})();