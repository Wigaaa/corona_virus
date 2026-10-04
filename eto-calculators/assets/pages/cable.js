(function () {
  const { R, lvl, S3, std, rho, vdrop, STD_SIZES } = ETO;
  const MAT = { opts: [['Cu', 'Copper'], ['Al', 'Aluminium']], v: 'Cu' };
  const SYS = [['3', '3-phase'], ['1', 'Single-phase / 2-wire']];
  const KFAC = [[143, 'Cu – XLPE / EPR (k=143)'], [115, 'Cu – PVC (k=115)'], [94, 'Al – XLPE / EPR (k=94)'], [76, 'Al – PVC (k=76)']];
  const GRP = [[1, 1, '1 circuit'], [2, 0.80, '2 circuits'], [3, 0.70, '3 circuits'], [4, 0.65, '4 circuits'], [5, 0.60, '5 circuits'], [6, 0.57, '6 circuits'], [8, 0.52, '8 circuits'], [9, 0.50, '9 circuits'], [12, 0.45, '12 circuits'], [16, 0.41, '16 circuits'], [20, 0.38, '20 circuits']];
  const TMAX = [[60, '60 °C (PVC marine)'], [70, '70 °C (PVC)'], [85, '85 °C (EPR / HEPR)'], [90, '90 °C (XLPE / EPR)']];
  const ct = (tmax, tref, tamb) => Math.sqrt((tmax - tamb) / (tmax - tref));

  ETO.page({
    title: 'Cable Calculations', icon: '🔌', accent: '#0891b2',
    subtitle: 'Verify whether a proposed cable is technically reasonable: current, voltage drop, derating and fault withstand.',
    refs: ['IEC 60092-352', 'IEC 60092-201', 'IEC 60364-5-52', 'IEC 60364-5-54', 'IEC 60364-4-43'],
    calcs: [
      {
        id: 'amp', icon: '🔥', title: 'Ampacity check', desc: 'Is the cable large enough after temperature and grouping corrections?',
        formula: 'Iz = It × Ct × Cg × n   with   Ct = √((θmax − θamb)/(θmax − θref))   →   Iz ≥ Ib',
        inputs: [
          { k: 'ib', l: 'Design (load) current Ib', u: 'A', v: 180, min: 0.01 },
          { k: 'it', l: 'Tabulated cable rating It (per cable)', u: 'A', v: 215, min: 0.01, hint: 'From manufacturer / IEC 60092-352 table at the reference ambient' },
          { k: 'tmax', l: 'Conductor max temperature', opts: TMAX.map(x => [x[0], x[1]]), v: 85 },
          { k: 'tref', l: 'Reference ambient of table', u: '°C', v: 45, hint: 'Marine tables: 45 °C. IEC 60364: 30 °C' },
          { k: 'tamb', l: 'Actual ambient', u: '°C', v: 50 },
          { k: 'g', l: 'Grouping (circuits bunched)', opts: GRP.map(x => [x[1], x[2] + ' → ' + x[1]]), v: 0.8 },
          { k: 'n', l: 'Parallel cables per phase', v: 1, min: 1, step: 1 }
        ],
        run: v => {
          if (v.tamb >= v.tmax) throw new Error('Ambient must be below conductor temperature');
          const c = ct(v.tmax, v.tref, v.tamb), iz = v.it * c * v.g * v.n, m = iz / v.ib, st = m >= 1.15 ? 'ok' : m >= 1 ? 'warn' : 'bad';
          return { results: [R('Derated capacity Iz', iz, 'A', 1, st, true), R('Temperature factor', c, '', 3), R('Grouping factor', v.g, '', 2), R('Margin Iz / Ib', m, '×', 2, st)],
            verdict: { s: st, t: m < 1 ? 'Cable too small – increase size or parallel cables.' : m < 1.15 ? 'Passes but with little margin.' : 'Cable adequate for current.' },
            notes: ['Also check voltage drop and short-circuit withstand. Grouping factors are IEC 60364-5-52 bunched values – use the vessel cable table where specified.'] };
        }
      },
      {
        id: 'vd', icon: '📉', title: 'Voltage drop', desc: 'Running voltage drop for a cable run (resistance + reactance).',
        formula: 'Vd = k × I × L × (R·cosφ + X·sinφ) / n    k = √3 (3-ph) or 2 (1-ph)',
        inputs: [
          { k: 'sys', l: 'System', opts: SYS, v: '3' },
          { k: 'v', l: 'Nominal voltage', u: 'V', v: 440, min: 1 },
          { k: 'i', l: 'Load current', u: 'A', v: 120, min: 0 },
          { k: 'l', l: 'Cable length (one way)', u: 'm', v: 150, min: 0 },
          { k: 's', l: 'Conductor size', u: 'mm²', v: 50, min: 0.5 },
          { k: 'mat', l: 'Conductor', opts: MAT.opts, v: 'Cu' },
          { k: 't', l: 'Conductor temperature', u: '°C', v: 70, hint: 'Use max operating temp for worst case' },
          { k: 'x', l: 'Reactance X', u: 'mΩ/m', v: 0.08, min: 0, hint: '≈0.08 mΩ/m for 3-core / 0.1 for single cores' },
          { k: 'pf', l: 'Power factor', v: 0.85, min: 0.2, max: 1, step: 0.01 },
          { k: 'n', l: 'Parallel cables', v: 1, min: 1, step: 1 },
          { k: 'lim', l: 'Allowed drop', u: '%', v: 5, min: 0.1, hint: 'Typical 5% power / 6% lighting (IEC 60092-201 total from switchboard)' }
        ],
        run: v => {
          const d = vdrop(v.sys, v.i, v.l, v.s, v.mat, v.t, v.x, v.pf, v.n), pc = d.v / v.v * 100, st = pc <= v.lim ? 'ok' : pc <= v.lim * 1.2 ? 'warn' : 'bad';
          return { results: [R('Voltage drop', d.v, 'V', 2, st, true), R('Voltage drop', pc, '%', 2, st), R('Voltage at load', v.v - d.v, 'V', 1), R('R (at temp)', d.r, 'mΩ/m', 4), R('mV/A/m', d.v * 1000 / (v.i * v.l || 1), 'mV/A/m', 3)],
            verdict: { s: st, t: pc <= v.lim ? `Within the ${v.lim}% limit.` : `Exceeds the ${v.lim}% limit – increase cable size or shorten run.` } };
        }
      },
      {
        id: 'size', icon: '📏', title: 'Cable size by voltage drop', desc: 'Minimum conductor size that meets the allowed voltage drop.',
        formula: 'R_max = (Vd_allow/(k·I·L) − X·sinφ) / cosφ     S_min = ρ(T) / R_max',
        inputs: [
          { k: 'sys', l: 'System', opts: SYS, v: '3' },
          { k: 'v', l: 'Nominal voltage', u: 'V', v: 440, min: 1 },
          { k: 'i', l: 'Load current', u: 'A', v: 120, min: 0.01 },
          { k: 'l', l: 'Length (one way)', u: 'm', v: 150, min: 0.1 },
          { k: 'lim', l: 'Allowed drop', u: '%', v: 5, min: 0.1 },
          { k: 'mat', l: 'Conductor', opts: MAT.opts, v: 'Cu' },
          { k: 't', l: 'Conductor temperature', u: '°C', v: 70 },
          { k: 'x', l: 'Reactance X', u: 'mΩ/m', v: 0.08, min: 0 },
          { k: 'pf', l: 'Power factor', v: 0.85, min: 0.2, max: 1, step: 0.01 }
        ],
        run: v => {
          const k = v.sys === '3' ? S3 : 2, zmax = v.v * v.lim / 100 / (k * v.i * v.l), sinp = Math.sin(Math.acos(v.pf));
          const rmax = (zmax - v.x / 1000 * sinp) / v.pf;
          if (rmax <= 0) return { results: [], verdict: { s: 'bad', t: 'Reactance alone exceeds the allowed drop – use parallel cables or a higher voltage.' } };
          const smin = rho(v.mat, v.t) / rmax, sel = std(STD_SIZES, smin);
          return { results: [R('Minimum area', smin, 'mm²', 1, null, true), R('Next standard size', sel, 'mm²', 1, 'ok', true), R('Max mV/A/m', zmax * 1000, 'mV/A/m', 3), R('Max R', rmax * 1000, 'mΩ/m', 4)],
            notes: ['Then confirm ampacity (derated) and short-circuit withstand. Over 300 mm² consider parallel cables.'] };
        }
      },
      {
        id: 'start', icon: '🚀', title: 'Starting voltage drop', desc: 'Voltage drop in the supply cable while a motor starts (low starting PF).',
        formula: 'Ist = FLC × LRC ratio    Vd = √3 × Ist × L × (R·cosφs + X·sinφs)',
        inputs: [
          { k: 'flc', l: 'Motor full-load current', u: 'A', v: 90, min: 0.1 },
          { k: 'lrc', l: 'Locked-rotor ratio (Ist / FLC)', v: 6.5, min: 1, step: 0.1 },
          { k: 'pfs', l: 'Starting power factor', v: 0.3, min: 0.1, max: 1, step: 0.05 },
          { k: 'v', l: 'Nominal voltage', u: 'V', v: 440, min: 1 },
          { k: 'l', l: 'Cable length', u: 'm', v: 120, min: 0 },
          { k: 's', l: 'Conductor size', u: 'mm²', v: 35, min: 0.5 },
          { k: 'mat', l: 'Conductor', opts: MAT.opts, v: 'Cu' },
          { k: 'x', l: 'Reactance X', u: 'mΩ/m', v: 0.08, min: 0 },
          { k: 'lim', l: 'Allowed cable drop at start', u: '%', v: 5, min: 0.1, hint: 'Leave margin for generator dip (total ≤ ~15–20%)' }
        ],
        run: v => {
          const ist = v.flc * v.lrc, d = vdrop('3', ist, v.l, v.s, v.mat, 20 + 50, v.x, v.pfs, 1), pc = d.v / v.v * 100, st = pc <= v.lim ? 'ok' : pc <= v.lim * 1.5 ? 'warn' : 'bad';
          return { results: [R('Starting current', ist, 'A', 1), R('Starting drop', pc, '%', 2, st, true), R('Voltage at motor', v.v - d.v, 'V', 1), R('Motor terminal voltage', 100 - pc, '%', 1)],
            verdict: { s: st, t: pc <= v.lim ? 'Starting drop acceptable.' : 'Excessive – use a larger cable, soft starter / VFD, or reduce run.' }, notes: ['Starting torque falls with V² – a 15% drop leaves ~72% of torque.'] };
        }
      },
      {
        id: 'derate', icon: '🌡️', title: 'Ambient temperature correction', desc: 'Correction factor and derated current across a range of ambient temperatures.',
        formula: 'Ct = √((θmax − θamb) / (θmax − θref))',
        inputs: [
          { k: 'tmax', l: 'Conductor max temperature', opts: TMAX.map(x => [x[0], x[1]]), v: 90 },
          { k: 'tref', l: 'Reference ambient', u: '°C', v: 45 },
          { k: 'it', l: 'Tabulated rating', u: 'A', v: 215, min: 0.1 },
          { k: 'tamb', l: 'Actual ambient', u: '°C', v: 55 }
        ],
        run: v => {
          if (v.tamb >= v.tmax) throw new Error('Ambient must be below conductor temperature');
          const rows = [30, 35, 40, 45, 50, 55, 60, 65, 70].filter(t => t < v.tmax).map(t => [t + ' °C', ct(v.tmax, v.tref, t), v.it * ct(v.tmax, v.tref, t)]);
          const c = ct(v.tmax, v.tref, v.tamb);
          return { results: [R('Correction factor', c, '', 3, null, true), R('Derated rating', v.it * c, 'A', 1)], tables: [{ title: 'Ambient table', head: ['Ambient', 'Factor', 'Rating (A)'], rows }] };
        }
      },
      {
        id: 'sc', icon: '⚡', title: 'Short-circuit withstand', desc: 'Adiabatic check: can the cable survive the fault current for the breaker clearing time?',
        formula: 'S_min = I × √t / k      I_max = k × S / √t      t_max = (k × S / I)²',
        inputs: [
          { k: 'isc', l: 'Prospective short-circuit current', u: 'kA', v: 25, min: 0.01 },
          { k: 't', l: 'Clearing time', u: 's', v: 0.3, min: 0.001, hint: 'Breaker trip time at that fault level (Isd delay / opening)' },
          { k: 'k', l: 'Conductor / insulation', opts: KFAC.map(x => [x[0], x[1]]), v: 143 },
          { k: 's', l: 'Installed cable size', u: 'mm²', v: 95, min: 0.5 }
        ],
        run: v => {
          const smin = v.isc * 1000 * Math.sqrt(v.t) / v.k, imax = v.k * v.s / Math.sqrt(v.t) / 1000, tmax = (v.k * v.s / (v.isc * 1000)) ** 2, st = v.s >= smin ? 'ok' : 'bad';
          return { results: [R('Minimum size', smin, 'mm²', 1, st, true), R('Next standard size', std(STD_SIZES, smin), 'mm²', 0), R('Withstand current of installed cable', imax, 'kA', 2, st), R('Max permissible time', tmax, 's', 3, st)],
            verdict: { s: st, t: st === 'ok' ? 'Installed cable withstands the fault.' : 'Installed cable too small for this fault duration – increase size, or use a faster / current-limiting breaker.' } };
        }
      },
      {
        id: 'earth', icon: '⏚', title: 'Earth (protective) conductor size', desc: 'Minimum protective conductor by adiabatic method and by IEC table.',
        formula: 'S_pe = √(I²·t) / k      Table: S ≤ 16 → S; 16 < S ≤ 35 → 16; S > 35 → S/2',
        inputs: [
          { k: 'sp', l: 'Phase conductor size', u: 'mm²', v: 95, min: 0.5 },
          { k: 'if', l: 'Earth fault current', u: 'kA', v: 10, min: 0.001 },
          { k: 't', l: 'Disconnection time', u: 's', v: 0.4, min: 0.001 },
          { k: 'k', l: 'Material (k)', opts: KFAC.map(x => [x[0], x[1]]), v: 143 }
        ],
        run: v => {
          const sa = v.if * 1000 * Math.sqrt(v.t) / v.k, st = v.sp <= 16 ? v.sp : v.sp <= 35 ? 16 : v.sp / 2;
          return { results: [R('Adiabatic minimum', sa, 'mm²', 1), R('Table minimum (same metal)', st, 'mm²', 1), R('Recommended (larger of both)', std(STD_SIZES, Math.max(sa, st)), 'mm²', 1, 'ok', true)],
            notes: ['Class rules (IEC 60092-352) may require the earth conductor to be at least as large as shown even for single-core cable armour / screens.'] };
        }
      },
      {
        id: 'len', icon: '↔️', title: 'Cable length effect', desc: 'Maximum cable length for an allowed voltage drop and how the drop grows with length.',
        formula: 'L_max = Vd_allow / (k × I × (R·cosφ + X·sinφ))',
        inputs: [
          { k: 'sys', l: 'System', opts: SYS, v: '3' },
          { k: 'v', l: 'Nominal voltage', u: 'V', v: 440, min: 1 },
          { k: 'i', l: 'Load current', u: 'A', v: 80, min: 0.01 },
          { k: 's', l: 'Conductor size', u: 'mm²', v: 25, min: 0.5 },
          { k: 'mat', l: 'Conductor', opts: MAT.opts, v: 'Cu' },
          { k: 't', l: 'Conductor temperature', u: '°C', v: 70 },
          { k: 'x', l: 'Reactance X', u: 'mΩ/m', v: 0.08, min: 0 },
          { k: 'pf', l: 'Power factor', v: 0.85, min: 0.2, max: 1, step: 0.01 },
          { k: 'lim', l: 'Allowed drop', u: '%', v: 5, min: 0.1 }
        ],
        run: v => {
          const one = vdrop(v.sys, v.i, 1, v.s, v.mat, v.t, v.x, v.pf, 1).v, lmax = v.v * v.lim / 100 / one;
          const rows = [0.25, 0.5, 0.75, 1, 1.25, 1.5].map(f => { const l = lmax * f, pc = one * l / v.v * 100; return [Math.round(l) + ' m', pc, pc <= v.lim ? '✅ OK' : '⛔ Too long']; });
          return { results: [R('Maximum length', lmax, 'm', 0, null, true), R('Drop per 100 m', one * 100 / v.v * 100, '%', 2)], tables: [{ title: 'Drop vs length', head: ['Length', 'Drop %', 'Result'], rows, states: [0.25, 0.5, 0.75, 1, 1.25, 1.5].map(f => f <= 1 ? 'ok' : 'bad') }] };
        }
      }
    ]
  });
})();
