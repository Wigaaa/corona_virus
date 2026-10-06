(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values shown are typical. The maker’s manuals, the vessel’s drawings and procedures, SOLAS and class rules always govern.</p>';

  const S = [
    ['overview', '🌬️', 'Air systems on board', () =>
      `<p>Compressed air is an essential service on board: it starts the main and auxiliary engines, operates pneumatic valves and controls, and supplies tools and services. The ETO looks after the electrical side – motors, starters, VFDs, pressure switches and transmitters, controllers, alarms and safeties – and must understand the mechanical system well enough to fault-find it.</p>` +
      TB(['System', 'Pressure (typical)', 'Use'], [
        ['Starting air', '25–30 bar (some designs lower, e.g. 10–15 bar on smaller engines)', 'Starting main and auxiliary diesel engines, reversing / control air on some main engines'],
        ['Service / working air', 'about 7–8 bar', 'Workshop tools, cleaning, deck services, sea chest blowing, pneumatic pumps'],
        ['Control / instrument air', 'about 6–7 bar, reduced locally (e.g. 1.4 bar or 0.2–1 bar signal air)', 'Pneumatic valve actuators, positioners, controllers, quick-closing valves, level gauges'],
        ['Emergency air', 'Same as starting air (small receiver)', 'Dead-ship start of an auxiliary or emergency generator engine'],
        ['Other systems', 'Varies', 'Whistle / typhon air, soot blowing, boiler, fresh water hydrophore, tank gauging purge']]) +
      H('Typical arrangement') + L([
        'Two (or more) <b>main starting air compressors</b> charge two or more <b>main air receivers</b>.',
        'Service and control air are taken from the starting air receivers through <b>reducing valves</b>, or produced by separate <b>service / working air compressors</b> (often screw type) with their own receiver.',
        'Control air passes through <b>filters and an air dryer</b> before a dedicated control air receiver and distribution.',
        'An <b>emergency air compressor</b> and emergency receiver allow a start from dead-ship condition.',
        'Cross-connections allow one system to back up another (e.g. starting air feeding service air through a reducing station).']) +
      `<p>Related pages: ${A('motor.html', 'Motors')}, ${A('valves.html', 'Remote Control Valves guide')}, ${A('dieselgen.html', 'Diesel Generators guide')}.</p>` + NOTE
    ],
    ['types', '⚙️', 'Compressor types', () =>
      TB(['Type', 'Typical use', 'Characteristics', 'ETO notes'], [
        ['Reciprocating two-stage (piston)', 'Main and emergency starting air, 25–30 bar', 'LP and HP stages with intercooler and aftercooler; water- or air-cooled; splash or pressure lubrication; stop/start operation', 'Usually DOL or star-delta motor; unloaded start via solenoid drain / unloader valves; high starting current'],
        ['Reciprocating three-stage', 'Higher pressures (e.g. 40 bar systems)', 'Extra stage and cooler; more drains and safety valves', 'Same control principles as two-stage'],
        ['Oil-injected rotary screw', 'Service and control air, 7–10 bar', 'Continuous duty, oil cools and seals rotors; oil separator; load / unload or VFD control', 'Built-in controller, often star-delta or VFD; many sensors (temperature, pressure, filter dp)'],
        ['Oil-free screw / scroll / piston', 'Instrument or breathing-quality air, sensitive users', 'No oil in the compression chamber; lower oil carryover risk; often higher cost', 'Same electrical principles; monitor stage temperatures'],
        ['Hand / diesel-driven compressor', 'Emergency air for dead-ship start', 'Independent of the main power supply', 'Engine or manual drive; check battery / fuel / function regularly']]) +
      H('Key points') + L([
        '<b>Reciprocating</b> compressors give high pressure and start/stop with demand; they are robust and common for starting air.',
        '<b>Screw</b> compressors give steady flow at lower pressure, run for long periods and use load / unload or speed control.',
        'Multi-stage compression with intercooling reduces discharge temperature and power and improves efficiency.',
        'Oil-free does not automatically mean clean air – dirt and water from the intake still need filtering and drying.']) + NOTE
    ],
    ['comp', '🔩', 'Components', () =>
      TB(['Component', 'Function', 'Typical failure / check'], [
        ['Air intake filter / silencer', 'Removes dust before compression', 'Clogging reduces capacity and raises temperature'],
        ['Intercooler', 'Cools air between stages, condenses water', 'Fouled or leaking tubes; water in the air or air in the cooling water'],
        ['Aftercooler', 'Cools the final discharge air before the receiver', 'High air temperature to receiver, more moisture carried over'],
        ['Suction and delivery valves', 'Plate / reed valves controlling flow in each stage', 'Leaking valves give slow pressure build-up and high stage temperatures'],
        ['Unloaders', 'Hold suction valves open or vent stages so the compressor starts or runs without load', 'Stuck unloader: motor overload at start or no compression'],
        ['Drain valves (manual and auto solenoid)', 'Remove condensate from coolers and separators; open at start (unloaded start) and periodically', 'Solenoid coil or timer failure, blocked drain, valve leaking continuously'],
        ['Stage safety (relief) valves', 'Protect each stage and cooler against over-pressure', 'Lifting indicates a blocked valve, high stage pressure or wrong setting'],
        ['Fusible plug (where fitted)', 'Melts at high discharge air temperature to protect against fire / explosion in the delivery line', 'Must never be replaced by a solid plug'],
        ['Non-return valve on discharge', 'Prevents receiver air flowing back', 'Leaking valve: compressor turns backwards or unloaders blow continuously'],
        ['Air receiver', 'Stores air for engine starts and steadies supply', 'Must have safety valve, pressure gauge, drain, inspection opening; periodic survey'],
        ['Receiver safety valve / fusible plug', 'Protects the receiver against over-pressure and fire', 'Test / overhaul as planned, sealed setting']]) +
      H('Notes') + L([
        'Each compressor stage and each receiver must be protected against over-pressure; the receiver relief capacity must cover the full compressor output.',
        'Receivers are drained regularly; oil and water accumulate at the bottom and can cause corrosion and fire / explosion risk.',
        'Pipes between compressor and receiver should be arranged to drain and to limit oil accumulation.']) + NOTE
    ],
    ['treat', '💧', 'Air treatment & instrument air', () =>
      TB(['Equipment', 'How it works', 'Typical points'], [
        ['Refrigerant dryer', 'Cools air to a pressure dew point of about +3 °C so water condenses and is drained', 'Simple and common for control air; needs working refrigerant circuit, condenser fan and auto drain'],
        ['Desiccant (adsorption) dryer', 'Twin towers of desiccant; one dries while the other regenerates (heatless or heated)', 'Low dew point (e.g. -20 to -40 °C); purge air consumption; switch-over valves and timer / controller'],
        ['Coarse / water separator', 'Removes liquid water and large droplets', 'Auto drain must work'],
        ['Pre-filter / coalescing filter', 'Removes oil aerosols and fine particles', 'Differential pressure indicator; replace elements as planned'],
        ['Activated carbon filter', 'Removes oil vapour and odours', 'Where very clean air is needed'],
        ['Pressure reducing station', 'Reduces starting air to service / control pressure', 'Often duplicated, with safety valve downstream']]) +
      H('Instrument air quality') + L([
        'Control air must be <b>dry, oil-free and clean</b>. Water and oil cause sticking valves, blocked nozzles and orifices, corroded positioners and wrong signals.',
        'In cold areas wet air can freeze in deck lines and valve actuators.',
        'Quality is often specified using ISO 8573-1 classes (particles, water / dew point, oil) – the maker of the control equipment states what is required.',
        'Typical checks: dryer dew point indication, auto drains working, filter differential pressure, no water at low-point drains of the control air system.',
        'Pneumatic valves and positioners are described in the ' + A('valves.html', 'Remote Control Valves guide') + '.']) + NOTE
    ],
    ['elec', '🔌', 'Electrical: motors, starters & VFD', () =>
      TB(['Item', 'Typical arrangement', 'ETO points'], [
        ['Motor', 'Three-phase induction motor, often 440 V / 60 Hz; tens of kW for starting air compressors', 'Insulation resistance, bearings, alignment / coupling, cooling fan, space heater'],
        ['DOL starter', 'Smaller compressors', 'High starting current – voltage dip on the switchboard; contactor and overload relay condition'],
        ['Star-delta starter', 'Larger reciprocating and screw compressors', 'Starting torque reduced to about one third – compressor must start unloaded; check changeover timer and contactor interlocks'],
        ['Soft starter', 'Some installations', 'Ramp settings, bypass contactor, thermal alarms'],
        ['VFD (screw compressors)', 'Speed follows air demand, keeping pressure nearly constant', 'Harmonics, cooling of the drive, parameter backup, fault log; reduced power at part load'],
        ['Supply', 'From main switchboard / MCC; emergency compressor may be fed from the emergency switchboard', 'Know which board feeds which compressor; preferential trip grouping'],
        ['Control supply', 'Control transformer, 24 V DC or 230 V AC', 'Fuses, power supplies, controller supply']]) +
      H('Key points') + L([
        'Starting under load (unloader or drain valve not open) can cause <b>motor overload</b> or failure to accelerate, especially with star-delta.',
        'Frequent starts heat the motor – check the maximum starts per hour given by the motor / compressor maker.',
        'Overload relay setting is normally near motor full-load current (per maker); do not increase it to "cure" a trip.',
        'Large compressors may be subject to PMS heavy-consumer start blocking or load-shedding – check the PMS settings.',
        'See ' + A('motor.html', 'Motors') + ' for current, starting and protection calculations.']) + NOTE
    ],
    ['control', '🎛️', 'Control & safeties', () =>
      H('Start / stop control') + L([
        '<b>Pressure switches</b> (or a pressure transmitter to a controller / PLC) start the compressor at a low set point and stop it at a high set point (typical starting air: start about 25 bar, stop about 30 bar; settings per vessel).',
        '<b>Lead / lag</b>: the lead compressor starts first; the lag (standby) compressor starts at a lower pressure if the lead cannot keep up. Lead and lag are swapped periodically (manually or automatically) to equalise running hours.',
        '<b>Unloaded start</b>: on start, solenoid drain / unloader valves stay open for a set time (time relay), then close so the compressor loads.',
        '<b>Periodic draining</b>: a timer opens the auto drains for a few seconds at intervals while running and on stop.',
        '<b>Auto-start / auto-restart</b> after blackout, typically with a staggered (sequential) delay so not all motors start together.',
        'Screw compressors: load / unload control or VFD pressure control, with run-on time before stopping to limit starts.']) +
      H('Safeties and alarms (typical)') + TB(['Function', 'Typical action', 'Notes'], [
        ['High discharge air temperature', 'Alarm and trip', 'Each stage or final discharge; fouled cooler, leaking valves, no cooling water'],
        ['Low lube oil pressure', 'Trip (with start time delay)', 'Pressure-lubricated compressors; bypassed for the first seconds after start'],
        ['Low lube oil level', 'Alarm or start block', 'Splash-lubricated compressors'],
        ['Cooling water low flow / high temperature', 'Alarm and trip', 'Flow switch or temperature sensor; pump must run first'],
        ['Motor overload / short circuit', 'Trip', 'Thermal overload relay, MCCB / fuses'],
        ['High oil temperature (screw)', 'Trip', 'Oil cooler, thermostatic valve, fan'],
        ['Separator / filter differential pressure (screw)', 'Alarm', 'Replace element'],
        ['Receiver low pressure', 'Alarm to engine room alarm system', 'Also important for engine start readiness'],
        ['Common fault', 'Alarm to alarm and monitoring system', 'Remote indication of compressor running / fault']]) +
      L(['Trips that latch must be reset locally after the cause is found – never bridge a safety to keep a compressor running.']) + NOTE
    ],
    ['emerg', '🆘', 'Emergency compressor & dead-ship', () =>
      `<p><b>Dead-ship condition</b>: the main plant, boilers and auxiliaries are not working because of the absence of power. The rules require that propulsion and essential services can be brought back without external help, which means a first engine must be started with means available on board.</p>` +
      H('Ways to provide first start air (typical)') + L([
        'An <b>emergency air compressor</b> driven by a hand-started diesel engine, or a hand-operated compressor.',
        'An electrically driven emergency compressor fed from the <b>emergency switchboard</b> (emergency generator started first).',
        'A separate <b>emergency air receiver</b> kept charged and isolated, for starting an auxiliary engine.',
        'Some vessels start the first generator engine electrically or hydraulically instead – the arrangement is shown in the class-approved drawings.']) +
      H('ETO points') + L([
        'Know the <b>dead-ship / blackout recovery procedure</b> of your vessel, step by step.',
        'Keep the emergency receiver charged and its isolating valve in the correct position.',
        'Test the emergency compressor and its supply (battery, fuel, starter, emergency board feed) at regular intervals.',
        'Check that an electric emergency compressor really is on the emergency switchboard and not on a load-shed group.',
        'Link with the ' + A('dieselgen.html', 'Diesel Generators guide') + ' for engine starting and blackout recovery.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>air system diagram</b>: compressors, receivers, reducing stations, dryers, cross-connections and emergency arrangement.',
        'Which switchboard feeds each compressor, its starter type and protection settings.',
        'Start / stop set points, lead / lag logic, unloaded-start timing and drain timers.',
        'All safeties: high temperature, low LO pressure, cooling water, overload – where the sensors are, and how to test them.',
        'How the controller / PLC or screw compressor controller is configured; keep a <b>parameter backup</b>.',
        'Requirements: at least two starting air compressors and receivers of sufficient capacity; total receiver capacity must allow a number of consecutive starts of the main engine without recharging (more for reversible engines than non-reversible), as stated in SOLAS / class rules.',
        'Instrument air quality requirements of the pneumatic control equipment.',
        'Emergency / dead-ship start arrangement.',
        'How a compressor fault affects the plant: low starting air blocks engine start and may stop pneumatic valve control.',
        'Safe isolation: electrical lock-out AND depressurising / isolating the air side before work.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Check running hours, pressures and temperatures, LO level, cooling water, auto drain operation, receiver drains, dryer dew point indication, alarms'],
        ['Weekly', 'Test auto-start and lead / lag changeover, check drain solenoids and timers, drain control air low points, check filter differential pressure'],
        ['Monthly', 'Test safety trips (high temp, low LO pressure, cooling water) as planned, emergency compressor test run, check starter contactors and terminals'],
        ['3–6 monthly', 'Insulation resistance of motors, intake filter cleaning, check pressure switch / transmitter set points against a calibrated gauge'],
        ['Yearly', 'Calibration of pressure and temperature sensors, thermographic check of starters, safety valve tests as planned, motor bearing check, controller backup'],
        ['By running hours', 'Valve overhaul, piston rings, bearings, oil change, separator and filter elements (screw), per maker'],
        ['Class survey', 'Receivers internal inspection and safety valves, emergency arrangements, alarms and safeties']]) +
      L(['Record set points and test results in the planned maintenance system.', 'After any maintenance check rotation direction, unloaded start, drains and safeties before returning to auto.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Compressor will not start', 'No supply, tripped overload, latched safety trip, selector in manual / off, pressure switch fault, control fuse, PMS start block', 'Check supply and control voltage, reset trips after finding cause, check pressure switch contacts and set point, alarm list'],
        ['Will not stop / unload', 'Pressure switch or transmitter fault, set point too high, leaking discharge pipe, contactor welded', 'Compare gauge and transmitter reading, check switch contacts, contactor condition; stop manually'],
        ['High discharge temperature trip', 'Cooling water low flow or high temperature, fouled intercooler, leaking valves, clogged intake filter', 'Check cooling water pump and flow, cooler, valve condition, sensor and wiring'],
        ['Low LO pressure trip', 'Low oil level, blocked filter, worn pump, wrong start bypass time, faulty sensor', 'Check oil level and filter, pressure gauge, sensor and time relay setting'],
        ['Stage safety valve lifting', 'Leaking or broken valve in next stage, blocked cooler, wrong valve setting', 'Compare stage pressures, overhaul valves; do not adjust safety valve to stop it'],
        ['Slow pressure build-up', 'Worn valves or rings, open drain, air leaks, unloader stuck, slipping belt', 'Check drains and unloaders, compare running time to charge receiver with normal, leak check'],
        ['Motor overload trip at start', 'Starting under load, star-delta timer wrong, low voltage, mechanical seizure', 'Check unloaded start, drains open at start, timer, voltage, turn by hand'],
        ['Motor overload while running', 'High discharge pressure, worn bearings, single-phasing, overload set too low', 'Measure phase currents and voltage, check bearings and set point'],
        ['Water in air lines', 'Auto drains failed, dryer fault, aftercooler fouled', 'Test drain solenoids and timers, dryer operation, drain low points'],
        ['Oil carryover', 'Worn rings, overfilled oil, failed separator (screw)', 'Check oil level and consumption, separator, coalescing filters'],
        ['Dryer alarm / high dew point', 'Refrigerant leak, condenser fan fault, high inlet temperature, desiccant switch valve stuck', 'Check dryer controller, fan and refrigerant pressures, switch-over valves and timer'],
        ['Lag compressor not starting', 'Lead / lag logic, lag pressure switch set wrong, selector switch', 'Check set points and changeover selection'],
        ['Auto drain solenoid blowing continuously', 'Valve stuck open, timer failure, coil always energised', 'Check timer output, coil, valve seat']]) + NOTE
    ],
    ['safety', '⚠️', 'Safety & lessons', () =>
      H('Main hazards') + L([
        '<b>Receiver or pipe explosion</b> – oil and carbon deposits in hot discharge lines and receivers can ignite; a leaking compressor valve raises temperatures. Keep drains, coolers and valves in good order.',
        '<b>Starting air line explosion</b> – a leaking engine starting valve can let hot combustion gas into the starting air manifold; flame arresters / bursting discs protect the line.',
        '<b>Stored energy</b> – receivers and lines hold large amounts of energy; isolate and vent before opening anything.',
        '<b>Oil carryover</b> – fire risk and damage to control equipment.',
        '<b>Hot surfaces</b> – compressor heads, discharge pipes and coolers can be very hot.',
        '<b>Automatic start</b> – a compressor on auto can start without warning; lock out electrically before work.',
        'Noise – use hearing protection.']) +
      H('Lessons') + L([
        'Never bridge or disable safeties, fusible plugs or relief valves.',
        'Never use compressed air to clean clothing or skin – risk of serious injury.',
        'Use only the compressor oil grade approved by the maker – wrong oil increases carbon deposits.',
        'Isolate both sides: electrical lock-out / tag-out and air isolation with venting.',
        'Test auto-start, safeties and emergency arrangements regularly; hidden failures appear only when they are needed.',
        'Report and investigate safety valve lifting, overheating and repeated trips – they are warnings.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Air Compressors & Air System (Guide)', icon: '🌬️', accent: '#64748b',
    subtitle: 'Starting, service and control air systems from an ETO view – compressor types, components, air treatment, motors and starters, control and safeties, emergency compressor, maintenance, troubleshooting and safety.',
    refs: ['SOLAS Ch. II-1', 'Class rules (starting arrangements, pressure vessels)', 'ISO 8573-1', 'Maker manuals'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
