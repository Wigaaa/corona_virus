(function () {
  const { R, lvl, S3, esc } = ETO;
  const RAD = Math.PI / 180, D = 180 / Math.PI;
  const IRMIN = { kv1: ['Older / general windings: kV + 1 MΩ', kv => kv + 1], form: ['Form-wound (post-1970): 100 MΩ', () => 100], rand: ['Random-wound & LV: 5 MΩ', () => 5], cable: ['Cables / ship circuits: 1 MΩ', () => 1] };
  ETO.page({
    title: 'Testing & Commissioning', icon: '🔬', accent: '#0369a1',
    subtitle: 'Turn field readings into verdicts: winding balance, insulation, earth electrodes, loop impedance, RCDs, turns ratio, contact resistance, batteries and phase unbalance.',
    refs: ['IEEE 43', 'IEC 60364-6', 'IEC 60034-1', 'IEEE C57.12.00', 'IEC 60076-1'],
    calcs: [
      {
        id: 'wres', icon: '🔁', title: 'Winding resistance balance', desc: 'Three line-to-line readings of a motor, generator or transformer winding, corrected to a reference temperature.',
        formula: 'R_ref = R_meas × (K + T_ref)/(K + T_meas)   (K = 234.5 Cu, 225 Al)     imbalance = max|R − R_avg| / R_avg',
        inputs: [{ k: 'a', l: 'R L1-L2', u: 'Ω', v: 0.412, min: 0.000001 }, { k: 'b', l: 'R L2-L3', u: 'Ω', v: 0.409, min: 0.000001 }, { k: 'c', l: 'R L3-L1', u: 'Ω', v: 0.418, min: 0.000001 }, { k: 't', l: 'Winding temperature at test', u: '°C', v: 28 }, { k: 'tr', l: 'Reference temperature', opts: [[20, '20 °C'], [75, '75 °C (IEC report temp)']], v: 20 }, { k: 'k', l: 'Material', opts: [[234.5, 'Copper'], [225, 'Aluminium']], v: 234.5 }, { k: 'cn', l: 'Winding connection', opts: [['y', 'Star (R_phase = R_LL / 2)'], ['d', 'Delta (R_phase = 1.5 × R_LL)']], v: 'y' }, { k: 'lim', l: 'Allowed imbalance', u: '%', v: 2, min: 0.1 }],
        run: v => {
          const f = (v.k + +v.tr) / (v.k + v.t), r = [v.a, v.b, v.c].map(x => x * f), av = (r[0] + r[1] + r[2]) / 3, imb = Math.max(...r.map(x => Math.abs(x - av))) / av * 100, st = lvl(imb, v.lim, v.lim * 2);
          return { results: [R('Imbalance', imb, '%', 2, st, true), R('Average R_LL @ ref', av, 'Ω', 5), R('Per-phase R @ ref', v.cn === 'y' ? av / 2 : av * 1.5, 'Ω', 5), R('Correction factor', f, '', 4)],
            tables: [{ title: 'Corrected readings', head: ['Pair', 'Measured Ω', `@ ${v.tr} °C Ω`, 'Deviation %'], rows: ['L1-L2', 'L2-L3', 'L3-L1'].map((n, i) => [n, [v.a, v.b, v.c][i], r[i], (r[i] - av) / av * 100]) }],
            verdict: { s: st, t: st === 'ok' ? 'Windings balanced.' : 'Imbalance – check terminal tightness first, then suspect shorted turns or a high-resistance joint inside the winding.' }, notes: ['Use a 4-wire (Kelvin) micro-ohmmeter / DLRO. Compare with factory or previous values corrected to the same temperature.'] };
        }
      },
      {
        id: 'ir3', icon: '🧪', title: 'Three-phase insulation test (IR to earth)', desc: 'Each phase to earth, corrected to 40 °C, compared with IEEE 43 / ship minimums and with each other.',
        formula: 'IR₄₀ = IR_T × 0.5^((40 − T)/10)',
        inputs: [{ k: 'a', l: 'IR L1-E (1 min)', u: 'MΩ', v: 850, min: 0.001 }, { k: 'b', l: 'IR L2-E', u: 'MΩ', v: 920, min: 0.001 }, { k: 'c', l: 'IR L3-E', u: 'MΩ', v: 140, min: 0.001 }, { k: 't', l: 'Winding temperature', u: '°C', v: 30 }, { k: 'kv', l: 'Rated voltage', u: 'kV', v: 0.44, min: 0.01, step: 0.01 }, { k: 'ty', l: 'Equipment type', opts: Object.keys(IRMIN).map(k => [k, IRMIN[k][0]]), v: 'rand' }],
        run: v => {
          const f = Math.pow(0.5, (40 - v.t) / 10), r = [v.a, v.b, v.c].map(x => x * f), min = IRMIN[v.ty][1](v.kv), lo = Math.min(...r), ratio = Math.max(...r) / lo, st = lo < min ? 'bad' : lo < 10 * min || ratio > 3 ? 'warn' : 'ok';
          return { results: [R('Lowest IR @ 40 °C', lo, 'MΩ', 1, st, true), R('Minimum acceptable', min, 'MΩ', 1), R('Highest / lowest phase', ratio, '×', 2, ratio > 3 ? 'warn' : 'ok')],
            tables: [{ title: 'Corrected to 40 °C', head: ['Phase', 'Measured MΩ', 'IR₄₀ MΩ', 'Status'], rows: ['L1', 'L2', 'L3'].map((n, i) => [n, [v.a, v.b, v.c][i], r[i], r[i] < min ? '⛔' : r[i] < 10 * min ? '⚠️' : '✅']), states: r.map(x => (x < min ? 'bad' : x < 10 * min ? 'warn' : 'ok')) }],
            verdict: { s: st, t: st === 'bad' ? 'Below minimum – do not energise; locate (cable vs machine), dry out and retest.' : ratio > 3 ? 'One phase much lower than the others – localised moisture, contamination or damage on that phase.' : st === 'warn' ? 'Acceptable but low – trend and plan cleaning / drying.' : 'Insulation healthy.' } };
        }
      },
      {
        id: 'earthel', icon: '⛏️', title: 'Earth electrode – fall-of-potential (62 %)', desc: 'Validate a 3-pole earth test: readings with the potential spike at 52 %, 62 % and 72 % of the current-spike distance.',
        formula: 'R_E = average of the three readings; valid if each is within ±5 % of the mean',
        inputs: [{ k: 'a', l: 'R at 52 %', u: 'Ω', v: 4.6, min: 0 }, { k: 'b', l: 'R at 62 %', u: 'Ω', v: 4.8, min: 0 }, { k: 'c', l: 'R at 72 %', u: 'Ω', v: 5.0, min: 0 }, { k: 'tgt', l: 'Required maximum', u: 'Ω', v: 10, min: 0.01 }],
        run: v => {
          const m = (v.a + v.b + v.c) / 3; if (m <= 0) throw new Error('Enter readings');
          const dev = Math.max(...[v.a, v.b, v.c].map(x => Math.abs(x - m))) / m * 100, valid = dev <= 5, ok = m <= v.tgt;
          return { results: [R('Electrode resistance', m, 'Ω', 2, ok ? 'ok' : 'bad', true), R('Max deviation', dev, '%', 1, valid ? 'ok' : 'warn')], verdict: { s: !valid ? 'warn' : ok ? 'ok' : 'bad', t: !valid ? 'Readings not within ±5 % – current spike too close (overlapping resistance areas). Move spikes further out and repeat.' : ok ? 'Valid test, electrode within limit.' : 'Valid test but resistance too high – add electrodes / improve soil contact.' } };
        }
      },
      {
        id: 'loop', icon: '🔄', title: 'Measured loop impedance → fault currents', desc: 'From loop-tester readings: prospective earth-fault current (PEFC), prospective short-circuit current (PSCC) and disconnection check.',
        formula: 'PEFC = U0/Zs    PSCC = U0/Z_LN    Zs(measured) ≤ 0.8 × U0/Ia (temperature rule)',
        inputs: [{ k: 'u0', l: 'U0 (phase-earth)', u: 'V', v: 230, min: 1 }, { k: 'zs', l: 'Measured Zs (L-PE)', u: 'Ω', v: 0.42, min: 0.0001 }, { k: 'zn', l: 'Measured Z (L-N)', u: 'Ω', v: 0.25, min: 0.0001 }, { k: 'ia', l: 'Device current for disconnection (Ia)', u: 'A', v: 320, min: 0.01, hint: 'e.g. 5 × In for type B MCB, 10 × In type C' }, { k: 'icn', l: 'Device breaking capacity', u: 'kA', v: 6, min: 0.1 }],
        run: v => {
          const pefc = v.u0 / v.zs, pscc = v.u0 / v.zn, zmax = v.u0 / v.ia, ok = v.zs <= 0.8 * zmax, bc = Math.max(pefc, 2 * pscc) / 1000 <= v.icn;
          return { results: [R('PEFC', pefc / 1000, 'kA', 3), R('PSCC (single-phase)', pscc / 1000, 'kA', 3), R('PSCC 3-phase (≈ 2 × 1-ph)', 2 * pscc / 1000, 'kA', 3, bc ? 'ok' : 'bad'), R('Max Zs (corrected ×0.8)', 0.8 * zmax, 'Ω', 3), R('Disconnection', ok ? 'PASS' : 'FAIL', '', 0, ok ? 'ok' : 'bad', true)], verdict: { s: ok && bc ? 'ok' : 'bad', t: !ok ? 'Loop impedance too high – device will not disconnect in time. Check PE continuity / joints or use RCD.' : !bc ? 'Fault current exceeds device breaking capacity.' : 'Disconnection time and breaking capacity satisfied.' } };
        }
      },
      {
        id: 'rcd', icon: '🧯', title: 'RCD trip-time test', desc: 'Check RCD test-instrument results against IEC 61008/61009 limits.',
        formula: 'General: ½IΔn no trip, 1×IΔn ≤ 300 ms, 5×IΔn ≤ 40 ms     Type S: 1× 130–500 ms, 5× 50–150 ms',
        inputs: [{ k: 'ty', l: 'RCD type', opts: [['g', 'General (instantaneous)'], ['s', 'Selective / time-delayed (S)']], v: 'g' }, { k: 'idn', l: 'IΔn', u: 'mA', v: 30, min: 1 }, { k: 'h', l: 'At ½ × IΔn', opts: [['no', 'Did NOT trip'], ['yes', 'Tripped']], v: 'no' }, { k: 't1', l: 'Trip time at 1 × IΔn', u: 'ms', v: 24, min: 0 }, { k: 't5', l: 'Trip time at 5 × IΔn', u: 'ms', v: 12, min: 0 }],
        run: v => {
          const g = v.ty === 'g', c0 = v.h === 'no', c1 = g ? v.t1 <= 300 : v.t1 >= 130 && v.t1 <= 500, c5 = g ? v.t5 <= 40 : v.t5 >= 50 && v.t5 <= 150, ok = c0 && c1 && c5;
          return { results: [R('½ IΔn (no-trip)', c0 ? 'PASS' : 'FAIL', '', 0, c0 ? 'ok' : 'bad'), R('1 × IΔn', v.t1 + ' ms', '', 0, c1 ? 'ok' : 'bad'), R('5 × IΔn', v.t5 + ' ms', '', 0, c5 ? 'ok' : 'bad')], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'RCD performance satisfactory.' : !c0 ? 'Trips at half rated current – too sensitive or standing leakage on the circuit.' : 'Trip time outside limits – replace RCD.' }, notes: ['Also press the RCD test button (proves mechanism, not sensitivity).'] };
        }
      },
      {
        id: 'ttr', icon: '🧲', title: 'Transformer turns-ratio (TTR) test', desc: 'Compare measured ratios per phase with the nameplate ratio. IEEE C57.12.00 / IEC 60076-1 tolerance ±0.5 %.',
        formula: 'Expected (phase-pair) ratio: Dd/Yy = V1/V2,  Dy = √3·V1/V2,  Yd = V1/(√3·V2)   deviation = (meas − exp)/exp',
        inputs: [{ k: 'v1', l: 'HV rated (at tap used)', u: 'V', v: 690, min: 1 }, { k: 'v2', l: 'LV rated', u: 'V', v: 440, min: 1 }, { k: 'vg', l: 'Vector group family', opts: [['dd', 'Dd / Yy'], ['dy', 'Dy (e.g. Dyn11) – ratio of HV winding to LV phase'], ['yd', 'Yd (e.g. YNd1)']], v: 'dd' }, { k: 'a', l: 'Measured ratio phase A', v: 1.5681, min: 0.001 }, { k: 'b', l: 'Measured ratio phase B', v: 1.5690, min: 0.001 }, { k: 'c', l: 'Measured ratio phase C', v: 1.5672, min: 0.001 }, { k: 'tol', l: 'Tolerance', u: '±%', v: 0.5, min: 0.01 }],
        run: v => {
          const exp = { dd: v.v1 / v.v2, dy: S3 * v.v1 / v.v2, yd: v.v1 / (S3 * v.v2) }[v.vg], dev = [v.a, v.b, v.c].map(x => (x - exp) / exp * 100), w = Math.max(...dev.map(Math.abs)), st = w <= v.tol ? 'ok' : 'bad';
          return { results: [R('Expected ratio', exp, '', 4, null, true), R('Worst deviation', w, '%', 3, st)], tables: [{ title: 'Per phase', head: ['Phase', 'Measured', 'Deviation %'], rows: ['A', 'B', 'C'].map((n, i) => [n, [v.a, v.b, v.c][i].toFixed(4), dev[i].toFixed(3)]), states: dev.map(d => (Math.abs(d) <= v.tol ? 'ok' : 'bad')) }], verdict: { s: st, t: st === 'ok' ? 'Turns ratio within tolerance.' : 'Ratio error – check tap position first; then suspect shorted turns or open winding in the deviating phase.' } };
        }
      },
      {
        id: 'ductor', icon: '🔩', title: 'Breaker / contactor contact resistance', desc: 'Micro-ohm (ductor) readings per pole against the maker limit and against each other.',
        formula: 'Pass if R ≤ maker maximum and poles within ±50 % of their mean (typical guidance)',
        inputs: [{ k: 'a', l: 'Pole L1', u: 'µΩ', v: 42, min: 0 }, { k: 'b', l: 'Pole L2', u: 'µΩ', v: 45, min: 0 }, { k: 'c', l: 'Pole L3', u: 'µΩ', v: 71, min: 0 }, { k: 'mx', l: 'Maker maximum', u: 'µΩ', v: 80, min: 0.1 }, { k: 'i', l: 'Test current', u: 'A', v: 100, min: 1 }],
        run: v => {
          const r = [v.a, v.b, v.c], m = (r[0] + r[1] + r[2]) / 3; if (m <= 0) throw new Error('Enter readings');
          const st = r.map(x => (x > v.mx ? 'bad' : Math.abs(x - m) / m > 0.5 ? 'warn' : 'ok')), wst = st.includes('bad') ? 'bad' : st.includes('warn') ? 'warn' : 'ok';
          return { results: [R('Highest pole', Math.max(...r), 'µΩ', 1, wst, true), R('Average', m, 'µΩ', 1), R('Heat in worst pole at rated test current', Math.max(...r) * 1e-6 * v.i ** 2, 'W', 2)], tables: [{ title: 'Poles', head: ['Pole', 'µΩ', 'vs mean %'], rows: ['L1', 'L2', 'L3'].map((n, i) => [n, r[i], (r[i] - m) / m * 100]), states: st }], verdict: { s: wst, t: wst === 'ok' ? 'Contacts healthy.' : wst === 'warn' ? 'One pole noticeably higher – inspect / clean / re-test.' : 'Above maker limit – contacts worn or contaminated; service or replace.' }, notes: ['Test with ≥ 100 A DC for breakers (IEC 62271-1 recommends 50 A to rated current) to break through films.'] };
        }
      },
      {
        id: 'battir', icon: '🔋', title: 'Battery internal resistance / conductance', desc: 'Compare each block with its baseline (commissioning or maker reference).',
        formula: 'Δ% = (R_meas − R_base)/R_base × 100   (conductance: use −Δ)',
        inputs: [{ k: 'base', l: 'Baseline resistance per block', u: 'mΩ', v: 4.2, min: 0.001 }, { k: 'tbl', t: 'table', l: 'Blocks', v: [{ n: 'B1', r: 4.4 }, { n: 'B2', r: 4.3 }, { n: 'B3', r: 5.6 }, { n: 'B4', r: 4.5 }, { n: 'B5', r: 6.9 }, { n: 'B6', r: 4.4 }], cols: [{ k: 'n', l: 'Block', t: 'text', d: 'B' }, { k: 'r', l: 'R mΩ', t: 'num', d: 0 }] }],
        run: v => {
          const rows = v.tbl.map(b => { const d = (b.r - v.base) / v.base * 100; return [esc(b.n), b.r, d, d > 50 ? '⛔ replace' : d > 25 ? '⚠️ investigate' : '✅']; });
          const bad = rows.filter(r => r[2] > 50).length, warn = rows.filter(r => r[2] > 25 && r[2] <= 50).length;
          return { results: [R('Blocks to replace (> +50 %)', bad, '', 0, bad ? 'bad' : 'ok', true), R('Blocks to investigate (+25…50 %)', warn, '', 0, warn ? 'warn' : 'ok')], tables: [{ title: 'Blocks', head: ['Block', 'mΩ', 'Δ vs baseline %', 'Action'], rows, states: rows.map(r => (r[2] > 50 ? 'bad' : r[2] > 25 ? 'warn' : 'ok')) }], notes: ['Thresholds are typical manufacturer / IEEE 1188 practice – use your battery maker\'s values. Measure at similar temperature and state of charge.'] };
        }
      },
      {
        id: 'symc', icon: '🧭', title: 'Symmetrical components / negative sequence', desc: 'Positive, negative and zero-sequence values from three phasors (voltages or currents). The IEC voltage unbalance factor is V2/V1.',
        formula: 'V1 = (Va + aVb + a²Vc)/3   V2 = (Va + a²Vb + aVc)/3   V0 = (Va + Vb + Vc)/3   a = 1∠120°',
        inputs: [{ k: 'ma', l: 'Phase A magnitude', v: 254, min: 0 }, { k: 'aa', l: 'Phase A angle', u: '°', v: 0 }, { k: 'mb', l: 'Phase B magnitude', v: 250, min: 0 }, { k: 'ab', l: 'Phase B angle', u: '°', v: -121 }, { k: 'mc', l: 'Phase C magnitude', v: 246, min: 0 }, { k: 'ac', l: 'Phase C angle', u: '°', v: 119 }],
        run: v => {
          const P = (m, a) => [m * Math.cos(a * RAD), m * Math.sin(a * RAD)], add = (x, y) => [x[0] + y[0], x[1] + y[1]], rot = (x, d) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [x[0] * c - x[1] * s, x[0] * s + x[1] * c]; };
          const A = P(v.ma, v.aa), B = P(v.mb, v.ab), C = P(v.mc, v.ac), mag = z => Math.hypot(z[0], z[1]) / 3;
          const v1 = mag(add(add(A, rot(B, 120)), rot(C, 240))), v2 = mag(add(add(A, rot(B, 240)), rot(C, 120))), v0 = mag(add(add(A, B), C)), uf = v1 ? v2 / v1 * 100 : 0;
          return { results: [R('Positive sequence', v1, '', 3), R('Negative sequence', v2, '', 3), R('Zero sequence', v0, '', 3), R('Unbalance factor V2/V1', uf, '%', 2, lvl(uf, 1, 2), true)], verdict: { s: lvl(uf, 1, 2), t: uf <= 1 ? 'Negligible negative sequence.' : uf <= 2 ? 'Moderate – motors run hotter (negative-sequence heating).' : 'High negative sequence – check supply / single-phase loads / open phase; motor negative-sequence protection may trip.' }, notes: ['Zero-sequence current = neutral / residual earth current ÷ 3.'] };
        }
      },
      {
        id: 'hipot', icon: '⚡', title: 'Winding withstand (hi-pot) test voltage', desc: 'Test voltage for a rotating-machine winding (IEC 60034-1, Table 16 basis). Hi-pot is a stress test – only per maker / repair-shop procedure.',
        formula: 'New winding: U_test = 1000 V + 2·U_N (AC, 1 min, min 1500 V)   repeat test: 80 %   DC ≈ 1.7 × AC',
        inputs: [{ k: 'u', l: 'Rated voltage U_N', u: 'V', v: 440, min: 1 }],
        run: v => { const ac = Math.max(1500, 1000 + 2 * v.u); return { results: [R('AC test (new winding)', ac, 'V rms', 0, null, true), R('AC repeat test (80 %)', 0.8 * ac, 'V rms', 0), R('DC equivalent (≈ 1.7 × AC)', 1.7 * ac, 'V DC', 0), R('Routine IR test voltage (IEEE 43)', v.u < 1000 ? 500 : v.u <= 2500 ? 1000 : v.u <= 5000 ? 2500 : 5000, 'V DC', 0)], notes: ['On board, routine checks are IR / PI only. Hi-pot of service-aged windings can cause failure – reserved for repair shops and commissioning.'] }; }
      }
    ]
  });
})();
