const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined }).catch(async () => chromium.launch());
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); }); // web-font loading may fail offline – the system-font fallback is expected
  const base = 'file://' + require('path').join(__dirname, '..') + '/';
  await pg.goto(base + 'index.html');
  const pages = await pg.evaluate(() => ETO.PAGES.map(p => p.f));
  let total = 0, bad = 0;
  for (const f of pages) {
    await pg.goto(base + f);
    const ids = await pg.$$eval('#tabs .tab', a => a.map(x => x.dataset.id));
    for (const id of ids) {
      total++;
      await pg.goto(base + f + '#' + id);
      await pg.evaluate(() => window.dispatchEvent(new HashChangeEvent('hashchange')));
      const txt = await pg.$eval('#panel', e => e.innerText);
      const html = await pg.$eval('#panel .out', e => e.innerHTML).catch(() => '');
      const hasInputs = await pg.$$eval('#panel .fld', a => a.length);
      if (/NaN|Calculation error|Check input|undefined|Infinity/.test(txt) || (hasInputs && !html.includes('tile') && !html.includes('verdict') && !html.includes('class="ro"'))) { bad++; console.log('BAD', f, id, txt.slice(0, 300).replace(/\n/g, ' | ')); }
    }
  }
  console.log('calcs', total, 'bad', bad); console.log(errs.join('\n') || 'no console errors');
  await b.close();
})();
