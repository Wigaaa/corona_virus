(function () {
  const { R, lvl, S3, esc } = ETO;
  const PI = Math.PI, D = 180 / PI;
  const sh = (...a) => v => a.includes(v.m);
  const COL = [['0', 'Black', 0, 1, null], ['1', 'Brown', 1, 10, 1], ['2', 'Red', 2, 100, 2], ['3', 'Orange', 3, 1e3, null], ['4', 'Yellow', 4, 1e4, null], ['5', 'Green', 5, 1e5, 0.5], ['6', 'Blue', 6, 1e6, 0.25], ['7', 'Violet', 7, 1e7, 0.1], ['8', 'Grey', 8, 1e8, 0.05], ['9', 'White', 9, 1e9, null], ['g', 'Gold', null, 0.1, 5], ['s', 'Silver', null, 0.01, 10]];
  const dig = [['0', 'Black 0'], ['1', 'Brown 1'], ['2', 'Red 2'], ['3', 'Orange 3'], ['4', 'Yellow 4'], ['5', 'Green 5'], ['6', 'Blue 6'], ['7', 'Violet 7'], ['8', 'Grey 8'], ['9', 'White 9']];
  const mul = COL.map(c => [c[0], c[1] + ' ×' + c[3]]);
  const tolo = [['tbr', 'Brown ±1%'], ['tre', 'Red ±2%'], ['tgr', 'Green ±0.5%'], ['tbl', 'Blue ±0.25%'], ['tvi', 'Violet ±0.1%'], ['tgo', 'Gold ±5%'], ['tsi', 'Silver ±10%']];
  const TOL = { tbr: 1, tre: 2, tgr: 0.5, tbl: 0.25, tvi: 0.1, tgo: 5, tsi: 10 };
  const ohm = x => (x >= 1e6 ? ETO.fmtAuto(x / 1e6) + ' MΩ' : x >= 1e3 ? ETO.fmtAuto(x / 1e3) + ' kΩ' : ETO.fmtAuto(x) + ' Ω');
  ETO.page({
    title: 'Circuit Theory Formulas', icon: '〰️', accent: '#d97706',
    subtitle: 'Ohm\'s law, series / parallel, dividers, time constants, RLC, star-delta, per-unit, line / phase and energy cost.',
    refs: ['Ohm / Kirchhoff', 'IEC 60027', 'IEC 60909 (per-unit)'],
    calcs: [
      {
        id: 'ohm', icon: '🎡', title: "Ohm's law & power wheel", desc: 'Give any two of V, I, R, P – get the other two.',
        formula: 'V = I·R    P = V·I = I²R = V²/R',
        inputs: [{ k: 'm', l: 'Known pair', opts: [['vi', 'Voltage + current'], ['vr', 'Voltage + resistance'], ['ir', 'Current + resistance'], ['vp', 'Voltage + power'], ['ip', 'Current + power'], ['rp', 'Resistance + power']], v: 'vi' },
          { k: 'v', l: 'Voltage', u: 'V', v: 230, min: 0.000001, show: sh('vi', 'vr', 'vp') }, { k: 'i', l: 'Current', u: 'A', v: 10, min: 0.000001, show: sh('vi', 'ir', 'ip') }, { k: 'r', l: 'Resistance', u: 'Ω', v: 23, min: 0.000001, show: sh('vr', 'ir', 'rp') }, { k: 'p', l: 'Power', u: 'W', v: 2300, min: 0.000001, show: sh('vp', 'ip', 'rp') }],
        run: v => {
          let V, I, Rr, P;
          switch (v.m) { case 'vi': V = v.v; I = v.i; Rr = V / I; P = V * I; break; case 'vr': V = v.v; Rr = v.r; I = V / Rr; P = V * V / Rr; break; case 'ir': I = v.i; Rr = v.r; V = I * Rr; P = I * I * Rr; break; case 'vp': V = v.v; P = v.p; I = P / V; Rr = V * V / P; break; case 'ip': I = v.i; P = v.p; V = P / I; Rr = P / (I * I); break; default: Rr = v.r; P = v.p; V = Math.sqrt(P * Rr); I = Math.sqrt(P / Rr); }
          return { results: [R('Voltage', V, 'V', 'auto', null, true), R('Current', I, 'A', 'auto', null, true), R('Resistance', Rr, 'Ω', 'auto', null, true), R('Power', P, 'W', 'auto', null, true), R('Conductance', 1 / Rr, 'S', 'auto')] };
        }
      },
      {
        id: 'ser', icon: '🔗', title: 'Series & parallel combinations (R, L, C)', desc: 'Equivalent of several resistors, inductors or capacitors.',
        formula: 'R, L: series ΣX, parallel 1/Σ(1/X)     C: series 1/Σ(1/C), parallel ΣC',
        inputs: [{ k: 't', l: 'Component', opts: [['r', 'Resistors / inductors (same rule)'], ['c', 'Capacitors']], v: 'r' }, { k: 'tbl', t: 'table', l: 'Values (all in the same unit)', v: [{ x: 100 }, { x: 220 }, { x: 470 }], cols: [{ k: 'x', l: 'Value', t: 'num', d: 100 }] }],
        run: v => {
          const a = v.tbl.map(r => r.x); if (a.length < 1 || a.some(x => x <= 0)) throw new Error('All values must be greater than zero');
          const sum = a.reduce((p, c) => p + c, 0), rec = 1 / a.reduce((p, c) => p + 1 / c, 0), isR = v.t === 'r';
          return { results: [R('Series equivalent', isR ? sum : rec, '', 'auto', null, true), R('Parallel equivalent', isR ? rec : sum, '', 'auto', null, true), R('Number of parts', a.length, '', 0)], notes: ['Inductors assume no mutual coupling. Parallel R is always smaller than the smallest resistor; series C is always smaller than the smallest capacitor.'] };
        }
      },
      {
        id: 'div', icon: '➗', title: 'Voltage divider (with optional load)', desc: 'Output voltage of a two-resistor divider.',
        formula: 'Vout = Vin·R2 / (R1 + R2)    with load: R2 → R2‖RL',
        inputs: [{ k: 'vin', l: 'Input voltage', u: 'V', v: 24, min: 0 }, { k: 'r1', l: 'R1 (top)', u: 'Ω', v: 10000, min: 0.001 }, { k: 'r2', l: 'R2 (bottom)', u: 'Ω', v: 4700, min: 0.001 }, { k: 'rl', l: 'Load RL (0 = none)', u: 'Ω', v: 0, min: 0 }],
        run: v => {
          const r2e = v.rl > 0 ? v.r2 * v.rl / (v.r2 + v.rl) : v.r2, vo = v.vin * r2e / (v.r1 + r2e), vu = v.vin * v.r2 / (v.r1 + v.r2), i = v.vin / (v.r1 + r2e);
          return { results: [R('Vout (loaded)', vo, 'V', 4, null, true), R('Vout (no load)', vu, 'V', 4), R('Loading error', vu ? (vo - vu) / vu * 100 : 0, '%', 2, vu && Math.abs((vo - vu) / vu) > 0.02 ? 'warn' : 'ok'), R('Divider current', i, 'A', 'auto'), R('Power in R1', i * i * v.r1, 'W', 'auto'), R('Total power', v.vin * i, 'W', 'auto')] };
        }
      },
      {
        id: 'rc', icon: '⏱️', title: 'RC / RL time constant', desc: 'Charging and decay of an RC or RL circuit.',
        formula: 'τ = R·C (RC)  or  L/R (RL)     charge: v = V(1 − e^(−t/τ))     decay: v = V·e^(−t/τ)',
        inputs: [{ k: 'm', l: 'Circuit', opts: [['rc', 'RC (capacitor)'], ['rl', 'RL (inductor)']], v: 'rc' }, { k: 'r', l: 'Resistance', u: 'Ω', v: 10000, min: 0.0001 }, { k: 'c', l: 'Capacitance', u: 'µF', v: 100, min: 0.0001, show: sh('rc') }, { k: 'l', l: 'Inductance', u: 'mH', v: 500, min: 0.0001, show: sh('rl') }, { k: 'vs', l: 'Source voltage / current', v: 24 }, { k: 't', l: 'Time t', u: 'ms', v: 1000, min: 0 }],
        run: v => {
          const tau = v.m === 'rc' ? v.r * v.c * 1e-6 : v.l * 1e-3 / v.r, t = v.t / 1000, up = 1 - Math.exp(-t / tau), dn = Math.exp(-t / tau);
          return { results: [R('Time constant τ', tau * 1000, 'ms', 'auto', null, true), R('Charge level at t', up * 100, '%', 2), R('Charging value at t', v.vs * up, '', 'auto'), R('Decayed value at t', v.vs * dn, '', 'auto'), R('Time to 63.2 % (1τ)', tau * 1000, 'ms', 'auto'), R('Time to 95 % (3τ)', 3 * tau * 1000, 'ms', 'auto'), R('Time to 99.3 % (5τ)', 5 * tau * 1000, 'ms', 'auto')], notes: ['After 5τ a circuit is considered fully charged / decayed. Capacitor discharge for safe working: wait ≥ 5τ.'] };
        }
      },
      {
        id: 'rlc', icon: '🎶', title: 'Series RLC – reactance, impedance, resonance', desc: 'Impedance at a frequency, phase angle, resonance and Q-factor.',
        formula: 'XL = 2πfL    XC = 1/(2πfC)    Z = √(R² + (XL − XC)²)    f₀ = 1/(2π√LC)    Q = (1/R)√(L/C)',
        inputs: [{ k: 'f', l: 'Frequency', u: 'Hz', v: 60, min: 0.001 }, { k: 'r', l: 'Resistance', u: 'Ω', v: 10, min: 0.000001 }, { k: 'l', l: 'Inductance', u: 'mH', v: 100, min: 0.000001 }, { k: 'c', l: 'Capacitance', u: 'µF', v: 50, min: 0.000001 }, { k: 'v', l: 'Applied voltage', u: 'V', v: 230, min: 0 }],
        run: v => {
          const w = 2 * PI * v.f, L = v.l * 1e-3, C = v.c * 1e-6, XL = w * L, XC = 1 / (w * C), X = XL - XC, Z = Math.hypot(v.r, X), f0 = 1 / (2 * PI * Math.sqrt(L * C)), Q = Math.sqrt(L / C) / v.r;
          return { results: [R('Inductive reactance XL', XL, 'Ω', 'auto'), R('Capacitive reactance XC', XC, 'Ω', 'auto'), R('Impedance Z', Z, 'Ω', 'auto', null, true), R('Phase angle', Math.atan2(X, v.r) * D, '°', 2), R('Power factor', v.r / Z, '', 4), R('Current', v.v / Z, 'A', 'auto'), R('Resonant frequency f₀', f0, 'Hz', 'auto', null, true), R('Q factor at resonance', Q, '', 3), R('Bandwidth f₀/Q', f0 / Q, 'Hz', 'auto')], verdict: { s: 'info', t: X > 0 ? 'Net inductive (current lags voltage).' : X < 0 ? 'Net capacitive (current leads voltage).' : 'At resonance – purely resistive.' } };
        }
      },
      {
        id: 'reactance', icon: '🌀', title: 'Reactance of an inductor or capacitor', desc: 'Reactance at a frequency and the frequency for a given reactance.',
        formula: 'XL = 2πfL    XC = 1/(2πfC)',
        inputs: [{ k: 'f', l: 'Frequency', u: 'Hz', v: 60, min: 0.001 }, { k: 'l', l: 'Inductance', u: 'mH', v: 10, min: 0.000001 }, { k: 'c', l: 'Capacitance', u: 'µF', v: 100, min: 0.000001 }],
        run: v => ({ results: [R('XL', 2 * PI * v.f * v.l * 1e-3, 'Ω', 'auto', null, true), R('XC', 1 / (2 * PI * v.f * v.c * 1e-6), 'Ω', 'auto', null, true), R('Capacitor kVAR at 440 V (3-ph, Δ)', 3 * (2 * PI * v.f * v.c * 1e-6) * 440 ** 2 / 1000, 'kVAR', 'auto'), R('Angular frequency ω', 2 * PI * v.f, 'rad/s', 'auto')] })
      },
      {
        id: 'ds', icon: '🔺', title: 'Star ↔ delta conversion', desc: 'Transform a three-terminal delta network to star (or reverse).',
        formula: 'Δ→Y: R_A = R_AB·R_CA/Σ  etc., Σ = R_AB+R_BC+R_CA     Y→Δ: R_AB = (R_AR_B+R_BR_C+R_CR_A)/R_C',
        inputs: [{ k: 'm', l: 'Convert', opts: [['dy', 'Delta → Star'], ['yd', 'Star → Delta']], v: 'dy' }, { k: 'x', l: 'R_AB (delta) / R_A (star)', u: 'Ω', v: 30, min: 0.000001 }, { k: 'y', l: 'R_BC (delta) / R_B (star)', u: 'Ω', v: 30, min: 0.000001 }, { k: 'z', l: 'R_CA (delta) / R_C (star)', u: 'Ω', v: 30, min: 0.000001 }],
        run: v => {
          if (v.m === 'dy') { const s = v.x + v.y + v.z; return { results: [R('R_A', v.x * v.z / s, 'Ω', 'auto', null, true), R('R_B', v.x * v.y / s, 'Ω', 'auto', null, true), R('R_C', v.y * v.z / s, 'Ω', 'auto', null, true)], notes: ['Equal delta resistors R → star resistors R/3.'] }; }
          const s = v.x * v.y + v.y * v.z + v.z * v.x; return { results: [R('R_AB', s / v.z, 'Ω', 'auto', null, true), R('R_BC', s / v.x, 'Ω', 'auto', null, true), R('R_CA', s / v.y, 'Ω', 'auto', null, true)], notes: ['Equal star resistors R → delta resistors 3R.'] };
        }
      },
      {
        id: 'lp', icon: '🔱', title: 'Line / phase quantities (star & delta)', desc: 'Relationship between line and phase voltage / current for 3-phase connections.',
        formula: 'Star: V_L = √3·V_ph, I_L = I_ph     Delta: V_L = V_ph, I_L = √3·I_ph     S = √3·V_L·I_L',
        inputs: [{ k: 'c', l: 'Connection', opts: [['y', 'Star (Y)'], ['d', 'Delta (Δ)']], v: 'y' }, { k: 'vl', l: 'Line voltage', u: 'V', v: 440, min: 1 }, { k: 'il', l: 'Line current', u: 'A', v: 100, min: 0 }, { k: 'pf', l: 'Power factor', v: 0.85, min: 0.05, max: 1, step: 0.01 }],
        run: v => {
          const vph = v.c === 'y' ? v.vl / S3 : v.vl, iph = v.c === 'y' ? v.il : v.il / S3, s = S3 * v.vl * v.il / 1000;
          return { results: [R('Phase voltage', vph, 'V', 2, null, true), R('Phase current', iph, 'A', 2, null, true), R('Apparent power', s, 'kVA', 2), R('Active power', s * v.pf, 'kW', 2), R('Reactive power', s * Math.sin(Math.acos(v.pf)), 'kVAR', 2), R('Power per phase', s / 3, 'kVA', 2)] };
        }
      },
      {
        id: 'pu', icon: '📏', title: 'Per-unit bases', desc: 'Base current and impedance for a system, and conversion of ohms ↔ per-unit.',
        formula: 'I_base = S_base/(√3·V_base)    Z_base = V_base²/S_base    Z_pu = Z_Ω/Z_base',
        inputs: [{ k: 's', l: 'Base power', u: 'kVA', v: 1000, min: 0.001 }, { k: 'v', l: 'Base voltage (line)', u: 'V', v: 440, min: 1 }, { k: 'z', l: 'Impedance (Ω)', u: 'Ω', v: 0.02, min: 0 }, { k: 'zp', l: 'Impedance (per-unit)', u: 'pu', v: 0.05, min: 0 }],
        run: v => {
          const ib = v.s * 1000 / (S3 * v.v), zb = v.v ** 2 / (v.s * 1000);
          return { results: [R('Base current', ib, 'A', 'auto'), R('Base impedance', zb, 'Ω', 'auto', null, true), R('Z (Ω) in per-unit', v.z / zb, 'pu', 'auto'), R('Z (Ω) in per cent', v.z / zb * 100, '%', 'auto'), R('Z (pu) in ohms', v.zp * zb, 'Ω', 'auto', null, true)] };
        }
      },
      {
        id: 'pubase', icon: '🔄', title: 'Change of base (impedance %)', desc: 'Re-express a machine / transformer impedance on a different MVA and voltage base.',
        formula: 'Z_new = Z_old × (S_new/S_old) × (V_old/V_new)²',
        inputs: [{ k: 'z', l: 'Impedance on old base', u: '%', v: 6, min: 0 }, { k: 'so', l: 'Old base power', u: 'kVA', v: 1250, min: 0.001 }, { k: 'sn', l: 'New base power', u: 'kVA', v: 10000, min: 0.001 }, { k: 'vo', l: 'Old base voltage', u: 'V', v: 440, min: 1 }, { k: 'vn', l: 'New base voltage', u: 'V', v: 440, min: 1 }],
        run: v => ({ results: [R('Impedance on new base', v.z * v.sn / v.so * (v.vo / v.vn) ** 2, '%', 'auto', null, true), R('In per-unit', v.z / 100 * v.sn / v.so * (v.vo / v.vn) ** 2, 'pu', 'auto')] })
      },
      {
        id: 'energy', icon: '🧾', title: 'Energy, fuel & running cost', desc: 'Energy used by a load and the fuel / cost of generating it.',
        formula: 'kWh = kW × hours     fuel (t) = kWh × SFOC / 10⁶',
        inputs: [{ k: 'p', l: 'Average load', u: 'kW', v: 450, min: 0 }, { k: 'h', l: 'Hours per day', u: 'h', v: 24, min: 0, max: 24 }, { k: 'd', l: 'Days', v: 30, min: 0 }, { k: 'sf', l: 'Generator SFOC', u: 'g/kWh', v: 210, min: 1 }, { k: 'rho', l: 'Fuel density', u: 'kg/L', v: 0.85, min: 0.5, step: 0.01 }, { k: 'pr', l: 'Fuel price', u: 'per tonne', v: 650, min: 0 }],
        run: v => {
          const e = v.p * v.h * v.d, t = e * v.sf / 1e6;
          return { results: [R('Energy', e, 'kWh', 0, null, true), R('Energy', e / 1000, 'MWh', 2), R('Fuel burnt', t, 'tonnes', 2), R('Fuel burnt', t * 1000 / v.rho, 'litres', 0), R('Fuel cost', t * v.pr, '', 0, null, true), R('Cost per kWh', v.sf / 1e6 * v.pr, '', 4)] };
        }
      },
      {
        id: 'stored', icon: '🔋', title: 'Stored energy (capacitor, inductor, flywheel)', desc: 'Energy stored in a capacitor, an inductor or a rotating mass.',
        formula: 'E = ½CV²    E = ½LI²    E = ½Jω²',
        inputs: [{ k: 'c', l: 'Capacitance', u: 'mF', v: 15, min: 0 }, { k: 'v', l: 'Voltage', u: 'V', v: 600, min: 0 }, { k: 'l', l: 'Inductance', u: 'H', v: 0.5, min: 0 }, { k: 'i', l: 'Current', u: 'A', v: 20, min: 0 }, { k: 'j', l: 'Moment of inertia', u: 'kg·m²', v: 50, min: 0 }, { k: 'n', l: 'Speed', u: 'rpm', v: 1780, min: 0 }],
        run: v => ({ results: [R('Capacitor energy', 0.5 * v.c * 1e-3 * v.v ** 2 / 1000, 'kJ', 'auto', null, true), R('Capacitor charge Q', v.c * 1e-3 * v.v, 'C', 'auto'), R('Inductor energy', 0.5 * v.l * v.i ** 2, 'J', 'auto', null, true), R('Rotating mass energy', 0.5 * v.j * (2 * PI * v.n / 60) ** 2 / 1000, 'kJ', 'auto', null, true)], notes: ['A 15 mF DC link at 600 V stores 2.7 kJ – lethal. Always wait for the drive discharge time and verify with a meter.'] })
      },
      {
        id: 'rcode', icon: '🎨', title: 'Resistor colour code', desc: 'Decode 4-band and 5-band resistors.',
        formula: 'value = (digits) × multiplier ± tolerance',
        inputs: [{ k: 'm', l: 'Bands', opts: [['4', '4 bands'], ['5', '5 bands']], v: '4' }, { k: 'a', l: 'Band 1', opts: dig, v: '4' }, { k: 'b', l: 'Band 2', opts: dig, v: '7' }, { k: 'c', l: 'Band 3 (digit)', opts: dig, v: '0', show: v => v.m === '5' }, { k: 'x', l: 'Multiplier', opts: mul, v: '2' }, { k: 't', l: 'Tolerance', opts: tolo, v: 'tgo' }],
        run: v => {
          const digits = v.m === '5' ? +v.a * 100 + +v.b * 10 + +v.c : +v.a * 10 + +v.b, mu = COL.find(c => c[0] === String(v.x))[3], tol = TOL[v.t], val = digits * mu;
          return { results: [R('Resistance', ohm(val), '', 0, null, true), R('Tolerance', '±' + tol + ' %', ''), R('Minimum', ohm(val * (1 - tol / 100)), '', 0), R('Maximum', ohm(val * (1 + tol / 100)), '', 0)] };
        }
      }
    ]
  });
})();
