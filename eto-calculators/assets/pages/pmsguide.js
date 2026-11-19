(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values shown are typical. The PMS maker’s manuals and settings lists, the vessel’s FMEA and operating documents (incl. DP FMEA / ASOG where applicable) and class rules always govern.</p>';

  const S = [
    ['overview', '🧠', 'Overview', () =>
      `<p>The <b>Power Management System (PMS)</b> is the automation that keeps the ship’s electrical plant <b>available, stable and economical</b>. It decides how many generators run, starts and connects them, shares the load between them, protects the plant against overload and blackout, and restores power automatically if a blackout does occur.</p>` +
      H('Main purposes') + L([
        '<b>Availability</b> – always enough online power plus a reserve for the next load step or the loss of one generator.',
        '<b>Blackout prevention</b> – load-dependent start, heavy-consumer control, preferential trip / load shedding, fast load reduction.',
        '<b>Blackout recovery</b> – automatic start of standby sets, dead-bus closing and sequential restart of essential consumers.',
        '<b>Economy</b> – stops surplus generators at low load, keeps running sets in an efficient load range, shares load evenly.',
        '<b>Operator support</b> – one HMI / IAS view of generators, breakers, loads and alarms; fewer manual actions in critical moments.']) +
      H('Where the PMS sits') + TB(['Level', 'Typical equipment', 'Role'], [
        ['Engine / genset', 'Engine control and safety system, governor, AVR', 'Runs the engine at speed and voltage; local protection and shutdowns'],
        ['Generator panel / switchboard', 'Breakers, protection relays, synchroniser, load-sharing unit, metering', 'Connects the set to the bus and protects it'],
        ['PMS', 'PMS controllers / PLCs or integrated genset controllers', 'Plant-level decisions: start / stop, standby, sync, sharing, shedding, blackout recovery'],
        ['IAS / HMI', 'Alarm and monitoring system, operator stations', 'Operator interface, alarms, trends, event log']]) +
      `<p>Related pages: ${A('plant.html', 'Power Plant &amp; Load Balance')}, ${A('pmssim.html', 'PMS / blackout simulator')}, ${A('dieselgen.html', 'Diesel Generators guide')} (governor, AVR, engine side), ${A('switchboards.html', 'MSB &amp; ESB guide')}, ${A('dpsystem.html', 'DP System guide')}.</p>` + NOTE
    ],
    ['arch', '🏗️', 'Architecture', () =>
      TB(['Component', 'Function', 'Redundancy / notes (typical)'], [
        ['PMS controllers / PLCs', 'Plant logic: start / stop, standby, blackout, shedding, bus-tie control', 'One controller per switchboard section on DP / redundant plants; dual CPUs or hot-standby on some designs'],
        ['Genset controllers', 'Per-generator unit: sync, kW / kVAr sharing, generator protection, start / stop sequence, breaker control', 'One per generator, powered from that generator’s redundancy group'],
        ['Switchboard I/O', 'Breaker status (open / closed / tripped / ready), close and trip commands, spring charged, bus voltage', 'Hardwired I/O for critical commands; split per section'],
        ['Measurement', 'CTs and VTs feeding transducers or the genset controller (kW, kVAr, V, Hz, I)', 'Each generator measured independently'],
        ['Network', 'Controller-to-controller and controller-to-IAS communication (often redundant Ethernet or fieldbus)', 'Dual network A / B; loss of network must not stop basic generator operation'],
        ['HMI / IAS integration', 'Mimic, mode selection, set-points, alarms, events, trends', 'Several operator stations; local panels on the switchboard as back-up'],
        ['Power supply', '24 V DC to controllers and I/O from UPS or battery-backed supplies', 'Separate supply per section; must survive a blackout'],
        ['Back-up / manual means', 'Manual sync (synchroscope, check-synch relay), manual governor raise / lower, local breaker control', 'Required so the plant can be operated if the PMS fails']]) +
      H('Design principles') + L([
        '<b>Distributed</b> – each switchboard section and generator has its own control; a fault in one controller should only affect its own section.',
        '<b>Fail-safe</b> – on PMS failure the running generators stay connected and keep sharing (usually by droop or a back-up sharing line); no automatic trips because of a lost signal.',
        '<b>Hardwired safety</b> – generator protection, preferential trips and emergency stops are normally hardwired or in protection relays, not only in software.',
        'Redundancy of PMS, supplies and networks must follow the same <b>redundancy groups</b> as the power plant (see the FMEA).',
        'Software, settings and I/O changes only under <b>Management of Change</b>, with backups before and after.']) + NOTE
    ],
    ['startstop', '▶️', 'Generator start/stop & standby', () =>
      H('Load-dependent start / stop') + L([
        'The PMS compares online load with online capacity. When load exceeds the <b>start limit</b> for a set time, it starts the next standby generator; when load falls below the <b>stop limit</b> for a longer time, it stops the surplus set.',
        'A <b>dead band</b> between start and stop limits and time delays prevent hunting (repeated start / stop).',
        'The stop check is predictive: a set is only stopped if the remaining sets would still be below the start limit after it leaves.',
        'Start may also be triggered by <b>available power</b> (spinning reserve) falling below a set kW value, rather than a percentage.']) +
      TB(['Setting', 'Typical value', 'Comment'], [
        ['Load-dependent start', 'Approx. 80–90 % of online capacity, delay 5–30 s', 'Faster stage at higher load, e.g. 95 % with a few seconds'],
        ['Load-dependent stop', 'Approx. 40–60 % (calculated after stop), delay several minutes', 'Long delay avoids stopping before the next load comes'],
        ['Minimum generators online', 'Set per operating mode (sea, manoeuvring, port, DP)', 'Manoeuvring and DP often require more sets'],
        ['Spinning reserve', 'At least the largest expected load step or the loss of one set', 'DP: defined by the FMEA / worst-case failure'],
        ['Start failure', 'Typically 2–3 start attempts, then next standby is started', 'Alarm “start failure” and set removed from standby']]) +
      H('Standby selection & priority') + L([
        'The operator assigns a <b>priority (start sequence)</b>: 1st standby, 2nd standby, etc. Some systems rotate priority by running hours.',
        'A generator is only <b>available</b> as standby when it is in AUTO / remote, has no active shutdown or trip, is ready to start (preheated, LO priming, start air or battery OK) and its breaker is ready (racked in, spring charged, not tripped).',
        'Common causes of “no standby available”: local / manual switch position, shutdown not reset, breaker tripped or racked out, preheat off.',
        'Stopping: the PMS unloads the set (ramps load to the others), opens the breaker, then runs a cool-down period before stopping the engine.']) + NOTE
    ],
    ['sync', '🔄', 'Synchronising & load sharing', () =>
      H('Automatic synchronising') + L([
        'The synchroniser matches the incoming generator’s <b>frequency, voltage and phase angle</b> to the bus by sending raise / lower signals to the governor and AVR.',
        'Breaker close is commanded in advance (allowing for breaker closing time) so contacts close near zero phase difference.',
        'An independent <b>check-synchronising relay</b> (synch-check) normally blocks closing outside limits.',
        'Phase sequence must be correct – it is verified at commissioning and after any work on cables or VTs.']) +
      TB(['Sync parameter', 'Typical window'], [
        ['Frequency difference', 'Approx. 0.1–0.3 Hz, incoming slightly faster so it picks up load'],
        ['Voltage difference', 'Approx. 2–5 % of nominal'],
        ['Phase angle at close', 'Approx. within 5–10 electrical degrees'],
        ['Sync time-out', 'Typically 30–120 s, then alarm “synchronising failure”']]) +
      H('Active power (kW) sharing') + L([
        '<b>Isochronous load sharing</b> – genset controllers or load-sharing units communicate (analogue sharing lines or network) and hold frequency constant while sharing kW equally or in proportion to rating.',
        '<b>Droop</b> – each governor reduces speed with load (typically 3–5 % droop); sets share in proportion to their droop settings. PMS may trim frequency back to nominal by shifting all droop lines (frequency control).',
        'Many plants use droop as the <b>fall-back</b> mode if the PMS or sharing network fails, so the sets continue to share safely.',
        'Asymmetric sharing (one set base-loaded) may be used for engine reasons, e.g. to avoid low load on one engine.']) +
      H('Reactive power (kVAr) sharing') + L([
        'Shared by AVR <b>voltage droop</b> (reactive droop compensation via a CT) or by cross-current / network-based kVAr sharing.',
        'Unequal kVAr shows as unequal current and power factor at equal kW – check AVR droop settings and CT wiring.',
        'Loss of excitation on one set causes it to absorb kVAr from the others; protection must detect it.']) +
      `<p>Governor and AVR details: ${A('dieselgen.html', 'Diesel Generators guide')}.</p>` + NOTE
    ],
    ['shed', '✂️', 'Load shedding, preferential trip & heavy consumers', () =>
      H('Heavy consumer start request / blocking') + L([
        'Large consumers (bow thrusters, cargo pumps, compressors, cranes, reefer groups) send a <b>start request</b> to the PMS with their expected kW.',
        'The PMS checks <b>available power</b>. If enough, it gives a start permission; if not, it starts more generators first and grants permission when they are online.',
        'If power cannot be made available (no standby), the start remains <b>blocked</b> and an alarm or indication is given.',
        'Some consumers also report running load continuously so the PMS can reserve power for them.']) +
      H('Preferential trip / load shedding') + L([
        'On generator overload (current or kW) or low frequency, non-essential consumers are tripped in <b>stages</b> to keep the essential ones running.',
        'Stage 1 trips the least important loads (e.g. galley, laundry, AC compressors); later stages trip further non-essential groups. Essential services (steering, propulsion auxiliaries, navigation, fire-fighting) are never shed.',
        'Preferential trips are usually <b>hardwired</b> from the generator protection / overcurrent relay with time delays, independent of PMS software.',
        'Reconnection of shed loads is manual or a controlled automatic sequence once power is restored.']) +
      TB(['Stage', 'Typical trigger', 'Typical consumers'], [
        ['Stage 1', 'Approx. 100–105 % generator current or kW, delay around 5 s', 'Galley, laundry, accommodation heating / AC'],
        ['Stage 2', 'Overload persists, further delay (e.g. 10 s)', 'Further non-essential groups, workshop, deck machinery not in use'],
        ['Stage 3', 'Overload persists or low frequency', 'Remaining non-essential loads as defined in the trip list'],
        ['Fast load reduction', 'Generator trip or breaker open signal, within milliseconds', 'Thrusters / propulsion drives phase-back, large VFD loads']]) +
      H('Fast load reduction & thruster phase-back') + L([
        'On diesel-electric and DP vessels, propulsion and thruster drives are the biggest loads. When a generator trips, the PMS (or a hardwired signal) instantly commands the drives to <b>reduce power</b> to what the remaining sets can carry.',
        '<b>Frequency- or power-based limitation</b>: drives also reduce load by themselves if bus frequency falls or available power is low, before generators overload.',
        'This is much faster than starting a standby set, so it is the main defence against a cascade blackout.']) + NOTE
    ],
    ['blackout', '⚫', 'Blackout prevention & recovery', () =>
      H('Prevention layers') + L([
        'Enough online power and spinning reserve (load-dependent start, minimum sets per mode).',
        'Heavy-consumer start control.',
        'Fast load reduction and thruster / propulsion power limitation.',
        'Staged preferential trip.',
        'Generator protection that trips the <b>faulty</b> set and not the healthy ones (faulty governor / AVR detection).',
        'Bus-tie opening to split the plant before a fault spreads (closed-bus DP plants).']) +
      H('Blackout recovery sequence (typical)') + L([
        '<b>1.</b> Dead bus detected (no voltage on a section for a short confirmation time). Emergency generator starts and feeds the ESB (SOLAS: within 45 s).',
        '<b>2.</b> PMS sends start to standby generator(s); several may be started in parallel.',
        '<b>3.</b> The first set to reach rated speed and voltage gets <b>dead-bus closing</b> permission – only one breaker may close on a dead bus (interlocked to prevent two unsynchronised closings).',
        '<b>4.</b> Further sets synchronise to the live bus normally.',
        '<b>5.</b> Essential consumers restart automatically by <b>sequential restart</b> (time-staggered groups) to avoid a large inrush step; propulsion / thrusters are released when enough power is online.',
        '<b>6.</b> ESB to MSB transfer / interconnector restored per switchboard design.']) +
      TB(['Item', 'Typical value'], [
        ['Dead-bus confirmation time', 'Approx. 1–3 s'],
        ['Standby set to bus', 'Approx. 30–45 s for a pre-heated medium / high-speed set'],
        ['Sequential restart steps', 'Groups a few seconds apart'],
        ['Requirement source', 'SOLAS II-1, class rules for automatic restart and unattended machinery']]) +
      H('Why recovery fails') + L(['Standby set not in AUTO or with an unreset shutdown.', 'Breaker tripped, not spring-charged or with undervoltage coil not energised.', 'PMS / genset controller 24 V DC supply lost in the blackout.', 'The original fault still present, so the plant blacks out again.']) + NOTE
    ],
    ['modes', '🎛️', 'Modes, bus-ties & shore connection', () =>
      TB(['Mode', 'What the PMS does', 'Operator does'], [
        ['Auto', 'All functions active: load-dependent start / stop, standby, sync, sharing, blackout recovery', 'Sets priorities and limits, monitors'],
        ['Semi-auto', 'Operator orders start / stop or connect / disconnect; PMS carries out sync and sharing', 'Decides which set to run'],
        ['Manual', 'PMS functions off for that set; generator is not a standby', 'Starts, synchronises (synchroscope) and adjusts load by hand'],
        ['Local', 'Control only from the engine or switchboard local panel', 'Maintenance, testing, emergency operation']]) +
      L(['A generator in manual or local is normally <b>not counted</b> as standby – a common hidden reason for failed blackout recovery.', 'Operating modes may also be plant modes (sea, manoeuvring, harbour, DP, cargo) that set minimum sets and limits.']) +
      H('Bus-tie control (open / closed bus)') + L([
        'The PMS may open and close bus-ties, synchronising the two sections across the bus-tie breaker before closing.',
        '<b>Closed bus</b> – one common bus, fewer generators online and better efficiency; the PMS must handle load sharing across sections and the plant needs protection against fault propagation.',
        '<b>Open bus</b> – each section runs independently with its own generators, sharing and standby logic; a fault stays in one section.',
        'On fault (short circuit, severe frequency or voltage deviation) the bus-tie is opened fast by protection to save the healthy section.']) +
      H('Shore connection mode') + L([
        'Shore supply is connected to a dead bus, or with short-time parallel (synchronised) transfer only where the system and shore are designed and approved for it.',
        'Interlocks prevent shore breaker and generator breakers from closing together unless parallel transfer is approved.',
        'PMS load-dependent start and blackout start are disabled or adapted in shore mode; on loss of shore power the PMS may start generators automatically (design-dependent).',
        'Check phase sequence, voltage, frequency and earthing system before connecting (see high-voltage shore connection rules where applicable).']) +
      `<p>Switchboard layout and interlocks: ${A('switchboards.html', 'MSB &amp; ESB guide')}.</p>` + NOTE
    ],
    ['dp', '🛰️', 'DP vessel specifics', () =>
      L([
        'On DP vessels the PMS is part of the DP system; its redundancy, supplies and networks follow the <b>DP redundancy groups</b> and are analysed in the DP FMEA.',
        'The DP control system and PMS exchange <b>available power</b> and power limits so thrust allocation never demands more than the plant can supply.',
        'Fast load reduction and thruster phase-back are key to surviving the <b>worst-case failure</b> (e.g. loss of one section or several generators).',
        '<b>Closed-bus DP</b> requires advanced generator protection (detecting faulty governor / AVR, over / under excitation, load-sharing faults) and proven ride-through, normally verified by tests in DP trials.',
        'Minimum generators online and bus configuration are defined in the CAM / TAM tables and ASOG – the ETO must not change PMS modes during DP without DPO agreement.',
        'Blackout recovery on DP must restore thrusters quickly and in an orderly way; the time is tested in DP trials.']) +
      `<p>See ${A('dpsystem.html', 'DP System guide')} for redundancy groups, FMEA and ASOG.</p>` + NOTE
    ],
    ['protection', '🛡️', 'Protection supervision & alarms', () =>
      TB(['Function', 'Purpose', 'Typical setting / note'], [
        ['Reverse power', 'Detects a set being motored (engine failure, fuel loss)', 'Approx. 8–15 % of rated kW for diesel sets, delay a few seconds'],
        ['Overcurrent / short circuit', 'Protects alternator and cables', 'Coordinated with preferential trip and feeder breakers (selectivity)'],
        ['Over / under frequency', 'Governor fault or overload', 'Alarm and trip limits with delays per class and maker'],
        ['Over / under voltage', 'AVR fault', 'Alarm and trip limits with delays'],
        ['Current / load unbalance between sets', 'Detects poor kW or kVAr sharing', 'Alarm when deviation exceeds a set percentage'],
        ['Faulty governor detection', 'Identifies the set that takes too much or too little kW compared to the others', 'Trips or disconnects the faulty set, not the healthy ones'],
        ['Faulty AVR detection', 'Identifies over- or under-excitation (kVAr imbalance, loss of excitation)', 'Important on closed-bus plants'],
        ['Breaker failure', 'Breaker fails to open or close on command', 'Alarm; may trip upstream or block automatic sequences']]) +
      H('Typical PMS alarms') + L(['Start failure / sync failure / breaker close failure.', 'No standby available.', 'Load-sharing deviation, kW or kVAr unbalance.', 'Heavy consumer blocked.', 'Preferential trip activated.', 'Network or controller fault, 24 V supply fault.', 'Bus frequency / voltage high or low.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>single-line diagram</b>, sections, bus-ties, shore connection and which consumers are on which section.',
        'PMS <b>settings list</b>: start / stop limits and delays, standby rules, preferential trip stages, heavy consumer values, sync windows.',
        'How a generator becomes “available” as standby – and every reason it may not be.',
        'Difference between isochronous and droop sharing, and what the plant falls back to if the PMS or network fails.',
        'The <b>blackout recovery sequence</b> step by step, and the times you should expect.',
        'Which functions are hardwired (protection, preferential trip, E-stops) and which are software.',
        'How to synchronise and share load <b>manually</b> – the PMS may not be there when you need it most.',
        'Where the PMS controllers, I/O, network switches and 24 V supplies are, and how they are powered during a blackout.',
        'Backup and restore of PMS / genset controller software and parameters.',
        'For DP vessels: the FMEA, CAM / TAM and ASOG items related to the PMS.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Check PMS mimic and alarm list, standby availability and priorities, kW / kVAr sharing balance, 24 V supply status'],
        ['Weekly', 'Review event log for start / sync failures and trips; check network redundancy status; verify mode settings match the operating condition'],
        ['Monthly', 'Test standby start and auto-sync (planned changeover); emergency generator auto-start test; check UPS / batteries feeding PMS'],
        ['3-monthly', 'Test heavy-consumer start blocking; test one preferential trip stage (planned, with notice to affected users)'],
        ['Yearly', 'Full PMS function tests: load-dependent start / stop, preferential trip all stages, fast load reduction, blackout test with automatic recovery; protection relay test with secondary injection'],
        ['Class / DP trials', 'Blackout and recovery tests, closed-bus fault tests, FMEA proving trials as required by class and the DP trials programme'],
        ['After any modification', 'Back up software and settings, update drawings and FMEA, re-test affected functions']]) +
      H('Blackout test – good practice') + L([
        'Plan with the chief engineer and master; vessel in safe condition (alongside or open sea, not manoeuvring, not in DP critical activity).',
        'Record each step with times: dead bus, emergency generator on ESB, standby start, first breaker close, sequential restart.',
        'Check that the emergency lighting, steering and essential services recover as designed.',
        'Investigate and correct any deviation before declaring the system fit.']) +
      L(['FMEA tests verify that a single failure (controller, network, supply, sensor) has the effect predicted in the FMEA – keep evidence for class and clients.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Standby generator does not start on demand', 'Not in AUTO, shutdown not reset, start air / battery low, start failure blocked it', 'Check genset mode, alarm list, start system, PMS standby status'],
        ['Generator starts but does not synchronise', 'Governor not responding to raise / lower, AVR fault, sync window too tight, VT fuse blown', 'Check sync controller outputs, governor / AVR response, VT supply'],
        ['Breaker will not close after sync', 'Spring not charged, undervoltage coil not energised, synch-check relay blocking, interlock', 'Check breaker ready signals, check-sync relay, close coil supply'],
        ['Unequal kW sharing', 'Governor fault or droop mismatch, sharing line or network fault, actuator problem', 'Compare kW and governor outputs, sharing signals, droop settings'],
        ['Unequal kVAr / current at equal kW', 'AVR droop setting, droop CT wiring or polarity, AVR fault', 'Check power factor of each set, AVR settings, CT connections'],
        ['Generators start and stop repeatedly', 'Start / stop limits too close, delays too short, fluctuating load', 'Review settings, dead band and delays'],
        ['Heavy consumer blocked although power seems available', 'Wrong request value, a set not counted as available, signal fault', 'Check available power calculation, request signal and set statuses'],
        ['Unexpected preferential trip', 'Real overload, wrong CT ratio or relay setting, sharing fault overloading one set', 'Check event log, generator currents, relay settings'],
        ['Reverse power trip of one set', 'Engine fuel problem, governor fault, poor sharing at low load', 'Check fuel system, governor, sharing; avoid very low load on paralleled sets'],
        ['No automatic recovery after blackout', 'No standby available, 24 V PMS supply lost, dead-bus close interlock', 'Check standby readiness, UPS and DC supplies, dead-bus logic'],
        ['PMS network / controller alarm', 'Failed switch, cable, controller or power supply', 'Identify network A / B and node, check LEDs and supplies; plant should continue on fall-back'],
        ['Frequency or voltage deviating with all sets in AUTO', 'Frequency / voltage control function off, set-point error, governor in wrong mode', 'Check PMS frequency control, governor and AVR modes and set-points']]) + NOTE
    ],
    ['lessons', '📚', 'Safety & lessons', () =>
      H('Safety') + L([
        'PMS commands can <b>start engines and close breakers remotely</b> – before working on a generator or its breaker, put it in local / blocked, isolate the starting system and the breaker (rack out) and apply LOTO.',
        'Do not force or jumper PMS I/O or interlocks to “get it running” – this defeats blackout and synchronising protection.',
        'Never change PMS modes or settings during manoeuvring, DP or other critical operations without agreement of the chief engineer, master or DPO.',
        'Unsynchronised closing can damage alternators, couplings and breakers – trust the check-sync relay and investigate if it blocks.']) +
      H('Lessons learned') + L([
        'Many blackouts start with one set’s <b>governor or AVR fault</b> causing healthy sets to trip – sharing alarms and faulty-set detection prevent cascades.',
        'Standby sets left in manual, unreset shutdowns or breakers left racked out are frequent reasons for failed blackout recovery.',
        'Loss of the PMS 24 V supply during a blackout can stop recovery – test supplies and UPS autonomy.',
        'Wrong settings after software updates or controller replacement – compare against the approved settings list and re-test.',
        'Heavy consumers started in manual bypass of the PMS have caused overload blackouts.',
        'Blackout tests find hidden failures – do them for real and record the results.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Power Management System (Guide)', icon: '🧠', accent: '#be123c',
    subtitle: 'The ship’s PMS from the ETO view – architecture, generator start / stop and standby, synchronising and load sharing, load shedding and heavy consumers, blackout prevention and recovery, modes, bus-ties, shore connection, DP specifics, maintenance, troubleshooting and safety.',
    refs: ['SOLAS II-1 Reg. 41–45', 'IEC 60092-201 / 60092-202', 'IMCA M 103 / M 190 (DP)', 'Class rules (DNV, ABS, LR, BV…)'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
