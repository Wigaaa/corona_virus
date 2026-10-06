// Tests the built single file (ETO-Handbook.html), including the scrambled release build:
// every page and section renders without errors, the integrity check stays quiet on the genuine file,
// and it blocks a copy where the author's name was replaced.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const file = path.join(__dirname, '..', 'ETO-Handbook.html');
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined }).catch(async () => chromium.launch());
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await pg.goto('file://' + file);
  const pages = await pg.evaluate(() => ETO.PAGES.map(p => p.f).concat(['tips.html']));
  let total = 0, bad = 0;
  for (const f of pages) {
    await pg.goto('file://' + file + '#' + f);
    const ids = await pg.$$eval('#tabs .tab', a => a.map(x => x.dataset.id));
    for (const id of ids) {
      total++;
      await pg.evaluate(h => { location.hash = h; }, f + ':' + id);
      const r = await pg.evaluate(() => ({
        txt: document.getElementById('panel').innerText,
        out: (document.querySelector('#panel .out') || {}).innerHTML || '',
        flds: document.querySelectorAll('#panel .fld').length,
        tamper: !!document.getElementById('eto-tamper'),
        copy: [...document.querySelectorAll('#app .eto-copy')].some(e => e.textContent.includes('Wagdy Mohamed Abdel Aziz'))
      }));
      if (r.tamper || !r.copy || /NaN|Calculation error|undefined|Infinity/.test(r.txt) || (r.flds && !/tile|verdict|class="ro"/.test(r.out))) { bad++; console.log('BAD', f, id, r.tamper ? 'TAMPER' : '', r.copy ? '' : 'NO-COPYRIGHT', r.txt.slice(0, 160).replace(/\n/g, ' | ')); }
    }
  }
  await pg.goto('file://' + file);
  const home = await pg.evaluate(() => ({ tamper: !!document.getElementById('eto-tamper'), copy: document.getElementById('etoCopy').textContent }));
  console.log('bundle sections', total, 'bad', bad, '| home tamper:', home.tamper, '| version line:', home.copy.slice(0, 60));
  // rebranded copy must be blocked
  const fake = path.join(require('os').tmpdir(), 'eto-rebranded.html');
  fs.writeFileSync(fake, fs.readFileSync(file, 'utf8').split('Wagdy Mohamed Abdel Aziz').join('Someone Else'));
  await pg.goto('file://' + fake);
  await pg.waitForTimeout(300);
  console.log('rebranded copy blocked:', await pg.evaluate(() => !!document.getElementById('eto-tamper')));
  fs.unlinkSync(fake);
  console.log(errs.join('\n') || 'no console errors');
  await b.close();
})();
