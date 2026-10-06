(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values are typical. The separator / fuel-module maker’s manuals, SOLAS, MARPOL, flag and class rules and the vessel’s SMS always govern.</p>';

  const S = [
    ['overview', '⛽', 'Fuel oil system overview', () =>
      `<p>The <b>fuel oil system</b> takes fuel from the bunker tanks, cleans it and delivers it at the right pressure, temperature and viscosity to main engines, generators and boilers. The ETO is mainly concerned with the <b>pumps, heaters, separators, level and temperature instrumentation, alarms, remote stops and quick-closing valves</b>.</p>` +
      H('Fuel path (typical)') + L([
        '<b>Bunker (storage) tanks</b> – double-bottom or wing tanks, filled through the bunker manifold.',
        '<b>Transfer pump</b> – moves fuel from bunker tanks to the <b>settling tank</b>.',
        '<b>Settling tank</b> – heated; water and heavy sludge settle and are drained.',
        '<b>Separators (purifiers)</b> – centrifugally remove water, sludge and cat-fines; deliver to the <b>service (day) tank</b>.',
        '<b>Service tank</b> – clean fuel ready for use; overflow normally back to the settling tank.',
        '<b>Booster / supply module</b> – supply pumps, mixing (return) tank, circulating (booster) pumps, heaters, viscosity control and fine filters, then to the engines.']) +
      H('Fuel grades') + TB(['Grade', 'Notes (typical)'], [
        ['MGO (DMA / DMZ)', 'Distillate, low viscosity, no heating needed; may need cooling or a chiller to keep minimum viscosity at the engine'],
        ['MDO (DMB)', 'Distillate with some residual content; little or no heating'],
        ['HFO / IFO (RMG, RMK)', 'Residual fuel, high viscosity; heated in tanks, separators and before injection'],
        ['VLSFO / ULSFO', 'Low-sulphur blends (ECA / 0.50 % S global cap); compatibility and stability issues possible – avoid mixing batches']]) +
      H('Heating and viscosity control (briefly)') + L([
        'HFO is heated to get the injection viscosity required by the engine maker (typically around 10–15 cSt at the engine inlet).',
        'Heaters are steam, thermal oil or electric; a <b>viscometer</b> (viscosity controller) adjusts heating, often with temperature control as back-up.',
        'Change-over between HFO and MGO must be gradual to avoid thermal shock and pump seizure – follow the engine maker’s procedure.']) +
      `<p>Related pages: ${A('pumps.html', 'Pumps guide')}, ${A('esd.html', 'ESD guide (remote stops)')}, ${A('tempsensors.html', 'Temperature Sensors')}.</p>` + NOTE
    ],
    ['tanks', '🛢️', 'Tanks, transfer & level monitoring', () =>
      TB(['Item', 'Function', 'ETO interest'], [
        ['Bunker tanks', 'Bulk storage, often with heating coils', 'Level gauging (radar, pressure, float), temperature sensors, high-level alarm'],
        ['Settling tank', 'Heated, allows water and sludge to settle', 'Temperature control, level, high / low level alarms, drain valve'],
        ['Service (day) tank', 'Clean fuel for consumers', 'Low-level alarm (critical – loss of fuel to engines), high level, temperature'],
        ['Overflow tank', 'Receives overflow from settling / service tanks and bunkering', 'High-level alarm – an alarm means overflow has occurred'],
        ['Sludge tank', 'Separator sludge and drains', 'High-level alarm, heating'],
        ['Transfer pumps', 'Bunker to settling, tank to tank', 'Motor starter, auto start / stop on level, remote stop, overload'],
        ['Flow meters', 'Fuel consumption per engine / boiler', 'Pulse or analogue signal to monitoring / EEXI-CII and MRV reporting'],
        ['Sampling points', 'Representative samples (bunkering drip sample, in-use sample points)', 'Mainly engine department; MARPOL Annex VI sample point requirements']]) +
      H('Level gauging and alarms') + L([
        'Typical sensors: <b>radar</b> (non-contact), <b>pressure / hydrostatic</b> transmitters (needs correct density), <b>float switches</b> for alarms, sounding pipes as back-up.',
        'High-level alarms on tanks that can overflow are important during <b>bunkering and transfers</b> – test them before bunkering.',
        'Service tank <b>low-level</b> alarm gives time to start transfer / separation before the engines lose fuel.',
        'Heated tanks: sensor temperature rating and cable insulation must suit the hot environment.',
        'Wrong density setting on a pressure transmitter gives a wrong level – check after changing fuel grade.']) +
      H('Overflow and spill prevention') + L([
        'Service tank overflow normally returns to the settling tank – a continuous overflow from separators is normal and keeps the service tank full.',
        'Overflow to the overflow tank should never be normal – investigate.',
        'Oil spills overboard must be prevented: save-alls, scuppers plugged during bunkering, alarms tested.']) + NOTE
    ],
    ['qcv', '🚨', 'Quick-closing valves & remote stops', () =>
      `<p><b>SOLAS II-2</b> requires that fuel oil tanks above the double bottom, whose damage would release oil, have a valve that can be <b>closed from a safe position outside the space</b> (quick-closing valve, QCV). Pumps for fuel transfer and separator feed must be <b>stoppable from outside the space</b> as well. See ${A('esd.html', 'ESD guide (remote stops)')}.</p>` +
      TB(['Function', 'Typical design', 'Checks'], [
        ['Quick-closing valves', 'Pneumatic (air bottle / ring main) or hydraulic trip; sometimes wire-pulled; valve closes and must be reset locally', 'Test closing per planned maintenance, check air pressure, no valve blocked open, labels'],
        ['Remote stops (fuel pumps, separators, purifier feed pumps, ventilation)', 'Push buttons outside the engine room, often in fire control station; open the starter coil circuit or trip breakers', 'Test stops, check wire-break monitoring where fitted, labels match the actual consumer'],
        ['Fire damper / fan stops', 'Usually grouped with fuel pump stops in the fire control station', 'Test together during drills where allowed'],
        ['Emergency shutdown panel', 'Groups of stops (e.g. ER fuel pumps, purifiers, boiler, ventilation)', 'Indication lamps, circuit integrity, documentation']]) +
      H('ETO points') + L([
        'Stop circuits are usually <b>normally closed</b> loops or a de-energise-to-stop design; know whether a wire break stops the pump or only gives an alarm.',
        'After a QCV test the valve must be reset <b>locally</b> – coordinate with the engineers before testing anything that could stop running engines.',
        'Never bypass or jumper a remote stop. If a temporary bypass is needed it must be under permit and recorded.',
        'Remote stops are inspected by PSC and class – keep test records.']) + NOTE
    ],
    ['principle', '🌀', 'Purifier principle (purifier vs clarifier)', () =>
      `<p>A <b>centrifugal separator</b> spins the oil in a bowl at high speed (typically several thousand rpm). The centrifugal force – thousands of times gravity – makes heavier water and solids move outward while clean oil moves inward and leaves through the top.</p>` +
      TB(['Mode', 'Separates', 'How'], [
        ['Purifier', 'Oil from water and solids (liquid-liquid-solid)', 'Water seal in the bowl; an interface between oil and water is set by the gravity disc; separated water leaves continuously through the water outlet'],
        ['Clarifier', 'Solids (and small amounts of water) from oil (liquid-solid)', 'No water outlet; a clarifier disc closes the water path; water and sludge collect at the periphery and are removed by sludge discharge'],
        ['Series operation', 'Purifier followed by clarifier', 'Traditional for poor HFO; clarifier as a polishing stage or back-up']]) +
      H('Gravity disc vs automatic water detection') + L([
        '<b>Gravity disc (conventional purifier)</b>: the disc size sets the oil/water interface position. It is chosen from a nomogram based on fuel <b>density and temperature</b>. Wrong disc = interface too far out (poor separation) or too far in (seal broken, oil to water outlet).',
        'Conventional purifiers are limited to fuels with density up to about 991 kg/m³ at 15 °C (typical).',
        '<b>Automatic systems (e.g. ALCAP-type)</b>: the separator runs as a clarifier. A <b>water transducer</b> in the clean-oil outlet detects water. When water reaches the disc stack and appears in the outlet, the control unit triggers a sludge discharge or opens a drain (water) valve. No gravity disc changes; handles densities up to about 1010 kg/m³ (typical).',
        'Other makers use similar principles under different names – read the maker manual.']) +
      H('Factors for good separation') + L([
        '<b>Temperature</b> – lower viscosity and larger density difference; HFO typically separated at about 98 °C.',
        '<b>Feed rate</b> – lower flow gives longer residence time and better separation; optimal is often well below rated capacity.',
        '<b>Bowl speed</b> – must be at full speed before oil feed is opened.',
        '<b>Clean disc stack</b> and correct sludge discharge interval.']) +
      H('LO purifiers') + L([
        'Main and auxiliary engine lube oil is cleaned continuously by separators in bypass (from and back to the sump / LO tank).',
        'Typical LO separation temperature is lower than HFO (often about 90–95 °C, see manual); water washing is avoided for detergent oils.',
        'Same electrical items as fuel separators: motor, heater, control unit, sensors and remote stop.',
        'Water in LO alarm or rising sludge quantity can indicate a cooler leak or engine problem – report to the engineers.']) + NOTE
    ],
    ['structure', '⚙️', 'Purifier structure & auxiliaries', () =>
      TB(['Part', 'Function'], [
        ['Bowl and disc stack', 'Rotating bowl with conical discs that split the flow into thin layers for efficient separation'],
        ['Sliding bowl bottom', 'Hydraulically operated by operating water; drops briefly to discharge sludge, then closes'],
        ['Paring discs (pumps)', 'Stationary discs that pump clean oil (and water in purifier mode) out of the rotating bowl under pressure'],
        ['Gravity disc / clarifier disc', 'Sets interface (purifier) or closes water path (clarifier)'],
        ['Vertical shaft, gear or belt drive', 'Drive from motor via worm gear, flat belt or direct drive depending on make'],
        ['Friction clutch / fluid coupling', 'Allows gradual run-up of the heavy bowl without overloading the motor (older designs)'],
        ['Operating water system', 'Solenoid valves supply water to open / close the bowl and to make water seal / displacement water'],
        ['Feed pump', 'Separate electric pump or attached gear pump; supplies fuel from settling tank'],
        ['Heater', 'Steam, thermal-oil or electric heater with temperature control to separation temperature'],
        ['Three-way (feed / recirculation) valve', 'Pneumatic or electric valve: directs oil to the separator or back to the tank (recirculation) when not ready or on alarm'],
        ['Back-pressure / regulating valve', 'Sets clean oil outlet pressure to keep the interface stable'],
        ['Sludge tank connection', 'Discharged sludge and water to sludge tank']]) +
      H('Operating water') + L([
        'Fresh water, often from a dedicated header tank or the hydrophore, at a stated minimum pressure (typical 2–8 bar, see manual).',
        'Solenoid valves (opening water, closing water, seal water, displacement water) are controlled by the control unit.',
        'Low or unstable operating water pressure is a classic cause of failed or incomplete sludge discharge and oil loss.']) +
      H('Sludge discharge (desludging)') + L([
        'Partial or total discharge at timed intervals (typical every 30 min – few hours, depending on fuel) or triggered by the water transducer.',
        'Before discharge, oil feed is stopped (three-way valve to recirculation) and displacement water may be added to push oil out of the bowl.',
        'A successful discharge is confirmed by a short motor current rise or a speed dip / sludge outlet sensor, depending on the system.']) + NOTE
    ],
    ['control', '🎛️', 'Control unit, sensors & alarms', () =>
      `<p>Modern separators have a <b>control unit</b> (e.g. EPC-type) – a PLC or dedicated controller with a display that sequences start, separation, sludge discharge and stop, and monitors alarms.</p>` +
      TB(['Sensor', 'Purpose', 'Typical alarm / action'], [
        ['Speed sensor (inductive pick-up on shaft or gear)', 'Bowl speed for start sequence and supervision', 'Low speed / overspeed alarm; feed not allowed until full speed'],
        ['Vibration sensor / switch', 'Detects imbalance (sludge build-up, incomplete discharge, damaged parts)', 'High vibration – stop separator, investigate'],
        ['Oil temperature sensor (Pt100)', 'Heater control and supervision', 'Low / high temperature – feed to recirculation'],
        ['Oil outlet pressure transmitter', 'Monitors back pressure and paring disc function', 'High / low pressure alarm – may indicate broken water seal or blocked outlet'],
        ['Water transducer (capacitive)', 'Detects water in clean-oil outlet (ALCAP-type)', 'Triggers discharge or drain; alarm if water persists'],
        ['Water outlet / sludge sensors', 'Detect oil in water outlet or confirm discharge', 'Water seal broken / discharge failure alarm'],
        ['Operating water pressure switch', 'Confirms water supply', 'Low operating water pressure alarm'],
        ['Motor current transmitter', 'Load supervision; can detect discharge', 'Overload; discharge confirmation']]) +
      H('Typical alarm handling') + L([
        'On most alarms the <b>three-way valve goes to recirculation</b> so dirty oil is not sent to the service tank.',
        'Serious alarms (vibration, overspeed, repeated discharge failure) stop the separator.',
        'Common alarm outputs go to the engine room alarm system (AMS); some have individual alarms.',
        'Check the controller parameter list and keep a copy – parameters lost after a board change are a common problem.']) +
      `<p>Temperature sensor details: ${A('tempsensors.html', 'Temperature Sensors')}.</p>` + NOTE
    ],
    ['electrical', '⚡', 'Electrical: motor, starter, heater', () =>
      H('Separator motor and starter') + L([
        'Typically a 3-phase induction motor, a few kW to some tens of kW depending on size.',
        'Run-up of the heavy bowl takes several minutes (typical 3–10 min); the starter and overload relay must allow this <b>long starting time</b> – Y/Δ with a friction clutch on older units, soft starter or <b>VFD</b> on newer ones.',
        'A VFD gives controlled ramp-up, lower starting current and sometimes faster run-up; braking may be by VFD or by coasting (run-down can take a long time).',
        'Overload relay setting per motor nameplate; repeated overload trips during start usually point to clutch, bearing or brake problems, not the relay.',
        'Interlocks: control unit, remote / emergency stop, sometimes cover / lid switch.']) +
      H('Electric heater control') + TB(['Item', 'Typical arrangement'], [
        ['Power stage', 'Contactors (on/off or stepped) or thyristor (SCR) controller for smooth control'],
        ['Control', 'Temperature controller (PID) using Pt100 in oil outlet; set point typically about 98 °C for HFO, lower for MDO'],
        ['High-temperature cut-out', 'Independent thermostat or safety controller with manual reset – trips heater power on overtemperature'],
        ['Flow interlock', 'Heater only energised when feed pump is running / flow proven, to avoid boiling or coking'],
        ['Protection', 'MCCB / fuses, earth-fault protection where required, element insulation resistance checked']]) +
      H('Hazardous area?') + L([
        'The engine room and purifier room are <b>normally not classified hazardous areas</b> for fuels with flash point above 60 °C, so ordinary industrial equipment is used.',
        'Low flash point fuels (e.g. methanol, LNG) and some special designs are different – follow the specific rules.',
        'Equipment must still be suitable for the hot, oily environment: IP rating, temperature class of cables, sealed glands.']) +
      `<p>Pump motors and starters: ${A('pumps.html', 'Pumps guide')}.</p>` + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The fuel system <b>P&amp;ID</b>: tanks, pumps, separators, heaters, QCVs and where each sensor and remote stop is.',
        'Which pumps and separators are stopped by which <b>remote stop</b>, and how the stop circuit is wired.',
        'The separator <b>start / stop sequence</b> and what the control unit checks at each step.',
        'Sensor types and ranges: speed pick-up, vibration, Pt100, pressure transmitters, water transducer.',
        'Heater control: controller, power stage, high-temperature cut-out and flow interlock.',
        'Motor starting method (Y/Δ, soft starter, VFD), overload setting and long start-time considerations.',
        'Solenoid valves for operating water – coil voltage, typical failures and how to test them.',
        'Control unit parameters, backup and replacement procedure.',
        'Tank level instrumentation and high / low level alarms, especially before bunkering.',
        'Flow meter signals for consumption reporting (MRV / DCS / CII).',
        'The fire risk around fuel systems and the importance of hot-surface insulation and spray shields.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Alarm list, separator speed and temperature, motor current, heater operation, tank levels, leaks'],
        ['Weekly', 'Test sludge discharge confirmation, check operating water pressure, check solenoid valves operate'],
        ['Before bunkering', 'Test tank high-level and overflow tank alarms, check level gauging'],
        ['Monthly / per PMS', 'Remote stop tests for fuel pumps and separators; check heater high-temperature cut-out'],
        ['Quarterly', 'Quick-closing valve test (as per SMS / PMS), vibration and speed sensor checks'],
        ['At separator overhaul (by running hours)', 'Engineers open bowl; ETO checks speed pick-up gap, vibration sensor, motor bearings, coupling / clutch'],
        ['Yearly', 'Insulation resistance of motors and heater elements, calibration of temperature and pressure transmitters, terminal tightness, contactor inspection'],
        ['After control unit / board change', 'Reload and verify parameters, full function test of sequence and alarms']]) +
      L([
        'Keep records of all alarm and remote-stop tests – they are checked by PSC, class and vetting inspectors.',
        'Co-ordinate with the engineer on watch: stopping a separator or testing a QCV affects fuel supply.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Separator will not reach full speed', 'Friction clutch pads worn, brake applied, bearing damage, low motor supply, VFD ramp setting, sludge in bowl', 'Check brake released, motor current and voltage, clutch, speed sensor reading against actual speed'],
        ['Long start time / overload trip during start', 'Clutch slipping too little, bearing damage, overload setting or class too low', 'Check overload relay class and setting, motor current curve, mechanical condition'],
        ['No sludge discharge / discharge failure alarm', 'Low operating water pressure, solenoid valve coil or valve fault, blocked nozzles, bowl seals', 'Operating water pressure, solenoid coil voltage and resistance, manual valve test, maker check'],
        ['Oil loss through sludge or water outlet', 'Bowl not closing (seals, operating water), broken water seal, wrong gravity disc, too high feed or temperature change', 'Check closing water, gravity disc selection, back pressure, feed rate; stop and inspect'],
        ['Overflow / oil to water outlet', 'Wrong gravity disc, back pressure too high, low temperature, no water seal', 'Back pressure setting, temperature, gravity disc chart, seal water supply'],
        ['High water alarm (water transducer)', 'Excess water in fuel, discharge not effective, transducer fouled or faulty', 'Drain settling tank, check discharge, clean / test transducer signal'],
        ['Heater not heating', 'Contactor or SCR fault, tripped high-temperature cut-out, flow interlock, element failure, steam valve fault', 'Check controller output, cut-out reset, element resistance and insulation, flow signal'],
        ['Temperature unstable', 'PID tuning, faulty Pt100 or wiring, varying feed', 'Compare sensor with thermometer, check wiring, controller settings'],
        ['High vibration alarm', 'Uneven sludge build-up, incomplete discharge, wrong assembly, worn bearings, damaged discs', 'Stop the separator, let it run down, inform engineers; check sensor mounting'],
        ['Speed alarm with normal running', 'Speed sensor gap wrong, dirty pick-up, cable fault', 'Measure sensor signal, adjust gap per manual'],
        ['Transfer / feed pump trips', 'Overload from cold viscous oil, blocked strainer, motor or bearing fault, remote stop circuit open', 'Check oil temperature, strainers, motor current, stop circuit continuity'],
        ['Service tank low level alarm', 'Separator stopped or recirculating, transfer pump off, high consumption', 'Check separator status and three-way valve, start standby separator; inform engineer'],
        ['Control unit lost parameters / display dead', 'Power supply fault, battery, board failure', 'Check 24 V supply, fuses, restore parameters from backup']]) + NOTE
    ],
    ['safety', '🔥', 'Safety & lessons', () =>
      H('Fire risks') + L([
        'Fuel leaks spraying on <b>hot surfaces</b> (above about 220 °C, e.g. exhaust manifolds, turbochargers) are a major cause of engine room fires (SOLAS II-2 requires insulation of hot surfaces).',
        'Fuel pipes must have spray shields on flanges near hot surfaces; high-pressure pipes are jacketed with leak detection.',
        'Separator rooms are often fitted with local fire protection (water mist) and separate ventilation – know the release and fan stops.',
        'Oil mist and leaks from separator covers, heater flanges and filters – report and fix leaks immediately.',
        'Electric heaters and motors in oily areas: keep terminal boxes closed and clean, no oily rags near equipment.']) +
      H('Personal safety') + L([
        '<b>Rotating bowl</b>: never open or work on a separator until it has <b>completely stopped</b> – run-down may take a long time. Check the speed indication and that the brake is applied.',
        '<b>Hot oil</b>: separation at about 98 °C – burns from leaks, drains and sampling.',
        '<b>Isolation</b>: lock out motor, heater and control supply; isolate steam / oil / water valves; release stored pressure.',
        'Bowl assembly errors can cause catastrophic failure – only follow the maker procedure with correct tools.']) +
      H('Records') + L([
        '<b>Oil Record Book Part I</b> (MARPOL Annex I): sludge disposal, bunkering, transfers and other machinery-space operations are recorded by the engineers.',
        'Bunker delivery notes and samples (MARPOL Annex VI) are kept on board.',
        'Alarm and remote-stop test records are kept in the PMS.']) +
      H('Lessons') + L([
        'A remote stop that does not work is found only by testing – do the tests.',
        'Most purifier “electrical” faults are mechanical or water-supply problems seen through sensors – check the process before changing parts.',
        'Keep parameter backups of separator controllers.',
        'Do not bypass high-temperature cut-outs or alarms to “keep running”.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Fuel Oil System & Purifiers (Guide)', icon: '⛽', accent: '#b45309',
    subtitle: 'What the ETO should know about the fuel oil system and centrifugal separators – tanks and level monitoring, quick-closing valves and remote stops, purifier principle and auxiliaries, control units, motors and heaters, maintenance, troubleshooting and safety.',
    refs: ['SOLAS II-2', 'MARPOL Annex I / VI', 'Separator maker manuals', 'Class rules'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
