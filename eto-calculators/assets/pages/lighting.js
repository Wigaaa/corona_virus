(function () {
  const { R, lvl, S3, vdrop, interp } = ETO;
  const UF = [[0.6, 0.40], [0.8, 0.46], [1, 0.50], [1.25, 0.55], [1.5, 0.58], [2, 0.62], [2.5, 0.65], [3, 0.67], [4, 0.70], [5, 0.72]];
  ETO.page({
    title: 'Lighting Calculations', icon: '💡', accent: '#65a30d',
    subtitle: 'Fixture count, illuminance, spacing, lighting load, emergency lighting battery and circuit voltage drop.',
    refs: ['IEC 60092-306', 'ISO 8995 / EN 12464', 'SOLAS II-1/41-43', 'IEC 60092-201'],
    calcs: [
      {
        id: 'fix', icon: '🔢', title: 'Number of fixtures', desc: 'Lumen method for the number of luminaires for a target illuminance.',
        formula: 'N = E × A / (Φ × UF × MF)',
        inputs: [{ k: 'e', l: 'Target illuminance', u: 'lux', v: 200, min: 1 }, { k: 'l', l: 'Room length', u: 'm', v: 12, min: 0.1 }, { k: 'w', l: 'Room width', u: 'm', v: 8, min: 0.1 }, { k: 'phi', l: 'Lumens per fixture', u: 'lm', v: 12000, min: 1 }, { k: 'uf', l: 'Utilisation factor', v: 0.55, min: 0.1, max: 1, step: 0.01 }, { k: 'mf', l: 'Maintenance factor', v: 0.8, min: 0.3, max: 1, step: 0.01, hint: 'Marine / dirty areas: 0.6–0.7' }],
        run: v => {
          const n = v.e * v.l * v.w / (v.phi * v.uf * v.mf);
          return { results: [R('Fixtures (calculated)', n, '', 1), R('Fixtures (round up)', Math.ceil(n - 1e-9), '', 0, null, true), R('Area', v.l * v.w, 'm²', 1), R('Actual lux with that number', Math.ceil(n - 1e-9) * v.phi * v.uf * v.mf / (v.l * v.w), 'lux', 0)] };
        }
      },
      {
        id: 'ri', icon: '📐', title: 'Room index & suggested UF', desc: 'Room index K and an indicative utilisation factor.',
        formula: 'K = L × W / (Hm × (L + W))',
        inputs: [{ k: 'l', l: 'Length', u: 'm', v: 12, min: 0.1 }, { k: 'w', l: 'Width', u: 'm', v: 8, min: 0.1 }, { k: 'hm', l: 'Mounting height above work plane', u: 'm', v: 3.5, min: 0.1 }],
        run: v => { const k = v.l * v.w / (v.hm * (v.l + v.w)); return { results: [R('Room index K', k, '', 2, null, true), R('Indicative UF', interp(UF, k), '', 2)], notes: ['Indicative for typical LED high-bay / industrial luminaires with light surfaces – use the luminaire manufacturer\'s UF table.'] }; }
      },
      {
        id: 'lux', icon: '☀️', title: 'Illuminance from existing fixtures', desc: 'Average lux produced by the installed fixtures (compare with your lux meter).',
        formula: 'E = N × Φ × UF × MF / A',
        inputs: [{ k: 'n', l: 'Number of fixtures', v: 12, min: 1, step: 1 }, { k: 'phi', l: 'Lumens each', u: 'lm', v: 12000, min: 1 }, { k: 'uf', l: 'UF', v: 0.55, min: 0.1, max: 1, step: 0.01 }, { k: 'mf', l: 'MF', v: 0.8, min: 0.3, max: 1, step: 0.01 }, { k: 'a', l: 'Area', u: 'm²', v: 96, min: 0.1 }, { k: 'req', l: 'Required lux', u: 'lux', v: 200, min: 1 }],
        run: v => { const e = v.n * v.phi * v.uf * v.mf / v.a, st = e >= v.req ? 'ok' : e >= 0.8 * v.req ? 'warn' : 'bad'; return { results: [R('Average illuminance', e, 'lux', 0, st, true), R('vs requirement', e / v.req * 100, '%', 0, st)], verdict: { s: st, t: st === 'ok' ? 'Meets requirement.' : 'Below requirement – clean fixtures / replace failed lamps / add fixtures.' } }; }
      },
      {
        id: 'sp', icon: '🔲', title: 'Fixture layout & spacing', desc: 'Grid layout and spacing-to-height check for even illumination.',
        formula: 'S/H ≤ ~1.5 (max spacing-to-mounting-height)',
        inputs: [{ k: 'n', l: 'Number of fixtures', v: 12, min: 1, step: 1 }, { k: 'l', l: 'Room length', u: 'm', v: 12, min: 0.1 }, { k: 'w', l: 'Room width', u: 'm', v: 8, min: 0.1 }, { k: 'h', l: 'Mounting height', u: 'm', v: 3.5, min: 0.1 }, { k: 'sh', l: 'Max S/H for luminaire', v: 1.5, min: 0.3, step: 0.1 }],
        run: v => {
          const cols = Math.max(1, Math.round(Math.sqrt(v.n * v.l / v.w))), rows = Math.ceil(v.n / cols), sx = v.l / cols, sy = v.w / rows, r = Math.max(sx, sy) / v.h, st = r <= v.sh ? 'ok' : 'warn';
          return { results: [R('Layout', `${cols} × ${rows}`, ''), R('Spacing along length', sx, 'm', 2), R('Spacing along width', sy, 'm', 2), R('S / H', r, '', 2, st, true), R('Wall distance', sx / 2, 'm', 2)], verdict: { s: st, t: st === 'ok' ? 'Spacing satisfactory.' : 'Spacing too wide for the mounting height – add fixtures or lower the mounting height.' } };
        }
      },
      {
        id: 'ld', icon: '⚡', title: 'Lighting load', desc: 'Connected load, current and balance across phases.',
        formula: 'P = N × W × gear factor    I = P / (√3 × V × PF)',
        inputs: [{ k: 'n', l: 'Fixtures', v: 40, min: 1, step: 1 }, { k: 'w', l: 'Watts each', u: 'W', v: 100, min: 1 }, { k: 'g', l: 'Control-gear loss factor', v: 1.0, min: 1, step: 0.01, hint: 'LED 1.0–1.1; fluorescent/HID 1.1–1.25' }, { k: 'pf', l: 'Power factor', v: 0.95, min: 0.3, max: 1, step: 0.01 }, { k: 'v', l: 'Supply voltage (line)', u: 'V', v: 440, min: 1 }, { k: 'ph', l: 'Circuit', opts: [['3', '3-phase'], ['1', 'Single-phase']], v: '3' }],
        run: v => {
          const p = v.n * v.w * v.g / 1000, s = p / v.pf, i = v.ph == 3 ? s * 1000 / (S3 * v.v) : s * 1000 / v.v;
          return { results: [R('Connected load', p, 'kW', 2, null, true), R('Apparent power', s, 'kVA', 2), R('Current', i, 'A', 1), R('Fixtures per phase', Math.ceil(v.n / 3), '', 0)] };
        }
      },
      {
        id: 'em', icon: '🚨', title: 'Emergency lighting battery', desc: 'Battery capacity for emergency lighting duration.',
        formula: 'Ah = P × t × K / (V × DoD)',
        inputs: [{ k: 'p', l: 'Emergency lighting load', u: 'W', v: 600, min: 0 }, { k: 'v', l: 'Battery voltage', u: 'V', v: 24, min: 1 }, { k: 't', l: 'Duration', u: 'h', v: 18, min: 0.1, hint: 'SOLAS II-1/43: 18 h cargo, 36 h passenger. Transitional source 30 min.' }, { k: 'k', l: 'Ageing × temperature × margin', v: 1.4, min: 1, step: 0.01 }, { k: 'dod', l: 'Usable DoD', v: 0.8, min: 0.1, max: 1, step: 0.01 }, { k: 'tot', l: 'Total lighting load (for % calc)', u: 'W', v: 4000, min: 1 }],
        run: v => { const ah = v.p * v.t * v.k / (v.v * v.dod); return { results: [R('Required capacity', ah, 'Ah', 0, null, true), R('Load current', v.p / v.v, 'A', 1), R('Energy', v.p * v.t / 1000, 'kWh', 2), R('Share of total lighting', v.p / v.tot * 100, '%', 0)] }; }
      },
      {
        id: 'vd', icon: '📉', title: 'Lighting circuit voltage drop', desc: 'Voltage drop for a lighting final circuit.',
        formula: 'Vd = k × I × L × (R cosφ + X sinφ)',
        inputs: [{ k: 'sys', l: 'System', opts: [['1', 'Single-phase'], ['3', '3-phase']], v: '1' }, { k: 'v', l: 'Voltage', u: 'V', v: 230, min: 1 }, { k: 'p', l: 'Load', u: 'W', v: 1500, min: 1 }, { k: 'pf', l: 'PF', v: 0.95, min: 0.3, max: 1, step: 0.01 }, { k: 'l', l: 'Length', u: 'm', v: 60, min: 0 }, { k: 's', l: 'Cable size', u: 'mm²', v: 2.5, min: 0.5 }, { k: 'lim', l: 'Allowed drop', u: '%', v: 5, min: 0.1 }],
        run: v => {
          const i = v.sys == 3 ? v.p / (S3 * v.v * v.pf) : v.p / (v.v * v.pf), d = vdrop(v.sys, i, v.l, v.s, 'Cu', 70, 0.1, v.pf, 1), pc = d.v / v.v * 100, st = lvl(pc, v.lim, v.lim * 1.2);
          return { results: [R('Current', i, 'A', 2), R('Voltage drop', d.v, 'V', 2, st, true), R('Voltage drop', pc, '%', 2, st)], verdict: { s: st, t: st === 'ok' ? 'Acceptable.' : 'Too high – increase conductor size or split the circuit.' } };
        }
      },
      {
        id: 'ref', icon: '📋', title: 'Typical illuminance guide', desc: 'Indicative values commonly used on vessels – confirm against company, class and flag requirements.', inputs: [], run: () => ({ results: [] }),
        html: `<table><tr><th>Area</th><th>Typical lux</th></tr><tr><td>Main deck walkways / open deck</td><td>20 – 50</td></tr><tr><td>Crane / work areas on deck</td><td>50 – 100</td></tr><tr><td>Engine room / machinery spaces</td><td>150 – 200</td></tr><tr><td>Switchboard / control rooms</td><td>200 – 300</td></tr><tr><td>Workshops</td><td>300 – 500</td></tr><tr><td>Passageways / stairs</td><td>100</td></tr><tr><td>Cabins</td><td>100 – 150</td></tr><tr><td>Galley / mess</td><td>200 – 300</td></tr><tr><td>Bridge / office</td><td>200 – 300</td></tr></table>`
      }
    ]
  });
})();
