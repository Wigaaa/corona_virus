(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance with typical values only. The maker’s manuals, the vessel’s drawings and procedures, flag requirements (SOLAS / MARPOL) and class rules always govern.</p>';

  const S = [
    ['overview', '💧', 'Pumps overview', () =>
      `<p>Pumps are among the most numerous electrical consumers on any ship or offshore unit – from small sewage and hydrophore pumps to large ballast, cargo, fire and mud pumps. For the ETO a pump is a <b>motor + starter / drive + control + protection</b> system: most pump problems reported to the ETO are a mix of electrical, control and hydraulic causes.</p>` +
      H('Two basic families') + L([
        '<b>Rotodynamic (centrifugal)</b> – an impeller adds velocity / pressure; flow varies strongly with system pressure. Most sea water, fresh water, ballast, fire and cooling pumps.',
        '<b>Positive displacement (PD)</b> – a fixed volume is moved each revolution (gear, screw, piston, vane, diaphragm); flow is almost independent of pressure. Fuel, lube oil, hydraulic, sludge, bilge separator feed, mud pumps.',
        'Centrifugal pumps can run briefly against a closed valve; a PD pump against a closed valve builds pressure until something breaks – it <b>must</b> have a relief valve.']) +
      H('What the ETO looks after') + L([
        'Motors (insulation, bearings, heaters, terminal boxes), starters, soft starters and VFDs.',
        'Automatic control: pressure switches / transmitters, level switches, duty / standby changeover, auto start, restart after blackout.',
        'Protection and alarms: overload, dry-run, low suction / discharge pressure, high temperature, seal leakage.',
        'Emergency stops and remote stops (fuel / lube oil pumps, ventilation) required by SOLAS.',
        'Ex-certified motors and instrumentation on pumps in hazardous areas (cargo, drilling, tankers).']) +
      `<p>Related pages: ${A('motor.html', 'Motors')}, ${A('vfd.html', 'VFD / Drives')}, ${A('mechthermal.html', 'Pump power calculator')}.</p>` + NOTE
    ],
    ['types', '⚙️', 'Pump types & where used', () =>
      TB(['Type', 'Principle', 'Typical services on board'], [
        ['Centrifugal (horizontal / vertical)', 'Impeller; flow and head depend on speed and system curve', 'SW / FW cooling, ballast, fire / general service, fresh water, boiler feed (multistage)'],
        ['Vertical inline centrifugal', 'Motor mounted on top, suction and discharge in line; small footprint', 'Cooling water, HVAC chilled water, fresh water, ballast on smaller ships'],
        ['Self-priming centrifugal / with priming unit', 'Centrifugal with vacuum pump or ejector to remove air from suction', 'Bilge, ballast, fire / GS pumps drawing from below the waterline or tanks'],
        ['Gear pump', 'Meshing gears; PD; good for viscous liquids', 'Lube oil, fuel transfer, sludge, small hydraulic systems'],
        ['Screw pump (2- or 3-screw)', 'Rotating screws; PD; smooth, quiet flow', 'Main engine lube oil, fuel supply / booster, cargo stripping, hydraulic'],
        ['Piston / plunger pump', 'Reciprocating; PD; high pressure', 'High pressure washing, injection, triplex mud pumps (drilling), bilge (older ships)'],
        ['Diaphragm pump', 'Reciprocating membrane, often air driven; PD', 'Chemicals, sludge, oily water, portable transfer'],
        ['Mono / progressive cavity (eccentric screw)', 'Rotor in elastomer stator; PD', 'Sewage, sludge, oily bilge to separator'],
        ['Submersible pump', 'Motor and pump submerged together, sealed motor', 'Cargo pumps (some tankers), emergency / salvage, sumps, drill floor, cooling caissons offshore'],
        ['Deepwell cargo pump', 'Pump at tank bottom, long shaft to motor on deck (or hydraulic drive)', 'Product / chemical tankers, gas carriers (submerged electric pumps for LNG / LPG)'],
        ['Ejector (eductor)', 'Driving water jet creates suction; no moving parts', 'Bilge, ballast stripping, emergency bilge suction']]) +
      H('Key differences for the ETO') + L([
        '<b>Centrifugal</b>: motor power rises with flow – the highest load is at <b>maximum flow / low head</b> (e.g. a broken pipe or open discharge). Running against a closed valve gives low power but heats the liquid.',
        '<b>PD</b>: motor power rises with discharge pressure – a blocked discharge or cold, viscous oil increases current; relief valve setting limits the load.',
        'Long-shaft deepwell and submersible pumps need special attention to insulation (submersible cables), seal monitoring and purging / gas-free status.']) + NOTE
    ],
    ['services', '🚢', 'Main services on board', () =>
      TB(['Service', 'Typical pump', 'ETO-relevant points'], [
        ['Main fire pumps', 'Centrifugal, often self-priming', 'Remote start from bridge / fire control; supplied from main switchboard; pressure in fire main kept per SOLAS (FSS Code)'],
        ['Emergency fire pump', 'Centrifugal, electric (from emergency switchboard) or diesel driven', 'Located outside the main machinery space; independent power and suction; regular test runs'],
        ['Ballast', 'Large centrifugal, priming system; sometimes VFD', 'High starting current – PMS heavy-consumer request; remote valves and BWTS interlocks'],
        ['Bilge', 'Centrifugal self-priming, piston or ejector', 'Bilge level alarms, oily water separator interlocks (15 ppm monitor), emergency bilge suction'],
        ['SW cooling', 'Centrifugal, duty / standby, often VFD', 'Auto changeover, low pressure start, temperature-controlled speed, restart after blackout'],
        ['FW / LT / HT cooling', 'Centrifugal, duty / standby', 'Essential for generators – sequential restart priority'],
        ['Fuel oil supply / booster', 'Screw or gear, duty / standby', 'Remote emergency stop from outside the space; auto changeover on low pressure'],
        ['Lube oil (main engine / generators)', 'Screw / gear, duty / standby, pre-lube pumps', 'Low LO pressure start of standby; pre-lube before engine start; remote stop'],
        ['Cargo (tankers)', 'Centrifugal deepwell, submersible, or steam / hydraulic driven', 'Ex areas, bulkhead shaft seals, gas detection, cargo ESD'],
        ['Drill water / potable water', 'Centrifugal transfer pumps', 'Level control between tanks, offshore supply'],
        ['Mud pumps (drilling)', 'Triplex piston, large DC or AC VFD motors', 'Very large loads on the drilling switchboard / VFD line-up; pressure relief and SCR / VFD interlocks'],
        ['Sewage', 'Progressive cavity, centrifugal macerator or vacuum system', 'Level-controlled, discharge interlocks with MARPOL Annex IV'],
        ['Fresh water hydrophore', 'Centrifugal with pressure tank', 'Pressure switch start / stop, or VFD constant pressure; frequent starts']]) +
      L(['Many services are <b>essential</b> (class definition) and must restart automatically after blackout or have a standby that starts automatically.',
        'Fire pumps, emergency fire pump and emergency bilge suction have their own SOLAS requirements – never leave them isolated without the chief engineer’s and master’s approval.']) + NOTE
    ],
    ['motors', '🔌', 'Motors, starters & VFD', () =>
      TB(['Starting method', 'Starting current (typical)', 'Typical use / notes'], [
        ['DOL (direct on line)', 'Roughly 5–8 × rated current', 'Small and medium pumps; simple and robust; high voltage dip on weak networks'],
        ['Star-delta', 'About 1/3 of DOL current', 'Medium pumps; centrifugal load is light at start; current and torque peak at changeover'],
        ['Auto-transformer', 'Reduced, depends on tap', 'Large ballast / fire pumps on older ships'],
        ['Soft starter', 'Typically 2–4 × rated, adjustable', 'Smooth start and stop, less water hammer; no speed control in running'],
        ['VFD', 'Close to rated current at start', 'Speed control, energy saving on SW cooling, ballast, hydrophore; mud pumps; harmonics and EMC must be managed']]) +
      H('Motor points') + L([
        'Most pumps are driven by 3-phase squirrel-cage induction motors (IP55/IP56 typical in engine rooms; Ex-certified in hazardous areas).',
        'Check <b>direction of rotation</b> after any reconnection – a centrifugal pump running backwards still gives some pressure, which misleads.',
        '<b>Anti-condensation heaters</b> on larger and deck motors must be energised when the motor is stopped.',
        'Vertical pump motors carry axial thrust – use the bearing type and grease specified by the maker.',
        'Coupling alignment and soft-foot affect motor bearings and vibration.']) +
      H('VFD points') + L([
        'Set a <b>minimum speed</b> so the pump still produces enough head to open the non-return valve and keep cooling of the seal / motor.',
        'Avoid running long periods at speeds that excite resonance – use skip frequencies if needed.',
        'Long motor cables may need output filters (dV/dt or sine) – check bearing currents on larger motors.',
        'Store and back up VFD parameters; record settings after commissioning.',
        `See ${A('vfd.html', 'VFD / Drives')} and ${A('motor.html', 'Motors')}.`]) + NOTE
    ],
    ['control', '🎛️', 'Control & automation', () =>
      H('Duty / standby changeover') + L([
        'Two (or more) pumps for one service: one is <b>duty</b>, the other <b>standby</b>, selected on the starter panel or the IAS (alarm and monitoring system).',
        'Standby starts automatically on: duty pump trip (overload / feedback lost), <b>low discharge pressure</b>, or low flow.',
        'An alarm “standby pump started” is raised – the cause must be investigated, not just acknowledged.',
        'Many systems rotate duty automatically (e.g. weekly / running hours) to equalise wear and prove the standby.',
        'Pressure-based start usually has a time delay (a few seconds, typical) to avoid starts on short pressure dips.']) +
      H('Pressure and level control') + L([
        '<b>Pressure switches</b> (on / off with differential) or <b>transmitters</b> (4–20 mA) with set-points in the IAS.',
        'Hydrophore: pump starts at low pressure and stops at high pressure; the tank air cushion limits the number of starts per hour.',
        'Level control: float switches, conductive probes, radar / pressure level transmitters start and stop transfer, sewage and bilge pumps.',
        'Temperature control: SW cooling pump speed (VFD) or three-way valve controls the FW temperature.']) +
      H('Restart after blackout') + L([
        'Essential pumps (cooling, lube oil, fuel, steering hydraulics) restart <b>automatically and sequentially</b> once power is restored, so the generators are not overloaded by simultaneous starts.',
        'Restart groups and delays are set in the starters (time relays) or in the PMS / IAS (typical delays from 0 to some tens of seconds by priority).',
        'Pumps that should <b>not</b> restart automatically (e.g. cargo, ballast, transfer pumps) must stay stopped until restarted by an operator.',
        'Check after every blackout and during tests that each pump restarts in its group and in the selected mode (duty / standby).']) +
      H('Interlocks') + L(['Suction / discharge valve position, tank low level, oil mist, BWTS ready, sewage discharge permission, PMS heavy-consumer permission (large ballast / fire / thruster pumps).']) + NOTE
    ],
    ['protect', '🛡️', 'Protection & alarms', () =>
      TB(['Protection / alarm', 'Purpose', 'Typical device'], [
        ['Overload', 'Protects the motor winding against overcurrent', 'Thermal / electronic overload relay, motor protection circuit breaker, VFD motor model'],
        ['Short circuit', 'Clears faults in cable / motor', 'MCCB, MPCB or fuses coordinated with the contactor'],
        ['Thermistor / PT100 winding temperature', 'Detects overheating not seen by current (blocked cooling, VFD at low speed)', 'PTC thermistor relay, PT100 input in VFD or IAS'],
        ['Dry-run protection', 'Stops pump with no liquid – seals and PD stators are destroyed quickly', 'Low level switch, low power (underload) relay, flow switch, seal temperature'],
        ['Low suction pressure', 'Protects against cavitation and running dry', 'Pressure switch / transmitter on suction'],
        ['Low discharge pressure', 'Starts the standby pump, alarms loss of service', 'Pressure switch / transmitter'],
        ['High discharge pressure', 'Blocked line, closed valve on PD pump', 'Pressure switch; mechanical relief valve on PD pumps'],
        ['High bearing / casing temperature', 'Bearing failure, running against closed valve', 'PT100 / thermostat'],
        ['Seal leakage', 'Mechanical seal failure; important for submersible and Ex pumps', 'Leakage sensor in seal chamber or drain, moisture probe in submersible motors'],
        ['Phase loss / unbalance', 'Single phasing burns motors quickly', 'Electronic motor protection relay'],
        ['Earth fault / insulation', 'Insulation failure in IT systems', 'Insulation monitoring device, earth-fault relays on larger motors']]) +
      L([
        'Overload relays are normally set to the motor <b>nameplate current</b> (for star-delta: the phase current, i.e. about 0.58 × line current when the relay is in the delta loop) – follow the starter diagram.',
        'Fire pumps: protection philosophy may differ – some class / flag rules require that overload only alarms and does not trip. Check the vessel documentation before changing settings.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      H('Affinity laws (centrifugal pumps, same impeller)') + L([
        'Flow ∝ speed: <b>Q2 / Q1 = n2 / n1</b>.',
        'Head ∝ speed²: <b>H2 / H1 = (n2 / n1)²</b>.',
        'Power ∝ speed³: <b>P2 / P1 = (n2 / n1)³</b> – at 80 % speed the ideal shaft power is about 51 %.',
        'Real savings are lower when the system has a large static head (e.g. lifting to a high tank or overcoming fixed back-pressure) – the pump may deliver nothing below a certain speed.',
        'Throttling a valve wastes energy; reducing speed with a VFD saves it – the main reason for VFDs on SW cooling and ballast pumps.',
        `Calculate hydraulic and motor power with the ${A('mechthermal.html', 'Pump power calculator')}.`]) +
      H('Cavitation') + L([
        'Occurs when suction pressure falls below the vapour pressure of the liquid – vapour bubbles form and collapse at the impeller, causing noise (“gravel”), vibration, pitting and loss of flow.',
        'Causes: blocked suction strainer / sea chest, low tank level, high liquid temperature, suction valve partly closed, too high flow (pump running far right on its curve), air leaks.',
        'Rule: NPSH available must exceed NPSH required by a margin (maker data).',
        'Electrically: current becomes unstable / fluctuating and lower than normal.']) +
      H('Running against a closed valve') + L([
        '<b>Centrifugal</b>: short time at shut-off is acceptable for starting some large pumps, but prolonged running heats the liquid, damages seals and bearings; a minimum-flow line may be fitted.',
        '<b>PD</b>: pressure rises until the relief valve lifts or the pipe / pump / motor fails – never start a PD pump with the discharge valve closed.']) +
      H('Other essentials') + L([
        'Read the pump curve: head, flow, efficiency, power and NPSH required.',
        'Motor current is a good “health” indicator – log normal current, pressure and flow when the pump is healthy.',
        'Know which pumps are on the emergency switchboard and which restart automatically after blackout.',
        'Know the location and wiring of all <b>remote emergency stops</b>.']) + NOTE
    ],
    ['ex', '💥', 'Ex pumps & remote stops', () =>
      H('Pumps in hazardous areas') + L([
        'Cargo pump rooms, cargo deck on tankers, drill floor and mud areas offshore are hazardous zones – motors, junction boxes, sensors and switches must be <b>Ex-certified</b> for the zone, gas group and temperature class.',
        'Typical protection types for motors: Ex d (flameproof), Ex e (increased safety), Ex p (pressurised), Ex nA (Zone 2).',
        'Cargo pumps in pump rooms are often driven by motors in the engine room through a <b>gas-tight bulkhead shaft seal</b> – the seal must be lubricated and monitored, bearing and casing temperatures alarmed.',
        'Submersible cargo pumps (gas carriers) run with the motor immersed in cargo; insulation and purging procedures follow the maker strictly.',
        'Never open Ex enclosures live, never modify cable glands or replace parts with non-certified ones; keep the Ex register and inspection records.']) +
      H('Remote emergency stops (SOLAS)') + L([
        'Fuel oil transfer, fuel supply / booster, purifier and lube oil pumps (and other oil pumps) must be <b>stoppable from outside the space</b> they serve, so they can be stopped in case of fire.',
        'Machinery space ventilation fans have similar remote stops; these are usually grouped at the fire control station.',
        'Circuits must be tested regularly; failure of the stop circuit should be detectable (wire-break monitoring or a test routine).',
        'After a remote stop the pumps must not restart automatically until reset locally.',
        'Cargo ESD on tankers / gas carriers trips cargo pumps; offshore, the ESD / F&amp;G system trips pumps per cause-and-effect.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Running pumps: current, pressure, noise, vibration, leaks, temperatures; standby pump in auto; alarm list'],
        ['Weekly', 'Emergency fire pump test run; fire pump start from remote stations; check hydrophore start / stop pressures'],
        ['Monthly', 'Duty / standby changeover test; auto start on low pressure test; bilge level alarms and bilge pump auto start; anti-condensation heaters'],
        ['3-monthly', 'Remote emergency stops of fuel / lube oil pumps (as per planned maintenance); insulation resistance of deck and submersible motors; terminal box inspection'],
        ['6-monthly', 'Overload relay and thermistor check; VFD fan and filter cleaning; seal leakage sensors test'],
        ['Yearly', 'Motor bearing greasing / replacement per maker; vibration analysis; contactor contacts inspection; blackout restart sequence test; Ex inspection in hazardous areas'],
        ['Survey / 5-yearly', 'Motor overhaul as required, cleaning and varnish, class survey items (fire pumps, emergency fire pump capacity test)'],
        ['After maintenance', 'Direction of rotation, insulation resistance, current check against nameplate, protection settings, control test in auto']]) +
      L(['Use the planned maintenance system intervals – these are only typical.', 'Record insulation and current readings for trending; a slowly falling insulation value warns before a failure.', 'Grease motors only with the specified grease and quantity – over-greasing overheats bearings.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Pump does not start', 'No supply, breaker / MPCB tripped, control fuse, E-stop or remote stop active, interlock, selector in wrong mode', 'Check supply and control voltage, stop circuits, interlocks, IAS start command, contactor coil'],
        ['Motor trips on overload', 'Pump overloaded (high flow / viscous oil), mechanical seizure, bearing failure, low voltage, wrong relay setting, single phasing', 'Measure current in all phases and voltage, turn the shaft by hand (isolated), check relay setting vs nameplate, check valves'],
        ['Runs but low or no pressure', 'Air in suction / lost prime, wrong rotation, blocked strainer, worn impeller / wear rings, open bypass, relief valve lifting', 'Check rotation, prime, suction valves and strainer, compare current with normal'],
        ['Noisy, gravel sound, fluctuating current', 'Cavitation: low suction pressure, blocked suction, hot liquid, low tank level', 'Check suction pressure and strainers, tank level, throttle discharge or reduce speed'],
        ['High vibration', 'Misalignment, bearing damage, unbalanced or damaged impeller, soft foot, resonance on VFD speed', 'Vibration measurement, alignment, bearing condition, skip frequencies'],
        ['Standby pump starts often', 'Duty pump weak, pressure switch set too close, pressure transmitter fault, air in system', 'Compare pressure readings, check switch differential and time delay, check duty pump'],
        ['Hydrophore pump starts too frequently', 'Air cushion lost (waterlogged tank), leaking system, pressure switch differential too small', 'Recharge air, check leaks and switch settings'],
        ['Pump did not restart after blackout', 'Not selected in auto, restart timer / group fault, PMS / IAS restart disabled, control supply lost', 'Check mode, restart relay or IAS settings, control power supply; test sequence'],
        ['Motor overheats, normal current', 'Blocked cooling fan or air path, VFD running at low speed for long time, ambient high', 'Clean fan cover, check thermistors, minimum speed setting, ventilation'],
        ['Low insulation resistance', 'Moisture (heater off), seal leak into submersible motor, damaged cable, dirty terminal box', 'IR test motor and cable separately, check heater, dry out, check seal sensor'],
        ['VFD trips (overcurrent / overvoltage)', 'Short ramp times, pump blocked, motor cable fault, high DC bus on fast stop', 'Check VFD fault log, ramps, motor and cable IR, braking settings'],
        ['Seal leakage alarm', 'Worn mechanical seal, dry-running, wrong installation', 'Stop pump, inspect seal, check dry-run protection and suction conditions']]) + NOTE
    ],
    ['safety', '⚠️', 'Safety', () =>
      L([
        '<b>Isolate electrically and mechanically</b>: lock out the breaker / starter AND close and secure suction and discharge valves before opening a pump – a pump can turn backwards (and act as a generator) with flow from a parallel pump or a head of water.',
        'Remove auto start: put duty / standby selectors to “manual / off” and inform the engine control room – a standby pump may start on low pressure while you work on it.',
        'VFD-fed motors: wait for the DC bus discharge time and verify zero voltage before opening.',
        'Fire pumps and emergency fire pump: isolation only with permission and with alternatives arranged; log the time out of service.',
        'Hazardous areas: permit to work, gas measurement, Ex-certified tools / equipment, no open enclosures in live gas zones.',
        'Pressurised systems: release pressure before opening; hot oil and hot water cause burns.',
        'Rotating parts: coupling guards must be refitted before test runs.',
        'Sewage and bilge pumps: biological and H2S hazards – ventilation, gas monitor, gloves and hygiene.',
        'Test after work: direction of rotation, current, protection and control in auto – then return to service and inform the watch.']) + NOTE
    ],
    ['lessons', '📚', 'Common failures & lessons', () =>
      H('Common failures') + L([
        'Standby pumps left in manual – the duty pump trips and nothing starts; engine shutdown or blackout follows.',
        'Pressure switches / transmitters with blocked or closed impulse lines – auto start does not work when needed.',
        'Wrong rotation after motor replacement – the pump gives low pressure and nobody notices for weeks.',
        'Deck and submersible motors with low insulation because heaters were off or terminal boxes leaked.',
        'Overload relays set too high “to stop nuisance trips” – the real problem (bearing, misalignment) burns the motor.',
        'Remote emergency stops that do not work – found only during a survey or, worse, during a fire.',
        'Pumps not restarting after blackout because the restart sequence was never tested after an IAS / PMS change.',
        'Dry-running sewage, bilge and progressive cavity pumps – stators destroyed in minutes.']) +
      H('Lessons for the ETO') + L([
        'Treat every “standby pump started” alarm as a fault until the cause is known.',
        'Test auto start, changeover, remote stops and blackout restart regularly – hidden failures are found only by testing.',
        'Log normal running current and pressure for each important pump – deviations are early warnings.',
        'Find the root cause of overload trips before resetting more than once.',
        'Work together with the engineers – most pump faults have both a mechanical and an electrical side.',
        'Keep drawings, VFD parameters and set-point lists up to date after any change.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Pumps (Guide)', icon: '💧', accent: '#0891b2',
    subtitle: 'Pumps on ships and offshore units from the ETO point of view – types, services, motors, starters and VFDs, automation, protection, affinity laws, cavitation, Ex pumps, remote stops, maintenance, troubleshooting and lessons learned.',
    refs: ['SOLAS Ch. II-1 / II-2', 'FSS Code', 'IEC 60092', 'IEC 60079', 'Class rules'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
