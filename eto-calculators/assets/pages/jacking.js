(function () {
  const { R, lvl, S3, esc } = ETO;
  const G = 9.81;
  ETO.page({
    title: 'Jacking System Calculations', icon: '🏗️', accent: '#0284c7',
    subtitle: 'Electrical side of jacking: total load, motor distribution, brakes, resistors, cooling and generator capacity.',
    refs: ['IEC 60034', 'IEC 60092-301', 'Class rules – jack-up units', 'IEC 61800'],
    calcs: [
      {
        id: 'load', icon: '📊', title: 'Total jacking electrical load', desc: 'Sum of all jacking motors operating together versus available DG capacity.',
        formula: 'P_total = Σ P_motor × load factor / η    S = P / PF',
        inputs: [
          { k: 'legs', l: 'Legs jacking together', v: 4, min: 1, step: 1 }, { k: 'mpl', l: 'Motors per leg', v: 6, min: 1, step: 1 }, { k: 'kw', l: 'Motor rated power', u: 'kW', v: 30, min: 0.1 }, { k: 'lf', l: 'Average motor load factor', u: '%', v: 75, min: 1, max: 130 },
          { k: 'e', l: 'Motor efficiency', u: '%', v: 92, min: 1, max: 100 }, { k: 'pf', l: 'Power factor', v: 0.85, min: 0.1, max: 1, step: 0.01 }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 },
          { k: 'base', l: 'Hotel / other base load', u: 'kW', v: 500, min: 0 }, { k: 'dg', l: 'DG rating each', u: 'kW', v: 1600, min: 1 }, { k: 'n', l: 'DGs online', v: 4, min: 1, step: 1 }, { k: 'max', l: 'Max allowed DG loading', u: '%', v: 85, min: 10, max: 100 }
        ],
        run: v => {
          const nm = v.legs * v.mpl, ps = nm * v.kw * v.lf / 100, pe = ps / (v.e / 100), s = pe / v.pf, i = s * 1000 / (S3 * v.v), tot = pe + v.base, cap = v.n * v.dg, ld = tot / cap * 100, st = lvl(ld, v.max, 100);
          const need = Math.ceil(tot / (v.dg * v.max / 100) - 1e-9);
          return { results: [R('Motors running', nm, '', 0), R('Shaft power', ps, 'kW', 0), R('Electrical power (jacking)', pe, 'kW', 0, null, true), R('Jacking kVA', s, 'kVA', 0), R('Jacking current', i, 'A', 0), R('Total plant load', tot, 'kW', 0), R('DG loading', ld, '%', 0, st), R('DGs needed @ limit', need, '', 0, need <= v.n ? 'ok' : 'bad')],
            verdict: { s: st, t: st === 'ok' ? 'Jacking can be done with the DGs online.' : st === 'warn' ? 'Loading above target limit – start another DG before jacking.' : 'Not enough DG capacity – start more DGs / reduce simultaneous legs.' }, notes: ['Inrush/starting kW with DOL or VFD ramp adds a short peak: sequence leg starts via the PMS permission.'] };
        }
      },
      {
        id: 'mech', icon: '⚙️', title: 'Power from hull weight', desc: 'Required motor power for raising the hull at a given speed.',
        formula: 'P = W × g × v / (η_mech × N_motors)',
        inputs: [{ k: 'w', l: 'Hull weight (incl. variable load)', u: 't', v: 8000, min: 1 }, { k: 'v', l: 'Jacking speed', u: 'm/min', v: 0.6, min: 0.01, step: 0.01 }, { k: 'em', l: 'Mechanical efficiency (rack-pinion + gear)', u: '%', v: 70, min: 10, max: 100 }, { k: 'n', l: 'Total motors', v: 24, min: 1, step: 1 }, { k: 'rk', l: 'Motor rated power', u: 'kW', v: 30, min: 0.1 }, { k: 'em2', l: 'Motor efficiency', u: '%', v: 92, min: 1, max: 100 }],
        run: v => {
          const pt = v.w * 1000 * G * v.v / 60 / (v.em / 100) / 1000, pm = pt / v.n, u = pm / v.rk * 100, st = lvl(u, 85, 100);
          return { results: [R('Total shaft power', pt, 'kW', 0), R('Per motor', pm, 'kW', 1, st, true), R('Motor utilisation', u, '%', 0, st), R('Electrical total', pt / (v.em2 / 100), 'kW', 0)], verdict: { s: st, t: st === 'ok' ? 'Motors adequate for the condition.' : 'Motors heavily loaded – reduce speed / variable load or check gearbox efficiency.' }, notes: ['Typical design basis: lifting at preload / max weight; lowering needs far less power (gravity assists) and may regenerate.'] };
        }
      },
      {
        id: 'dist', icon: '⚖️', title: 'Motor load distribution', desc: 'Compare running current of all jacking motors – unbalanced share indicates brake drag, gear/pinion problems or VFD/torque-sharing faults.',
        formula: 'Deviation % = (I − I_avg) / I_avg × 100',
        inputs: [{ k: 'tbl', t: 'table', l: 'Motor currents (during same jacking step)', v: [{ n: 'Leg1-M1', a: 52 }, { n: 'Leg1-M2', a: 54 }, { n: 'Leg1-M3', a: 49 }, { n: 'Leg1-M4', a: 63 }, { n: 'Leg1-M5', a: 51 }, { n: 'Leg1-M6', a: 50 }], cols: [{ k: 'n', l: 'Motor', t: 'text', d: 'Motor' }, { k: 'a', l: 'Current A', t: 'num', d: 0 }] }],
        run: v => {
          const n = v.tbl.length, avg = v.tbl.reduce((a, r) => a + r.a, 0) / n; let worst = 0;
          if (!n || avg <= 0) throw new Error('Enter at least one motor current');
          const rows = v.tbl.map(r => { const d = (r.a - avg) / avg * 100; worst = Math.max(worst, Math.abs(d)); return [esc(r.n), r.a, d, Math.abs(d) <= 10 ? '✅' : Math.abs(d) <= 20 ? '⚠️' : '⛔']; });
          const st = lvl(worst, 10, 20);
          return { results: [R('Average current', avg, 'A', 1), R('Worst deviation', worst, '%', 1, st, true), R('Total current', avg * n, 'A', 0)], tables: [{ title: 'Share', head: ['Motor', 'Current A', 'Deviation %', 'Status'], rows, states: rows.map(r => r[3] === '✅' ? 'ok' : r[3] === '⚠️' ? 'warn' : 'bad') }], verdict: { s: st, t: st === 'ok' ? 'Load well shared.' : 'Unequal sharing – check brake release/air gap, gear mesh, VFD torque reference and motor connections.' } };
        }
      },
      {
        id: 'brake', icon: '🛑', title: 'Brake capacity', desc: 'Holding torque required versus the installed brake.',
        formula: 'T_static = W·g·r / (N·i·η_rev)    T_brake ≥ SF × T_static (SF ≥ 1.5–2)',
        inputs: [{ k: 'w', l: 'Hull weight (max)', u: 't', v: 8000, min: 1 }, { k: 'n', l: 'Total motors', v: 24, min: 1, step: 1 }, { k: 'r', l: 'Pinion pitch radius', u: 'mm', v: 250, min: 1 }, { k: 'i', l: 'Total gear ratio (motor : pinion)', v: 600, min: 1 }, { k: 'er', l: 'Back-driving efficiency', u: '%', v: 60, min: 10, max: 100 }, { k: 'sf', l: 'Required safety factor', v: 1.5, min: 1, step: 0.1 }, { k: 'tb', l: 'Brake rated torque', u: 'Nm', v: 600, min: 1 }],
        run: v => {
          const t = v.w * 1000 * G * (v.r / 1000) / (v.n * v.i) * (v.er / 100), req = v.sf * t, ok = v.tb >= req;
          return { results: [R('Static torque at motor shaft', t, 'Nm', 0), R('Required brake torque', req, 'Nm', 0, null, true), R('Installed brake', v.tb, 'Nm', 0, ok ? 'ok' : 'bad'), R('Safety factor achieved', v.tb / t, '×', 2, ok ? 'ok' : 'bad')], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Brake capacity adequate.' : 'Brake torque insufficient for hull holding with the chosen factor – investigate wear / spring set.' } };
        }
      },
      {
        id: 'gap', icon: '🔧', title: 'Brake air gap', desc: 'Check the measured air gap against the allowed wear range.',
        formula: 'Wear remaining = (gap_max − gap_measured) / (gap_max − gap_nominal)',
        inputs: [{ k: 'g0', l: 'Nominal air gap', u: 'mm', v: 0.4, min: 0.01, step: 0.01 }, { k: 'gm', l: 'Maximum permitted gap', u: 'mm', v: 0.9, min: 0.01, step: 0.01 }, { k: 'g', l: 'Measured gap', u: 'mm', v: 0.65, min: 0, step: 0.01 }],
        run: v => {
          if (v.gm <= v.g0) throw new Error('Maximum permitted gap must be larger than the nominal gap');
          const rem = (v.gm - v.g) / (v.gm - v.g0) * 100, st = v.g > v.gm ? 'bad' : rem < 25 ? 'warn' : 'ok';
          return { results: [R('Gap vs maximum', v.g / v.gm * 100, '%', 0, st, true), R('Wear margin remaining', Math.max(0, rem), '%', 0, st), R('Gap increase since new', v.g - v.g0, 'mm', 2)], verdict: { s: st, t: st === 'ok' ? 'Air gap within limits.' : st === 'warn' ? 'Approaching wear limit – adjust / plan lining replacement.' : 'Beyond limit – brake may fail to release/hold. Adjust or replace linings.' } };
        }
      },
      {
        id: 'bres', icon: '♨️', title: 'Brake resistor loading (lowering)', desc: 'Regenerated power when lowering the hull and the resulting resistor loading.',
        formula: 'P_regen = W × g × v × η_rev    P_avg = P_regen × duty',
        inputs: [{ k: 'w', l: 'Hull weight', u: 't', v: 6000, min: 1 }, { k: 'v', l: 'Lowering speed', u: 'm/min', v: 0.6, min: 0.01, step: 0.01 }, { k: 'er', l: 'Return-path efficiency (mech × motor × drive)', u: '%', v: 30, min: 1, max: 100, hint: 'Rack-pinion gearing: low back-driving efficiency → low regeneration' }, { k: 'n', l: 'Drives', v: 24, min: 1, step: 1 }, { k: 'rr', l: 'Resistor rating per drive (continuous)', u: 'kW', v: 4, min: 0.01 }, { k: 'tm', l: 'Lowering time', u: 'min', v: 40, min: 0.1 }],
        run: v => {
          const p = v.w * 1000 * G * v.v / 60 / 1000 * v.er / 100, pd = p / v.n, ld = pd / v.rr * 100, st = lvl(ld, 80, 100);
          return { results: [R('Total regenerated power', p, 'kW', 0), R('Per drive', pd, 'kW', 1), R('Resistor loading', ld, '%', 0, st, true), R('Energy to dissipate', p * v.tm / 60, 'kWh', 1)], verdict: { s: st, t: st === 'ok' ? 'Resistors adequately rated for lowering.' : 'Resistor overloaded – slow down lowering, check chopper / resistor cooling.' } };
        }
      },
      {
        id: 'cool', icon: '❄️', title: 'Cooling requirement', desc: 'Heat from motors and drives, and the air / water flow to remove it.',
        formula: 'Q = P_el × (1 − η)    Air: V̇ = Q / (ρ·cp·ΔT)    Water: ṁ = Q / (cp·ΔT)',
        inputs: [{ k: 'pel', l: 'Total electrical power', u: 'kW', v: 600, min: 0 }, { k: 'em', l: 'Overall efficiency (motor + drive)', u: '%', v: 90, min: 10, max: 100 }, { k: 'dta', l: 'Air temperature rise', u: 'K', v: 12, min: 1 }, { k: 'dtw', l: 'Water temperature rise', u: 'K', v: 5, min: 1 }],
        run: v => { const q = v.pel * (1 - v.em / 100); return { results: [R('Heat loss', q, 'kW', 1, null, true), R('Air flow', q / (1.2 * 1.005 * v.dta), 'm³/s', 2), R('Air flow', q / (1.2 * 1.005 * v.dta) * 3600, 'm³/h', 0), R('Cooling water', q / (4.18 * v.dtw) * 60, 'L/min', 0)] }; }
      },
      {
        id: 'vfd', icon: '🎛️', title: 'VFD loading during jacking', desc: 'Drive current versus rating during a jacking step.',
        formula: 'Load % = I_motor / I_drive',
        inputs: [{ k: 'im', l: 'Motor current during jacking', u: 'A', v: 52, min: 0 }, { k: 'id', l: 'Drive rated output current', u: 'A', v: 60, min: 1 }, { k: 'pk', l: 'Peak current at start', u: 'A', v: 78, min: 0 }, { k: 'ov', l: 'Drive overload capacity', u: '% × 60 s', v: 150, min: 100 }],
        run: v => { const l = v.im / v.id * 100, pk = v.pk / v.id * 100, st = lvl(l, 85, 100), sp = pk <= v.ov ? 'ok' : 'bad'; return { results: [R('Continuous loading', l, '%', 0, st, true), R('Peak loading', pk, '%', 0, sp), R('Margin to overload limit', v.ov - pk, '%', 0, sp)], verdict: { s: st === 'bad' || sp === 'bad' ? 'bad' : st, t: st === 'ok' && sp === 'ok' ? 'Drives have adequate margin.' : 'Drive current high – check mechanical load, cooling and parameters.' } }; }
      },
      {
        id: 'dg', icon: '🛢️', title: 'DG loading during jacking (N-1 check)', desc: 'Loading with all DGs online and after losing one DG.',
        formula: 'Load% = (P_base + P_jack) / (n × P_DG)    N−1: ÷ (n − 1)',
        inputs: [{ k: 'base', l: 'Base load', u: 'kW', v: 500, min: 0 }, { k: 'jack', l: 'Jacking load', u: 'kW', v: 1900, min: 0 }, { k: 'dg', l: 'DG rating', u: 'kW', v: 1600, min: 1 }, { k: 'n', l: 'DGs online', v: 4, min: 1, step: 1 }, { k: 'start', l: 'PMS starts standby at', u: '%', v: 80, min: 10, max: 100 }],
        run: v => {
          const tot = v.base + v.jack, l = tot / (v.n * v.dg) * 100, l1 = v.n > 1 ? tot / ((v.n - 1) * v.dg) * 100 : Infinity, st = lvl(l, v.start, 100), s1 = lvl(l1, 100, 110);
          return { results: [R('Total load', tot, 'kW', 0), R('Loading (all online)', l, '%', 0, st, true), R('Loading after losing 1 DG', l1, '%', 0, s1), R('Spare', v.n * v.dg - tot, 'kW', 0)], verdict: { s: s1 === 'ok' ? st : 'warn', t: s1 === 'ok' ? 'Plant can lose one DG during jacking without overload.' : 'Loss of one DG would overload the plant – bring a further DG online before jacking (single-failure philosophy).' } };
        }
      },
      {
        id: 'emer', icon: '🆘', title: 'Backup power for jacking operations', desc: 'Emergency / UPS supply for brakes, controls and safe-state functions during a blackout.',
        formula: 'Σ(kW × duty) vs emergency source; battery Ah for controls',
        inputs: [{ k: 'tbl', t: 'table', l: 'Backup loads', v: [{ n: 'Brake release / hold supply', kw: 6, d: 100 }, { n: 'Jacking control UPS', kw: 2, d: 100 }, { n: 'Leg position / level sensors', kw: 1, d: 100 }, { n: 'Emergency lighting', kw: 4, d: 100 }, { n: 'Comms & alarms', kw: 2, d: 100 }, { n: 'Hydraulic power unit (emergency lowering)', kw: 15, d: 30 }],
          cols: [{ k: 'n', l: 'Load', t: 'text', d: 'Load' }, { k: 'kw', l: 'kW', t: 'num', d: 0 }, { k: 'd', l: 'Duty %', t: 'num', d: 100 }] }, { k: 'gen', l: 'Emergency generator rating', u: 'kW', v: 100, min: 1 }, { k: 'max', l: 'Max loading', u: '%', v: 80, min: 10, max: 100 }],
        run: v => {
          const tot = v.tbl.reduce((a, r) => a + r.kw * r.d / 100, 0), l = tot / v.gen * 100, st = lvl(l, v.max, 100);
          return { results: [R('Backup load', tot, 'kW', 1, null, true), R('Emergency gen loading', l, '%', 0, st), R('Spare', v.gen - tot, 'kW', 1)], tables: [{ title: 'Detail', head: ['Load', 'kW', 'Duty %', 'Demand kW'], rows: v.tbl.map(r => [esc(r.n), r.kw, r.d, r.kw * r.d / 100]) }], verdict: { s: st, t: st === 'ok' ? 'Emergency source can support the backup loads.' : 'Backup loads exceed the emergency source target loading.' } };
        }
      }
    ]
  });
})();
