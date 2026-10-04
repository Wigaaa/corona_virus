(function () {
  const { R, lvl, S3, esc } = ETO;
  const PI = Math.PI;
  const THD = { 6: 30, 12: 12, 18: 6, 24: 4, 0: 4 };
  ETO.page({
    title: 'Thruster Calculations', icon: '🌀', accent: '#1e40af',
    subtitle: 'How much power does a thruster put on the plant? Drive, transformer, DG loading, acceleration and harmonics.',
    refs: ['IEC 61800', 'IEC 60092-301', 'Class DP / propulsion rules', 'IEEE 519'],
    calcs: [
      {
        id: 'mot', icon: '🔢', title: 'Thruster motor current', desc: 'Current and kVA at a given shaft power.',
        formula: 'I = P×1000 / (√3·V·PF·η)',
        inputs: [{ k: 'p', l: 'Shaft power', u: 'kW', v: 1000, min: 0.1 }, { k: 'v', l: 'Motor voltage', u: 'V', v: 690, min: 1 }, { k: 'pf', l: 'Motor PF', v: 0.9, min: 0.1, max: 1, step: 0.01 }, { k: 'e', l: 'Motor efficiency', u: '%', v: 96, min: 1, max: 100 }],
        run: v => { const i = v.p * 1000 / (S3 * v.v * v.pf * v.e / 100); return { results: [R('Motor current', i, 'A', 0, null, true), R('Input power', v.p / (v.e / 100), 'kW', 0), R('Input kVA', v.p / (v.e / 100) / v.pf, 'kVA', 0)] }; }
      },
      {
        id: 'delta', icon: '❓', title: 'Thruster at X% – added load on plant', desc: '“If Thruster No. 2 operates at X%, how much additional load will it put on the power plant?” Propeller law: power ∝ speed³.',
        formula: 'P(x) = P_rated × x^n  (n = 3)     P_el = P / (η_motor × η_vfd)     ΔP = P_el(x2) − P_el(x1)',
        inputs: [
          { k: 'p', l: 'Thruster rated shaft power', u: 'kW', v: 1500, min: 1 }, { k: 'x1', l: 'Present speed', u: '%', v: 40, min: 0, max: 110 }, { k: 'x2', l: 'New speed (X)', u: '%', v: 80, min: 0, max: 110 }, { k: 'n', l: 'Power exponent', v: 3, min: 1, max: 3.5, step: 0.1, hint: '3 for FPP propeller; CPP at constant rpm ≈ pitch-based' },
          { k: 'em', l: 'Motor efficiency', u: '%', v: 96, min: 1, max: 100 }, { k: 'ev', l: 'Drive + transformer efficiency', u: '%', v: 96, min: 1, max: 100 }, { k: 'pf', l: 'Plant PF of load', v: 0.95, min: 0.3, max: 1, step: 0.01 },
          { k: 'base', l: 'Existing plant load', u: 'kW', v: 3000, min: 0 }, { k: 'dg', l: 'DG rating', u: 'kW', v: 2000, min: 1 }, { k: 'dn', l: 'DGs online', v: 3, min: 1, step: 1 }
        ],
        run: v => {
          const k = 1 / (v.em / 100 * v.ev / 100), pa = v.p * (v.x1 / 100) ** v.n * k, pb = v.p * (v.x2 / 100) ** v.n * k, d = pb - pa, cap = v.dn * v.dg, la = (v.base) / cap * 100, lb = (v.base + d) / cap * 100, st = lvl(lb, 85, 100);
          return { results: [R('Electrical load at X1', pa, 'kW', 0), R('Electrical load at X2', pb, 'kW', 0), R('Additional load ΔP', d, 'kW', 0, null, true), R('Additional kVA', d / v.pf, 'kVA', 0), R('Plant loading before', la, '%', 0), R('Plant loading after', lb, '%', 0, st), R('Equivalent DGs', d / v.dg, 'DG', 2)],
            verdict: { s: st, t: lb > 100 ? 'Plant would be overloaded – start more DGs or limit thruster power (PMS thruster limiting / blackout prevention).' : lb > 85 ? 'Plant high – consider starting a standby DG before this speed.' : 'Plant can accept this increase.' }, notes: ['Doubling speed raises power 8×. 50% speed = 12.5% power, 80% speed = 51% power.'] };
        }
      },
      {
        id: 'multi', icon: '🚢', title: 'Several thrusters – total plant load', desc: 'All thrusters at their set speeds plus hotel load against DG capacity.',
        formula: 'ΣP_el = Σ P_rated,i × x_i³ / (η_m η_v)',
        inputs: [
          { k: 'tbl', t: 'table', l: 'Thrusters', v: [{ n: 'Thruster 1', p: 1500, x: 60 }, { n: 'Thruster 2', p: 1500, x: 80 }, { n: 'Thruster 3', p: 1500, x: 60 }, { n: 'Thruster 4', p: 1500, x: 40 }], cols: [{ k: 'n', l: 'Name', t: 'text', d: 'Thruster' }, { k: 'p', l: 'Rated kW', t: 'num', d: 1500 }, { k: 'x', l: 'Speed %', t: 'num', d: 0 }] },
          { k: 'eta', l: 'Motor × drive × transformer efficiency', u: '%', v: 92, min: 10, max: 100 }, { k: 'base', l: 'Hotel / other load', u: 'kW', v: 1200, min: 0 }, { k: 'dg', l: 'DG rating', u: 'kW', v: 2500, min: 1 }, { k: 'n', l: 'DGs online', v: 4, min: 1, step: 1 }
        ],
        run: v => {
          let tot = 0; const rows = v.tbl.map(t => { const pe = t.p * (t.x / 100) ** 3 / (v.eta / 100); tot += pe; return [esc(t.n), t.p, t.x, t.p * (t.x / 100) ** 3, pe]; });
          const cap = v.n * v.dg, ld = (tot + v.base) / cap * 100, st = lvl(ld, 85, 100), l1 = v.n > 1 ? (tot + v.base) / ((v.n - 1) * v.dg) * 100 : Infinity;
          return { results: [R('Thruster electrical load', tot, 'kW', 0, null, true), R('Total plant load', tot + v.base, 'kW', 0), R('DG loading', ld, '%', 0, st), R('Loading if 1 DG lost', l1, '%', 0, lvl(l1, 100, 110))], tables: [{ title: 'Per thruster', head: ['Thruster', 'Rated kW', 'Speed %', 'Shaft kW', 'Electrical kW'], rows }], verdict: { s: st, t: st === 'ok' ? 'Plant loading acceptable.' : 'Plant overloaded / near limit.' } };
        }
      },
      {
        id: 'vfd', icon: '🎛️', title: 'Thruster VFD loading', desc: 'Drive output current and loading.',
        formula: 'Load % = I_motor / I_drive',
        inputs: [{ k: 'p', l: 'Shaft power', u: 'kW', v: 1200, min: 0.1 }, { k: 'v', l: 'Motor voltage', u: 'V', v: 690, min: 1 }, { k: 'pf', l: 'Motor PF', v: 0.9, min: 0.1, max: 1, step: 0.01 }, { k: 'e', l: 'Motor efficiency', u: '%', v: 96, min: 1, max: 100 }, { k: 'id', l: 'Drive rated current', u: 'A', v: 1250, min: 1 }, { k: 'pin', l: 'Drive kVA rating', u: 'kVA', v: 1800, min: 1 }],
        run: v => { const i = v.p * 1000 / (S3 * v.v * v.pf * v.e / 100), l = i / v.id * 100, st = lvl(l, 85, 100); return { results: [R('Motor current', i, 'A', 0), R('Drive loading', l, '%', 0, st, true), R('Drive kVA loading', S3 * v.v * i / 1000 / v.pin * 100, '%', 0)], verdict: { s: st, t: st === 'ok' ? 'Drive loading acceptable.' : 'Drive close to / above its current limit.' } }; }
      },
      {
        id: 'acc', icon: '⏱️', title: 'Acceleration power & ramp rate', desc: 'Extra power to accelerate propeller inertia (including entrained water) and the resulting kW/s ramp on the plant.',
        formula: 'ω = 2πN/60    E = ½Jω²    P_acc,peak = Jω²/t (linear ramp)',
        inputs: [{ k: 'j', l: 'Total inertia (motor + shaft + propeller + entrained water)', u: 'kg·m²', v: 900, min: 0.1 }, { k: 'n', l: 'Final speed', u: 'rpm', v: 750, min: 1 }, { k: 'p', l: 'Rated shaft power', u: 'kW', v: 1500, min: 1 }, { k: 't', l: 'Ramp time 0 → rated', u: 's', v: 20, min: 1 }, { k: 'eta', l: 'Overall efficiency', u: '%', v: 92, min: 10, max: 100 }],
        run: v => {
          const w = 2 * PI * v.n / 60, e = 0.5 * v.j * w * w / 1000, pacc = v.j * w * w / v.t / 1000, peakEl = (v.p + pacc) / (v.eta / 100);
          return { results: [R('Kinetic energy', e, 'kJ', 0), R('Peak acceleration power', pacc, 'kW', 0), R('Peak electrical demand', peakEl, 'kW', 0, null, true), R('Ramp rate', peakEl / v.t, 'kW/s', 0)], notes: ['Dynamic ramp-rate limiting in the PMS / drive protects DGs from a large step (blackout prevention).'] };
        }
      },
      {
        id: 'prop', icon: '🧭', title: 'Thrust estimate vs speed', desc: 'Approximate bollard thrust and how it scales with speed.',
        formula: 'Thrust ≈ k × P_shaft (bollard)    T ∝ N²    P ∝ N³',
        inputs: [{ k: 'p', l: 'Rated shaft power', u: 'kW', v: 1500, min: 1 }, { k: 'k', l: 'Thrust per kW (bollard)', u: 'kN/kW', v: 0.15, min: 0.05, step: 0.01, hint: 'Open propeller ≈ 0.11–0.13; ducted/azimuth ≈ 0.15–0.19. Use maker data.' }, { k: 'x', l: 'Speed', u: '%', v: 80, min: 0, max: 110 }, { k: 'n', l: 'Number of thrusters', v: 4, min: 1, step: 1 }],
        run: v => { const x = v.x / 100, t0 = v.k * v.p; return { results: [R('Rated thrust (each)', t0, 'kN', 0), R('Thrust at speed (each)', t0 * x * x, 'kN', 0, null, true), R('Power at speed (each)', v.p * x ** 3, 'kW', 0), R('Total thrust', t0 * x * x * v.n, 'kN', 0), R('Thrust per kW at this speed', t0 * x * x / (v.p * x ** 3 || 1), 'kN/kW', 2)], notes: ['Thrust/kW improves at part load – running more thrusters at lower speed is more efficient than few at full speed.'] }; }
      },
      {
        id: 'tr', icon: '🧲', title: 'Drive transformer loading', desc: 'Transformer kVA required and loading for a thruster drive.',
        formula: 'S = P_shaft / (η_m × η_vfd × DPF)    Load% = S / S_tr',
        inputs: [{ k: 'p', l: 'Shaft power', u: 'kW', v: 1200, min: 0.1 }, { k: 'em', l: 'Motor efficiency', u: '%', v: 96, min: 1, max: 100 }, { k: 'ev', l: 'Drive efficiency', u: '%', v: 97, min: 1, max: 100 }, { k: 'dpf', l: 'Input displacement PF', v: 0.96, min: 0.5, max: 1, step: 0.01 }, { k: 'st', l: 'Transformer rating', u: 'kVA', v: 1600, min: 1 }, { k: 'vp', l: 'Primary voltage', u: 'V', v: 6600, min: 1 }, { k: 'k', l: 'Harmonic derating (K)', v: 0.95, min: 0.5, max: 1, step: 0.01 }],
        run: v => {
          const s = v.p / (v.em / 100 * v.ev / 100 * v.dpf), l = s / (v.st * v.k) * 100, st = lvl(l, 80, 100);
          return { results: [R('Required kVA', s, 'kVA', 0), R('Loading (after derating)', l, '%', 0, st, true), R('Primary current', s * 1000 / (S3 * v.vp), 'A', 1)], verdict: { s: st, t: st === 'ok' ? 'Transformer adequate.' : 'Transformer overloaded for this thruster power.' } };
        }
      },
      {
        id: 'harm', icon: '〰️', title: 'Thruster drive harmonics', desc: 'Typical input THD and harmonic current by drive topology.',
        formula: 'Ih = % × I1',
        inputs: [{ k: 'p', l: 'Drive input power', u: 'kW', v: 1300, min: 0.1 }, { k: 'v', l: 'Line voltage', u: 'V', v: 690, min: 1 }, { k: 'dpf', l: 'DPF', v: 0.96, min: 0.5, max: 1, step: 0.01 }, { k: 'top', l: 'Front end', opts: [[6, '6-pulse'], [12, '12-pulse'], [18, '18-pulse'], [24, '24-pulse'], [0, 'Active front end']], v: 12 }],
        run: v => { const i1 = v.p * 1000 / (S3 * v.v * v.dpf), t = THD[v.top], ih = i1 * t / 100; return { results: [R('Fundamental current', i1, 'A', 0), R('Typical THD-I', t, '%', 0, lvl(t, 8, 15), true), R('Harmonic current', ih, 'A', 0), R('Harmonic kVA', S3 * v.v * ih / 1000, 'kVA', 0)], notes: ['Typical, unfiltered values. Use the Harmonics page to estimate the THD-V on the generators.'] }; }
      },
      {
        id: 'cool', icon: '❄️', title: 'Thruster cooling load', desc: 'Heat rejected by motor, drive and transformer.',
        formula: 'Q = P_in − P_out    Water: L/min = Q×60 / (4.18×ΔT)',
        inputs: [{ k: 'p', l: 'Shaft power', u: 'kW', v: 1200, min: 0.1 }, { k: 'em', l: 'Motor efficiency', u: '%', v: 96, min: 1, max: 100 }, { k: 'ev', l: 'Drive efficiency', u: '%', v: 97, min: 1, max: 100 }, { k: 'et', l: 'Transformer efficiency', u: '%', v: 98.5, min: 1, max: 100 }, { k: 'dt', l: 'Cooling water rise', u: 'K', v: 8, min: 1 }],
        run: v => { const pin = v.p / (v.em / 100 * v.ev / 100 * v.et / 100), q = pin - v.p; return { results: [R('Total heat loss', q, 'kW', 1, null, true), R('Motor loss', v.p / (v.em / 100) - v.p, 'kW', 1), R('Drive loss', v.p / (v.em / 100) / (v.ev / 100) - v.p / (v.em / 100), 'kW', 1), R('Cooling water flow', q * 60 / (4.18 * v.dt), 'L/min', 0)] }; }
      }
    ]
  });
})();
