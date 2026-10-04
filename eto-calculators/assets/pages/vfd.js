(function () {
  const { R, lvl, S3 } = ETO;
  const PI = Math.PI;
  const HARM = { 6: [5, 7, 11, 13, 17, 19, 23, 25], 12: [11, 13, 23, 25, 35, 37], 18: [17, 19, 35, 37], 24: [23, 25, 47, 49] };
  ETO.page({
    title: 'VFD / Drive Calculations', icon: '🎛️', accent: '#4f46e5',
    subtitle: 'Drive and motor sizing, speed / torque, DC link, braking resistors, regeneration, harmonics and affinity laws.',
    refs: ['IEC 61800-2 / 61800-3', 'IEC 60034-17', 'IEC 60092-301', 'IEEE 519'],
    calcs: [
      {
        id: 'size', icon: '📏', title: 'VFD loading & sizing', desc: 'Is the drive current rating adequate for the motor (with ambient derating)?',
        formula: 'I_motor = P/(√3·V·PF·η)    Load % = I_motor / I_vfd(derated)',
        inputs: [
          { k: 'p', l: 'Motor power', u: 'kW', v: 110, min: 0.1 }, { k: 'v', l: 'Motor voltage', u: 'V', v: 440, min: 1 }, { k: 'pf', l: 'Motor PF', v: 0.87, min: 0.1, max: 1, step: 0.01 }, { k: 'e', l: 'Motor efficiency', u: '%', v: 94, min: 1, max: 100 },
          { k: 'iv', l: 'VFD continuous output current', u: 'A', v: 210, min: 0.1 }, { k: 'amb', l: 'Ambient / cabinet air temperature', u: '°C', v: 45 }, { k: 'ra', l: 'Rated ambient of drive', u: '°C', v: 40 }, { k: 'dr', l: 'Derating above rated ambient', u: '%/°C', v: 1.5, min: 0, step: 0.1 }
        ],
        run: v => {
          const im = v.p * 1000 / (S3 * v.v * v.pf * v.e / 100), der = Math.max(0, v.amb - v.ra) * v.dr, ie = v.iv * (1 - der / 100), ld = im / ie * 100, st = lvl(ld, 85, 100);
          return { results: [R('Motor current', im, 'A', 1), R('Drive effective rating', ie, 'A', 1), R('Drive loading', ld, '%', 0, st, true), R('Overload available (150% × 60 s)', 1.5 * ie, 'A', 0)], verdict: { s: st, t: ld > 100 ? 'Drive undersized for this ambient.' : ld > 85 ? 'High loading – little headroom for overload / ageing.' : 'Drive sizing adequate.' }, notes: ['Check heavy-duty (150%/60 s) vs normal-duty (110%/60 s) rating: size on motor current, not just kW.'] };
        }
      },
      {
        id: 'spd', icon: '🌀', title: 'Speed, V/f & torque', desc: 'Motor speed, output voltage and torque capability at a drive frequency.',
        formula: 'N = 120·f/P × (1 − slip)    V = V_rated × f/f_base (≤ f_base)    T ∝ 1 (constant torque) / f_base/f (field weakening)',
        inputs: [
          { k: 'f', l: 'Output frequency', u: 'Hz', v: 45, min: 0.1 }, { k: 'fb', l: 'Base frequency', u: 'Hz', v: 60, min: 1 }, { k: 'p', l: 'Poles', opts: [[2, '2'], [4, '4'], [6, '6'], [8, '8']], v: 4 },
          { k: 'sl', l: 'Slip at rated load', u: '%', v: 1.5, min: 0, max: 10 }, { k: 'vr', l: 'Rated motor voltage', u: 'V', v: 440, min: 1 }
        ],
        run: v => {
          const ns = 120 * v.f / v.p, n = ns * (1 - v.sl / 100), vo = Math.min(v.vr, v.vr * v.f / v.fb), tq = v.f <= v.fb ? 100 : v.fb / v.f * 100;
          return { results: [R('Synchronous speed', ns, 'rpm', 0), R('Shaft speed (loaded)', n, 'rpm', 0, null, true), R('Output voltage', vo, 'V', 0), R('V/f ratio', vo / v.f, 'V/Hz', 2), R('Torque capability', tq, '%', 0, tq < 100 ? 'warn' : 'ok')], notes: ['If a motor does not reach the expected speed check: current limit, DC-link voltage sag, V/f boost, motor overload, wrong max-frequency parameter.'] };
        }
      },
      {
        id: 'tof', icon: '🎯', title: 'Frequency for required speed', desc: 'Drive frequency required to reach a target shaft speed.',
        formula: 'f = N × P / (120 × (1 − slip))',
        inputs: [{ k: 'n', l: 'Target speed', u: 'rpm', v: 1200, min: 1 }, { k: 'p', l: 'Poles', opts: [[2, '2'], [4, '4'], [6, '6'], [8, '8']], v: 4 }, { k: 'sl', l: 'Slip', u: '%', v: 1.5, min: 0 }],
        run: v => ({ results: [R('Required frequency', v.n * v.p / (120 * (1 - v.sl / 100)), 'Hz', 2, null, true)] })
      },
      {
        id: 'acc', icon: '⏱️', title: 'Acceleration / deceleration time', desc: 'Time to reach speed for a given inertia and torque, and kinetic energy.',
        formula: 't = J·ω / T_acc    ω = 2πN/60    E = ½·J·ω²',
        inputs: [
          { k: 'j', l: 'Total inertia (motor + load @ motor shaft)', u: 'kg·m²', v: 6, min: 0.0001 }, { k: 'n', l: 'Final speed', u: 'rpm', v: 1780, min: 1 }, { k: 'p', l: 'Motor rated power', u: 'kW', v: 110, min: 0.1 }, { k: 'ta', l: 'Accelerating torque available', u: '% of rated', v: 100, min: 1 }, { k: 'tl', l: 'Average load torque', u: '% of rated', v: 30, min: 0 }
        ],
        run: v => {
          const w = 2 * PI * v.n / 60, tr = v.p * 1000 / w, net = (v.ta - v.tl) / 100 * tr, t = net > 0 ? v.j * w / net : Infinity;
          return { results: [R('Acceleration time', t, 's', 1, t > 30 ? 'warn' : null, true), R('Rated torque', tr, 'Nm', 0), R('Net accelerating torque', net, 'Nm', 0), R('Kinetic energy', 0.5 * v.j * w * w / 1000, 'kJ', 1)], notes: ['Set VFD ramp ≥ this time or the drive will go into current limit / DC-bus overvoltage on decel.'] };
        }
      },
      {
        id: 'dc', icon: '🔋', title: 'DC-link voltage levels', desc: 'Typical DC-bus and chopper levels for a 6-pulse diode front-end.',
        formula: 'Vdc = 1.35 × V_LL (average)    peak = 1.414 × V_LL    chopper ≈ 1.3×Vdc    OV trip ≈ 1.38×Vdc',
        inputs: [{ k: 'v', l: 'Line voltage', u: 'V', v: 440, min: 1 }, { k: 'c', l: 'DC-link capacitance', u: 'mF', v: 15, min: 0 }, { k: 'dv', l: 'Measured DC voltage', u: 'V', v: 590, min: 0 }],
        run: v => {
          const vdc = 1.35 * v.v, st = Math.abs(v.dv - vdc) / vdc <= 0.06 ? 'ok' : v.dv < vdc * 0.9 ? 'bad' : 'warn';
          return { results: [R('Nominal DC bus', vdc, 'V', 0, null, true), R('Peak', 1.414 * v.v, 'V', 0), R('Brake chopper ON (typ.)', 1.3 * vdc, 'V', 0), R('Over-voltage trip (typ.)', 1.38 * vdc, 'V', 0), R('Under-voltage trip (typ.)', 0.7 * vdc, 'V', 0), R('Capacitor energy at nominal', 0.5 * v.c / 1000 * vdc * vdc / 1000, 'kJ', 2), R('Measured vs nominal', (v.dv / vdc - 1) * 100, '%', 1, st)], notes: ['Thresholds are typical – use the drive manual parameters. Low DC bus at no load → failing diodes, input phase loss or weak capacitors.'] };
        }
      },
      {
        id: 'brk', icon: '🛑', title: 'Braking resistor', desc: 'Resistor value, average power and peak current for dynamic braking.',
        formula: 'R_max = V_chopper² / P_peak     P_avg = P_peak × duty     I_peak = V_chopper / R',
        inputs: [
          { k: 'p', l: 'Motor power', u: 'kW', v: 110, min: 0.1 }, { k: 'tq', l: 'Braking torque required', u: '% of rated', v: 100, min: 1 }, { k: 'eta', l: 'Drive + motor efficiency', v: 0.9, min: 0.5, max: 1, step: 0.01 }, { k: 'vc', l: 'Chopper ON voltage', u: 'V', v: 780, min: 100 },
          { k: 'duty', l: 'Braking duty cycle', u: '%', v: 10, min: 0.1, max: 100 }, { k: 'tb', l: 'Braking time per event', u: 's', v: 8, min: 0.1 }, { k: 'rs', l: 'Selected resistor', u: 'Ω', v: 5.0, min: 0.1 }, { k: 'rmin', l: 'Drive chopper minimum R', u: 'Ω', v: 4.0, min: 0 }
        ],
        run: v => {
          const pb = v.p * v.tq / 100 * v.eta, rmax = v.vc ** 2 / (pb * 1000), pavg = pb * v.duty / 100, ip = v.vc / v.rs, pr = v.vc ** 2 / v.rs / 1000, ok = v.rs <= rmax && v.rs >= v.rmin;
          return { results: [R('Peak braking power', pb, 'kW', 1), R('Max resistor value', rmax, 'Ω', 2, null, true), R('Average resistor power', pavg, 'kW', 1), R('Peak current', ip, 'A', 0), R('Peak power at selected R', pr, 'kW', 1, pr >= pb ? 'ok' : 'warn'), R('Energy per event', pb * v.tb, 'kJ', 0)],
            verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Selected resistor is within the allowed band.' : v.rs > rmax ? 'Resistor too high – braking power insufficient (DC-bus overvoltage on decel).' : 'Resistor below chopper minimum – risk of chopper damage.' }, notes: ['Resistor rating must satisfy both continuous average power and short-time energy (pulse rating); fit thermal switch.'] };
        }
      },
      {
        id: 'regen', icon: '♻️', title: 'Regenerative energy', desc: 'Energy returned by a decelerating load.',
        formula: 'E = ½·J·(ω1² − ω2²)    P_avg = E / t',
        inputs: [{ k: 'j', l: 'Inertia', u: 'kg·m²', v: 20, min: 0.001 }, { k: 'n1', l: 'Initial speed', u: 'rpm', v: 1780, min: 0 }, { k: 'n2', l: 'Final speed', u: 'rpm', v: 0, min: 0 }, { k: 't', l: 'Deceleration time', u: 's', v: 10, min: 0.1 }, { k: 'eta', l: 'Efficiency of return path', v: 0.85, min: 0.1, max: 1, step: 0.01 }],
        run: v => {
          const w1 = 2 * PI * v.n1 / 60, w2 = 2 * PI * v.n2 / 60, e = 0.5 * v.j * (w1 * w1 - w2 * w2) / 1000 * v.eta;
          return { results: [R('Recovered energy', e, 'kJ', 1, null, true), R('Average braking power', e / v.t, 'kW', 1), R('Energy', e / 3600, 'kWh', 3)] };
        }
      },
      {
        id: 'io', icon: '🔁', title: 'Input / output power & losses', desc: 'Power flow from shaft back to the supply, and heat produced.',
        formula: 'P_in = P_shaft / (η_motor × η_vfd)',
        inputs: [{ k: 'p', l: 'Shaft power', u: 'kW', v: 110, min: 0.1 }, { k: 'em', l: 'Motor efficiency', u: '%', v: 94, min: 1, max: 100 }, { k: 'ev', l: 'VFD efficiency', u: '%', v: 97, min: 1, max: 100 }, { k: 'v', l: 'Supply voltage', u: 'V', v: 440, min: 1 }, { k: 'dpf', l: 'VFD input displacement PF', v: 0.97, min: 0.5, max: 1, step: 0.01 }],
        run: v => {
          const pm = v.p / (v.em / 100), pin = pm / (v.ev / 100);
          return { results: [R('Motor input (VFD output)', pm, 'kW', 1), R('VFD input power', pin, 'kW', 1, null, true), R('Supply current', pin * 1000 / (S3 * v.v * v.dpf), 'A', 0), R('Motor loss', pm - v.p, 'kW', 2), R('VFD loss (heat)', pin - pm, 'kW', 2), R('Total loss', pin - v.p, 'kW', 2)] };
        }
      },
      {
        id: 'harm', icon: '〰️', title: 'Input current & harmonic spectrum', desc: 'Drive input current including harmonics, true PF and the characteristic harmonic orders.',
        formula: 'I_rms = I1 × √(1 + THDi²)    PF_true = DPF / √(1 + THDi²)    h = k×pulses ± 1',
        inputs: [
          { k: 'p', l: 'VFD input power', u: 'kW', v: 120, min: 0.1 }, { k: 'v', l: 'Supply voltage', u: 'V', v: 440, min: 1 }, { k: 'dpf', l: 'Displacement PF', v: 0.97, min: 0.5, max: 1, step: 0.01 }, { k: 'thd', l: 'Input THDi', u: '%', v: 35, min: 0 }, { k: 'pul', l: 'Rectifier', opts: [[6, '6-pulse'], [12, '12-pulse'], [18, '18-pulse'], [24, '24-pulse']], v: 6 }
        ],
        run: v => {
          const i1 = v.p * 1000 / (S3 * v.v * v.dpf), th = v.thd / 100, irms = i1 * Math.sqrt(1 + th * th);
          const rows = HARM[v.pul].map(h => [h, (100 / h).toFixed(1) + ' %', (i1 * 1 / h).toFixed(1) + ' A']);
          return { results: [R('Fundamental current', i1, 'A', 1), R('RMS current', irms, 'A', 1, null, true), R('True power factor', v.dpf / Math.sqrt(1 + th * th), '', 3), R('Apparent power', S3 * v.v * irms / 1000, 'kVA', 1)], tables: [{ title: 'Ideal characteristic harmonics (≈ 1/h; real values are lower with reactors)', head: ['Order h', 'Ideal magnitude', 'Ideal current'], rows }] };
        }
      },
      {
        id: 'aff', icon: '💨', title: 'Affinity laws (pumps / fans)', desc: 'Flow, head and power at reduced speed – the main benefit of a VFD.',
        formula: 'Q ∝ N    H ∝ N²    P ∝ N³',
        inputs: [{ k: 'p', l: 'Rated power', u: 'kW', v: 75, min: 0.1 }, { k: 'q', l: 'Rated flow', u: 'm³/h', v: 300, min: 0 }, { k: 'h', l: 'Rated head', u: 'm', v: 40, min: 0 }, { k: 'n', l: 'Speed', u: '% of rated', v: 80, min: 1, max: 120 }],
        run: v => { const x = v.n / 100; return { results: [R('Flow', v.q * x, 'm³/h', 1), R('Head', v.h * x * x, 'm', 1), R('Power', v.p * x ** 3, 'kW', 1, null, true), R('Energy saving vs full speed', (1 - x ** 3) * 100, '%', 0, 'ok')] }; }
      }
    ]
  });
})();
