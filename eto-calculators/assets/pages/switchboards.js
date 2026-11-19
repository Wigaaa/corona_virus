(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance with typical values only. The vessel’s single-line diagrams and switchboard drawings, maker manuals, protection coordination study, class rules and SOLAS always govern.</p>';

  const S = [
    ['overview', '🗺️', 'Overview & single-line', () =>
      `<p>The <b>Main Switchboard (MSB)</b> collects the power from the main generators and distributes it to the large consumers, motor control centres and distribution boards. The <b>Emergency Switchboard (ESB)</b> is fed from the MSB in normal service and from the emergency generator after a blackout, and supplies the emergency services required by SOLAS.</p>` +
      H('Typical single-line arrangement') + L([
        '<b>Generator sections</b>: each generator connects through its own generator circuit breaker (ACB on LV, VCB on HV) to a busbar section.',
        '<b>Bus-tie breakers</b> split the busbar into two (or more) sections – port / starboard or A / B. Open bus-ties give independent sections; closed bus-ties allow load sharing with fewer generators.',
        '<b>Feeders</b> from each section supply thrusters, propulsion transformers, pumps, compressors, group starter panels / MCCs and sub-distribution boards.',
        'Duplicated essential consumers (steering gear, cooling and lube pumps) are fed from <b>different sections</b> so one section failure does not stop both.',
        '<b>Interconnector</b> from the MSB to the ESB – normally live, opened / interlocked when the emergency generator supplies the ESB.',
        '<b>Shore connection panel</b> feeding the MSB (or ESB on some ships) in port / dry dock.']) +
      H('LV vs HV switchboards (typical)') + TB(['Item', 'LV switchboard', 'HV switchboard'], [
        ['Voltage', '440 V / 60 Hz or 400 V / 50 Hz; 690 V on larger ships and rigs', '3.3 kV, 6.6 kV or 11 kV (6.6 kV most common on large ships)'],
        ['When used', 'Total installed power up to a few MW', 'Large plants: cruise, LNG, drilling, DP and electric-propulsion ships'],
        ['Main breakers', 'Air circuit breakers (ACB), MCCBs on feeders', 'Vacuum circuit breakers (VCB) or SF6, vacuum contactors for motors'],
        ['Protection', 'Breaker trip units (electronic / thermal-magnetic) + generator protection relay', 'Numerical multifunction relays fed from CTs / VTs, differential protection'],
        ['Short-circuit level', 'High currents (tens of kA)', 'Lower current for the same power, but higher energy and arc risk'],
        ['Access', 'Authorised engineers', 'Authorised HV persons only, permit-to-work and switching programme']]) +
      `<p>Related pages: ${A('protection.html', 'Short-circuit &amp; Protection')}, ${A('insulation.html', 'Earthing &amp; Insulation')}, ${A('dieselgen.html', 'Diesel Generators guide')}, ${A('safety.html', 'Electrical Safety &amp; Isolation')}.</p>` + NOTE
    ],
    ['msb', '🏗️', 'MSB structure & components', () =>
      TB(['Section / component', 'Function', 'ETO notes (typical)'], [
        ['Generator panels', 'Generator breaker, protection relay, meters (V, A, kW, kvar, Hz, PF), AVR / governor controls', 'One panel per generator; check relay settings match the coordination study'],
        ['Synchronising panel', 'Synchroscope, double voltmeter / frequency meter, sync lamps, check-synchronising relay, auto-synchroniser', 'Check-sync relay blocks closing outside limits; test manual and auto sync'],
        ['Bus-tie panel', 'Bus-tie breaker and its protection / interlocks', 'Often part of blackout prevention and split-bus logic'],
        ['Feeder panels', 'MCCBs or ACBs to consumers, DBs, transformers', 'Labelling must match the SLD and circuit list'],
        ['Busbars', 'Copper bars carrying the main current, rated for short-circuit forces', 'Bolted joints – torque and thermography are key'],
        ['CTs and VTs', 'Current and voltage transformers feeding meters and relays', 'Never open-circuit a loaded CT secondary – dangerous high voltage'],
        ['Protection relays', 'Overcurrent, short-circuit, reverse power, under / over voltage and frequency, differential (HV)', 'Record settings; test with secondary injection'],
        ['Insulation monitoring (IMD)', 'Continuous insulation resistance monitoring on IT (insulated) systems', 'One per galvanically separate system (440 V, 230 V, etc.)'],
        ['Preferential trip', 'Sheds non-essential loads in stages on generator overload', 'Typical stages: galley / HVAC first, then other non-essentials'],
        ['Group starter panels / MCC', 'Starters for pumps, fans, compressors grouped by system', 'Often fed from both bus sections for duplicated services'],
        ['Shore connection panel', 'Shore supply breaker, phase sequence and voltage indication', 'Interlocked with generator breakers'],
        ['PMS interface', 'Auto start / stop, load sharing, blackout recovery, heavy-consumer start requests', 'Signals hard-wired and / or via network']]) +
      H('Construction points') + L([
        'Switchboards are normally <b>dead-front</b>, with segregated compartments for breakers, busbars and cable terminations (form of separation per design).',
        'Drip-proof enclosure (e.g. IP22 or better in machinery spaces), insulating mats in front and behind, handrails on the front.',
        'HV and large LV boards are often <b>arc-resistant / internal-arc tested</b> with pressure relief flaps or ducts.',
        'Main and emergency switchboards are in <b>separate spaces</b> so a fire or flood in one does not affect the other.']) + NOTE
    ],
    ['breakers', '🔀', 'Breakers, racking & interlocks', () =>
      TB(['Type', 'Typical use', 'Key features'], [
        ['ACB (air circuit breaker)', 'LV generator, bus-tie and large feeder breakers (e.g. 800–6300 A)', 'Spring-charged mechanism, closing coil, shunt trip, undervoltage release, electronic trip unit (L-S-I-G), withdrawable'],
        ['MCCB (moulded case CB)', 'LV feeders and distribution (e.g. 16–1600 A)', 'Thermal-magnetic or electronic trip, fixed or plug-in, motor operator optional'],
        ['MCB', 'Final circuits on 230 V / control supplies', 'Fixed characteristic (B, C, D curves)'],
        ['VCB (vacuum circuit breaker)', 'HV generator, bus-tie, transformer and feeder breakers', 'Vacuum interrupters, tripped by external relay via shunt trip, withdrawable truck'],
        ['Vacuum contactor + fuse', 'HV motor starters', 'Frequent switching; HRC fuses give short-circuit protection']]) +
      H('Racking (withdrawable breakers)') + L([
        'Positions: <b>Connected / Service</b>, <b>Test</b> (main contacts out, control circuit connected), <b>Disconnected / Isolated</b>, and removed.',
        'Breaker must be <b>open</b> before racking – the mechanism is interlocked; never force it.',
        'Rack only with the correct handle, door closed where designed (arc-resistant boards), and wearing the PPE required by the risk assessment.',
        'In the isolated position, <b>shutters</b> cover the busbar spouts – padlock the shutters and the breaker for isolation.',
        'Use the Test position to function-test closing / tripping without energising the feeder.']) +
      H('Typical interlocks') + L([
        '<b>Synchronising interlock</b>: generator breaker closes onto a live bus only when check-sync permits (or onto a dead bus via dead-bus logic).',
        '<b>Shore / generator interlock</b>: shore breaker cannot close in parallel with ship generators (unless designed for short-time parallel transfer).',
        '<b>MSB / ESB interlock</b>: emergency generator breaker and interconnector breaker cannot both be closed in a way that parallels the emergency generator with the main plant (except where designed for test / transfer).',
        '<b>Undervoltage release</b>: breaker trips on bus voltage loss and cannot be closed without voltage (generator breakers, some feeders).',
        '<b>Mechanical / key interlocks</b> (e.g. Castell) between earthing switches and breakers on HV boards.',
        'Never bypass an interlock to “get the ship going” – document and repair the cause.']) + NOTE
    ],
    ['esb', '🚨', 'ESB, emergency generator & changeover', () =>
      H('Normal and emergency supply') + L([
        'In normal service the ESB is fed from the MSB through the <b>interconnector (tie) breaker</b>.',
        'On loss of MSB voltage (blackout), the emergency generator <b>starts automatically</b>, and the ESB is supplied by it. SOLAS requires the emergency generator to start automatically and be connected to the ESB <b>within 45 s</b> (passenger and cargo ships).',
        'The interconnector breaker is opened (typically by undervoltage release / logic) before the emergency generator breaker closes – the emergency generator must not feed back to the dead MSB.',
        'When main power returns, the ESB is transferred back to the MSB: typically emergency generator breaker opens, short dead time, interconnector closes; the emergency generator runs on cool-down and stops (auto mode).',
        'Some ships allow the emergency generator to feed the MSB in a dead-ship start (“back-feed” for black start) – only where designed and by procedure.']) +
      H('Transitional source of emergency power') + L([
        'Where required by SOLAS (e.g. passenger ships, and cargo ships where the emergency generator does not start fast enough), a <b>transitional battery / UPS source</b> supplies essential loads – emergency lighting, navigation lights, internal communications, alarms, fire detection – until the emergency generator takes over.',
        'Typical autonomy requirement is around 30 minutes for the transitional source – check SOLAS and class for your ship type.',
        'Separate <b>24 V DC</b> battery systems also supply GMDSS, alarms and control – these are not the same as the transitional source.']) +
      H('Typical emergency loads') + TB(['Load', 'Notes'], [
        ['Emergency lighting', 'Escape routes, muster / embarkation stations, machinery spaces, steering gear room, etc.'],
        ['Navigation lights and signals', 'Including NUC lights and daylight signalling'],
        ['Radio / GMDSS, nav equipment', 'As required by SOLAS'],
        ['Fire detection and alarm, general alarm, PA', 'Fire and safety systems'],
        ['Emergency fire pump', 'Often fed from ESB'],
        ['Steering gear (one unit)', 'Where required'],
        ['Watertight doors, sprinkler pump (passenger ships)', 'Ship-type dependent'],
        ['Emergency air compressor, starting systems', 'For dead-ship start']]) +
      H('Emergency generator') + L([
        'Located above the uppermost continuous deck, outside machinery spaces, with its own fuel tank, starting means (battery + second means, e.g. hydraulic / air / spring), and ventilation.',
        'Starting arrangements typically allow repeated starts (e.g. at least three starts from each means) and starting at 0 °C – check class.',
        'Must be kept in <b>AUTO</b> at all times at sea; leaving it in MANUAL defeats blackout protection.']) + NOTE
    ],
    ['dist', '🔋', 'Distribution, transformers & control supplies', () =>
      TB(['System', 'Typical voltage', 'Fed from / notes'], [
        ['Main power', '440 V 3-ph 60 Hz (or 690 V / HV)', 'MSB; motors and large consumers'],
        ['Lighting & small power', '230 V (or 220 V / 110 V) 1-ph or 3-ph', '440/230 V transformers (often duplicated, one per section)'],
        ['Galley / accommodation', '440 V or 230 V', 'Separate DBs, often on preferential trip'],
        ['HV to LV', '6.6 kV / 440 V or 690 V', 'Main transformers, dry-type (cast resin) typical; feed LV switchboards'],
        ['Propulsion transformers', 'HV to drive voltage, often phase-shifting (12/24-pulse)', 'Harmonic mitigation'],
        ['Emergency lighting / services', '230 V', 'ESB transformers'],
        ['Control and alarm', '24 V DC', 'Battery-backed chargers / UPS; often dual supplies with diode decoupling'],
        ['Breaker control', '24 V DC or 110 / 230 V AC / DC', 'Closing coils, shunt trips, spring-charging motors; trip supply must be secure']]) +
      H('Key points') + L([
        'Breaker <b>trip circuits</b> for HV and generator breakers are normally fed from a reliable DC source (battery-backed) so protection works during a blackout or voltage dip.',
        'Losing a switchboard control supply can disable protection, synchronising and PMS – it is an important alarm.',
        'Transformer secondaries create a <b>new separate system</b> – each needs its own insulation monitoring and protection.',
        'Check transformer temperatures (winding sensors / PT100s) and ventilation fans.',
        'Shore-supply and 50/60 Hz differences affect transformers and motors – see shore connection.']) + NOTE
    ],
    ['prot', '🛡️', 'Protection, selectivity & IT earthing', () =>
      H('Typical protection functions') + TB(['Function', 'Purpose', 'Typical setting idea'], [
        ['Overcurrent (long-time)', 'Overload of generator / cable', 'Around 110–125 % generator rating with time delay; coordinated with preferential trip'],
        ['Short-time / short-circuit', 'Fault clearance with selectivity', 'Time-graded so the breaker nearest the fault trips first'],
        ['Instantaneous', 'Very high faults', 'Often disabled on generator breakers for selectivity'],
        ['Reverse power', 'Prevents a generator motoring', 'Typical 8–15 % for diesel, a few seconds delay'],
        ['Under / over voltage and frequency', 'Abnormal AVR / governor operation', 'Per maker / class'],
        ['Differential (87)', 'Internal faults in HV generators / transformers', 'Fast, no grading needed'],
        ['Earth fault (HV)', 'Earth faults on HV systems (often resistance-earthed)', 'Alarm or trip per design'],
        ['Preferential trip', 'Shed non-essential load before generator trips', 'Staged, typical 5–10 s steps']]) +
      H('Selectivity (discrimination)') + L([
        'Only the breaker closest to a fault should trip, keeping the rest of the system and the generators online.',
        'Achieved by <b>time grading</b>, current grading, energy-based selectivity or zone-selective interlocking (ZSI).',
        'Settings come from the <b>protection coordination / short-circuit study</b> – do not change them without approval and documentation.',
        `See ${A('protection.html', 'Short-circuit &amp; Protection')} for calculations.`]) +
      H('IT earthing (insulated system) & IMD') + L([
        'Most ship LV systems are <b>insulated neutral (IT)</b>: a single earth fault does not trip the circuit, so essential services keep running.',
        'An <b>insulation monitoring device (IMD)</b> / earth lamps alarm on low insulation (typical alarm set points in the range of tens to hundreds of kΩ depending on system and maker).',
        'A second earth fault on another phase becomes a phase-to-phase short circuit – so locate and clear the first fault quickly.',
        'HV systems are often <b>high-resistance earthed</b> through a neutral resistor, with earth-fault alarm or selective trip.',
        `See ${A('insulation.html', 'Earthing &amp; Insulation')} for fault-finding.`]) +
      H('Arc flash & arc-resistant design') + L([
        'An internal arc releases intense heat, pressure and toxic gases. Arc-resistant boards direct this through relief flaps / ducts – only with doors closed and covers fitted.',
        'Arc-flash detection relays (light + current) trip the upstream breaker in milliseconds on many modern boards.',
        'Arc energy depends on fault level and clearing time – maintenance (e.g. “maintenance mode” faster trip settings) reduces risk during live work.',
        'Wear arc-rated PPE as defined by the risk assessment for switching and testing.']) + NOTE
    ],
    ['shore', '⚓', 'Shore connection', () =>
      L([
        'Check before connecting: <b>voltage, frequency, phase sequence</b> (phase rotation indicator on the shore panel) and system earthing (shore may be TN – earthed neutral – while the ship is IT).',
        'Cable size and length suitable for the load; inspect cables and plugs; earth / bonding conductor connected first and removed last.',
        'Shore breaker is <b>interlocked</b> with the generator breakers: typically the ship goes dead (short blackout) before shore power is closed, unless a load-transfer / sync system is fitted.',
        '50 Hz shore on a 60 Hz ship: motors run about 17 % slower; voltage must be reduced proportionally (V/f) to avoid over-fluxing transformers and motors – follow the ship’s instructions.',
        'Monitor shore supply current to stay within cable and breaker rating; inform the shore side of the maximum load.',
        'IMD readings may change when connected to an earthed shore system – follow the maker / ship procedure.',
        '<b>High-voltage shore connection (HVSC / cold ironing)</b> (e.g. 6.6 / 11 kV) uses dedicated equipment, earthing switches, interlocks and procedures per IEC/IEEE 80005-1 – HV authorised persons only.']) +
      H('Typical changeover sequence (ship to shore)') + TB(['Step', 'Action'], [
        ['1', 'Connect and check shore cable, earth, phase sequence and voltage / frequency at the shore panel'],
        ['2', 'Reduce load; inform all departments of the short blackout'],
        ['3', 'Open generator breakers (or follow transfer procedure); ESB may start emergency generator unless inhibited per procedure'],
        ['4', 'Close shore breaker; restart essential consumers sequentially'],
        ['5', 'Stop generators after cool-down; keep monitoring shore current and insulation']]) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>single-line diagram</b> by heart: which generator, section, breaker and DB feeds each essential consumer.',
        'Normal and abnormal <b>bus configurations</b> (bus-ties open / closed) and what changes for blackout prevention.',
        'Generator protection relay functions and settings, and where the setting records are kept.',
        'Manual synchronising: slow clockwise rotation, close just before 12 o’clock; voltage and frequency matched; check-sync permissive.',
        'ESB <b>changeover logic</b>: which breakers open / close, timers, and how to restore normal supply.',
        'Emergency generator in AUTO; battery and starting systems healthy.',
        'Racking and isolating breakers safely, using shutters, padlocks and permit-to-work.',
        'IMD alarms: how to locate an earth fault by switching off feeders (only with permission).',
        'Preferential trip stages and which consumers are shed first.',
        'Control supplies (24 V DC / 110 / 230 V) for breaker closing, tripping and PMS – and what happens if they fail.',
        'HV switching basics: switching programme, authorised person, earthing switches, prove dead, PPE – see ' + A('safety.html', 'Electrical Safety &amp; Isolation') + '.',
        'Shore connection procedure and the risks of 50 / 60 Hz and earthing differences.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Switchboard round: meters, alarms, IMD readings, unusual noise / smell / heat, breaker status, emergency generator in AUTO'],
        ['Weekly', 'Emergency generator start and run test (no-load or per procedure), battery and charger check, lamp test'],
        ['Monthly', 'ESB auto-start / changeover test (blackout simulation of ESB supply) as planned, IMD test button, preferential trip function check, emergency lighting check'],
        ['3–6 monthly', 'Clean switchboard interior when safe (de-energised sections), check door seals, mats, handrails; transitional battery / UPS test'],
        ['Yearly', 'Thermography of busbars, cable terminations and breakers under load; emergency generator on-load test; protection relay check with secondary injection'],
        ['Yearly / dry dock', 'Busbar and connection torque check (de-energised), insulation resistance test of busbars and feeders, ACB / VCB service (contacts, arc chutes, mechanism lubrication, trip unit test)'],
        ['Per class (e.g. 5-yearly)', 'Full breaker overhaul / primary injection tests, HV switchgear maintenance by specialists, class survey of switchboards'],
        ['After any fault trip', 'Inspect breaker and contacts, check cause, record, reset protection only after cause is known']]) +
      L([
        '<b>Thermography</b> must be done with the board loaded (typical ≥ 40 % load) – compare similar phases; a temperature difference of a few kelvin above similar joints needs attention.',
        'Record relay settings and test results – class surveyors and PSC may ask for them.',
        'Count operations on breakers and vacuum interrupters against maker limits.',
        'Plan switchboard maintenance with the chief engineer; dead-bus work needs alternative power and permit-to-work.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Breaker will not close', 'Spring not charged, undervoltage release not energised, interlock active, check-sync not permitting, trip still latched, control supply lost', 'Check spring indicator, UV release supply, interlock status, reset trip unit, control fuses / MCB'],
        ['Breaker closes then trips immediately', 'Fault on feeder, wrong sync, UV release dropping, anti-pumping, protection active', 'Do not re-close repeatedly; check relay / trip unit flags, IR test feeder'],
        ['Nuisance tripping of feeder', 'Settings too low, motor starting current, harmonics, loose connection, ageing trip unit', 'Compare load with settings, check trip log, thermography, test trip unit'],
        ['Generator breaker trips on reverse power', 'Governor fault, fuel problem, poor load sharing, unloading too fast', 'Check governor and load sharing, fuel system, relay setting'],
        ['Earth fault alarm (IMD low)', 'Damp equipment, damaged cable, water in junction box, motor winding fault', 'Note reading, locate by switching off feeders with permission, IR test the suspect circuit'],
        ['Synchronising fails / auto-sync times out', 'Governor not responding, voltage mismatch, check-sync relay setting, VT fuse blown', 'Check incoming V and Hz, governor raise / lower response, VT fuses, sync relay'],
        ['ESB not taking load after blackout', 'Emergency generator in MANUAL, start failure, battery low, breaker not closing, interconnector not opened', 'Check mode switch, start battery / second means, breaker and interlock logic, alarms'],
        ['ESB does not return to MSB supply', 'Interconnector interlock, MSB voltage not sensed, timer setting, emergency breaker not opening', 'Check voltage sensing relays, transfer logic, breaker status'],
        ['Hot spot on thermography', 'Loose bolted joint, corroded contact, overloaded conductor, poor breaker contact', 'Plan de-energised inspection, clean and re-torque to maker values, check load'],
        ['Preferential trip operated', 'Generator overload, generator lost', 'Check online generators and load; restart shed consumers only when power is available'],
        ['Meter / relay shows wrong values', 'CT / VT fault, VT fuse blown, wiring error', 'Compare with other meters; check VT fuses; never open a loaded CT circuit'],
        ['Switchboard control supply failure alarm', 'Charger / battery fault, blown fuse, earth fault on DC', 'Restore supply quickly – protection and closing may be lost; check charger, battery and DC IMD']]) + NOTE
    ],
    ['safety', '⚠️', 'Safety & lessons', () =>
      H('Safety rules') + L([
        'Work on switchboards only under <b>permit-to-work</b> and lock-out / tag-out; prove dead with an approved tester (test the tester before and after).',
        'Busbars may still be live with a feeder breaker open – the incoming side remains energised; also watch for back-feeds (shore, ESB, generator, UPS, capacitors).',
        'HV work: switching programme, authorised person, earthing switches / portable earths applied, safety documents – see ' + A('safety.html', 'Electrical Safety &amp; Isolation') + '.',
        'Keep switchboard doors and covers closed during switching on arc-resistant boards; stand to the side when operating breakers.',
        'Rubber mats, handrails, clear access and no stored items in switchboard rooms.',
        'Never short-circuit or open-circuit instrument transformer secondaries incorrectly: <b>VT – do not short</b>, <b>CT – do not open</b>.']) +
      H('Lessons learned') + L([
        'Many blackouts are caused by protection and switchboard faults – loose connections, failed trip units, wrong settings.',
        'Emergency generators left in MANUAL or with flat batteries have turned blackouts into serious incidents.',
        'Undetected earth faults lead to a second fault and a large trip – act on IMD alarms quickly.',
        'Arc-flash injuries often happen during racking, testing or “quick checks” with covers open – plan and use PPE.',
        'Temporary jumpers or bypassed interlocks forgotten after maintenance cause later failures – remove and record them.',
        'Test ESB changeover regularly under realistic conditions – hidden failures are found only by testing.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'MSB & ESB (Guide)', icon: '🔌', accent: '#475569',
    subtitle: 'Main and emergency switchboards for the ETO – single-line overview, components, breakers and racking, ESB changeover, distribution and control supplies, protection and IT earthing, shore connection, maintenance, troubleshooting and safety.',
    refs: ['SOLAS II-1 Part D', 'IEC 60092-301 / 302 / 503', 'IEC/IEEE 80005-1', 'Class rules'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
