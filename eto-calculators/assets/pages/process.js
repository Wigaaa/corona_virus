(function () {
  const { R, lvl, esc } = ETO;
  const G = 9.80665;
  ETO.page({
    title: 'Process Measurement', icon: '🧭', accent: '#2563eb',
    subtitle: 'Flow, level and pressure transmitter ranging, square-root extraction and measurement-accuracy budgets.',
    refs: ['ISO 5167', 'IEC 60770', 'Hydrostatics'],
    calcs: [
      {
        id: 'dpflow', icon: '💨', title: 'DP flow – square-root extraction', desc: 'Flow from differential pressure across an orifice / venturi / pitot (flow ∝ √ΔP).',
        formula: 'Q = Q_max × √(ΔP / ΔP_max)     linear DP mA → %Q = 100 × √((I − 4)/16)',
        inputs: [{ k: 'm', l: 'Input', opts: [['dp', 'Measured ΔP'], ['ma', 'Linear DP transmitter mA']], v: 'dp' }, { k: 'dp', l: 'Measured ΔP', u: 'mbar', v: 62.5, min: 0, show: v => v.m === 'dp' }, { k: 'ma', l: 'Transmitter output', u: 'mA', v: 8, min: 4, max: 20, show: v => v.m === 'ma' }, { k: 'dpmax', l: 'ΔP at maximum flow', u: 'mbar', v: 250, min: 0.001 }, { k: 'qmax', l: 'Maximum flow', u: 'm³/h', v: 120, min: 0.001 }, { k: 'cut', l: 'Low-flow cut-off', u: '% flow', v: 5, min: 0, max: 50 }],
        run: v => {
          const r = v.m === 'dp' ? v.dp / v.dpmax : (v.ma - 4) / 16, q = Math.sqrt(Math.max(0, r)) * 100, cut = q < v.cut;
          return { results: [R('Flow', cut ? 0 : q / 100 * v.qmax, 'm³/h', 2, cut ? 'warn' : null, true), R('Flow', cut ? 0 : q, '% of max', 2), R('ΔP', r * 100, '% of span', 2), R('Square-root output mA', 4 + 16 * q / 100, 'mA', 3)], verdict: cut ? { s: 'warn', t: 'Below low-flow cut-off – flow forced to zero (√ amplifies noise near zero).' } : null, notes: ['50 % of max flow = only 25 % of max ΔP. Rangeability of DP flow is typically 3:1 to 4:1.'] };
        }
      },
      {
        id: 'level', icon: '🛢️', title: 'Hydrostatic / DP level ranging (open, dry leg, wet leg)', desc: 'Lower and upper range values (LRV / URV) for a level transmitter, plus level from a live mA reading.',
        formula: 'Open / dry leg: ΔP = ρ·g·(h + d)     Wet leg (LP side filled): ΔP = ρ·g·(h + d) − ρ_wl·g·(H + d)',
        inputs: [{ k: 't', l: 'Installation', opts: [['open', 'Open (vented) tank or dry reference leg'], ['wet', 'Closed tank – wet reference leg']], v: 'open' }, { k: 'rho', l: 'Process liquid density', u: 'kg/m³', v: 1025, min: 1 }, { k: 'hmin', l: 'Level at 0 % (above lower tap)', u: 'm', v: 0, min: 0 }, { k: 'hmax', l: 'Level at 100 % (above lower tap)', u: 'm', v: 6, min: 0.001 }, { k: 'd', l: 'Transmitter below lower tap (+) / above (−)', u: 'm', v: 0.5 }, { k: 'H', l: 'Upper tap height above lower tap', u: 'm', v: 7, min: 0, show: v => v.t === 'wet' }, { k: 'rwl', l: 'Wet-leg fill density', u: 'kg/m³', v: 1000, min: 1, show: v => v.t === 'wet' }, { k: 'ma', l: 'Live transmitter output', u: 'mA', v: 12, min: 3.6, max: 21 }],
        run: v => {
          if (v.hmax <= v.hmin) throw new Error('100 % level must be above 0 % level');
          const dp = h => v.rho * G * (h + v.d) - (v.t === 'wet' ? v.rwl * G * (v.H + v.d) : 0), lrv = dp(v.hmin) / 100, urv = dp(v.hmax) / 100, f = (v.ma - 4) / 16, h = v.hmin + f * (v.hmax - v.hmin);
          return { results: [R('LRV (4 mA)', lrv, 'mbar', 2, null, true), R('URV (20 mA)', urv, 'mbar', 2, null, true), R('Span', urv - lrv, 'mbar', 2), R(lrv > 0 ? 'Zero suppression' : lrv < 0 ? 'Zero elevation' : 'Zero', Math.abs(lrv), 'mbar', 2), R('Level at live mA', h, 'm', 3), R('Level', f * 100, '%', 1)], notes: ['Density change (temperature, product change) shifts the reading proportionally – re-range when the product changes.', 'Wet-leg installations give a negative (elevated) range: LRV and URV are usually both negative.'] };
        }
      },
      {
        id: 'press', icon: '📊', title: 'Gauge ↔ absolute pressure', desc: 'Convert between gauge, absolute and vacuum.',
        formula: 'p_abs = p_gauge + p_atm',
        inputs: [{ k: 'm', l: 'Given', opts: [['g', 'Gauge pressure'], ['a', 'Absolute pressure'], ['v', 'Vacuum (below atmosphere)']], v: 'g' }, { k: 'x', l: 'Value', u: 'bar', v: 6 }, { k: 'atm', l: 'Atmospheric pressure', u: 'bar', v: 1.01325, min: 0.5 }],
        run: v => { const a = v.m === 'g' ? v.x + v.atm : v.m === 'a' ? v.x : v.atm - v.x; return { results: [R('Absolute', a, 'bar(a)', 4, a < 0 ? 'bad' : null, true), R('Gauge', a - v.atm, 'bar(g)', 4, null, true), R('Vacuum', Math.max(0, v.atm - a), 'bar', 4), R('Absolute', a * 14.5037738, 'psia', 2)] }; }
      },
      {
        id: 'range', icon: '🎚️', title: 'Transmitter range, turndown & accuracy', desc: 'Is the calibrated span within the sensor capability, and what accuracy can you expect?',
        formula: 'Turndown = URL / span     error = ±(accuracy % of span × span) – degraded when turndown exceeds the limit',
        inputs: [{ k: 'url', l: 'Sensor upper range limit (URL)', v: 100 }, { k: 'lrv', l: 'Calibrated LRV', v: 0 }, { k: 'urv', l: 'Calibrated URV', v: 16 }, { k: 'acc', l: 'Reference accuracy', u: '% of span', v: 0.075, min: 0 }, { k: 'tdl', l: 'Turndown for rated accuracy', u: ': 1', v: 10, min: 1 }, { k: 'u', t: 'text', l: 'Unit', v: 'bar' }],
        run: v => {
          const span = v.urv - v.lrv; if (span <= 0) throw new Error('URV must be above LRV');
          const td = v.url / span, deg = td > v.tdl ? v.acc * td / v.tdl : v.acc;
          return { results: [R('Span', span, v.u, 'auto'), R('Turndown', td, ': 1', 1, td > v.tdl ? 'warn' : 'ok', true), R('Expected accuracy', deg, '% of span', 3), R('Expected error', deg / 100 * span, '± ' + v.u, 'auto', null, true)], verdict: td > v.tdl ? { s: 'warn', t: 'Turndown above the rated limit – accuracy degrades roughly in proportion (check the datasheet formula).' } : { s: 'ok', t: 'Within rated turndown.' } };
        }
      },
      {
        id: 'budget', icon: '🧮', title: 'Loop accuracy budget (RSS)', desc: 'Combine independent error sources (sensor, transmitter, barrier, input card, temperature effect) into a total loop accuracy.',
        formula: 'Total (probable) = √(Σ eᵢ²)     worst case = Σ|eᵢ|',
        inputs: [{ k: 'span', l: 'Span', v: 16 }, { k: 'u', t: 'text', l: 'Unit', v: 'bar' }, { k: 'tbl', t: 'table', l: 'Error sources (± % of span)', v: [{ n: 'Transmitter reference accuracy', e: 0.075 }, { n: 'Ambient temperature effect', e: 0.15 }, { n: 'Isolator / barrier', e: 0.1 }, { n: 'PLC / DCS analogue input', e: 0.1 }], cols: [{ k: 'n', l: 'Source', t: 'text', d: '', w: 220 }, { k: 'e', l: '± % span', t: 'num', d: 0 }] }],
        run: v => { const rss = Math.sqrt(v.tbl.reduce((s, r) => s + r.e * r.e, 0)), wc = v.tbl.reduce((s, r) => s + Math.abs(r.e), 0); return { results: [R('Probable total (RSS)', rss, '% of span', 3, null, true), R('Probable total', rss / 100 * v.span, '± ' + v.u, 'auto'), R('Worst case (sum)', wc, '% of span', 3), R('Worst case', wc / 100 * v.span, '± ' + v.u, 'auto')] }; }
      }
    ]
  });
})();
