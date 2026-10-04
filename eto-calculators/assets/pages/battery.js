(function () {
  const { R, lvl, S3, esc, rho } = ETO;
  ETO.page({
    title: 'Battery & UPS Calculations', icon: '🔋', accent: '#ca8a04',
    subtitle: 'Battery sizing, autonomy with Peukert, charger rating, UPS loading / runtime and DC voltage drop.',
    refs: ['IEEE 485', 'IEC 60896 / 61427', 'IEC 62040 (UPS)', 'SOLAS II-1/42-43'],
    calcs: [
      {
        id: 'load', icon: '🔌', title: 'Battery load (DC)', desc: 'Total DC load from a list of consumers.',
        formula: 'I = ΣP / V_dc    Ah per hour = I',
        inputs: [
          { k: 'v', l: 'DC bus voltage', u: 'V', v: 24, min: 1 },
          { k: 'tbl', t: 'table', l: 'Loads', v: [{ n: 'Alarm / control system', w: 150, q: 1 }, { n: 'Nav / comms', w: 200, q: 1 }, { n: 'Emergency lights (LED)', w: 20, q: 12 }, { n: 'Breaker control supplies', w: 60, q: 4 }],
            cols: [{ k: 'n', l: 'Consumer', t: 'text', d: 'Load' }, { k: 'w', l: 'Watts', t: 'num', d: 0 }, { k: 'q', l: 'Qty', t: 'num', d: 1, w: 50 }] }
        ],
        run: v => {
          const tot = v.tbl.reduce((a, r) => a + r.w * r.q, 0);
          return { results: [R('Total power', tot, 'W', 0), R('Total current', tot / v.v, 'A', 1, null, true), R('Energy per hour', tot / 1000, 'kWh/h', 2)], tables: [{ title: 'Detail', head: ['Consumer', 'W each', 'Qty', 'Total W', 'Amps'], rows: v.tbl.map(r => [esc(r.n), r.w, r.q, r.w * r.q, r.w * r.q / v.v]) }] };
        }
      },
      {
        id: 'cap', icon: '📦', title: 'Battery capacity required', desc: 'Required Ah for a given load and duration with design margins.',
        formula: 'Ah = I × t × K_aging × K_temp × K_margin / DoD',
        inputs: [
          { k: 'i', l: 'Load current', u: 'A', v: 15, min: 0.001 }, { k: 't', l: 'Required duration', u: 'h', v: 18, min: 0.01, hint: 'SOLAS emergency source: 18 h cargo (36 h passenger); transitional 30 min' },
          { k: 'ka', l: 'Ageing factor', v: 1.25, min: 1, step: 0.01, hint: '1.25 = replace at 80% capacity' }, { k: 'kt', l: 'Temperature factor', v: 1.0, min: 0.5, step: 0.01, hint: '25 °C → 1.00; 15 °C ≈ 1.11; 5 °C ≈ 1.3' },
          { k: 'km', l: 'Design margin', v: 1.1, min: 1, step: 0.01 }, { k: 'dod', l: 'Usable depth of discharge', u: '0–1', v: 0.8, min: 0.1, max: 1, step: 0.01, hint: 'VRLA ≈ 0.8, NiCd ≈ 1.0' }
        ],
        run: v => {
          const ah = v.i * v.t * v.ka * v.kt * v.km / v.dod;
          return { results: [R('Required capacity', ah, 'Ah', 0, null, true), R('Net energy', v.i * v.t, 'Ah', 1), R('Design factor', ah / (v.i * v.t), '×', 2)], notes: ['Select the next larger standard battery; verify with the manufacturer\'s discharge tables to the end-of-discharge voltage.'] };
        }
      },
      {
        id: 'chg', icon: '🔌', title: 'Charger rating & charging current', desc: 'Charger size to carry the DC load and recharge the battery in a given time.',
        formula: 'I_charger = I_load + Ah_removed × K_loss / t_recharge     I_charge_max = 0.1–0.2 × C',
        inputs: [
          { k: 'c', l: 'Battery capacity', u: 'Ah', v: 200, min: 1 }, { k: 'dod', l: 'Depth of discharge to recover', u: '%', v: 80, min: 1, max: 100 }, { k: 'tr', l: 'Recharge time', u: 'h', v: 10, min: 0.5 },
          { k: 'il', l: 'Continuous DC load', u: 'A', v: 15, min: 0 }, { k: 'kl', l: 'Charge loss factor', v: 1.15, min: 1, step: 0.01 }, { k: 'lim', l: 'Max charge current', u: '×C', v: 0.2, min: 0.05, step: 0.01 }
        ],
        run: v => {
          const ib = v.c * v.dod / 100 * v.kl / v.tr, ic = v.il + ib, imax = v.lim * v.c, st = ib <= imax ? 'ok' : 'bad';
          return { results: [R('Charger rating', ic, 'A', 1, null, true), R('Battery charge current', ib, 'A', 1, st), R('Max permitted charge current', imax, 'A', 1), R('Charge rate', ib / v.c, 'C', 3)], verdict: { s: st, t: st === 'ok' ? 'Charge current within battery limit.' : 'Battery charge current exceeds limit – extend recharge time.' } };
        }
      },
      {
        id: 'auto', icon: '⏳', title: 'Autonomy / backup time (Peukert)', desc: 'Realistic backup time using Peukert exponent, ageing and temperature.',
        formula: 't = H × (C_eff / (I × H))^k    C_eff = C × usable × health × K_temp',
        inputs: [
          { k: 'c', l: 'Rated capacity', u: 'Ah', v: 200, min: 1 }, { k: 'h', l: 'Rated discharge time', u: 'h', v: 20, min: 1, hint: 'C20 → 20 h, C10 → 10 h' }, { k: 'i', l: 'Load current', u: 'A', v: 20, min: 0.001 },
          { k: 'k', l: 'Peukert exponent', v: 1.2, min: 1, max: 1.6, step: 0.01, hint: 'Lead-acid ≈ 1.15–1.3; NiCd ≈ 1.05–1.15; Li-ion ≈ 1.02' },
          { k: 'u', l: 'Usable capacity', u: '%', v: 80, min: 10, max: 100 }, { k: 'hl', l: 'Battery health (state of health)', u: '%', v: 85, min: 10, max: 100 }, { k: 'kt', l: 'Temperature capacity factor', v: 1, min: 0.3, max: 1.2, step: 0.01 }
        ],
        run: v => {
          const ce = v.c * v.u / 100 * v.hl / 100 * v.kt, t = v.h * Math.pow(ce / (v.i * v.h), v.k), simple = v.c / v.i;
          return { results: [R('Realistic autonomy', t, 'h', 2, null, true), R('Simple C / I', simple, 'h', 2, null), R('Overestimate by simple formula', (simple / t - 1) * 100, '%', 0, 'warn'), R('Effective capacity', ce, 'Ah', 0), R('Discharge rate', v.i / v.c, 'C', 3)],
            notes: ['Example: 200 Ah / 20 A = 10 h by simple formula, but ageing, usable DoD and Peukert reduce this considerably.', 'Always confirm using the manufacturer\'s constant-current discharge table to the end-voltage.'] };
        }
      },
      {
        id: 'ups', icon: '🖥️', title: 'UPS runtime & loading', desc: 'UPS load, DC current from the battery and expected runtime.',
        formula: 'I_dc = P_load×1000 / (η_inv × V_dc_avg)    t = Peukert (C_total, I_dc)',
        inputs: [
          { k: 'p', l: 'Load', u: 'kW', v: 8, min: 0.001 }, { k: 'rs', l: 'UPS rating', u: 'kVA', v: 15, min: 0.1 }, { k: 'rpf', l: 'UPS rated PF', v: 0.9, min: 0.5, max: 1, step: 0.01 },
          { k: 'eta', l: 'Inverter efficiency', u: '%', v: 92, min: 50, max: 100 }, { k: 'vdc', l: 'Average DC voltage during discharge', u: 'V', v: 216, min: 1 },
          { k: 'ah', l: 'Battery Ah per string', u: 'Ah', v: 100, min: 1 }, { k: 'ns', l: 'Parallel strings', v: 2, min: 1, step: 1 }, { k: 'k', l: 'Peukert exponent', v: 1.2, min: 1, max: 1.6, step: 0.01 }, { k: 'hl', l: 'Battery health × usable', u: '%', v: 75, min: 10, max: 100 }
        ],
        run: v => {
          const idc = v.p * 1000 / (v.eta / 100 * v.vdc), c = v.ah * v.ns * v.hl / 100, t = 10 * Math.pow(c / (idc * 10), v.k) , ld = v.p / (v.rs * v.rpf) * 100, st = lvl(ld, 80, 100);
          return { results: [R('Runtime', t * 60, 'min', 0, t * 60 < 10 ? 'warn' : null, true), R('Runtime', t, 'h', 2), R('Battery discharge current', idc, 'A', 1), R('UPS loading (kW)', ld, '%', 0, st)], notes: ['Runtime uses a 10-h reference rate for Peukert correction. Manufacturer data (kW per cell at x minutes) is more accurate for UPS batteries.'] };
        }
      },
      {
        id: 'num', icon: '🧱', title: 'Number of batteries (series / parallel)', desc: 'Series and parallel blocks to reach the system voltage and Ah.',
        formula: 'N_series = V_sys / V_block    N_parallel = Ah_req / Ah_block',
        inputs: [{ k: 'vs', l: 'System voltage', u: 'V', v: 24, min: 1 }, { k: 'ah', l: 'Required capacity', u: 'Ah', v: 400, min: 1 }, { k: 'vb', l: 'Block voltage', opts: [[2, '2 V cell'], [6, '6 V'], [12, '12 V'], [24, '24 V']], v: 12 }, { k: 'ab', l: 'Block capacity', u: 'Ah', v: 200, min: 1 }],
        run: v => {
          const ns = Math.ceil(v.vs / v.vb - 1e-9), np = Math.ceil(v.ah / v.ab - 1e-9);
          return { results: [R('Blocks in series', ns, '', 0), R('Strings in parallel', np, '', 0), R('Total blocks', ns * np, '', 0, null, true), R('Installed capacity', np * v.ab, 'Ah', 0), R('Actual string voltage', ns * v.vb, 'V', 0)], notes: ['Limit parallel strings to 3–4 and keep strings identical (same age, same make).'] };
        }
      },
      {
        id: 'dvd', icon: '📉', title: 'DC voltage drop', desc: 'Two-wire DC cable drop (critical on 24 V systems).',
        formula: 'Vd = 2 × I × L × ρ / A',
        inputs: [
          { k: 'v', l: 'System voltage', u: 'V', v: 24, min: 1 }, { k: 'i', l: 'Current', u: 'A', v: 30, min: 0 }, { k: 'l', l: 'Length (one way)', u: 'm', v: 20, min: 0 }, { k: 's', l: 'Cable size', u: 'mm²', v: 10, min: 0.5 }, { k: 't', l: 'Conductor temperature', u: '°C', v: 40 }, { k: 'lim', l: 'Allowed drop', u: '%', v: 3, min: 0.1 }
        ],
        run: v => {
          const vd = 2 * v.i * v.l * rho('Cu', v.t) / v.s, pc = vd / v.v * 100, st = lvl(pc, v.lim, v.lim * 1.3);
          return { results: [R('Voltage drop', vd, 'V', 3, st, true), R('Voltage drop', pc, '%', 2, st), R('Voltage at load', v.v - vd, 'V', 2), R('Min. size for limit', 2 * v.i * v.l * rho('Cu', v.t) / (v.v * v.lim / 100), 'mm²', 1)] };
        }
      },
      {
        id: 'rate', icon: '🔋', title: 'Discharge rate (C-rate)', desc: 'How hard the battery is being discharged.',
        formula: 'C-rate = I / C    hours rate = C / I',
        inputs: [{ k: 'c', l: 'Capacity', u: 'Ah', v: 200, min: 1 }, { k: 'i', l: 'Discharge current', u: 'A', v: 50, min: 0.001 }],
        run: v => ({ results: [R('C-rate', v.i / v.c, 'C', 3, lvl(v.i / v.c, 0.2, 0.5), true), R('Nominal run-time (I = C/t)', v.c / v.i, 'h', 2), R('Equivalent', `C${(v.c / v.i).toFixed(1)}`, '')], notes: ['Capacity at high C-rates (UPS: 5–15 min rates) is far below nameplate capacity.'] })
      }
    ]
  });
})();
