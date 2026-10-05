(function () {
  const { R, lvl, S3 } = ETO;
  const deg = x => x * 180 / Math.PI;
  ETO.page({
    title: 'Power Factor Calculations', icon: '📐', accent: '#db2777',
    subtitle: 'kW, kVAR, kVA and power factor – correction, measurement and combined loads.',
    refs: ['IEC 60831', 'IEC 60092-301'],
    calcs: [
      {
        id: 'tri', icon: '📐', title: 'Power triangle', desc: 'Enter any two quantities to get the rest.',
        formula: 'S² = P² + Q²    PF = P/S    Q = P·tanφ',
        inputs: [
          { k: 'm', l: 'Known values', opts: [['kwpf', 'kW + PF'], ['kwkvar', 'kW + kVAR'], ['kwkva', 'kW + kVA'], ['kvapf', 'kVA + PF'], ['kvakvar', 'kVA + kVAR']], v: 'kwpf' },
          { k: 'kw', l: 'Active power', u: 'kW', v: 400, min: 0, show: v => ['kwpf', 'kwkvar', 'kwkva'].includes(v.m) },
          { k: 'kva', l: 'Apparent power', u: 'kVA', v: 500, min: 0.001, show: v => ['kwkva', 'kvapf', 'kvakvar'].includes(v.m) },
          { k: 'kvar', l: 'Reactive power', u: 'kVAR', v: 300, min: 0, show: v => ['kwkvar', 'kvakvar'].includes(v.m) },
          { k: 'pf', l: 'Power factor', v: 0.8, min: 0.01, max: 1, step: 0.01, show: v => ['kwpf', 'kvapf'].includes(v.m) }
        ],
        run: v => {
          let p, q, s;
          switch (v.m) {
            case 'kwpf': p = v.kw; s = p / v.pf; q = Math.sqrt(s * s - p * p); break;
            case 'kwkvar': p = v.kw; q = v.kvar; s = Math.hypot(p, q); break;
            case 'kwkva': p = v.kw; s = v.kva; if (p > s) throw new Error('kW cannot exceed kVA'); q = Math.sqrt(s * s - p * p); break;
            case 'kvapf': s = v.kva; p = s * v.pf; q = Math.sqrt(s * s - p * p); break;
            default: s = v.kva; q = v.kvar; if (q > s) throw new Error('kVAR cannot exceed kVA'); p = Math.sqrt(s * s - q * q);
          }
          if (!(s > 0)) throw new Error('Enter non-zero power values');
          const pf = p / s;
          return { results: [R('Power factor', pf, '', 3, lvl(1 - pf, 0.15, 0.25), true), R('Active power P', p, 'kW'), R('Reactive power Q', q, 'kVAR'), R('Apparent power S', s, 'kVA'), R('Angle φ', deg(Math.acos(pf)), '°', 1), R('tan φ', p > 0 ? q / p : 'n/a', '', 3)] };
        }
      },
      {
        id: 'pfc', icon: '🔧', title: 'PF correction capacitors', desc: 'Capacitor bank needed to raise power factor; gives kVAR, µF per phase and current reduction.',
        formula: 'Qc = P × (tanφ1 − tanφ2)    C(Δ) = Qc / (3·ω·V²)    C(Y) = Qc / (ω·V²)',
        inputs: [
          { k: 'p', l: 'Load', u: 'kW', v: 400, min: 0.01 },
          { k: 'pf1', l: 'Existing PF', v: 0.75, min: 0.1, max: 1, step: 0.01 },
          { k: 'pf2', l: 'Target PF', v: 0.95, min: 0.1, max: 1, step: 0.01 },
          { k: 'v', l: 'Line voltage', u: 'V', v: 440, min: 1 },
          { k: 'f', l: 'Frequency', u: 'Hz', v: 60, min: 1 }
        ],
        run: v => {
          const t1 = Math.tan(Math.acos(v.pf1)), t2 = Math.tan(Math.acos(v.pf2)), qc = v.p * (t1 - t2), w = 2 * Math.PI * v.f;
          const s1 = v.p / v.pf1, s2 = v.p / v.pf2;
          return { results: [R('Capacitor bank', qc, 'kVAR', 1, qc < 0 ? 'warn' : null, true), R('C per phase (delta)', qc * 1000 / (3 * w * v.v * v.v) * 1e6, 'µF', 1), R('C per phase (star)', qc * 1000 / (w * v.v * v.v) * 1e6, 'µF', 1),
            R('Capacitor line current', qc * 1000 / (S3 * v.v), 'A'), R('Current before', s1 * 1000 / (S3 * v.v), 'A'), R('Current after', s2 * 1000 / (S3 * v.v), 'A'), R('kVA saved', s1 - s2, 'kVA')],
            verdict: qc < 0 ? { s: 'warn', t: 'Target PF is lower than existing PF – no correction needed.' } : { s: 'info', t: 'Choose the next standard bank/stage size. On vessels with VFDs and generators, use detuned reactors and avoid over-correction (leading PF can cause AVR instability).' } };
        }
      },
      {
        id: 'ww', icon: '🧮', title: 'Two-wattmeter method', desc: 'Total 3-phase power and PF from two wattmeter readings (balanced load).',
        formula: 'P = W1 + W2    Q = √3 (W1 − W2)    PF = cos(atan(Q/P))',
        inputs: [{ k: 'w1', l: 'Wattmeter W1', u: 'kW', v: 250 }, { k: 'w2', l: 'Wattmeter W2', u: 'kW', v: 120 }],
        run: v => {
          const p = v.w1 + v.w2, q = S3 * (v.w1 - v.w2), pf = Math.cos(Math.atan2(q, p));
          return { results: [R('Total power P', p, 'kW', 2, null, true), R('Reactive power Q', q, 'kVAR'), R('Apparent power S', Math.hypot(p, q), 'kVA'), R('Power factor', pf, '', 3), R('Angle φ', deg(Math.atan2(q, p)), '°', 1)],
            notes: ['If one wattmeter reads negative, enter it as negative (PF < 0.5).', 'Valid for balanced 3-wire loads.'] };
        }
      },
      {
        id: 'mix', icon: '🧩', title: 'Combined PF of several loads', desc: 'Add loads with different power factors to find total kW, kVAR, kVA and overall PF.',
        formula: 'ΣP, ΣQ  →  S = √(ΣP² + ΣQ²)   PF = ΣP / S',
        inputs: [{ k: 'tbl', t: 'table', l: 'Loads (lagging PF)', v: [{ n: 'Thruster 1', kw: 300, pf: 0.9 }, { n: 'Pumps', kw: 120, pf: 0.82 }, { n: 'Hotel', kw: 180, pf: 0.85 }, { n: 'Lighting', kw: 40, pf: 0.95 }],
          cols: [{ k: 'n', l: 'Load', t: 'text', d: 'Load' }, { k: 'kw', l: 'kW', t: 'num', d: 0 }, { k: 'pf', l: 'PF', t: 'num', d: 0.85 }] }],
        run: v => {
          let p = 0, q = 0;
          const rows = v.tbl.map(r => { const pf = Math.min(1, Math.max(0.01, r.pf)); const qq = r.kw * Math.tan(Math.acos(pf)); p += r.kw; q += qq; return [ETO.esc(r.n), r.kw, pf, qq, r.kw / pf]; });
          const s = Math.hypot(p, q);
          if (s <= 0) throw new Error('Enter at least one load');
          return { results: [R('Total kW', p, 'kW', 1), R('Total kVAR', q, 'kVAR', 1), R('Total kVA', s, 'kVA', 1), R('Overall PF', p / s, '', 3, null, true)],
            tables: [{ title: 'Breakdown', head: ['Load', 'kW', 'PF', 'kVAR', 'kVA'], rows }] };
        }
      },
      {
        id: 'eff', icon: '📉', title: 'Effect of PF on current & losses', desc: 'See how a poor PF increases current, cable losses and generator kVA.',
        formula: 'I = P / (√3·V·PF)    Cable loss ∝ I²',
        inputs: [
          { k: 'p', l: 'Load', u: 'kW', v: 300, min: 0.01 }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 },
          { k: 'a', l: 'Poor PF', v: 0.7, min: 0.1, max: 1, step: 0.01 }, { k: 'b', l: 'Good PF', v: 0.95, min: 0.1, max: 1, step: 0.01 }
        ],
        run: v => {
          const ia = v.p * 1000 / (S3 * v.v * v.a), ib = v.p * 1000 / (S3 * v.v * v.b);
          return { results: [R('Current at poor PF', ia, 'A'), R('Current at good PF', ib, 'A'), R('Current reduction', (1 - ib / ia) * 100, '%', 1), R('Cable loss reduction', (1 - (ib / ia) ** 2) * 100, '%', 1, 'ok', true), R('kVA at poor PF', v.p / v.a, 'kVA', 1), R('kVA at good PF', v.p / v.b, 'kVA', 1)] };
        }
      },
      {
        id: 'cos', icon: '📋', title: 'PF ↔ angle ↔ tanφ table', desc: 'Quick lookup and conversion.',
        formula: 'kVAR per kW = tanφ',
        inputs: [{ k: 'pf', l: 'Power factor', v: 0.8, min: 0.01, max: 1, step: 0.01 }],
        run: v => {
          const rows = [], steps = [0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
          steps.forEach(x => rows.push([x.toFixed(2), deg(Math.acos(x)), Math.tan(Math.acos(x)), (1 / x)]));
          return { results: [R('Angle', deg(Math.acos(v.pf)), '°', 2, null, true), R('tan φ (kVAR/kW)', Math.tan(Math.acos(v.pf)), '', 3), R('kVA per kW', 1 / v.pf, '', 3)],
            tables: [{ title: 'Lookup', head: ['PF', 'φ (°)', 'tanφ', 'kVA/kW'], rows }] };
        }
      }
    ]
  });
})();
