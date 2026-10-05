/* ETO Toolkit – shared calculator engine */
(function () {
  'use strict';

  const PAGES = [
    { f: 'power.html', n: 'Electrical Power', i: '⚡', c: '#2563eb', lvl: 1, d: '3-ph / 1-ph current, kW, kVA, kVAR, kW↔HP, DG / transformer / UPS loading, load & voltage balance' },
    { f: 'powerfactor.html', n: 'Power Factor', i: '📐', c: '#db2777', lvl: 1, d: 'Power triangle, PF correction capacitors, two-wattmeter method, combined PF' },
    { f: 'cable.html', n: 'Cables', i: '🔌', c: '#0891b2', lvl: 1, d: 'Ampacity, derating, voltage drop, sizing, starting drop, short-circuit withstand, earth conductor' },
    { f: 'motor.html', n: 'Motors', i: '⚙️', c: '#16a34a', lvl: 1, d: 'FLC, starting current/kVA, slip, torque, overload settings, thermal capacity, starter comparison' },
    { f: 'generator.html', n: 'Generators', i: '🛢️', c: '#ea580c', lvl: 1, d: 'DG loading, load sharing, reverse power, droop, AVR, motor starting, short-circuit, synchronizing' },
    { f: 'transformer.html', n: 'Transformers', i: '🧲', c: '#7c3aed', lvl: 1, d: 'Currents, loading, taps, regulation, temperature rise, losses, efficiency, impedance, Isc' },
    { f: 'battery.html', n: 'Battery & UPS', i: '🔋', c: '#ca8a04', lvl: 1, d: 'Battery sizing, Peukert autonomy, charger, UPS runtime & loading, DC voltage drop' },
    { f: 'protection.html', n: 'Short-circuit & Protection', i: '🛡️', c: '#dc2626', lvl: 2, d: 'Prospective Isc, breaker capacity, trip settings, earth-fault, selectivity, fuses, motor protection' },
    { f: 'insulation.html', n: 'Earthing & Insulation', i: '🧪', c: '#475569', lvl: 2, d: 'IR / PI / DAR, temperature correction, IT-system earth fault, bonding, megger guide' },
    { f: 'vfd.html', n: 'VFD / Drives', i: '🎛️', c: '#4f46e5', lvl: 2, d: 'Drive sizing, V/f, accel time, DC link, braking resistor, regeneration, input harmonics, affinity laws' },
    { f: 'harmonics.html', n: 'Harmonics / THD', i: '〰️', c: '#0d9488', lvl: 2, d: 'THD-I/V, K-factor, resonance, detuned filters, transformer derating, VFD effect on generators' },
    { f: 'lighting.html', n: 'Lighting', i: '💡', c: '#65a30d', lvl: 2, d: 'Fixture count, lux, spacing, lighting load, emergency lighting battery, voltage drop' },
    { f: 'jacking.html', n: 'Jacking System', i: '🏗️', c: '#0284c7', lvl: 3, d: 'Jacking load, motor distribution, brakes, brake resistors, cooling, VFD & DG loading, backup power' },
    { f: 'crane.html', n: 'Cranes', i: '🏋️', c: '#a16207', lvl: 3, d: 'Hoist power, hydraulic power, starting, VFD loading, regeneration, generator impact' },
    { f: 'thruster.html', n: 'Thrusters', i: '🌀', c: '#1e40af', lvl: 3, d: 'Thruster at X %, VFD & transformer loading, acceleration, thrust, harmonics, cooling' },
    { f: 'plant.html', n: 'Power Plant & Load Balance', i: '🏭', c: '#be123c', lvl: 3, d: 'Vessel load balance, PMS thresholds, critical loads, blackout recovery, emergency generator' }
  ];

  const S3 = Math.sqrt(3);
  const STD_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630];
  const STD_BREAKERS = [16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000];
  const STD_FUSES = [2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const el = (tag, attrs, html) => {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  };
  const fmt = (v, d) => {
    if (typeof v === 'string') return v;
    if (v == null || !isFinite(v)) return '—';
    d = d == null ? 2 : d;
    const n = Number(v.toFixed(d));
    return (n === 0 ? 0 : n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  const R = (l, v, u, d, s, big) => ({ l, v, u, d, s, big });
  const lvl = (v, okMax, warnMax) => (v <= okMax ? 'ok' : v <= warnMax ? 'warn' : 'bad');
  const std = (list, v) => list.find(x => x >= v - 1e-9) || list[list.length - 1];
  const rho = (mat, T) => (mat === 'Al' ? 0.02826 * (1 + 0.00403 * (T - 20)) : 0.01724 * (1 + 0.00393 * (T - 20))); // ohm·mm²/m
  // IEC 60228 class-2 maximum DC resistance at 20 °C (ohm/km) – real stranded conductors, not theoretical rho
  const R20 = {
    Cu: [[1.5, 13.3], [2.5, 7.98], [4, 4.95], [6, 3.30], [10, 1.91], [16, 1.21], [25, 0.780], [35, 0.554], [50, 0.386], [70, 0.272], [95, 0.206], [120, 0.161], [150, 0.129], [185, 0.106], [240, 0.0801], [300, 0.0641], [400, 0.0486], [500, 0.0384], [630, 0.0287]],
    Al: [[16, 1.91], [25, 1.20], [35, 0.868], [50, 0.641], [70, 0.443], [95, 0.320], [120, 0.253], [150, 0.206], [185, 0.164], [240, 0.125], [300, 0.100], [400, 0.0778], [500, 0.0605], [630, 0.0469]]
  };
  // conductor resistance in ohm/m at temperature T (interpolates the effective resistivity between standard sizes)
  const res = (mat, size, T) => {
    const pts = R20[mat === 'Al' ? 'Al' : 'Cu'].map(p => [p[0], p[1] * p[0] / 1000]); // ohm·mm²/m
    const r20 = interp(pts, size) / size, a = mat === 'Al' ? 0.00403 : 0.00393;
    return r20 * (1 + a * (T - 20));
  };
  function interp(pts, x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
    return pts[pts.length - 1][1];
  }
  // voltage drop (V) for a cable: k = sqrt3 (3-ph) or 2 (1-ph); R,X in ohm/m
  const vdrop = (sys, I, L, size, mat, T, Xmohm, pf, par) => {
    if (sys === 'dc') { pf = 1; Xmohm = 0; }
    const k = String(sys) === '3' ? S3 : 2;
    const r = res(mat, size, T); // ohm/m
    const x = Xmohm / 1000;       // ohm/m
    const phi = Math.acos(Math.min(1, pf));
    return { v: k * I * L * (r * pf + x * Math.sin(phi)) / (par || 1), r: r * 1000, x: Xmohm, k };
  };

  const BUNDLE = !!window.ETO_BUNDLE, REG = {};
  const href = f => (BUNDLE ? '#' + f : f);

  function skeleton(cfg) {
    const me = PAGES.find(p => p.f === cfg.file) || {};
    const k = PAGES.indexOf(me);
    const prev = PAGES[k - 1], next = PAGES[k + 1];
    const opts = PAGES.map(p => `<option value="${p.f}" ${p.f === cfg.file ? 'selected' : ''}>${p.i}  ${esc(p.n)}</option>`).join('');
    return `
<header class="top"><a class="home" href="${href('index.html')}">◀ ETO Toolkit</a>
  <select class="jump" aria-label="Jump to page">${opts}</select>
  <button class="btn" id="theme" title="Toggle dark mode">🌓</button>
  <button class="btn" id="print">🖨 Print</button></header>
<section class="hero"><div class="ico">${cfg.icon}</div><div><h1>${esc(cfg.title)}</h1><p>${esc(cfg.subtitle)}</p>
  <div class="chips">${(cfg.refs || []).map(r => `<span class="chip">${esc(r)}</span>`).join('')}</div></div></section>
<div class="layout"><nav class="tabs" id="tabs"></nav><main class="panel" id="panel"></main></div>
<footer><div class="nav">${prev ? `<a href="${href(prev.f)}">◀ ${esc(prev.n)}</a>` : ''}</div>
  <div class="nav">${next ? `<a href="${href(next.f)}">${esc(next.n)} ▶</a>` : ''}</div>
  <div class="nav"><a href="${href('about.html')}">ℹ️ About / Credits</a></div>
  <div class="disc">⚠ Calculation aid only. Always verify against the vessel's electrical drawings, equipment nameplates, manufacturer data and class / flag rules before acting on any result.</div></footer>`;
  }

  function page(cfg) {
    if (BUNDLE) { cfg.file = window.ETO_FILE; REG[cfg.file] = cfg; return; }
    cfg.file = location.pathname.split('/').pop() || 'index.html';
    const api = mount(cfg);
    const route = () => api.go(location.hash.slice(1));
    window.addEventListener('hashchange', route);
    route();
  }

  function mount(cfg) {
    document.title = cfg.title + ' • ETO Toolkit';
    document.documentElement.style.setProperty('--accent', cfg.accent);
    const app = document.getElementById('app');
    app.innerHTML = skeleton(cfg);
    const tabs = document.getElementById('tabs'), panel = document.getElementById('panel');
    app.querySelector('.jump').onchange = e => (location.href = href(e.target.value));
    document.getElementById('print').onclick = () => window.print();
    document.getElementById('theme').onclick = () => {
      const r = document.documentElement;
      const dark = getComputedStyle(r).getPropertyValue('--bg').trim() === '#0b1220';
      r.setAttribute('data-theme', dark ? 'light' : 'dark');
      try { localStorage.setItem('eto:theme', dark ? 'light' : 'dark'); } catch (e) { /* ignore */ }
    };
    cfg.calcs.forEach(c => {
      const a = el('a', { class: 'tab', href: '#' + (BUNDLE ? cfg.file + ':' : '') + c.id, 'data-id': c.id }, `<span class="ti">${c.icon || '•'}</span><span>${esc(c.title)}</span>`);
      tabs.appendChild(a);
    });

    const key = c => 'eto:' + cfg.file + ':' + c.id;
    const typeOf = i => i.t || (i.opts ? 'sel' : 'num');
    const defaults = c => {
      const v = {};
      c.inputs.forEach(i => { v[i.k] = typeOf(i) === 'table' ? JSON.parse(JSON.stringify(i.v)) : i.v; });
      return v;
    };
    const load = c => {
      const v = defaults(c);
      try {
        const s = JSON.parse(localStorage.getItem(key(c)) || 'null');
        if (s) c.inputs.forEach(i => { if (s[i.k] !== undefined && typeof s[i.k] === typeof v[i.k]) v[i.k] = s[i.k]; });
      } catch (e) { /* ignore */ }
      return v;
    };
    const save = (c, v) => { try { localStorage.setItem(key(c), JSON.stringify(v)); } catch (e) { /* ignore */ } };

    let cur = null;

    function show(c) {
      cur = c;
      tabs.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.id === c.id));
      const vals = load(c);
      panel.innerHTML = '';
      const card = el('div', { class: 'card' });
      card.innerHTML = `<h2><span class="ti">${c.icon || ''}</span>${esc(c.title)}</h2><p class="desc">${c.desc || ''}</p>` +
        (c.formula ? `<div class="formula">${esc(c.formula)}</div>` : '');
      const grid = el('div', { class: 'grid' });
      const flds = [];
      c.inputs.forEach(i => {
        const t = typeOf(i);
        let f;
        if (t === 'table') { f = tableInput(i, vals, recompute, c); }
        else {
          f = el('label', { class: 'fld' });
          let h = `<span>${esc(i.l)}</span>`;
          if (t === 'sel') {
            h += `<select>${i.opts.map(o => `<option value="${esc(o[0])}">${esc(o[1])}</option>`).join('')}</select>`;
          } else {
            h += `<div class="inp"><input type="number" step="${i.step || 'any'}" inputmode="decimal">${i.u ? `<em>${esc(i.u)}</em>` : ''}</div>`;
          }
          if (i.hint) h += `<small>${esc(i.hint)}</small>`;
          f.innerHTML = h;
          const inp = f.querySelector('input,select');
          inp.value = vals[i.k];
          inp.addEventListener('input', () => {
            if (t === 'sel') { const o = i.opts.find(o => String(o[0]) === inp.value); vals[i.k] = o ? o[0] : inp.value; }
            else vals[i.k] = inp.value === '' ? NaN : parseFloat(inp.value);
            recompute();
          });
        }
        f._def = i;
        flds.push(f);
        grid.appendChild(f);
      });
      card.appendChild(grid);
      if (c.inputs.length) {
        const act = el('div', { class: 'actions' });
        const rb = el('button', { class: 'btn', type: 'button' }, '↺ Reset to defaults');
        rb.onclick = () => { try { localStorage.removeItem(key(c)); } catch (e) { /* ignore */ } show(c); };
        const cb = el('button', { class: 'btn', type: 'button' }, '📋 Copy results');
        cb.onclick = () => copyText(c, vals, cb);
        act.append(rb, cb);
        card.appendChild(act);
      }
      const out = el('div', { class: 'out' });
      card.appendChild(out);
      if (c.html) card.appendChild(el('div', { class: 'ref' }, c.html));
      panel.appendChild(card);

      function recompute() {
        save(c, vals);
        const vis = i => !i.show || i.show(vals);
        flds.forEach(f => { f.style.display = vis(f._def) ? '' : 'none'; });
        const bad = [];
        flds.forEach(f => {
          const i = f._def, t = typeOf(i);
          let e = false;
          if (t === 'num' && vis(i)) {
            const x = vals[i.k];
            if (!isFinite(x) || (i.min != null && x < i.min) || (i.max != null && x > i.max)) { e = true; bad.push(i.l + (i.min != null ? ` (≥ ${i.min})` : '')); }
          }
          f.classList.toggle('err', e);
        });
        if (bad.length) { out.innerHTML = `<div class="empty">Check input: ${bad.map(esc).join('; ')}</div>`; cur.last = null; return; }
        const v = {};
        c.inputs.forEach(i => {
          if (typeOf(i) === 'table') v[i.k] = vals[i.k].map(r => { const o = {}; for (const k in r) o[k] = typeof r[k] === 'number' && !isFinite(r[k]) ? 0 : r[k]; return o; });
          else v[i.k] = vals[i.k];
        });
        let r;
        try { r = c.run(v); } catch (e) { out.innerHTML = `<div class="empty">Calculation error: ${esc(e.message)}</div>`; console.error(e); return; }
        renderOut(out, r, c);
        c.last = r;
      }
      recompute();
    }

    function renderOut(out, r, c) {
      let h = '<h3>Results</h3>';
      if (r.results && r.results.length) {
        h += '<div class="tiles">' + r.results.map(x =>
          `<div class="tile ${x.s ? 's-' + x.s : ''} ${x.big ? 'big' : ''}"><div class="l">${esc(x.l)}</div><div class="v">${esc(fmt(x.v, x.d))}${x.u ? `<small>${esc(x.u)}</small>` : ''}</div></div>`).join('') + '</div>';
      }
      if (r.verdict) h += `<div class="verdict ${r.verdict.s}">${{ ok: '✅', warn: '⚠️', bad: '⛔', info: 'ℹ️' }[r.verdict.s] || ''} ${r.verdict.t}</div>`;
      (r.tables || []).forEach(t => {
        h += `<table class="rt">${t.title ? `<caption>${esc(t.title)}</caption>` : ''}<thead><tr>${t.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>` +
          t.rows.map((row, ri) => `<tr class="${t.states && t.states[ri] ? 's-' + t.states[ri] : ''}">${row.map(x => `<td>${typeof x === 'number' ? fmt(x, 2) : x}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
      });
      const notes = (r.notes || []).concat(c.notes || []);
      if (notes.length) h += '<ul class="notes">' + notes.map(n => `<li>${n}</li>`).join('') + '</ul>';
      out.innerHTML = h;
    }

    function copyText(c, vals, btn) {
      let s = `${cfg.title} – ${c.title}\n` + new Date().toISOString().slice(0, 10) + '\n\nINPUTS\n';
      c.inputs.forEach(i => {
        if (typeOf(i) === 'table') return;
        let val = vals[i.k];
        if (typeOf(i) === 'sel') { const o = i.opts.find(o => String(o[0]) === String(val)); val = o ? o[1] : val; }
        s += `${i.l}: ${val}${i.u ? ' ' + i.u : ''}\n`;
      });
      const r = c.last;
      if (r) {
        s += '\nRESULTS\n';
        (r.results || []).forEach(x => { s += `${x.l}: ${fmt(x.v, x.d)}${x.u ? ' ' + x.u : ''}\n`; });
        if (r.verdict) s += '\n' + r.verdict.t.replace(/<[^>]+>/g, '') + '\n';
        (r.tables || []).forEach(t => {
          s += `\n${t.title || ''}\n${t.head.map(x => x.replace(/<[^>]+>/g, '')).join(' | ')}\n`;
          t.rows.forEach(row => { s += row.map(x => typeof x === 'number' ? fmt(x, 2) : String(x).replace(/<[^>]+>/g, '')).join(' | ') + '\n'; });
        });
      }
      const done = () => { btn.textContent = '✔ Copied'; setTimeout(() => (btn.textContent = '📋 Copy results'), 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(s).then(done, () => window.prompt('Copy:', s));
      else window.prompt('Copy:', s);
    }

    function tableInput(i, vals, recompute) {
      const wrap = el('div', { class: 'tbl-wrap' });
      wrap.innerHTML = `<span style="font-size:13px;font-weight:600;color:var(--mut)">${esc(i.l)}</span>`;
      const holder = el('div');
      wrap.appendChild(holder);
      function draw() {
        const rows = vals[i.k];
        let h = '<table class="tbl"><thead><tr>' + i.cols.map(c => `<th>${esc(c.l)}</th>`).join('') + '<th></th></tr></thead><tbody>';
        rows.forEach((r, ri) => {
          h += '<tr>' + i.cols.map(c => {
            const val = r[c.k];
            if (c.t === 'sel') return `<td><select data-r="${ri}" data-k="${c.k}">${c.opts.map(o => `<option value="${esc(o[0])}" ${String(o[0]) === String(val) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select></td>`;
            if (c.t === 'text') return `<td><input data-r="${ri}" data-k="${c.k}" type="text" value="${esc(val)}" style="min-width:${c.w || 120}px"></td>`;
            return `<td><input data-r="${ri}" data-k="${c.k}" type="number" step="any" inputmode="decimal" value="${isFinite(val) ? val : ''}" style="min-width:${c.w || 70}px"></td>`;
          }).join('') + `<td><button class="del" data-del="${ri}" title="Remove row">×</button></td></tr>`;
        });
        holder.innerHTML = h + '</tbody></table>';
        holder.querySelectorAll('input,select').forEach(inp => inp.addEventListener('input', () => {
          const col = i.cols.find(c => c.k === inp.dataset.k);
          const x = inp.value;
          vals[i.k][+inp.dataset.r][inp.dataset.k] = col.t === 'text' ? x : col.t === 'sel' ? (() => { const o = col.opts.find(o => String(o[0]) === x); return o ? o[0] : x; })() : (x === '' ? NaN : parseFloat(x));
          recompute();
        }));
        holder.querySelectorAll('[data-del]').forEach(b => (b.onclick = () => { vals[i.k].splice(+b.dataset.del, 1); draw(); recompute(); }));
      }
      draw();
      const add = el('button', { class: 'btn', type: 'button', style: 'margin-top:8px' }, '＋ Add row');
      add.onclick = () => {
        const o = {};
        i.cols.forEach(c => { o[c.k] = c.d !== undefined ? c.d : (c.t === 'text' ? '' : 0); });
        vals[i.k].push(o); draw(); recompute();
      };
      wrap.appendChild(add);
      return wrap;
    }

    return { go: id => show(cfg.calcs.find(x => x.id === id) || cfg.calcs[0]) };
  }

  // single-file bundle router
  function start() {
    const iv = document.getElementById('indexView'), app = document.getElementById('app'), av = document.getElementById('aboutView');
    let cur = null;
    const route = () => {
      const [f, id] = location.hash.slice(1).split(':');
      const cfg = REG[f];
      if (f === 'about.html') {
        iv.style.display = 'none'; app.style.display = 'none'; av.style.display = ''; cur = null; window.scrollTo(0, 0);
        document.title = 'About & Credits';
        document.documentElement.style.setProperty('--accent', '#2563eb');
        return;
      }
      av.style.display = 'none';
      if (!cfg) {
        iv.style.display = ''; app.style.display = 'none'; cur = null;
        document.title = 'ETO Toolkit – Electrical Calculators';
        document.documentElement.style.setProperty('--accent', '#2563eb');
        return;
      }
      iv.style.display = 'none'; app.style.display = '';
      if (!cur || cur.file !== f) { cur = { file: f, api: mount(cfg) }; window.scrollTo(0, 0); }
      cur.api.go(id);
    };
    window.addEventListener('hashchange', route);
    route();
  }

  // theme restore
  try { const t = localStorage.getItem('eto:theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch (e) { /* ignore */ }

  window.ETO = { PAGES, S3, STD_SIZES, STD_BREAKERS, STD_FUSES, esc, fmt, R, lvl, std, rho, res, interp, vdrop, page, start };
})();
