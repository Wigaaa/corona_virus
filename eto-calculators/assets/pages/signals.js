(function () {
  const { R, lvl, esc, res } = ETO;
  const ne43 = ma => (ma <= 3.6 ? ['bad', 'FAULT LOW (≤ 3.6 mA) – open loop / transmitter failure'] : ma < 3.8 ? ['warn', 'Under-range (3.6–3.8 mA) – below LRV'] : ma <= 20.5 ? ['ok', 'Valid measurement (3.8–20.5 mA)'] : ma < 21 ? ['warn', 'Over-range (20.5–21 mA) – above URV'] : ['bad', 'FAULT HIGH (≥ 21 mA) – transmitter alarm / short']);
  ETO.page({
    title: 'Signals & Loops', icon: '📶', accent: '#0d9488',
    subtitle: 'Analogue signal scaling, PLC raw counts, loop power budgets and 4–20 mA diagnostics (NAMUR NE43).',
    refs: ['IEC 60381-1', 'NAMUR NE43', 'HART (IEC 62591)'],
    calcs: [
      {
        id: 'ma', icon: '📶', title: '4–20 mA ↔ % ↔ engineering units', desc: 'Scale a 4–20 mA signal to the process value (and back), with NAMUR NE43 signal status.',
        formula: 'PV = LRV + (I − 4)/16 × (URV − LRV)     I = 4 + 16 × (PV − LRV)/(URV − LRV)',
        inputs: [{ k: 'm', l: 'Convert', opts: [['ma', 'mA → process value'], ['pv', 'Process value → mA'], ['pc', '% → mA']], v: 'ma' }, { k: 'x', l: 'Input value', v: 12 }, { k: 'lrv', l: 'LRV (value at 4 mA)', v: 0 }, { k: 'urv', l: 'URV (value at 20 mA)', v: 10 }, { k: 'u', t: 'text', l: 'Unit', v: 'bar' }],
        run: v => {
          if (v.urv === v.lrv) throw new Error('URV must differ from LRV');
          const span = v.urv - v.lrv, ma = v.m === 'ma' ? v.x : v.m === 'pv' ? 4 + 16 * (v.x - v.lrv) / span : 4 + 16 * v.x / 100, pc = (ma - 4) / 16 * 100, pv = v.lrv + pc / 100 * span, st = ne43(ma);
          return { results: [R('Current', ma, 'mA', 3, st[0], true), R('Percent of span', pc, '%', 2), R('Process value', pv, v.u, 'auto', null, true), R('Voltage across 250 Ω', ma * 0.25, 'V', 3)], verdict: { s: st[0], t: st[1] }, tables: [{ title: 'Quick reference', head: ['%', 'mA', v.u], rows: [0, 25, 50, 75, 100].map(p => [p, 4 + 0.16 * p, v.lrv + p / 100 * span]) }] };
        }
      },
      {
        id: 'volt', icon: '🔋', title: 'Voltage signals (0–10 V, 1–5 V, 2–10 V…)', desc: 'Scale a voltage signal to engineering units.',
        formula: 'PV = LRV + (V − V0)/(V1 − V0) × span',
        inputs: [{ k: 'sig', l: 'Signal range', opts: [['0-10', '0–10 V'], ['2-10', '2–10 V'], ['1-5', '1–5 V'], ['0-5', '0–5 V'], ['-10-10', '±10 V']], v: '0-10' }, { k: 'x', l: 'Measured voltage', u: 'V', v: 6.5 }, { k: 'lrv', l: 'LRV', v: 0 }, { k: 'urv', l: 'URV', v: 100 }, { k: 'u', t: 'text', l: 'Unit', v: '%' }],
        run: v => {
          const [a, b] = { '0-10': [0, 10], '2-10': [2, 10], '1-5': [1, 5], '0-5': [0, 5], '-10-10': [-10, 10] }[v.sig], f = (v.x - a) / (b - a), out = v.x < a - 0.02 * (b - a) || v.x > b + 0.02 * (b - a);
          return { results: [R('Process value', v.lrv + f * (v.urv - v.lrv), v.u, 'auto', out ? 'warn' : null, true), R('Percent of span', f * 100, '%', 2)], verdict: out ? { s: 'warn', t: 'Signal outside its nominal range – wiring / supply / sensor fault?' } : null, notes: ['Live-zero signals (2–10 V, 1–5 V) let you detect a broken wire: 0 V = fault, not 0 %.'] };
        }
      },
      {
        id: 'plc', icon: '💻', title: 'PLC analogue raw counts ↔ engineering units', desc: 'Convert an analogue-input register value to the process value and back.',
        formula: 'PV = LRV + (raw − raw_min)/(raw_max − raw_min) × (URV − LRV)',
        inputs: [{ k: 'pre', l: 'Card / format', opts: [['s7', 'Siemens S7 (0 … 27648)'], ['b12', '12-bit (0 … 4095)'], ['b15', '15-bit (0 … 32767)'], ['b16', '16-bit (0 … 65535)'], ['ab', '4–20 mA as 4000 … 20000 (µA)'], ['cus', 'Custom']], v: 's7' }, { k: 'rmin', l: 'Custom raw min', v: 0, show: v => v.pre === 'cus' }, { k: 'rmax', l: 'Custom raw max', v: 10000, show: v => v.pre === 'cus' }, { k: 'm', l: 'Convert', opts: [['r2e', 'Raw → engineering'], ['e2r', 'Engineering → raw']], v: 'r2e' }, { k: 'x', l: 'Value', v: 13824 }, { k: 'lrv', l: 'LRV', v: 0 }, { k: 'urv', l: 'URV', v: 16 }, { k: 'u', t: 'text', l: 'Unit', v: 'bar' }],
        run: v => {
          const [a, b] = v.pre === 'cus' ? [v.rmin, v.rmax] : { s7: [0, 27648], b12: [0, 4095], b15: [0, 32767], b16: [0, 65535], ab: [4000, 20000] }[v.pre];
          if (a === b) throw new Error('Raw min and max must differ');
          const f = v.m === 'r2e' ? (v.x - a) / (b - a) : (v.x - v.lrv) / (v.urv - v.lrv);
          return { results: [R(v.m === 'r2e' ? 'Process value' : 'Raw value', v.m === 'r2e' ? v.lrv + f * (v.urv - v.lrv) : Math.round(a + f * (b - a)), v.m === 'r2e' ? v.u : 'counts', 'auto', null, true), R('Percent of span', f * 100, '%', 2), R('Equivalent 4–20 mA', 4 + 16 * f, 'mA', 3)], notes: ['Siemens S7: 27648 = 100 %; values above 27648 up to 32511 are overrange, 32767 = overflow / wire break (with diagnostics on).'] };
        }
      },
      {
        id: 'loop', icon: '🔄', title: 'Loop power budget & max cable length', desc: 'Can the loop supply drive the transmitter at full-scale (incl. fault current) through the receiver, barrier and cable?',
        formula: 'V_available = V_supply − I_max × (R_load + R_barrier + R_cable) − V_isolator ≥ V_transmitter(min)',
        inputs: [{ k: 'vs', l: 'Loop supply voltage', u: 'V', v: 24, min: 1 }, { k: 'vt', l: 'Transmitter minimum (lift-off) voltage', u: 'V', v: 12, min: 0 }, { k: 'rl', l: 'Receiver / sense resistor', u: 'Ω', v: 250, min: 0 }, { k: 'rb', l: 'Barrier / isolator series resistance', u: 'Ω', v: 0, min: 0, hint: 'Zener barrier often 250–350 Ω' }, { k: 'vd', l: 'Isolator voltage drop (if quoted)', u: 'V', v: 0, min: 0 }, { k: 'imax', l: 'Maximum loop current', u: 'mA', v: 22, min: 4, hint: 'Use 22 mA (NE43 fault high) for design' }, { k: 'l', l: 'Cable length (one way)', u: 'm', v: 400, min: 0 }, { k: 's', l: 'Conductor size', u: 'mm²', v: 1.0, min: 0.2 }],
        run: v => {
          const rpm = res('Cu', v.s, 40), rc = 2 * v.l * rpm, i = v.imax / 1000, vav = v.vs - v.vd - i * (v.rl + v.rb + rc), margin = vav - v.vt, rmaxC = (v.vs - v.vd - v.vt) / i - v.rl - v.rb, lmax = rmaxC / (2 * rpm);
          return { results: [R('Voltage at transmitter', vav, 'V', 2, margin >= 1 ? 'ok' : margin >= 0 ? 'warn' : 'bad', true), R('Margin above lift-off', margin, 'V', 2), R('Cable loop resistance', rc, 'Ω', 2), R('Max total loop resistance', v.rl + v.rb + rmaxC, 'Ω', 0), R('Max cable length (one way)', Math.max(0, lmax), 'm', 0)], verdict: { s: margin >= 1 ? 'ok' : margin >= 0 ? 'warn' : 'bad', t: margin >= 0 ? 'Loop has enough voltage at maximum current.' : 'Insufficient voltage – transmitter will clamp below full scale. Raise supply, reduce load / barrier resistance or use larger cable.' }, notes: ['HART needs ≥ 230 Ω (250 Ω typical) in the loop for communication.'] };
        }
      },
      {
        id: 'shunt', icon: '🔧', title: 'Shunt / sense resistor', desc: 'Resistor to convert a current loop to a voltage input, and the voltage at any current.',
        formula: 'R = V(20 mA) / 20 mA   →   V(4 mA) = V(20 mA) / 5 automatically     V = I × R',
        inputs: [{ k: 'v0', l: 'Desired voltage at 4 mA', u: 'V', v: 1, min: 0 }, { k: 'v1', l: 'Desired voltage at 20 mA', u: 'V', v: 5, min: 0.01 }, { k: 'i', l: 'Present loop current', u: 'mA', v: 12, min: 0 }],
        run: v => { const r = v.v1 / 0.02; return { results: [R('Resistor', r, 'Ω', 1, null, true), R('Voltage at 4 mA', 0.004 * r, 'V', 3), R('Voltage at present current', v.i / 1000 * r, 'V', 3), R('Power at 22 mA', 0.022 ** 2 * r * 1000, 'mW', 1)], notes: ['Sized on the full-scale (20 mA) voltage so the analogue input is never over-ranged. Use a 0.1 % precision resistor; 250 Ω gives the standard 1–5 V.', Math.abs(0.004 * r - v.v0) > 0.01 ? `A passive resistor always gives V(4 mA) = V(20 mA)/5 = ${(0.004 * r).toFixed(2)} V – the requested ${v.v0} V at 4 mA needs a signal conditioner / isolator with offset. Do NOT size on the 16 mA span: that would exceed the input range at 20 mA.` : 'Requested 4 mA voltage matches.'] }; }
      },
      {
        id: 'pulse', icon: '📟', title: 'Pulse / frequency flowmeter', desc: 'Flow rate from pulse frequency and K-factor, and totaliser.',
        formula: 'Q = f / K     (K in pulses per litre)',
        inputs: [{ k: 'f', l: 'Pulse frequency', u: 'Hz', v: 125, min: 0 }, { k: 'k', l: 'K-factor', u: 'pulses / L', v: 50, min: 0.0001 }, { k: 'n', l: 'Pulses counted (for total)', v: 250000, min: 0 }],
        run: v => ({ results: [R('Flow', v.f / v.k, 'L/s', 3), R('Flow', v.f / v.k * 60, 'L/min', 2, null, true), R('Flow', v.f / v.k * 3.6, 'm³/h', 3), R('Total', v.n / v.k, 'L', 1)] })
      }
    ]
  });
})();
