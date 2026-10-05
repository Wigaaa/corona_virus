(function () {
  const { R, lvl, esc, fmt } = ETO;
  const ST = [['ok', '✅ OK'], ['def', '⛔ Defect'], ['obs', '⚠️ Observation'], ['na', 'N/A'], ['nd', '⏳ Not done']];
  const mk = (items) => items.map(([item, iv]) => ({ item, iv, st: 'nd', rem: '' }));
  const LISTS = {
    motor: ['⚙️', 'Motor & starter PM', [['Visual: frame, fan cover, cooling fins clean', 'M'], ['Terminal box: gasket, glands, no moisture / burning', '6M'], ['Running current all phases vs FLC / previous', 'M'], ['Vibration & noise; bearing temperature', 'M'], ['Bearing lubrication (grease qty / interval per plate)', 'per plate'], ['Insulation resistance (and PI for > 100 kW)', '6M–12M'], ['Anti-condensation heater works (motor stopped)', '3M'], ['Starter: contactor contacts, OL relay setting = FLC, terminals torque', '12M'], ['Thermal-image starter & terminals under load', '12M'], ['Coupling / alignment / foundation bolts', '12M']]],
    gen: ['🛢️', 'Generator (alternator) PM', [['Alternator air intake / filters clean', 'M'], ['Space heater operation (standby)', 'M'], ['Bearing temperature / noise, vibration', 'M'], ['AVR & terminal box: connections, no overheating', '6M'], ['Rotating diodes & varistor visual / test', '12M'], ['Stator IR + PI, exciter IR', '12M'], ['Load test & voltage regulation check', '12M'], ['Protection relay test (reverse power, OC, UV, OV, UF)', '12M–30M (class)'], ['Load sharing & synchroniser check', '6M'], ['Breaker service & ductor test', '30M or per maker']]],
    vfd: ['🎛️', 'VFD inspection', [['Cooling fans run; air filters clean / replaced', '3M'], ['Heat-sink and cabinet clean, no dust build-up', '6M'], ['Cooling water flow / leak check (liquid cooled)', 'M'], ['Fault & warning history reviewed and logged', 'M'], ['DC-link voltage & ripple normal', '6M'], ['Power terminals torque / thermal image', '12M'], ['Parameters backed up (file + date)', '12M & after any change'], ['Cooling fan replacement hours (typ. 30–50 k h)', 'per hours'], ['DC capacitor reforming (spare drives in store)', '12M'], ['Motor cable IR (drive disconnected!)', '12M']]],
    ups: ['🔋', 'UPS inspection', [['Alarm / event log reviewed', 'M'], ['Load % and autonomy displayed', 'M'], ['Fans running, filters clean', '3M'], ['Room temperature 20–25 °C', 'W'], ['Battery block voltages on float', '3M'], ['Battery internal resistance / conductance', '6M'], ['Battery discharge (autonomy) test', '12M'], ['Bypass transfer test', '12M'], ['Terminal torque / thermal image', '12M'], ['Battery age vs design life', '12M']]],
    swbd: ['🔌', 'Switchboard / ACB inspection', [['Visual: no overheating, smell, discoloration', 'M'], ['Indications, meters, lamps working', 'M'], ['Insulation monitor / earth lamps reading', 'D'], ['Thermal-image busbars & breakers under load', '12M'], ['Busbar joints torque check (de-energised)', '30M–60M'], ['ACB: mechanism lubrication, contacts, arc chutes', 'per maker'], ['Trip unit secondary injection test', '30M'], ['UV / shunt coil and spring-charge operation', '12M'], ['Mechanical & electrical interlocks (bus-tie, shore)', '12M'], ['Clean & vacuum, check door seals / heaters', '12M']]],
    batt: ['🔋', 'Battery & charger inspection', [['Charger float / boost voltage & current', 'W'], ['Cell / block voltages', 'M'], ['Electrolyte level & SG (vented cells)', 'M'], ['Terminals clean, tight, greased', '3M'], ['Battery room / locker ventilation working', 'M'], ['Temperature of cells and room', 'M'], ['DC earth-fault meter reading', 'D'], ['Capacity (discharge) test', '12M']]],
    egen: ['🆘', 'Emergency generator test', [['Fuel level, lube oil, coolant checked', 'W'], ['Start batteries / air: voltage, pressure', 'W'], ['Auto start on simulated blackout (≤ 45 s on load, SOLAS)', 'W–M'], ['Second start source available', 'W'], ['Run on load (connect to ESB) – voltage, frequency', 'M'], ['Emergency lighting & essential loads energised', 'M'], ['Return to normal / back-synchronisation or changeover', 'M'], ['Space heater, louvers, room ventilation', 'M'], ['Protection & shutdowns (OS, LO pressure) test', '12M']]]
  };
  const calcs = Object.keys(LISTS).map(id => {
    const [icon, title, items] = LISTS[id];
    return {
      id, icon, title: title + ' checklist', report: true,
      desc: 'Interactive checklist: set the status of each item and add remarks – summary and defect list update automatically. Add your own items with “＋ Add row”. Intervals are typical; follow the PMS / maker.',
      inputs: [{ k: 'tag', t: 'text', l: 'Equipment / tag', v: '' }, { k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'tbl', t: 'table', l: 'Checklist', v: mk(items), cols: [{ k: 'item', l: 'Item', t: 'text', d: '', w: 330 }, { k: 'iv', l: 'Interval', t: 'text', d: '', w: 90 }, { k: 'st', l: 'Status', t: 'sel', opts: ST, d: 'nd' }, { k: 'rem', l: 'Remark / reading', t: 'text', d: '', w: 180 }] }],
      run: v => {
        const c = k => v.tbl.filter(r => r.st === k).length, def = v.tbl.filter(r => r.st === 'def'), obs = v.tbl.filter(r => r.st === 'obs'), nd = c('nd'), tot = v.tbl.length;
        const s = def.length ? 'bad' : nd || obs.length ? 'warn' : 'ok';
        let h = ETO.reportHead(title + ' – checklist', [['Equipment', v.tag], ['Date', v.date]]);
        h += `<table class="rt"><thead><tr><th>#</th><th>Item</th><th>Interval</th><th>Status</th><th>Remark</th></tr></thead><tbody>${v.tbl.map((r, i) => `<tr class="${r.st === 'def' ? 's-bad' : r.st === 'obs' ? 's-warn' : r.st === 'ok' ? 's-ok' : ''}"><td>${i + 1}</td><td><span class="kb">${esc(r.item)}</span></td><td>${esc(r.iv)}</td><td>${(ST.find(x => x[0] === r.st) || ['', ''])[1]}</td><td><span class="kb">${esc(r.rem)}</span></td></tr>`).join('')}</tbody></table>`;
        if (def.length) h += `<h3>Defects to raise</h3><ol class="steps">${def.map(r => `<li>${esc(r.item)}${r.rem ? ' – ' + esc(r.rem) : ''}</li>`).join('')}</ol>`;
        h += '<div class="sign"><div>Inspected by (ETO)</div><div>Chief Engineer</div></div>';
        return { results: [R('Items', tot, '', 0), R('OK', c('ok'), '', 0, 'ok'), R('Defects', def.length, '', 0, def.length ? 'bad' : 'ok', true), R('Observations', obs.length, '', 0, obs.length ? 'warn' : 'ok'), R('Not done', nd, '', 0, nd ? 'warn' : 'ok'), R('Completion', tot ? (tot - nd) / tot * 100 : 0, '%', 0)], verdict: { s, t: def.length ? `${def.length} defect(s) – raise in PMS / defect list.` : nd ? `${nd} item(s) still open.` : 'Checklist complete.' }, html: h };
      }
    };
  });
  // trend analysis
  const parse = s => String(s).split(/\n/).map(l => l.trim()).filter(Boolean).map(l => { const p = l.split(/[\s,;\t]+/); return [p[0], parseFloat(p[1])]; }).filter(p => p[0] && isFinite(p[1]));
  calcs.push({
    id: 'trend', icon: '📈', title: 'Condition trend & projection', report: true,
    desc: 'Paste dated readings (one per line: <b>YYYY-MM-DD value</b>) – insulation, current, temperature, vibration, battery resistance… The tool fits a trend line, shows the rate of change and projects when the limit will be reached.',
    formula: 'Least-squares fit y = a + b·t (log scale for insulation resistance)   projected date: y(t) = limit',
    inputs: [{ k: 'what', t: 'text', l: 'Parameter / equipment', v: 'No.2 Bilge pump motor – IR @ 40 °C' }, { k: 'unit', t: 'text', l: 'Unit', v: 'MΩ' }, { k: 'dir', l: 'Deterioration means the value…', opts: [['down', 'Falls (insulation, PI, flow)'], ['up', 'Rises (current, temperature, vibration, resistance)']], v: 'down' }, { k: 'log', l: 'Fit type', opts: [['log', 'Exponential (best for IR)'], ['lin', 'Linear']], v: 'log' }, { k: 'lim', l: 'Alarm / minimum limit', v: 5 },
      { k: 'd', t: 'area', l: 'Readings', v: '2024-01-15 950\n2024-07-10 720\n2025-01-12 610\n2025-07-08 420\n2026-01-20 300\n2026-07-15 210', rows: 6 }],
    run: v => {
      const pts = parse(v.d).map(([d, y]) => [Date.parse(d), y]).filter(p => isFinite(p[0])).sort((a, b) => a[0] - b[0]);
      if (pts.length < 2) throw new Error('Enter at least two dated readings (YYYY-MM-DD value)');
      const lg = v.log === 'log'; if (lg && pts.some(p => p[1] <= 0)) throw new Error('Exponential fit needs positive values');
      const t0 = pts[0][0], DAY = 864e5, X = pts.map(p => (p[0] - t0) / DAY), Y = pts.map(p => (lg ? Math.log(p[1]) : p[1]));
      const n = X.length, mx = X.reduce((a, b) => a + b) / n, my = Y.reduce((a, b) => a + b) / n, sxx = X.reduce((a, x) => a + (x - mx) ** 2, 0), b = sxx ? X.reduce((a, x, i) => a + (x - mx) * (Y[i] - my), 0) / sxx : 0, a = my - b * mx;
      const f = x => (lg ? Math.exp(a + b * x) : a + b * x), last = pts[n - 1], perYear = lg ? (Math.exp(b * 365) - 1) * 100 : b * 365;
      const worsening = v.dir === 'down' ? b < 0 : b > 0, limY = lg ? Math.log(v.lim) : v.lim, xl = b !== 0 ? (limY - a) / b : Infinity;
      const xlast = (last[0] - t0) / DAY, days = xl - xlast, already = v.dir === 'down' ? last[1] <= v.lim : last[1] >= v.lim;
      const st = already ? 'bad' : worsening && days < 365 ? 'bad' : worsening && days < 3 * 365 ? 'warn' : 'ok';
      const when = isFinite(xl) && worsening && !already ? new Date(t0 + xl * DAY).toISOString().slice(0, 10) : '—';
      const fit = []; const xmax = Math.max(xlast, worsening && isFinite(xl) && days > 0 && days < 5 * 365 ? xl : xlast); for (let i = 0; i <= 40; i++) { const x = xmax * i / 40; fit.push([x / 365.25, f(x)]); }
      const chart = ETO.chart([{ name: 'Readings', color: '#2563eb', pts: pts.map(p => [(p[0] - t0) / DAY / 365.25, p[1]]), dots: true }, { name: 'Trend', color: '#7c3aed', pts: fit, dash: true }], { xl: 'Years since first reading', yl: v.unit, hlines: [{ y: v.lim, label: 'Limit ' + v.lim + ' ' + v.unit }], logy: lg, xfmt: x => fmt(x, 1) });
      return { results: [R('Latest value', last[1], v.unit, 'auto', already ? 'bad' : null, true), R('Rate of change', perYear, lg ? '% / year' : v.unit + ' / year', 2, worsening ? 'warn' : 'ok'), R('Projected limit date', already ? 'LIMIT REACHED' : when, '', 0, st, true), R('Time to limit', already ? 0 : worsening && isFinite(days) ? days / 30.44 : '—', 'months', 1)],
        verdict: { s: st, t: already ? 'Limit already reached – act now.' : !worsening ? 'No deteriorating trend.' : st === 'bad' ? 'Limit expected within 12 months – plan corrective maintenance.' : st === 'warn' ? 'Deteriorating – limit expected within 3 years; increase monitoring.' : 'Slow deterioration.' },
        html: ETO.reportHead('Condition trend – ' + v.what, [['Readings', n], ['Fit', lg ? 'exponential' : 'linear']]) + chart };
    }
  });
  calcs.push({
    id: 'intervals', icon: '🗓️', title: 'Typical maintenance intervals (reference)', inputs: [], run: () => ({ results: [] }), desc: 'Indicative intervals used on many vessels – the vessel PMS, maker manuals and class requirements take precedence.',
    html: `<table><tr><th>Equipment</th><th>Task</th><th>Typical interval</th></tr>
<tr><td>Motors</td><td>IR test, terminal box, heater</td><td>6–12 months</td></tr><tr><td>Motors</td><td>Bearing greasing</td><td>Per lubrication plate (hours)</td></tr>
<tr><td>Generators</td><td>IR / PI, diode test, AVR check</td><td>12 months</td></tr><tr><td>Generators</td><td>Protection relay test</td><td>Class survey cycle (often 30 months)</td></tr>
<tr><td>Main switchboard</td><td>Thermography under load</td><td>12 months</td></tr><tr><td>Main switchboard</td><td>Busbar torque, ACB service</td><td>30–60 months / maker</td></tr>
<tr><td>VFDs</td><td>Fans & filters</td><td>3–6 months</td></tr><tr><td>VFDs</td><td>Fan replacement / capacitor check</td><td>4–7 years / hours</td></tr>
<tr><td>UPS / batteries</td><td>Block voltages, resistance</td><td>3–6 months</td></tr><tr><td>UPS / batteries</td><td>Autonomy test</td><td>12 months</td></tr>
<tr><td>Emergency generator</td><td>Start & run test</td><td>Weekly start, monthly on-load (per SMS / flag)</td></tr><tr><td>Emergency lighting</td><td>Function / duration test</td><td>Monthly / 12 months</td></tr>
<tr><td>Navigation lights</td><td>Lamp / alarm panel test</td><td>Before departure / daily</td></tr><tr><td>Fire detection</td><td>Detector function test (rotation)</td><td>Per SMS (often all detectors within 12 months)</td></tr></table>`
  });
  ETO.page({ title: 'Maintenance & Condition Monitoring', icon: '🛠️', accent: '#16a34a', subtitle: 'Interactive PM checklists that print as records, and trend analysis that predicts when equipment will reach its limit.', refs: ['Planned maintenance', 'Condition monitoring', 'Printable'], calcs });
})();
