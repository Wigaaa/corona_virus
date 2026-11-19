(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values are typical. The crane maker’s manual, the certification body / class, flag state and the applicable standard (e.g. API 2C, EN 13852, LOLER) always govern.</p>';

  const S = [
    ['overview', '🏗️', 'Overview & crane types', () =>
      `<p>Ships and offshore units use cranes for provisions, hose handling, cargo, deck equipment, subsea work and personnel transfer. For the ETO a crane is a complete system: a <b>prime mover</b> (electric motor or diesel engine), a <b>drive</b> (hydraulic or electric), a <b>control and safety system</b> (PLC, LMI, limits) and its <b>power supply</b> from the ship’s switchboard or its own engine.</p>` +
      H('Crane types') + TB(['Type', 'Description', 'Typical use'], [
        ['Pedestal crane (offshore)', 'Revolving upper structure on a fixed pedestal with slewing ring; lattice or box boom', 'Platform supply, cargo and container lifts on rigs / FPSOs'],
        ['Knuckle boom crane', 'Folding main and outer (knuckle) boom, compact stowage, hydraulic cylinders', 'Provision, hose and deck cranes; offshore service and subsea cranes'],
        ['Lattice boom crane', 'Long steel lattice boom luffed by wire ropes; high capacity / reach', 'Platform cranes, heavy lift and construction vessels'],
        ['Telescopic boom crane', 'Box boom sections extended hydraulically', 'Provision and service cranes, rescue boat davits'],
        ['Provision / stores crane', 'Small electro-hydraulic crane, often radio remote or local control', 'Stores, spare parts, garbage'],
        ['Gantry crane', 'Bridge running on rails along the deck or engine room; trolley with hoist', 'Container / cargo handling, engine room overhead cranes, pipe-handling'],
        ['Cargo / hose handling crane', 'Deck crane at manifold or cargo hatch', 'Tankers (hose), bulk and general cargo']]) +
      H('Main motions') + L([
        '<b>Hoist</b> – main / auxiliary (whip) winch lifting the hook.',
        '<b>Luff</b> – raising / lowering the boom (cylinder or luffing winch).',
        '<b>Slew</b> – rotation of the upper structure on the slewing ring (hydraulic or electric slew drives with brakes).',
        '<b>Telescope / knuckle</b> – extra boom motions on knuckle and telescopic cranes.',
        '<b>Travel</b> – gantry and trolley travel on rails.']) +
      `<p>Related pages: ${A('crane.html', 'Crane calculations')}, ${A('vfd.html', 'VFD / Drives')}, ${A('dieselgen.html', 'Diesel Generators guide')}.</p>` + NOTE
    ],
    ['prime', '⚙️', 'Prime movers: electric vs diesel', () =>
      `<p>The <b>prime mover</b> is what supplies the energy: either an <b>electric motor</b> fed from the ship / platform switchboard, or a <b>diesel engine</b> on the crane itself. Most cranes then convert this into hydraulic power; all-electric cranes use the motor power directly via VFDs.</p>` +
      TB(['Aspect', 'Electric motor driven', 'Diesel engine driven'], [
        ['Energy source', 'Main / emergency switchboard via slip rings or cable', 'Own fuel tank on the crane; independent of the ship power'],
        ['Typical application', 'Ships, FPSOs, platforms with ample power; provision and deck cranes', 'Fixed platforms, jack-ups, older units, where crane must work without platform power'],
        ['Start', 'DOL, star-delta or soft starter (HPU motor); VFD (all-electric)', 'Electric (24 V battery) or air / hydraulic starter'],
        ['Power quality impact', 'High inrush at start; large step loads; harmonics if VFD', 'None on ship grid (only small 24 V / lighting supply)'],
        ['Hazardous area', 'Ex motor (Ex d / Ex e / Ex p) and Ex electrical equipment if in zone', 'Spark-arrested exhaust, air-intake shut-off (rig saver), surface temperature limits, Ex starter and alternator'],
        ['Maintenance', 'Insulation, bearings, starter, slip rings', 'Engine oil, filters, coolant, fuel system, batteries, plus all engine safeties'],
        ['Noise / emissions', 'Low at the crane', 'Engine noise, exhaust, fuel handling and fire risk'],
        ['Redundancy', 'Often two HPU motors / pumps; supply from two boards possible', 'Single engine typical; emergency lowering by accumulator or hand pump'],
        ['Response to load', 'Constant-speed motor; pumps control flow', 'Governor must hold speed under sudden pump load; risk of engine stall']]) +
      H('Key points') + L([
        'Electric HPU motors are usually <b>squirrel-cage induction motors</b> running at constant speed; the variable-displacement pumps vary flow and pressure.',
        'Diesel cranes are self-contained – the ETO still looks after the starting batteries, charging alternator, engine safety system, Ex equipment and control electronics.',
        'Hybrid concepts exist: diesel with electric back-up, or electric crane with an emergency power pack.']) + NOTE
    ],
    ['hyd', '🛢️', 'Electro- & diesel-hydraulic systems', () =>
      H('Hydraulic power unit (HPU)') + L([
        'Prime mover (electric motor or diesel engine) drives one or more <b>pumps</b> – usually axial piston, variable displacement, with pressure / load-sensing control; gear pumps for auxiliaries.',
        'Hydraulic motors drive the hoist and slew; cylinders do the luffing / knuckle motions.',
        '<b>Control valves</b>: proportional / servo valves operated by joystick signals (electro-hydraulic) or pilot pressure (hydraulic joysticks).',
        '<b>Counterbalance / load-holding valves</b> on cylinders and hoist motors prevent the load from dropping on hose failure.',
        '<b>Brakes</b>: spring-applied, hydraulically released – fail-safe (brake applies on loss of pressure).',
        'Oil tank, filters (pressure / return, clog indicators), oil cooler (air or sea-water), heater, level and temperature switches.']) +
      H('Electro-hydraulic – electrical points') + L([
        'HPU motor starter: <b>star-delta or soft starter</b> typical to limit inrush; pumps unloaded (destroked) during start.',
        'Motor protection: overload, thermistors / PTC, earth fault; space heater when stopped.',
        'Auxiliaries: oil cooler fan / circulation pump, tank heater, filter clog switches, level and temperature switches – all interlocked to the control system.',
        'Start interlock typical: oil level OK, temperature OK, no E-stop, control system healthy.']) +
      H('Diesel-hydraulic – engine and safeties') + L([
        '<b>Start / stop</b>: from the cab, with pre-start checks; cranking via 24 V starter or air starter; stop by fuel solenoid (energise-to-run or energise-to-stop – know which).',
        '<b>Governor</b>: mechanical or electronic; must keep speed under sudden pump load – pump power limiting (torque / horsepower control) prevents stalling.',
        '<b>Engine safeties</b>: low lube oil pressure, high coolant temperature, overspeed shutdown; alarms for low coolant level, charging failure.',
        '<b>Hazardous area</b>: <b>air-intake shut-down valve</b> (rig saver) closes on overspeed or gas detection to stop a runaway engine drawing in gas; spark arrestor and cooled exhaust; surface temperature limits; Ex-rated starter, alternator and sensors.',
        'Gas detection at the air intake may trip the engine automatically (platform philosophy).',
        'Batteries: two banks or a dedicated start battery; check charge and electrolyte / condition.']) + NOTE
    ],
    ['elec', '🔌', 'All-electric VFD cranes & regeneration', () =>
      `<p>All-electric cranes drive the hoist, luff and slew winches with <b>AC motors fed by VFDs</b>, replacing the HPU. Advantages: higher efficiency, precise control, fewer oil leaks, less maintenance; drawbacks: more power electronics, harmonics and regenerated energy to handle. See ${A('vfd.html', 'VFD / Drives')}.</p>` +
      TB(['Item', 'Typical arrangement'], [
        ['Hoist drive', 'Induction or PM motor, closed-loop vector control with encoder, holding brake controlled by the drive'],
        ['Slew drive', 'Several motors with gearboxes on the slewing ring, load-sharing between drives'],
        ['Luff drive', 'Luffing winch (lattice) or electric actuators; brake and limit supervision'],
        ['DC bus', 'Common DC bus links drives – lowering energy from hoist feeds slew / luff'],
        ['Braking energy', 'Brake chopper + resistor, or Active Front End (AFE) returning power to the grid'],
        ['Mechanical brakes', 'Spring-applied, electrically released; drive proves torque before releasing (brake test / torque proving)'],
        ['Harmonics', '6-pulse rectifiers produce harmonics; AFE, 12/18-pulse or filters reduce THD']]) +
      H('Regeneration') + L([
        'When <b>lowering a load</b> or braking a slew, the motor acts as a generator and energy flows back to the DC bus.',
        '<b>Brake resistors</b>: energy burnt as heat – check resistor temperature, cooling and chopper alarms.',
        '<b>AFE</b>: energy returned to the switchboard – the generators may see <b>reverse power</b> if ship load is low; PMS / generator reverse-power protection must be considered.',
        'Energy storage (supercapacitors / batteries) is used on some cranes to smooth peaks.']) +
      H('Safety functions in the drive') + L([
        'Safe Torque Off (STO) for emergency stop, overspeed monitoring, brake supervision, torque proving before brake release.',
        'Load must never be held by the drive alone during maintenance – mechanical brake and blocking.']) + NOTE
    ],
    ['ctrl', '🎛️', 'Control system, slip rings & communication', () =>
      H('Control system') + L([
        '<b>PLC</b> (often safety PLC) reads joysticks, sensors and limits and commands valves / drives.',
        '<b>Cab</b>: joysticks (proportional), operator display (load, radius, angle, alarms), E-stop, mode selectors, heating / AC, wipers and lights.',
        '<b>Radio remote control</b>: belly-box with E-stop – common on provision and knuckle-boom cranes; check batteries and that the radio stop is tested.',
        'Local control stations, maintenance / bypass key switches (to be under strict control).',
        'Fieldbus (CANbus, Profibus / Profinet) between cab, PLC and drives.']) +
      H('Slip rings & slewing power transfer') + L([
        'Power, control and signals pass from the fixed pedestal to the rotating crane through an <b>electrical slip ring</b> (power rings, signal rings, sometimes fibre-optic rotary joint) and a <b>hydraulic swivel</b>.',
        'Typical faults: worn brushes, carbon dust causing earth faults, moisture ingress, loose connections, noise on signal rings.',
        'Check: brush wear, cleanliness, insulation resistance, heater, seals; some cranes have limited slew with cable loop instead of slip ring.']) +
      H('Communication & interfaces') + L([
        'Crane status, alarms and E-stop to the ship / platform control system.',
        'Gas detection / ESD signals to stop the crane (platform philosophy).',
        'Talk-back / radio between crane operator and banksman; CCTV on hook and winches.',
        'Data logger (black box) recording loads, overloads and safety events.']) + NOTE
    ],
    ['safety', '🛑', 'Safety systems', () =>
      TB(['Function', 'Purpose', 'Typical implementation'], [
        ['LMI / SLI', 'Load moment / safe load indicator – compares actual load with the load chart at the current radius', 'Load cell or pressure transducers, boom angle sensor, slew position; warns at about 90 % and cuts out motions that increase moment at 100 % (typical)'],
        ['MOPS', 'Manual overload protection – operator releases the load in an emergency (e.g. hook snagged on supply vessel)', 'Pushbutton / guarded switch opening the hoist to free spooling at controlled tension'],
        ['AOPS', 'Automatic overload protection – crane releases automatically under gross overload to protect structure', 'Pressure / load triggered relief of hoist; activates above rated capacity'],
        ['Gross overload protection', 'Protects the weakest structural point (boom, pedestal) from catastrophic overload', 'Defined in API 2C / EN 13852; ensures failure mode in a safe sequence'],
        ['Hoist limits', 'Upper and lower hook limits; minimum wraps on drum (typically 3 dead wraps)', 'Rotary cam limit on winch, anti-two-block switch'],
        ['Anti-two-block', 'Stops hoist before hook block hits boom tip', 'Weight-operated switch at boom head'],
        ['Boom angle limits', 'Max / min boom angle and end-stops', 'Inclinometer and limit switches; cushioning near end'],
        ['Slew limits', 'Restricted sectors (accommodation, helideck, other equipment)', 'Encoder or cam switches with slowdown and stop zones'],
        ['Emergency stop', 'Stops all motions and brakes apply', 'Hard-wired, fail-safe (de-energise to stop) in cab, remote and pedestal'],
        ['Emergency lowering / EOPS', 'Bring a suspended load down after loss of power or prime mover', 'Accumulator, hand pump, manual brake release with controlled lowering, or emergency power pack'],
        ['Wind speed', 'Stop operations above allowed wind', 'Anemometer at boom head / cab; alarm and display'],
        ['Heave compensation (AHC / PHC)', 'Reduce relative motion of load and seabed / vessel', 'Active (MRU-controlled winch) or passive (gas-spring cylinder) systems']]) +
      H('Key points') + L([
        'Bypass or override of limits / LMI is allowed only under procedure, with key switch control and logging – many incidents begin with a bypass.',
        'Limit switches and E-stops are <b>fail-safe</b>: wire break must stop the motion.',
        'LMI accuracy depends on calibration – after sensor replacement a re-calibration and check with test weight is typical.',
        'Personnel lifting requires the crane to be rated and certified for it (extra safeties, emergency lowering).']) + NOTE
    ],
    ['cert', '📜', 'Certification, inspection & load testing', () =>
      TB(['Standard / rule', 'Scope'], [
        ['API Spec 2C', 'Design of offshore pedestal-mounted cranes (load charts, dynamic factors, gross overload)'],
        ['API RP 2D', 'Operation and maintenance of offshore cranes, inspection categories, operator qualification'],
        ['EN 13852-1 / -2 / -3', 'European offshore cranes: general purpose, floating, light offshore cranes'],
        ['LOLER / PUWER (UK)', 'Thorough examination of lifting equipment – typically 6-monthly for personnel lifting / accessories, 12-monthly otherwise'],
        ['ILO C152 / SOLAS II-1/3-13', 'Lifting appliances on ships: testing and thorough examination'],
        ['Class rules (DNV, ABS, LR, BV)', 'Lifting appliance certification and register of lifting appliances / gear']]) +
      H('Load testing (typical)') + L([
        'Initial and periodic proof load tests with <b>test weights or water bags</b>, at the factor in the applicable rules (often 1.1–1.25 × SWL or a sliding scale – check the rule).',
        'Typical periodic re-test interval 5 years, plus after major repair, modification or replacement of load-bearing parts.',
        'Tests include: hoist, brakes holding test load, slewing, luffing, limits, LMI accuracy, overload protections.',
        'Results recorded in the <b>register of lifting appliances</b> / crane certificate; competent person signs.']) +
      H('Inspections') + L([
        'Pre-use (daily) by the operator, periodic by the competent person, thorough examination annually (typical).',
        'Wire ropes: wear, broken wires, corrosion; discard criteria per ISO 4309 / maker.',
        'Slewing ring bolts and bearing wear (rocking / tilt test).',
        'Electrical: insulation, Ex inspection (if in hazardous area) to IEC 60079-17.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'Crane <b>power supply</b>: which switchboard / breaker feeds it, cable rating, and the effect of starting the HPU motor or running VFD cranes on the generators.',
        'Inform the engine room before starting large crane motors; <b>heavy-consumer start</b> via PMS may be required. See ' + A('dieselgen.html', 'Diesel Generators guide') + '.',
        'All-electric cranes with AFE can <b>regenerate</b> into the switchboard – watch reverse power with low ship load.',
        'Starter type (DOL, star-delta, soft starter, VFD) and its settings and protection.',
        'Control circuit and E-stop philosophy; where the PLC program and backups are kept.',
        'Slip ring arrangement and how to isolate and lock the crane safely.',
        'LMI / SLI sensors, calibration procedure and test weights.',
        'For diesel cranes: engine safety system, start batteries, charging, air-intake shut-off valve and Ex equipment.',
        'Emergency lowering procedure – practise it.',
        'Hazardous area zoning around the crane and Ex certification of the equipment.',
        'Certificates, test dates and the register of lifting appliances.',
        'Never bypass a limit or LMI without permit, authorisation and logging.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Before each use', 'Operator pre-use check: E-stop, limits, LMI display, brakes, wind, alarms, radio remote test'],
        ['Weekly', 'HPU oil level / temperature, filter indicators, leaks; diesel: fuel, oil, coolant, battery voltage; lights and wipers'],
        ['Monthly', 'Test hoist / boom / slew limits and anti-two-block; E-stops (cab, remote, pedestal); emergency lowering function check; heaters'],
        ['3-monthly', 'Slip ring inspection and cleaning; motor and starter checks; insulation readings; LMI zero check; engine safety trip tests (diesel)'],
        ['6-monthly', 'Brake test; AOPS / MOPS function test per maker; wire rope inspection; contactor and terminal tightness; battery capacity'],
        ['Yearly', 'Thorough examination; LMI calibration verification; insulation test of motors and cables; Ex inspection; oil analysis; PLC backup'],
        ['5-yearly (typical)', 'Load test with test weights / water bags; major survey; slewing ring and bolt checks']]) +
      L(['Follow the maker’s planned maintenance – intervals vary by crane and duty.', 'Record all tests and findings; they are checked by class, flag, client and the competent person.', 'Isolate and lock out the crane (and lower / secure the load and boom) before any electrical work.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['HPU motor will not start', 'E-stop active, low oil level or temperature interlock, starter / overload tripped, supply breaker open', 'Check interlock list on PLC, reset E-stop chain, check overload and supply'],
        ['HPU motor trips on start', 'High inrush, pumps not unloaded, star-delta timer wrong, low voltage, motor fault', 'Check pump destroke valve, starter timing, voltage dip, insulation and winding resistance'],
        ['Generator overload / blackout when crane starts', 'Insufficient online power, no heavy-consumer request, DOL start', 'Start extra generator, check PMS start request and soft starter'],
        ['Diesel engine will not crank', 'Flat batteries, starter solenoid, E-stop, start interlock', 'Battery voltage under cranking, cables, starter relay, interlocks'],
        ['Diesel engine cranks but will not start', 'Fuel solenoid, air-intake shut-off valve closed, fuel supply / air in fuel, filters', 'Check rig saver reset, fuel solenoid supply, bleed fuel system'],
        ['Diesel engine shuts down in operation', 'Low oil pressure, high coolant temperature, overspeed, gas detection, intake valve tripped', 'Read shutdown indication, check sensors and wiring, reset only after cause found'],
        ['Engine stalls or speed drops under load', 'Governor fault, pump power limiter setting, fuel restriction', 'Check governor and actuator, pump torque limit, fuel filters'],
        ['Crane motions slow or no motion', 'Low pressure, pump control fault, LMI cut-out, valve coil or amplifier fault', 'Check pressures, LMI status, coil voltage and resistance, amplifier signals'],
        ['LMI shows wrong load / unexpected cut-out', 'Sensor fault or drift, calibration, angle sensor, cable damage', 'Compare with known weight, check sensor signals, recalibrate per maker'],
        ['Earth fault when crane slews', 'Slip ring contamination, moisture, damaged cable loop', 'Clean and dry slip ring, insulation tests per ring, check seals and heater'],
        ['VFD fault overvoltage when lowering', 'Brake chopper / resistor fault, AFE fault, decel too fast', 'Check resistor and chopper, AFE status, drive parameters'],
        ['Brake does not release / load creeps', 'Brake coil or release pressure fault, worn linings, counterbalance valve leak', 'Stop operation, secure load; check brake supply, linings, valves'],
        ['Radio remote not working', 'Battery, pairing, receiver fault, E-stop on transmitter', 'Change battery, check receiver LEDs and stop circuit'],
        ['High hydraulic oil temperature', 'Cooler fan / pump fault, fouled cooler, internal leakage', 'Check cooler motor and starter, cooler cleanliness, temperatures']]) + NOTE
    ],
    ['lessons', '📚', 'Safety & lessons', () =>
      H('Common causes of crane incidents') + L([
        'Overload or lifting outside the load chart – often with LMI bypassed or faulty.',
        'Limit or anti-two-block failure, untested or bypassed.',
        'Brake failure and load drop; hydraulic hose failure without load-holding valves.',
        'Wire rope failure from poor inspection.',
        'Power loss with suspended load and no tested emergency lowering.',
        'Diesel engine runaway in a gas cloud without an air-intake shut-off.',
        'Poor communication between operator, banksman and deck crew; dynamic lifts from supply vessels in bad weather.']) +
      H('Lessons for the ETO') + L([
        'Test safety functions regularly and record it – hidden failures are found only by testing.',
        'Never leave a bypass in place; control bypass keys.',
        'Lock out and secure the load and boom before working on the crane.',
        'Check the generator capacity before heavy lifts, and agree with the engine room.',
        'Keep slip rings clean and dry – they cause many earth faults and control problems.',
        'Keep PLC and drive backups and document all changes (MoC).',
        'Know and practise emergency lowering.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Cranes (Guide)', icon: '🏋️', accent: '#a16207',
    subtitle: 'Ship and offshore cranes for the ETO – crane types, electric motor vs diesel engine prime movers, electro-hydraulic, diesel-hydraulic and all-electric VFD drives, control and slip rings, safety systems (LMI, AOPS, MOPS, limits, emergency lowering), certification, maintenance and troubleshooting.',
    refs: ['API Spec 2C', 'API RP 2D', 'EN 13852', 'LOLER / ILO C152', 'Class rules for lifting appliances'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
