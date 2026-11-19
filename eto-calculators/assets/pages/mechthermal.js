(function () {
  const { R, lvl, S3 } = ETO;
  const PI = Math.PI, D = 180 / PI, G = 9.80665;
  const MOTORS = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315, 355, 400];
  ETO.page({
    title: 'Mechanical, Fluid & Thermal', icon: '🔧', accent: '#65a30d',
    subtitle: 'Mechanical power and drives, rigging, pumps and pipe flow, heating, expansion, fuel efficiency and ventilation – the non-electrical half of an ETO\'s day.',
    refs: ['ISO 80000', 'ISO 5167 / pipe flow', 'LOLER / rigging practice'],
    calcs: [
      {
        id: 'pts', icon: '⚙️', title: 'Power – torque – speed', desc: 'Solve for any one of shaft power, torque or speed.',
        formula: 'P (kW) = T (N·m) × N (rpm) / 9549',
        inputs: [{ k: 's', l: 'Solve for', opts: [['p', 'Power'], ['t', 'Torque'], ['n', 'Speed']], v: 'p' }, { k: 'p', l: 'Power', u: 'kW', v: 90, min: 0.000001, show: v => v.s !== 'p' }, { k: 't', l: 'Torque', u: 'N·m', v: 484, min: 0.000001, show: v => v.s !== 't' }, { k: 'n', l: 'Speed', u: 'rpm', v: 1775, min: 0.000001, show: v => v.s !== 'n' }],
        run: v => {
          const p = v.s === 'p' ? v.t * v.n / 9549.3 : v.p, t = v.s === 't' ? 9549.3 * v.p / v.n : v.t, n = v.s === 'n' ? 9549.3 * v.p / v.t : v.n;
          return { results: [R('Power', p, 'kW', 'auto', null, v.s === 'p'), R('Power', p / 0.74569987, 'HP', 'auto'), R('Torque', t, 'N·m', 'auto', null, v.s === 't'), R('Torque', t * 0.7375621, 'lbf·ft', 'auto'), R('Speed', n, 'rpm', 'auto', null, v.s === 'n'), R('Angular speed', 2 * PI * n / 60, 'rad/s', 'auto')] };
        }
      },
      {
        id: 'gear', icon: '🛞', title: 'Gear / pulley ratio', desc: 'Output speed and torque for one or two gear (or pulley) stages.',
        formula: 'ratio = (Z₂/Z₁)(Z₄/Z₃)     n_out = n_in / ratio     T_out = T_in × ratio × η^stages',
        inputs: [{ k: 'st', l: 'Stages', opts: [[1, '1 stage'], [2, '2 stages']], v: 1 }, { k: 'z1', l: 'Driver teeth / diameter Z₁', v: 20, min: 1 }, { k: 'z2', l: 'Driven teeth / diameter Z₂', v: 80, min: 1 }, { k: 'z3', l: 'Stage 2 driver Z₃', v: 18, min: 1, show: v => +v.st === 2 }, { k: 'z4', l: 'Stage 2 driven Z₄', v: 72, min: 1, show: v => +v.st === 2 }, { k: 'n', l: 'Input speed', u: 'rpm', v: 1780, min: 0.001 }, { k: 'p', l: 'Input power', u: 'kW', v: 30, min: 0.001 }, { k: 'e', l: 'Efficiency per stage', u: '%', v: 97, min: 50, max: 100 }],
        run: v => {
          const two = +v.st === 2, ratio = (v.z2 / v.z1) * (two ? v.z4 / v.z3 : 1), eta = (v.e / 100) ** (two ? 2 : 1), nout = v.n / ratio, tin = 9549.3 * v.p / v.n;
          return { results: [R('Reduction ratio', ratio, ': 1', 4, null, true), R('Output speed', nout, 'rpm', 'auto', null, true), R('Output torque', tin * ratio * eta, 'N·m', 'auto'), R('Output power', v.p * eta, 'kW', 'auto'), R('Gearbox loss', v.p * (1 - eta), 'kW', 'auto'), R('Input torque', tin, 'N·m', 'auto')] };
        }
      },
      {
        id: 'belt', icon: '🔄', title: 'Belt drive', desc: 'Belt length, belt speed, driven speed and contact angle for two pulleys.',
        formula: 'L = 2C + π(D+d)/2 + (D−d)²/(4C)     v = π·d·n / 60000     wrap = 180° − 2·asin((D−d)/(2C))',
        inputs: [{ k: 'dd', l: 'Driver pulley diameter d', u: 'mm', v: 200, min: 1 }, { k: 'dl', l: 'Driven pulley diameter D', u: 'mm', v: 400, min: 1 }, { k: 'c', l: 'Centre distance C', u: 'mm', v: 800, min: 1 }, { k: 'n', l: 'Driver speed', u: 'rpm', v: 1480, min: 0.01 }, { k: 'sl', l: 'Slip', u: '%', v: 1.5, min: 0, max: 10 }],
        run: v => {
          const dmn = Math.min(v.dd, v.dl), dmx = Math.max(v.dd, v.dl); if (v.c <= (dmx - dmn) / 2) throw new Error('Centre distance too small for these pulleys');
          const L = 2 * v.c + PI * (v.dd + v.dl) / 2 + (v.dl - v.dd) ** 2 / (4 * v.c), wrap = 180 - 2 * Math.asin((dmx - dmn) / (2 * v.c)) * D;
          return { results: [R('Belt length', L, 'mm', 1, null, true), R('Belt speed', PI * v.dd * v.n / 60000, 'm/s', 2), R('Driven speed', v.n * v.dd / v.dl * (1 - v.sl / 100), 'rpm', 1, null, true), R('Speed ratio', v.dl / v.dd, ': 1', 3), R('Wrap angle on small pulley', wrap, '°', 1, wrap < 120 ? 'warn' : 'ok')], verdict: wrap < 120 ? { s: 'warn', t: 'Wrap angle below 120° – risk of slip; increase centre distance or use a tensioner.' } : null };
        }
      },
      {
        id: 'shaft', icon: '🔩', title: 'Shaft torsion (stress & twist)', desc: 'Shear stress and twist of a solid round shaft and required diameter.',
        formula: 'τ = 16T/(πd³)     θ = T·L/(G·J)     J = πd⁴/32     d_req = ∛(16T/(π·τ_allow))',
        inputs: [{ k: 't', l: 'Torque', u: 'N·m', v: 1200, min: 0 }, { k: 'd', l: 'Shaft diameter', u: 'mm', v: 60, min: 1 }, { k: 'l', l: 'Length', u: 'mm', v: 800, min: 1 }, { k: 'g', l: 'Shear modulus G', u: 'GPa', v: 80, min: 1, hint: 'Steel ≈ 80, aluminium ≈ 26' }, { k: 'ta', l: 'Allowable shear stress', u: 'MPa', v: 40, min: 1, hint: 'Typical working value 30–50 MPa for mild steel with keyway' }],
        run: v => {
          const T = v.t * 1000, tau = 16 * T / (PI * v.d ** 3), J = PI * v.d ** 4 / 32, th = T * v.l / (v.g * 1000 * J), dreq = Math.cbrt(16 * T / (PI * v.ta)), st = lvl(tau / v.ta, 0.8, 1);
          return { results: [R('Shear stress', tau, 'MPa', 2, st, true), R('Utilisation', tau / v.ta * 100, '%', 0, st), R('Twist angle', th * D, '°', 3), R('Required diameter', dreq, 'mm', 1), R('Polar moment J', J / 1e4, 'cm⁴', 1)], verdict: { s: st, t: st === 'bad' ? 'Shaft over-stressed for the allowable stress.' : 'Within the allowable stress.' } };
        }
      },
      {
        id: 'sling', icon: '🏗️', title: 'Sling / lifting tension', desc: 'Leg tension and the required working load limit (WLL) for multi-leg slings.',
        formula: 'T_leg = W·g / (n_eff · cosθ)     θ = angle of each leg from vertical',
        inputs: [{ k: 'w', l: 'Load mass', u: 'kg', v: 2000, min: 1 }, { k: 'n', l: 'Number of legs', opts: [[1, '1'], [2, '2'], [3, '3'], [4, '4 (3 assumed to carry)']], v: 2 }, { k: 'a', l: 'Leg angle from vertical', u: '°', v: 45, min: 0, max: 89 }, { k: 'sf', l: 'Dynamic / safety factor', v: 1, min: 1, step: 0.05 }],
        run: v => {
          const ne = Math.min(+v.n, 3), f = 1 / Math.cos(v.a * PI / 180), T = v.w * G * v.sf / ne * f, st = v.a <= 45 ? 'ok' : v.a <= 60 ? 'warn' : 'bad';
          return { results: [R('Tension per leg', T / 1000, 'kN', 2, st, true), R('Required leg WLL', T / G, 'kg', 0, null, true), R('Angle factor 1/cosθ', f, '', 3, st), R('Legs assumed carrying', ne, '', 0)], verdict: { s: st, t: v.a <= 45 ? 'Leg angle acceptable.' : v.a <= 60 ? 'Leg angle above 45° – check sling rating chart.' : 'Leg angle above 60° from vertical (120° included) – not permitted by most rigging rules.' }, notes: ['Check against the sling\'s marked WLL at that angle, the shackle / hook / pad-eye ratings, and the lifting plan. Use the rigger\'s certified chart for the final decision.'] };
        }
      },
      {
        id: 'pump', icon: '💧', title: 'Pump power', desc: 'Hydraulic, shaft and motor power for a pump duty.',
        formula: 'P_hyd = ρ·g·Q·H / 3.6×10⁶ (kW)     P_shaft = P_hyd/η_pump     P_motor = P_shaft/η_motor',
        inputs: [{ k: 'q', l: 'Flow', u: 'm³/h', v: 300, min: 0.001 }, { k: 'h', l: 'Total head', u: 'm', v: 40, min: 0.001 }, { k: 'rho', l: 'Fluid density', u: 'kg/m³', v: 1025, min: 1 }, { k: 'ep', l: 'Pump efficiency', u: '%', v: 72, min: 10, max: 95 }, { k: 'em', l: 'Motor efficiency', u: '%', v: 93, min: 10, max: 100 }, { k: 'mg', l: 'Motor margin', v: 1.1, min: 1, step: 0.01 }],
        run: v => {
          const ph = v.rho * 9.80665 * v.q * v.h / 3.6e6, ps = ph / (v.ep / 100), pm = ps / (v.em / 100), need = ps * v.mg, std = MOTORS.find(m => m >= need) || '> 400';
          return { results: [R('Hydraulic power', ph, 'kW', 2), R('Pump shaft power', ps, 'kW', 2, null, true), R('Motor electrical input', pm, 'kW', 2), R('Standard motor ≥ shaft × margin', std, 'kW', 1, 'ok', true), R('Pressure rise', v.rho * 9.80665 * v.h / 1e5, 'bar', 2)] };
        }
      },
      {
        id: 'head', icon: '📊', title: 'Pressure ↔ head of liquid', desc: 'Convert pressure to metres of any liquid and back (static head, tank level gauges, pump curves).',
        formula: 'h = p / (ρ·g)     p = ρ·g·h',
        inputs: [{ k: 'm', l: 'Convert', opts: [['ph', 'Pressure → head'], ['hp', 'Head → pressure']], v: 'ph' }, { k: 'x', l: 'Value (bar or m)', v: 4, min: 0 }, { k: 'rho', l: 'Liquid density', u: 'kg/m³', v: 1025, min: 1 }],
        run: v => {
          const h = v.m === 'ph' ? v.x * 1e5 / (v.rho * 9.80665) : v.x, p = v.m === 'hp' ? v.rho * 9.80665 * v.x / 1e5 : v.x;
          return { results: [R('Head', h, 'm', 'auto', null, true), R('Pressure', p, 'bar', 'auto', null, true), R('Pressure', p * 100, 'kPa', 'auto'), R('Pressure', p * 14.5037738, 'psi', 'auto')], notes: ['1 bar ≈ 10.2 m of fresh water ≈ 9.9 m of seawater ≈ 11.9 m of marine gas oil.'] };
        }
      },
      {
        id: 'pipe', icon: '🪈', title: 'Pipe flow velocity & Reynolds number', desc: 'Velocity for a flow in a pipe, flow regime and the pipe size for a target velocity.',
        formula: 'v = Q / A     A = π/4·D²     Re = ρ·v·D/μ     D = √(4Q/(π·v))',
        inputs: [{ k: 'q', l: 'Flow', u: 'm³/h', v: 100, min: 0.0001 }, { k: 'id', l: 'Pipe inside diameter', u: 'mm', v: 100, min: 1 }, { k: 'rho', l: 'Density', u: 'kg/m³', v: 1025, min: 1 }, { k: 'mu', l: 'Dynamic viscosity', u: 'cP', v: 1.1, min: 0.01 }, { k: 'vt', l: 'Target velocity (for sizing)', u: 'm/s', v: 2, min: 0.01, hint: 'Suction 1–1.5, discharge 2–3, fuel 1–2 m/s (typical)' }],
        run: v => {
          const A = PI / 4 * (v.id / 1000) ** 2, vel = v.q / 3600 / A, Re = v.rho * vel * (v.id / 1000) / (v.mu / 1000), dreq = Math.sqrt(4 * v.q / 3600 / (PI * v.vt)) * 1000;
          return { results: [R('Velocity', vel, 'm/s', 3, vel > 3.5 ? 'warn' : 'ok', true), R('Reynolds number', Re, '', 0), R('Flow regime', Re < 2300 ? 'Laminar' : Re < 4000 ? 'Transitional' : 'Turbulent', ''), R('Flow area', A * 1e4, 'cm²', 2), R('ID for target velocity', dreq, 'mm', 1, null, true)] };
        }
      },
      {
        id: 'heat', icon: '🔥', title: 'Heat energy & heater sizing', desc: 'Energy to heat a mass, and the heater power needed for a given time.',
        formula: 'Q = m·c·ΔT     P_heater = Q / (t·η)',
        inputs: [{ k: 'c', l: 'Material (specific heat)', opts: [[4.186, 'Fresh water 4.186 kJ/kg·K'], [3.99, 'Seawater 3.99'], [2.0, 'Fuel / lube oil ≈ 2.0'], [0.49, 'Steel 0.49'], [0.385, 'Copper 0.385'], [0.90, 'Aluminium 0.90'], [1.005, 'Air 1.005']], v: 4.186 }, { k: 'm', l: 'Mass', u: 'kg', v: 500, min: 0.001 }, { k: 't1', l: 'Start temperature', u: '°C', v: 20 }, { k: 't2', l: 'Final temperature', u: '°C', v: 60 }, { k: 'h', l: 'Heating time', u: 'h', v: 2, min: 0.01 }, { k: 'e', l: 'Heater efficiency (insulation losses)', u: '%', v: 90, min: 10, max: 100 }],
        run: v => {
          const Q = v.m * v.c * (v.t2 - v.t1), kWh = Q / 3600, p = kWh / v.h / (v.e / 100);
          return { results: [R('Energy required', Q, 'kJ', 0), R('Energy required', kWh, 'kWh', 2), R('Heater power needed', p, 'kW', 2, null, true), R('Current @ 440 V 3-ph', p * 1000 / (S3 * 440), 'A', 1), R('Current @ 230 V 1-ph', p * 1000 / 230, 'A', 1)], notes: ['Add the heat lost through uninsulated tanks and pipes in cold weather – oil tank heaters are usually sized with ≥ 25 % margin.'] };
        }
      },
      {
        id: 'expl', icon: '📏', title: 'Thermal expansion of solids', desc: 'Length change of pipes, busbars, cable trays and rails.',
        formula: 'ΔL = α · L · ΔT',
        inputs: [{ k: 'a', l: 'Material (α ×10⁻⁶ /K)', opts: [[12, 'Steel 12'], [17, 'Copper 17'], [23, 'Aluminium 23'], [18, 'Stainless 18'], [70, 'PVC 70'], [9, 'Glass 9']], v: 12 }, { k: 'l', l: 'Length', u: 'm', v: 30, min: 0 }, { k: 'dt', l: 'Temperature change', u: 'K', v: 50 }],
        run: v => ({ results: [R('Length change', v.a * 1e-6 * v.l * v.dt * 1000, 'mm', 3, null, true), R('Percent change', v.a * 1e-6 * v.dt * 100, '%', 4)], notes: ['Allow expansion loops / sliding supports for long straight pipe and cable-tray runs on open deck.'] })
      },
      {
        id: 'expv', icon: '🧪', title: 'Thermal expansion of liquids', desc: 'Volume change of fuel, oil or water in a tank for a temperature rise.',
        formula: 'ΔV = β · V · ΔT',
        inputs: [{ k: 'b', l: 'Liquid (β per K)', opts: [[0.00085, 'Marine gas oil 0.00085'], [0.00070, 'Heavy fuel oil 0.00070'], [0.00072, 'Lube oil 0.00072'], [0.00021, 'Fresh water 0.00021 (at 20 °C)'], [0.00026, 'Seawater 0.00026']], v: 0.00085 }, { k: 'v', l: 'Volume', u: 'm³', v: 60, min: 0 }, { k: 'dt', l: 'Temperature rise', u: 'K', v: 15 }],
        run: v => ({ results: [R('Volume change', v.b * v.v * v.dt, 'm³', 4, null, true), R('Volume change', v.b * v.v * v.dt * 1000, 'litres', 0), R('New volume', v.v * (1 + v.b * v.dt), 'm³', 3), R('Percent', v.b * v.dt * 100, '%', 2)], notes: ['Do not fill tanks above ~95–98 % – overflow risk when fuel warms up.'] })
      },
      {
        id: 'fuel', icon: '⛽', title: 'Engine efficiency from SFOC', desc: 'Thermal efficiency, fuel power and rejected heat from specific fuel consumption.',
        formula: 'η = 3600 / (SFOC[g/kWh]/1000 × LHV[MJ/kg] × 1000) = 3.6 / (SFOC/1000 × LHV)',
        inputs: [{ k: 'sf', l: 'SFOC', u: 'g/kWh', v: 200, min: 50 }, { k: 'lhv', l: 'Fuel lower heating value', opts: [[42.7, 'Marine gas oil 42.7 MJ/kg'], [40.5, 'Heavy fuel oil 40.5 MJ/kg'], [42.0, 'Diesel 42.0 MJ/kg']], v: 42.7 }, { k: 'p', l: 'Engine output', u: 'kW', v: 1000, min: 0 }],
        run: v => {
          const eta = 3.6 / (v.sf / 1000 * v.lhv), pf = v.p / eta;
          return { results: [R('Thermal efficiency', eta * 100, '%', 1, null, true), R('Fuel energy input', pf, 'kW', 0), R('Heat rejected (exhaust + cooling)', pf - v.p, 'kW', 0), R('Fuel flow', v.p * v.sf / 1000, 'kg/h', 1)] };
        }
      },
      {
        id: 'vent', icon: '🌬️', title: 'Ventilation / cooling air', desc: 'Air flow to remove machinery heat from a room, and air changes per hour.',
        formula: 'V̇ = Q / (ρ·cp·ΔT)    ACH = V̇ × 3600 / room volume',
        inputs: [{ k: 'q', l: 'Heat to remove', u: 'kW', v: 80, min: 0 }, { k: 'dt', l: 'Allowed air temperature rise', u: 'K', v: 12, min: 1 }, { k: 'rv', l: 'Room volume', u: 'm³', v: 240, min: 1 }, { k: 'rho', l: 'Air density', u: 'kg/m³', v: 1.15, min: 0.5, step: 0.01, hint: 'Warm air ≈ 1.1–1.2' }],
        run: v => {
          const f = v.q / (v.rho * 1.005 * v.dt);
          return { results: [R('Air flow', f, 'm³/s', 2, null, true), R('Air flow', f * 3600, 'm³/h', 0), R('Air changes per hour', f * 3600 / v.rv, 'ACH', 1), R('Air flow', f * 2118.88, 'cfm', 0)], notes: ['Machinery spaces with engines also need combustion air (typically 6–8 kg per kWh of engine output) in addition to cooling air.'] };
        }
      },
      {
        id: 'ke', icon: '🏃', title: 'Kinetic & potential energy', desc: 'Energy of a moving or raised mass; useful for brake and crane duty checks.',
        formula: 'KE = ½mv²    PE = m·g·h    p = m·v',
        inputs: [{ k: 'm', l: 'Mass', u: 'kg', v: 5000, min: 0 }, { k: 'v', l: 'Speed', u: 'm/s', v: 1.5, min: 0 }, { k: 'h', l: 'Height', u: 'm', v: 12, min: 0 }],
        run: v => ({ results: [R('Kinetic energy', 0.5 * v.m * v.v ** 2 / 1000, 'kJ', 'auto', null, true), R('Potential energy', v.m * G * v.h / 1000, 'kJ', 'auto', null, true), R('Potential energy', v.m * G * v.h / 3.6e6, 'kWh', 'auto'), R('Momentum', v.m * v.v, 'kg·m/s', 'auto'), R('Weight force', v.m * G / 1000, 'kN', 'auto')] })
      }
    ]
  });
})();
