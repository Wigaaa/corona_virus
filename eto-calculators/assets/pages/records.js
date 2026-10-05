(function () {
  const { R, lvl, esc, fmt } = ETO;
  const VT = ['Offshore Supply Vessel (PSV/AHTS)', 'DP Vessel / DSV', 'Jack-up Barge / Liftboat', 'Drillship / MODU', 'Tanker', 'Bulk Carrier', 'Container Vessel', 'Passenger Vessel / Ferry', 'Yacht', 'Tug / Workboat', 'Research / Survey Vessel', 'Other'];
  // ISO 10816-3 zone limits (mm/s rms): A/B, B/C, C/D
  const VIB = { g2r: ['Group 2 (15–300 kW), rigid', [1.4, 2.8, 4.5]], g2f: ['Group 2 (15–300 kW), flexible', [2.3, 4.5, 7.1]], g1r: ['Group 1 (> 300 kW), rigid', [2.3, 4.5, 7.1]], g1f: ['Group 1 (> 300 kW), flexible', [3.5, 7.1, 11]] };
  const ir40 = (ir, t) => ir * Math.pow(0.5, (40 - t) / 10);
  const imb = a => { const m = a.reduce((p, c) => p + c, 0) / a.length; return m ? Math.max(...a.map(x => Math.abs(x - m))) / m * 100 : 0; };
  const row = (item, val, crit, s) => ({ item, val, crit, s });
  const tbl = (title, rows) => `<h3>${esc(title)}</h3><table class="rt"><thead><tr><th>Item</th><th>Result</th><th>Criterion</th><th>Status</th></tr></thead><tbody>${rows.map(r => `<tr class="s-${r.s}"><td>${esc(r.item)}</td><td>${esc(r.val)}</td><td><span class="kb">${esc(r.crit)}</span></td><td>${{ ok: '✅ OK', warn: '⚠️ Monitor', bad: '⛔ Fail', info: 'ℹ️' }[r.s]}</td></tr>`).join('')}</tbody></table>`;
  const overall = rows => (rows.some(r => r.s === 'bad') ? 'bad' : rows.some(r => r.s === 'warn') ? 'warn' : 'ok');
  const verdictText = { ok: 'All results acceptable.', warn: 'Acceptable with items to monitor / trend.', bad: 'One or more results FAIL – corrective action required before return to service.' };
  const remarks = t => (t ? `<h3>Remarks</h3><p style="white-space:pre-wrap">${esc(t)}</p>` : '');
  const sign = '<div class="sign"><div>Tested by (ETO)</div><div>Verified by (Chief Engineer)</div><div>Date / stamp</div></div>';
  const n = (x, d) => fmt(x, d == null ? 2 : d);

  ETO.page({
    title: 'Test Records & Reports', icon: '🧾', accent: '#7c3aed',
    subtitle: 'Fill in readings → automatic pass/fail → print or save a professional PDF record. Set your vessel profile once; it appears on every report.',
    refs: ['IEEE 43', 'ISO 10816-3', 'IEC 60034-1', 'Printable / PDF'],
    calcs: [
      {
        id: 'profile', icon: '🚢', title: 'Vessel & ETO profile (set once)', desc: 'Saved in this browser and printed in the header of every report and troubleshooting record.',
        inputs: [{ k: 'vessel', t: 'text', l: 'Vessel / unit name', v: '' }, { k: 'vtype', l: 'Vessel type', opts: VT.map(x => [x, x]), v: VT[2] }, { k: 'imo', t: 'text', l: 'IMO no. / official no.', v: '' }, { k: 'company', t: 'text', l: 'Company / operator', v: 'ZMI' }, { k: 'eto', t: 'text', l: 'ETO name', v: 'Wagdy Mohamed Abdel Aziz' }, { k: 'rank', t: 'text', l: 'Rank / title', v: 'Electrical Technical Officer' }],
        run: v => ({ results: [R('Profile', v.vessel || '(vessel name not set)', '', 0, v.vessel ? 'ok' : 'warn', true)], html: ETO.reportHead('Report header preview', [['Date', new Date().toISOString().slice(0, 10)]]), notes: ['Changes are saved automatically. Reports read the profile when they are opened or recalculated.'] })
      },
      {
        id: 'motor', icon: '⚙️', title: 'Motor test record', report: true, desc: 'Winding resistance, insulation, PI, running currents, vibration and bearing temperatures with automatic assessment.',
        inputs: [
          { k: 'tag', t: 'text', l: 'Equipment / tag', v: 'No.1 Fire pump motor' }, { k: 'make', t: 'text', l: 'Maker / type / serial', v: '' }, { k: 'date', t: 'date', l: 'Test date', v: '' },
          { k: 'kw', l: 'Rated power', u: 'kW', v: 90, min: 0.01 }, { k: 'un', l: 'Rated voltage', u: 'V', v: 440, min: 1 }, { k: 'in', l: 'Rated current (FLC)', u: 'A', v: 148, min: 0.01 }, { k: 'rpm', l: 'Rated speed', u: 'rpm', v: 1775, min: 1 },
          { k: 'amb', l: 'Ambient temperature', u: '°C', v: 32 }, { k: 'tw', l: 'Winding temperature', u: '°C', v: 30 },
          { k: 'r1', l: 'R L1-L2', u: 'Ω', v: 0.0612, min: 0 }, { k: 'r2', l: 'R L2-L3', u: 'Ω', v: 0.0609, min: 0 }, { k: 'r3', l: 'R L3-L1', u: 'Ω', v: 0.0615, min: 0 },
          { k: 'tv', l: 'IR test voltage', opts: [[500, '500 V DC'], [1000, '1000 V DC'], [2500, '2500 V DC'], [5000, '5000 V DC']], v: 1000 },
          { k: 'i1', l: 'IR L1-E (1 min)', u: 'MΩ', v: 1200, min: 0 }, { k: 'i2', l: 'IR L2-E', u: 'MΩ', v: 1150, min: 0 }, { k: 'i3', l: 'IR L3-E', u: 'MΩ', v: 1180, min: 0 }, { k: 'i10', l: 'IR at 10 min (for PI, 0 = not done)', u: 'MΩ', v: 3100, min: 0 },
          { k: 'u', l: 'Running voltage', u: 'V', v: 441, min: 0 }, { k: 'a1', l: 'Running current L1', u: 'A', v: 121, min: 0 }, { k: 'a2', l: 'Running current L2', u: 'A', v: 118, min: 0 }, { k: 'a3', l: 'Running current L3', u: 'A', v: 124, min: 0 },
          { k: 'vg', l: 'Vibration class (ISO 10816-3)', opts: Object.keys(VIB).map(k => [k, VIB[k][0]]), v: 'g2r' }, { k: 'vde', l: 'Vibration DE', u: 'mm/s', v: 1.9, min: 0 }, { k: 'vnde', l: 'Vibration NDE', u: 'mm/s', v: 1.6, min: 0 },
          { k: 'bde', l: 'Bearing temp DE', u: '°C', v: 58 }, { k: 'bnde', l: 'Bearing temp NDE', u: '°C', v: 52 },
          { k: 'rem', t: 'area', l: 'Remarks', v: '', rows: 2 }
        ],
        run: v => {
          const ri = imb([v.r1, v.r2, v.r3]), irs = [v.i1, v.i2, v.i3].map(x => ir40(x, v.tw)), irmin = Math.min(...irs), irlim = v.un < 1000 ? 5 : v.un / 1000 + 1;
          const pi = v.i10 > 0 ? v.i10 / Math.min(v.i1, v.i2, v.i3) : null, ci = imb([v.a1, v.a2, v.a3]), cmax = Math.max(v.a1, v.a2, v.a3), z = VIB[v.vg][1], vmax = Math.max(v.vde, v.vnde), bmax = Math.max(v.bde, v.bnde);
          const rows = [
            row('Winding resistance imbalance', n(ri) + ' %', '≤ 2 %', lvl(ri, 2, 4)),
            row('Lowest IR (corrected 40 °C) @ ' + v.tv + ' V', n(irmin, 1) + ' MΩ', `≥ ${irlim} MΩ (IEEE 43); ≥ 10× = good`, irmin < irlim ? 'bad' : irmin < 10 * irlim ? 'warn' : 'ok'),
            row('Polarisation index', pi == null ? 'not measured' : n(pi), '≥ 2.0 (class B/F/H)', pi == null ? 'info' : pi < 1.5 ? 'bad' : pi < 2 ? 'warn' : 'ok'),
            row('Max running current / FLC', n(cmax, 1) + ' A (' + n(cmax / v.in * 100, 0) + ' %)', '≤ 100 % FLC', lvl(cmax / v.in * 100, 100, 110)),
            row('Current imbalance', n(ci) + ' %', '≤ 10 %', lvl(ci, 10, 20)),
            row('Supply voltage', n(v.u, 0) + ' V (' + n((v.u / v.un - 1) * 100, 1) + ' %)', 'Rated ±10 %', Math.abs(v.u / v.un - 1) <= 0.05 ? 'ok' : Math.abs(v.u / v.un - 1) <= 0.1 ? 'warn' : 'bad'),
            row('Max vibration', n(vmax) + ' mm/s', `Zone A/B ${z[0]}, B/C ${z[1]}, C/D ${z[2]} mm/s`, vmax <= z[1] ? 'ok' : vmax <= z[2] ? 'warn' : 'bad'),
            row('Max bearing temperature', n(bmax, 0) + ' °C (rise ' + n(bmax - v.amb, 0) + ' K)', '≤ 90 °C typical, rise ≤ 40–50 K', bmax <= 80 ? 'ok' : bmax <= 95 ? 'warn' : 'bad')
          ];
          const o = overall(rows);
          let h = ETO.reportHead('Motor Test Record', [['Equipment', v.tag], ['Maker / type / serial', v.make], ['Rating', `${v.kw} kW · ${v.un} V · ${v.in} A · ${v.rpm} rpm`], ['Test date', v.date], ['Ambient / winding temp', `${v.amb} °C / ${v.tw} °C`]]);
          h += `<h3>Readings</h3><table class="rt"><thead><tr><th></th><th>L1</th><th>L2</th><th>L3</th></tr></thead><tbody><tr><td>Winding R (Ω)</td><td>${v.r1}</td><td>${v.r2}</td><td>${v.r3}</td></tr><tr><td>IR to earth (MΩ, measured)</td><td>${v.i1}</td><td>${v.i2}</td><td>${v.i3}</td></tr><tr><td>IR @ 40 °C (MΩ)</td><td>${n(irs[0], 1)}</td><td>${n(irs[1], 1)}</td><td>${n(irs[2], 1)}</td></tr><tr><td>Running current (A)</td><td>${v.a1}</td><td>${v.a2}</td><td>${v.a3}</td></tr></tbody></table>`;
          h += tbl('Assessment', rows) + remarks(v.rem) + sign;
          return { head: '<span></span>', verdict: { s: o, t: verdictText[o] }, html: h };
        }
      },
      {
        id: 'gen', icon: '🛢️', title: 'Generator test record', report: true, desc: 'Stator / exciter insulation, no-load and load test, voltage regulation and current balance.',
        inputs: [
          { k: 'tag', t: 'text', l: 'Generator', v: 'DG No.2' }, { k: 'make', t: 'text', l: 'Maker / type / serial', v: '' }, { k: 'date', t: 'date', l: 'Test date', v: '' },
          { k: 'kva', l: 'Rated', u: 'kVA', v: 1250, min: 1 }, { k: 'un', l: 'Rated voltage', u: 'V', v: 440, min: 1 }, { k: 'fn', l: 'Rated frequency', u: 'Hz', v: 60, min: 1 }, { k: 'tw', l: 'Winding temperature', u: '°C', v: 35 },
          { k: 'is1', l: 'Stator IR L1-E', u: 'MΩ', v: 650, min: 0 }, { k: 'is2', l: 'Stator IR L2-E', u: 'MΩ', v: 700, min: 0 }, { k: 'is3', l: 'Stator IR L3-E', u: 'MΩ', v: 680, min: 0 }, { k: 'pi', l: 'Stator PI (0 = not done)', v: 2.6, min: 0 }, { k: 'ire', l: 'Exciter / rotor IR', u: 'MΩ', v: 120, min: 0 },
          { k: 'vnl', l: 'No-load voltage', u: 'V', v: 442, min: 0 }, { k: 'fnl', l: 'No-load frequency', u: 'Hz', v: 61.8, min: 0 },
          { k: 'kw', l: 'Load test kW', u: 'kW', v: 750, min: 0 }, { k: 'vfl', l: 'Voltage at load', u: 'V', v: 438, min: 0 }, { k: 'ffl', l: 'Frequency at load', u: 'Hz', v: 60.1, min: 0 },
          { k: 'a1', l: 'Current L1', u: 'A', v: 1150, min: 0 }, { k: 'a2', l: 'Current L2', u: 'A', v: 1162, min: 0 }, { k: 'a3', l: 'Current L3', u: 'A', v: 1141, min: 0 },
          { k: 'rem', t: 'area', l: 'Remarks', v: '', rows: 2 }
        ],
        run: v => {
          const irs = [v.is1, v.is2, v.is3].map(x => ir40(x, v.tw)), lo = Math.min(...irs), lim = v.un / 1000 + 1, reg = (v.vnl - v.vfl) / v.vfl * 100, ci = imb([v.a1, v.a2, v.a3]), In = v.kva * 1000 / (Math.sqrt(3) * v.un), Ld = Math.max(v.a1, v.a2, v.a3) / In * 100, droop = (v.fnl - v.ffl) / v.fn * 100;
          const rows = [
            row('Stator IR lowest (40 °C)', n(lo, 1) + ' MΩ', `≥ ${n(lim, 2)} MΩ; ≥ 100 MΩ good`, lo < lim ? 'bad' : lo < 100 ? 'warn' : 'ok'),
            row('Stator PI', v.pi ? n(v.pi) : 'not measured', '≥ 2.0', !v.pi ? 'info' : v.pi < 1.5 ? 'bad' : v.pi < 2 ? 'warn' : 'ok'),
            row('Exciter / rotor IR', n(v.ire, 1) + ' MΩ', '≥ 1 MΩ (≥ 5 MΩ good)', v.ire < 1 ? 'bad' : v.ire < 5 ? 'warn' : 'ok'),
            row('Voltage at load vs rated', n((v.vfl / v.un - 1) * 100) + ' %', '±2.5 % steady state', lvl(Math.abs(v.vfl / v.un - 1) * 100, 2.5, 3.5)),
            row('Voltage regulation NL→load', n(reg) + ' %', '≤ 2.5 %', lvl(Math.abs(reg), 2.5, 3.5)),
            row('Frequency droop NL→load', n(droop) + ' %', 'per governor setting (typ. 3–5 % at full load)', 'info'),
            row('Current imbalance', n(ci) + ' %', '≤ 10 %', lvl(ci, 10, 15)),
            row('Load test current / rated', n(Ld, 0) + ' %', '≤ 100 %', lvl(Ld, 100, 110))
          ];
          const o = overall(rows);
          let h = ETO.reportHead('Generator Test Record', [['Generator', v.tag], ['Maker / type / serial', v.make], ['Rating', `${v.kva} kVA · ${v.un} V · ${v.fn} Hz · In ${n(In, 0)} A`], ['Test date', v.date]]);
          h += `<h3>Readings</h3><table class="rt"><tbody><tr><td>Stator IR L1/L2/L3 (MΩ)</td><td>${v.is1} / ${v.is2} / ${v.is3}</td></tr><tr><td>No-load</td><td>${v.vnl} V · ${v.fnl} Hz</td></tr><tr><td>Load test</td><td>${v.kw} kW · ${v.vfl} V · ${v.ffl} Hz · ${v.a1} / ${v.a2} / ${v.a3} A</td></tr></tbody></table>`;
          h += tbl('Assessment', rows) + remarks(v.rem) + sign;
          return { head: '<span></span>', verdict: { s: o, t: verdictText[o] }, html: h };
        }
      },
      {
        id: 'trf', icon: '🧲', title: 'Transformer test record', report: true, desc: 'Insulation (HV-E, LV-E, HV-LV), turns ratio and winding resistance balance.',
        inputs: [
          { k: 'tag', t: 'text', l: 'Transformer', v: 'TR-1 690/440 V' }, { k: 'date', t: 'date', l: 'Test date', v: '' }, { k: 'kva', l: 'Rating', u: 'kVA', v: 400, min: 1 }, { k: 'tw', l: 'Winding temperature', u: '°C', v: 30 },
          { k: 'ihe', l: 'IR HV–E', u: 'MΩ', v: 2500, min: 0 }, { k: 'ile', l: 'IR LV–E', u: 'MΩ', v: 1800, min: 0 }, { k: 'ihl', l: 'IR HV–LV', u: 'MΩ', v: 3000, min: 0 },
          { k: 'rexp', l: 'Expected turns ratio', v: 1.5682, min: 0.0001 }, { k: 'ta', l: 'Ratio phase A', v: 1.5679, min: 0 }, { k: 'tb', l: 'Ratio phase B', v: 1.5688, min: 0 }, { k: 'tc', l: 'Ratio phase C', v: 1.5680, min: 0 },
          { k: 'h1', l: 'R HV 1', u: 'Ω', v: 0.0215, min: 0 }, { k: 'h2', l: 'R HV 2', u: 'Ω', v: 0.0217, min: 0 }, { k: 'h3', l: 'R HV 3', u: 'Ω', v: 0.0216, min: 0 },
          { k: 'l1', l: 'R LV 1', u: 'mΩ', v: 4.12, min: 0 }, { k: 'l2', l: 'R LV 2', u: 'mΩ', v: 4.10, min: 0 }, { k: 'l3', l: 'R LV 3', u: 'mΩ', v: 4.15, min: 0 }, { k: 'rem', t: 'area', l: 'Remarks', v: '', rows: 2 }
        ],
        run: v => {
          const ir = [v.ihe, v.ile, v.ihl].map(x => ir40(x, v.tw)), dev = [v.ta, v.tb, v.tc].map(x => Math.abs(x - v.rexp) / v.rexp * 100), wd = Math.max(...dev), hb = imb([v.h1, v.h2, v.h3]), lb = imb([v.l1, v.l2, v.l3]);
          const rows = [row('IR HV–E / LV–E / HV–LV @ 40 °C', ir.map(x => n(x, 0)).join(' / ') + ' MΩ', '≥ 100 MΩ typical for LV dry type', Math.min(...ir) < 5 ? 'bad' : Math.min(...ir) < 100 ? 'warn' : 'ok'), row('Turns ratio worst deviation', n(wd, 3) + ' %', '≤ 0.5 %', wd <= 0.5 ? 'ok' : 'bad'), row('HV winding resistance imbalance', n(hb) + ' %', '≤ 2 %', lvl(hb, 2, 4)), row('LV winding resistance imbalance', n(lb) + ' %', '≤ 2 %', lvl(lb, 2, 4))];
          const o = overall(rows);
          const h = ETO.reportHead('Transformer Test Record', [['Transformer', v.tag], ['Rating', v.kva + ' kVA'], ['Test date', v.date], ['Winding temp', v.tw + ' °C']]) + tbl('Assessment', rows) + remarks(v.rem) + sign;
          return { head: '<span></span>', verdict: { s: o, t: verdictText[o] }, html: h };
        }
      },
      {
        id: 'batt', icon: '🔋', title: 'Battery bank inspection record', report: true, desc: 'Block voltages on float, spread, total voltage and internal resistance vs baseline.',
        inputs: [
          { k: 'tag', t: 'text', l: 'Battery bank', v: '24 V Emergency battery' }, { k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'vn', l: 'Nominal block voltage', opts: [[2, '2 V cell'], [6, '6 V'], [12, '12 V']], v: 12 }, { k: 'fl', l: 'Expected float voltage per cell', u: 'V', v: 2.27, min: 1, step: 0.01 }, { k: 'rb', l: 'Baseline internal resistance', u: 'mΩ', v: 4.0, min: 0 }, { k: 'temp', l: 'Battery temperature', u: '°C', v: 27 },
          { k: 'tbl', t: 'table', l: 'Blocks', v: [{ n: '1', v: 13.62, r: 4.2 }, { n: '2', v: 13.58, r: 4.3 }], cols: [{ k: 'n', l: 'Block', t: 'text', d: '' }, { k: 'v', l: 'Float V', t: 'num', d: 13.6 }, { k: 'r', l: 'R mΩ (0 = n/a)', t: 'num', d: 0 }] }, { k: 'rem', t: 'area', l: 'Remarks', v: '', rows: 2 }
        ],
        run: v => {
          const cells = v.vn / 2, exp = v.fl * cells, rows = v.tbl.map(b => { const dv = b.v - exp, dr = v.rb && b.r ? (b.r - v.rb) / v.rb * 100 : null, s = Math.abs(dv) > 0.1 * cells || (dr != null && dr > 50) ? 'bad' : Math.abs(dv) > 0.05 * cells || (dr != null && dr > 25) ? 'warn' : 'ok'; return { b, dv, dr, s }; });
          const tot = v.tbl.reduce((p, b) => p + b.v, 0), o = rows.some(r => r.s === 'bad') ? 'bad' : rows.some(r => r.s === 'warn') || v.temp > 30 ? 'warn' : 'ok';
          let h = ETO.reportHead('Battery Bank Inspection Record', [['Battery', v.tag], ['Date', v.date], ['Temperature', v.temp + ' °C'], ['Total float voltage', n(tot, 2) + ' V']]);
          h += `<h3>Blocks</h3><table class="rt"><thead><tr><th>Block</th><th>Float V</th><th>Δ vs expected ${n(exp, 2)} V</th><th>R mΩ</th><th>Δ R %</th><th>Status</th></tr></thead><tbody>${rows.map(r => `<tr class="s-${r.s}"><td>${esc(r.b.n)}</td><td>${n(r.b.v)}</td><td>${n(r.dv)}</td><td>${r.b.r || '–'}</td><td>${r.dr == null ? '–' : n(r.dr, 0)}</td><td>${{ ok: '✅', warn: '⚠️', bad: '⛔' }[r.s]}</td></tr>`).join('')}</tbody></table>`;
          h += remarks(v.rem) + sign;
          return { head: '<span></span>', verdict: { s: o, t: o === 'ok' ? 'Battery bank healthy.' : o === 'warn' ? 'Monitor flagged blocks' + (v.temp > 30 ? ' – battery temperature above 30 °C shortens life.' : '.') : 'Replace / investigate failed blocks.' }, html: h, notes: ['Float tolerance used: ±0.05 V/cell monitor, ±0.10 V/cell fail; resistance +25 % monitor, +50 % fail (typical maker practice).'] };
        }
      },
      {
        id: 'cables', icon: '🔌', title: 'Cable insulation test record', report: true, desc: 'Record many cables at once – pass / fail against the minimum.',
        inputs: [{ k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'tv', l: 'Test voltage', opts: [[500, '500 V DC'], [1000, '1000 V DC']], v: 1000 }, { k: 'min', l: 'Minimum acceptable', u: 'MΩ', v: 1, min: 0 }, { k: 'tbl', t: 'table', l: 'Cables (lowest reading of each core to earth)', v: [{ id: 'C-101', ft: 'MSB → Fire pump', a: 850, b: 900, c: 870 }, { id: 'C-215', ft: 'ESB → Nav lights', a: 0.6, b: 120, c: 140 }], cols: [{ k: 'id', l: 'Cable ID', t: 'text', d: '' }, { k: 'ft', l: 'From → To', t: 'text', d: '', w: 170 }, { k: 'a', l: 'L1-E MΩ', t: 'num', d: 0 }, { k: 'b', l: 'L2-E MΩ', t: 'num', d: 0 }, { k: 'c', l: 'L3-E MΩ', t: 'num', d: 0 }] }, { k: 'rem', t: 'area', l: 'Remarks', v: '', rows: 2 }],
        run: v => {
          const rows = v.tbl.map(c => { const lo = Math.min(c.a, c.b, c.c); return { c, lo, s: lo < v.min ? 'bad' : lo < 10 * v.min ? 'warn' : 'ok' }; });
          const o = rows.some(r => r.s === 'bad') ? 'bad' : rows.some(r => r.s === 'warn') ? 'warn' : 'ok';
          let h = ETO.reportHead('Cable Insulation Test Record', [['Date', v.date], ['Test voltage', v.tv + ' V DC'], ['Minimum', v.min + ' MΩ']]);
          h += `<table class="rt"><thead><tr><th>Cable</th><th>From → To</th><th>L1-E</th><th>L2-E</th><th>L3-E</th><th>Lowest</th><th>Status</th></tr></thead><tbody>${rows.map(r => `<tr class="s-${r.s}"><td>${esc(r.c.id)}</td><td>${esc(r.c.ft)}</td><td>${r.c.a}</td><td>${r.c.b}</td><td>${r.c.c}</td><td>${r.lo}</td><td>${{ ok: '✅', warn: '⚠️', bad: '⛔' }[r.s]}</td></tr>`).join('')}</tbody></table>`;
          h += remarks(v.rem) + sign;
          return { head: '<span></span>', results: [R('Cables tested', rows.length, '', 0), R('Failed', rows.filter(r => r.s === 'bad').length, '', 0, rows.some(r => r.s === 'bad') ? 'bad' : 'ok')], verdict: { s: o, t: verdictText[o] }, html: h };
        }
      },
      {
        id: 'breakdown', icon: '🚨', title: 'Breakdown / failure report', report: true, desc: 'Structured failure report for the office / technical superintendent.',
        inputs: [{ k: 'eq', t: 'text', l: 'Equipment / system', v: 'Thruster No.2 VFD' }, { k: 'date', t: 'date', l: 'Date of failure', v: '' }, { k: 'time', t: 'text', l: 'Time', v: '' }, { k: 'cat', l: 'Criticality', opts: [['c', 'Critical – affects safety / DP / class'], ['h', 'High – affects operations'], ['n', 'Normal']], v: 'h' }, { k: 'st', l: 'Status', opts: [['open', 'Open – awaiting parts / service'], ['temp', 'Temporary repair'], ['closed', 'Closed – permanently repaired']], v: 'open' }, { k: 'dt', l: 'Downtime', u: 'h', v: 6, min: 0 },
          { k: 'sym', t: 'area', l: 'Symptoms / alarms observed', v: '', rows: 2 }, { k: 'inv', t: 'area', l: 'Investigation & measurements', v: '', rows: 3 }, { k: 'rc', t: 'area', l: 'Root cause', v: '', rows: 2 }, { k: 'act', t: 'area', l: 'Corrective action taken', v: '', rows: 2 }, { k: 'parts', t: 'area', l: 'Spare parts used / required (P/N, qty)', v: '', rows: 2 }, { k: 'rec', t: 'area', l: 'Recommendations / preventive action', v: '', rows: 2 }],
        run: v => {
          const cat = { c: 'CRITICAL', h: 'HIGH', n: 'NORMAL' }[v.cat], st = { open: 'OPEN', temp: 'TEMPORARY REPAIR', closed: 'CLOSED' }[v.st];
          const sec = (t, x) => `<h3>${t}</h3><p style="white-space:pre-wrap">${esc(x || '—')}</p>`;
          const h = ETO.reportHead('Breakdown / Failure Report', [['Equipment', v.eq], ['Date / time', `${v.date} ${v.time}`], ['Criticality', cat], ['Status', st], ['Downtime', v.dt + ' h']]) + sec('1. Symptoms / alarms', v.sym) + sec('2. Investigation', v.inv) + sec('3. Root cause', v.rc) + sec('4. Corrective action', v.act) + sec('5. Spare parts', v.parts) + sec('6. Recommendations', v.rec) + sign;
          return { head: '<span></span>', verdict: { s: v.st === 'closed' ? 'ok' : v.cat === 'c' ? 'bad' : 'warn', t: `${cat} · ${st}` }, html: h };
        }
      },
      {
        id: 'daily', icon: '📅', title: 'Daily ETO report / handover', report: true, desc: 'Daily report or hand-over note: plant status, work done, defects, pending jobs and safety items.',
        inputs: [{ k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'kind', l: 'Document', opts: [['d', 'Daily report'], ['w', 'Weekly report'], ['h', 'Hand-over note']], v: 'd' }, { k: 'plant', t: 'area', l: 'Power plant status (DGs running, load, PMS mode, shore power)', v: 'DG1 + DG2 on line, DG3 standby, load 1.1 MW, PMS auto.', rows: 2 }, { k: 'done', t: 'area', l: 'Work completed', v: '', rows: 3 }, { k: 'def', t: 'area', l: 'Open defects / alarms', v: '', rows: 3 }, { k: 'pend', t: 'area', l: 'Pending jobs / next steps', v: '', rows: 2 }, { k: 'req', t: 'area', l: 'Requisitions / spares status', v: '', rows: 2 }, { k: 'safe', t: 'area', l: 'Safety / permits / isolations in place', v: '', rows: 2 }],
        run: v => {
          const t = { d: 'Daily ETO Report', w: 'Weekly ETO Report', h: 'ETO Hand-over Note' }[v.kind], sec = (a, b) => `<h3>${a}</h3><p style="white-space:pre-wrap">${esc(b || '—')}</p>`;
          return { head: '<span></span>', html: ETO.reportHead(t, [['Date', v.date]]) + sec('Power plant status', v.plant) + sec('Work completed', v.done) + sec('Open defects / alarms', v.def) + sec('Pending jobs', v.pend) + sec('Requisitions / spares', v.req) + sec('Safety / isolations in place', v.safe) + '<div class="sign"><div>Off-going ETO</div><div>On-coming ETO / Chief Engineer</div></div>' };
        }
      },
      {
        id: 'toolbox', icon: '🦺', title: 'Toolbox talk record', report: true, desc: 'Record a pre-job toolbox talk for electrical work.',
        inputs: [{ k: 'job', t: 'text', l: 'Job / task', v: 'Replace contactor in No.1 ballast pump starter' }, { k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'ptw', t: 'text', l: 'Permit / isolation certificate no.', v: '' }, { k: 'haz', t: 'area', l: 'Hazards', v: 'Electric shock / arc flash; stored energy; manual handling; working in confined starter panel', rows: 3 }, { k: 'ctl', t: 'area', l: 'Controls', v: 'Isolate at MSB, lock & tag, prove dead (test-prove-test); insulated tools; PPE; second person present', rows: 3 }, { k: 'att', t: 'area', l: 'Attendees (one per line)', v: '', rows: 3 }],
        run: v => {
          const att = String(v.att).split('\n').filter(x => x.trim());
          return { head: '<span></span>', html: ETO.reportHead('Toolbox Talk Record', [['Job', v.job], ['Date', v.date], ['Permit / isolation no.', v.ptw]]) + `<h3>Hazards</h3><p style="white-space:pre-wrap">${esc(v.haz)}</p><h3>Controls</h3><p style="white-space:pre-wrap">${esc(v.ctl)}</p><h3>Attendees</h3><table class="rt"><thead><tr><th>#</th><th>Name</th><th>Signature</th></tr></thead><tbody>${(att.length ? att : ['', '', '']).map((a, i) => `<tr><td>${i + 1}</td><td>${esc(a)}</td><td style="min-width:160px"></td></tr>`).join('')}</tbody></table>` + '<div class="sign"><div>Person in charge</div></div>' };
        }
      }
    ]
  });
})();
