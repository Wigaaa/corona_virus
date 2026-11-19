(function () {
  const { R, units: U } = ETO;
  const PI = Math.PI;
  const awgD = n => 0.127 * Math.pow(92, (36 - n) / 39);              // mm
  const awgA = n => PI / 4 * awgD(n) ** 2;                            // mm²
  const awgName = n => (n >= 0 ? String(n) : (1 - n) + '/0');          // -3 → 4/0
  ETO.page({
    title: 'Unit Converter – Electrical & Marine', icon: '🔁', accent: '#9333ea',
    subtitle: 'Electrical quantity conversions, AWG ↔ mm², waveform values, decibels and marine fuel / passage helpers.',
    refs: ['ASTM B258 (AWG)', 'IEC 60228', 'IEC 60027', 'SI (BIPM)'],
    calcs: [
      U({ id: 'prefix', icon: '🔟', title: 'SI prefix converter', desc: 'Convert between prefixes: V ↔ kV ↔ mV, A ↔ mA, F ↔ µF, H ↔ mH, Hz ↔ kHz…', v: 4700, from: 'n', to: 'u', units: [['T', 'tera (T) ×10¹²', 1e12], ['G', 'giga (G) ×10⁹', 1e9], ['M', 'mega (M) ×10⁶', 1e6], ['k', 'kilo (k) ×10³', 1e3], ['n1', 'unit (×1)', 1], ['m', 'milli (m) ×10⁻³', 1e-3], ['u', 'micro (µ) ×10⁻⁶', 1e-6], ['n', 'nano (n) ×10⁻⁹', 1e-9], ['p', 'pico (p) ×10⁻¹²', 1e-12]], notes: ['Example: 4700 nF = 4.7 µF. Mind the case: M = mega, m = milli.'] }),
      {
        id: 'awg', icon: '🧵', title: 'AWG → mm² / diameter / resistance', desc: 'American Wire Gauge to metric. Use −1 for 2/0, −2 for 3/0, −3 for 4/0, 0 for 1/0 (“0” gauge is 1/0).',
        formula: 'd(mm) = 0.127 × 92^((36 − n)/39)     A = π/4·d²     1 kcmil = 0.5067 mm²',
        inputs: [{ k: 'n', l: 'AWG number (4/0 = −3 … 40)', v: 4, min: -3, max: 40, step: 1 }],
        run: v => {
          const d = awgD(v.n), a = awgA(v.n), rows = [18, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1, 0, -1, -2, -3].map(n => [awgName(n), awgA(n), awgD(n), 0.01724 / awgA(n) * 1000]);
          const std = ETO.STD_SIZES.reduce((p, c) => (Math.abs(c - a) < Math.abs(p - a) ? c : p));
          return { results: [R('AWG ' + awgName(v.n) + ' area', a, 'mm²', 3, null, true), R('Diameter', d, 'mm', 3), R('Copper resistance @20 °C (theoretical)', 0.01724 / a * 1000, 'Ω/km', 3), R('kcmil equivalent', a / 0.5067075, 'kcmil', 1), R('Nearest metric size', std, 'mm²', 1)],
            tables: [{ title: 'Common AWG sizes', head: ['AWG', 'Area mm²', 'Diameter mm', 'R Ω/km'], rows }], notes: ['Resistance uses solid-copper resistivity; stranded conductors are slightly higher (see Cable page for IEC 60228 values).'] };
        }
      },
      {
        id: 'mm2awg', icon: '🧶', title: 'mm² → AWG / kcmil', desc: 'Find the equivalent AWG for a metric cable size.',
        formula: 'd = √(4A/π)     n = 36 − 39·ln(d/0.127)/ln(92)',
        inputs: [{ k: 'a', l: 'Cross-section', u: 'mm²', v: 35, min: 0.01 }],
        run: v => {
          const d = Math.sqrt(4 * v.a / PI), n = 36 - 39 * Math.log(d / 0.127) / Math.log(92), nn = Math.round(n);
          return { results: [R('Exact AWG', n, '', 2, null, true), R('Nearest AWG', nn >= -3 ? 'AWG ' + awgName(Math.max(nn, -3)) : 'use kcmil', ''), R('Area of that AWG', nn >= -3 ? awgA(Math.max(nn, -3)) : 'n/a', 'mm²', 2), R('kcmil (MCM)', v.a / 0.5067075, 'kcmil', 1), R('Diameter (solid)', d, 'mm', 2)],
            notes: ['Above 4/0 AWG (107 mm²) cables are sized in kcmil: 250, 300, 350, 400, 500, 600, 750, 1000 kcmil.'] };
        }
      },
      U({ id: 'kcmil', icon: '📎', title: 'kcmil / MCM ↔ mm²', v: 500, from: 'kcmil', to: 'mm2', units: [['mm2', 'mm²', 1], ['kcmil', 'kcmil (MCM)', 0.5067075], ['cmil', 'circular mil', 0.0005067075]] }),
      {
        id: 'wave', icon: '🌊', title: 'Waveform values (RMS / peak / average)', desc: 'Convert between peak, RMS, average and peak-to-peak for standard waveforms.',
        formula: 'Sine: Vrms = Vpk/√2, Vavg = 2·Vpk/π, Vpp = 2·Vpk     Square: Vrms = Vpk     Triangle: Vrms = Vpk/√3',
        inputs: [{ k: 'w', l: 'Waveform', opts: [['sine', 'Sine'], ['sq', 'Square'], ['tri', 'Triangle']], v: 'sine' }, { k: 'x', l: 'Value', v: 440, min: 0 }, { k: 'q', l: 'This value is the…', opts: [['rms', 'RMS'], ['pk', 'Peak'], ['pp', 'Peak-to-peak'], ['avg', 'Average (rectified)']], v: 'rms' }],
        run: v => {
          const f = { sine: [Math.SQRT1_2, 2 / PI], sq: [1, 1], tri: [1 / Math.sqrt(3), 0.5] }[v.w], pk = v.q === 'pk' ? v.x : v.q === 'pp' ? v.x / 2 : v.q === 'rms' ? v.x / f[0] : v.x / f[1];
          return { results: [R('Peak', pk, '', 2, null, true), R('RMS', pk * f[0], '', 2), R('Average (rectified)', pk * f[1], '', 2), R('Peak-to-peak', 2 * pk, '', 2), R('Form factor (RMS/avg)', f[0] / f[1], '', 4), R('Crest factor (peak/RMS)', 1 / f[0], '', 4)],
            notes: ['440 V RMS sine = 622 V peak = 1245 V peak-to-peak. Most meters (non “True-RMS”) are calibrated for sine waves only – wrong on VFD output.'] };
        }
      },
      {
        id: 'db', icon: '📶', title: 'Decibels (dB, dBm, Neper)', desc: 'Ratios, gains and signal levels.',
        formula: 'dB = 10·log₁₀(P2/P1) = 20·log₁₀(V2/V1)     dBm = 10·log₁₀(P/1 mW)     1 Np = 8.686 dB',
        inputs: [{ k: 'm', l: 'Convert', opts: [['pr', 'Power ratio → dB'], ['vr', 'Voltage / current ratio → dB'], ['dbp', 'dB → power ratio'], ['dbv', 'dB → voltage / current ratio'], ['mw', 'Power (mW) → dBm'], ['dbm', 'dBm → power (mW)'], ['np', 'Neper → dB'], ['dnp', 'dB → Neper']], v: 'vr' }, { k: 'x', l: 'Value', v: 2 }],
        run: v => {
          const lg = Math.log10; if ((v.m === 'pr' || v.m === 'vr' || v.m === 'mw') && v.x <= 0) throw new Error('Value must be positive');
          const r = { pr: [10 * lg(v.x), 'dB'], vr: [20 * lg(v.x), 'dB'], dbp: [10 ** (v.x / 10), '×'], dbv: [10 ** (v.x / 20), '×'], mw: [10 * lg(v.x), 'dBm'], dbm: [10 ** (v.x / 10), 'mW'], np: [v.x * 8.685889638, 'dB'], dnp: [v.x / 8.685889638, 'Np'] }[v.m];
          return { results: [R('Result', r[0], r[1], 'auto', null, true)], notes: ['+3 dB = ×2 power (×1.414 voltage); +6 dB = ×2 voltage; +10 dB = ×10 power; +20 dB = ×10 voltage.'] };
        }
      },
      {
        id: 'batt', icon: '🔋', title: 'Ah ↔ Wh ↔ kWh ↔ coulomb', desc: 'Battery capacity in energy and charge units.',
        formula: 'Wh = Ah × V     1 Ah = 3600 C',
        inputs: [{ k: 'g', l: 'Value given in', opts: [['ah', 'Ah'], ['wh', 'Wh'], ['kwh', 'kWh']], v: 'ah' }, { k: 'x', l: 'Value', v: 200, min: 0 }, { k: 'v', l: 'Battery voltage', u: 'V', v: 24, min: 0.1 }],
        run: v => {
          const ah = v.g === 'ah' ? v.x : v.g === 'wh' ? v.x / v.v : v.x * 1000 / v.v;
          return { results: [R('Ah', ah, 'Ah', 2, null, true), R('Energy', ah * v.v, 'Wh', 1), R('Energy', ah * v.v / 1000, 'kWh', 3), R('Charge', ah * 3600, 'C', 0), R('mAh', ah * 1000, 'mAh', 0)] };
        }
      },
      U({ id: 'resis', icon: '🧲', title: 'Resistivity', v: 0.01724, from: 'omm2m', to: 'uohmcm', units: [['omm2m', 'Ω·mm²/m', 1e-6], ['om', 'Ω·m', 1], ['uohmcm', 'µΩ·cm', 1e-8], ['ohmcm', 'Ω·cm', 0.01], ['cmilft', 'Ω·cmil/ft', 1.662426e-9]], notes: ['Copper 20 °C = 0.01724 Ω·mm²/m = 1.724 µΩ·cm = 10.37 Ω·cmil/ft; aluminium ≈ 0.0282.'] }),
      U({ id: 'flux', icon: '🧭', title: 'Magnetic flux density', v: 1, from: 't', to: 'g', units: [['t', 'tesla (T)', 1], ['mt', 'mT', 1e-3], ['ut', 'µT', 1e-6], ['g', 'gauss (G)', 1e-4], ['kg', 'kilogauss', 0.1]] }),
      U({ id: 'charge', icon: '🔌', title: 'Electric charge', v: 1, from: 'ah', to: 'c', units: [['c', 'coulomb (C)', 1], ['ah', 'ampere-hour (Ah)', 3600], ['mah', 'mAh', 3.6], ['kah', 'kAh', 3.6e6]] }),
      U({ id: 'lux', icon: '💡', title: 'Illuminance', v: 100, from: 'lux', to: 'fc', units: [['lux', 'lux (lm/m²)', 1], ['fc', 'foot-candle (lm/ft²)', 10.76391042], ['phot', 'phot', 1e4]] }),
      {
        id: 'fuelvol', icon: '⛽', title: 'Fuel: mass ↔ volume', desc: 'Bunker / tank conversions using density (at tank or reference temperature).',
        formula: 'V (m³) = m (t) / ρ (t/m³)',
        inputs: [{ k: 'g', l: 'Value given in', opts: [['t', 'tonnes (metric)'], ['m3', 'm³'], ['l', 'litres'], ['kg', 'kg'], ['usgal', 'US gallons']], v: 't' }, { k: 'x', l: 'Value', v: 100, min: 0 }, { k: 'd', l: 'Density', u: 'kg/L', v: 0.85, min: 0.5, max: 1.2, step: 0.001, hint: 'MGO ≈ 0.85, HFO ≈ 0.95–0.99 (at 15 °C). Use the bunker delivery note.' }],
        run: v => {
          const t = v.g === 't' ? v.x : v.g === 'kg' ? v.x / 1000 : (v.g === 'm3' ? v.x : v.g === 'l' ? v.x / 1000 : v.x * 0.003785411784) * v.d;
          return { results: [R('Mass', t, 'tonnes', 3, null, true), R('Volume', t / v.d, 'm³', 3), R('Volume', t / v.d * 1000, 'litres', 0), R('Volume', t / v.d * 264.172052, 'US gal', 0)], notes: ['Volume changes with temperature (~0.07% per °C for fuel oil): bunker quantities are normally agreed in mass or at 15 °C.'] };
        }
      },
      {
        id: 'sdt', icon: '🧭', title: 'Speed – time – distance (+ fuel)', desc: 'Passage planning: solve for any one of speed, time or distance, and the fuel needed.',
        formula: 'distance (nm) = speed (kn) × time (h)',
        inputs: [{ k: 's', l: 'Solve for', opts: [['d', 'Distance'], ['t', 'Time'], ['v', 'Speed']], v: 'd' }, { k: 'v', l: 'Speed', u: 'kn', v: 5, min: 0.01, show: v => v.s !== 'v' }, { k: 't', l: 'Time', u: 'h', v: 24, min: 0.01, show: v => v.s !== 't' }, { k: 'dist', l: 'Distance', u: 'nm', v: 120, min: 0.01, show: v => v.s !== 'd' }, { k: 'f', l: 'Fuel rate (optional)', u: 't/day', v: 20, min: 0 }],
        run: v => {
          const d = v.s === 'd' ? v.v * v.t : v.dist, t = v.s === 't' ? v.dist / v.v : v.t, sp = v.s === 'v' ? v.dist / v.t : v.v;
          return { results: [R('Distance', d, 'nm', 1, null, v.s === 'd'), R('Distance', d * 1.852, 'km', 1), R('Time', t, 'h', 2, null, v.s === 't'), R('Time (d h min)', (() => { const tm = Math.round(t * 60); return `${Math.floor(tm / 1440)} d ${Math.floor((tm % 1440) / 60)} h ${tm % 60} min`; })(), ''), R('Speed', sp, 'kn', 2, null, v.s === 'v'), R('Fuel for passage', v.f / 24 * t, 'tonnes', 1)] };
        }
      }
    ]
  });
})();
