(function () {
  const { R, lvl, S3, std, res, STD_SIZES } = ETO;
  ETO.page({
    title: 'Earthing & Insulation', icon: '🧪', accent: '#475569',
    subtitle: 'Insulation resistance, polarisation index, earth-fault levels in IT systems, bonding and megger test interpretation.',
    refs: ['IEEE 43-2013', 'IEC 60092-101', 'IEC 60364-6', 'IEC 60034-27', 'IACS UR E'],
    calcs: [
      {
        id: 'ir', icon: '📟', title: 'Insulation resistance evaluation', desc: 'Correct to 40 °C and compare with minimum acceptable values.',
        formula: 'IR40 = IR_T × 0.5^((40 − T)/10)     IR_min = kV + 1 MΩ (IEEE 43)',
        inputs: [
          { k: 'ir', l: 'Measured IR (1 min)', u: 'MΩ', v: 85, min: 0.001 }, { k: 't', l: 'Winding temperature', u: '°C', v: 30 }, { k: 'kv', l: 'Rated voltage', u: 'kV', v: 0.44, min: 0.01, step: 0.01 },
          { k: 'type', l: 'Winding / equipment', opts: [['kv1', 'Older windings / general (kV + 1 MΩ)'], ['form', 'Form-wound after 1970 (100 MΩ)'], ['rand', 'Random-wound / < 1 kV (5 MΩ)'], ['ship', 'Ship circuits – class / SOLAS practice (≥ 1 MΩ)']], v: 'rand' }
        ],
        run: v => {
          const ir40 = v.ir * Math.pow(0.5, (40 - v.t) / 10), min = { kv1: v.kv + 1, form: 100, rand: 5, ship: 1 }[v.type], st = ir40 >= 10 * min ? 'ok' : ir40 >= min ? 'warn' : 'bad';
          return { results: [R('IR corrected to 40 °C', ir40, 'MΩ', 2, st, true), R('Minimum acceptable', min, 'MΩ', 1), R('Margin', ir40 / min, '×', 1, st), R('Leakage at 500 V', 500 / v.ir, 'µA', 1)], verdict: { s: st, t: st === 'ok' ? 'Insulation good.' : st === 'warn' ? 'Above minimum but low margin – clean / dry out and trend regularly.' : 'Below minimum – do not energise. Clean, dry (heaters / low-voltage dry-out) and retest.' }, notes: ['Disconnect electronics, VFD and AVR before testing. Discharge windings after test.', 'Trend values: a 50% fall from the previous reading deserves investigation even if still above minimum.'] };
        }
      },
      {
        id: 'pi', icon: '📈', title: 'PI & DAR', desc: 'Polarisation Index (10 min / 1 min) and Dielectric Absorption Ratio (60 s / 30 s).',
        formula: 'PI = IR10min / IR1min     DAR = IR60s / IR30s',
        inputs: [{ k: 'a', l: 'IR at 30 s', u: 'MΩ', v: 400, min: 0.001 }, { k: 'b', l: 'IR at 1 min', u: 'MΩ', v: 520, min: 0.001 }, { k: 'c', l: 'IR at 10 min', u: 'MΩ', v: 1400, min: 0.001 }],
        run: v => {
          const pi = v.c / v.b, dar = v.b / v.a, sp = pi < 1 ? 'bad' : pi < 2 ? 'warn' : 'ok', sd = dar < 1.25 ? (dar < 1 ? 'bad' : 'warn') : 'ok';
          return { results: [R('Polarisation Index', pi, '', 2, sp, true), R('DAR', dar, '', 2, sd)], verdict: { s: sp === 'ok' && sd === 'ok' ? 'ok' : sp === 'bad' ? 'bad' : 'warn', t: pi >= 4 ? 'PI > 4: excellent / dry (but check: very high IR may make PI meaningless).' : pi >= 2 ? 'PI ≥ 2: meets IEEE 43 minimum for class B/F/H.' : pi >= 1 ? 'PI 1–2: questionable – moisture or contamination likely.' : 'PI < 1: insulation dangerous.' },
            notes: ['IEEE 43 minimum PI: 2.0 (thermal class B, F, H), 1.5 (class A). If IR1 > 5000 MΩ the PI may be meaningless.', 'DAR guide: <1.0 poor, 1.0–1.25 questionable, 1.25–1.6 good, >1.6 excellent.'] };
        }
      },
      {
        id: 'it', icon: '🚢', title: 'First earth fault in IT system', desc: 'Capacitive fault current in an unearthed (IT) ship system – why the first fault does not trip but must be found.',
        formula: 'I_fault ≈ 3 × U0 × 2π f × C_phase     (U0 = V_LL/√3)',
        inputs: [{ k: 'v', l: 'Line voltage', u: 'V', v: 440, min: 1 }, { k: 'f', l: 'Frequency', u: 'Hz', v: 60, min: 1 }, { k: 'c', l: 'Cable + equipment capacitance to hull per phase', u: 'µF', v: 1.5, min: 0, step: 0.01, hint: '≈ 0.2–0.4 µF/km per phase for LV cable plus motor/filter capacitance' }, { k: 'ra', l: 'Fault resistance', u: 'Ω', v: 0, min: 0 }],
        run: v => {
          const u0 = v.v / S3, xc = 1 / (2 * Math.PI * v.f * v.c * 1e-6), i = v.c > 0 ? u0 / Math.hypot(v.ra, xc / 3) : 0, i0 = 3 * u0 * 2 * Math.PI * v.f * v.c * 1e-6;
          return { results: [R('First earth-fault current', i0 * 1000, 'mA', 0, null, true), R('With fault resistance', v.c > 0 ? i * 1000 : 0, 'mA', 0), R('Healthy phase voltage to hull', v.v, 'V', 0, 'warn')], notes: ['Healthy phases rise to line voltage to earth – insulation stressed. Locate and clear the first fault promptly (insulation monitor alarm).', 'Low-resistance insulation monitoring alarm typically set at ≥ 100 Ω/V ≈ 44 kΩ on 440 V (check class rules and the monitor manual).'] };
        }
      },
      {
        id: 'imon', icon: '🔍', title: 'Insulation monitor – leakage', desc: 'Convert insulation resistance to leakage current and insulation resistance per volt.',
        formula: 'I_leak = V / R     R_per_volt = R / V',
        inputs: [{ k: 'r', l: 'Insulation resistance (monitor reading)', u: 'kΩ', v: 120, min: 0.001 }, { k: 'v', l: 'Line voltage', u: 'V', v: 440, min: 1 }],
        run: v => {
          const rpv = v.r * 1000 / v.v, il = v.v / S3 / (v.r * 1000) * 1000, st = rpv >= 1000 ? 'ok' : rpv >= 100 ? 'warn' : 'bad';
          return { results: [R('Resistance per volt', rpv, 'Ω/V', 0, st, true), R('Leakage to earth (phase)', il, 'mA', 2), R('Leakage line-voltage basis', v.v / (v.r * 1000) * 1000, 'mA', 2)], verdict: { s: st, t: st === 'ok' ? '> 1000 Ω/V: healthy.' : st === 'warn' ? '100–1000 Ω/V: deteriorating – find and clear.' : '< 100 Ω/V: low insulation – alarm condition.' }, notes: ['Check your monitor\'s alarm points against class rules; thresholds are vessel-specific.'] };
        }
      },
      {
        id: 'pc', icon: '⏚', title: 'Protective conductor size', desc: 'Adiabatic protective earth conductor selection.',
        formula: 'S = √(I² t) / k',
        inputs: [{ k: 'i', l: 'Earth fault current', u: 'kA', v: 8, min: 0.001 }, { k: 't', l: 'Disconnection time', u: 's', v: 0.5, min: 0.001 }, { k: 'k', l: 'k factor', opts: [[143, 'Cu XLPE/EPR (143)'], [115, 'Cu PVC (115)'], [159, 'Cu bare/bolted (159)'], [94, 'Al XLPE (94)']], v: 143 }],
        run: v => { const s = v.i * 1000 * Math.sqrt(v.t) / v.k; return { results: [R('Minimum area', s, 'mm²', 1), R('Next standard', std(STD_SIZES, s) || '> 630 mm²', 'mm²', 0, std(STD_SIZES, s) ? 'ok' : 'warn', true)] }; }
      },
      {
        id: 'bond', icon: '🔗', title: 'Continuity / bonding test', desc: 'Compare measured bonding / earth continuity resistance with the calculated value.',
        formula: 'R_exp = ρ × L / A     limit ≈ 0.1 Ω to main earth (hull)',
        inputs: [{ k: 'l', l: 'Conductor length', u: 'm', v: 30, min: 0 }, { k: 's', l: 'Conductor size', u: 'mm²', v: 16, min: 0.5 }, { k: 'rm', l: 'Measured resistance', u: 'mΩ', v: 38, min: 0 }, { k: 't', l: 'Conductor temperature', u: '°C', v: 25 }],
        run: v => {
          const rexp = res('Cu', v.s, v.t) * v.l * 1000, ratio = v.rm / (rexp || 1), st = ratio <= 1.25 ? 'ok' : ratio <= 2 ? 'warn' : 'bad', abs = v.rm <= 100;
          return { results: [R('Expected', rexp, 'mΩ', 1), R('Measured', v.rm, 'mΩ', 1, st, true), R('Measured / expected', ratio, '×', 2, st), R('≤ 0.1 Ω', abs ? 'YES' : 'NO', '', 0, abs ? 'ok' : 'bad')], verdict: { s: st, t: st === 'ok' ? 'Continuity good.' : 'Extra resistance – suspect loose / corroded connection or hidden break; clean, re-torque and retest.' } };
        }
      },
      {
        id: 'guide', icon: '📘', title: 'Megger test guide', desc: 'Test voltages and acceptance values (IEEE 43 and common marine practice).', inputs: [],
        run: () => ({ results: [] }),
        html: `<table><tr><th>Winding / circuit rated voltage</th><th>Insulation test voltage (DC)</th></tr>
<tr><td>&lt; 100 V</td><td>100 V</td></tr><tr><td>100 – 440 V (control / ELV circuits, 230 V)</td><td>250 – 500 V</td></tr><tr><td>440 – 1000 V (440 V motors, cables)</td><td>500 – 1000 V</td></tr><tr><td>1 – 2.5 kV</td><td>500 – 1000 V (IEEE 43: 1000 V)</td></tr><tr><td>2.5 – 5 kV</td><td>1000 – 2500 V</td></tr><tr><td>5 – 12 kV</td><td>2500 – 5000 V</td></tr><tr><td>&gt; 12 kV (6.6 kV motors &amp; gens: 5 kV)</td><td>5000 – 10 000 V</td></tr></table>
<p></p><table><tr><th>Reading trend</th><th>Meaning</th></tr>
<tr><td>Rising steadily (high PI)</td><td>Clean, dry insulation</td></tr><tr><td>Flat / low</td><td>Moisture or contamination – dry out</td></tr><tr><td>Rising then falling</td><td>Possible puncture / weak spot developing</td></tr><tr><td>Erratic</td><td>Cracked insulation or surface tracking</td></tr></table>
<ul class="notes"><li>Isolate VFDs, AVRs, surge arresters, electronic modules before testing. Test cables with all cores strapped to earth in turn.</li><li>Record winding temperature and humidity – IR halves for every ≈10 °C rise.</li><li>Safety: discharge the winding for at least 4× the test time after the test.</li></ul>`
      },

      {
        id: 'ngr', icon: '⏚', title: 'Neutral grounding resistor (HRG) sizing', desc: 'High-resistance earthing of a generator / transformer neutral: resistor current must exceed the system charging current to limit transient over-voltages.',
        formula: 'I_C = 3·ω·C·U0     I_R ≥ I_C     R = U0 / I_R     I_fault = √(I_R² + I_C²)',
        inputs: [{ k: 'v', l: 'System voltage (line)', u: 'V', v: 690, min: 1 }, { k: 'f', l: 'Frequency', u: 'Hz', v: 60, min: 1 }, { k: 'c', l: 'Total capacitance to earth per phase', u: 'µF', v: 2, min: 0, step: 0.01 }, { k: 'ir', l: 'Chosen resistor current', u: 'A', v: 5, min: 0.1 }, { k: 'tr', l: 'Resistor time rating', opts: [[10, '10 s (tripping system)'], [60, '60 s'], [0, 'Continuous (alarm only)']], v: 10 }],
        run: v => {
          const u0 = v.v / Math.sqrt(3), ic = 3 * 2 * Math.PI * v.f * v.c * 1e-6 * u0, ok = v.ir >= ic, R0 = u0 / v.ir;
          return { results: [R('System charging current I_C', ic, 'A', 2), R('Resistor current I_R', v.ir, 'A', 1, ok ? 'ok' : 'bad', true), R('Resistance', R0, 'Ω', 1, null, true), R('Resistor power', u0 * v.ir / 1000, 'kW', 2), R('Total earth-fault current', Math.hypot(v.ir, ic), 'A', 2), R('Time rating', +v.tr ? v.tr + ' s' : 'continuous', '', 0)], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'I_R ≥ I_C – transient over-voltage limited (≈ 2.5 pu).' : 'I_R below charging current – risk of arcing-ground over-voltages; increase resistor current.' }, notes: ['Alarm-only systems usually keep the earth-fault current ≤ 5–10 A so the faulted feeder can run until located. Class rules govern the choice.'] };
        }
      }
    ]
  });
})();
