(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – all values are typical. The valve / actuator maker’s manuals, the vessel’s drawings and cause &amp; effect, flag requirements and class rules always govern.</p>';

  const S = [
    ['overview', '🚰', 'Overview', () =>
      `<p>A <b>remote control valve system</b> lets the crew open and close valves in tanks, pump rooms and machinery spaces from a central position (ECR, cargo control room, bridge or ballast control station) instead of going to each valve. It consists of the valves, their <b>actuators</b> (electric, hydraulic or pneumatic), the power source for the actuators, <b>position feedback</b> and a <b>control system</b> (PLC / IAS with mimic pages).</p>` +
      H('Typical applications') + TB(['System', 'Purpose', 'Typical actuator'], [
        ['Ballast', 'Trim, heel and stability control; ballast exchange / treatment', 'Electro-hydraulic (central HPU) or electric; butterfly valves'],
        ['Bilge', 'Pumping out compartments; emergency bilge suction', 'Electric or hydraulic; some manual with reach rods'],
        ['Fuel transfer', 'Bunkering, transfer between storage, settling and service tanks', 'Electric or pneumatic; quick-closing valves on tank outlets'],
        ['Cargo (tankers, gas carriers)', 'Loading, discharge, stripping, tank isolation', 'Electro-hydraulic (central HPU) or pneumatic; often in hazardous areas'],
        ['Sea chests / overboard', 'Sea water inlet and discharge isolation', 'Electric or hydraulic; large butterfly valves'],
        ['Fire main', 'Section and isolation valves, fire pump suction / discharge', 'Electric or manual; must work after power loss'],
        ['Jack-up preload / raw water', 'Filling and dumping preload tanks during jacking, raw water distribution', 'Electro-hydraulic or pneumatic; large butterfly valves, fast dump required'],
        ['Tank level / deck services', 'Watertight / gastight isolation, venting, foam, fresh water', 'Various']]) +
      H('Why it matters to the ETO') + L([
        'Valve systems are <b>electro-mechanical</b>: actuator motors, solenoid valves, limit switches, 4–20 mA signals, PLC I/O, UPS / 24 V DC and networks are all ETO responsibilities.',
        'A failed valve can stop ballasting, cargo work or jacking – and in an emergency (flooding, fire, fuel leak) it can be safety-critical.',
        'On DP vessels, remote-controlled valves (e.g. cooling water, fuel) are part of the redundancy concept and appear in the DP FMEA.']) +
      `<p>Related pages: ${A('signals.html', 'Signals &amp; Loops')}, ${A('pumps.html', 'Pumps guide')}, ${A('indcomms.html', 'Industrial Communications')}.</p>` + NOTE
    ],
    ['types', '🔩', 'Valve types & uses', () =>
      TB(['Valve type', 'Operation', 'Typical marine use', 'Notes'], [
        ['Butterfly', 'Quarter-turn (90°) disc', 'Ballast, sea water, cargo, preload – the most common remote valve', 'Compact, light, low torque; wafer or lug type; centric or double / triple offset'],
        ['Ball', 'Quarter-turn (90°) bored ball', 'Fuel, hydraulic, air, small-bore lines, tight shut-off', 'Low leakage; high break-out torque after long idle periods'],
        ['Gate', 'Multi-turn, rising or non-rising stem', 'Sea chests, large isolation, older ships', 'Full bore; slow; needs multi-turn actuator'],
        ['Globe', 'Multi-turn / linear stroke', 'Control and regulation, steam, screw-down non-return (SDNR) valves', 'Good for throttling; higher pressure drop'],
        ['Quick-closing valve', 'Spring or weight-loaded, released remotely', 'Fuel and lube oil tank outlets, emergency shut-off', 'Released by pneumatic, hydraulic, wire or electric trip from outside the space'],
        ['Non-return / SDNR', 'Self-acting (SDNR can be screwed down)', 'Bilge suctions, overboard discharges', 'Usually manual, sometimes with remote indication'],
        ['Control valve', 'Linear or rotary with positioner', 'Temperature, pressure and level control', 'Modulating – uses 4–20 mA or HART positioner']]) +
      H('Quarter-turn vs multi-turn') + L([
        '<b>Quarter-turn</b> (butterfly, ball, plug): 90° travel, needs a rotary actuator (rack and pinion, scotch-yoke, vane or electric quarter-turn gearbox).',
        '<b>Multi-turn</b> (gate, globe): many turns of a stem, needs a multi-turn electric actuator or a linear hydraulic / pneumatic cylinder.',
        '<b>On/off</b> valves only need open / closed commands and end-position feedback; <b>modulating</b> valves need a position set-point and continuous feedback.',
        'Valve size and differential pressure define the <b>torque</b>; the actuator is sized with a safety margin (typically 25–50 % above the valve maker’s break-out torque) – check the maker’s data.']) + NOTE
    ],
    ['electric', '⚙️', 'Electric actuators', () =>
      `<p>A <b>motor-operated valve (MOV) actuator</b> has an electric motor (typically 3-phase AC or 24 V DC for small units) driving the valve through a worm gear or gear train. It holds its position when de-energised because the worm gear is self-locking.</p>` +
      H('Main parts') + TB(['Part', 'Function'], [
        ['Motor', 'Usually 3-phase 400 / 440 V AC or single-phase / 24 V DC on small actuators; thermal protection (thermostat / PTC in the winding)'],
        ['Gearbox', 'Worm gear – self-locking, holds position without power'],
        ['Limit switches', 'Stop the motor at fully open / fully closed and give end-position signals'],
        ['Torque switches', 'Stop the motor when output torque exceeds the setting – protects valve and actuator; often used to seat closing on gate / globe valves'],
        ['Reversing contactors', 'Open / close direction (non-intrusive actuators have integral starters)'],
        ['Local control', 'Local / Off / Remote selector and Open / Stop / Close buttons'],
        ['Handwheel', 'Manual operation via declutch lever – motor normally re-engages automatically when it starts'],
        ['Position transmitter', 'Optional potentiometer or 4–20 mA output for continuous indication'],
        ['Space heater', 'Prevents condensation inside the housing – often left energised permanently']]) +
      H('Variants') + L([
        '<b>Fail-as-is (fail last position)</b> – the standard electric actuator; on power loss the valve stays where it is.',
        '<b>Spring-return electric</b> – a spring is wound up during opening; on power loss a brake / clutch releases and the spring drives the valve to its safe position.',
        '<b>Battery / super-capacitor back-up</b> – internal storage drives the valve to a safe position (or allows a few strokes) after power loss.',
        '<b>Intelligent / non-intrusive actuators</b> – integral starter, electronic limit and torque setting via IR remote or Bluetooth (no cover removal), diagnostics, fieldbus (Modbus, Profibus, Foundation Fieldbus, HART).',
        '<b>Modulating actuators</b> – accept a 4–20 mA position set-point; rated for frequent starts (check S4 / S5 duty rating).']) +
      H('Key points') + L([
        'Typical stroke time for a quarter-turn ballast valve: tens of seconds; large gate valves can take minutes – check against operational requirements.',
        'Phase rotation matters on 3-phase actuators: wrong rotation runs the valve the wrong way and bypasses the limit switches – some intelligent actuators correct this automatically.',
        'Limit switch and torque switch settings are made by the maker / commissioning engineer – do not change them without the procedure.']) + NOTE
    ],
    ['hydraulic', '🛢️', 'Hydraulic systems (central HPU & individual)', () =>
      H('Central HPU system') + L([
        '<b>Hydraulic power unit (HPU)</b>: tank, two (often duty / standby) electric motor-driven pumps, filters, relief valve, pressure switches / transmitters, oil level and temperature alarms.',
        '<b>Accumulators</b> (nitrogen pre-charged bladder or piston type) store energy for valve operation if the pumps stop and reduce pump starts; pumps typically start / stop on pressure switches.',
        '<b>Solenoid valve cabinets</b> (often in the pump room or on deck): one directional solenoid valve per actuator, usually 24 V DC; the PLC energises the coil to open or close.',
        'Piping (open / close lines) runs from the cabinet to each <b>double-acting hydraulic actuator</b> (rotary vane, rack and pinion or scotch-yoke) on the valve.',
        'Working pressure typically in the order of 100–160 bar – check the system drawing.',
        'Common on <b>tankers and bulk carriers</b> for ballast and cargo valves because the actuators in tanks are simple, robust and contain no electrics (good for hazardous and submerged locations).']) +
      H('Solenoid valve arrangements') + TB(['Arrangement', 'Behaviour'], [
        ['Single solenoid, spring return', 'Coil energised = one direction; de-energised = spring returns spool, valve goes to the other position'],
        ['Double solenoid, detent / closed centre', 'Pulse to open or close; spool and valve stay in last position on power loss (fail-as-is)'],
        ['Pilot-operated', 'Small solenoid controls a larger hydraulic spool – needs minimum pilot pressure']]) +
      H('Individual electro-hydraulic actuators') + L([
        'Self-contained unit on each valve: small motor, pump, tank, valves and cylinder in one housing – only power and signal cables are needed, no hydraulic piping from a central HPU.',
        'Often combined with a <b>spring return</b> or internal accumulator for fail-safe action.',
        'Good for retrofit and long-distance valves; more electrics at the valve (check IP rating / Ex rating for the location).']) +
      H('Emergency operation') + L([
        '<b>Portable or fixed hand pump</b>: connected to quick couplings on the actuator or solenoid cabinet to operate the valve when the HPU or control system fails.',
        'Manual override on solenoid valves (push pin) – only when the hydraulic supply is available.',
        'Some actuators have a manual handwheel or a mechanical override.']) + NOTE
    ],
    ['pneumatic', '💨', 'Pneumatic actuators', () =>
      TB(['Type', 'Operation', 'Fail behaviour'], [
        ['Double-acting', 'Air to open and air to close (two ports)', 'Fail-as-is on air loss (no spring); with a 5/2 solenoid valve the valve goes to the de-energised position as long as air remains'],
        ['Single-acting (spring return)', 'Air drives one way, spring drives the other', 'Fail-safe: spring closes (or opens) the valve on air loss or signal loss'],
        ['Diaphragm actuator', 'Air on a diaphragm against a spring – linear stroke', 'Fail-open or fail-close by spring arrangement (air-to-open / air-to-close)'],
        ['Rack and pinion / scotch-yoke', 'Quarter-turn rotary for butterfly and ball valves', 'Depends on single / double acting']]) +
      H('Accessories') + L([
        '<b>Filter-regulator (FR)</b> – removes water / particles and sets the supply pressure (typically around 5–7 bar instrument air – check actuator rating).',
        '<b>Solenoid valve</b> – 3/2-way for single-acting, 5/2-way for double-acting; NAMUR mounting is common; 24 V DC coils typical.',
        '<b>Positioner</b> – for modulating valves: compares a 4–20 mA (or HART / fieldbus) set-point with the actual position and adjusts air pressure; smart positioners provide diagnostics.',
        '<b>Limit switch box</b> – mechanical or inductive (proximity) switches on top of the actuator for open / closed feedback.',
        '<b>Speed control</b> – exhaust flow restrictors set the stroke time; quick exhaust valves give fast fail-safe action.',
        '<b>Air reservoir / non-return valve</b> – keeps enough air locally to stroke the valve after loss of air supply (for double-acting fail-safe duty).']) +
      H('Key points') + L([
        'Air quality is the most common cause of trouble – water, oil and rust in instrument air cause sticky solenoid valves and positioners. Keep air dryers and drains working.',
        'Pneumatics are inherently suitable for hazardous areas – but solenoid valves, positioners and limit switches must still be Ex-certified for the zone.',
        'Spring-return actuators need more air volume and are larger for the same torque because the air must also compress the spring.']) + NOTE
    ],
    ['control', '🖥️', 'Position feedback & control system', () =>
      H('Position feedback') + TB(['Method', 'Signal', 'Notes'], [
        ['Mechanical limit switches', 'Volt-free contacts, open / closed', 'Simple, reliable; cams need adjustment; contact wear and moisture'],
        ['Inductive proximity sensors', 'NAMUR (8.2 V, ~1 mA / ~3 mA) or PNP / 2-wire', 'No moving contacts; NAMUR sensors with isolating barriers are used in hazardous areas'],
        ['Potentiometer', 'Variable resistance proportional to position', 'Wear on the track causes jumping readings'],
        ['Position transmitter', '4–20 mA (often loop-powered), HART', 'Continuous position; check scaling 4 mA = closed, 20 mA = open (or as configured)'],
        ['Hydraulic feedback / pressure', 'Pressure switches or flow indicators on the lines', 'Used on some older hydraulic systems; indirect indication'],
        ['Hall-effect / contactless', 'Electronic sensor in intelligent actuators', 'Absolute position without battery on modern actuators']]) +
      H('Control system') + L([
        '<b>PLC or IAS</b> (integrated automation system) with I/O cabinets: digital outputs to solenoid valves / actuator starters, digital inputs for limit switches, analogue inputs for 4–20 mA positions.',
        '<b>Mimic pages</b> on operator stations show the piping, valves (open / closed / moving / fault) and pumps – the operator clicks the valve to command it.',
        '<b>Hard-wired mimic panels</b> with switches and lamps still exist on older ships or as back-up.',
        '<b>Fieldbus / network</b> actuators (Modbus RTU, Profibus DP, HART, Foundation Fieldbus) reduce cabling – see ' + A('indcomms.html', 'Industrial Communications') + '.',
        '<b>Alarms</b>: valve fail to open / close within the travel time (discrepancy alarm), both limit switches on (or neither), motor trip, low hydraulic pressure, low air pressure.',
        '<b>Power supply</b>: control and solenoid circuits typically 24 V DC from a UPS / battery-backed supply; actuator motors from the main or emergency switchboard as required.']) +
      H('Signals') + L([
        'Command outputs: maintained (energise to open) or pulsed (open pulse / close pulse) – know which your system uses.',
        'Check 4–20 mA loops with a loop calibrator – see ' + A('signals.html', 'Signals &amp; Loops') + '.',
        'Wire-break / short-circuit monitoring on critical inputs (e.g. NAMUR line monitoring).']) + NOTE
    ],
    ['failsafe', '🛡️', 'Fail-safe philosophy & emergency operation', () =>
      TB(['Fail mode', 'Meaning', 'Typical use'], [
        ['Fail closed (FC)', 'Valve closes on loss of power / air / hydraulic pressure / signal', 'Fuel tank outlets, cargo isolation, sea water inlets where flooding risk exists'],
        ['Fail open (FO)', 'Valve opens on failure', 'Cooling water to essential consumers, fire main, vents, some relief duties'],
        ['Fail last position (FL / fail-as-is)', 'Valve stays where it was', 'Ballast and general transfer where an unexpected movement is worse than no movement']]) +
      H('Choosing the fail mode') + L([
        'The fail mode is defined by the designer, approved by class and recorded in the <b>cause &amp; effect</b> / valve list – the ETO must know it, not change it.',
        'Ask: what happens to the ship and the process if this valve moves (or does not move) after a failure? Flooding, loss of cooling, fuel spill or loss of stability decide the answer.',
        'Remember all failure sources: electric power, control signal (PLC output), air / hydraulic pressure, network loss, and the operator’s emergency stop.',
        'On DP vessels the fail mode of remote valves must not defeat the redundancy concept (e.g. a cooling water valve failing closed on both groups).']) +
      H('Emergency operation') + L([
        '<b>Electric actuators</b>: declutch and use the handwheel; local control from the actuator if the remote system fails.',
        '<b>Hydraulic</b>: portable or fixed hand pump on the actuator or at the solenoid cabinet; manual override pins on solenoid valves; accumulator reserve.',
        '<b>Pneumatic</b>: manual override on solenoid valves, local air reservoir, handwheel / declutchable gear on some actuators.',
        '<b>Bilge and ballast</b>: rules require that essential valves can still be operated after failure of the remote system – know where the emergency means are and keep tools and hand pumps in place.',
        'Practise emergency operation in drills – hand-pumping a large valve takes time.']) +
      H('Quick-closing valves (SOLAS)') + L([
        'SOLAS II-2 requires pipes from fuel oil (and certain lube oil) tanks above the double bottom that could leak if damaged to be fitted with a valve that can be <b>closed from a safe position outside the space</b> in the event of fire.',
        'Release methods: pneumatic (air bottle or ship’s air), hydraulic, wire pull, or electric – the valve closes by spring or weight; it is reset (opened) locally.',
        'Fail mode: designed to close reliably; check the trip system does not depend on a supply that is lost in the fire.',
        'Must be tested regularly (see maintenance tab) and are checked in PSC and class surveys. Keep the release station clearly marked and air / pressure available.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>valve list / cause &amp; effect</b>: which valve is electric, hydraulic or pneumatic, its fail mode and what it serves.',
        'The <b>single-line and wiring diagrams</b>: actuator power supplies, 24 V DC / UPS for the control system, solenoid valve cabinets and I/O allocation.',
        'Where the <b>HPU</b>, accumulators, solenoid cabinets, air supply and filter-regulators are, and how to switch to the standby pump.',
        'How to operate each valve type <b>locally and in an emergency</b> (handwheel, hand pump, override) – and where the tools are.',
        'Position feedback types and how to adjust limit switches / proximity sensors and calibrate 4–20 mA transmitters.',
        'Interlocks: e.g. ballast pump start only with suction and discharge valves open; sea chest valves vs cooling pumps; cargo valve sequences; preload dump interlocks on jack-ups.',
        'Hazardous-area rules (tankers, gas carriers, pump rooms): Ex-certified equipment, IS circuits, barriers and permit-to-work.',
        'Quick-closing valves: release system, test routine and reset procedure.',
        'Control-system backups (PLC programs, IAS configuration) and Management of Change.',
        'Never operate valves remotely or locally without the engineer / cargo officer in charge knowing – moving a ballast, cargo or sea valve affects stability, pollution and cargo operations.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Valve alarm list, HPU pressure, oil level and temperature, pump running hours / starts; instrument air pressure and dryer status'],
        ['Before cargo / ballast operations', 'Test remote operation of the valves to be used; check feedback on the mimic matches the actual position'],
        ['Weekly', 'Drain air receivers and filter-regulators; check HPU filter differential pressure indicators; check for hydraulic leaks in pump rooms and on deck'],
        ['Monthly', 'Stroke rarely used valves (where operations allow); check stroke times; test quick-closing valves per the PMS (often required at least periodically by flag / company)'],
        ['3-monthly', 'Accumulator pre-charge check (as per maker); limit switch and proximity sensor checks; space heaters working; cable glands and covers on deck actuators'],
        ['6-monthly', 'Hydraulic oil sample / analysis; solenoid valve and coil inspection; positioner calibration on control valves'],
        ['Yearly', 'Insulation test of actuator motors and deck cables; full functional test of emergency operation (hand pump, handwheel); Ex inspection in hazardous areas; filter replacement'],
        ['Dry dock / class survey', 'Overhaul of sea chest and overboard valves and actuators; test of remote operation, indication and alarms in presence of the surveyor']]) +
      L([
        'Record stroke times – a slowly increasing stroke time is an early warning of valve or actuator problems.',
        'Use the correct hydraulic oil grade and keep it clean – contamination is the main cause of hydraulic valve failures.',
        'Check the correct functioning of the position indication after any maintenance – a mimic that shows the wrong position is dangerous.',
        'Plan maintenance with the chief engineer / chief officer; lock out actuators that may move during work.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Electric actuator does not move', 'No power, MCB / thermal trip, local / remote selector in wrong position, control signal missing, motor thermostat open', 'Check selector, supply and fuses, actuator alarm LEDs / display, PLC output, motor winding temperature'],
        ['Electric actuator stops mid-travel', 'Torque switch tripped by stiff or jammed valve, thermal overload, wrong torque setting', 'Try local operation, check valve for debris; do not raise torque setting without maker advice'],
        ['Electric actuator runs wrong direction or overruns', 'Phase rotation reversed after maintenance, limit switch maladjusted', 'Stop immediately; check phase sequence and limit settings'],
        ['Hydraulic valve does not move (one valve)', 'Solenoid coil burnt or no 24 V DC, spool stuck, blocked line, actuator seal bypass', 'Measure coil voltage and resistance, try manual override, check pressure at the actuator, hand pump test'],
        ['All hydraulic valves slow or not moving', 'Low HPU pressure, pump fault, relief valve leaking, accumulator pre-charge lost, low oil level', 'Check HPU pressure gauge, pump running, oil level, filter, accumulator pre-charge'],
        ['HPU pump starts too often', 'Internal leakage in solenoid valves or actuators, accumulator pre-charge lost, pressure switch drift', 'Isolate sections to find leakage, check accumulator, check pressure switch settings'],
        ['Valve creeps / drifts from position', 'Internal leakage in actuator or solenoid valve, worn spool, air leak', 'Pressure drop test, isolate actuator lines, check seals'],
        ['Pneumatic valve sluggish or sticking', 'Water / oil in instrument air, low air pressure, dirty solenoid valve or positioner, speed restrictor too tight', 'Drain filter-regulator, check air quality and pressure, clean or replace solenoid, check exhaust'],
        ['Pneumatic control valve hunting', 'Positioner calibration or tuning, valve stiction, air supply fluctuation', 'Recalibrate positioner (auto-calibration), check stem friction and supply pressure'],
        ['Position shown wrong on mimic', 'Limit switch cam / sensor moved, broken wire, 4–20 mA scaling, potentiometer wear', 'Compare local indicator with mimic, check signal at I/O card, recalibrate'],
        ['Both open and closed indicated (or neither)', 'Short circuit in cable or junction box, water ingress, failed sensor', 'Inspect junction boxes and glands on deck, insulation test cable'],
        ['Discrepancy / travel time alarm', 'Valve slower than set time, feedback fault, low power / pressure', 'Measure actual stroke time, compare with setting, check supply'],
        ['Quick-closing valve fails test', 'Seized spindle, low air / hydraulic pressure at release, wire pull slack or corroded', 'Free and lubricate per maker, check release supply, report as a deficiency and repair before relying on it']]) +
      L(['Always check whether the fault is in the <b>valve</b> (mechanical), the <b>actuator</b>, the <b>power source</b> (electric / hydraulic / air) or the <b>control system</b> – local operation quickly separates these.']) + NOTE
    ],
    ['safety', '⚠️', 'Safety & lessons', () =>
      H('Safety') + L([
        '<b>Stored energy</b>: accumulators, springs in fail-safe actuators and air reservoirs can move a valve even after the power is isolated – release pressure and secure springs before opening actuators or lines.',
        '<b>Hydraulic pressure</b>: high-pressure oil injection injuries are serious – never feel for leaks with your hand; depressurise before breaking a connection.',
        '<b>Isolation</b>: lock out the actuator power, solenoid supply and hydraulic / air supply; tag the valve on the mimic; mechanically secure the valve where required.',
        '<b>Hazardous areas</b> (cargo pump rooms, deck of tankers / gas carriers): only Ex-certified equipment; keep Ex covers, glands and IS separation intact; hot-work and gas-free permits.',
        '<b>Enclosed spaces</b>: valves in tanks, void spaces and pump rooms – follow the enclosed-space entry procedure.',
        'Moving a valve unexpectedly can flood a compartment, cause pollution, shift cargo or affect stability – always coordinate with the officer in charge.']) +
      H('Lessons learned') + L([
        'Wrong position indication has caused overfilling, pollution and stability incidents – trust but verify the local indicator.',
        'Hidden failures (seized quick-closing valves, empty accumulators, missing hand pumps) are only found by regular testing.',
        'Contaminated hydraulic oil or wet instrument air causes many simultaneous failures – keep the source clean.',
        'Water ingress into deck-mounted actuators and junction boxes is a common cause of earth faults and false indications – keep covers and glands tight.',
        'After maintenance or dry dock, check every valve for correct direction, stroke and feedback before declaring the system operational.',
        'Keep spares of critical items: solenoid coils, limit switches, proximity sensors, actuator seal kits, hand pump couplings.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Remote Control Valve Systems (Guide)', icon: '🚰', accent: '#0f766e',
    subtitle: 'Electric, hydraulic and pneumatic valve actuators – valve types, central HPU systems, position feedback, control systems, fail-safe philosophy, emergency operation, quick-closing valves, maintenance and troubleshooting.',
    refs: ['SOLAS II-1 / II-2', 'Class rules for piping and remote valve control', 'IEC 60079 (Ex equipment)', 'Maker manuals'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
