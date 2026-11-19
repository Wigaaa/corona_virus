(function () {
  const { R, lvl, S3, esc } = ETO;
  const PI = Math.PI;
  ETO.page({
    title: 'Motor Calculations', icon: '⚙️', accent: '#16a34a',
    subtitle: 'Full-load and starting current, slip, torque, protection settings, thermal capacity and starter comparison.',
    refs: ['IEC 60034-1', 'IEC 60947-4-1', 'IEC 60092-301', 'IEC 60034-12'],
    calcs: [
      {
        id: 'flc', icon: '🔢', title: 'Full-load current', desc: 'Expected FLC of a 3-phase induction motor.',
        formula: 'FLC = P×1000 / (√3 × V × PF × η)',
        inputs: [
          { k: 'p', l: 'Rated shaft power', u: 'kW', v: 90, min: 0.01 }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 },
          { k: 'pf', l: 'Power factor', v: 0.87, min: 0.1, max: 1, step: 0.01 }, { k: 'e', l: 'Efficiency', u: '%', v: 94, min: 1, max: 100 }
        ],
        run: v => {
          const i = v.p * 1000 / (S3 * v.v * v.pf * v.e / 100);
          return { results: [R('Full-load current', i, 'A', 1, null, true), R('Input power', v.p / (v.e / 100), 'kW', 2), R('Input kVA', v.p / (v.e / 100) / v.pf, 'kVA', 2), R('Rule of thumb (440 V)', v.p * 1.65, 'A', 0)],
            notes: ['Compare with nameplate. A measured current >110% of nameplate indicates overload, low voltage or a fault.'] };
        }
      },
      {
        id: 'start', icon: '🚀', title: 'Starting current & kVA', desc: 'Locked-rotor current and kVA drawn from the supply (DOL).',
        formula: 'Ist = FLC × (Ilr/In)    S_start = √3 × V × Ist / 1000',
        inputs: [
          { k: 'flc', l: 'Full-load current', u: 'A', v: 150, min: 0.1 }, { k: 'r', l: 'Locked-rotor ratio Ilr/In', v: 6.5, min: 1, step: 0.1, hint: 'Nameplate / datasheet (typ. 5–8; IE3 up to 8)' },
          { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 }, { k: 'pfs', l: 'Starting PF', v: 0.3, min: 0.1, max: 1, step: 0.05 }
        ],
        run: v => {
          const ist = v.flc * v.r, s = S3 * v.v * ist / 1000;
          return { results: [R('Starting current', ist, 'A', 0, null, true), R('Starting kVA', s, 'kVA', 0), R('Starting kW', s * v.pfs, 'kW', 0), R('Starting kVAR', s * Math.sin(Math.acos(v.pfs)), 'kVAR', 0)],
            notes: ['Peak asymmetrical current in the first half-cycle can reach ≈ 1.5–2.0 × Ilr (relevant to instantaneous trip settings).'] };
        }
      },
      {
        id: 'meth', icon: '🔀', title: 'DOL vs Star-Delta vs Soft starter vs VFD', desc: 'Compare line current and torque for each starting method.',
        formula: 'Y-Δ: I=⅓, T=⅓    Auto-tx tap x: I=x², T=x²    Soft starter limit: I=x, T≈(x/Ilr)²',
        inputs: [
          { k: 'flc', l: 'Full-load current', u: 'A', v: 150, min: 0.1 }, { k: 'r', l: 'Locked-rotor ratio', v: 6.5, min: 1, step: 0.1 },
          { k: 'tap', l: 'Auto-transformer tap', u: '%', v: 65, min: 10, max: 100 }, { k: 'ss', l: 'Soft-starter current limit', u: '× FLC', v: 3, min: 1, step: 0.1 },
          { k: 'ld', l: 'Load torque at standstill', u: '% of FL', v: 40, min: 0, max: 200, hint: 'Pump ≈ 10–30%, compressor ≈ 50%, loaded hoist 100%+' }
        ],
        run: v => {
          const idol = v.flc * v.r, x = v.tap / 100, sr = v.ss / v.r;
          const m = [['DOL', idol, 1, 'Simplest; highest inrush'], ['Star-Delta', idol / 3, 1 / 3, 'Open/closed transition; torque only 33%'], ['Auto-transformer', idol * x * x, x * x, `${v.tap}% tap`], ['Soft starter', v.ss * v.flc, sr * sr, 'Adjustable ramp / current limit'], ['VFD', 1.1 * v.flc, null, 'Up to 150% torque at ≤ 1.1×In']];
          const rows = m.map(a => {
            const tq = a[2] == null ? 150 : a[2] * 100;
            const loadok = a[2] == null || a[2] * 180 > v.ld; // assumes DOL start torque ≈ 180% FL
            return [a[0], a[1], (a[1] / v.flc).toFixed(2) + ' × FLC', a[2] == null ? 'up to 150%' : (a[2] * 100).toFixed(0) + '% of DOL', loadok ? '✅ can start load' : '⛔ torque too low', a[3]];
          });
          return { results: [R('DOL inrush', idol, 'A', 0), R('Y-Δ inrush', idol / 3, 'A', 0), R('Soft-starter inrush', v.ss * v.flc, 'A', 0), R('VFD inrush', 1.1 * v.flc, 'A', 0)],
            tables: [{ title: 'Method comparison (assumes DOL locked-rotor torque ≈ 180% of full-load torque)', head: ['Method', 'Line current A', 'Ratio', 'Start torque', 'Check vs load', 'Remarks'], rows, states: rows.map(r => r[4].startsWith('✅') ? 'ok' : 'bad') }],
            notes: ['Star-delta cannot start high-torque loads (cranes, loaded conveyors, compressors on load). The torque assumption can be changed on the motor datasheet.'] };
        }
      },
      {
        id: 'slip', icon: '🌀', title: 'Speed, slip & rotor frequency', desc: 'Synchronous speed, slip and rotor frequency; use measured rpm to find slip.',
        formula: 'Ns = 120·f / P    Slip % = (Ns − Nr)/Ns × 100    f_rotor = s × f',
        inputs: [
          { k: 'f', l: 'Supply frequency', opts: [[50, '50 Hz'], [60, '60 Hz']], v: 60 },
          { k: 'p', l: 'Poles', opts: [[2, '2'], [4, '4'], [6, '6'], [8, '8'], [10, '10'], [12, '12']], v: 4 },
          { k: 'nr', l: 'Rotor speed (measured / nameplate)', u: 'rpm', v: 1770, min: 1 }
        ],
        run: v => {
          const ns = 120 * v.f / v.p, s = (ns - v.nr) / ns * 100, st = s < 0 ? 'bad' : lvl(s, 5, 8);
          return { results: [R('Synchronous speed', ns, 'rpm', 0), R('Slip', s, '%', 2, st, true), R('Slip speed', ns - v.nr, 'rpm', 0), R('Rotor frequency', s / 100 * v.f, 'Hz', 2)],
            verdict: { s: st, t: s < 0 ? 'Negative slip – motor is generating/over-speed or data is wrong.' : s <= 5 ? 'Slip is in the normal range (≈1–5%).' : 'High slip – overload, low voltage, rotor bar problem or wrong rpm.' } };
        }
      },
      {
        id: 'torque', icon: '🔩', title: 'Torque', desc: 'Shaft torque from power and speed (and vice versa).',
        formula: 'T (Nm) = 9550 × P(kW) / N(rpm)',
        inputs: [{ k: 'p', l: 'Power', u: 'kW', v: 90, min: 0.001 }, { k: 'n', l: 'Speed', u: 'rpm', v: 1775, min: 1 }, { k: 'lr', l: 'Locked-rotor torque', u: '× FLT', v: 1.8, min: 0, step: 0.1 }],
        run: v => {
          const t = 9550 * v.p / v.n;
          return { results: [R('Rated torque', t, 'Nm', 1, null, true), R('Torque', t * 0.7376, 'lbf·ft', 1), R('Locked-rotor torque', t * v.lr, 'Nm', 0), R('Angular speed', 2 * PI * v.n / 60, 'rad/s', 1)] };
        }
      },
      {
        id: 'meas', icon: '📟', title: 'Efficiency & loading from measurements', desc: 'Real PF, efficiency and loading from voltage, current and a wattmeter reading.',
        formula: 'PF = P_in / (√3·V·I)    η = P_out / P_in',
        inputs: [
          { k: 'v', l: 'Measured line voltage', u: 'V', v: 438, min: 1 }, { k: 'i', l: 'Measured line current', u: 'A', v: 128, min: 0.01 },
          { k: 'pin', l: 'Measured input power', u: 'kW', v: 82, min: 0.01 }, { k: 'pout', l: 'Estimated shaft power', u: 'kW', v: 76, min: 0 },
          { k: 'in', l: 'Nameplate current', u: 'A', v: 150, min: 0.1 }
        ],
        run: v => {
          const s = S3 * v.v * v.i / 1000, pf = v.pin / s, eff = v.pout / v.pin * 100;
          return { results: [R('Power factor', pf, '', 3, pf > 1 ? 'bad' : null, true), R('Efficiency', eff, '%', 1, eff > 100 ? 'bad' : null), R('Apparent power', s, 'kVA', 2), R('Losses', v.pin - v.pout, 'kW', 2), R('Current loading', v.i / v.in * 100, '%', 0, lvl(v.i / v.in * 100, 100, 110))] };
        }
      },
      {
        id: 'ol', icon: '🛑', title: 'Overload relay setting', desc: 'Thermal relay setting and expected trip time at locked rotor.',
        formula: 'Setting ≈ 1.00–1.05 × FLA (SF 1.0)   up to 1.15–1.25 × FLA for SF ≥ 1.15 (NEC 430.32)',
        inputs: [
          { k: 'fla', l: 'Nameplate FLA', u: 'A', v: 150, min: 0.1 },
          { k: 'sf', l: 'Service factor', opts: [[1, '1.00'], [1.15, '1.15']], v: 1 },
          { k: 'cls', l: 'Trip class', opts: [[10, 'Class 10 (4–10 s)'], [20, 'Class 20 (6–20 s)'], [30, 'Class 30 (9–30 s)']], v: 10 },
          { k: 'lo', l: 'Relay range min', u: 'A', v: 100, min: 0 }, { k: 'hi', l: 'Relay range max', u: 'A', v: 160, min: 0 }
        ],
        run: v => {
          if (v.hi <= v.lo) throw new Error('Relay range max must be greater than min');
          const set = v.fla * (v.sf > 1 ? 1.1 : 1.0), max = v.fla * (v.sf > 1 ? 1.25 : 1.15);
          const inr = set >= v.lo && set <= v.hi, t = { 10: [4, 10], 20: [6, 20], 30: [9, 30] }[v.cls];
          return { results: [R('Recommended setting', set, 'A', 1, inr ? 'ok' : 'bad', true), R('Maximum allowed', max, 'A', 1), R('Setting as % of range', (set - v.lo) / (v.hi - v.lo) * 100, '%', 0), R('Trip time at 7.2×Ie', t[0] + ' – ' + t[1], 's')],
            verdict: { s: inr ? 'ok' : 'bad', t: inr ? 'Setting is inside the relay range.' : 'Relay range does not cover the required setting – choose a different relay.' }, notes: ['Set to nameplate FLA first; adjust only after confirming running current. Never increase to stop nuisance trips without finding the cause.'] };
        }
      },
      {
        id: 'therm', icon: '🔥', title: 'Starting thermal capacity', desc: 'Rough check of thermal duty during starting and number of consecutive starts.',
        formula: 'Heat per start % = (Ist² × t_start) / (Ilr² × t_stall) × 100',
        inputs: [
          { k: 'ist', l: 'Actual starting current', u: 'A', v: 600, min: 1, hint: 'Ist drawn during start (≤ locked-rotor current)' },
          { k: 'ilr', l: 'Locked-rotor current', u: 'A', v: 975, min: 1 },
          { k: 'ts', l: 'Starting time', u: 's', v: 8, min: 0.1 },
          { k: 'tc', l: 'Permissible stall time (cold)', u: 's', v: 18, min: 0.1, hint: 'Datasheet' },
          { k: 'th', l: 'Permissible stall time (hot)', u: 's', v: 12, min: 0.1 }
        ],
        run: v => {
          const u = v.ist ** 2 * v.ts / (v.ilr ** 2 * v.tc) * 100, n = Math.max(1, Math.floor(100 / u)), st = v.ts <= 0.8 * v.th ? 'ok' : v.ts < v.th ? 'warn' : 'bad';
          return { results: [R('Thermal used per start', u, '%', 1, lvl(u, 40, 70), true), R('Cold starts possible', n, '', 0), R('Start time / hot stall', v.ts / v.th * 100, '%', 0, st)],
            verdict: { s: st, t: st === 'ok' ? 'Start time is well within the hot-stall limit.' : st === 'warn' ? 'Start time close to hot-stall limit – restrict restarts.' : 'Start time exceeds hot-stall capability – motor can overheat on a hot start.' }, notes: ['Indicative only – use the motor manufacturer\'s starts-per-hour and cooling-down data.'] };
        }
      },
      {
        id: 'wind', icon: '🌡️', title: 'Winding temperature (resistance method)', desc: 'Winding temperature rise from cold and hot resistance.',
        formula: 'T2 = R2/R1 × (K + T1) − K     (K = 234.5 Cu / 225 Al)',
        inputs: [
          { k: 'r1', l: 'Cold resistance', u: 'Ω', v: 0.215, min: 0.00001, step: 'any' }, { k: 't1', l: 'Cold temperature', u: '°C', v: 25 },
          { k: 'r2', l: 'Hot resistance', u: 'Ω', v: 0.268, min: 0.00001 }, { k: 'amb', l: 'Ambient temperature', u: '°C', v: 45 },
          { k: 'k', l: 'Winding material', opts: [[234.5, 'Copper'], [225, 'Aluminium']], v: 234.5 },
          { k: 'cl', l: 'Insulation class', opts: [[130, 'B (130 °C)'], [155, 'F (155 °C)'], [180, 'H (180 °C)']], v: 155 }
        ],
        run: v => {
          const t2 = v.r2 / v.r1 * (v.k + v.t1) - v.k, st = t2 <= v.cl - 15 ? 'ok' : t2 <= v.cl ? 'warn' : 'bad';
          return { results: [R('Winding temperature', t2, '°C', 1, st, true), R('Rise over ambient', t2 - v.amb, 'K', 1), R('Class limit', v.cl, '°C', 0), R('Margin', v.cl - t2, 'K', 1, st)], verdict: { s: st, t: st === 'ok' ? 'Winding temperature within class limit with margin.' : st === 'warn' ? 'Near insulation class limit – reduce load / improve cooling. Insulation life halves per ≈10 K.' : 'Above insulation class limit.' } };
        }
      }
    ]
  });
})();
