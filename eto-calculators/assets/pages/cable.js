(function () {
  const { R, lvl, S3, std, rho, vdrop, STD_SIZES } = ETO;
  const MAT = { opts: [['Cu', 'Copper'], ['Al', 'Aluminium']], v: 'Cu' };
  const SYS = [['3', '3-phase'], ['1', 'Single-phase / 2-wire']];
  const KFAC = [[143, 'Cu – XLPE / EPR (k=143)'], [115, 'Cu – PVC (k=115)'], [94, 'Al – XLPE / EPR (k=94)'], [76, 'Al – PVC (k=76)']];
  const GRP = [[1, 1, '1 circuit'], [2, 0.80, '2 circuits'], [3, 0.70, '3 circuits'], [4, 0.65, '4 circuits'], [5, 0.60, '5 circuits'], [6, 0.57, '6 circuits'], [8, 0.52, '8 circuits'], [9, 0.50, '9 circuits'], [12, 0.45, '12 circuits'], [16, 0.41, '16 circuits'], [20, 0.38, '20 circuits']];
  const TMAX = [[60, '60 °C (PVC marine)'], [70, '70 °C (PVC)'], [85, '85 °C (EPR / HEPR)'], [90, '90 °C (XLPE / EPR)']];
  const SYSX = [['3', '3-phase AC'], ['1', 'Single-phase AC'], ['dc', 'DC (2-wire)']];
  const MODE = [['i', 'Load current (A)'], ['p', 'Load power (kW)']];
  const isac = v => v.sys !== 'dc';
  // shared inputs: system, voltage, load as current or power
  const loadInputs = (def) => [
    { k: 'sys', l: 'System', opts: SYSX, v: def.sys || '3' },
    { k: 'v', l: 'Nominal voltage (line voltage for 3-phase)', u: 'V', v: def.v || 440, min: 1 },
    { k: 'mode', l: 'Load given as', opts: MODE, v: def.mode || 'i' },
    { k: 'i', l: 'Load current', u: 'A', v: def.i, min: 0.001, show: v => v.mode === 'i' },
    { k: 'p', l: 'Load power', u: 'kW', v: def.p, min: 0.001, show: v => v.mode === 'p' },
    { k: 'pf', l: 'Power factor', v: def.pf || 0.85, min: 0.2, max: 1, step: 0.01, show: v => isac(v) },
    { k: 'eff', l: 'Efficiency of load (100 for heaters)', u: '%', v: 100, min: 10, max: 100, show: v => v.mode === 'p' }
  ];
  // design current (A) from either current or power
  const loadI = v => {
    if (v.mode === 'i') return v.i;
    const pin = v.p * 1000 / (v.eff / 100);
    return v.sys === 'dc' ? pin / v.v : v.sys === '1' ? pin / (v.v * v.pf) : pin / (S3 * v.v * v.pf);
  };
  const pfOf = v => (v.sys === 'dc' ? 1 : v.pf);
  const sysName = v => ({ '3': '3-phase', '1': 'single-phase', dc: 'DC' }[v.sys]);
  // Indicative current ratings, Cu, 3 loaded conductors, cable on tray in air (IEC 60364-5-52 method E, 30 °C ambient)
  const AMP = { 90: [26, 36, 49, 63, 86, 115, 149, 185, 225, 289, 352, 410, 473, 542, 641, 741, 868, 998, 1151], 70: [22, 30, 40, 51, 70, 94, 119, 148, 180, 232, 282, 328, 379, 434, 514, 593, 694, 799, 920] };
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
        id: 'vd', icon: '📉', title: 'Voltage drop', desc: 'Running voltage drop for an AC or DC cable run. Enter the load as current or as power.',
        formula: 'AC: Vd = k × I × L × (R·cosφ + X·sinφ) / n  (k = √3 or 2)     DC: Vd = 2 × I × L × R / n\nI = P / (√3·V·PF·η) | P / (V·PF·η) | P / (V·η) when power is given',
        inputs: loadInputs({ i: 120, p: 80 }).concat([
          { k: 'l', l: 'Cable length (one way)', u: 'm', v: 150, min: 0 },
          { k: 's', l: 'Conductor size', u: 'mm²', v: 50, min: 0.5 },
          { k: 'mat', l: 'Conductor', opts: MAT.opts, v: 'Cu' },
          { k: 't', l: 'Conductor temperature', u: '°C', v: 70, hint: 'Use max operating temp for worst case' },
          { k: 'x', l: 'Reactance X', u: 'mΩ/m', v: 0.08, min: 0, hint: '≈0.08 mΩ/m for 3-core / 0.1 for single cores', show: v => isac(v) },
          { k: 'n', l: 'Parallel cables', v: 1, min: 1, step: 1 },
          { k: 'lim', l: 'Allowed drop', u: '%', v: 5, min: 0.1, hint: 'AC power typ. 5% / lighting 6% (IEC 60092-201); DC control 2–3%' }
        ]),
        run: v => {
          const I = loadI(v), d = vdrop(v.sys, I, v.l, v.s, v.mat, v.t, v.x, pfOf(v), v.n), pc = d.v / v.v * 100, st = pc <= v.lim ? 'ok' : pc <= v.lim * 1.2 ? 'warn' : 'bad';
          return { results: [R('Voltage drop', d.v, 'V', 2, st, true), R('Voltage drop', pc, '%', 2, st), R('Design current', I, 'A', 2), R('Voltage at load', v.v - d.v, 'V', 1), R('R (at temp)', d.r, 'mΩ/m', 4), R('mV/A/m', d.v * 1000 / (I * v.l || 1), 'mV/A/m', 3)],
            verdict: { s: st, t: pc <= v.lim ? `Within the ${v.lim}% limit (${sysName(v)}).` : `Exceeds the ${v.lim}% limit – increase cable size or shorten run.` } };
        }
      },
      {
        id: 'size', icon: '📏', title: 'Cable size (current capacity + voltage drop)', desc: 'Minimum conductor size from BOTH the current-carrying capacity (derated) and the allowed voltage drop – the larger one governs. AC or DC; load as current or power.',
        formula: 'Ampacity: I/n ≤ It × Ct × Cg      Voltage drop: S ≥ ρ(T) / R_max with R_max = (Vd_allow/(k·I·L) − X·sinφ)/cosφ   (DC: Vd_allow/(2·I·L))\nSize = larger of the two (next standard size)',
        inputs: loadInputs({ i: 120, p: 80 }).concat([
          { k: 'l', l: 'Length (one way)', u: 'm', v: 150, min: 0.1 },
          { k: 'lim', l: 'Allowed drop', u: '%', v: 5, min: 0.1 },
          { k: 'mat', l: 'Conductor', opts: MAT.opts, v: 'Cu' },
          { k: 'ins', l: 'Insulation (max conductor temp)', opts: [[90, 'XLPE / EPR 90 °C'], [70, 'PVC 70 °C']], v: 90 },
          { k: 'tamb', l: 'Ambient temperature', u: '°C', v: 45, hint: 'Table ratings are for 30 °C; corrected automatically' },
          { k: 'g', l: 'Grouping (circuits bunched)', opts: GRP.map(x => [x[1], x[2] + ' → ' + x[1]]), v: 1 },
          { k: 't', l: 'Conductor temperature for drop', u: '°C', v: 70 },
          { k: 'x', l: 'Reactance X', u: 'mΩ/m', v: 0.08, min: 0, show: v => isac(v) },
          { k: 'par', l: 'Parallel cables', v: 1, min: 1, step: 1 }
        ]),
        run: v => {
          if (v.tamb >= v.ins) throw new Error('Ambient must be below conductor temperature');
          const I = loadI(v), Ic = I / v.par, k = v.sys === '3' ? S3 : 2, pf = pfOf(v), x = v.sys === 'dc' ? 0 : v.x;
          // current capacity
          const der = ct(v.ins, 30, v.tamb) * v.g, need = Ic / der, al = v.mat === 'Al' ? 0.78 : 1;
          const ia = STD_SIZES.findIndex((sz, i) => AMP[v.ins][i] * al >= need), sA = ia < 0 ? null : STD_SIZES[ia];
          // voltage drop
          const zmax = v.v * v.lim / 100 / (k * Ic * v.l), sinp = Math.sin(Math.acos(pf)), rmax = (zmax - x / 1000 * sinp) / pf;
          const sV = rmax > 0 ? std(STD_SIZES, rho(v.mat, v.t) / rmax) : null;
          if (sA == null || sV == null) return { results: [R('Design current', I, 'A', 2)], verdict: { s: 'bad', t: 'No single standard cable satisfies this – use parallel cables or a higher voltage.' } };
          const sel = Math.max(sA, sV), gov = sA > sV ? 'current capacity' : sV > sA ? 'voltage drop' : 'both equally';
          const isel = STD_SIZES.indexOf(sel), rated = AMP[v.ins][isel] * al * der * v.par, dv = vdrop(v.sys, I, v.l, sel, v.mat, v.t, x, pf, v.par), pc = dv.v / v.v * 100;
          return { results: [R('Recommended size', sel, 'mm²', 1, 'ok', true), R('Governed by', gov, ''), R('Design current', I, 'A', 2), R('Size for current capacity', sA, 'mm²', 1), R('Size for voltage drop', sV, 'mm²', 1), R('Derated capacity of selected', rated, 'A', 0, rated >= I ? 'ok' : 'bad'), R('Voltage drop with selected', pc, '%', 2, pc <= v.lim ? 'ok' : 'bad'), R('Derating factor (temp × group)', der, '', 3)],
            verdict: { s: 'ok', t: `Use ${sel} mm² per phase${v.par > 1 ? ' × ' + v.par + ' parallel cables' : ''} – ${gov === 'both equally' ? 'both criteria give the same size' : 'governed by ' + gov}.` },
            notes: ['Ampacity table is indicative (Cu, 3 loaded conductors, tray in air, IEC 60364-5-52 method E; Al ≈ 0.78×). Marine cables (IEC 60092-353/-354) have their own tables at 45 °C – confirm with the vessel cable schedule.', 'Also check short-circuit withstand (Cable page) and the breaker/overload protection.', v.sys === 'dc' ? 'DC: both conductors included in the drop; keep 24 V systems ≤ 2–3%.' : 'Power input is converted with PF and efficiency above.'] };
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
        id: 'len', icon: '↔️', title: 'Cable length effect', desc: 'Maximum cable length for an allowed voltage drop (AC or DC) and how the drop grows with length.',
        formula: 'L_max = Vd_allow / (k × I × (R·cosφ + X·sinφ))     DC: L_max = Vd_allow / (2·I·R)',
        inputs: loadInputs({ i: 80, p: 50 }).concat([
          { k: 's', l: 'Conductor size', u: 'mm²', v: 25, min: 0.5 },
          { k: 'mat', l: 'Conductor', opts: MAT.opts, v: 'Cu' },
          { k: 't', l: 'Conductor temperature', u: '°C', v: 70 },
          { k: 'x', l: 'Reactance X', u: 'mΩ/m', v: 0.08, min: 0, show: v => isac(v) },
          { k: 'lim', l: 'Allowed drop', u: '%', v: 5, min: 0.1 }
        ]),
        run: v => {
          const I = loadI(v), one = vdrop(v.sys, I, 1, v.s, v.mat, v.t, v.x, pfOf(v), 1).v, lmax = v.v * v.lim / 100 / one;
          const fs = [0.25, 0.5, 0.75, 1, 1.25, 1.5];
          const rows = fs.map(f => { const l = lmax * f, pc = one * l / v.v * 100; return [Math.round(l) + ' m', pc, pc <= v.lim * 1.0001 ? '✅ OK' : '⛔ Too long']; });
          return { results: [R('Maximum length', lmax, 'm', 0, null, true), R('Design current', I, 'A', 2), R('Drop per 100 m', one * 100 / v.v * 100, '%', 2)], tables: [{ title: 'Drop vs length', head: ['Length', 'Drop %', 'Result'], rows, states: fs.map(f => (f <= 1 ? 'ok' : 'bad')) }] };
        }
      }
    ]
  });
})();
