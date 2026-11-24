/**
 * Plexopus scrollytelling — automated visual/behavioral smoke gate.
 *
 * Run at repo root:
 *   npm install --no-save --no-package-lock playwright@1.56.1
 *   npx playwright install chromium
 *   node concept/qa/smoke.mjs
 *
 * This is a development-only dependency: the marketing site remains
 * plain HTML/CSS/JavaScript. Chromium mobile emulation is NOT Safari QA.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, resolve, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const output = join(root, 'concept', 'qa', 'screenshots');
const mime = new Map([
  ['.html','text/html; charset=utf-8'], ['.css','text/css; charset=utf-8'],
  ['.js','text/javascript; charset=utf-8'], ['.svg','image/svg+xml'],
  ['.png','image/png'], ['.ico','image/x-icon']
]);

const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const filePath = resolve(root, '.' + pathname);
    if (filePath !== root && !filePath.startsWith(root + sep)) {
      response.writeHead(403).end(); return;
    }
    const body = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': mime.get(extname(filePath)) ?? 'application/octet-stream' });
    response.end(body);
  } catch (error) {
    response.writeHead(404).end('Not found');
  }
});
await mkdir(output, { recursive: true });
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const port = server.address().port;
const baseUrl = 'http://127.0.0.1:' + port + '/concept/';

const viewports = [
  { name:'iphone-portrait', width:390, height:844, mobile:true },
  { name:'iphone-small', width:375, height:667, mobile:true },
  { name:'iphone-short', width:390, height:590, mobile:true },
  { name:'iphone-landscape', width:844, height:390, mobile:true },
  { name:'tablet', width:768, height:1024, mobile:true },
  { name:'desktop', width:1366, height:768, mobile:false }
];
const closeTo = (a,b,tolerance=6) => Math.abs(a-b) <= tolerance;

async function scrollToProgress(page, id, p) {
  await page.evaluate(({ id, p }) => {
    const track = document.getElementById(id);
    if (!track) throw new Error('Unknown track ' + id);
    const bounds = track.getBoundingClientRect();
    const scrollDistance = Math.max(0, bounds.height - window.innerHeight);
    const top = window.scrollY + bounds.top + p * scrollDistance;
    window.scrollTo({ top, behavior: 'instant' });
  }, { id, p });
  await page.evaluate(() => new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  ));
}
async function geometry(page, selector) {
  return page.locator(selector).evaluate((element) => {
    const r = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return { top:r.top,left:r.left,right:r.right,bottom:r.bottom,width:r.width,
      height:r.height,opacity:Number(style.opacity),display:style.display,visibility:style.visibility };
  });
}
function intersects(a,b) {
  return Math.min(a.right,b.right)-Math.max(a.left,b.left)>3 &&
    Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>3;
}

let failures=0;
let browser;
try {
  browser = await chromium.launch({ channel:'chrome', headless:true, args:['--no-sandbox'] });
  for (const viewport of viewports) {
    const {name,width,height,mobile} = viewport;
    const context = await browser.newContext({
      viewport:{width,height}, isMobile:mobile, hasTouch:mobile,
      deviceScaleFactor:mobile?2:1
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    try {
      const response=await page.goto(baseUrl,{waitUntil:'networkidle'});
      assert.equal(response.status(),200,'page must load');
      await page.evaluate(()=> { document.documentElement.style.scrollBehavior='auto'; });
      for(const id of ['top','dive','capabilities-bridge','studio-story','conversation','ecosystem','next']){
        assert.equal(await page.locator('#'+id).count(),1,'missing scene: '+id);
      }
      for(const href of ['./story.css','./story-scenes.css','./story-mobile.css']){
        assert.equal(await page.locator('link[href="'+href+'"]').count(),1,'missing stylesheet: '+href);
      }
      // The sea starts exactly where the cover waves end: no mismatched flat color band.
      const surface = await page.evaluate(() => {
        const paths=[...document.querySelectorAll('.sea-horizon svg path')];
        return {
          light:paths[0]?.getAttribute('fill'), deep:paths[1]?.getAttribute('fill'),
          label:document.querySelector('#dive .seabed-network text')?.textContent,
          junction:[...document.querySelectorAll('#dive .seabed-network text')]
            .find(x=>x.textContent==='JUNCTION')?.getAttribute('x')
        };
      });
      assert.equal(surface.light,'#fbfcf8',name+' bright wave must match hero');
      assert.equal(surface.deep,'#0c7180',name+' lower wave must match initial water');
      assert.ok(Number(surface.junction)>=845,name+' JUNCTION label still crosses the pipe');

      // Pinning regression: the earlier "capabilities gap" was caused by overflow:hidden
      // on an ancestor of the sticky scene.
      for(const p of [.15,.49,.86]){
        await scrollToProgress(page,'capabilities-bridge',p);
        const stage=await geometry(page,'#bridge-stage');
        assert.ok(closeTo(stage.top,0,7),name+' bridge not pinned at '+p+': '+stage.top);
      }
      for(const [p,step] of [[.12,'0'],[.51,'1'],[.88,'2']]){
        await scrollToProgress(page,'capabilities-bridge',p);
        const actual=await page.locator('#bridge-stage').getAttribute('data-bridge-index');
        assert.equal(actual,step,'capabilities scenario '+p);
      }
      // The same SVG must morph through the closure, not swap two screenshots.
      await scrollToProgress(page,'capabilities-bridge',.40);
      const before=Number(await page.locator('#bridge-stage')
        .evaluate(el=>getComputedStyle(el).getPropertyValue('--closure-affected')));
      await scrollToProgress(page,'capabilities-bridge',.62);
      const after=Number(await page.locator('#bridge-stage')
        .evaluate(el=>getComputedStyle(el).getPropertyValue('--closure-affected')));
      assert.ok(before<.08 && after>.75,name+' scenario before/after missing: '+before+'/'+after);
      await page.screenshot({path:join(output,name+'-closure.png'),animations:'disabled'});

      // Both product surfaces are immediately visible on scene entry.
      await scrollToProgress(page,'studio-story',0);
      const studio=await geometry(page,'#story-studio');
      assert.ok(studio.opacity>=.98 && studio.width>=100 && studio.height>=100,name+' Studio starts hidden');
      await page.screenshot({path:join(output,name+'-studio.png'),animations:'disabled'});
      // Guided Build illustrates exactly the requested link S1 -> J4, not two other nodes.
      await scrollToProgress(page,'studio-story',.51);
      assert.equal(await page.locator('#studio-stage').getAttribute('data-studio-mode'),'build');
      assert.equal(await page.locator('.studio-draft-connection').getAttribute('d'),'M169 135L404 98');
      assert.equal(await page.locator('#studio-fact-a').innerText(),'S1 → J4');
      assert.equal((await page.locator('.studio-build-link-label').textContent()).trim(),'S1 → J4');
      const picks=await page.locator('.studio-build-picks circle').evaluateAll(xs=>
        xs.map(el=>[el.getAttribute('cx'),el.getAttribute('cy')]));
      assert.deepEqual(picks,[['169','135'],['404','98']]);
      await page.screenshot({path:join(output,name+'-studio-build.png'),animations:'disabled'});
      await scrollToProgress(page,'conversation',0);
      const phone=await geometry(page,'#story-phone');
      assert.ok(phone.opacity>=.98 && phone.width>=85 && phone.height>=150,name+' phone starts hidden');
      const copy=await geometry(page,'.conversation-copy');
      assert.ok(!intersects(phone,copy),name+' phone overlaps copy: '+JSON.stringify({phone,copy}));
      assert.equal(await page.locator('.assistant-avatar img[src="../assets/plexopus-symbol-128.png"]').count(),1);
      await page.screenshot({path:join(output,name+'-phone.png'),animations:'disabled'});

      // Scroll through text/tool/result without loss of layout and ensure reversible steps.
      for(const [p,step] of [[.12,'0'],[.43,'2'],[.70,'3'],[.96,'4'],[.20,'1']]){
        await scrollToProgress(page,'conversation',p);
        assert.equal(await page.locator('#conversation-stage').getAttribute('data-moment'),step);
        const actualPhone=await geometry(page,'#story-phone');
        const actualCopy=await geometry(page,'.conversation-copy');
        assert.ok(!intersects(actualPhone,actualCopy),name+' phone/copy overlap during '+p);
      }
      await scrollToProgress(page,'ecosystem',.85);
      assert.equal(await page.locator('#ecosystem-stage').getAttribute('data-ecosystem-step'),'2');
      // Main narrative descriptions must remain readable on phone/tablet.
      if (width<=820) {
        const type=await page.evaluate(()=>{
          const selectors=[
            '.bridge-copy>p:last-child','.bridge-value.is-active p',
            '.studio-story-lead','.studio-step-copy>p:last-child',
            '.conversation-copy p','.ecosystem-lead','.ecosystem-story>p:last-child'];
          return Object.fromEntries(selectors.map(sel=>{
            const el=document.querySelector(sel);
            return [sel,el?parseFloat(getComputedStyle(el).fontSize):0];
          }));
        });
        for(const [selector,size] of Object.entries(type)){
          assert.ok(size>=12.95,name+' illegible mobile description '+selector+': '+size+'px');
        }
      }

      await page.screenshot({path:join(output,name+'-ecosystem.png'),animations:'disabled'});

      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      assert.ok(overflow<=3,name+' horizontal overflow '+overflow+'px');
      assert.deepEqual(errors,[],'no JS runtime errors');
      console.log('PASS '+name+' '+width+'x'+height+' (sticky, transitions, layout, sources, screenshots)');
    }catch(error){
      failures++;
      console.error('FAIL '+name+' '+width+'x'+height+': '+error.stack);
      await page.screenshot({path:join(output,name+'-FAILED.png'),animations:'disabled'}).catch(()=>{});
    }finally{await context.close();}
  }

  // Reduced motion must expose meaningful content without pinned scroll.
  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const page=await reduced.newPage();
  try{
    await page.goto(baseUrl,{waitUntil:'networkidle'});
    const pin=await page.locator('#bridge-stage').evaluate(el=>getComputedStyle(el).position);
    assert.notEqual(pin,'sticky');
    assert.equal(await page.locator('.bridge-flow [data-bridge-scene]').count(),3);
    for(const n of [0,1,2]){
      const shown=await page.locator('[data-bridge-scene="'+n+'"]').evaluate(el=>
        getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none');
      assert.ok(shown,'reduced-motion diagram '+n+' hidden');
    }
    const phone=await geometry(page,'#story-phone');
    assert.ok(phone.opacity>0.95);
    console.log('PASS reduced-motion: static diagrams and accessible phone');
  }catch(err){failures++;console.error('FAIL reduced-motion: '+err.stack)}
  await reduced.close();
}finally {
  await browser?.close();
  await new Promise((done)=>server.close(done));
}
if(failures){
  console.error(failures+' viewport test(s) failed. Inspect concept/qa/screenshots/.');
  process.exitCode=1;
}else{
  console.log('PASS all Chromium smoke checks. Safari/iOS requires manual device review.');
}
