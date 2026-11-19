const fs = require('fs'), path = require('path');
const root = require('path').join(__dirname, '..', 'assets') + '/';
global.window = global; window.ETO_BUNDLE = true;
(0, eval)(fs.readFileSync(root + 'common.js', 'utf8'));
const cfgs = [];
ETO.page = c => cfgs.push(c);
for (const f of fs.readdirSync(root + 'pages')) (0, eval)(fs.readFileSync(root + 'pages/' + f, 'utf8'));
const typeOf = i => i.t || (i.opts ? 'sel' : 'num');
const conv = x => x;
let seed = 12345; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const bad = new Map(); let runs = 0;
function mk(c, mode) {
  const v = {};
  c.inputs.forEach(i => {
    const t = typeOf(i);
    if (t === 'table') { v[i.k] = JSON.parse(JSON.stringify(i.v)); return; }
    if (t === 'text' || t === 'area' || t === 'date') { v[i.k] = i.v || '2026-10-05'; return; }
    if (t === 'sel') { const o = mode === 'def' ? i.v : i.opts[Math.floor(rnd() * i.opts.length)][0]; v[i.k] = mode === 'def' ? i.v : conv(o); return; }
    let x = i.v;
    if (mode === 'min') x = i.min != null ? i.min : x;
    if (mode === 'max') x = i.max != null ? i.max : x * 10;
    if (mode === 'rnd') { const lo = i.min != null ? Math.max(i.min, 1e-6) : (i.v < 0 ? i.v * 2 : 0); const hi = i.max != null ? i.max : Math.max(Math.abs(i.v) * 5, 1); x = lo + rnd() * (hi - lo); }
    v[i.k] = x;
  });
  return v;
}
function scan(r) { // find non-finite numerics
  const out = [];
  (r.results || []).forEach(x => { if (typeof x.v === 'number' && !isFinite(x.v)) out.push('result:' + x.l); });
  (r.tables || []).forEach(t => t.rows.forEach(row => row.forEach(x => { if (typeof x === 'number' && !isFinite(x)) out.push('table:' + t.title); })));
  const txt = JSON.stringify(r); if (/NaN|undefined|Infinity/.test(txt)) out.push('text');
  return out;
}
cfgs.forEach(cfg => cfg.calcs.forEach(c => {
  ['def', 'min', 'max', 'rnd', 'rnd', 'rnd', 'rnd', 'rnd', 'rnd'].forEach(mode => {
    for (let k = 0; k < (mode === 'rnd' ? 20 : 1); k++) {
      const v = mk(c, mode); runs++;
      try { const r = c.run(v); const s = scan(r); if (s.length) { const key = cfg.file + '#' + c.id + ' ' + s[0]; if (!bad.has(key)) bad.set(key, [mode, JSON.stringify(v).slice(0, 160)]); } }
      catch (e) { const key = cfg.file + '#' + c.id + ' THROW ' + e.message; if (!bad.has(key)) bad.set(key, [mode, JSON.stringify(v).slice(0, 160)]); }
    }
  });
}));
console.log('runs', runs, 'calcs', cfgs.reduce((a, c) => a + c.calcs.length, 0), 'issues', bad.size);
for (const [k, v] of bad) console.log(k, '|', v[0], v[1]);
