(function () {
  const { R, lvl, S3, esc } = ETO;
  ETO.page({
    title: 'Generator Calculations', icon: '🛢️', accent: '#ea580c',
    subtitle: 'Diesel-generator loading, paralleling, protection, voltage / frequency behaviour and motor-starting capacity.',
    refs: ['IEC 60092-301', 'IEC 60034-1', 'ISO 8528', 'IACS UR E13', 'IEC 60909'],
    calcs: [
      {
        id: 'load', icon: '📊', title: 'DG loading (kW / kVAR / kVA)', desc: 'Complete loading picture of one generator.',
        formula: 'kVA = √(kW² + kVAR²)    Load% = kVA / kVA_rated',
        inputs: [
          { k: 'rk', l: 'Rated', u: 'kVA', v: 1250, min: 1 }, { k: 'rpf', l: 'Rated PF', v: 0.8, min: 0.5, max: 1, step: 0.01 }, { k: 'v', l: 'Rated voltage', u: 'V', v: 440, min: 1 },
          { k: 'kw', l: 'Measured kW', u: 'kW', v: 640 }, { k: 'kvar', l: 'Measured kVAR', u: 'kVAR', v: 420, hint: 'Negative = leading (absorbing)' }
        ],
        run: v => {
          const kva = Math.hypot(v.kw, v.kvar), pf = v.kw / kva, rkw = v.rk * v.rpf, p = kva / v.rk * 100, pw = v.kw / rkw * 100, st = p > 100 ? 'bad' : p > 85 || pw < 30 ? 'warn' : 'ok';
          const iq = v.rk * Math.sqrt(1 - v.rpf * v.rpf);
          return { results: [R('kVA loading', p, '%', 1, st, true), R('kW loading', pw, '%', 1, pw > 100 ? 'bad' : null), R('Apparent power', kva, 'kVA', 0), R('Power factor', pf, '', 3, pf < 0.7 ? 'warn' : null), R('Current', kva * 1000 / (S3 * v.v), 'A', 0), R('Rated current', v.rk * 1000 / (S3 * v.v), 'A', 0), R('kW headroom', rkw - v.kw, 'kW', 0, rkw - v.kw < 0 ? 'bad' : null), R('kVAR capability', iq, 'kVAR', 0)],
            verdict: { s: st, t: p > 100 ? 'Overload.' : v.kvar < 0 ? 'Leading kVAR – check capacitive load / over-corrected PF; AVR may hunt.' : p > 85 ? 'High loading.' : 'Loading normal.' } };
        }
      },
      {
        id: 'share', icon: '🤝', title: 'Load sharing (parallel DGs)', desc: 'Active-power sharing between paralleled generators. Class rule: deviation from proportional share ≤ lesser of 15% of the largest rating or 25% of the smallest.',
        formula: 'Ideal_i = ΣP × Rated_i / ΣRated    Deviation_i = P_i − Ideal_i',
        inputs: [{ k: 'tbl', t: 'table', l: 'Generators', v: [{ n: 'DG1', r: 1000, p: 520 }, { n: 'DG2', r: 1000, p: 480 }, { n: 'DG3', r: 800, p: 330 }],
          cols: [{ k: 'n', l: 'Name', t: 'text', d: 'DG' }, { k: 'r', l: 'Rated kW', t: 'num', d: 1000 }, { k: 'p', l: 'Actual kW', t: 'num', d: 0 }] }],
        run: v => {
          const rs = v.tbl.map(g => g.r), sr = rs.reduce((a, b) => a + b, 0), sp = v.tbl.reduce((a, g) => a + g.p, 0);
          if (sr <= 0) throw new Error('Enter ratings');
          const lim = Math.min(0.15 * Math.max(...rs), 0.25 * Math.min(...rs));
          let worst = 0;
          const rows = v.tbl.map(g => { const id = sp * g.r / sr, d = g.p - id; worst = Math.max(worst, Math.abs(d)); return [esc(g.n), g.r, g.p, g.r ? g.p / g.r * 100 : 0, id, d, Math.abs(d) <= lim ? '✅' : '⛔']; });
          return { results: [R('Total load', sp, 'kW', 0), R('System loading', sp / sr * 100, '%', 1), R('Worst deviation', worst, 'kW', 1, worst <= lim ? 'ok' : 'bad', true), R('Allowed deviation', lim, 'kW', 1)],
            tables: [{ title: 'Sharing', head: ['DG', 'Rated kW', 'Actual kW', 'Load %', 'Ideal kW', 'Deviation kW', 'OK'], rows, states: rows.map(r => r[6] === '✅' ? 'ok' : 'bad') }],
            verdict: { s: worst <= lim ? 'ok' : 'bad', t: worst <= lim ? 'Load sharing within limits.' : 'Poor sharing – check governor droop / speed-setting, load-sharing module and actuator linkage.' } };
        }
      },
      {
        id: 'rev', icon: '↩️', title: 'Reverse power', desc: 'Reverse-power (motoring) protection check. Class requirement: 2–15% depending on engine type, delay ≈ 3–10 s.',
        formula: 'Reverse % = |P_rev| / P_rated × 100',
        inputs: [
          { k: 'r', l: 'Rated power', u: 'kW', v: 1000, min: 1 }, { k: 'set', l: 'Relay setting', u: '%', v: 8, min: 1, max: 30 },
          { k: 'm', l: 'Measured reverse power', u: 'kW', v: 35, min: 0 }, { k: 't', l: 'Relay delay', u: 's', v: 5, min: 0 }
        ],
        run: v => {
          const pct = v.m / v.r * 100, trip = v.set / 100 * v.r, st = pct >= v.set ? 'bad' : pct >= v.set * 0.7 ? 'warn' : 'ok';
          return { results: [R('Reverse power', pct, '%', 2, st, true), R('Trip level', trip, 'kW', 1), R('Margin to trip', trip - v.m, 'kW', 1), R('Trip delay', v.t, 's', 1)],
            verdict: { s: st, t: st === 'bad' ? 'Reverse-power relay will trip after delay – generator is being motored (check governor / fuel, load-sharing).' : st === 'warn' ? 'Close to the reverse-power trip level.' : 'No reverse-power risk.' } };
        }
      },
      {
        id: 'droop', icon: '📉', title: 'Frequency & droop', desc: 'Frequency at a given load for a droop setting, and kW-per-Hz.',
        formula: 'f = f_nl − droop% × f_rated × Load%     kW/Hz = P_rated / (droop% × f_rated)',
        inputs: [
          { k: 'fr', l: 'Rated frequency', u: 'Hz', v: 60, min: 1 }, { k: 'fnl', l: 'No-load frequency', u: 'Hz', v: 62.4, min: 1 }, { k: 'd', l: 'Droop', u: '%', v: 4, min: 0.1 },
          { k: 'ld', l: 'Load', u: '% of rated', v: 70, min: 0, max: 120 }, { k: 'p', l: 'Rated power', u: 'kW', v: 1000, min: 1 }
        ],
        run: v => {
          const f = v.fnl - v.d / 100 * v.fr * v.ld / 100, ffl = v.fnl - v.d / 100 * v.fr, rows = [0, 25, 50, 75, 100].map(l => [l + '%', v.fnl - v.d / 100 * v.fr * l / 100]);
          return { results: [R('Frequency at load', f, 'Hz', 2, Math.abs(f - v.fr) <= 0.05 * v.fr ? 'ok' : 'warn', true), R('Full-load frequency', ffl, 'Hz', 2), R('kW per Hz', v.p / (v.d / 100 * v.fr), 'kW/Hz', 0), R('Deviation from rated', (f - v.fr) / v.fr * 100, '%', 2)],
            tables: [{ title: 'Frequency vs load', head: ['Load', 'Frequency (Hz)'], rows }], notes: ['Class limit: steady-state frequency within ±5% (IEC 60092-301 ±2.5% typical for governors). Two DGs with equal droop share load equally.'] };
        }
      },
      {
        id: 'vreg', icon: '🔌', title: 'Voltage regulation', desc: 'Steady-state voltage regulation of the alternator (AVR performance).',
        formula: 'Regulation % = (V_nl − V_fl) / V_fl × 100',
        inputs: [
          { k: 'vr', l: 'Rated voltage', u: 'V', v: 440, min: 1 }, { k: 'vnl', l: 'No-load voltage', u: 'V', v: 441, min: 1 }, { k: 'vfl', l: 'Full-load voltage', u: 'V', v: 436, min: 1 }
        ],
        run: v => {
          const r = (v.vnl - v.vfl) / v.vfl * 100, dn = (v.vnl - v.vr) / v.vr * 100, df = (v.vfl - v.vr) / v.vr * 100, w = Math.max(Math.abs(dn), Math.abs(df)), st = lvl(w, 2.5, 3.5);
          return { results: [R('Regulation', r, '%', 2, st, true), R('Deviation at no-load', dn, '%', 2), R('Deviation at full load', df, '%', 2), R('Worst deviation', w, '%', 2, st)],
            verdict: { s: st, t: st === 'ok' ? 'Within ±2.5% steady-state limit (IEC 60092-301).' : st === 'warn' ? 'Slightly outside ±2.5% – check AVR voltage setting & droop compensation.' : 'Out of limits – inspect AVR, excitation and sensing circuit.' } };
        }
      },
      {
        id: 'avr', icon: '🎛️', title: 'AVR transient response', desc: 'Voltage dip and recovery after load switching (class limits: dip ≤ −15%, recovery to ±3% in ≤ 1.5 s).',
        formula: 'Dip % = (V_nom − V_min)/V_nom × 100',
        inputs: [
          { k: 'vn', l: 'Nominal voltage', u: 'V', v: 440, min: 1 }, { k: 'vm', l: 'Minimum voltage during transient', u: 'V', v: 392, min: 1 },
          { k: 'vf', l: 'Recovered voltage', u: 'V', v: 436, min: 1 }, { k: 'tr', l: 'Recovery time', u: 's', v: 0.9, min: 0 }
        ],
        run: v => {
          const dip = (v.vn - v.vm) / v.vn * 100, dev = Math.abs(v.vf - v.vn) / v.vn * 100, ok1 = dip <= 15, ok2 = dev <= 3 && v.tr <= 1.5;
          return { results: [R('Voltage dip', dip, '%', 1, ok1 ? 'ok' : 'bad', true), R('Recovered deviation', dev, '%', 2, dev <= 3 ? 'ok' : 'bad'), R('Recovery time', v.tr, 's', 2, v.tr <= 1.5 ? 'ok' : 'bad')],
            verdict: { s: ok1 && ok2 ? 'ok' : 'bad', t: ok1 && ok2 ? 'AVR transient response meets typical class limits.' : 'Response outside typical limits – check AVR gains (stability), excitation power and engine speed dip.' } };
        }
      },
      {
        id: 'exc', icon: '🧲', title: 'Excitation field (resistance / power)', desc: 'Exciter / main field resistance, power and temperature.',
        formula: 'Rf = Vf / If    T_hot = Rhot/Rcold × (234.5 + Tcold) − 234.5',
        inputs: [
          { k: 'vf', l: 'Field voltage', u: 'V DC', v: 45, min: 0 }, { k: 'if', l: 'Field current', u: 'A', v: 3.1, min: 0.001 },
          { k: 'rc', l: 'Cold resistance (nameplate)', u: 'Ω', v: 12.2, min: 0.001 }, { k: 'tc', l: 'Cold temperature', u: '°C', v: 20 }
        ],
        run: v => {
          const rf = v.vf / v.if, th = rf / v.rc * (234.5 + v.tc) - 234.5;
          return { results: [R('Field resistance (hot)', rf, 'Ω', 2), R('Field power', v.vf * v.if, 'W', 0), R('Field winding temperature', th, '°C', 0, lvl(th, 120, 140), true)], notes: ['A field current much higher than commissioning values at the same load suggests shorted field turns, weak rotating diodes or low AVR sensing.'] };
        }
      },
      {
        id: 'mstart', icon: '🚀', title: 'Motor starting capacity', desc: 'Voltage dip when a motor is started on a generator and the biggest DOL motor that can be started.',
        formula: 'Dip = S_start / (S_start + S_gen/X″d)     S_start = (P/η/PF) × Ilr/In',
        inputs: [
          { k: 'sg', l: 'Generators online', u: 'kVA', v: 1250, min: 1, hint: 'Sum of kVA of all DGs online' },
          { k: 'xd', l: 'Xd″ / Xd′ (per unit)', v: 0.2, min: 0.05, step: 0.01, hint: 'Sub-transient ≈ 0.12–0.2; transient ≈ 0.25–0.35 (use for slow starts)' },
          { k: 'p', l: 'Motor rated power', u: 'kW', v: 200, min: 0.1 }, { k: 'e', l: 'Motor efficiency', u: '%', v: 94, min: 1, max: 100 },
          { k: 'pf', l: 'Motor PF', v: 0.88, min: 0.1, max: 1, step: 0.01 }, { k: 'r', l: 'Locked-rotor ratio', v: 6.5, min: 1, step: 0.1 },
          { k: 'lim', l: 'Allowed dip', u: '%', v: 15, min: 1, max: 40 }
        ],
        run: v => {
          const sstart = v.p / (v.e / 100) / v.pf * v.r, ssc = v.sg / v.xd, dip = sstart / (sstart + ssc) * 100, st = dip <= v.lim ? 'ok' : dip <= v.lim * 1.3 ? 'warn' : 'bad';
          const smax = v.lim / 100 / (1 - v.lim / 100) * ssc, pmax = smax / v.r * v.pf * v.e / 100;
          return { results: [R('Voltage dip', dip, '%', 1, st, true), R('Starting kVA', sstart, 'kVA', 0), R('Generator short-circuit kVA', ssc, 'kVA', 0), R('Max DOL motor for limit', pmax, 'kW', 0, null, true)],
            verdict: { s: st, t: st === 'ok' ? 'Motor can be started DOL within the dip limit.' : 'Dip too high – use soft starter / star-delta / VFD, or start with more generators online.' }, notes: ['Starting with existing preload deepens the dip slightly. Also check engine speed dip and contactor drop-out (≈ 70% voltage).'] };
        }
      },
      {
        id: 'sc', icon: '💥', title: 'Generator short-circuit capacity', desc: 'Initial and sustained fault current of one generator.',
        formula: "I″k = In / X″d    I'k = In / X′d    Ip = κ·√2·I″k",
        inputs: [
          { k: 's', l: 'Rating', u: 'kVA', v: 1250, min: 1 }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 },
          { k: 'xdd', l: 'X″d', v: 0.15, min: 0.01, step: 0.01 }, { k: 'xd', l: 'X′d', v: 0.28, min: 0.01, step: 0.01 }, { k: 'n', l: 'Number of DGs in parallel', v: 2, min: 1, step: 1 }
        ],
        run: v => {
          const In = v.s * 1000 / (S3 * v.v), i1 = In / v.xdd, i2 = In / v.xd, sust = 3 * In;
          return { results: [R('Rated current In', In, 'A', 0), R('Initial I″k (1 DG)', i1 / 1000, 'kA', 1, null, true), R('Transient I′k (1 DG)', i2 / 1000, 'kA', 1), R('Sustained (3×In, PMG/AVR forcing)', sust / 1000, 'kA', 1), R('Initial I″k (all DGs)', i1 * v.n / 1000, 'kA', 1, 'warn'), R('Peak ip (κ≈1.8)', 1.8 * Math.SQRT2 * i1 * v.n / 1000, 'kA', 1)],
            notes: ['Use the all-DGs figure (plus motor contribution) to check breaker Icu / Icm on the main switchboard.', 'Sustained short-circuit current must be ≥ 3×In for ≥ 2 s to allow selective tripping.'] };
        }
      },
      {
        id: 'sync', icon: '⏱️', title: 'Synchronizing check', desc: 'Are the incoming generator and bus ready for breaker closure?',
        formula: 'Beat period = 1 / Δf     Lead angle = 360 × Δf × t_close',
        inputs: [
          { k: 'fb', l: 'Bus frequency', u: 'Hz', v: 60.0 }, { k: 'fg', l: 'Incoming frequency', u: 'Hz', v: 60.1 },
          { k: 'vb', l: 'Bus voltage', u: 'V', v: 440, min: 1 }, { k: 'vg', l: 'Incoming voltage', u: 'V', v: 443, min: 1 },
          { k: 'ph', l: 'Phase angle (sync scope)', u: '°', v: 5 }, { k: 'tc', l: 'Breaker closing time', u: 'ms', v: 60, min: 0 }
        ],
        run: v => {
          const df = v.fg - v.fb, dv = (v.vg - v.vb) / v.vb * 100, lead = 360 * Math.abs(df) * v.tc / 1000, ok = Math.abs(df) <= 0.2 && Math.abs(dv) <= 5 && Math.abs(v.ph) <= 10;
          return { results: [R('Δ Frequency', df, 'Hz', 3, Math.abs(df) <= 0.2 ? 'ok' : 'bad'), R('Slip cycle', df ? 1 / Math.abs(df) : 'steady', 's', 1), R('Δ Voltage', dv, '%', 2, Math.abs(dv) <= 5 ? 'ok' : 'bad'), R('Phase angle', v.ph, '°', 1, Math.abs(v.ph) <= 10 ? 'ok' : 'bad'), R('Closing lead angle', lead, '°', 1)],
            verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Within synchronizing window – close at 0° (minus lead angle). Incoming slightly fast (+Δf) avoids reverse power on closing.' : 'Outside synchronizing window (Δf ≤ 0.2 Hz, ΔV ≤ 5%, φ ≤ ±10°).' } };
        }
      },
      {
        id: 'fuel', icon: '⛽', title: 'Fuel consumption & endurance', desc: 'Hourly fuel use from SFOC and tank endurance.',
        formula: 'kg/h = kW × SFOC / 1000    L/h = kg/h / density',
        inputs: [
          { k: 'kw', l: 'Engine load', u: 'kW', v: 700, min: 0 }, { k: 'sf', l: 'SFOC', u: 'g/kWh', v: 205, min: 1 }, { k: 'd', l: 'Fuel density', u: 'kg/L', v: 0.85, min: 0.5, step: 0.01 }, { k: 'tank', l: 'Usable tank volume', u: 'm³', v: 60, min: 0 }
        ],
        run: v => {
          const kgh = v.kw * v.sf / 1000, lh = kgh / v.d;
          return { results: [R('Fuel flow', kgh, 'kg/h', 1), R('Fuel flow', lh, 'L/h', 0, null, true), R('Per day', lh * 24 / 1000, 'm³/day', 2), R('Endurance', v.tank * 1000 / lh, 'h', 0), R('Endurance', v.tank * 1000 / lh / 24, 'days', 1)] };
        }
      }
    ]
  });
})();
