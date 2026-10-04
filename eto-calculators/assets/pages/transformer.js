(function () {
  const { R, lvl, S3 } = ETO;
  ETO.page({
    title: 'Transformer Calculations', icon: '🧲', accent: '#7c3aed',
    subtitle: 'Currents, loading, taps, regulation, temperature rise, losses and short-circuit level for distribution transformers.',
    refs: ['IEC 60076', 'IEC 60076-11 (dry type)', 'IEC 60092-303'],
    calcs: [
      {
        id: 'cur', icon: '🔢', title: 'Primary / secondary current', desc: 'Rated currents and turns ratio.',
        formula: 'I = S×1000 / (√3 × V)',
        inputs: [{ k: 's', l: 'Rated power', u: 'kVA', v: 75, min: 0.1 }, { k: 'vp', l: 'Primary voltage', u: 'V', v: 690, min: 1 }, { k: 'vs', l: 'Secondary voltage', u: 'V', v: 440, min: 1 }],
        run: v => ({ results: [R('Secondary current', v.s * 1000 / (S3 * v.vs), 'A', 1, null, true), R('Primary current', v.s * 1000 / (S3 * v.vp), 'A', 1), R('Voltage ratio', v.vp / v.vs, ':1', 3)], notes: ['75 kVA @ 440 V → 98.4 A.'] })
      },
      {
        id: 'load', icon: '📊', title: 'Loading %', desc: 'Transformer loading from measured current or from kW and PF.',
        formula: 'S = √3 × V × I/1000   or   S = kW / PF     Load% = S / S_rated',
        inputs: [
          { k: 'mode', l: 'Load given as', opts: [['i', 'Secondary current'], ['kw', 'kW + PF']], v: 'i' },
          { k: 's', l: 'Rated power', u: 'kVA', v: 75, min: 0.1 }, { k: 'vs', l: 'Secondary voltage', u: 'V', v: 440, min: 1 },
          { k: 'i', l: 'Measured current', u: 'A', v: 80, min: 0, show: v => v.mode === 'i' },
          { k: 'kw', l: 'Load', u: 'kW', v: 50, min: 0, show: v => v.mode === 'kw' }, { k: 'pf', l: 'PF', v: 0.85, min: 0.1, max: 1, step: 0.01, show: v => v.mode === 'kw' }
        ],
        run: v => {
          const sl = v.mode === 'i' ? S3 * v.vs * v.i / 1000 : v.kw / v.pf, ld = sl / v.s * 100, st = lvl(ld, 80, 100);
          return { results: [R('Loading', ld, '%', 1, st, true), R('Load', sl, 'kVA', 1), R('Spare capacity', Math.max(0, v.s - sl), 'kVA', 1), R('Rated secondary current', v.s * 1000 / (S3 * v.vs), 'A', 1)], verdict: { s: st, t: ld > 100 ? 'Overloaded – reduce load.' : ld > 80 ? 'High – watch temperature, avoid adding load.' : 'Normal loading.' } };
        }
      },
      {
        id: 'tap', icon: '🎚️', title: 'Voltage ratio & tap setting', desc: 'Expected secondary voltage for a tap position.',
        formula: 'Vs = Vp / ratio × (1 / (1 + tap% × steps))',
        inputs: [
          { k: 'vp', l: 'Rated primary voltage', u: 'V', v: 690, min: 1 }, { k: 'vs', l: 'Rated secondary voltage', u: 'V', v: 440, min: 1 },
          { k: 'vm', l: 'Actual primary voltage', u: 'V', v: 700, min: 1 }, { k: 'st', l: 'Tap step', u: '%', v: 2.5, min: 0 }, { k: 'n', l: 'Tap steps above nominal (HV winding)', v: 0, step: 1, hint: '+1 = more primary turns → lower secondary voltage' }
        ],
        run: v => {
          const vs = v.vm / (v.vp * (1 + v.st * v.n / 100) / v.vs), dev = (vs - v.vs) / v.vs * 100;
          return { results: [R('Secondary voltage', vs, 'V', 1, Math.abs(dev) <= 5 ? 'ok' : 'warn', true), R('Deviation from rated', dev, '%', 2), R('Effective ratio', v.vp * (1 + v.st * v.n / 100) / v.vs, ':1', 3)], notes: ['Tap changes must be done de-energised (off-circuit tap links). Dyn11 line-to-line ratio equals the turns ratio × √3 only for Dy / Yd groups.'] };
        }
      },
      {
        id: 'reg', icon: '📉', title: 'Voltage regulation', desc: 'Secondary voltage drop at load from impedance and power factor.',
        formula: 'VR ≈ x·(R%·cosφ ± X%·sinφ) + x²(X%·cosφ ∓ R%·sinφ)²/200',
        inputs: [
          { k: 's', l: 'Rated power', u: 'kVA', v: 400, min: 1 }, { k: 'uk', l: 'Impedance uk', u: '%', v: 4, min: 0.1 }, { k: 'pcu', l: 'Copper loss at rated load', u: 'kW', v: 4.8, min: 0 },
          { k: 'x', l: 'Load factor (S/S_rated)', v: 0.8, min: 0, max: 1.5, step: 0.05 }, { k: 'pf', l: 'Load PF', v: 0.85, min: 0.1, max: 1, step: 0.01 }, { k: 'lead', l: 'PF type', opts: [['lag', 'Lagging'], ['lead', 'Leading']], v: 'lag' }, { k: 'vs', l: 'No-load secondary V', u: 'V', v: 440, min: 1 }
        ],
        run: v => {
          const r = v.pcu / v.s * 100, x = Math.sqrt(Math.max(0, v.uk * v.uk - r * r)), c = v.pf, s = Math.sin(Math.acos(c)), sg = v.lead === 'lag' ? 1 : -1;
          const vr = v.x * (r * c + sg * x * s) + (v.x * v.x * (x * c - sg * r * s) ** 2) / 200;
          return { results: [R('Regulation', vr, '%', 2, vr > 5 ? 'warn' : null, true), R('Loaded secondary voltage', v.vs * (1 - vr / 100), 'V', 1), R('Resistance R', r, '%', 2), R('Reactance X', x, '%', 2)], notes: ['Leading PF can give a negative regulation (voltage rise).'] };
        }
      },
      {
        id: 'temp', icon: '🌡️', title: 'Winding temperature rise', desc: 'Temperature from resistance measurement and compare with the insulation class limit.',
        formula: 'T2 = R2/R1 × (234.5 + T1) − 234.5     rise = T2 − T_ambient',
        inputs: [
          { k: 'r1', l: 'Cold resistance', u: 'Ω', v: 0.0152, min: 0.000001 }, { k: 't1', l: 'Cold temp', u: '°C', v: 25 }, { k: 'r2', l: 'Hot resistance', u: 'Ω', v: 0.0189, min: 0.000001 }, { k: 'amb', l: 'Ambient', u: '°C', v: 40 },
          { k: 'cl', l: 'Insulation system', opts: [['80', 'Dry – class B (rise 80 K)'], ['105', 'Dry – class F (rise 105 K)'], ['125', 'Dry – class H (rise 125 K)'], ['65', 'Oil ONAN (rise 65 K)']], v: '105' }
        ],
        run: v => {
          const t2 = v.r2 / v.r1 * (234.5 + v.t1) - 234.5, rise = t2 - v.amb, lim = +v.cl, st = lvl(rise, lim * 0.9, lim);
          return { results: [R('Winding temperature', t2, '°C', 1, st, true), R('Rise over ambient', rise, 'K', 1, st), R('Limit', lim, 'K', 0), R('Margin', lim - rise, 'K', 1, st)], verdict: { s: st, t: st === 'ok' ? 'Temperature rise within limit.' : st === 'warn' ? 'Near the limit.' : 'Over-temperature – reduce load / improve ventilation.' } };
        }
      },
      {
        id: 'loss', icon: '♨️', title: 'Losses & efficiency', desc: 'Efficiency at any load and the load for maximum efficiency.',
        formula: 'η = x·S·PF / (x·S·PF + P0 + x²·Pk)     x_opt = √(P0/Pk)',
        inputs: [
          { k: 's', l: 'Rated power', u: 'kVA', v: 400, min: 1 }, { k: 'p0', l: 'No-load (iron) loss', u: 'kW', v: 0.9, min: 0 }, { k: 'pk', l: 'Load (copper) loss at rated', u: 'kW', v: 4.8, min: 0.001 },
          { k: 'x', l: 'Load factor', v: 0.75, min: 0.01, max: 1.5, step: 0.05 }, { k: 'pf', l: 'Load PF', v: 0.85, min: 0.1, max: 1, step: 0.01 }
        ],
        run: v => {
          const out = v.x * v.s * v.pf, loss = v.p0 + v.x * v.x * v.pk, eff = out / (out + loss) * 100, xo = Math.sqrt(v.p0 / v.pk), em = xo * v.s * v.pf / (xo * v.s * v.pf + 2 * v.p0) * 100;
          return { results: [R('Efficiency', eff, '%', 2, null, true), R('Total loss', loss, 'kW', 2), R('Copper loss', v.x * v.x * v.pk, 'kW', 2), R('Max-efficiency load', xo * 100, '%', 0), R('Max efficiency', em, '%', 2), R('Heat to remove', loss, 'kW', 2)] };
        }
      },
      {
        id: 'imp', icon: '🧪', title: 'Impedance from short-circuit test', desc: 'Per-cent impedance, resistance and reactance from a short-circuit test.',
        formula: 'Z% = Vsc/Vrated × In/Itest × 100    R% = Psc × (In/Itest)² / S × 100',
        inputs: [
          { k: 's', l: 'Rated power', u: 'kVA', v: 400, min: 1 }, { k: 'vr', l: 'Rated voltage (tested winding)', u: 'V', v: 690, min: 1 }, { k: 'vsc', l: 'Short-circuit test voltage (line)', u: 'V', v: 27.6, min: 0.01 },
          { k: 'it', l: 'Test current', u: 'A', v: 334.7, min: 0.01 }, { k: 'psc', l: 'Measured loss (3-ph)', u: 'W', v: 4800, min: 0 }
        ],
        run: v => {
          const In = v.s * 1000 / (S3 * v.vr), z = v.vsc / v.vr * In / v.it * 100, r = v.psc * (In / v.it) ** 2 / (v.s * 1000) * 100, x = Math.sqrt(Math.max(0, z * z - r * r));
          return { results: [R('Impedance Z', z, '%', 2, null, true), R('Resistance R', r, '%', 2), R('Reactance X', x, '%', 2), R('Rated current', In, 'A', 1), R('X/R', x / r, '', 1)] };
        }
      },
      {
        id: 'sc', icon: '💥', title: 'Short-circuit current at secondary', desc: 'Prospective fault level at the transformer secondary terminals.',
        formula: 'Isc = In / (uk + S/Ssc_source)',
        inputs: [
          { k: 's', l: 'Rated power', u: 'kVA', v: 400, min: 1 }, { k: 'vs', l: 'Secondary voltage', u: 'V', v: 440, min: 1 }, { k: 'uk', l: 'Impedance uk', u: '%', v: 4, min: 0.1 },
          { k: 'ssc', l: 'Source short-circuit power (0 = infinite)', u: 'MVA', v: 0, min: 0 }
        ],
        run: v => {
          const In = v.s * 1000 / (S3 * v.vs), zs = v.ssc > 0 ? v.s / (v.ssc * 1000) : 0, isc = In / (v.uk / 100 + zs);
          return { results: [R('Prospective Isc', isc / 1000, 'kA', 2, null, true), R('Rated current', In, 'A', 1), R('Peak (κ≈1.7)', 1.7 * Math.SQRT2 * isc / 1000, 'kA', 1)], notes: ['Add motor contribution (≈4–6× running motor FLC) and check breaker Icu.'] };
        }
      }
    ]
  });
})();
