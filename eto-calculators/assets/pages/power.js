(function () {
  const { R, lvl, S3 } = ETO;
  ETO.page({
    title: 'Electrical Power Calculations', icon: '⚡', accent: '#2563eb',
    subtitle: 'Everyday V / A / kW / kVA / kVAR maths, equipment loading and phase balance.',
    refs: ['IEC 60038', 'IEC 60092-301', 'IEC 60034-1'],
    calcs: [
      {
        id: 'i3', icon: '🔄', title: '3-phase current', desc: 'Line current of a 3-phase load from output power, voltage, power factor and efficiency.',
        formula: 'I = P×1000 / (√3 × V × PF × η)',
        inputs: [
          { k: 'p', l: 'Output / rated power', u: 'kW', v: 55, min: 0.001 },
          { k: 'v', l: 'Line voltage', u: 'V', v: 440, min: 1 },
          { k: 'pf', l: 'Power factor', v: 0.86, min: 0.05, max: 1, step: 0.01 },
          { k: 'e', l: 'Efficiency (100 for heaters)', u: '%', v: 93, min: 1, max: 100 }
        ],
        run: v => {
          const pin = v.p / (v.e / 100), I = pin * 1000 / (S3 * v.v * v.pf), kva = pin / v.pf;
          return { results: [R('Line current', I, 'A', 2, null, true), R('Input power', pin, 'kW'), R('Apparent power', kva, 'kVA'), R('Reactive power', Math.sqrt(Math.max(0, kva * kva - pin * pin)), 'kVAR')],
            notes: ['Use the motor nameplate current if available – it is the authority. This is a cross-check.'] };
        }
      },
      {
        id: 'i1', icon: '🔆', title: 'Single-phase current', desc: 'Small loads, heaters, lighting and 230 V sockets.',
        formula: 'I = P×1000 / (V × PF × η)',
        inputs: [
          { k: 'p', l: 'Power', u: 'kW', v: 3, min: 0.001 },
          { k: 'v', l: 'Voltage', u: 'V', v: 230, min: 1 },
          { k: 'pf', l: 'Power factor', v: 1, min: 0.05, max: 1, step: 0.01 },
          { k: 'e', l: 'Efficiency', u: '%', v: 100, min: 1, max: 100 }
        ],
        run: v => {
          const pin = v.p / (v.e / 100), I = pin * 1000 / (v.v * v.pf);
          return { results: [R('Current', I, 'A', 2, null, true), R('Apparent power', pin / v.pf, 'kVA'), R('Input power', pin, 'kW')] };
        }
      },
      {
        id: 'pwr', icon: '📊', title: 'Power from V & I', desc: 'Actual loading from clamp-meter / panel readings.',
        formula: '3-ph: S = √3·V·I   1-ph: S = V·I   P = S·PF   Q = √(S²−P²)',
        inputs: [
          { k: 'sys', l: 'System', opts: [['3', '3-phase'], ['1', 'Single-phase']], v: '3' },
          { k: 'v', l: 'Line voltage', u: 'V', v: 440, min: 1 },
          { k: 'i', l: 'Line current', u: 'A', v: 120, min: 0 },
          { k: 'pf', l: 'Power factor', v: 0.85, min: 0.05, max: 1, step: 0.01 }
        ],
        run: v => {
          const s = (v.sys == 3 ? S3 : 1) * v.v * v.i / 1000, p = s * v.pf;
          return { results: [R('Active power P', p, 'kW', 2, null, true), R('Apparent power S', s, 'kVA'), R('Reactive power Q', Math.sqrt(Math.max(0, s * s - p * p)), 'kVAR'), R('Phase angle φ', Math.acos(v.pf) * 180 / Math.PI, '°', 1)] };
        }
      },
      {
        id: 'khp', icon: '🐎', title: 'kW ↔ HP', desc: 'Convert between kW, mechanical HP (550 ft·lb/s) and metric HP (PS/CV).',
        formula: '1 HP = 0.7457 kW    1 PS = 0.7355 kW',
        inputs: [
          { k: 'val', l: 'Value', v: 75, min: 0 },
          { k: 'from', l: 'Convert from', opts: [['kw', 'kW'], ['hp', 'HP (mechanical)'], ['ps', 'PS (metric)']], v: 'kw' }
        ],
        run: v => {
          const kw = v.from === 'kw' ? v.val : v.from === 'hp' ? v.val * 0.7457 : v.val * 0.7355;
          return { results: [R('kW', kw, 'kW'), R('HP (mechanical)', kw / 0.7457, 'HP'), R('PS (metric)', kw / 0.7355, 'PS'), R('Watts', kw * 1000, 'W', 0)] };
        }
      },
      {
        id: 'dg', icon: '🛢️', title: 'Generator load %', desc: 'DG loading from kW and power factor readings.',
        formula: 'kVA = kW / PF    Load% (kVA) = kVA / kVA_rated    Load% (kW) = kW / kW_rated',
        inputs: [
          { k: 'rk', l: 'Rated apparent power', u: 'kVA', v: 1000, min: 1 },
          { k: 'rpf', l: 'Rated power factor', v: 0.8, min: 0.5, max: 1, step: 0.01 },
          { k: 'kw', l: 'Measured load', u: 'kW', v: 520, min: 0 },
          { k: 'pf', l: 'Measured power factor', v: 0.8, min: 0.2, max: 1, step: 0.01 },
          { k: 'v', l: 'Bus voltage', u: 'V', v: 440, min: 1 }
        ],
        run: v => {
          const kva = v.kw / v.pf, rkw = v.rk * v.rpf, pk = kva / v.rk * 100, pw = v.kw / rkw * 100;
          const s = pk > 100 ? 'bad' : pk > 85 || pk < 30 ? 'warn' : 'ok';
          return { results: [R('kVA loading', pk, '%', 1, s, true), R('kW loading', pw, '%', 1, pw > 100 ? 'bad' : pw > 85 ? 'warn' : 'ok'), R('Apparent power', kva, 'kVA'), R('Reactive power', Math.sqrt(Math.max(0, kva * kva - v.kw * v.kw)), 'kVAR'), R('Line current', kva * 1000 / (S3 * v.v), 'A'), R('Rated kW', rkw, 'kW'), R('Spare capacity', Math.max(0, rkw - v.kw), 'kW')],
            verdict: { s, t: pk > 100 ? 'Overloaded – reduce load / start another DG.' : pk > 85 ? 'High loading – consider starting standby DG (PMS usually starts at 80–85%).' : pk < 30 ? 'Light load (<30%) – risk of wet stacking / carbon build-up; check load-dependent stop.' : 'Loading in the normal 30–85% band.' } };
        }
      },
      {
        id: 'trf', icon: '🧲', title: 'Transformer loading %', desc: 'Loading from measured secondary currents.',
        formula: 'S = √3 × V × I_avg / 1000    Load% = S / S_rated',
        inputs: [
          { k: 'rs', l: 'Rated power', u: 'kVA', v: 400, min: 1 },
          { k: 'v', l: 'Secondary voltage', u: 'V', v: 440, min: 1 },
          { k: 'i1', l: 'Current L1', u: 'A', v: 320, min: 0 },
          { k: 'i2', l: 'Current L2', u: 'A', v: 310, min: 0 },
          { k: 'i3', l: 'Current L3', u: 'A', v: 300, min: 0 }
        ],
        run: v => {
          const ia = (v.i1 + v.i2 + v.i3) / 3, s = S3 * v.v * ia / 1000, ld = s / v.rs * 100, ir = v.rs * 1000 / (S3 * v.v), st = lvl(ld, 80, 100);
          return { results: [R('Loading', ld, '%', 1, st, true), R('Load', s, 'kVA'), R('Average current', ia, 'A'), R('Rated current', ir, 'A'), R('Spare', Math.max(0, v.rs - s), 'kVA')],
            verdict: { s: st, t: ld > 100 ? 'Transformer overloaded.' : ld > 80 ? 'High loading – monitor winding temperature.' : 'Loading acceptable.' } };
        }
      },
      {
        id: 'ups', icon: '🔋', title: 'UPS loading %', desc: 'Check kVA and kW loading of a UPS (both limits apply).',
        formula: 'Load%(kVA) = S_load / S_ups    Load%(kW) = P_load / (S_ups × PF_ups)',
        inputs: [
          { k: 'rs', l: 'UPS rating', u: 'kVA', v: 20, min: 0.1 },
          { k: 'rpf', l: 'UPS output PF rating', v: 0.9, min: 0.5, max: 1, step: 0.01 },
          { k: 'p', l: 'Load', u: 'kW', v: 11, min: 0 },
          { k: 'pf', l: 'Load power factor', v: 0.8, min: 0.2, max: 1, step: 0.01 }
        ],
        run: v => {
          const s = v.p / v.pf, a = s / v.rs * 100, b = v.p / (v.rs * v.rpf) * 100, m = Math.max(a, b), st = lvl(m, 80, 100);
          return { results: [R('Governing loading', m, '%', 1, st, true), R('kVA loading', a, '%', 1), R('kW loading', b, '%', 1), R('Load', s, 'kVA'), R('Spare kW', Math.max(0, v.rs * v.rpf - v.p), 'kW')],
            verdict: { s: st, t: m > 100 ? 'UPS overloaded – shed load.' : m > 80 ? 'Above 80% – little headroom; plan load reduction or capacity increase.' : 'UPS loading acceptable (≤80% recommended).' } };
        }
      },
      {
        id: 'bal', icon: '⚖️', title: 'Current / load balance', desc: 'Detect unbalanced phase currents (single-phasing, loose connections, uneven single-phase loads).',
        formula: 'Unbalance % = max|I − I_avg| / I_avg × 100',
        inputs: [
          { k: 'a', l: 'Current L1', u: 'A', v: 102, min: 0 }, { k: 'b', l: 'Current L2', u: 'A', v: 98, min: 0 }, { k: 'c', l: 'Current L3', u: 'A', v: 110, min: 0 }
        ],
        run: v => {
          const av = (v.a + v.b + v.c) / 3;
          if (av <= 0) throw new Error('Enter the phase currents');
          const mx = Math.max(Math.abs(v.a - av), Math.abs(v.b - av), Math.abs(v.c - av)), u = mx / av * 100, st = lvl(u, 10, 20);
          return { results: [R('Unbalance', u, '%', 2, st, true), R('Average current', av, 'A'), R('Max deviation', mx, 'A'), R('Highest phase', Math.max(v.a, v.b, v.c), 'A'), R('Lowest phase', Math.min(v.a, v.b, v.c), 'A')],
            verdict: { s: st, t: u <= 10 ? 'Balanced – within ≈10%.' : u <= 20 ? 'Noticeable unbalance – check phase voltages & connections.' : 'Severe unbalance – possible phase loss / winding fault. Investigate before running.' },
            notes: ['Current unbalance in motors is ≈ 6–10× the voltage unbalance. Check voltage balance first.'] };
        }
      },
      {
        id: 'vbal', icon: '🎚️', title: 'Voltage unbalance (NEMA)', desc: 'Voltage unbalance from three line-to-line readings.',
        formula: 'VUB % = max|V − V_avg| / V_avg × 100',
        inputs: [
          { k: 'a', l: 'V L1-L2', u: 'V', v: 441, min: 1 }, { k: 'b', l: 'V L2-L3', u: 'V', v: 438, min: 1 }, { k: 'c', l: 'V L3-L1', u: 'V', v: 436, min: 1 }
        ],
        run: v => {
          const av = (v.a + v.b + v.c) / 3, mx = Math.max(Math.abs(v.a - av), Math.abs(v.b - av), Math.abs(v.c - av)), u = mx / av * 100, st = lvl(u, 1, 2);
          return { results: [R('Voltage unbalance', u, '%', 2, st, true), R('Average voltage', av, 'V'), R('Motor derating (NEMA MG-1 approx.)', ETO.interp([[1, 100], [2, 95], [3, 88], [4, 82], [5, 75]], u), '%', 0)],
            verdict: { s: st, t: u <= 1 ? 'Excellent (≤1%).' : u <= 2 ? 'Acceptable but motors begin to heat – investigate.' : 'Above 2% – derate motors and find the cause (single-phase loads, transformer taps, loose joints).' } };
        }
      }
    ]
  });
})();
