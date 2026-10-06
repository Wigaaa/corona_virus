(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General, maker-independent guidance with typical values only. The maker’s manuals, class rules, the vessel’s FMEA / operating documents and the safety management system always govern.</p>';

  const S = [
    ['overview', '🌀', 'Thruster overview', () =>
      `<p><b>Thrusters</b> give a vessel transverse and/or vectored thrust for manoeuvring, station keeping and Dynamic Positioning. On many offshore vessels the thrusters are the largest electrical consumers on board – often several MW each – so the thruster system is as much an electrical system as a mechanical one.</p>` +
      H('Main thruster families') + L([
        '<b>Tunnel (bow / stern) thrusters</b> – propeller in a transverse tunnel; gives side force only.',
        '<b>Azimuth thrusters</b> – propeller unit that rotates 360° under the hull; thrust in any direction.',
        '<b>Retractable azimuths</b> – lowered through a trunk for DP / low-speed use and raised for transit.',
        '<b>Z-drive / L-drive</b> – mechanical azimuth thrusters with a horizontal (Z) or vertical (L) input shaft and bevel gears to the propeller.',
        '<b>Pods</b> – electric motor inside the underwater pod driving the propeller directly; used for propulsion and DP.']) +
      H('Two ways to control thrust') + TB(['Concept', 'How thrust is varied', 'Typical drive'], [
        ['FP – fixed pitch', 'Propeller speed and direction are varied', 'Variable frequency drive (VFD) feeding an induction or PM motor'],
        ['CP – controllable pitch', 'Motor runs at constant speed; blade pitch is varied hydraulically from ahead to astern', 'Direct-on-line, star-delta, auto-transformer or soft starter; constant-speed motor']]) +
      H('Why the ETO cares') + L([
        'Thrusters link the power plant, PMS, DP system, drives, hydraulics and controls – faults appear anywhere in that chain.',
        'Large thruster starts and load steps stress generators; PMS heavy-consumer logic and power limitation protect against blackout.',
        'Thruster failures (especially failure to full thrust or wrong direction) are DP-critical.']) +
      `<p>Related pages: ${A('thruster.html', 'Thruster calculations')}, ${A('dpsystem.html', 'DP System guide')}, ${A('vfd.html', 'VFD / Drives')}, ${A('motor.html', 'Motors')}.</p>` + NOTE
    ],
    ['types', '🏗️', 'Types & components', () =>
      TB(['Type', 'Features', 'ETO-relevant points'], [
        ['Tunnel thruster', 'Propeller in a hull tunnel, right-angle gear, motor above on a vertical shaft', 'Motor and starter / VFD in thruster room; tunnel grids; efficiency drops quickly with vessel speed'],
        ['Azimuth (fixed)', '360° steerable unit, steering by electric or hydraulic motors via slewing ring', 'Steering motors / VFDs, azimuth feedback, slip ring for signals and power'],
        ['Retractable azimuth', 'Unit hoisted in a trunk; lock-down / lock-up mechanism', 'Hoist hydraulics, position switches, lock interlocks preventing start unless fully down and locked'],
        ['Z-drive', 'Horizontal input shaft, two bevel gear sets', 'Common on tugs and OSVs; often diesel or electric input; lube and clutch system'],
        ['L-drive', 'Vertical input shaft, motor on top of the unit', 'Motor sits directly above; compact electric installations'],
        ['Pod', 'Motor inside the pod, no underwater gears', 'Slip rings carry full motor power; pod cooling (air or seawater), shaft seals and bearing monitoring are critical'],
        ['Rim-driven / other', 'Motor integrated in the duct rim (niche designs)', 'Maker-specific; follow manuals']]) +
      H('Typical components of an azimuth thruster') + L([
        '<b>Upper gear / motor deck</b> – main motor, coupling, input shaft, possibly a clutch.',
        '<b>Steering gear</b> – slewing bearing, pinions driven by electric motors (often VFD) or hydraulic motors.',
        '<b>Slip ring unit</b> – transfers signals (and for pods, main power) to the rotating part.',
        '<b>Hydraulic oil distribution box (CP)</b> – feeds pitch oil to the hub through the shaft.',
        '<b>Lower gearbox / pod</b> – bevel gears or motor, propeller shaft, nozzle.',
        '<b>Seals</b> – propeller shaft seals and steering seals keeping seawater out and oil in.',
        '<b>Sensors</b> – azimuth angle, pitch, rpm, oil level / pressure / temperature, bearing temperature, water-in-oil.']) + NOTE
    ],
    ['power', '⚡', 'Power & drive train', () =>
      H('Typical power train (electric FP thruster)') + L([
        '<b>Main switchboard breaker</b> (often MV, e.g. 6.6 kV or 11 kV on larger vessels).',
        '<b>Drive transformer</b> – phase-shifted secondaries (e.g. 12- or 24-pulse) reduce harmonics; or a single winding feeding an AFE.',
        '<b>Pre-charge / pre-magnetisation</b> – limits inrush when energising the transformer or the DC link.',
        '<b>VFD</b> – diode front end (multi-pulse) or <b>Active Front End (AFE)</b>, DC link, inverter.',
        '<b>Motor</b> – induction or permanent-magnet; winding and bearing temperature sensors, anti-condensation heaters.',
        '<b>Coupling / gearbox</b> – right-angle or bevel gears to the propeller.']) +
      H('FP vs CP – electrical comparison') + TB(['Item', 'FP with VFD', 'CP constant speed'], [
        ['Starting', 'Smooth ramp from zero speed, low inrush', 'High starting current unless soft-start / star-delta / auto-transformer; PMS must reserve power'],
        ['Zero thrust losses', 'Very low – propeller stopped', 'Significant – motor runs at full speed at zero pitch'],
        ['Response', 'Speed ramp limited by drive and torque', 'Pitch change by hydraulics, fast'],
        ['Harmonics', 'Source of harmonics; filters or multi-pulse / AFE', 'Negligible in running; starting transients'],
        ['Failure modes', 'Drive trips, DC link faults, cooling loss', 'Pitch hydraulics failure, pitch feedback faults']]) +
      H('Key electrical points') + L([
        'Large transformer energising causes inrush – breakers and pre-magnetisation must be set as designed.',
        'VFD cooling (often water-cooled with deionised water) is part of the readiness chain.',
        'Motor cables from VFDs need shielded / symmetrical construction and correct EMC glanding.',
        'Bearing currents in VFD-driven motors – insulated bearings or shaft grounding where fitted.',
        'Check THD limits on the switchboard with all thrusters running (class limits apply).']) + NOTE
    ],
    ['aux', '🎛️', 'Auxiliaries & control', () =>
      H('Auxiliary systems') + TB(['System', 'Purpose', 'Typical monitoring'], [
        ['Lube oil', 'Gear and bearing lubrication, often with electric and/or shaft-driven pump', 'Pressure, temperature, level, filter differential pressure'],
        ['Hydraulic pitch (CP)', 'Moves propeller blades', 'Pressure, level, temperature, pitch feedback'],
        ['Steering (azimuth)', 'Electric steering motors (VFD) or hydraulic motors', 'Motor faults, azimuth feedback, follow-up error'],
        ['Cooling', 'Motor, VFD and oil cooling (fresh water, deionised water, air)', 'Flow, temperature, conductivity (deionised water), leakage'],
        ['Seals / gravity tank', 'Keeps seal oil pressure above sea pressure', 'Header tank level, water-in-oil sensor'],
        ['Shaft brake / lock', 'Holds propeller still for maintenance or when disengaged', 'Brake applied / released position']]) +
      H('Readiness chain (typical)') + L([
        'Main breaker available and closed / VFD energised and ready.',
        'Auxiliary pumps running with pressure established (lube, hydraulic, steering).',
        'Cooling water flow and temperature OK.',
        'No active trip, no emergency stop, brake released, retractable unit down and locked.',
        'CP: pitch at zero before start (zero-pitch start interlock).',
        'PMS start permission granted (heavy-consumer request).',
        'Control location selected and command / feedback healthy → <b>Thruster Ready</b>.']) +
      H('Control locations') + L([
        '<b>Local</b> – at the thruster room / drive; used for testing and emergency.',
        '<b>Bridge levers / panels</b> – manual control from main and wing consoles with command transfer.',
        '<b>Joystick (IJS)</b> – combined control of several thrusters, independent of DP computers.',
        '<b>DP</b> – automatic control via the DP system.',
        'Command transfer between locations must be acknowledged; only one station has control at a time.']) +
      H('Emergency stop') + L([
        'Hard-wired, independent of the control system; usually stops the drive / trips the breaker.',
        'Line monitoring (wire-break / short alarm) on E-stop loops is typical on DP vessels.',
        'Test regularly; verify the stop works from every station.']) +
      H('Power limitation') + L([
        'Thruster load is reduced by available power signals from PMS, frequency drop or phase-back commands.',
        'Fast load reduction prevents blackout when a generator trips.']) + NOTE
    ],
    ['protection', '🛡️', 'Protection & alarms', () =>
      TB(['Protection / alarm', 'Typical action'], [
        ['Overcurrent / short-circuit (breaker relay)', 'Trip main breaker'],
        ['Transformer temperature / Buchholz (if oil type)', 'Alarm then trip'],
        ['Earth fault (IT system, MV)', 'Alarm; trip on some MV systems as designed'],
        ['VFD overcurrent, overvoltage, undervoltage DC link', 'Drive trip'],
        ['VFD overtemperature / cooling failure', 'Power reduction then trip'],
        ['Motor winding / bearing high temperature', 'Alarm, load reduction, trip'],
        ['Motor overload / stall', 'Trip or current limit'],
        ['Lube oil low pressure / high temperature', 'Alarm, load reduction, stop'],
        ['Hydraulic low pressure (pitch / steering)', 'Alarm; pitch / steering may freeze or go to safe state'],
        ['Azimuth / pitch follow-up error', 'Alarm; DP may deselect the thruster'],
        ['Command / feedback signal fault', 'Alarm; thruster may fail to zero or hold last value as designed'],
        ['Water in oil / seal tank low level', 'Alarm – plan inspection'],
        ['Overspeed', 'Trip'],
        ['E-stop loop fault', 'Alarm']]) +
      H('Notes') + L([
        'Trip settings and delays are set by the maker and approved by class – do not change without MoC.',
        'Know which alarms are “load reduction” and which are “trip” – during DP, a load reduction is far better than a trip.',
        'Record the alarm history and drive fault log before resetting.']) + NOTE
    ],
    ['ops', '🚦', 'Start-up, operation & DP', () =>
      H('Typical start-up sequence') + L([
        'Check the PMS: enough generators online for the heavy-consumer start.',
        'Start auxiliaries: lube oil, hydraulics, steering pumps, cooling.',
        'Lower and lock retractable units if applicable.',
        'Request start – PMS grants permission (may start another generator first).',
        'Close breaker / energise transformer and drive (pre-magnetisation if fitted).',
        'Start motor (CP at zero pitch / FP at zero speed).',
        'Transfer control to bridge / joystick / DP; check command vs feedback in both directions.']) +
      H('Operation') + L([
        'Monitor load, temperatures, oil pressures and alarms during long DP periods.',
        'Avoid running FP thrusters for long periods in a narrow band around zero if the maker restricts it (oil flow, cooling).',
        'Azimuth forbidden zones prevent thrust wash on other thrusters, ROVs or divers.',
        'Tunnel thrusters lose effect with speed – typically used only at low speed.']) +
      H('DP interface') + L([
        'DP sends thrust / rpm / pitch and azimuth commands; thruster returns ready, in-DP, feedbacks and alarms.',
        'Loss of feedback or follow-up error → DP deselects the thruster.',
        'Bias mode keeps thrusters loaded for faster response and stable generator load.',
        'Thrusters are allocated to redundancy groups – consistent with power supply and auxiliaries.']) +
      H('Stopping') + L(['Reduce thrust to zero, transfer control, stop motor, stop auxiliaries after rundown / cool-down, raise and lock retractable units, apply brake if required.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'Single-line diagram of every thruster: breaker, transformer, drive, motor, auxiliaries and their supply.',
        'FP or CP, and the starting method of each thruster.',
        'The <b>readiness chain</b> and how to find which condition is missing.',
        'Location and function of every <b>emergency stop</b> and how they are monitored.',
        'PMS heavy-consumer request and power limitation logic for thrusters.',
        'Drive fault codes, how to read the fault log, and how to reset safely.',
        'Interlocks: zero-pitch start, lock-down position, brake, local / remote selection.',
        'Steering system: motors, VFDs, feedback encoders / resolvers, slip ring.',
        'Thruster redundancy group allocation in the DP FMEA.',
        'Isolation points (MV breaker, earthing switch, drive DC link, hydraulics, brake).',
        'Backups of drive parameters and control software.',
        'Oil sampling programme results (water, metal particles) as an early warning.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Alarm list, oil levels and pressures, seal header tank level, cooling temperatures, leakage check, unusual noise or vibration'],
        ['Before manoeuvring / DP', 'Function test from all control stations, command vs feedback, E-stop status, auxiliaries running'],
        ['Weekly', 'Drive cabinet visual, filter checks, cooling water conductivity (deionised systems), heaters in standby'],
        ['Monthly', 'E-stop tests as planned, steering and pitch response, insulation resistance trend of motors where possible'],
        ['3-monthly', 'Oil samples for analysis (lube and hydraulic), slip ring inspection, cable termination check'],
        ['Yearly', 'Protection relay tests, thermography of drives and connections, motor IR / PI tests, vibration analysis, alarm and trip simulations, DP trials thruster tests'],
        ['Docking / per maker', 'Seal replacement, bearing and gear inspection, propeller and nozzle check, slewing bearing check, motor overhaul']]) +
      L([
        'Use condition monitoring (oil analysis, vibration, temperature trends) to plan overhauls.',
        'After any maintenance, test from all control stations including E-stops before returning to service.',
        'Record parameter changes and keep drive / controller backups up to date.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Thruster not ready', 'Aux pump off, low pressure, E-stop active, brake on, breaker open, no PMS permission', 'Follow the readiness chain step by step; check status page and I/O'],
        ['Start request refused', 'Not enough available power, PMS blocking, wrong control location', 'Check PMS power reserve and generator status; start another generator'],
        ['Drive trips on start', 'Pre-charge fault, transformer inrush, earth fault, cooling not ready', 'Read drive fault log, check pre-charge circuit, IR test motor and cable'],
        ['Drive trips under load', 'Overcurrent, DC link overvoltage, overtemperature, supply dips', 'Fault log, cooling flow and temperature, load profile, supply voltage and frequency'],
        ['Thruster not following command', 'Feedback fault, hydraulic problem, power limitation active', 'Compare command and feedback signals; check limitation status and hydraulic pressure'],
        ['Azimuth hunting or slow', 'Steering motor or VFD fault, encoder / resolver fault, mechanical friction', 'Check each steering motor, feedback signal quality, slewing bearing lubrication'],
        ['Pitch drifts or wrong pitch', 'Pitch valve, oil leakage in OD box, feedback potentiometer fault', 'Check pitch pressure, calibrate feedback, inspect OD box'],
        ['High motor temperature', 'Cooling failure, overload, blocked filters, fan fault', 'Check cooling water / air flow, current, filters'],
        ['Water in oil alarm', 'Seal leakage, condensation, sensor fault', 'Take oil sample, check header tank, inform chief engineer'],
        ['Slip ring alarms or noisy signals', 'Worn brushes, contamination, moisture', 'Inspect and clean slip ring, check heater and brushes'],
        ['E-stop loop fault alarm', 'Broken wire, loose terminal, failed monitoring resistor', 'Measure loop, check terminals and end-of-line component'],
        ['Frequent power limitation', 'Too few generators, PMS settings, frequency dips', 'Check online power vs demand and PMS settings']]) +
      L(['Inform the bridge / DPO before any test or reset on a thruster in use.', 'Save fault logs before resetting or powering down drives.']) + NOTE
    ],
    ['safety', '⛑️', 'Safety', () =>
      H('Isolation') + L([
        'Use permit-to-work and lock-out / tag-out at <b>all</b> energy sources: main breaker (and earthing switch on MV), control supply, auxiliary pumps, hydraulics, steering.',
        'Inform the bridge / DPO; set the thruster to “not available” and remove from DP.',
        'MV: only authorised persons; prove dead and apply earths as per the HV safety rules.',
        'VFD DC links store energy – wait the stated discharge time and measure before touching.']) +
      H('Rotating machinery') + L([
        'A propeller can turn by water flow (windmilling) and drive the motor as a generator – especially PM motors, which generate voltage whenever they rotate.',
        'Apply the shaft brake / lock as specified before working on the motor, coupling or inside the tunnel.',
        'Never rely on control interlocks alone.']) +
      H('Thruster room and tunnel') + L([
        'Thruster rooms are often enclosed spaces low in the ship – check atmosphere and ventilation, and follow enclosed-space entry rules where required.',
        'Working in the tunnel or near the propeller (divers, dry dock): thrusters isolated and locked, signs on all control stations.',
        'Noise, hot surfaces, oil on floors, tight access – use PPE.']) +
      H('Hydraulics and stored energy') + L([
        'Release hydraulic pressure and accumulators before opening lines.',
        'Retractable units: mechanically secure the unit before work under or around it.',
        'Springs in brakes, heaters and capacitors in drives are other stored-energy sources.']) + NOTE
    ],
    ['lessons', '📚', 'Common failures & lessons', () =>
      H('Common failures') + L([
        'Seal failures letting water into gear oil – often found first by oil analysis or water-in-oil alarms.',
        'Drive cooling problems (leaks, conductivity, pumps) causing trips during DP.',
        'Feedback sensor failures (pitch, azimuth, rpm) leading to deselection or wrong thrust.',
        'Slip ring wear and contamination causing intermittent signals.',
        'E-stop circuits that were not tested and failed when needed, or that tripped spuriously.',
        'Thrusters failing to full thrust or wrong direction (drive-off) after control faults.',
        'Blackouts from starting a large thruster without enough power, or interlock bypassed.',
        'Bearing damage from electrical currents in VFD-driven motors.']) +
      H('Lessons for the ETO') + L([
        'Never bypass interlocks (PMS permission, zero-pitch, lock-down) – they prevent blackouts and damage.',
        'Trend data and oil analysis catch failures early – read them.',
        'Test E-stops and alarms regularly; hidden failures are found only by testing.',
        'Save fault logs before reset and report recurring trips – they are early warnings.',
        'Coordinate with the bridge and DPO before any work on a thruster.',
        'After maintenance, verify direction of thrust, azimuth and pitch from every station.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Thruster Systems (Guide)', icon: '🌀', accent: '#1e40af',
    subtitle: 'Practical guide to tunnel, azimuth, retractable, Z/L-drive and pod thrusters – FP vs CP, drive train, auxiliaries, control, protection, DP interface, maintenance, troubleshooting and safety.',
    refs: ['Maker manuals', 'Class rules', 'Vessel FMEA / operating documents'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
