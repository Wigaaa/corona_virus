(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance for typical shipboard chiller and provision refrigeration plants. Maker manuals, refrigerant (F-gas / ozone) regulations, flag and class rules and the company SMS always govern. Values shown are typical only.</p>';

  const S = [
    ['overview', '❄️', 'Overview & refrigeration cycle', () =>
      `<p>Ships carry two main refrigeration systems: the <b>HVAC chiller plant</b>, which produces chilled water (or direct-expansion cooling) for accommodation, control rooms and equipment spaces, and the <b>provision refrigeration plant</b>, which keeps cold rooms and freezer rooms for food stores. Both use the <b>vapour-compression cycle</b>; the ETO looks after motors, starters, controls, safety switches, sensors and alarms.</p>` +
      H('Vapour-compression cycle') + TB(['Component', 'What happens', 'Refrigerant state'], [
        ['Compressor', 'Raises pressure and temperature of the refrigerant vapour drawn from the evaporator', 'Low-pressure vapour in, high-pressure hot vapour out'],
        ['Condenser', 'Rejects heat to sea water / fresh water (or air); vapour condenses to liquid', 'High-pressure vapour to high-pressure liquid'],
        ['Receiver / filter drier / sight glass', 'Stores liquid, removes moisture and dirt, shows liquid flow (bubbles = possible shortage)', 'High-pressure liquid'],
        ['Expansion device (TXV / EEV / capillary / orifice)', 'Drops pressure and meters liquid into the evaporator', 'Liquid to low-pressure liquid + flash gas'],
        ['Evaporator', 'Absorbs heat from water (chiller) or air (cold room); refrigerant boils', 'Low-pressure liquid to low-pressure vapour']]) +
      H('Superheat & subcooling (basics)') + L([
        '<b>Superheat</b> = suction line temperature minus evaporating (saturation) temperature at suction pressure. It proves only vapour returns to the compressor. Too low: risk of liquid floodback; too high: starved evaporator, poor capacity, hot compressor.',
        '<b>Subcooling</b> = condensing (saturation) temperature minus liquid line temperature. It shows the condenser and charge condition and ensures solid liquid at the expansion valve.',
        'Saturation temperatures are read from the refrigerant’s pressure–temperature table or gauge scale – they are <b>refrigerant-specific</b>.',
        '<b>TXV</b> (thermostatic expansion valve) controls superheat mechanically with a bulb on the suction line; <b>EEV</b> (electronic expansion valve) is driven by a controller using pressure and temperature sensors (stepper motor or pulse-width valve).']) +
      `<p>Related pages: ${A('motor.html', 'Motors')}, ${A('tempsensors.html', 'Temperature Sensors')}, ${A('pumps.html', 'Pumps guide')}.</p>` + NOTE
    ],
    ['refrig', '🧪', 'Refrigerants & environment', () =>
      TB(['Refrigerant', 'Type', 'Typical marine use', 'Notes'], [
        ['R404A', 'HFC blend', 'Provision plants (low temperature)', 'Very high GWP – being phased down and replaced in many fleets'],
        ['R134a', 'HFC single', 'Chillers (screw / centrifugal), AC', 'Medium-high GWP; lower pressures'],
        ['R407C', 'HFC blend (zeotropic)', 'AC plants, R22 replacement', 'Temperature glide – charge as liquid'],
        ['R410A', 'HFC blend (near-azeotropic)', 'Packaged AC, scroll units', 'High working pressures – use rated tools and hoses'],
        ['R449A', 'HFO/HFC blend', 'Provision plant R404A replacement', 'Lower GWP; glide; check oil and component compatibility'],
        ['R513A', 'HFO/HFC blend', 'R134a replacement in chillers', 'Lower GWP; close to R134a in behaviour'],
        ['R717 (NH3, ammonia)', 'Natural', 'Rare on ships (fishing / reefer vessels)', 'Toxic and flammable in some concentrations – special rules, detection and ventilation'],
        ['R22 (HCFC)', 'Ozone-depleting', 'Older installations only', 'New installations prohibited under MARPOL Annex VI; servicing restricted']]) +
      H('Environment & regulations (general)') + L([
        '<b>MARPOL Annex VI Reg. 12</b>: no deliberate emissions of ozone-depleting substances; new installations with ODS are prohibited; ships keep an <b>ODS record book</b> and equipment list where required.',
        '<b>F-gas regulations</b> (e.g. EU F-gas rules) phase down HFCs by GWP – expect retrofits to lower-GWP refrigerants and restrictions on servicing with high-GWP gases.',
        'Periodic <b>leak checks</b> are required, with intervals depending on charge size (CO₂-equivalent) and whether automatic leak detection is fitted – follow the applicable regulation and company procedure.',
        'Record every refrigerant addition, recovery and leak repair. Refrigerant must be <b>recovered</b>, never vented.',
        'Handling refrigerant normally requires <b>certified personnel</b>; the ETO typically supports with electrical work and leak detector maintenance.',
        'Never mix refrigerants; label the system clearly after a retrofit (refrigerant and oil type).']) + NOTE
    ],
    ['hvac', '🏢', 'HVAC chiller plant structure', () =>
      TB(['Item', 'Function', 'ETO interest'], [
        ['Chiller unit(s)', 'Compressor, evaporator (water chiller), condenser, controls in one skid', 'Starter / VFD, controller, safety chain, alarms'],
        ['Compressor types', 'Reciprocating, scroll, screw (slide valve), centrifugal (inlet guide vanes / VFD)', 'Starting method, capacity control, oil system'],
        ['Chilled water pumps', 'Circulate chilled water (typical 6–12 °C) to AHUs and fan coils; duty / standby', 'Motors, starters, auto changeover, flow switch'],
        ['Condenser cooling', 'Sea water (direct or via central FW cooling) removes heat from the condenser', 'SW pump, flow switch, high condenser pressure alarms'],
        ['Air handling units (AHU)', 'Fans, filters, chilled water coils, heaters, humidifiers; supply conditioned air', 'Fan motors / VFDs, heaters, dampers, thermostats'],
        ['Fan coil units / cabin units', 'Local cooling with room thermostat and valve', 'Small motors, valves, controls'],
        ['Expansion tank / water treatment', 'Keeps chilled water pressure and quality', 'Low pressure switch / level alarm'],
        ['Fire dampers & vent control', 'Isolate ducts in fire; fans stop on fire alarm', 'Damper actuators, limit switches, shutdown circuits']]) +
      H('Key points') + L([
        'Chilled water <b>flow must be proven</b> (flow switch / differential pressure) before a chiller compressor is allowed to run – otherwise the evaporator can freeze.',
        'Most ships have two or more chillers or compressors for redundancy; some systems sequence units by load.',
        'Low chilled-water temperature (anti-freeze) and low evaporating pressure protections stop the compressor before ice forms in the evaporator tubes.',
        'Condenser fouling (sea water side) is a frequent cause of high-pressure trips in warm waters.']) + NOTE
    ],
    ['prov', '🥩', 'Provision plant (cold rooms, defrost)', () =>
      TB(['Room', 'Typical temperature', 'Notes'], [
        ['Meat / fish freezer room', 'Typical about −18 to −25 °C', 'Defrost needed; door and drain heaters'],
        ['Vegetable / fruit room', 'Typical about +2 to +8 °C', 'Often off-cycle defrost'],
        ['Dairy / chill room', 'Typical about 0 to +4 °C', 'Some plants use electric defrost'],
        ['Lobby / handling room', 'Typical cooled, above freezing', 'Reduces warm air entering freezers']]) +
      H('Plant arrangement') + L([
        'Usually <b>two compressors</b> (duty / standby, sometimes both running at high load) with a common condenser or one each, cooled by sea water or the central cooling system.',
        'Each room has an evaporator (air cooler) with <b>fans</b>, a <b>liquid line solenoid valve</b> controlled by the room thermostat, and an expansion valve.',
        'Compressor runs on <b>pump-down</b>: when all room solenoids close, suction pressure falls and the LP switch stops the compressor; it restarts when pressure rises.',
        '<b>Defrost</b>: electric heaters in the cooler fins and drip tray, or hot-gas defrost; started by a timer or controller several times per day (typical), terminated by time or by a defrost termination thermostat. Fans are stopped during defrost and restarted after a fan-delay so water drips off before blowing.',
        '<b>Drain line heaters</b> keep the defrost water drain from freezing; <b>door frame heaters</b> stop doors freezing shut.',
        '<b>Man-trapped alarm</b>: push button inside each cold room (lit, easy to find) sounding an alarm at a manned place; doors must open from inside.',
        'Room temperature recording / alarm is used for food safety (high temperature alarm, typically with delay).']) + NOTE
    ],
    ['elec', '⚙️', 'Electrical components & motor starting', () =>
      TB(['Starting method', 'Typical use', 'Notes'], [
        ['DOL (direct-on-line)', 'Small compressors, fans, pumps', 'Simple; high starting current (typical 6–8× FLC)'],
        ['Star-delta', 'Medium reciprocating / screw compressors', 'Reduced starting current; transition timer; compressor unloaded at start'],
        ['Part-winding start', 'Some semi-hermetic compressors', 'Two winding sections energised in sequence with short delay'],
        ['Soft starter', 'Screw and reciprocating compressors', 'Ramp voltage; often bypass contactor after start'],
        ['VFD', 'Screw / scroll / centrifugal compressors, pumps, AHU fans', 'Capacity control plus soft start; harmonics, EMC and cooling of the drive'],
        ['Starter in chiller package', 'Centrifugal / large screw', 'Maker-specific (VFD, solid-state, autotransformer)']]) +
      H('Other electrical items') + L([
        '<b>Crankcase / oil sump heater</b>: keeps oil warm when the compressor is stopped so refrigerant does not dissolve in the oil (causing foaming and oil loss at start). Typically energised whenever the compressor is off; must be on for hours before starting after a long shutdown – follow the maker.',
        '<b>Capacity control</b>: cylinder unloaders (reciprocating), slide valve (screw), inlet guide vanes or speed (centrifugal), speed (VFD), hot-gas bypass.',
        '<b>Motor protection</b>: thermal overload / motor protection relay, internal winding thermistors (PTC) with protection module, phase-failure / phase-sequence relay.',
        '<b>Hermetic and semi-hermetic motors</b> are refrigerant-cooled – low suction flow (low charge) makes them overheat.',
        'Insulation testing of hermetic motor windings only as the maker allows – <b>never megger a hermetic compressor while the system is under vacuum</b> (risk of winding damage).',
        'Solenoid valve coils, fan motors, defrost heaters, drain / door heaters and control transformers are all in the plant panel.',
        `See ${A('motor.html', 'Motors')} for starting current and protection calculations.`]) + NOTE
    ],
    ['controls', '🎛️', 'Controls, sensors & safety switches', () =>
      TB(['Device', 'Function', 'Typical action'], [
        ['HP switch (high pressure)', 'Protects against excessive discharge pressure', 'Stops compressor; usually manual reset'],
        ['LP switch (low pressure)', 'Pump-down control and protection against low suction pressure', 'Stops compressor; auto reset for pump-down, sometimes manual for safety'],
        ['Oil pressure differential switch', 'Ensures oil pressure above crankcase pressure (reciprocating)', 'Trips after a time delay at start; manual reset'],
        ['Oil level / oil flow switch', 'Screw compressor lubrication', 'Trip and alarm'],
        ['Discharge temperature sensor / thermostat', 'Protects compressor and oil from overheating', 'Trip and alarm'],
        ['Motor thermistors (PTC)', 'Winding temperature', 'Trip via protection module'],
        ['Room thermostats / sensors', 'Open / close liquid solenoid valves, alarm on high temperature', 'Control and alarm'],
        ['Chilled water temperature sensors', 'Control capacity and protect against freezing', 'Capacity step / trip'],
        ['Flow switches', 'Prove chilled water and condenser water flow', 'Interlock with compressor start'],
        ['Solenoid valves', 'Liquid line, hot gas, unloaders', 'Open on coil energised (typical)'],
        ['Anti-short-cycle timer', 'Minimum off-time / starts per hour', 'Delays restart'],
        ['Phase monitoring relay', 'Phase loss, sequence, unbalance', 'Prevents start / stops compressor']]) +
      H('Notes') + L([
        'Set-points of pressure switches depend on the <b>refrigerant, application and maker</b> – always use the maker’s settings list; do not copy values from another plant.',
        'Pressure transducers (typical 4–20 mA or ratiometric) feed electronic controllers; check them against calibrated gauges.',
        'Temperature sensors are usually NTC, PTC or Pt100/Pt1000 – see ' + A('tempsensors.html', 'Temperature Sensors') + ' for resistance tables and checks.',
        'Safety switches must be tested for function – a stuck HP switch is a hidden failure.',
        'Never bridge a safety switch to keep a plant running except as a controlled, temporary, risk-assessed measure with the chief engineer’s approval and continuous supervision.']) + NOTE
    ],
    ['alarms', '🚨', 'Alarms & interfaces', () =>
      TB(['Alarm', 'Usual cause', 'Where shown'], [
        ['HP trip', 'Condenser cooling loss, fouled condenser, overcharge, non-condensables', 'Local panel, IAS'],
        ['LP trip', 'Low charge / leak, iced evaporator, blocked filter drier, expansion valve fault, low load', 'Local panel, IAS'],
        ['Motor overload / thermistor trip', 'High load, low voltage, phase loss, winding or bearing fault', 'Local panel, IAS'],
        ['Oil failure', 'Low oil level, oil foaming, pump fault, oil logging in system', 'Local panel, IAS'],
        ['High discharge temperature', 'High superheat, low charge, high compression ratio, valve damage', 'Local panel, IAS'],
        ['Refrigerant leak detector', 'Leak in machinery or plant room', 'Local, IAS; may start extraction fan'],
        ['Cold room high temperature', 'Door open, defrost fault, compressor / fan failure', 'Galley / ECR / IAS'],
        ['Man-trapped alarm', 'Person inside a cold room pressed the button', 'Galley / bridge / ECR as designed'],
        ['Chilled water low flow / low temperature', 'Pump stopped, valve closed, freezing risk', 'Chiller panel, IAS'],
        ['Common fault / power failure', 'Control power lost, breaker tripped', 'IAS']]) +
      H('Interfaces') + L([
        '<b>IAS / alarm monitoring</b>: common alarm or individual alarms via volt-free contacts or serial link (e.g. Modbus) – check the alarm list and test periodically.',
        '<b>Fire alarm / fire dampers</b>: on fire alarm or release of fixed fire extinguishing, ventilation fans stop and fire dampers close (automatic or from fire control station).',
        '<b>Emergency stops</b>: ventilation emergency stops from outside the spaces; AC fans stopped from the bridge / fire station.',
        '<b>Refrigerant leak detection</b> may start mechanical extraction in the refrigeration machinery room.',
        '<b>PMS / heavy consumer</b>: large chiller compressors may need power available before starting.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The plant <b>wiring diagrams</b>: safety chain order, control voltage, which contact gives which alarm to the IAS.',
        'The refrigeration cycle well enough to read suction / discharge pressures, superheat and subcooling with the engineers.',
        'Compressor starting method, starter timers, crankcase heater circuit and anti-short-cycle timers.',
        'Settings of controllers, thermostats and pressure switches – keep a <b>settings list</b> and backup of controller parameters.',
        'Defrost sequence: timer / controller, heaters, termination thermostat, fan delay, drain heaters.',
        'Man-trapped alarm circuits and cold room door heaters.',
        'Fire damper and ventilation shutdown circuits and their test procedure.',
        'Refrigerant leak detector type, calibration and alarm set-points (maker-specific).',
        'Pumps and fans: duty / standby changeover logic – see ' + A('pumps.html', 'Pumps guide') + '.',
        'Your role vs. the certified refrigeration engineer: the ETO does electrical and controls; refrigerant circuit work only if qualified and authorised.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily', 'Check room temperatures and logs, compressor running hours / starts, suction and discharge pressures, oil level sight glass, liquid sight glass, alarm list'],
        ['Weekly', 'Check evaporators for ice build-up and defrost operation, door seals and heaters, drain lines, chilled water pumps and flow, panel indications'],
        ['Monthly', 'Test man-trapped alarms, high temperature alarms, leak detector function (as per maker), check heaters current, inspect contactors'],
        ['3-monthly', 'Test HP / LP / oil pressure switches (where safe and per procedure), verify sensors vs. reference thermometer / gauge, check fan motors'],
        ['6-monthly', 'Tighten terminals (isolated), thermographic check of panels under load, check VFD / soft starter fans and filters, clean condenser / coil (with engineers)'],
        ['Yearly', 'Insulation resistance of motors and heaters (per maker), calibration of leak detectors, fire damper and ventilation shutdown tests, controller backups'],
        ['As required by regulation', 'Refrigerant leak checks and records (interval depends on charge and regulation), ODS / refrigerant record book']]) +
      L(['Record test results and settings; maintenance is checked in PSC, class and vetting inspections.', 'Coordinate with engineers: many tasks need the plant stopped, pumped down or the system pressure controlled.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['HP trip', 'Loss of condenser SW flow, fouled condenser, overcharge, air / non-condensables, faulty switch', 'Check SW pump and valves, condenser temperatures, switch setting and function; reset only after cause found'],
        ['LP trip', 'Refrigerant shortage / leak, iced evaporator, blocked filter drier, TXV / EEV fault, solenoid not opening, low load', 'Sight glass, superheat, solenoid coil voltage, EEV driver, defrost status, leak check'],
        ['Compressor will not start', 'Safety chain open, control fuse, anti-short-cycle timer, phase relay, contactor coil, thermistor module tripped', 'Follow the safety chain with a meter; check reset states and timer; phase relay LEDs'],
        ['Short cycling', 'LP differential too small, low charge, thermostat differential, oversized plant at low load, leaking solenoid', 'Check switch settings vs. maker list, starts per hour, solenoid tightness'],
        ['High temperature in cold room', 'Door left open, fans stopped, evaporator iced, solenoid fault, compressor trips, sensor fault', 'Check door, fans, ice, thermostat / sensor, solenoid coil, compressor status'],
        ['Ice build-up / defrost failure', 'Defrost timer or controller fault, heater open circuit, termination thermostat fault, drain heater failed', 'Measure heater currents / resistance, check timer output and termination sensor, clear drain'],
        ['Oil failure trip', 'Low oil level, foaming (refrigerant in oil), crankcase heater failed, oil pump fault, oil logging', 'Check oil level, crankcase heater, oil pressure switch delay; inform engineers'],
        ['Motor overload / thermistor trip', 'High condensing pressure, low voltage, phase unbalance, bearing or winding fault, low suction flow cooling', 'Measure currents and voltages, insulation resistance, thermistor resistance'],
        ['High discharge temperature', 'High superheat, low charge, high condensing pressure, valve plate damage', 'Check superheat and pressures; with engineers'],
        ['Chiller trip on low water flow / freeze', 'Chilled water pump stopped, flow switch fault, closed valve, air in system', 'Check pump, flow switch, strainer, valves'],
        ['Star-delta / soft starter fault', 'Timer, contactor, overload setting, thyristor fault', 'Check transition, contactors, starter alarm codes'],
        ['False leak alarm', 'Sensor drift, contamination, cleaning chemicals, end of sensor life', 'Check with calibration gas per maker, replace sensor if due'],
        ['Man-trapped alarm not working', 'Lamp / button fault, cable damage, alarm unit fault', 'Test from inside each room, repair immediately – safety-critical']]) + NOTE
    ],
    ['safety', '⚠️', 'Safety & lessons', () =>
      H('Refrigerant hazards') + L([
        'Refrigerant work (charging, recovery, opening the circuit) only by <b>certified / authorised personnel</b> with proper recovery equipment.',
        '<b>Asphyxiation</b>: refrigerants are heavier than air and displace oxygen in low and enclosed spaces – ventilate, use leak detectors and portable O₂ meters; treat cold rooms and plant rooms with a large leak as dangerous spaces.',
        'Hot surfaces or open flames can decompose refrigerants into toxic products (e.g. acid gases).',
        '<b>Frostbite</b>: liquid refrigerant escaping causes freeze burns – wear gloves and eye protection.',
        '<b>Pressure</b>: systems are under pressure even when stopped; never heat a cylinder or closed liquid line; release pressure only via correct procedure.',
        'Ammonia (if fitted) is toxic – special PPE, detection and emergency procedures.']) +
      H('Electrical safety') + L([
        'Isolate, lock out and tag out before work; prove dead – control circuits may be fed from a separate supply.',
        'Crankcase heaters and some controls may be live while the compressor is stopped.',
        'VFDs and soft starters: wait for DC-link discharge as stated by the maker.',
        'Do not run compressors with safety devices bridged; restore and test after any temporary measure.']) +
      H('Lessons') + L([
        'Repeated HP / LP trips are symptoms – find the cause rather than resetting again.',
        'A failed man-trapped alarm or a door that cannot be opened from inside has caused fatalities – test them.',
        'Crankcase heater failures cause oil loss and compressor damage after long stops.',
        'Many leaks are found by the leak detector – keep detectors calibrated and alarms connected.',
        'Keep a spare thermostat, contactor, solenoid coil, defrost heater and timer on board for critical provision plant items.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Chiller & Refrigeration Plant (Guide)', icon: '❄️', accent: '#0ea5e9',
    subtitle: 'What the ETO should know about HVAC chillers and provision refrigeration plants – refrigeration cycle, refrigerants, plant structure, cold rooms and defrost, motor starting, controls and safety switches, alarms, maintenance, troubleshooting and safety.',
    refs: ['MARPOL Annex VI Reg. 12', 'F-gas regulations (e.g. EU)', 'Maker manuals', 'Class rules'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
