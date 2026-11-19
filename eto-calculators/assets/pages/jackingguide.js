(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values are typical. The jacking system maker’s manuals, the unit’s operations / marine operations manual, site-specific assessment and class rules always govern.</p>';

  const S = [
    ['overview', '🏗️', 'Overview', () =>
      `<p>A <b>jack-up</b> is a self-elevating unit (drilling rig, liftboat, wind-turbine installation vessel, accommodation unit) with three or more legs that are lowered to the seabed so the hull can be lifted clear of the sea. The <b>jacking system</b> moves the legs relative to the hull: it lowers the legs, preloads the soil, lifts the hull to the working air gap, holds it there, and later lowers the hull and extracts the legs.</p>` +
      H('Two main technologies') + TB(['Type', 'Principle', 'Typical use'], [
        ['Rack-and-pinion (electric)', 'Many electric motors with gearboxes drive pinions engaging racks on the leg chords; continuous motion', 'Most drilling rigs and modern wind-installation vessels; truss legs (3 or 4 chords) or some cylindrical legs'],
        ['Rack-and-pinion (hydraulic motors)', 'As above but pinions driven by hydraulic motors fed from an HPU', 'Some liftboats and smaller units'],
        ['Pin-and-yoke / hydraulic cylinder', 'Hydraulic cylinders move a yoke; pins engage holes in the leg; stepwise (climbing) motion', 'Liftboats, older and smaller units, many cylindrical-leg designs']]) +
      H('Main sub-systems') + L([
        '<b>Jacking units</b> per leg (motors / gearboxes / brakes / pinions, or cylinders / yokes / pins).',
        '<b>Drives / power</b>: VFDs and DC bus for electric systems; HPU, pumps, valves and accumulators for hydraulic systems.',
        '<b>Fixation / locking system</b> (rack chocks, leg locks, pins) to hold the hull in the elevated condition without loading the gearing.',
        '<b>Jacking control system</b>: PLC, HMI, leg position, load monitoring, RPD, inclination, alarms and interlocks.',
        '<b>Power plant</b>: generators and switchboard supplying the large jacking load.']) +
      H('Why it matters') + L([
        'Jacking operations are among the most critical operations on a jack-up – leg damage, punch-through or loss of hull level can lead to loss of the unit.',
        'The ETO is responsible for most of the drives, brakes, control and monitoring – reliability during a jacking window is essential.']) +
      `<p>Related pages: ${A('jacking.html', 'Jacking calculations')}, ${A('vfd.html', 'VFD / Drives')}, ${A('plant.html', 'Power Plant &amp; Load Balance')}.</p>` + NOTE
    ],
    ['electric', '⚙️', 'Electric rack-and-pinion system', () =>
      `<p>Each leg chord carries a <b>rack</b> (one or two-sided). Each leg has a number of <b>jacking units</b> (pinions) arranged on the chords inside the jack-house / leg well. Large units may have many pinions per leg (often in the order of 12–24 per leg on a 3-chord truss leg – design dependent).</p>` +
      TB(['Component', 'Function', 'Typical notes'], [
        ['AC induction motor', 'Drives one pinion through a gearbox', 'Squirrel-cage, often IP56 or better, with space heaters and thermistors / PT100'],
        ['Motor brake', 'Fail-safe spring-applied, electrically released brake on the motor shaft (usually on the non-drive end)', 'Holds the load when de-energised; released by the drive sequence; must be able to hold static and dynamic loads'],
        ['Gearbox', 'Large reduction (planetary) to give high torque at low pinion speed', 'Oil level, temperature, condition monitoring; slow jacking speed (typically well under 1 m/min)'],
        ['Pinion and rack', 'Converts torque into vertical force on the chord', 'Tooth wear, lubrication, alignment and backlash checked regularly'],
        ['Encoder / speed sensor', 'Motor speed feedback for closed-loop vector control and slip / brake monitoring', 'Incremental encoders common; cable and connector faults are frequent'],
        ['Load measurement', 'Pinion load from motor torque (drive) or load pins / strain gauges', 'Used for overload alarms and load balancing between chords and legs'],
        ['Leg position sensors', 'Measure leg travel / penetration relative to hull', 'Encoders on idler pinions, counting systems, or calculated from motor encoders'],
        ['Inclinometers', 'Hull trim and heel', 'Used to keep the hull level during jacking'],
        ['Fixation system', 'Rack chocks or leg locks clamping the chords', 'Takes the elevated hull load off the pinions / gears (design dependent)']]) +
      H('Grouping') + L([
        'Motors are grouped per <b>chord</b> and per <b>leg</b>; one VFD may drive one motor, a group of motors in parallel, or all motors of a chord – depends on design.',
        'Motors on the same chord must share load evenly; the drive / control system balances torque between chords to prevent overloading a single pinion.',
        'Leg <b>chord numbering</b>, motor numbering and the cabling from jack-house to drive room must be known – drawings are essential when fault finding.']) + NOTE
    ],
    ['hydraulic', '🛢️', 'Hydraulic jacking system', () =>
      `<p><b>Pin-and-yoke</b> (also called pin-hole) systems move the hull by hydraulic cylinders acting on a yoke (or ring) that engages the leg via pins. The motion is a series of strokes: engage pins, stroke the cylinders, engage the fixed pins, retract the moving pins, return the yoke – and repeat.</p>` +
      TB(['Component', 'Function', 'Typical notes'], [
        ['HPU (hydraulic power unit)', 'Electric motor-driven pumps supplying oil pressure', 'Usually duty / standby pumps; variable-displacement pumps common; tank, filters, coolers'],
        ['Main jacking cylinders', 'Provide the lifting force between hull and yoke', 'Several per leg; position transducers on cylinders on many systems'],
        ['Moving yoke / upper ring', 'Carries pins that engage the leg holes', 'Travels with cylinder stroke'],
        ['Fixed yoke / lower pins', 'Hold the leg while the moving yoke is repositioned', 'Must be engaged before moving pins are withdrawn'],
        ['Pin cylinders', 'Insert and withdraw pins', 'Pin-in / pin-out limit switches or proximity sensors – critical interlocks'],
        ['Directional and proportional valves', 'Control cylinder direction and speed', 'Solenoid coils, amplifier cards, spool feedback'],
        ['Counterbalance / load-holding valves', 'Prevent uncontrolled lowering if pressure is lost', 'Pilot-operated check valves mounted on cylinders'],
        ['Accumulators', 'Store energy for pin operation, emergency functions or pressure smoothing', 'Gas precharge (nitrogen) must be checked; pressure vessels'],
        ['Hydraulic motor rack-and-pinion (variant)', 'Hydraulic motors with brakes drive pinions instead of cylinders', 'Brakes often hydraulically released, spring applied']]) +
      H('Key points') + L([
        'The sequence logic (PLC) ensures that <b>at least one set of pins is always engaged</b> – pin sensor faults stop the sequence.',
        'Oil cleanliness is critical: contamination causes valve sticking and cylinder damage.',
        'Leg position is often counted in pin-hole steps plus cylinder stroke.',
        'The HPU electric motors are large consumers – starting sequence and PMS permission apply.']) + NOTE
    ],
    ['drives', '🔌', 'Drives, brakes & regeneration', () =>
      H('Variable frequency drives') + L([
        'Jacking motors are normally controlled by <b>VFDs</b> in closed-loop (encoder) vector / torque control to give full torque at zero speed – essential to hold a load before the brake opens.',
        'Typical architecture: a common <b>DC bus</b> fed by a rectifier (diode or active front end) with several inverters connected – one per motor or per group.',
        'Drive parameters (torque limits, speed ramps, brake timing, load sharing) are set by the maker – changes only under Management of Change.',
        'More details in ' + A('vfd.html', 'VFD / Drives') + '.']) +
      H('Brake sequence (typical)') + L([
        '<b>Start</b>: drive magnetises the motor and builds holding torque at zero speed → brake release command → brake-released feedback (where fitted) → speed ramp.',
        '<b>Stop</b>: ramp to zero speed while holding torque → brake applied → short delay → torque removed.',
        'If torque is removed before the brake holds, or the brake opens before torque is established, the load can slip – <b>brake / torque proving</b> logic prevents this on many systems.',
        'Brakes are <b>fail-safe</b> (spring-applied): loss of power or E-stop applies all brakes.']) +
      H('Regeneration when lowering') + L([
        'When lowering the hull (jack down) or lowering legs under load, the motors act as <b>generators</b> and feed energy back into the DC bus.',
        'With a diode rectifier this energy cannot return to the network – <b>brake choppers</b> switch it into <b>braking resistors</b>; without them the DC bus over-voltage trips the drive.',
        'Active front-end (AFE) drives can return energy to the switchboard – then generators may see reverse power if load is low; PMS must handle this.',
        'Check braking-resistor cooling (air or water) and over-temperature switches; a failed chopper stops the lowering operation.']) +
      TB(['Item', 'Typical check'], [
        ['Brake air gap', 'Measured to maker limits; adjust or replace friction disc'],
        ['Brake release voltage / coil', 'Coil resistance and supply (often via rectifier module); release confirmed'],
        ['Brake chopper', 'IGBT, resistor value and insulation, over-temperature sensor'],
        ['DC bus', 'Capacitor condition, voltage during regeneration, fuses'],
        ['Encoder', 'Signal quality, shielding, connector, pulse count']]) + NOTE
    ],
    ['control', '🖥️', 'Control system, modes & monitoring', () =>
      `<p>The <b>jacking control system</b> (usually PLC-based with one or more HMI panels in the jacking control room and local panels at each leg) coordinates all legs, protects the structure and gives the operator the information needed to jack safely.</p>` +
      TB(['Mode', 'Purpose'], [
        ['Leg lowering (afloat)', 'Lower legs to the seabed; hull afloat, legs carry only their own weight'],
        ['Preload', 'Load the legs (often one or two at a time, or with ballast water) to test the soil beyond the expected operational load'],
        ['Jack up (hull lifting)', 'All legs lift the hull together while keeping it level'],
        ['Jack down (hull lowering)', 'Lower the hull back to the water – regenerative operation'],
        ['Leg extraction / pulling', 'Pull legs out of the soil using the hull buoyancy; may need jetting'],
        ['Single leg / single chord', 'Maintenance or correction of individual legs or chords – restricted, often key-switch protected'],
        ['Local / maintenance', 'Control from local panels at the leg for testing']]) +
      H('Monitoring functions') + L([
        '<b>Leg position</b> and <b>penetration</b> – relative movement of each leg; compared to the expected values from the site assessment.',
        '<b>Pinion / chord loads</b> – load per pinion or chord from drive torque or load sensors; alarms on overload and imbalance.',
        '<b>Rack Phase Difference (RPD)</b> – the difference in vertical position between the racks of the chords of one leg. High RPD means the leg is bending / inclined and chord loads are uneven; limits are set by the leg designer and trigger alarms and stop functions.',
        '<b>Hull inclination</b> – trim and heel; legs are jacked to keep the hull level within limits.',
        '<b>Leg inclination / leg-hull guide loads</b> on some units.',
        '<b>Motor / drive status</b>: running, faults, temperature, brake status, encoder faults.',
        '<b>Hydraulic systems</b>: pressure, oil level and temperature, filter differential pressure, pin position.']) +
      H('Interlocks (typical)') + L([
        'Fixation / locks must be released before jacking; jacking blocked while locks are engaged.',
        'Overload, RPD and inclination limits stop jacking or restrict direction.',
        'Loss of encoder, brake feedback or communication stops the affected group.',
        'Emergency stop applies brakes and removes drive torque on all legs.']) + NOTE
    ],
    ['ops', '🚦', 'Operations & power plant', () =>
      H('Typical operation sequence') + L([
        '<b>Approach & positioning</b> – move on location (tow, DP or anchors); check site survey, weather window and sea state limits.',
        '<b>Lower legs</b> – legs lowered until seabed contact (touch-down detected by load increase).',
        '<b>Preload</b> – legs loaded to the specified preload (typically above the maximum expected storm leg load) by ballast and / or jacking; hold for the required time while monitoring penetration.',
        '<b>Jack up</b> – lift the hull clear of the water to the planned air gap, keeping the hull level and RPD within limits.',
        '<b>Engage fixation / locks</b> – hold the hull; stop or isolate the jacking drives as required by procedures.',
        '<b>Jack down</b> – release locks, lower the hull into the water (regeneration).',
        '<b>Leg extraction</b> – pull legs out of the soil; jetting may be required; watch for sudden release.']) +
      H('Punch-through awareness') + L([
        'A <b>punch-through</b> is a sudden, uncontrolled penetration of a leg when a strong soil layer over a weak layer fails – the hull may tilt severely.',
        'Preload is done with the hull at minimum air gap (just clear of or in the water) so that if a leg punches through, the hull settles in the water and damage is limited.',
        'Watch leg penetration and loads closely; keep jacking ready to react; follow the site-specific procedures.']) +
      H('Power plant and generator loading') + L([
        'Jacking is one of the largest electrical loads on board – total jacking motor power may be several MW on large units.',
        'Run enough generators with margin for the peak (start / breakaway torque, preload, extraction); agree the configuration before the operation.',
        'During <b>jack down</b> regenerated energy is burned in resistors or returned (AFE) – low generator load and reverse power may become an issue.',
        'Avoid starting other heavy consumers during jacking; blackout during jacking applies all brakes – plan for recovery.',
        'See ' + A('plant.html', 'Power Plant &amp; Load Balance') + ' for load calculations and ' + A('jacking.html', 'Jacking calculations') + '.']) +
      H('Weather and sea-state limits') + L([
        'Jacking (leg touch-down, preload, extraction) is allowed only within the wave height, period, wind and current limits of the operations manual – leg impact on the seabed in waves can damage legs and pinions.',
        'Elevated survival limits and afloat limits differ; check the marine operations manual and the site-specific assessment.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The jacking <b>single-line diagram</b>: supply from the switchboard, rectifiers / DC bus, drives per leg, brake choppers and resistors.',
        'Motor, brake and encoder numbering per leg and chord – and the cabling routes through the jack-house.',
        'The <b>brake sequence</b> and how brake release and torque proving work on your system.',
        'Where load, RPD and position signals come from, how they are calibrated and what the alarm / stop limits are.',
        'The jacking PLC / HMI: modes, interlocks, overrides (and who may use them), alarm history and event logs.',
        'Hydraulic systems: HPU motors and starters, valve solenoids, pin sensors, accumulators and their electrical interlocks.',
        'Fixation / locking system interlocks with the jacking system.',
        'Generator configuration required for jacking and the effect of regeneration on the plant.',
        'How to isolate a single motor / pinion safely (and its effect on the leg capacity) per the maker procedure.',
        'Backups of PLC programs and drive parameter sets; spare drives / encoders / brake parts on board.',
        'Being on standby during every jacking operation – faults must be fixed quickly within the weather window.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Before each jacking operation', 'Pre-jacking checklist: drives and HMI healthy, all motors and brakes ready, encoders OK, E-stops tested, generators online, locks status, hydraulic pressures and oil levels, communications'],
        ['During jacking', 'Monitor loads, RPD, inclination, motor temperatures, brake faults, DC bus and resistor temperatures; log readings'],
        ['After jacking', 'Review alarm and event logs, check brakes and resistors, record running hours'],
        ['Weekly (when elevated)', 'Space heaters on idle motors, HMI / PLC status, UPS for control, HPU oil level and leaks'],
        ['Monthly / per jacking cycle', 'Brake air gap and wear checks (sampled), encoder connectors, cable glands, rack and pinion lubrication and visual tooth inspection'],
        ['3–6 monthly', 'Insulation resistance of jacking motors and brake coils, gearbox oil sampling, hydraulic oil sampling and filter change, accumulator precharge check'],
        ['Yearly', 'Brake holding (static) tests, load-measurement calibration, emergency stop function tests of all legs, thermographic survey of drives and switchgear, protection settings check'],
        ['Class / 5-yearly', 'Jacking system survey with class, brake tests and load tests as required, gearbox and pinion inspections, NDT of racks / pinions per class']]) +
      H('Brake testing') + L([
        '<b>Static holding test</b>: the drive applies a defined torque against the closed brake (typically above the rated holding requirement) and checks that the motor does not rotate – encoder movement indicates slip.',
        'Many systems have an automatic brake test function in the HMI; results should be logged per motor.',
        'Failed brakes must be repaired or the motor isolated per maker procedure; check the effect on leg capacity before jacking.',
        'Brake tests are normally done with the hull afloat or with locks engaged, as stated in the maker procedure.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Drive trips on overcurrent at start', 'Brake not releasing, mechanical binding, wrong motor phase, encoder fault', 'Check brake release voltage and feedback, encoder signals, motor insulation and phases'],
        ['DC bus overvoltage trip during jack down', 'Brake chopper or resistor failure, resistor over-temperature, ramp too fast', 'Check chopper IGBT, resistor value and cooling, temperature switch, drive parameters'],
        ['Encoder fault / speed deviation alarm', 'Damaged cable, loose connector, moisture, failed encoder', 'Check signal with scope or drive diagnostics, shield earthing, connector condition'],
        ['Brake slip detected / brake test failed', 'Worn lining, wrong air gap, oil contamination, weak springs', 'Measure air gap, inspect disc, replace per maker, retest'],
        ['Brake does not release', 'Coil open circuit, rectifier module failed, supply contactor, mechanical seizure', 'Measure coil resistance and supply voltage, check rectifier and contactor'],
        ['High RPD alarm', 'Uneven chord loads, a motor or chord not running, position sensor error', 'Stop, check which chord lags, motor and drive status, verify position sensor; correct per procedure'],
        ['Uneven pinion loads / overload alarm', 'Load sharing settings, motor isolated, calibration drift, rack damage', 'Compare torque readings, check calibrations and isolated motors, inspect rack'],
        ['Motor high temperature', 'Overload, blocked ventilation, failed fan, long jacking periods', 'Check load, cooling, thermistor circuit, allow cool-down'],
        ['HPU pressure low', 'Pump wear, relief valve set low or leaking, low oil level, motor fault', 'Check oil level, pump and relief settings, leaks, motor current'],
        ['Hydraulic sequence stops at pin step', 'Pin position sensor failed or misaligned, pin jammed, solenoid fault', 'Check sensor signal and target, solenoid coil and supply, pin mechanically'],
        ['Hydraulic cylinder creeps when holding', 'Leaking load-holding valve or cylinder seal', 'Engage locks / fixed pins, check counterbalance valve and seals'],
        ['Communication loss PLC – drives / remote I/O', 'Network cable, switch, node power supply, termination', 'Check network diagnostics and LEDs, supplies, connectors']]) + NOTE
    ],
    ['safety', '⛑️', 'Safety', () =>
      L([
        'Jacking is a <b>critical operation</b>: follow the operations manual, checklists and permit system; only authorised personnel operate the jacking system.',
        'Never override interlocks, load or RPD limits without the authority defined in the procedures (OIM / barge master) and a risk assessment.',
        'Work on jacking motors, brakes or drives only under <b>isolation and permit to work</b> – a released brake on a loaded pinion can let the leg or hull move.',
        'Hydraulic systems: release stored pressure and accumulators before opening; high-pressure oil injection injuries are serious.',
        'DC bus capacitors stay charged after isolation – wait the discharge time and verify zero voltage.',
        'Jack-house and leg-well areas: restricted access during jacking, risk of crushing between leg and hull, working at height.',
        'Brake resistors become very hot during jack down.',
        'Keep communication clear between the jacking control room, engine control room, bridge and the leg watch persons.',
        'Be ready for blackout or emergency stop during jacking – know the recovery procedure.']) + NOTE
    ],
    ['lessons', '📚', 'Common failures & lessons', () =>
      H('Common failures') + L([
        'Encoder cables and connectors in the jack-house (vibration, moisture, salt).',
        'Brake rectifier modules and brake coils; worn brake discs.',
        'Brake choppers and resistors during jack down.',
        'Drive IGBT / power module failures after long periods of inactivity or condensation.',
        'Motor insulation degradation when space heaters are off for long periods.',
        'Hydraulic pin sensors, solenoid valves and contaminated oil.',
        'Load measurement drift giving false overload or imbalance alarms.']) +
      H('Lessons learned') + L([
        'Test before the operation – brakes, E-stops, drives and HMI – not during the weather window.',
        'Keep the jack-house dry and heated: most electrical faults start with moisture.',
        'Keep spare drives, encoders, brake parts and PLC cards on board and know how to exchange them.',
        'Back up drive parameters and PLC programs; document every change.',
        'Do not ignore small RPD or load imbalances – they can indicate a failed motor, brake drag or leg damage.',
        'Punch-through and leg damage incidents are often linked to inadequate preload, poor site data or jacking outside limits – respect the procedures.',
        'Log all faults and actions – trends help predict failures.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Jacking Systems (Guide)', icon: '🏗️', accent: '#0284c7',
    subtitle: 'Jack-up jacking systems for the ETO – electric rack-and-pinion and hydraulic pin-and-yoke systems, drives, brakes and regeneration, control and monitoring (RPD, loads, position), operations, power plant, maintenance, troubleshooting and safety.',
    refs: ['Jacking system maker manuals', 'Unit operations / marine operations manual', 'Class rules for self-elevating units', 'SNAME 5-5A site-specific assessment'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
