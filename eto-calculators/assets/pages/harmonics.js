(function () {
  const { R, lvl, S3, esc } = ETO;
  const SPEC = {
    p6: ['6-pulse, no reactor', { 5: 35, 7: 20, 11: 9, 13: 6, 17: 4, 19: 3, 23: 2, 25: 1.5 }],
    p6r: ['6-pulse with 3–5% reactor', { 5: 30, 7: 12, 11: 7, 13: 5, 17: 3, 19: 2, 23: 1.5, 25: 1 }],
    p12: ['12-pulse', { 11: 9, 13: 6, 23: 2, 25: 1.5, 35: 1, 37: 1 }],
    p18: ['18-pulse', { 17: 5, 19: 4, 35: 1.5, 37: 1 }],
    afe: ['Active front end', { 5: 3, 7: 2, 11: 1.5, 13: 1 }]
  };
  const TDD = [[20, 5, 'Isc/IL < 20'], [50, 8, '20 – 50'], [100, 12, '50 – 100'], [1000, 15, '100 – 1000'], [1e9, 20, '> 1000']];
  ETO.page({
    title: 'Harmonics / THD', icon: '〰️', accent: '#0d9488',
    subtitle: 'VFD-rich power plants: quantify THD, resonance, filter tuning, K-factor / derating and the effect on generators.',
    refs: ['IACS UR E24', 'IEEE 519-2022', 'IEC 61000-2-4', 'IEEE C57.110', 'IEC 60092-301'],
    calcs: [
      {
        id: 'thdi', icon: '📊', title: 'THD-I, K-factor & TDD', desc: 'Total harmonic distortion of current from individual harmonic magnitudes.',
        formula: 'THD = √(ΣIh²) / I1 × 100    K = Σ(Ih²h²)/ΣIh²    I_rms = I1√(1 + THD²)',
        inputs: [
          { k: 'i1', l: 'Fundamental current I1', u: 'A', v: 200, min: 0.001 }, { k: 'ratio', l: 'Isc / IL at PCC (for TDD limit)', v: 30, min: 1 },
          { k: 'tbl', t: 'table', l: 'Harmonics (% of fundamental)', v: Object.entries(SPEC.p6[1]).map(([h, m]) => ({ h: +h, m })), cols: [{ k: 'h', l: 'Order h', t: 'num', d: 5, w: 60 }, { k: 'm', l: 'Magnitude %', t: 'num', d: 0, w: 80 }] }
        ],
        run: v => {
          let sq = 0, kh = 0; let mx = [0, 0];
          v.tbl.forEach(r => { const f = r.m / 100; sq += f * f; kh += f * f * r.h * r.h; if (r.m > mx[1]) mx = [r.h, r.m]; });
          const thd = Math.sqrt(sq) * 100, k = (1 + kh) / (1 + sq), lim = TDD.find(x => v.ratio < x[0]), st = lvl(thd, lim[1], lim[1] * 1.5);
          return { results: [R('THD-I', thd, '%', 1, st, true), R('RMS current', v.i1 * Math.sqrt(1 + sq), 'A', 1), R('K-factor', k, '', 1), R('Dominant harmonic', 'h' + mx[0] + ' = ' + mx[1] + '%', ''), R('IEEE 519 TDD limit', lim[1], '%', 0)],
            verdict: { s: st, t: `IEEE 519 TDD limit for Isc/IL ${lim[2]} is ${lim[1]}% (general systems). THD-I ${thd.toFixed(1)}%.` }, notes: ['On ships, the generator voltage distortion (THD-V) is the governing criterion – see the THD-V and generator tabs.'] };
        }
      },
      {
        id: 'thdv', icon: '📈', title: 'THD-V evaluation', desc: 'Compare voltage THD with class / IEEE limits.',
        formula: 'THD-V = √(ΣVh²) / V1 × 100',
        inputs: [
          { k: 'lim', l: 'Limit set', opts: [['8', 'IACS UR E24: THD-V ≤ 8%, single ≤ 5%'], ['5', 'IEEE 519 (≤ 1 kV): THD-V ≤ 5%'], ['10', 'IEC 61000-2-4 class 3: 10%']], v: '8' },
          { k: 'tbl', t: 'table', l: 'Measured voltage harmonics (% of fundamental)', v: [{ h: 5, m: 3.2 }, { h: 7, m: 2.1 }, { h: 11, m: 1.2 }, { h: 13, m: 0.8 }], cols: [{ k: 'h', l: 'Order h', t: 'num', d: 5, w: 60 }, { k: 'm', l: '% of V1', t: 'num', d: 0, w: 80 }] }
        ],
        run: v => {
          let sq = 0, mx = 0; v.tbl.forEach(r => { sq += r.m * r.m; mx = Math.max(mx, r.m); });
          const thd = Math.sqrt(sq), lim = +v.lim, st = lvl(thd, lim * 0.8, lim), sing = lim === 8 ? 5 : lim === 5 ? 3 : 7, st2 = mx <= sing ? 'ok' : 'bad';
          return { results: [R('THD-V', thd, '%', 2, st, true), R('Largest single harmonic', mx, '%', 2, st2), R('Limit (THD / single)', lim + ' / ' + sing, '%'), R('Margin', lim - thd, '%', 2)], verdict: { s: st === 'bad' || st2 === 'bad' ? 'bad' : st, t: st === 'ok' && st2 === 'ok' ? 'Voltage quality acceptable.' : 'Distortion beyond limits – check filters, number of VFDs online, generator Xd″, and capacitor banks.' } };
        }
      },
      {
        id: 'pulse', icon: '🔢', title: 'Harmonic orders by pulse number', desc: 'Characteristic harmonics produced by rectifiers of different pulse count.',
        formula: 'h = k × p ± 1   (k = 1, 2, 3…)',
        inputs: [{ k: 'p', l: 'Pulse number', opts: [[6, '6'], [12, '12'], [18, '18'], [24, '24']], v: 6 }],
        run: v => {
          const rows = []; for (let k = 1; k <= 4; k++) rows.push([k, k * v.p - 1, k * v.p + 1, (100 / (k * v.p - 1)).toFixed(1) + ' / ' + (100 / (k * v.p + 1)).toFixed(1) + ' %']);
          return { results: [R('Lowest harmonics', `${v.p - 1}, ${v.p + 1}`, ''), R('Ideal THD-I', Math.sqrt(1 / (v.p - 1) ** 2 + 1 / (v.p + 1) ** 2 + 1 / (2 * v.p - 1) ** 2 + 1 / (2 * v.p + 1) ** 2) * 100, '%', 0)], tables: [{ title: 'Orders', head: ['k', 'h = kp − 1', 'h = kp + 1', 'Ideal 1/h'], rows }], notes: ['12-pulse eliminates 5th/7th with phase-shifted transformer; 18/24-pulse also removes 11th/13th.'] };
        }
      },
      {
        id: 'res', icon: '📡', title: 'Harmonic resonance order', desc: 'Where will a capacitor bank resonate with the system?',
        formula: 'h_res = √(S_sc / Q_c)     S_sc = S_tr / uk  (or generator S/X″d)',
        inputs: [{ k: 's', l: 'Source rating (transformer / DGs)', u: 'kVA', v: 2500, min: 1 }, { k: 'z', l: 'Source impedance (uk or X″d)', u: '%', v: 15, min: 0.5 }, { k: 'qc', l: 'Capacitor bank / filter capacitance', u: 'kVAR', v: 150, min: 0.1 }],
        run: v => {
          const ssc = v.s / (v.z / 100), h = Math.sqrt(ssc / v.qc), near = [5, 7, 11, 13].reduce((a, b) => Math.abs(b - h) < Math.abs(a - h) ? b : a), d = Math.abs(h - near), st = d < 0.5 ? 'bad' : d < 1 ? 'warn' : 'ok';
          return { results: [R('Resonance order', h, '', 2, st, true), R('Resonance frequency', h * 60, 'Hz', 0), R('Nearest harmonic', near, '', 0), R('Distance', d, '', 2, st), R('System Ssc', ssc / 1000, 'MVA', 2)], verdict: { s: st, t: st === 'ok' ? 'Resonance is clear of the characteristic harmonics.' : 'Resonance close to a characteristic harmonic – capacitor/amplification risk. Use detuned (reactor) capacitors or remove the bank.' } };
        }
      },
      {
        id: 'filt', icon: '🔧', title: 'Detuned reactor / passive filter', desc: 'Reactor percentage, tuning order and capacitor voltage rating.',
        formula: 'h_tune = 1/√(p%)     Vc = V / (1 − p%)     Q_reactor = p × Q_c',
        inputs: [{ k: 'p', l: 'Reactor ratio p', opts: [[5.67, '5.67% (tuned 4.2)'], [7, '7% (tuned 3.78)'], [14, '14% (tuned 2.67)'], [3, '3% (tuned 5.8)']], v: 7 }, { k: 'qc', l: 'Capacitor kVAR required', u: 'kVAR', v: 100, min: 1 }, { k: 'v', l: 'System voltage', u: 'V', v: 440, min: 1 }],
        run: v => {
          const p = v.p / 100, ht = 1 / Math.sqrt(p), vc = v.v / (1 - p);
          return { results: [R('Tuned order', ht, '', 2, null, true), R('Tuned frequency (60 Hz)', ht * 60, 'Hz', 0), R('Capacitor rated voltage ≥', vc, 'V', 0), R('Reactor rating', p * v.qc, 'kVAR', 1), R('Net kVAR delivered', v.qc / (1 - p), 'kVAR', 1)], notes: ['7% reactors tuned at 3.78 avoid amplification of 5th/7th; 5.67% (4.2) is a tighter filter. Use capacitors rated ≥ 525 V on 440 V systems.'] };
        }
      },
      {
        id: 'kf', icon: '🧲', title: 'Transformer derating for harmonics', desc: 'Maximum permissible load on a standard transformer carrying non-linear current (IEEE C57.110).',
        formula: 'I_max(pu) = √((1 + Pec) / (1 + K × Pec))',
        inputs: [{ k: 'k', l: 'Load K-factor', v: 13, min: 1 }, { k: 'pec', l: 'Eddy-current loss at rated (Pec-R)', u: '%', v: 8, min: 0.1, hint: 'Dry type ≈ 5–12%; oil ≈ 1–5%' }, { k: 's', l: 'Transformer rating', u: 'kVA', v: 1000, min: 1 }],
        run: v => {
          const pec = v.pec / 100, d = Math.sqrt((1 + pec) / (1 + v.k * pec));
          return { results: [R('Derating factor', d, 'pu', 3, d >= 0.9 ? 'ok' : d >= 0.8 ? 'warn' : 'bad', true), R('Usable kVA', v.s * d, 'kVA', 0), R('Equivalent K-rated transformer', v.k <= 4 ? 'K-4' : v.k <= 9 ? 'K-9' : v.k <= 13 ? 'K-13' : 'K-20', '')], notes: ['For 6-pulse VFD load, K ≈ 9–13. Use a K-rated or oversized transformer / 12-pulse supply.'] };
        }
      },
      {
        id: 'gen', icon: '🛢️', title: 'VFD effect on generator voltage THD', desc: 'Estimate voltage distortion at the generator terminals from a non-linear load.',
        formula: 'Vh = h × X″d × (S_nl/S_gen) × Ih%    THD-V = √ΣVh²',
        inputs: [
          { k: 'sg', l: 'Generators online', u: 'kVA', v: 2500, min: 1 }, { k: 'x', l: 'Generator X″d', u: 'pu', v: 0.15, min: 0.01, step: 0.01 }, { k: 'snl', l: 'Non-linear load (VFD input kVA)', u: 'kVA', v: 1200, min: 0 },
          { k: 'sp', l: 'Drive type', opts: Object.keys(SPEC).map(k => [k, SPEC[k][0]]), v: 'p6r' }
        ],
        run: v => {
          const fr = v.snl / v.sg; let sq = 0; const rows = [];
          Object.entries(SPEC[v.sp][1]).forEach(([h, m]) => { const vh = h * v.x * fr * m; sq += vh * vh; rows.push([h, m + ' %', vh]); });
          const thd = Math.sqrt(sq), st = lvl(thd, 5, 8);
          return { results: [R('Estimated THD-V', thd, '%', 1, st, true), R('Non-linear share of DG capacity', fr * 100, '%', 0, fr > 0.5 ? 'warn' : null), R('Typical class limit', 8, '%', 0)], tables: [{ title: 'Contribution by harmonic (% voltage)', head: ['h', 'Drive current', 'Vh %'], rows }],
            verdict: { s: st, t: st === 'ok' ? 'THD-V is low.' : st === 'warn' ? 'THD-V approaching class limit – consider filters / 12-pulse / AFE or more DGs online.' : 'THD-V above 8% – fix before operating this configuration.' }, notes: ['Screening estimate: the real value depends on the system impedance, filters and cable capacitance. Verify by measurement with a power-quality analyser.'] };
        }
      }
    ]
  });
})();
