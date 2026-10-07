(function () {
  const { R, lvl, S3 } = ETO;
  const G = 9.81;
  ETO.page({
    title: 'Crane Electrical Calculations', icon: '🏋️', accent: '#a16207',
    subtitle: 'Hoist and hydraulic power, starting, VFD loading, regeneration and the impact of the crane on the power plant.',
    refs: ['IEC 60204-32', 'IEC 60092-503', 'API 2C / class', 'IEC 60034'],
    calcs: [
      {
        id: 'mot', icon: '🔢', title: 'Crane motor current', desc: 'Rated current and duty-cycle equivalent current.',
        formula: 'I = P×1000/(√3·V·PF·η)    I_eq = I × √(ED)',
        inputs: [{ k: 'p', l: 'Motor power', u: 'kW', v: 110, min: 0.1 }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 }, { k: 'pf', l: 'PF', v: 0.86, min: 0.1, max: 1, step: 0.01 }, { k: 'e', l: 'Efficiency', u: '%', v: 93, min: 1, max: 100 }, { k: 'ed', l: 'Duty (ED)', u: '%', v: 40, min: 1, max: 100 }],
        run: v => { const i = v.p * 1000 / (S3 * v.v * v.pf * v.e / 100); return { results: [R('Rated current', i, 'A', 1, null, true), R('Thermal-equivalent current', i * Math.sqrt(v.ed / 100), 'A', 1), R('Input kVA', S3 * v.v * i / 1000, 'kVA', 1)] }; }
      },
      {
        id: 'hoist', icon: '⬆️', title: 'Hoisting power', desc: 'Motor power required to hoist a load at speed, and regenerated power when lowering.',
        formula: 'P = m × g × v / (60 × η_total)    P_regen = m × g × v / 60 × η',
        inputs: [{ k: 'm', l: 'Load (incl. hook/block)', u: 't', v: 50, min: 0.01 }, { k: 'v', l: 'Hoist speed', u: 'm/min', v: 20, min: 0.01 }, { k: 'em', l: 'Mechanical efficiency (rope + winch + gear)', u: '%', v: 80, min: 10, max: 100 }, { k: 'emo', l: 'Motor × drive efficiency', u: '%', v: 90, min: 10, max: 100 }, { k: 'pm', l: 'Installed motor', u: 'kW', v: 110, min: 0.1 }],
        run: v => {
          const ps = v.m * 1000 * G * v.v / 60 / 1000 / (v.em / 100), pe = ps / (v.emo / 100), u = ps / v.pm * 100, st = lvl(u, 85, 100);
          return { results: [R('Shaft power', ps, 'kW', 1, st, true), R('Electrical input', pe, 'kW', 1), R('Motor utilisation', u, '%', 0, st), R('Regeneration when lowering', v.m * 1000 * G * v.v / 60 / 1000 * v.em / 100 * v.emo / 100, 'kW', 1)], verdict: { s: st, t: st === 'ok' ? 'Motor adequate.' : 'Hoist motor heavily loaded for this duty.' } };
        }
      },
      {
        id: 'hyd', icon: '💧', title: 'Hydraulic power', desc: 'Hydraulic pump power, torque and electric-motor input.',
        formula: 'P_hyd = Q × p / 600 (kW; Q L/min, p bar)    Q = D × N × η_vol / 1000    T = D × p /(62.83 × η_hm)',
        inputs: [{ k: 'd', l: 'Pump displacement', u: 'cc/rev', v: 100, min: 0.1 }, { k: 'n', l: 'Speed', u: 'rpm', v: 1780, min: 1 }, { k: 'p', l: 'Working pressure', u: 'bar', v: 250, min: 1 }, { k: 'ev', l: 'Volumetric efficiency', u: '%', v: 95, min: 10, max: 100 }, { k: 'eh', l: 'Hydro-mechanical efficiency', u: '%', v: 90, min: 10, max: 100 }, { k: 'em', l: 'Electric motor efficiency', u: '%', v: 93, min: 10, max: 100 }],
        run: v => {
          const q = v.d * v.n * v.ev / 100 / 1000, ph = q * v.p / 600;
          const shaft = v.d * v.n / 1000 * v.p / 600 / (v.eh / 100);
          return { results: [R('Flow', q, 'L/min', 0), R('Hydraulic power', ph, 'kW', 1), R('Pump shaft power', shaft, 'kW', 1, null, true), R('Electric input', shaft / (v.em / 100), 'kW', 1), R('Torque', v.d * v.p / (62.83 * v.eh / 100), 'Nm', 0)] };
        }
      },
      {
        id: 'start', icon: '🚀', title: 'Starting current & generator dip', desc: 'Starting current by method and the resulting voltage dip.',
        formula: 'Ist = FLC × Ilr/In × method factor    dip = S_st/(S_st + S_gen/X″d)',
        inputs: [{ k: 'flc', l: 'Motor FLC', u: 'A', v: 190, min: 0.1 }, { k: 'r', l: 'Locked-rotor ratio', v: 6.5, min: 1, step: 0.1 }, { k: 'm', l: 'Starting method', opts: [[1, 'DOL'], [0.3333, 'Star-delta'], [0.5, 'Soft starter (limit 3.25×)'], [0.17, 'VFD (≈1.1×FLC)']], v: 1 }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 }, { k: 'sg', l: 'DGs online', u: 'kVA', v: 4000, min: 1 }, { k: 'x', l: 'X″d', v: 0.16, min: 0.05, step: 0.01 }],
        run: v => {
          const ist = v.flc * v.r * v.m, s = S3 * v.v * ist / 1000, dip = s / (s + v.sg / v.x) * 100, st = lvl(dip, 10, 15);
          return { results: [R('Starting current', ist, 'A', 0), R('Starting kVA', s, 'kVA', 0), R('Voltage dip at gen', dip, '%', 1, st, true)], verdict: { s: st, t: st === 'ok' ? 'Acceptable dip.' : 'Large dip – use a gentler starting method.' } };
        }
      },
      {
        id: 'vfd', icon: '🎛️', title: 'VFD loading (crane drive)', desc: 'Drive loading at rated and accelerating conditions.',
        formula: 'Load % = I / I_drive',
        inputs: [{ k: 'i', l: 'Hoist current (measured/calculated)', u: 'A', v: 160, min: 0 }, { k: 'id', l: 'Drive rating', u: 'A', v: 210, min: 1 }, { k: 'k', l: 'Acceleration peak factor', v: 1.4, min: 1, step: 0.05 }, { k: 'ov', l: 'Drive overload', u: '% × 60 s', v: 150, min: 100 }],
        run: v => { const l = v.i / v.id * 100, p = l * v.k, st = lvl(l, 85, 100), sp = p <= v.ov ? 'ok' : 'bad'; return { results: [R('Steady loading', l, '%', 0, st, true), R('Accelerating peak', p, '%', 0, sp)], verdict: { s: sp === 'bad' ? 'bad' : st, t: sp === 'bad' ? 'Peak current exceeds overload capability – lengthen ramps / larger drive.' : 'Drive has margin.' } }; }
      },
      {
        id: 'regen', icon: '♻️', title: 'Regeneration & brake resistor', desc: 'Lowering energy and resistor sizing.',
        formula: 'E = m·g·h·η    P_avg = E / t_cycle',
        inputs: [{ k: 'm', l: 'Load', u: 't', v: 50, min: 0.01 }, { k: 'h', l: 'Lowering height', u: 'm', v: 40, min: 0.1 }, { k: 'v', l: 'Lowering speed', u: 'm/min', v: 25, min: 0.1 }, { k: 'eta', l: 'Return efficiency', v: 0.7, min: 0.1, max: 1, step: 0.01 }, { k: 'tc', l: 'Cycle time', u: 'min', v: 6, min: 0.1 }, { k: 'rr', l: 'Resistor continuous rating', u: 'kW', v: 25, min: 0.1 }],
        run: v => {
          const e = v.m * 1000 * G * v.h * v.eta / 1000, pk = v.m * 1000 * G * v.v / 60 / 1000 * v.eta, pav = e / (v.tc * 60), ld = pav / v.rr * 100, st = lvl(ld, 80, 100);
          return { results: [R('Peak regen power', pk, 'kW', 1), R('Energy per lowering', e, 'kJ', 0), R('Average power', pav, 'kW', 1), R('Resistor loading', ld, '%', 0, st, true)], verdict: { s: st, t: st === 'ok' ? 'Resistor adequate.' : 'Resistor overloaded for this duty cycle.' } };
        }
      },
      {
        id: 'gen', icon: '🛢️', title: 'Generator impact', desc: 'Load step from crane operation on the online DGs.',
        formula: 'Step% = P_crane / (n × P_DG)    New loading = (P_base + P_crane)/(n × P_DG)',
        inputs: [{ k: 'base', l: 'Existing plant load', u: 'kW', v: 1800, min: 0 }, { k: 'cr', l: 'Crane peak demand', u: 'kW', v: 190, min: 0 }, { k: 'dg', l: 'DG rating', u: 'kW', v: 1600, min: 1 }, { k: 'n', l: 'DGs online', v: 3, min: 1, step: 1 }],
        run: v => {
          const cap = v.n * v.dg, step = v.cr / cap * 100, nl = (v.base + v.cr) / cap * 100, st = lvl(nl, 85, 100), ss = lvl(step, 25, 50);
          return { results: [R('Step load', step, '% of online capacity', 1, ss), R('Loading before', v.base / cap * 100, '%', 0), R('Loading after', nl, '%', 0, st, true), R('Spare', cap - v.base - v.cr, 'kW', 0)], verdict: { s: st === 'bad' ? 'bad' : ss === 'bad' ? 'bad' : st === 'warn' || ss === 'warn' ? 'warn' : 'ok', t: 'Check the DG load-acceptance (step) capability and PMS heavy-consumer permission.' } };
        }
      },
      {
        id: 'vd', icon: '📉', title: 'Crane supply cable voltage drop', desc: 'Voltage drop for the crane feeder (include slip-ring / festoon length).',
        formula: 'Vd = √3 × I × L × (R cosφ + X sinφ)',
        inputs: [{ k: 'i', l: 'Current', u: 'A', v: 190, min: 0 }, { k: 'l', l: 'Length', u: 'm', v: 90, min: 0 }, { k: 's', l: 'Cable size', u: 'mm²', v: 95, min: 0.5 }, { k: 'pf', l: 'PF', v: 0.86, min: 0.2, max: 1, step: 0.01 }, { k: 'v', l: 'Voltage', u: 'V', v: 440, min: 1 }, { k: 'lim', l: 'Allowed', u: '%', v: 5, min: 0.1 }],
        run: v => { const d = ETO.vdrop('3', v.i, v.l, v.s, 'Cu', 70, 0.08, v.pf, 1), pc = d.v / v.v * 100, st = lvl(pc, v.lim, v.lim * 1.2); return { results: [R('Voltage drop', d.v, 'V', 2, st), R('Voltage drop', pc, '%', 2, st, true)] }; }
      }
    ]
  });
})();
