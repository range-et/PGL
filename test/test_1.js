// Visual regression test: renders test/test_1.html with the built library and compares the
// canvas against test/test_1.png. Exits 1 on mismatch.
// Run `UPDATE_REFERENCE=1 npm test` to accept the current rendering as the new reference.
const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const fs = require('fs');

const port = 3000;
const referencePath = path.join(__dirname, 'test_1.png');
const diffPath = path.join(__dirname, 'diff_image.png');
// Pixels allowed to differ (antialiasing noise between machines). The drawing is small:
// removing all edges changes ~700 pixels and halving their width ~400.
const MAX_DIFF_PIXELS = 200;

const app = express();
app.use('/js', express.static(path.join(__dirname, '..', 'Build')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'test_1.html')));

async function takeScreenshot() {
    const browser = await puppeteer.launch({
        // Software WebGL everywhere so local runs and CI render the same way
        args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', ...(process.env.CI ? ['--no-sandbox'] : [])],
    });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.setViewport({ width: 900, height: 800 });
        await page.goto(`http://localhost:${port}/`);
        await page.waitForFunction(() => window.__rendered === true, { timeout: 15000 });
        if (errors.length) throw new Error('Page errors: ' + errors.join('; '));
        const canvas = await page.$('#displayCanvas');
        return await canvas.screenshot();
    } finally {
        await browser.close();
    }
}

function compareScreenshots(current) {
    const img1 = PNG.sync.read(current);
    const img2 = PNG.sync.read(fs.readFileSync(referencePath));
    if (img1.width !== img2.width || img1.height !== img2.height) {
        console.log(`Size differs: ${img1.width}x${img1.height} vs reference ${img2.width}x${img2.height}`);
        return false;
    }
    const { width, height } = img1;
    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    console.log(`Differing pixels: ${numDiffPixels} (allowed ${MAX_DIFF_PIXELS})`);
    return numDiffPixels <= MAX_DIFF_PIXELS;
}

const server = app.listen(port, async () => {
    let exitCode = 0;
    try {
        const screenshot = await takeScreenshot();
        if (process.env.UPDATE_REFERENCE) {
            fs.writeFileSync(referencePath, screenshot);
            console.log('Reference image updated: ' + referencePath);
        } else {
            const isMatching = compareScreenshots(screenshot);
            console.log(`Do the images match? ${isMatching}` + (isMatching ? '' : ` (see ${diffPath})`));
            if (!isMatching) exitCode = 1;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        exitCode = 1;
    }
    server.close();
    process.exit(exitCode);
});
