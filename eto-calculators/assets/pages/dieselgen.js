(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values shown are typical. The engine and alternator maker’s manuals, the PMS / switchboard documentation, SOLAS and class rules always govern.</p>';

  const S = [
    ['overview', '🛢️', 'Overview', () =>
      `<p>A <b>diesel generator set (DG / genset)</b> is a diesel engine coupled to a synchronous alternator, with its own control panel and protection, feeding the main switchboard (MSB). Most ships have two to four main DGs running in parallel under a <b>Power Management System (PMS)</b>, plus an <b>emergency generator</b> feeding the emergency switchboard (ESB).</p>` +
      H('Why it matters to the ETO') + L([
        'The DGs are the heart of the ship’s electrical plant – a fault in a governor, AVR or protection relay can cause a <b>blackout</b>.',
        'The engine side is normally the engineers’ responsibility, but the <b>governor, actuator, speed pickups, ECU, sensors, safety system, alternator, AVR, panel and protection</b> are typically the ETO’s.',
        'Parallel operation, load sharing and PMS automation join mechanical and electrical behaviour – the ETO must understand both.']) +
      H('Typical ratings') + TB(['Item', 'Typical values'], [
        ['Main DG output', 'Approx. 500 kW to 4 MW per set on merchant ships; larger on cruise / offshore diesel-electric'],
        ['Voltage / frequency', '440 V or 690 V LV; 3.3 kV, 6.6 kV or 11 kV HV; 60 Hz (most ships) or 50 Hz'],
        ['Speed', 'Medium-speed 720 / 900 rpm (60 Hz) or high-speed 1800 rpm (60 Hz); 750 / 1000 / 1500 rpm at 50 Hz'],
        ['Power factor rating', 'Alternator rated at 0.8 pf lagging (kVA = kW / 0.8)'],
        ['Emergency generator', 'Typically 100–500 kW, high-speed, radiator-cooled, own fuel tank']]) +
      `<p>Related pages: ${A('generator.html', 'Generator calculations')}, ${A('plant.html', 'Power Plant &amp; Load Balance')}, ${A('pmssim.html', 'PMS / blackout simulator')}, ${A('switchboards.html', 'MSB &amp; ESB guide')}.</p>` + NOTE
    ],
    ['structure', '🏗️', 'Genset structure', () =>
      TB(['Part', 'Main components', 'ETO interest'], [
        ['Diesel engine', 'Block, crankshaft, fuel injection, turbocharger, LO and cooling systems, starting system', 'Sensors, actuators, starting circuits, safety system, ECU'],
        ['Alternator', 'Stator, rotor (field), exciter, rotating diodes, AVR, PMG (if fitted), bearings, space heaters, RTDs', 'Electrical heart: insulation, excitation, voltage control, temperatures'],
        ['Coupling', 'Flexible (rubber element) coupling or rigid flange for single-bearing alternators', 'Alignment, vibration, torsional behaviour'],
        ['Base frame', 'Common base frame on resilient mounts (anti-vibration)', 'Flexible connections for cables, earth bonding strap across mounts'],
        ['Local control panel', 'Start / stop, local / remote, speed and voltage indication, alarms, emergency stop', 'Wiring, sensors, switch positions, panel PLC'],
        ['Generator panel in MSB', 'ACB (air circuit breaker), protection relay, synchroscope / auto-synchroniser, load-sharing unit, metering, CTs and VTs', 'Protection settings, breaker maintenance, sync and sharing']]) +
      H('Typical layout notes') + L([
        '<b>Two-bearing</b> alternators have their own bearings and a flexible coupling; <b>single-bearing</b> alternators are bolted to the flywheel via flex plates and rely on the engine main bearing at the drive end.',
        'Engine and alternator are aligned on the common base frame; the whole set sits on resilient mounts – cables and pipes must have flexible sections.',
        'The <b>genset controller</b> (e.g. a multi-function unit) may combine engine start / stop logic, protection, synchronising and load sharing in one device.',
        'Power cables leave the alternator terminal box to the MSB generator section; CTs for differential protection may be at both the star point and the line side.']) + NOTE
    ],
    ['engine', '⚙️', 'Engine control, governor & safeties', () =>
      H('Starting systems') + L([
        '<b>Starting air</b> (medium-speed engines): air at typically 25–30 bar from receivers; start air valve (solenoid-piloted) admits air to the air-start motor or directly to the cylinders. Check solenoid, pilot valve, receiver pressure and the turning-gear interlock.',
        '<b>Electric start</b> (high-speed engines, emergency DG): 24 V DC starter motor(s) from dedicated batteries; check battery voltage, starter relay / solenoid and cable connections.',
        '<b>Hydraulic / spring start</b>: sometimes used as a second start source for emergency generators.',
        'Start sequence (typical): pre-lube OK → start command → crank → firing speed detected → starter cut-out → run-up to rated speed → voltage builds up → “ready to connect”.',
        '<b>Start failure</b>: if firing speed is not reached within a set time (typically 5–10 s), the attempt is stopped; typically up to 3 attempts, then “start failure” alarm.']) +
      H('Governor') + TB(['Type', 'Description'], [
        ['Mechanical-hydraulic', 'Flyweights sense speed, hydraulic servo moves the fuel rack; speed set by a synchronising motor; droop set mechanically'],
        ['Electronic + actuator', 'Electronic controller reads magnetic pickups, drives an electric or electro-hydraulic actuator on the fuel rack; droop / isochronous selectable'],
        ['Engine ECU (common rail)', 'Engine control unit controls injection directly; speed and load-sharing commands via analogue signal or bus']]) +
      L([
        '<b>Speed pickup (MPU)</b>: magnetic sensor on the flywheel teeth; air gap typically 0.5–1 mm. Loss of the pickup signal stops the electronic governor – usually two pickups are fitted.',
        '<b>Actuator</b>: converts the governor signal to fuel rack position; check linkage freedom, signal (e.g. 4–20 mA or PWM) and the hydraulic oil level on electro-hydraulic types.',
        '<b>Raise / lower</b> speed signals come from the synchroniser, load-sharing unit or PMS.']) +
      H('Safety shutdowns and alarms (typical)') + TB(['Function', 'Typical action'], [
        ['Overspeed', 'Shutdown at typically 110–115 % rated speed – independent mechanical or electronic overspeed trip'],
        ['Low lube oil pressure', 'Alarm at first level, shutdown at lower level'],
        ['High jacket cooling water (JCW) temperature', 'Alarm, then shutdown or load reduction (maker-dependent)'],
        ['Start failure', 'Alarm; PMS starts next standby generator'],
        ['High exhaust gas temperature / deviation', 'Alarm (load reduction on some engines)'],
        ['Low fuel pressure, high LO temperature, oil mist (larger engines)', 'Alarm; oil mist typically shutdown'],
        ['Emergency stop', 'Immediate shutdown (fuel cut-off, stop solenoid)']]) +
      L([
        'Safety system is <b>separate from the alarm system</b> and normally works independently of the governor / control system.',
        '<b>Shutdown override</b> exists on some installations (e.g. emergency generator or DP) – only selected shutdowns (overspeed always remains active).',
        '<b>Pre-lubrication</b>: pre-lube pump runs continuously or intermittently on standby engines so bearings are oiled before a start.',
        '<b>Preheating</b>: jacket water heater keeps standby engines warm (typically 40–60 °C) for quick, low-wear starts and to allow fast loading.']) + NOTE
    ],
    ['alternator', '🔌', 'Alternator, excitation & AVR', () =>
      H('Brushless alternator – how it works') + L([
        'The <b>main field</b> is on the rotor; the <b>main stator</b> carries the three-phase output windings.',
        'The <b>exciter</b> is a small inverted alternator: field on the stator, armature on the rotor. Its AC output is rectified by the <b>rotating diode bridge</b> on the shaft and feeds the main field – no brushes or slip rings.',
        'A <b>varistor (surge suppressor)</b> across the rotating bridge protects the diodes from voltage spikes.',
        'The <b>AVR</b> measures output voltage and controls the DC current into the exciter field to keep the voltage constant.']) +
      H('Excitation power sources') + TB(['System', 'Description', 'Notes'], [
        ['Self-excited (shunt)', 'AVR powered from the main output terminals', 'Relies on residual magnetism to build up; voltage collapses during a short circuit'],
        ['PMG (permanent magnet generator)', 'Small PMG on the shaft powers the AVR independently', 'Reliable build-up and sustained short-circuit current for selective tripping'],
        ['Auxiliary winding / compound', 'Extra stator winding or CT compounding supports excitation under load', 'Maker-specific']]) +
      H('Other alternator parts') + L([
        '<b>Windings</b>: Class F or H insulation, typically used to Class F or B temperature rise. Star-connected; neutral may be insulated (IT) or earthed via resistor (HV).',
        '<b>Bearings</b>: rolling or sleeve bearings; the non-drive-end bearing is often <b>insulated</b> to stop shaft currents – do not bridge the insulation.',
        '<b>Space heaters</b>: switched on automatically when the breaker is open / set is stopped, to prevent condensation in the windings.',
        '<b>RTDs (PT100)</b>: in stator windings (typically two per phase) and bearings for temperature alarms.',
        '<b>AVR settings</b>: voltage set-point, stability (gain), droop / quadrature-droop for kVAr sharing, under-frequency roll-off (V/Hz), over-excitation limit.',
        '<b>Residual magnetism</b>: if lost, a self-excited alternator will not build up voltage – field flashing with a DC source (per maker) restores it.']) + NOTE
    ],
    ['sync', '🔄', 'Synchronising, load sharing & PMS', () =>
      H('Synchronising conditions') + TB(['Condition', 'Typical limit before closing'], [
        ['Voltage difference', 'Within approx. ±5 % of bus voltage'],
        ['Frequency difference (slip)', 'Incoming slightly faster, typically 0.1–0.2 Hz'],
        ['Phase angle', 'Within approx. ±10° – breaker closed just before 12 o’clock on the synchroscope'],
        ['Phase sequence', 'Must be identical – checked at commissioning and after any cable work']]) +
      L([
        'Auto-synchroniser adjusts speed (governor) and voltage (AVR) and closes the breaker; a <b>check-synchronising relay</b> blocks closing outside limits.',
        'Manual synchronising: synchroscope and sync lamps; never close when the pointer moves fast or with large voltage difference.',
        '<b>Dead-bus closing</b>: closing onto a dead bar is allowed only with a dead-bus confirmation (blackout).']) +
      H('Active power (kW) sharing') + L([
        'Active power is set by the <b>fuel</b> (governor). kW sharing is achieved with <b>speed droop</b> (typically 3–5 %) or with an <b>isochronous load-sharing</b> line between governors / controllers.',
        'Droop: frequency drops as load rises; sets with equal droop share in proportion to rating. PMS or the operator trims frequency back to nominal.',
        'Isochronous: frequency stays constant; controllers communicate (analogue line or bus) to share load equally.']) +
      H('Reactive power (kVAr) sharing') + L([
        'Reactive power is set by <b>excitation</b> (AVR). Sharing via <b>voltage droop / quadrature droop</b> (a CT signal into the AVR) or a cross-current (reactive differential) connection.',
        'Unequal kVAr sharing shows as different currents and power factors at the same kW – check AVR droop settings and the droop CT (polarity, phase, burden).']) +
      H('PMS functions') + TB(['Function', 'Description'], [
        ['Load-dependent start', 'Starts the next standby DG when load exceeds a level (typically 80–90 %) for a set time'],
        ['Load-dependent stop', 'Stops a DG when remaining sets can carry the load below a level (typically 50–60 %) after a delay'],
        ['Standby selection', 'Operator sets start priority; next set takes over automatically on a fault'],
        ['Blackout start', 'On bus failure, starts standby DG(s), closes the first breaker onto the dead bus, then reconnects consumers sequentially'],
        ['Heavy consumer start', 'Requests are held until enough spare power is online'],
        ['Preferential trip', 'Non-essential loads tripped on generator overload (typically in 2–3 stages)'],
        ['Frequency / load control', 'Keeps frequency at nominal and balances kW between sets']]) + NOTE
    ],
    ['protect', '🛡️', 'Protection & alarms', () =>
      TB(['Protection', 'ANSI', 'Typical setting', 'Purpose'], [
        ['Reverse power', '32', 'Approx. 8–15 % rated kW (diesel), 3–10 s', 'Stops the set motoring when its engine fails or fuel is lost'],
        ['Overcurrent (time-delayed)', '51', 'Approx. 110–125 % In, delay coordinated with preferential trip', 'Thermal overload protection'],
        ['Short circuit (instantaneous / short-time)', '50', 'Approx. 2.5–4 × In with short delay for selectivity', 'Clears faults; must be selective with feeder breakers'],
        ['Under-voltage', '27', 'Approx. 70–85 % Un with delay', 'Loss of excitation, prevent closing onto a dead or low bus'],
        ['Over-voltage', '59', 'Approx. 110–120 % Un with delay', 'AVR failure'],
        ['Under / over frequency', '81', 'Approx. ±5–10 % with delay', 'Governor fault, overload'],
        ['Loss of excitation / reverse reactive power', '40 / 32Q', 'Maker / study dependent', 'Excitation failure – set absorbs kVAr from others'],
        ['Differential', '87G', 'Approx. 5–20 % In (HV gensets)', 'Internal winding faults; fast trip'],
        ['Earth fault', '51N / 64', 'Per system earthing (HV resistor-earthed)', 'Stator earth faults; LV IT systems use insulation monitoring alarm'],
        ['Negative sequence / unbalance', '46', 'Maker dependent', 'Rotor heating from unbalanced loads']]) +
      L([
        'Trips may open only the <b>generator breaker</b> or also <b>shut down the engine</b> and de-excite the alternator (e.g. differential).',
        'Settings come from the <b>protection coordination / discrimination study</b> – do not change them without approval and records.',
        'Typical genset alarms: winding and bearing high temperature (RTDs), diode failure (if monitored), AVR fault, breaker trip, sync failure, PMS communication failure.',
        'Large consumer starting must not cause under-voltage tripping – check voltage dip on big motor starts.']) + NOTE
    ],
    ['emergency', '🚨', 'Emergency generator', () =>
      H('Key requirements (SOLAS II-1, typical)') + L([
        'Located <b>above the uppermost continuous deck</b>, outside the machinery spaces, with independent fuel, cooling (usually radiator) and ventilation.',
        '<b>Automatic start</b> and automatic connection to the emergency switchboard on loss of main power – within <b>45 seconds</b>; otherwise a transitional source of emergency power (batteries / UPS) is required.',
        'Able to start from cold, typically down to <b>0 °C</b> – preheater, suitable fuel and lube oil.',
        '<b>Two independent starting sources</b> (typically): stored energy for at least three consecutive starts plus a second source for three further starts within 30 min, unless manual starting is shown effective.',
        'Supply duration typically <b>18 h for cargo ships</b> and <b>36 h for passenger ships</b> for the listed emergency services.',
        'Normally only short-term parallel operation with the main supply is allowed for testing / load transfer (per class rules and design).',
        'Emergency switchboard normally fed from the MSB via an interconnector; the interconnector opens automatically when the emergency generator connects.']) +
      H('Testing (typical)') + TB(['Interval', 'Test'], [
        ['Weekly', 'Start and run, check starting batteries / air, fuel level, alarms, heaters'],
        ['Monthly', 'Run on load (via test procedure or load transfer), check voltage, frequency, temperatures'],
        ['Periodically / survey', 'Simulated blackout test: auto start and connect within 45 s; check both start sources; record results']]) +
      L([
        'Keep the set in <b>AUTO</b> after any test or maintenance – a set left in manual is a common audit / PSC finding.',
        'Check day tank level, fuel valve open, radiator coolant, louvres / ventilation dampers open in auto.',
        'Starting batteries: charger function, electrolyte / voltage, terminals tight and greased.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>single-line diagram</b>: which generator feeds which bus section, bus-tie breakers, shore connection, emergency interconnector.',
        'Each genset’s <b>start / stop and safety logic</b>: which signals stop the engine, which only alarm, which can be overridden.',
        '<b>Governor and AVR types</b> and settings: droop or isochronous, gain, droop CTs, load-sharing lines.',
        '<b>Protection relay settings</b> and where the coordination study is kept.',
        'How the <b>PMS</b> decides to start, stop, sync and shed load; how to run in manual / semi-auto if the PMS fails.',
        'How to <b>synchronise manually</b> and close a breaker safely onto a dead bus during a blackout.',
        'How to restore <b>residual magnetism</b> (field flashing) and test rotating diodes per maker.',
        'Emergency generator requirements, start sources and test procedure.',
        'Safe isolation: breaker racked out / locked, engine blocked from start (start air shut / battery isolated, control in local), space heater supply isolated before entering the terminal box.',
        'Spare parts on board: AVR, diodes / diode bridge, varistor, speed pickup, actuator, relay cards.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Check running sets: kW, kVAr, current balance, voltage, frequency, winding and bearing temperatures, alarms; standby sets in AUTO, preheat and pre-lube running'],
        ['Weekly', 'Emergency generator test run; check standby DG space heaters and preheaters; starting battery checks'],
        ['Monthly', 'Emergency generator on-load test; check panel indication lamps and meters; clean filters on alternator air intake'],
        ['3-monthly', 'Insulation resistance (IR) of stator windings when stopped (with AVR / electronics disconnected); speed pickup and actuator linkage check; terminal tightness visual'],
        ['6-monthly', 'AVR check: voltage set-point, stability, droop; rotating diode and varistor test (per maker); governor response check'],
        ['Yearly', 'Protection relay tests (secondary injection), breaker maintenance and trip tests, load test with load bank or ship load, alignment / vibration check, thermography of connections'],
        ['Survey / major overhaul', 'Full protection test, PI test on HV windings, cleaning and varnishing of windings as needed, bearing renewal per hours, alignment after engine overhaul']]) +
      L([
        'Record IR values corrected to a reference temperature and trend them – a falling trend is more important than a single value.',
        'Typical IR minimum for LV machines is around 1 MΩ, but healthy windings show much higher values; follow the maker and class.',
        'Test the safety shutdowns (overspeed, low LO pressure, high JCW temperature) as per the planned maintenance system.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['No voltage build-up', 'Loss of residual magnetism, failed AVR, open exciter field, failed rotating diodes, speed too low, AVR fuse', 'Check speed, AVR supply and fuses, exciter field resistance, diodes; field flash per maker'],
        ['Voltage high or unstable', 'AVR sensing lost, AVR fault, wrong stability setting, loose connection', 'Check sensing fuses / wiring, AVR settings, terminals; replace AVR if faulty'],
        ['Speed / frequency hunting', 'Governor gain too high, sticking fuel linkage, actuator fault, air in hydraulic governor, faulty speed pickup', 'Check linkage freedom, actuator signal, pickup gap and signal, governor settings'],
        ['Will not share kW', 'Different droop settings, load-sharing line fault, governor fault, engine fuel limitation', 'Compare droop / mode settings, load-sharing signals, engine condition'],
        ['Will not share kVAr', 'Wrong AVR droop setting, droop CT fault or wrong polarity, AVR fault', 'Check droop CT wiring and burden, AVR droop setting, cross-current circuit'],
        ['Reverse power trip', 'Fuel starvation, governor / actuator fault, engine fault, unloading with poor sharing, wrong set-point', 'Check fuel supply and filters, actuator, governor settings, load sharing'],
        ['Fails to start', 'Low start air or battery, start solenoid, turning gear engaged, shutdown not reset, fuel not available, pickup fault', 'Check start source, interlocks, reset, fuel, speed signal, local / remote selection'],
        ['Starts then stops', 'Shutdown active (LO pressure, overspeed), speed pickup fault, fuel limitation', 'Read alarm / shutdown log, check sensors and their wiring'],
        ['Will not synchronise', 'Auto-synchroniser fault, raise / lower signals not working, voltage difference too large, check-sync relay', 'Check sync unit, governor and AVR remote adjust, VT fuses, try manual sync'],
        ['Breaker will not close', 'Spring not charged, undervoltage coil not energised, interlock, check-sync block, trip not reset', 'Check spring motor, UV release supply, interlocks, protection reset'],
        ['Alternator overheating', 'Overload, unbalanced load, blocked air filters / cooler, fan damage, high ambient', 'Check load and current balance, filters, cooler water, RTDs'],
        ['High vibration', 'Misalignment, coupling damage, loose mounts, unbalanced rotor, misfiring cylinder', 'Measure vibration, check coupling elements, mounts, alignment, engine combustion'],
        ['Bearing temperature high', 'Lubrication, bearing wear, shaft currents (insulation bridged), misalignment', 'Check oil / grease, bearing insulation, alignment']]) + NOTE
    ],
    ['safety', '📚', 'Safety & lessons', () =>
      H('Safe working') + L([
        'Before working on an alternator or its panel: breaker open and <b>racked out / locked</b>, engine <b>blocked from starting</b> (control in local / blocked, start air closed and vented, or batteries isolated), PMS standby selection removed, permit to work.',
        'Remember other voltage sources: <b>space heaters</b>, PMG, AVR sensing VTs, CT secondaries (never open-circuit a loaded CT).',
        'A turning alternator with residual magnetism generates voltage – never work on terminals while the engine is turning.',
        'HV gensets: apply earths after proving dead, follow HV safety rules.',
        'Rotating parts and hot surfaces: guards in place, no loose clothing near couplings.']) +
      H('Lessons learned') + L([
        'Many blackouts start with a <b>governor or AVR fault</b> on one set that makes healthy sets trip – good protection settings and sharing checks prevent this.',
        'Standby sets left in manual, shutdowns not reset, or preheating off are frequent causes of failed blackout recovery.',
        'A failed rotating diode may only show as higher exciter current and AVR output – trend AVR output at a given load.',
        'Speed pickup cables and connectors suffer from vibration and oil – inspect and secure them.',
        'After overhaul, check <b>phase sequence</b>, alignment, protection and sharing before handing the set back to service.',
        'Emergency generator tests must be real: start from stopped and cold in AUTO, record time to connect.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Diesel Generators (Guide)', icon: '🛢️', accent: '#ea580c',
    subtitle: 'Main and emergency diesel generator sets from the ETO view – engine control, governor and safeties, alternator, excitation and AVR, synchronising, load sharing and PMS, protection, emergency generator, maintenance, troubleshooting and safety.',
    refs: ['SOLAS II-1 Reg. 42–44', 'IEC 60092-301 / 60092-202', 'IEC 60034-1', 'Class rules (DNV, ABS, LR, BV…)'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
