const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const puppeteer = require('puppeteer');
const { PNG } = require('pngjs');

const root = path.resolve(__dirname, '../..');
const reportDir = path.join(root, 'reports/examples');
const seed = Number(process.env.EXAMPLES_SEED ?? 42);
assert(Number.isSafeInteger(seed), 'EXAMPLES_SEED must be a safe integer');
// Reports are generated artifacts; remove stale failures from prior runs.
fs.rmSync(reportDir, { recursive: true, force: true });
fs.mkdirSync(reportDir, { recursive: true });
const examples = fs.readdirSync(path.join(root, 'Examples')).filter(f => /^\d+_.*\.html$/.test(f))
  .sort((a, b) => parseInt(a) - parseInt(b));
// Observe the actual example's renderer and callbacks without replacing its graph,
// shaders, simulation, input handling, or network data. Inject only when serving tests.
const observer = `
import * as __pglTest from '../Build/pgl_standalone.js';
window.__example = { frames: 0, events: [], drawer: null };
const __render = __pglTest.GraphDrawer.GraphDrawer3d.prototype.rendercall;
__pglTest.GraphDrawer.GraphDrawer3d.prototype.rendercall = function(...args) {
  const result = __render.apply(this, args);
  window.__example.drawer = this;
  window.__example.frames++;
  return result;
};
const __enable = __pglTest.GraphDrawer.GraphDrawer3d.prototype.enableInteraction;
__pglTest.GraphDrawer.GraphDrawer3d.prototype.enableInteraction = function(options) {
  const wrapped = { ...options };
  for (const name of ['onNodeClick', 'onEdgeClick', 'onNodeHover', 'onEdgeHover', 'onNodeDrag']) {
    if (options[name]) wrapped[name] = (...args) => {
      window.__example.events.push({ name, id: args[0]?.nodeId ?? args[0]?.edgeId ?? args[0] });
      return options[name](...args);
    };
  }
  return __enable.call(this, wrapped);
};
`;
const app = express();
app.get('/Examples/:file', (req, res, next) => {
  if (!examples.includes(req.params.file)) return next();
  const source = fs.readFileSync(path.join(root, 'Examples', req.params.file), 'utf8');
  assert.match(source, /<script type="module">/);
  res.type('html').send(source.replace('<script type="module">', `<script type="module">${observer}`));
});
app.use(express.static(root));

async function candidates(page, kind = 'node') {
  return page.evaluate(kind => {
    const { drawer } = window.__example;
    drawer.controls.autoRotate = false;
    drawer.scene.updateMatrixWorld(true);
    const rect = drawer.canvas.getBoundingClientRect();
    const out = [];
    const project = (p, id) => {
      p.project(drawer.camera);
      if (Math.abs(p.x) < 0.95 && Math.abs(p.y) < 0.95 && p.z > -1 && p.z < 1) {
        out.push({ x: rect.left + (p.x + 1) * rect.width / 2, y: rect.top + (1 - p.y) * rect.height / 2, id });
      }
    };
    drawer.scene.traverse(o => {
      if (kind === 'node' && o.isInstancedMesh && o.userData.nodeIds) {
        for (let i = 0; i < o.count; i++) {
          const matrix = o.matrix.clone().fromArray(o.instanceMatrix.array, i * 16);
          project(o.position.clone().set(0, 0, 0).applyMatrix4(matrix).applyMatrix4(o.matrixWorld), o.userData.nodeIds[i]);
        }
      } else if (kind === 'node' && o.isPoints) {
        const a = o.geometry.getAttribute('position'), ids = o.geometry.getAttribute('label');
        for (let i = 0; i < a.count; i++) project(o.position.clone().set(a.getX(i), a.getY(i), a.getZ(i)).applyMatrix4(o.matrixWorld), ids?.getX(i));
      } else if (kind === 'edge' && o.userData.segmentEdgeIds) {
        // Both thin lines and thick ribbons expose their original graph edge IDs.
        const graph = drawer.graphs.get(0);
        for (const id of new Set(o.userData.segmentEdgeIds)) {
          const points = graph.edges.get(id)?.data.ldata?.points;
          if (!points || points.length < 2) continue;
          const a = points[Math.floor((points.length - 1) / 2)], b = points[Math.ceil((points.length - 1) / 2)];
          project(o.position.clone().set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2), id);
        }
      }
    });
    return out;
  }, kind);
}
async function triggerPick(page, kind, action) {
  const name = `on${kind === 'node' ? 'Node' : 'Edge'}${action === 'click' ? 'Click' : 'Hover'}`;
  for (const point of (await candidates(page, kind)).slice(0, 100)) {
    await page.evaluate(() => { window.__example.events = []; });
    if (action === 'click') await page.mouse.click(point.x, point.y);
    else await page.mouse.move(point.x, point.y);
    const picked = await page.evaluate(name => window.__example.events.some(e => e.name === name && e.id != null), name);
    if (picked) return point;
  }
  throw new Error(`Could not trigger ${name} on visible geometry`);
}
async function exercise(page, number) {
  if ([9, 12, 13].includes(number)) {
    await page.waitForFunction(() => window.__example.frames >= 110, { timeout: 120000 });
  }
  if (number === 11) {
    const shape = await page.evaluate(() => {
      const points = [...window.__example.drawer.graphs.get(0).get_position_map().values()];
      const mx = points.reduce((s, p) => s + p.x, 0) / points.length;
      const mz = points.reduce((s, p) => s + p.z, 0) / points.length;
      let xx = 0, zz = 0, xz = 0;
      for (const p of points) { xx += (p.x - mx) ** 2; zz += (p.z - mz) ** 2; xz += (p.x - mx) * (p.z - mz); }
      return { correlation: xz / Math.sqrt(xx * zz), width: Math.max(...points.map(p => p.x)) - Math.min(...points.map(p => p.x)) };
    });
    assert(Math.abs(shape.correlation) < 0.95, 'Custom layout must retain two independent axes');
    assert(shape.width >= 70, 'Custom layout must have visible scale');
  }
  if (number === 4) {
    await page.click('#toggle');
    assert(await page.evaluate(() => {
      let red = false;
      window.__example.drawer.scene.traverse(o => {
        const c = o.geometry?.getAttribute('customColor');
        if (c) for (let i = 0; i < c.count; i++) if (c.getX(i) === 1 && c.getY(i) === 0 && c.getZ(i) === 0) red = true;
      });
      return red;
    }), 'Activation must recolor nodes');
  }
  if (number === 14 || number === 15) {
    const action = number === 14 ? 'click' : 'hover';
    for (const kind of ['node', 'edge', 'node']) {
      await triggerPick(page, kind, action);
      assert.match(await page.$eval('#infoText', e => e.textContent), new RegExp(`^${kind} `, 'i'));
    }
  }
  if (number === 16) {
    await triggerPick(page, 'node', 'hover');
    assert.match(await page.$eval('#infoText', e => e.textContent), /Neighbours highlighted/);
    assert(await page.evaluate(() => {
      let changed = false;
      window.__example.drawer.scene.traverse(o => {
        const c = o.geometry?.getAttribute('customColor');
        if (c) for (let i = 0; i < c.count; i++) if (c.getY(i) < 1) changed = true;
      });
      return changed;
    }), 'Hover must highlight neighbours');
  }
  if (number === 17) {
    const before = await page.evaluate(() => [...window.__example.drawer.graphs.get(0).get_position_map()].map(([id, p]) => [id, p.x, p.y, p.z]));
    let dragged = false;
    for (const point of (await candidates(page)).slice(0, 50)) {
      await page.mouse.move(point.x, point.y); await page.mouse.down();
      await page.mouse.move(point.x + 30, point.y + 20, { steps: 5 }); await page.mouse.up();
      dragged = await page.evaluate(() => window.__example.events.some(e => e.name === 'onNodeDrag'));
      if (dragged) break;
    }
    assert(dragged, 'Pointer drag must invoke the example callback');
    const after = await page.evaluate(() => [...window.__example.drawer.graphs.get(0).get_position_map()].map(([id, p]) => [id, p.x, p.y, p.z]));
    assert.notDeepEqual(after, before, 'Dragging must change graph coordinates');
    assert(await page.evaluate(() => window.__example.drawer.controls.enabled), 'Dragging must release camera controls');
  }
  if (number === 18) {
    await page.click('#pauseBtn');
    assert.match(await page.$eval('#pauseBtn', e => e.textContent), /Resume/);
    const paused = await page.$eval('#statusBar', e => e.textContent);
    await page.select('#speedSelect', '150');
    await new Promise(resolve => setTimeout(resolve, 600));
    assert.equal(await page.$eval('#statusBar', e => e.textContent), paused, 'Pause must stop graph growth');
    await page.click('#pauseBtn');
    await page.waitForFunction(before => document.querySelector('#statusBar').textContent !== before, { timeout: 10000 }, paused);
    assert(await page.evaluate(() => {
      let green = false;
      window.__example.drawer.scene.traverse(o => {
        const c = o.instanceColor;
        if (c) for (let i = 0; i < c.count; i++) if (c.getY(i) > c.getX(i) && c.getY(i) > c.getZ(i)) green = true;
      });
      return green;
    }), 'Newly added instanced node must flash green');
    assert(await page.evaluate(() => window.__example.drawer.controls.minDistance < 4), 'Close camera must not be clamped to the default distance');
    await page.waitForFunction(() => document.querySelector('#statusBar').textContent.startsWith('Complete'), { timeout: 120000 });
    assert.equal(await page.evaluate(() => window.__example.drawer.graphs.get(0).nodes.size), 144, 'Growth must reach all torus vertices');
    assert.equal((await candidates(page)).length, 144, 'Completed graph must fit inside the camera view');
  }
}

(async () => {
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const results = [];
  try {
    browser = await puppeteer.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', ...(process.env.CI ? ['--no-sandbox'] : [])] });
    for (const file of ['examples.html', ...examples]) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      page.on('requestfailed', request => errors.push(`${request.failure()?.errorText} ${request.url()}`));
      try {
        await page.setViewport({ width: 1100, height: 1000 });
        await page.evaluateOnNewDocument(seed => {
          let state = seed >>> 0;
          Math.random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
        }, seed + (parseInt(file) || 0));
        await page.goto(`${base}/Examples/${file}`, { waitUntil: 'networkidle0', timeout: 90000 });
        if (file === 'examples.html') {
          const links = await page.$$eval('a[href]', links => links.map(a => a.getAttribute('href')));
          for (const example of examples) assert(links.some(link => link.endsWith(example)), `Index missing ${example}`);
        } else {
          await page.waitForFunction(() => window.__example?.frames >= 3, { timeout: 90000 });
          await exercise(page, parseInt(file));
          const metrics = await page.evaluate(() => {
            const { drawer, frames } = window.__example;
            let nonFinite = 0;
            drawer.scene.traverse(o => {
              for (const name of ['position', 'customColor', 'size']) {
                const attr = o.geometry?.getAttribute(name);
                if (attr) for (const v of attr.array) if (!Number.isFinite(v)) nonFinite++;
              }
              if (o.isInstancedMesh) for (const v of o.instanceMatrix.array) if (!Number.isFinite(v)) nonFinite++;
            });
            return { frames, calls: drawer.renderer.info.render.calls, nonFinite };
          });
          assert(metrics.calls > 0, 'Renderer must issue draw calls');
          assert.equal(metrics.nonFinite, 0, 'Geometry must contain only finite values');
          const canvas = await page.$('#displayCanvas');
          const bytes = await canvas.screenshot({ path: path.join(reportDir, file.replace('.html', '.png')) });
          const png = PNG.sync.read(Buffer.from(bytes));
          const colors = new Set();
          for (let i = 0; i < png.data.length; i += 4) colors.add(png.data.readUInt32BE(i));
          assert(colors.size > 8, `Canvas appears blank (${colors.size} colors)`);
        }
        assert.deepEqual(errors, [], 'Browser must not report runtime, shader, or resource errors');
        results.push({ file, status: 'passed' });
        console.log(`PASS ${file}`);
      } catch (error) {
        results.push({ file, status: 'failed', message: error.message, errors });
        console.error(`FAIL ${file}: ${error.message}`);
        await page.screenshot({ path: path.join(reportDir, `${file}.failure.png`) }).catch(() => {});
      } finally { await page.close(); }
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
    fs.writeFileSync(path.join(reportDir, 'results.json'), JSON.stringify(results, null, 2));
  }
  const failed = results.filter(r => r.status === 'failed');
  console.log(`${results.length - failed.length}/${results.length} example pages passed`);
  if (failed.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
