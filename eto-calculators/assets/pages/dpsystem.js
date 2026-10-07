(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance for all DP vessels. The vessel’s DP FMEA, operations manual, ASOG / WSOG, maker documentation and class rules always govern.</p>';

  const S = [
    ['overview', '🛰️', 'DP overview', () =>
      `<p><b>Dynamic Positioning (DP)</b> keeps a vessel at a fixed position and heading (or on a planned track) using only its own thrusters and propellers. A computer compares the measured position and heading with the set-point, calculates the forces needed against wind, waves and current, and commands the thrusters.</p>` +
      H('How it works') + L([
        '<b>Measure</b>: position reference systems (DGNSS, acoustics, laser, radar, taut wire), heading (gyros), motion (MRU) and wind sensors.',
        '<b>Calculate</b>: DP controller with a mathematical vessel model (Kalman filter) estimates position, velocity and the unknown “current” force; wind is fed forward.',
        '<b>Act</b>: thrust allocation distributes the required force and moment among thrusters, propellers and rudders.',
        '<b>Power</b>: the power plant and PMS must always supply enough power for the thrusters – power and DP are one system.']) +
      H('DP equipment classes (IMO)') + TB(['Class', 'Requirement', 'Typical use'], [
        ['DP 1', 'No redundancy – loss of position may occur after a single fault', 'Low-risk operations'],
        ['DP 2', 'Redundancy of active components – no single fault of an active component (generator, thruster, switchboard, controller, remote-controlled valve…) causes loss of position', 'Supply, ROV, construction, drilling support'],
        ['DP 3', 'As DP 2, plus loss of any one compartment by fire or flood (A60 / watertight separation) must not cause loss of position', 'Drilling, diving, high-risk work close to installations']]) +
      H('Rules & guidance') + L([
        '<b>IMO MSC/Circ.645</b> and <b>MSC.1/Circ.1580</b> – guidelines for vessels and units with DP systems.',
        'Class notations: e.g. DNV DPS 1/2/3 (formerly DYNPOS AUT / AUTR / AUTRO), ABS DPS-1/2/3, LR DP(AM)/(AA)/(AAA), BV DYNAPOS.',
        '<b>IMCA</b> guidance (e.g. M 103 design &amp; operation, M 166 FMEA, M 190 annual trials) and <b>MTS DP Operations guidance</b>.',
        'Client / charterer requirements and the vessel’s own DP operations manual.']) +
      `<p>Related pages: ${A('thruster.html', 'Thrusters')} (calculations), ${A('plant.html', 'Power Plant &amp; Load Balance')}, ${A('pmssim.html', 'PMS / DP / blackout simulator')}.</p>` + NOTE
    ],
    ['arch', '🏗️', 'System architecture', () =>
      TB(['Component', 'Function', 'Redundancy (typical)'], [
        ['DP controllers', 'Run the DP software (model, filters, thrust allocation)', 'DP1 single, DP2 dual, DP3 triple + back-up'],
        ['Operator stations (consoles)', 'DPO interface – modes, set-points, alarms', 'Two or more on the bridge'],
        ['Independent joystick (IJS)', 'Manual thruster control with auto-heading, independent of the DP computers', 'Required as fallback'],
        ['Back-up DP station (DP3)', 'Separate DP control in another fire zone (A60)', 'Takes over if the main bridge is lost'],
        ['DP network', 'Links controllers, consoles, I/O and thruster interfaces', 'Dual network A / B'],
        ['I/O and serial interfaces', 'Sensor and reference inputs, thruster commands / feedback', 'Split per redundancy group'],
        ['UPS', 'Power to controllers, consoles, sensors and references', 'One per redundancy group (≥ 30 min); extra UPS for the DP3 back-up'],
        ['Thruster control systems', 'Local drive / pitch / azimuth control receiving DP commands', 'Each thruster belongs to one redundancy group']]) +
      H('Key points') + L([
        'Every component is allocated to a <b>redundancy group</b> (e.g. port / starboard or A / B / C) – power supply, cables, I/O and thrusters follow the same split.',
        'Cables of different redundancy groups run on <b>separate routes</b>; on DP3 they are in different fire / flood zones.',
        'A single failure in one group must not disable the other group(s) – watch for hidden “common points” (shared UPS, shared 24 V DC, shared network switch, shared cooling water).',
        'Changes to software, I/O or wiring are made only under <b>Management of Change</b> and may require class approval and re-testing.']) + NOTE
    ],
    ['sensors', '🧭', 'Sensors (gyro, MRU, wind)', () =>
      TB(['Sensor', 'Purpose in DP', 'Typical faults'], [
        ['Gyro compass', 'Heading – essential for heading control and converting positions', 'Slow drift, settling after power loss, NMEA / serial loss, latitude / speed input wrong'],
        ['MRU / VRU', 'Roll, pitch, heave – corrects references for antenna / transducer lever arms', 'Wrong mounting or lever-arm settings, power / data loss'],
        ['Wind sensor', 'Wind speed and direction for wind feed-forward', 'Shadowing by structures, icing, bearing failure, false gusts (helicopter, crane)'],
        ['Draught input', 'Updates vessel model (area, mass)', 'Not updated after loading changes']]) +
      H('Voting – why three sensors') + L([
        'With <b>two</b> sensors the DP can only see that they disagree – it cannot know which one is wrong.',
        'With <b>three</b>, the DP compares them and rejects the one that differs (median voting). This is why DP2 / DP3 normally have three gyros and three MRUs when the system depends on them.',
        'Typical gyro distribution: one per redundancy group with separate power supplies.',
        'On DP3 at least one of each sensor type is also connected to the back-up DP system.']) +
      H('ETO points') + L(['After a gyro power loss, allow settling time before selecting it into DP.', 'Check gyro speed and latitude inputs if used.', 'Wind sensors: check bearings and calibration of direction against the vessel heading.', 'Inform the DPO before deselecting or working on any sensor.']) + NOTE
    ],
    ['prs', '📡', 'Position reference systems', () =>
      TB(['System', 'Principle', 'Limitations', 'ETO checks'], [
        ['DGNSS (DGPS + GLONASS / Galileo / BeiDou)', 'Satellite position with differential corrections (beacon / satellite services)', 'Shadowing near platforms, multipath, ionospheric scintillation, correction loss, jamming', 'Antennas, cables, receivers, correction subscription, two receivers with different correction sources'],
        ['Hydro-acoustic (HPR / HiPAP / USBL / LBL)', 'Range and bearing to seabed transponders via a hull transducer', 'Thruster noise and aeration, water-column effects, transponder battery life, transducer pole', 'Transducer hoist / gate valve, transponder batteries, cable and interface'],
        ['Taut wire', 'Weight lowered to the seabed; wire angle gives position', 'Water depth limit, wire angle limits, weight dragging, current', 'Wire condition, winch constant-tension, angle sensors, weight'],
        ['Laser (Fanbeam / CyScan)', 'Laser range and bearing to reflectors on a structure', 'Fog, rain, sunlight, dirty or wrong reflectors, relative to the structure only', 'Lens cleaning, reflector placement, mounting'],
        ['Radar-based (RadaScan / RADius)', 'Microwave range and bearing to transponders on a structure', 'Line of sight, interference, relative to the structure only', 'Transponder power, antenna, configuration'],
        ['Inertial aided (INS)', 'Inertial measurement used to bridge short reference drop-outs', 'Drift over time without updates', 'Alignment, aiding inputs']]) +
      H('Key rules') + L([
        'DP2 / DP3: at least <b>three position references</b> simultaneously available, not all based on the same principle.',
        'Absolute references (DGNSS, acoustics, taut wire) fix the position on earth; relative references (laser, radar) measure relative to a structure – which may move (e.g. FPSO).',
        'DP weights and compares references and rejects drifting or jumping ones (median / variance tests).',
        'Lever-arm offsets (antenna / transducer position relative to the vessel reference point) must be correct – wrong offsets cause position jumps when the heading changes.']) + NOTE
    ],
    ['thrusters', '🌀', 'Thrusters & propulsion for DP', () =>
      TB(['Type', 'Characteristics'], [
        ['Tunnel thruster', 'Transverse force only; less efficient at speed; FP (VFD) or CP (constant speed)'],
        ['Azimuth thruster', 'Rotates 360°; can give force in any direction; steering motors / hydraulics'],
        ['Retractable azimuth', 'Lowered for DP; check hoist / lock-down interlocks'],
        ['Main propellers & rudders', 'Longitudinal force; rudder gives transverse force with propeller wash']]) +
      H('Thruster readiness chain') + L(['Power available (switchboard, breaker closed, drive / motor ready).', 'Auxiliaries running: cooling, lube oil, hydraulics, steering pumps.', 'No active trip / emergency stop.', 'Control: local / remote / DP selected; DP command and feedback healthy.', 'PMS permission (power available) for start.']) +
      H('DP-related functions') + L([
        '<b>Thrust allocation</b> – distributes force and moment; uses forbidden zones so azimuth wash does not hit other thrusters, ROVs or divers.',
        '<b>Bias</b> – thrusters push against each other to keep load on generators and allow faster response.',
        '<b>Power limitation</b> – thrusters reduce load automatically when available power is low or frequency drops (blackout prevention).']) +
      H('Thruster failure modes (critical to know)') + TB(['Failure', 'Effect'], [
        ['Fail to zero thrust', 'Loss of thrust – covered by redundancy (drift-off risk)'],
        ['Fail as set (frozen)', 'Thruster keeps last command – DP compensates'],
        ['Fail to full thrust / wrong direction', 'Drive-off risk – the most dangerous; needs fast thruster emergency stop'],
        ['Azimuth steering failure', 'Force in the wrong direction'],
        ['Loss of feedback', 'DP may deselect the thruster']]) +
      L(['Thruster emergency stops must be tested regularly and their circuits monitored (wire break alarm).']) + NOTE
    ],
    ['power', '⚡', 'Power plant & redundancy groups', () =>
      L([
        'The main switchboard is split into sections (2, 3 or 4) by <b>bus-tie breakers</b>; each section with its generators and thrusters forms a redundancy group.',
        '<b>Open bus</b> – bus-ties open: groups fully independent; a fault in one group cannot spread. More generators online, more fuel.',
        '<b>Closed bus</b> – bus-ties closed: fewer generators, better load sharing and efficiency. Requires proven protection against fault propagation: fast bus-tie opening, voltage-dip ride-through, advanced generator protection (detects a faulty governor / AVR and trips the right generator), and testing (e.g. live short-circuit / ride-through tests) per class.',
        'Auxiliary systems (cooling water, fuel, compressed air, ventilation, 24 V DC, UPS) must follow the same redundancy split – a shared auxiliary is a common-mode failure.']) +
      H('PMS functions for DP') + TB(['Function', 'Purpose'], [
        ['Blackout prevention', 'Load-dependent start of standby generators, preferential trips'],
        ['Fast load reduction / phase-back', 'Instantly reduces thruster and heavy-consumer load when a generator trips'],
        ['Heavy-consumer start control', 'Allows starting large loads only when power is available'],
        ['Blackout recovery', 'Automatic start, dead-bus closing, sequential restart of thrusters'],
        ['Frequency / power-based thruster limitation', 'Thrusters reduce load before generators overload'],
        ['Generator protection', 'Reverse power, over / under frequency, over / under voltage, excitation faults']]) +
      L(['The <b>worst-case failure</b> (e.g. loss of one switchboard section) defines how much thrust remains – operations must be within that capability.']) + NOTE
    ],
    ['fmea', '📑', 'FMEA, worst-case failure & trials', () =>
      H('DP FMEA') + L([
        'Failure Modes and Effects Analysis of the complete DP system: power, thrusters, control, sensors, references, auxiliaries.',
        'Identifies the effect of every single failure and defines the <b>Worst-Case Failure (WCF)</b> and Worst-Case Failure Design Intent.',
        'Must be kept up to date after any modification (MoC).',
        'Includes <b>FMEA proving trials</b> that test the redundancy claims.']) +
      H('Consequence analysis') + L(['Online DP function (required for DP2 / DP3): continuously checks whether the vessel can still hold position after the WCF in the current weather and alarms if not.', 'Capability plots show the maximum weather the vessel can hold in after the WCF.']) +
      H('Annual DP trials') + L([
        'Yearly tests (IMCA M 190) to prove redundancy is still intact: generator, switchboard and thruster failures, UPS failure, network failures, sensor / reference failures, blackout recovery, emergency stops.',
        'Full proving trials typically at the class renewal (5-yearly) or after major modifications.',
        'Findings are categorised (A – immediate, B – before / during next ops, C – improvement) and must be closed.']) +
      H('ETO role in trials') + L(['Prepare: UPS batteries, protection relays, emergency stops, backups of configurations.', 'Carry out electrical tests (isolations, simulated faults) safely under the trials programme.', 'Record results and observations; close findings with evidence.', 'Know the FMEA well enough to explain the expected result of each test.']) + NOTE
    ],
    ['ops', '🚦', 'Operating modes, ASOG & alert status', () =>
      TB(['Term', 'Meaning'], [
        ['CAM – Critical Activity Mode', 'The most robust configuration (e.g. open / closed bus as defined, all thrusters and references online) used during critical operations'],
        ['TAM – Task Appropriate Mode', 'A risk-based configuration accepted for a specific task when failure consequences are lower'],
        ['ASOG / WSOG', 'Activity / Well Specific Operating Guidelines – lists equipment conditions and the required alert status and actions'],
        ['Green', 'Normal operation – all systems within limits'],
        ['Advisory (Blue)', 'Approaching limits or degraded condition – risk assessment, inform client'],
        ['Yellow', 'Degraded – stop the activity and prepare to move to safe position'],
        ['Red', 'Emergency – abort, move to safe position / disconnect']]) +
      H('Electrical items that often appear in an ASOG') + L(['Number of generators / switchboard configuration (open / closed bus).', 'Loss of a generator or switchboard section.', 'UPS on battery or UPS alarm.', 'Earth fault on a DP-critical system.', 'Thruster not available.', 'Loss of a DP network or controller.', 'Loss of a position reference or sensor.']) +
      H('Rules for the ETO') + L(['Never start work on any DP-related equipment without the DPO’s and chief engineer’s agreement and a check of the ASOG.', 'Some work is only allowed when the vessel is not in a critical activity.', 'Report any abnormal electrical condition to the DPO immediately – it may change the alert status.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>single-line diagram</b>, redundancy groups and which consumers belong to which group.',
        'The <b>DP FMEA</b>: WCF, common points, and expected effects of electrical failures.',
        'The <b>ASOG / CAM</b> and what electrical conditions change the alert status.',
        'PMS functions: blackout prevention, fast load reduction, heavy-consumer start, blackout recovery.',
        'UPS: which UPS feeds which DP equipment, battery autonomy (≥ 30 min), bypass operation and tests.',
        'Sensors and references: power supplies, interfaces, how to deselect safely and settling times.',
        'Thruster readiness chain and emergency stop circuits.',
        'Closed / open bus protection philosophy on your vessel.',
        'Software and configuration backups (DP controllers, PMS, drives) and Management of Change.',
        'Earth-fault handling on DP-critical systems – find faults quickly, but isolate only with DPO agreement.',
        'Communication: report early, report clearly, and log everything.',
        'Training: DP courses for ETOs and maker training are valued by employers and clients.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'DP alarm list, UPS status and battery voltage, sensor and reference status and deviations, thruster drive alarms, IMD readings'],
        ['Before DP operations', 'DP checklist with the DPO: references, sensors, thrusters, power configuration, consequence analysis, joystick and emergency stop'],
        ['Weekly', 'UPS alarms / battery visual; DGNSS correction status; wind sensor check; back-up station status (DP3)'],
        ['Monthly', 'Thruster emergency stop tests (as planned), UPS battery check (voltage / internal resistance), network redundancy check'],
        ['3–6 monthly', 'Laser / radar reference cleaning and checks, taut-wire wire inspection, HPR transponder battery check'],
        ['Yearly', 'Annual DP trials, UPS autonomy (discharge) test, protection relay checks, insulation tests of DP-critical cables and motors, gyro service per maker'],
        ['After any modification', 'Update FMEA / drawings, back up configurations, test the affected functions']]) +
      L(['Keep records of all DP-related maintenance – they are checked at trials, audits and client inspections.', 'Plan maintenance outside critical activities and agree it with the DPO.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Gyro rejected / heading difference alarm', 'Gyro drift, power loss, interface fault', 'Compare gyros, check supply and serial data, gyro alarms; inform DPO'],
        ['Position reference drop-out / jumps', 'DGNSS shadowing or correction loss; acoustic noise; laser reflector blocked; wrong lever arm', 'Check reference status pages, antenna / transducer, correction link, offsets'],
        ['Thruster “not ready”', 'Drive fault, auxiliary pump off, E-stop active, breaker open, PMS permission', 'Follow the readiness chain from power to control'],
        ['Thruster not following command', 'Feedback fault, pitch / azimuth hydraulics, drive limitation', 'Compare command and feedback signals; drive limitation status'],
        ['DP network alarm', 'Failed switch, cable, network card, power supply', 'Check which network (A / B) and node; switch status LEDs; supply'],
        ['UPS on battery', 'Input supply lost, charger / rectifier fault', 'Input breaker, charger alarms, battery autonomy; inform DPO'],
        ['Consequence analysis alarm', 'Weather increased or equipment lost', 'Inform DPO; check available thrust and generators'],
        ['Frequent power limitation of thrusters', 'Too few generators online, PMS settings', 'Check online power vs demand, PMS start settings'],
        ['Earth fault on DP-related supply', 'Insulation failure', 'Locate with care, isolate only with DPO agreement and ASOG check']]) +
      H('Drift-off / drive-off') + L([
        '<b>Drift-off</b> – loss of thrust; the vessel drifts with wind and current (e.g. blackout, thrusters lost).',
        '<b>Drive-off</b> – thrusters push the vessel away (e.g. wrong reference, thruster failure to full thrust).',
        '<b>Force-off</b> – environmental forces exceed thruster capability.',
        'Electrical faults (blackout, thruster drive failures, faulty references) are common causes – fast, correct reaction and clear communication with the DPO are critical.']) + NOTE
    ],
    ['lessons', '📚', 'DP incidents & lessons', () =>
      H('Common causes of DP incidents') + L([
        'Power generation and distribution faults (generator, governor / AVR, protection, switchboard).',
        'Thruster and drive faults.',
        'Position reference problems (DGNSS shadowing, acoustic interference, wrong offsets).',
        'Sensor faults (gyro, wind).',
        'Control system / software / network faults.',
        'Human factors: wrong configuration, work on equipment during operations, poor communication.']) +
      H('Lessons for the ETO') + L([
        'Never work on DP-related equipment without informing the DPO and checking the ASOG.',
        'Hidden failures (protection that does not work, a UPS battery that cannot carry the load) are found only by testing – do the tests.',
        'Avoid creating common points: temporary cables, shared supplies, jumpers across redundancy groups.',
        'After maintenance, test before returning to DP service.',
        'Keep configuration backups and update the FMEA after changes.',
        'Report near-misses – IMCA publishes station-keeping incident reports and safety flashes worth reading.',
        'Stay calm in an incident: secure power first, communicate, then investigate.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Dynamic Positioning (DP) System', icon: '🛰️', accent: '#0369a1',
    subtitle: 'Everything the ETO should know about DP – classes, architecture, sensors, position references, thrusters, power plant and redundancy, FMEA and trials, ASOG, maintenance, troubleshooting and lessons learned.',
    refs: ['IMO MSC/Circ.645', 'MSC.1/Circ.1580', 'IMCA M 103 / M 166 / M 190', 'MTS DP guidance'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
