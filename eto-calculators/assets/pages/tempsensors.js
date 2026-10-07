(function () {
  const { R, lvl, res } = ETO;
  const A = 3.9083e-3, B = -5.775e-7, C = -4.183e-12;
  const rtd = (t, r0) => r0 * (1 + A * t + B * t * t + (t < 0 ? C * (t - 100) * t ** 3 : 0));
  const rtdInv = (r, r0) => { if (r >= r0) return (-A + Math.sqrt(A * A - 4 * B * (1 - r / r0))) / (2 * B); let t = (r / r0 - 1) / A; for (let i = 0; i < 50; i++) { const f = rtd(t, r0) - r, d = r0 * (A + 2 * B * t + C * (4 * t ** 3 - 300 * t * t)); t -= f / d; } return t; };
  const poly = (c, t) => c.reduce((s, k, i) => s + k * t ** i, 0);
  const K_POS = [-1.7600413686e-2, 3.8921204975e-2, 1.8558770032e-5, -9.9457592874e-8, 3.1840945719e-10, -5.6072844889e-13, 5.6075059059e-16, -3.2020720003e-19, 9.7151147152e-23, -1.2104721275e-26];
  const K_NEG = [0, 3.9450128025e-2, 2.3622373598e-5, -3.2858906784e-7, -4.9904828777e-9, -6.7509059173e-11, -5.7410327428e-13, -3.1088872894e-15, -1.0451609365e-17, -1.9889266878e-20, -1.6322697486e-23];
  const J = [0, 5.0381187815e-2, 3.0475836930e-5, -8.5681065720e-8, 1.3228195295e-10, -1.7052958337e-13, 2.0948090697e-16, -1.2538395336e-19, 1.5631725697e-23];
  const TC = { K: { E: t => (t >= 0 ? poly(K_POS, t) + 0.1185976 * Math.exp(-1.183432e-4 * (t - 126.9686) ** 2) : poly(K_NEG, t)), lo: -270, hi: 1372 }, J: { E: t => poly(J, t), lo: -210, hi: 760 } };
  const tcInv = (type, e) => { const T = TC[type]; let lo = T.lo, hi = T.hi; if (e < T.E(lo) || e > T.E(hi)) return NaN; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (T.E(m) < e) lo = m; else hi = m; } return (lo + hi) / 2; };
  ETO.page({
    title: 'Temperature Sensors', icon: '🌡️', accent: '#e11d48',
    subtitle: 'RTD and thermocouple conversions using the standard reference functions (IEC 60751, IEC 60584 / NIST ITS-90), plus wiring errors and motor PTC checks.',
    refs: ['IEC 60751', 'IEC 60584-1', 'NIST ITS-90', 'IEC 60947-8'],
    calcs: [
      {
        id: 'pt', icon: '🌡️', title: 'Pt100 / Pt1000 resistance ↔ temperature', desc: 'Callendar–Van Dusen equation (IEC 60751, α = 0.00385) with tolerance classes.',
        formula: 'R(t) = R0[1 + At + Bt² + C(t − 100)t³]   (C = 0 for t ≥ 0)   A = 3.9083e-3, B = −5.775e-7, C = −4.183e-12',
        inputs: [{ k: 'r0', l: 'Sensor', opts: [[100, 'Pt100'], [500, 'Pt500'], [1000, 'Pt1000']], v: 100 }, { k: 'm', l: 'Convert', opts: [['r', 'Resistance → temperature'], ['t', 'Temperature → resistance']], v: 'r' }, { k: 'x', l: 'Value (Ω or °C)', v: 119.4 }],
        run: v => {
          const t = v.m === 'r' ? rtdInv(v.x, v.r0) : v.x, r = v.m === 'r' ? v.x : rtd(v.x, v.r0); if (t < -200 || t > 850) throw new Error('Outside the IEC 60751 range (−200 … 850 °C)');
          return { results: [R('Temperature', t, '°C', 2, null, v.m === 'r'), R('Resistance', r, 'Ω', 3, null, v.m === 't'), R('Sensitivity at this point', v.r0 * (A + 2 * B * t), 'Ω/°C', 4), R('Class AA tolerance', 0.1 + 0.0017 * Math.abs(t), '± °C', 2), R('Class A tolerance', 0.15 + 0.002 * Math.abs(t), '± °C', 2), R('Class B tolerance', 0.3 + 0.005 * Math.abs(t), '± °C', 2)], notes: ['Open-circuit reads very high (> 400 Ω for Pt100) and short-circuit ≈ 0 Ω – both should raise a sensor-fault alarm.'] };
        }
      },
      {
        id: 'lead', icon: '🧵', title: 'RTD lead-wire error (2 / 3 / 4-wire)', desc: 'How much the cable adds to the reading for each wiring method.',
        formula: '2-wire error ≈ R_leads / (R0 × 0.00385) °C     3-wire: only the lead imbalance counts     4-wire: ≈ 0',
        inputs: [{ k: 'r0', l: 'Sensor', opts: [[100, 'Pt100'], [1000, 'Pt1000']], v: 100 }, { k: 'l', l: 'Cable length (one way)', u: 'm', v: 50, min: 0 }, { k: 's', l: 'Conductor size', u: 'mm²', v: 0.75, min: 0.1 }, { k: 'imb', l: '3-wire lead imbalance', u: '%', v: 2, min: 0 }],
        run: v => {
          const rl = v.l * res('Cu', v.s, 20), sens = v.r0 * 0.00385, e2 = 2 * rl / sens, e3 = rl * v.imb / 100 / sens;
          return { results: [R('Resistance per lead', rl, 'Ω', 3), R('2-wire error', e2, '°C', 2, lvl(e2, 0.5, 2), true), R('3-wire error', e3, '°C', 3, lvl(e3, 0.5, 2)), R('4-wire error', 0, '°C', 0, 'ok')], notes: ['Pt1000 reduces lead error 10× compared with Pt100 for 2-wire connections.'] };
        }
      },
      {
        id: 'tc', icon: '🔥', title: 'Thermocouple type K / J (with cold-junction compensation)', desc: 'Convert a measured thermocouple voltage to temperature (correcting for the reference / terminal temperature), or temperature to emf.',
        formula: 'E(T_hot) = E_measured + E(T_cold)   →   T_hot = E⁻¹(…)   NIST ITS-90 reference functions',
        inputs: [{ k: 'ty', l: 'Type', opts: [['K', 'Type K (NiCr-NiAl)'], ['J', 'Type J (Fe-CuNi)']], v: 'K' }, { k: 'm', l: 'Convert', opts: [['e', 'Measured mV → temperature'], ['t', 'Temperature → emf (mV)']], v: 'e' }, { k: 'x', l: 'Value (mV or °C)', v: 19.5 }, { k: 'tc', l: 'Cold-junction (terminal) temperature', u: '°C', v: 30 }],
        run: v => {
          const T = TC[v.ty]; if (v.tc < T.lo || v.tc > T.hi) throw new Error('Cold-junction temperature out of range');
          if (v.m === 'e') { const et = v.x + T.E(v.tc), t = tcInv(v.ty, et); if (!isFinite(t)) throw new Error('emf outside the type ' + v.ty + ' range'); return { results: [R('Hot-junction temperature', t, '°C', 1, null, true), R('Total emf (referred to 0 °C)', et, 'mV', 3), R('Error if CJC ignored', t - tcInv(v.ty, v.x), '°C', 1, 'warn')] }; }
          if (v.x < T.lo || v.x > T.hi) throw new Error('Temperature outside the type ' + v.ty + ' range');
          return { results: [R('emf at 0 °C reference', T.E(v.x), 'mV', 3, null, true), R('emf measured with cold junction at ' + v.tc + ' °C', T.E(v.x) - T.E(v.tc), 'mV', 3)] };
        }
      },
      {
        id: 'ptc', icon: '🧯', title: 'Motor PTC thermistor chain check', desc: 'Interpret a cold resistance reading of a motor PTC chain (DIN 44081/44082 sensors, IEC 60947-8 relays).',
        formula: 'Cold: ≤ 250 Ω per sensor (≤ 750 Ω for 3 in series)   relay trips ≈ 2.7–3.1 kΩ, resets ≈ 1.5–1.65 kΩ, short < 20 Ω',
        inputs: [{ k: 'n', l: 'Sensors in series', opts: [[1, '1'], [3, '3 (one per phase)'], [6, '6 (3 + 3)']], v: 3 }, { k: 'r', l: 'Measured chain resistance', u: 'Ω', v: 310, min: 0 }],
        run: v => {
          const cold = 250 * v.n, s = v.r < 20 ? ['bad', 'Short circuit in sensor chain – motor thermal protection lost.'] : v.r <= cold ? ['ok', 'Healthy (cold) – below ' + cold + ' Ω.'] : v.r < 1500 ? ['warn', 'Higher than normal cold value – sensor warming or degraded / loose connection.'] : v.r < 2700 ? ['warn', 'Near trip zone – winding hot or sensor faulty.'] : v.r > 20000 ? ['bad', 'Open circuit – broken sensor / wiring (relay will show trip).'] : ['bad', 'In trip zone – winding over-temperature (if cold motor: faulty sensor).'];
          return { results: [R('Chain resistance', v.r, 'Ω', 0, s[0], true), R('Max healthy cold value', cold, 'Ω', 0)], verdict: { s: s[0], t: s[1] }, notes: ['Never megger or apply > 2.5 V to PTC sensors – use a low-voltage ohmmeter.'] };
        }
      }
    ]
  });
})();
