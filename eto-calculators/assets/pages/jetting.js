(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values are typical and vary widely between units. The unit’s operations manual (jacking / preload / leg extraction procedures), site-specific assessment, maker manuals and class rules always govern.</p>';

  const S = [
    ['overview', '💦', 'Overview & purpose', () =>
      `<p>The <b>leg jetting system</b> (spud-can jetting) on a jack-up rig, barge or liftboat pumps high-pressure sea water down each leg to nozzles on the <b>spud-can</b> (or mat / footing). Its main job is to help <b>pull the legs out</b> of soft, sticky seabed when the unit jacks down and prepares to move.</p>` +
      H('Why it is needed') + L([
        '<b>Breaking suction</b> – in soft clay the spud-can can be buried several metres deep. When the leg is pulled up, a vacuum (suction) forms under the can and the soil above it adds weight – extraction force can exceed the jacking capacity.',
        '<b>Assisting leg extraction</b> – water injected under and on top of the spud-can relieves suction, softens and displaces the soil, and reduces the pull-out force needed.',
        '<b>Flushing</b> – clearing mud and soil from the spud-can top, nozzles and leg piping; flushing lines after use to prevent blockage.',
        '<b>Reducing penetration resistance</b> – on some units / sites jetting is used to help a leg penetrate; this is less common and only done when the site assessment and procedures allow it.']) +
      H('Where it is used') + L([
        'Self-elevating drilling rigs, accommodation / liftboats, wind-turbine installation vessels and jack-up barges working on clay or silty seabed.',
        'Most important on sites with deep leg penetration (soft clay) and long stand-by periods – suction increases with time on location.',
        'On hard sand / rock sites jetting may hardly be needed, but the system must still be ready.']) +
      `<p>Related pages: ${A('jackingguide.html', 'Jacking Systems guide')}, ${A('rawwater.html', 'Raw Water Pumps guide')}, ${A('pmsguide.html', 'PMS guide')}.</p>` + NOTE
    ],
    ['structure', '🏗️', 'System structure', () =>
      TB(['Component', 'Function', 'Typical design'], [
        ['Sea water supply', 'Feeds the jetting pumps', 'Sea chest / raw water tower or submersible raw water pumps; strainers'],
        ['Jetting pumps', 'Raise water to jetting pressure', 'Electric-driven centrifugal or multistage pumps; sometimes diesel-driven; often 2 or more for redundancy'],
        ['Jetting manifold', 'Distributes water to each leg and zone', 'Main header with isolation valves per leg, pressure gauges / transmitters, relief valve'],
        ['Leg valves', 'Select leg and nozzle group (top / bottom)', 'Manual, hydraulic or electric actuated valves; remote position indication on larger units'],
        ['Leg piping / hoses', 'Carry water down the leg to the spud-can', 'Fixed pipe inside the leg chord or flexible hoses on reels / along the leg'],
        ['Nozzles', 'Inject water into the soil', 'Nozzle sets on spud-can top and underside (bottom), sometimes on the sides'],
        ['Check valves', 'Stop mud and soil entering the pipe when jetting is off', 'Non-return valves near the nozzles or at leg pipe inlets'],
        ['Flushing connections', 'Clear piping and nozzles', 'Fresh / sea water flushing lines and drain points']]) +
      H('Key points') + L([
        '<b>Bottom nozzles</b> break suction under the can; <b>top nozzles</b> loosen and lift soil lying on top of the can (back-flow soil).',
        'Each leg usually has its own valve set so legs can be jetted separately – legs rarely come free at the same time.',
        'Pipe / hose routing must allow full leg travel; hoses on reels or slack loops are a common wear point.',
        'Check valves are essential – a blocked or mud-filled leg line cannot be cleared easily once the leg is in the seabed.']) + NOTE
    ],
    ['pumps', '⚙️', 'Pumps, motors & starting', () =>
      TB(['Item', 'Typical values / practice (typical – varies by unit)'], [
        ['Pump type', 'Single or multistage centrifugal, horizontal or vertical'],
        ['Discharge pressure', 'Typically in the order of 10–30 bar at the manifold; some units higher'],
        ['Flow', 'Typically a few hundred m³/h per pump'],
        ['Motor power', 'Typically 100–500 kW per pump on drilling jack-ups; smaller on barges and liftboats'],
        ['Supply voltage', '440/690 V LV on smaller units, 3.3–11 kV HV on larger units'],
        ['Starting method', 'DOL on smaller motors; star-delta, autotransformer, soft starter or VFD on large motors'],
        ['Drive alternative', 'Diesel-driven pump packages on some barges or as back-up']]) +
      H('Starting and protection') + L([
        'Large jetting motors are <b>heavy consumers</b> – starting current (DOL typically 5–7 × FLC) causes voltage dip; soft starters or VFDs limit inrush.',
        'Start against a <b>closed or partly open discharge</b> (per maker) to limit starting load, then open slowly – avoids water hammer in the long leg lines.',
        'Protection typically: overcurrent / thermal overload, short circuit, earth fault, phase loss / unbalance, motor winding / bearing temperature (larger motors), low suction pressure, high discharge pressure.',
        'Pump protection: low suction / loss of prime, dry-running, minimum-flow recirculation or relief valve, high bearing temperature, vibration on large pumps.',
        'Anti-condensation heaters in motors that stand idle for long periods – insulation resistance should be checked before use after long standby.']) + NOTE
    ],
    ['controls', '🎛️', 'Controls & instrumentation', () =>
      TB(['Function', 'Typical arrangement'], [
        ['Pump start / stop', 'Local at the starter / pump plus remote from jacking control room or ECR'],
        ['Leg / zone selection', 'Valve selection per leg and per nozzle group (top / bottom), local manual or remote actuated'],
        ['Pressure indication', 'Pump suction and discharge, manifold, and per leg line where fitted'],
        ['Flow indication', 'Flow meter per pump or per leg on some units; otherwise estimated from pump curve and current'],
        ['Motor indication', 'Running / tripped, current (ammeter), power, VFD status'],
        ['PMS interface', 'Heavy-consumer start request / power available signal; load shedding group'],
        ['Emergency stop', 'Local and remote emergency stops for the pumps'],
        ['Alarms', 'Pump trip, low suction pressure, high / low discharge pressure, motor overload / temperature, valve position fault']]) +
      H('ETO points') + L([
        'Know the <b>interlocks</b>: e.g. pump start blocked until suction valve open, PMS power available, discharge valve in start position.',
        'Pressure transmitters on leg lines are exposed to harsh conditions – check calibration and wiring.',
        'Valve actuators (hydraulic or electric) and position limit switches are frequent fault points.',
        'Jetting status is often shown on the jacking control panel so the jacking operator sees pressure and leg loads together.']) + NOTE
    ],
    ['operation', '🦵', 'Operation – leg extraction', () =>
      H('Typical sequence (follow the unit procedure)') + L([
        '<b>Plan</b>: review leg penetration records, soil data and expected extraction resistance; check weather window; tool-box talk with marine / jacking team, ECR and deck.',
        '<b>Prepare power</b>: start enough generators via PMS before starting jetting pumps and jacking system (both are heavy consumers).',
        '<b>Prepare jetting</b>: line up suction and manifold, check valves per leg, test-run pumps, confirm pressure indication.',
        '<b>Jack down hull</b> to the water and achieve the required draft / buoyancy as per procedure – hull buoyancy provides the main pull-out force.',
        '<b>Start jetting</b> on the selected leg(s) – often bottom nozzles first to break suction, top nozzles to loosen overburden.',
        '<b>Pull legs</b> with the jacking system while jetting; monitor leg loads, jacking motor current / brake status, pressures and hull trim / heel.',
        '<b>Leg by leg</b>: legs free one at a time; adjust jetting and pulling per leg to keep the hull level and loads within limits.',
        '<b>After extraction</b>: continue jetting / flushing briefly, stop pumps, flush lines, close valves, record times, pressures and loads.']) +
      H('Coordination') + L([
        'The <b>jacking operator / barge master</b> controls the operation; the ETO and engineers support power, pumps and jacking machinery.',
        'Clear communication (radio / talk-back) between jacking control, ECR and pump room.',
        'Any pump trip, pressure loss or generator problem must be reported immediately – it can change the extraction plan.',
        'Extraction may take hours or even days on deep-penetration clay sites – plan watches and power accordingly.']) + NOTE
    ],
    ['power', '⚡', 'Power plant loading', () =>
      L([
        'During leg extraction the <b>jacking motors</b> and <b>jetting pumps</b> may run together – often the highest electrical demand of the unit outside drilling.',
        'The PMS should treat the jetting pumps as <b>heavy consumers</b>: start only when spare power is available (power-available / start-request logic).',
        'Start generators <b>before</b> the operation; do not rely on load-dependent start during a large motor start.',
        'Start large motors one at a time; allow the voltage and frequency to recover between starts.',
        'Check <b>preferential trip / load shedding</b> groups – a jetting pump tripping on a generator overload is better than a blackout, but losing the jacking system during a leg pull is serious.',
        'VFD-driven pumps add harmonics – check THD limits when several drives (jacking VFDs, jetting VFDs) run together.',
        'On diesel-driven pump packages, the electrical load is small but fuel, cooling and starting systems become ETO / engineer concerns.']) +
      H('Simple load check (typical approach)') + TB(['Step', 'Action'], [
        ['1', 'List running base load (hotel, auxiliaries, HVAC)'],
        ['2', 'Add jacking system load at expected extraction force'],
        ['3', 'Add jetting pump motor load (rated or measured)'],
        ['4', 'Compare with online generator capacity; keep a margin (often around 15–20 % typical) for motor starting and transients'],
        ['5', 'Decide number of generators online and the start order']]) +
      `<p>See the ${A('pmsguide.html', 'PMS guide')} for heavy-consumer logic and load shedding.</p>` + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>single-line diagram</b> for jetting pumps, starters / VFDs and their switchboard sections.',
        'Starter type, protection settings and interlocks (suction pressure, valve position, PMS permission).',
        'PMS heavy-consumer logic and load-shedding priority of jetting pumps vs. jacking motors.',
        'The jacking system interfaces – leg load indication and how jetting status is shown to the jacking operator.',
        'Valve actuator types, limit switches and how to operate valves manually if remote control fails.',
        'Pressure and flow instruments: ranges, calibration, wiring and alarm set-points.',
        'Insulation resistance of motors that stand idle on location for long periods; heater circuits.',
        'Raw water supply pumps and strainers (see the Raw Water Pumps guide) – jetting depends on them.',
        'The leg extraction procedure – who gives which order, and the ETO’s role during the operation.',
        'Records: run hours, start counts, IR readings, pressures and currents from previous extractions (useful trend data).']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Before each move / extraction', 'Test-run pumps, check pressures and motor current, function-test leg and nozzle valves, check E-stops and remote controls'],
        ['Weekly (on location)', 'Run heaters check, visual inspection of starters / VFDs, leak check on manifold'],
        ['Monthly', 'Pump test run (if not used), IR test of motors that stand idle, valve actuator exercise'],
        ['3–6 monthly', 'Pressure / flow instrument check, protection trip check (simulated), strainer cleaning, VFD fan and filter cleaning'],
        ['Yearly', 'Pressure test of manifold and leg lines (as accessible), relief valve test, thermography of starters, motor bearing / greasing per maker, alignment check'],
        ['When legs are up / in yard', 'Inspect nozzles for blockage and wear, check valves, hoses / pipes along the legs, clamp and support condition'],
        ['After use', 'Flush lines and nozzles, record pressures, currents and duration, report abnormalities']]) +
      L([
        'Blocked nozzles can only be inspected properly when the spud-can is clear of the seabed – use moves and yard periods for inspection.',
        'Record pump curves (pressure vs. current) when new – later comparison shows wear or blockage.',
        'Keep spares for valve actuators, limit switches, pressure transmitters and contactors.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Low jetting pressure', 'Worn impeller, air in suction, blocked strainer, open bypass / relief, leaking manifold, wrong valve line-up', 'Check suction pressure and strainer, valve line-up, relief valve, compare current with pump curve'],
        ['High pressure, low flow', 'Blocked nozzles, closed or stuck leg valve, check valve stuck shut, mud-filled leg line', 'Confirm valve positions, try another nozzle group, flush, reverse flush if possible'],
        ['Pump trips on start', 'Overload setting too low, soft starter / VFD fault, voltage dip, PMS not allowing start, interlock', 'Check trip relay / drive fault log, PMS permission, suction valve and pressure interlocks'],
        ['Motor overload during run', 'Pump running at run-out (too much flow), mechanical fault, single phasing, low voltage', 'Throttle discharge, check phase currents and voltage, check bearings and coupling'],
        ['Generator overload / frequency drop', 'Jetting and jacking running together with too few generators', 'Start more generators first, stagger motor starts, check PMS heavy-consumer settings'],
        ['Leg valve does not open', 'Actuator failure, no hydraulic pressure or supply, limit switch fault, seized valve', 'Check actuator supply and signals, operate manually, check position indication'],
        ['Valve indication wrong', 'Limit switch misadjusted or damaged, wiring fault', 'Compare with local indicator, adjust or replace switch'],
        ['Blocked nozzles', 'Soil ingress through failed check valve, debris, scale, marine growth', 'Flush, higher pressure in steps within limits, inspect when legs are up'],
        ['Pump vibration / noise', 'Cavitation (low suction), misalignment, bearing wear, impeller damage', 'Check suction conditions, alignment, bearing temperature and vibration readings'],
        ['No pressure on one leg', 'Pipe or hose rupture along the leg, valve closed, disconnected hose', 'Inspect accessible piping, check for water outflow, verify valve'],
        ['Earth fault alarm on start', 'Wet motor winding after long standby, damaged cable', 'IR test, dry out with heaters, locate fault before restart'],
        ['Leg does not free even with jetting', 'Very high suction / overburden, insufficient buoyancy or pull, nozzles not working', 'Stop and review with barge master; follow procedure (more time, cycling, more buoyancy) – do not exceed jacking limits']]) + NOTE
    ],
    ['risks', '⚠️', 'Risks: scour, extraction & punch-through', () =>
      TB(['Risk', 'Explanation'], [
        ['Uneven leg extraction', 'One leg frees suddenly while others hold – load redistribution, hull heel / trim, high leg and jacking loads'],
        ['Sudden release', 'A stuck leg breaks free suddenly – shock load on jacking gear and possible hull motion'],
        ['Scour', 'Excessive jetting or long jetting can wash soil from around the can and neighbouring structures or pipelines; also affects later re-installation at the same location'],
        ['Seabed infrastructure', 'Jetting near pipelines, cables or platform foundations can undermine them – follow site restrictions'],
        ['Punch-through (different issue)', 'A preload / installation risk: a leg breaks through a stronger soil layer into weaker soil below, causing sudden penetration and heel. It is managed by site assessment and controlled preloading, not by the jetting system'],
        ['Jetting during preload', 'Normally not done – reducing soil strength under a loaded can could cause uncontrolled penetration; only if the site assessment and procedure specifically allow it']]) +
      L([
        'Jetting is mainly an <b>extraction</b> aid; preload and punch-through are controlled by the jacking / preload procedure and the site-specific assessment.',
        'Leg load monitoring and level control are the key safeguards during extraction.']) + NOTE
    ],
    ['safety', '🦺', 'Safety & lessons', () =>
      H('Hazards') + L([
        '<b>High-pressure water</b>: a burst hose or fitting can cause serious injury; water jets can penetrate skin. Keep clear of hoses under pressure; never tighten or open fittings under pressure.',
        '<b>Rotating machinery</b>: couplings and shafts – guards in place, lock out before work.',
        '<b>Electrical</b>: HV / large LV motors and starters – isolation, permits, LOTO, test before touch; VFD capacitors need discharge time.',
        '<b>Stored pressure</b>: depressurise and drain lines before opening; check valves can trap pressure.',
        '<b>Coordination</b>: jetting and jacking are one operation – starting or stopping pumps without telling the jacking operator can affect leg extraction.']) +
      H('Lessons learned') + L([
        'Test the jetting system <b>well before</b> the planned move – faults found on the day of extraction delay the move and waste weather windows.',
        'Failed check valves and blocked nozzles are a common reason why jetting “does not work” – inspect them whenever legs are clear.',
        'Generator overloads during extraction are avoidable – plan power, start generators first, start motors one at a time.',
        'Long idle periods on location lead to low insulation and seized valves – run and exercise equipment periodically.',
        'Keep records of each extraction (pressures, currents, time, leg loads) – they help plan the next one.',
        'When in doubt, stop and consult the barge master / OIM – never exceed jacking or leg load limits to “force” a leg out.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Jetting System – Jack-ups (Guide)', icon: '💦', accent: '#0891b2',
    subtitle: 'Spud-can / leg jetting on jack-up rigs and barges – purpose, structure, pumps and motors, controls, leg extraction with the jacking system, power plant loading, maintenance, troubleshooting and safety.',
    refs: ['Unit operations manual', 'Maker manuals', 'Class rules', 'Site-specific assessment'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
