(function () {
  const { R, lvl, S3, esc, res, std, STD_BREAKERS, STD_FUSES } = ETO;
  const kap = xr => 1.02 + 0.98 * Math.exp(-3 / xr);
  ETO.page({
    title: 'Short-circuit & Protection', icon: '🛡️', accent: '#dc2626',
    subtitle: 'Do not just read “Breaker = 250 A” – check the fault level, interrupting capacity, settings, selectivity and earth-fault disconnection.',
    refs: ['IEC 60909', 'IEC 60947-2', 'IEC 60092-202', 'IEC 60364-4-41', 'IEC 60269'],
    calcs: [
      {
        id: 'isc', icon: '💥', title: 'Prospective short-circuit current', desc: 'Fault level at a point fed from a transformer or generator through a cable, including motor contribution.',
        formula: 'Zs = z × V²/S   Isc = V / (√3 × √((Rs+Rc)² + (Xs+Xc)²))   Ip = κ √2 Isc',
        inputs: [
          { k: 's', l: 'Source rating', u: 'kVA', v: 1250, min: 1 }, { k: 'z', l: 'Source impedance (uk or X″d)', u: '%', v: 5, min: 0.5, hint: 'Transformer uk 4–6%; generator X″d 12–20%' },
          { k: 'xr', l: 'Source X/R', v: 10, min: 0.5, hint: 'Transformer 5–10; generator 15–30' }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 },
          { k: 'L', l: 'Cable length from source', u: 'm', v: 40, min: 0 }, { k: 'sz', l: 'Cable size (per phase)', u: 'mm²', v: 240, min: 1 }, { k: 'par', l: 'Parallel cables', v: 2, min: 1, step: 1 },
          { k: 'xc', l: 'Cable reactance', u: 'mΩ/m', v: 0.08, min: 0 }, { k: 'mf', l: 'Running motor FLC total', u: 'A', v: 300, min: 0, hint: 'Motors running at the time of fault' }
        ],
        run: v => {
          const zs = v.z / 100 * v.v * v.v / (v.s * 1000), rs = zs / Math.sqrt(1 + v.xr ** 2), xs = rs * v.xr;
          const rc = res('Cu', v.sz, 20) * v.L / v.par, xc = v.xc / 1000 * v.L / v.par;
          const zt = Math.hypot(rs + rc, xs + xc), isrc = v.v / (S3 * Math.hypot(rs, xs)), isc = v.v / (S3 * zt), im = 4 * v.mf, tot = isc + im, xrt = (xs + xc) / (rs + rc);
          return { results: [R('At source terminals', isrc / 1000, 'kA', 2), R('At fault point (source+cable)', isc / 1000, 'kA', 2), R('Motor contribution', im / 1000, 'kA', 2), R('Total Isc (rms)', tot / 1000, 'kA', 2, null, true), R('X/R at point', xrt, '', 1), R('Peak current ip', kap(xrt) * Math.SQRT2 * tot / 1000, 'kA', 1)],
            notes: ['Motor contribution ≈ 4× FLC of running motors (LV). The max fault (all DGs + transformers) governs breaker Icu; the min fault (one DG, arcing) governs trip sensitivity.'] };
        }
      },
      {
        id: 'bc', icon: '🔨', title: 'Breaker breaking-capacity check', desc: 'Is the circuit breaker able to interrupt and make the available fault current?',
        formula: 'Icu ≥ Isc    Icm ≥ n × Isc  (n per IEC 60947-2)',
        inputs: [
          { k: 'isc', l: 'Prospective fault current', u: 'kA rms', v: 38, min: 0.1 }, { k: 'icu', l: 'Breaker rated Icu (at this voltage)', u: 'kA', v: 50, min: 0.1 }, { k: 'ics', l: 'Rated Ics', u: '% of Icu', v: 100, min: 10, max: 100 },
          { k: 'xr', l: 'Fault X/R at point', v: 8, min: 0.5, hint: 'cos φ ≈ 0.1 → X/R ≈ 10' }
        ],
        run: v => {
          const n = v.icu <= 10 ? 1.7 : v.icu <= 20 ? 2.0 : v.icu <= 50 ? 2.1 : 2.2, icm = n * v.icu, need = kap(v.xr) * Math.SQRT2 * v.isc, ok1 = v.icu >= v.isc, ok2 = icm >= need, st = ok1 && ok2 ? 'ok' : 'bad', m = v.icu / v.isc;
          return { results: [R('Icu / Isc', m, '×', 2, m >= 1.25 ? 'ok' : m >= 1 ? 'warn' : 'bad', true), R('Required peak', need, 'kA', 1), R('Breaker Icm', icm, 'kA', 1, ok2 ? 'ok' : 'bad'), R('Service capacity Ics', v.icu * v.ics / 100, 'kA', 1)],
            verdict: { s: st, t: st === 'ok' ? (m < 1.25 ? 'Capacity adequate but margin is small (cascading / back-up protection should be confirmed).' : 'Breaker interrupting and making capacity is adequate.') : 'Breaker CANNOT safely interrupt this fault – replace with higher Icu breaker or add current-limiting upstream protection.' } };
        }
      },
      {
        id: 'sel', icon: '🎯', title: 'Breaker rating selection', desc: 'Choose the breaker rating for a cable and load: Ib ≤ In ≤ Iz.',
        formula: 'Ib ≤ In ≤ Iz     I2 ≤ 1.45 × Iz',
        inputs: [{ k: 'ib', l: 'Design current Ib', u: 'A', v: 180, min: 0.1 }, { k: 'iz', l: 'Cable derated capacity Iz', u: 'A', v: 230, min: 0.1 }],
        run: v => {
          const n = std(STD_BREAKERS, v.ib), ok = n <= v.iz;
          return { results: [R('Selected rating In', n, 'A', 0, ok ? 'ok' : 'bad', true), R('Ib ≤ In ≤ Iz', ok ? 'OK' : 'FAIL', '', 0, ok ? 'ok' : 'bad'), R('Adjustable Ir (0.8×In)…', 0.8 * n, 'A', 0), R('Cable utilisation Ib/Iz', v.ib / v.iz * 100, '%', 0)], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Breaker protects the cable against overload.' : 'Next breaker above Ib exceeds Iz – use a bigger cable or set Ir ≤ Iz on an adjustable breaker.' } };
        }
      },
      {
        id: 'trip', icon: '🎚️', title: 'Trip unit settings (LSI)', desc: 'Check long-time, short-time and instantaneous settings for a motor feeder.',
        formula: 'Ir ≥ Ib    Ir ≤ Iz    Ii ≥ 1.5×Ilr (no nuisance trip)    Ii ≤ 0.8 × Isc,min',
        inputs: [
          { k: 'in', l: 'Breaker frame / sensor rating In', u: 'A', v: 250, min: 1 }, { k: 'ir', l: 'Long-time setting Ir', u: '× In', v: 0.6, min: 0.2, max: 1, step: 0.05 }, { k: 'isd', l: 'Short-time Isd', u: '× Ir', v: 8, min: 1.5, step: 0.5 }, { k: 'ii', l: 'Instantaneous Ii', u: '× In', v: 10, min: 1, step: 0.5 },
          { k: 'ib', l: 'Load current Ib (motor FLC)', u: 'A', v: 150, min: 0.1 }, { k: 'lrc', l: 'Motor locked-rotor ratio', v: 6.5, min: 1, step: 0.1 }, { k: 'iz', l: 'Cable Iz', u: 'A', v: 230, min: 1 }, { k: 'iscm', l: 'Minimum fault current (far end)', u: 'A', v: 6000, min: 1 }
        ],
        run: v => {
          const Ir = v.in * v.ir, Isd = Ir * v.isd, Ii = v.in * v.ii, ilr = v.ib * v.lrc, c1 = Ir >= v.ib && Ir <= v.iz, c2 = Math.min(Ii, Isd) >= 1.5 * ilr, c3 = Ii <= 0.8 * v.iscm;
          return { results: [R('Ir (overload)', Ir, 'A', 0, c1 ? 'ok' : 'bad', true), R('Isd', Isd, 'A', 0), R('Ii', Ii, 'A', 0, c3 ? 'ok' : 'bad'), R('Motor peak start (1.5×Ilr)', 1.5 * ilr, 'A', 0, c2 ? 'ok' : 'bad')],
            tables: [{ title: 'Checks', head: ['Check', 'Result'], rows: [['Ib ≤ Ir ≤ Iz (overload & cable)', c1 ? '✅' : '⛔'], ['Short-circuit trip above motor inrush', c2 ? '✅' : '⛔ possible nuisance trip'], ['Trips within min. fault current', c3 ? '✅' : '⛔ may not trip on far-end fault']], states: [c1 ? 'ok' : 'bad', c2 ? 'ok' : 'bad', c3 ? 'ok' : 'bad'] }],
            notes: ['Motor feeders are usually protected by an MCCB with magnetic (Ii) only and a separate thermal overload relay.'] };
        }
      },
      {
        id: 'eftn', icon: '⏚', title: 'Earth-fault loop (TN) disconnection', desc: 'Is the earth-fault current large enough to trip the protective device within the required time?',
        formula: 'Zs = Ze + (R1 + R2)    Ief = U0 / Zs    Ief ≥ Ia',
        inputs: [
          { k: 'u0', l: 'Phase-to-earth voltage U0', u: 'V', v: 254, min: 1 }, { k: 'ze', l: 'Upstream loop impedance Ze', u: 'Ω', v: 0.015, min: 0 }, { k: 'sp', l: 'Phase conductor', u: 'mm²', v: 50, min: 0.5 }, { k: 'se', l: 'Earth conductor', u: 'mm²', v: 25, min: 0.5 },
          { k: 'l', l: 'Cable length', u: 'm', v: 80, min: 0 }, { k: 'ia', l: 'Trip current for required time (Ia)', u: 'A', v: 2000, min: 1, hint: 'Ii of MCCB, or fuse current for 0.4 s / 5 s' }
        ],
        run: v => {
          const r1 = res('Cu', v.sp, 70) * v.l, r2 = res('Cu', v.se, 70) * v.l, zs = v.ze + r1 + r2, ief = v.u0 / zs, ok = ief >= v.ia, zmax = v.u0 / v.ia;
          return { results: [R('Loop impedance Zs', zs, 'Ω', 4), R('Earth-fault current', ief, 'A', 0, ok ? 'ok' : 'bad', true), R('Max permitted Zs', zmax, 'Ω', 4), R('Ief / Ia', ief / v.ia, '×', 2, ok ? 'ok' : 'bad')], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Automatic disconnection achieved.' : 'Earth-fault current too low to trip – increase earth conductor, use earth-fault relay / RCD.' } };
        }
      },
      {
        id: 'efrcd', icon: '🧯', title: 'RCD / earth leakage (TT)', desc: 'Earth electrode resistance limit for an RCD.',
        formula: 'Ra × IΔn ≤ 50 V',
        inputs: [{ k: 'ra', l: 'Earth electrode resistance Ra', u: 'Ω', v: 20, min: 0 }, { k: 'idn', l: 'RCD rated residual current IΔn', u: 'mA', v: 30, min: 1 }, { k: 'ul', l: 'Touch-voltage limit', u: 'V', v: 50, min: 12 }],
        run: v => {
          const vt = v.ra * v.idn / 1000, rmax = v.ul / (v.idn / 1000), ok = vt <= v.ul;
          return { results: [R('Touch voltage', vt, 'V', 1, ok ? 'ok' : 'bad', true), R('Max Ra', rmax, 'Ω', 0), R('Margin', v.ul - vt, 'V', 1)], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'RCD protection effective.' : 'Earth resistance too high.' }, notes: ['Ship systems are normally IT (insulated) or hull-return TN – see Earthing & Insulation page.'] };
        }
      },
      {
        id: 'disc', icon: '🧩', title: 'Selectivity / discrimination (quick check)', desc: 'Rule-of-thumb check between an upstream and downstream breaker. Final proof requires the manufacturer\'s selectivity tables or TCC curves.',
        formula: 'In_up / In_down ≥ 1.6     Isd_up ≥ 1.5 × Ii_down     t_up ≥ t_down + 0.1 s',
        inputs: [
          { k: 'iu', l: 'Upstream rating', u: 'A', v: 800, min: 1 }, { k: 'isu', l: 'Upstream Isd', u: 'A', v: 6400, min: 1 }, { k: 'tu', l: 'Upstream short-time delay', u: 's', v: 0.3, min: 0 },
          { k: 'id', l: 'Downstream rating', u: 'A', v: 250, min: 1 }, { k: 'iid', l: 'Downstream Ii', u: 'A', v: 2500, min: 1 }, { k: 'td', l: 'Downstream trip time at fault', u: 's', v: 0.02, min: 0 }, { k: 'isc', l: 'Fault current at downstream board', u: 'A', v: 30000, min: 1 }
        ],
        run: v => {
          const c1 = v.iu / v.id >= 1.6, c2 = v.isu >= 1.5 * v.iid, c3 = v.tu >= v.td + 0.1, tot = c1 && (c2 || c3);
          return { results: [R('Rating ratio', v.iu / v.id, '×', 2, c1 ? 'ok' : 'bad'), R('Isd / Ii ratio', v.isu / v.iid, '×', 2, c2 ? 'ok' : 'warn'), R('Time margin', v.tu - v.td, 's', 2, c3 ? 'ok' : 'bad')],
            verdict: { s: tot ? 'ok' : 'bad', t: tot ? 'Likely selective – confirm with manufacturer tables.' : 'Selectivity doubtful – upstream may trip together with downstream. Review settings (increase time delay / Isd).' } };
        }
      },
      {
        id: 'fuse', icon: '🔗', title: 'Fuse rating', desc: 'Guideline fuse sizes for a motor or cable feeder (always confirm on the fuse time-current curve).',
        formula: 'aM: In ≥ FLC     gG (motor): In ≈ k × FLC with k = 1.6 / 2.0 / 2.5 by starting time     In ≤ Iz',
        inputs: [
          { k: 'flc', l: 'Motor FLC', u: 'A', v: 90, min: 0.1 }, { k: 'ts', l: 'Starting time', opts: [[1.6, '≤ 3 s'], [2, '3 – 10 s'], [2.5, '10 – 20 s']], v: 2 }, { k: 'iz', l: 'Cable Iz', u: 'A', v: 160, min: 1 }, { k: 'lrc', l: 'Locked-rotor ratio', v: 6.5, min: 1, step: 0.1 }
        ],
        run: v => {
          const am = std(STD_FUSES, v.flc * 1.0), gg = std(STD_FUSES, v.flc * v.ts);
          return { results: [R('aM fuse (motor)', am, 'A', 0, am <= v.iz ? 'ok' : 'warn', true), R('gG fuse', gg, 'A', 0, gg <= v.iz ? 'ok' : 'warn'), R('Starting current', v.flc * v.lrc, 'A', 0)], notes: ['aM fuses give short-circuit protection only – thermal overload relay is mandatory.', 'gG fuse with In > Iz fails cable overload protection – use aM + overload relay.'] };
        }
      },
      {
        id: 'mprot', icon: '🧰', title: 'Motor protection settings', desc: 'Starting-point protection settings for a DOL motor feeder.',
        formula: 'OL = 1.0–1.05×FLC   SC = 10–14×FLC   EF = 10–30% FLC   Stall = < t_stall',
        inputs: [{ k: 'flc', l: 'Motor FLC', u: 'A', v: 90, min: 0.1 }, { k: 'lrc', l: 'Locked-rotor ratio', v: 6.5, min: 1, step: 0.1 }, { k: 'tst', l: 'Hot stall time', u: 's', v: 12, min: 1 }, { k: 'tsr', l: 'Start time', u: 's', v: 6, min: 0.1 }],
        run: v => {
          const rows = [['Thermal overload', (1.0 * v.flc).toFixed(1) + ' – ' + (1.05 * v.flc).toFixed(1) + ' A', 'Class 10 / 20 per start time'], ['Magnetic / short-circuit', (Math.max(10, 1.5 * v.lrc) * v.flc).toFixed(0) + ' A (' + Math.max(10, 1.5 * v.lrc).toFixed(1) + '×FLC)', 'Above peak inrush'], ['Earth fault', Math.max(0.5, 0.1 * v.flc).toFixed(1) + ' – ' + (0.3 * v.flc).toFixed(1) + ' A', 'Residual CT, 0.1–0.3 s'], ['Stall / locked rotor', (Math.min(0.8 * v.tst, v.tsr * 1.5)).toFixed(1) + ' s at ' + (v.lrc * v.flc * 0.8).toFixed(0) + ' A', 'Trip before hot-stall time'], ['Under-voltage', '70–80% Un, 1–3 s', 'Restart philosophy dependent'], ['PTC / PT100', 'Class F ≈ 140 °C alarm / 155 °C trip', 'Per datasheet']];
          return { results: [R('Thermal overload setting', v.flc, 'A', 1, null, true), R('Instantaneous (typical)', Math.max(10, 1.5 * v.lrc) * v.flc, 'A', 0)], tables: [{ title: 'Typical starting settings', head: ['Function', 'Setting', 'Comment'], rows }], notes: ['Final values come from the protection co-ordination study of the vessel.'] };
        }
      }
    ]
  });
})();
