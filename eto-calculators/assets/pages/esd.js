(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General, typical guidance only. The installation’s Cause &amp; Effect charts, Safety Requirement Specification (SRS), ESD philosophy, maker manuals and class / flag / coastal-state rules always govern.</p>';

  const S = [
    ['overview', '🛑', 'ESD overview', () =>
      `<p>The <b>Emergency Shutdown (ESD) system</b> is an independent safety system that brings an offshore unit (or the hazardous parts of a ship) to a <b>safe state</b> when an abnormal or emergency condition is detected or declared. It isolates and depressurises hydrocarbon inventories, stops ignition sources, controls ventilation and keeps the essential safety services running so people can muster, fight a fire or evacuate.</p>` +
      H('Purpose') + L([
        '<b>Prevent escalation</b> – stop the release of hydrocarbons by closing ESD valves (ESDVs) and opening blowdown valves (BDVs).',
        '<b>Remove ignition sources</b> – isolate non-essential and non-Ex electrical equipment, stop engines and hot work.',
        '<b>Protect people</b> – alarms, PA / GA, keep emergency lighting, communications and escape-route services alive.',
        '<b>Protect the asset and environment</b> – limit inventory released, protect wells, risers and pipelines.']) +
      H('Where ESD is used') + TB(['Installation / vessel', 'Typical ESD scope'], [
        ['Fixed production platform', 'Full ESD hierarchy incl. APS, wellhead / riser ESDVs, blowdown, ignition source control'],
        ['FPSO / FSO', 'Process + marine ESD, turret / swivel isolation, cargo and offloading shutdowns'],
        ['MODU (drilling rig / drillship)', 'ESD levels linked to well control, shallow gas, ventilation and ignition source control; EDS on the BOP is separate'],
        ['Gas carrier / tanker', 'Cargo ESD (ship-shore link), cargo pump trips, manifold valves'],
        ['Any SOLAS ship', 'Remote emergency stops for fuel pumps, fans, quick-closing valves – the ship-side equivalent']]) +
      H('Key principles') + L([
        'ESD is <b>separate from process control</b> (PCS / IAS) – a fault in control must not disable safety.',
        'Designed to be <b>fail-safe</b> – loss of power, signal or air drives equipment to the safe state.',
        'Specified and verified to a <b>Safety Integrity Level (SIL)</b> per IEC 61508 / IEC 61511.',
        'Works together with the Fire &amp; Gas system – F&amp;G detects, ESD executes many of the protective actions.']) +
      `<p>Related pages: ${A('firegas.html', 'Fire &amp; Gas System')}, ${A('hazardous.html', 'Ex / Hazardous Area Guide')}, ${A('safety.html', 'Electrical Safety &amp; Isolation')}.</p>` + NOTE
    ],
    ['levels', '🪜', 'ESD levels & philosophy', () =>
      `<p>Shutdowns are arranged in a <b>hierarchy</b>: a higher level always includes all actions of the levels below it. <b>Names and numbering are installation-specific</b> – on one platform “ESD 1” is the most severe, on another it is the least. Always check your own ESD philosophy and C&amp;E charts.</p>` +
      H('Typical hierarchy (example only)') + TB(['Level (example)', 'Typical trigger', 'Typical actions'], [
        ['APS – Abandon Platform Shutdown', 'Manual only, from lifeboat stations / CCR / helideck by OIM decision', 'All lower-level actions plus shutdown of all power incl. main and often emergency generation except selected battery-backed services (emergency lighting, comms, nav aids)'],
        ['ESD 1 – Emergency / Total shutdown', 'Manual ESD push-button, confirmed gas in non-hazardous area or air intakes, major fire', 'Close all ESDVs incl. riser / wellhead, blowdown, trip main power generation (often), isolate non-essential electrics, stop non-Ex equipment'],
        ['ESD 2 – Area / Process emergency', 'Confirmed fire or gas in a process area, area ESD button', 'Shut in and isolate the affected area or the whole process, blowdown of affected segment, area ignition source control'],
        ['ESD 3 / PSD – Process shutdown', 'Process trips: high / low pressure, level, temperature, compressor surge, loss of utilities', 'Shut down a unit or the process train, no blowdown normally, power and utilities stay on'],
        ['USD – Unit shutdown', 'Single equipment protective trip', 'Stop one machine / package only']]) +
      H('Philosophy') + L([
        '<b>Escalation upward only</b> – a PSD may escalate to ESD, never the opposite automatically.',
        '<b>De-energise-to-trip</b> – healthy circuit is energised; loss of signal = shutdown.',
        '<b>Fail-safe valves</b> – spring-return actuators close (ESDV) or open (BDV) on loss of air / hydraulics / power.',
        '<b>Latching</b> – once tripped, a shutdown stays active until a deliberate, manual reset at the right level.',
        '<b>Essential services kept</b> – emergency power, fire pumps, emergency lighting, PA / GA, F&amp;G, ESD itself, navigation lights and comms.',
        '<b>Independence</b> – ESD logic, I/O and final elements separate from the process control system.']) + NOTE
    ],
    ['arch', '🏗️', 'System architecture', () =>
      TB(['Component', 'Function', 'Typical design'], [
        ['Logic solver (safety PLC)', 'Executes Cause & Effect logic', 'SIL-certified (often SIL 2 / 3 capable), redundant CPUs: 1oo2D, 2oo3 (TMR) or duplex hot-standby'],
        ['Safety I/O', 'Reads initiators, drives final elements', 'Redundant / diagnostic I/O cards, line monitoring, galvanic isolation, often Ex i barriers for field devices in hazardous areas'],
        ['Manual ESD push-buttons', 'Manual initiation of a specific ESD level', 'Protected (break-glass / flap cover), colour coded, monitored circuit, located at CCR, escape routes, lifeboat stations, helideck'],
        ['Field transmitters & switches', 'Process trip initiators', 'Dedicated safety transmitters separate from control ones, often 2oo3 voted'],
        ['Final elements', 'Bring plant to safe state', 'ESDVs, BDVs, solenoid valves on actuators, breaker trip / shunt-trip circuits, damper actuators, motor stop relays'],
        ['Operator interface', 'Alarms, status, mimic, overrides', 'Safety HMI / matrix panel in CCR, hardwired ESD panel with lamps and pushbuttons'],
        ['Communications', 'Links to F&G, PCS, PMS, DP', 'Hardwired for critical signals, redundant safety networks for status data'],
        ['Power supply', 'Keeps ESD alive during blackout', 'Redundant UPS (typically 30 min to several hours autonomy per spec), dual 24 V DC power supplies with diode / decoupling']]) +
      H('Key points') + L([
        '<b>Redundancy and diagnostics</b> – voting architecture chosen to meet both SIL (safety) and availability (avoid spurious trips).',
        '<b>Line monitoring</b> – end-of-line resistors on contact inputs detect open circuit and short circuit; a line fault raises an alarm and, per philosophy, may trip or only alarm.',
        '<b>Hardwired backup</b> – many installations have hardwired ESD / APS loops directly de-energising solenoids or tripping breakers in addition to the PLC.',
        '<b>Separate supplies</b> – ESD UPS normally independent from the PCS UPS; loss of one 24 V supply must not cause a trip.',
        '<b>Software</b> – application logic under strict version control, access protected, changes only via MoC and SIL verification.']) + NOTE
    ],
    ['actions', '⚙️', 'Initiators & executive actions', () =>
      H('Initiators (causes)') + TB(['Initiator', 'Examples'], [
        ['Manual', 'ESD push-buttons (CCR, escape routes, lifeboat stations, helideck, drill floor), APS buttons'],
        ['Fire & Gas', 'Confirmed gas (2ooN voting) in process area, HVAC inlet or turbine enclosure; confirmed fire; manual call point by philosophy'],
        ['Process trips', 'PAHH / PALL, LAHH / LALL, TAHH, compressor / pump protection, loss of instrument air or hydraulic pressure'],
        ['Utilities', 'Loss of main power / UPS low battery, loss of HVAC overpressure in a non-Ex room'],
        ['External', 'Ship-shore ESD link (cargo), pipeline / subsea ESD from another installation, well control system signals']]) +
      H('Executive actions (effects)') + TB(['Action', 'Purpose'], [
        ['Close ESD valves', 'Isolate inventories: wellhead (SSV / SSSV), riser, process segments, fuel gas'],
        ['Open blowdown valves', 'Depressurise to flare to reduce release rate and vessel failure risk (typically to a target pressure within ~15 min per API 521 practice)'],
        ['Stop rotating equipment', 'Pumps, compressors, turbines, cargo pumps'],
        ['HVAC actions', 'Close fire / gas dampers, stop or switch fans, maintain overpressure for safe areas or shut down if gas at intake'],
        ['Ignition source control', 'Isolate non-essential and non-Ex electrical equipment in affected / all areas'],
        ['Power plant', 'Trip main generators or bus sections per level; start / keep emergency generator'],
        ['Alarms', 'GA / PA, status lights, beacons, CCR alarms']]) +
      H('Ignition source control (ISC)') + L([
        'On gas detection, equipment that could ignite gas is de-energised: <b>non-Ex equipment</b> in areas that may become hazardous, then <b>non-essential</b> equipment, by area and by ESD level.',
        'Equipment that must stay on is <b>Ex certified for the zone</b> (often Zone 1) and is classed <b>essential</b>: emergency lighting, F&amp;G, ESD, PA / GA, comms, fire pumps, emergency generator, navigation aids.',
        'ISC is implemented by tripping <b>shunt-trip breakers</b> or contactors in switchboards and distribution boards – the ETO should know which consumers are on which ISC group.',
        'Generators and engines may be stopped on gas at their air intakes (air-intake shut-off / rig-saver valves for diesel engines).',
        'See also the ' + A('hazardous.html', 'Ex / Hazardous Area Guide') + ' for zones and protection concepts.']) + NOTE
    ],
    ['ship', '🚢', 'Ship emergency stops (SOLAS)', () =>
      `<p>Conventional ships do not have a “platform ESD”, but SOLAS requires <b>remote emergency stops and closures</b> that serve the same purpose in a machinery-space fire: stop the fuel, stop the air, contain the fire.</p>` +
      TB(['Function', 'Typical arrangement', 'Rule basis (typical)'], [
        ['Fuel oil pumps & purifiers stop', 'Remote stop from outside the space (fire control station / outside ER entrance)', 'SOLAS II-2 Reg. 5 / II-2 Reg. 4'],
        ['Machinery-space ventilation fans stop', 'Remote stop outside the space; separate groups', 'SOLAS II-2 Reg. 5'],
        ['Fire dampers / skylights / openings', 'Closing from outside the space', 'SOLAS II-2 Reg. 5'],
        ['Quick-closing valves (QCV)', 'Fuel / lube oil tank outlet valves closed remotely (pneumatic / hydraulic / wire) from outside the space', 'SOLAS II-2 Reg. 4.2.2.3'],
        ['Accommodation ventilation stop', 'Stop from the bridge / fire control station', 'SOLAS II-2 Reg. 5 / 7'],
        ['Thermal oil / boiler forced-draught fans, oil transfer pumps', 'Remote stops grouped with fuel pumps', 'SOLAS / class rules'],
        ['Galley exhaust fans & dampers', 'Stop and closing outside the galley', 'SOLAS II-2 Reg. 9'],
        ['Cargo ESD (tankers / gas carriers)', 'Cargo pump trips, manifold valve closure, ship-shore link', 'IGC / IBC, ISGOTT, terminal requirements']]) +
      H('ETO points') + L([
        'Emergency stop circuits for fans and pumps are usually <b>wired so that a stop works even if the PLC fails</b> – often with monitored circuits.',
        'Know the <b>emergency stop panel</b> layout: which push-button stops which group, and how to reset (usually reset at the panel, then restart locally).',
        'Before CO₂ / fixed-gas release the relevant fans and fuel pumps must be stopped and openings closed – this is part of the fire plan.',
        'Test remote stops and QCVs as per the planned maintenance system and before class / PSC surveys; record results.',
        'Do not leave remote stops “bridged” after maintenance – a typical PSC detainable deficiency.']) + NOTE
    ],
    ['ce', '🧾', 'Cause & Effect, bypasses & resets', () =>
      H('Cause & Effect (C&E) chart') + L([
        'A matrix that defines, for every <b>cause</b> (initiator, row), which <b>effects</b> (actions, columns) occur – including voting, delays and latching.',
        'It is the <b>authoritative description</b> of ESD / F&amp;G logic and the basis for testing; the PLC application must match it.',
        'Changes to the C&amp;E require MoC, safety review and re-testing of the affected functions.']) +
      H('Bypass, override, inhibit – typical meanings') + TB(['Term', 'Typical meaning', 'Control'], [
        ['Maintenance override / bypass (MOS)', 'Initiator signal ignored so it can be tested or repaired without tripping', 'Permit-to-work, key switch or password, logged, time-limited, alarm in CCR'],
        ['Operational override / start-up bypass', 'Temporarily suppresses a trip that is normal during start-up (e.g. low pressure)', 'Usually auto-timed or removed automatically when the condition clears'],
        ['Inhibit (F&G)', 'Detector input disabled', 'Same control as bypass; compensating measures (e.g. portable gas detector, fire watch)'],
        ['Output / executive inhibit', 'Effect blocked (e.g. ESDV not closed) during testing', 'Strict limits; never on APS / ESD 1 actions without senior authorisation']]) +
      L([
        'Every active bypass is a <b>reduction of safety</b> – it must be recorded in an override register, risk-assessed and removed as soon as possible.',
        'Manual ESD push-buttons and APS are normally <b>not</b> overridable.',
        'Display active overrides prominently and review them at every shift handover.']) +
      H('Reset philosophy') + L([
        'Shutdowns <b>latch</b> – removing the cause does not restart anything.',
        'Reset is <b>manual and deliberate</b>: first clear the initiator (e.g. release push-button, gas below level), then reset at the correct level (field and / or CCR).',
        'Reset only <b>permits</b> restart – valves do not reopen and motors do not start automatically; equipment is restarted locally and in sequence.',
        'Reset of APS / ESD 1 normally requires OIM / master authorisation and a site check.']) + NOTE
    ],
    ['iface', '🔗', 'Interfaces', () =>
      TB(['System', 'Interface with ESD (typical)'], [
        ['Fire & Gas', 'Confirmed fire / gas signals initiate ESD levels; ESD status to F&G; often a combined SIS but separate logic'],
        ['PMS / switchboards', 'Trip of generators or bus sections, shunt trips for ignition source control, load shedding, emergency generator start and connection'],
        ['DP system', 'ESD actions must not cause unplanned loss of position – thrusters and their auxiliaries usually classed essential; ESD effects on power are checked in the DP FMEA'],
        ['HVAC', 'Fan stop / start, damper closure, overpressure monitoring of safe rooms, gas at air intake actions'],
        ['Drilling / well control', 'Drilling ESD, mud system, diverter, well-test equipment; BOP EDS / emergency disconnect is a separate system'],
        ['Process control (PCS / IAS)', 'ESD status and first-out alarms to PCS; PCS cannot override ESD'],
        ['Turbines / engines / packages', 'Package shutdown and ESD signals hardwired to unit control panels'],
        ['Cargo / offloading', 'Ship-shore ESD link, offloading hose / hawser ESD, turret / swivel'],
        ['PA / GA, telecoms', 'Automatic alarm tones per level'],
        ['Subsea / pipeline', 'Subsea isolation valves, pipeline ESD to / from adjacent installations']]) +
      L([
        'Critical interfaces are normally <b>hardwired</b>, de-energise-to-trip; serial links are for status and alarms only.',
        'Check every interface during C&amp;E testing – many incidents come from interfaces nobody owned.',
        'Fire &amp; Gas details: ' + A('firegas.html', 'Fire &amp; Gas System') + '.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>ESD hierarchy</b> on your installation – names, numbering and what each level does to the power system.',
        'Locations of all <b>manual ESD / APS push-buttons</b> and ship remote stops.',
        'How to read the <b>Cause &amp; Effect chart</b> and find the effects of any initiator.',
        'Which consumers are <b>essential</b> and which are tripped by ignition source control; where the shunt-trip circuits are.',
        'ESD / F&amp;G <b>UPS and 24 V DC</b> supplies: autonomy, alarms, bypass and battery tests.',
        'The <b>logic solver</b>: system status, diagnostics, I/O card faults, redundancy status, forcing rules (forcing on a safety PLC is normally prohibited without permit).',
        'The <b>override / bypass procedure</b> and register – never bypass without permit and CCR agreement.',
        'Fail-safe wiring: end-of-line resistors, de-energise-to-trip, solenoid valve and shunt-trip circuits.',
        'Proof-test procedures and how to record results for SIL verification.',
        'Reset sequence and restoration of power after an ESD, including emergency generator and blackout recovery.',
        'Ex requirements for working on field devices in hazardous areas – see ' + A('hazardous.html', 'Ex / Hazardous Area Guide') + '.',
        'Safe isolation before working on ESD circuits – see ' + A('safety.html', 'Electrical Safety &amp; Isolation') + '.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance, testing & proof tests', () =>
      `<p>Safety instrumented functions (SIFs) degrade through <b>dangerous undetected failures</b> that only a test reveals. The <b>proof-test interval</b> is set in the SIL calculation (PFDavg) per IEC 61508 / IEC 61511 – testing less often than assumed means the claimed SIL is no longer valid.</p>` +
      TB(['Interval (typical)', 'Task'], [
        ['Each shift / daily', 'Review ESD alarms, logic solver and I/O diagnostics, UPS status, active overrides register'],
        ['Weekly', 'Lamp / panel test, UPS alarm check, review of line-fault alarms, ship remote stop panel visual'],
        ['Monthly / 3-monthly', 'Partial-stroke tests of ESDVs where fitted, function tests of selected push-buttons, battery checks'],
        ['6-monthly / yearly', 'Proof tests of SIFs per SRS: initiator to final element (full loop), ESD push-buttons, ESDV full stroke with closing time measurement, BDV opening, shunt-trip tests'],
        ['Yearly', 'UPS autonomy (discharge) test, ESD / APS functional test of power actions (planned), HVAC damper tests, SOLAS remote stops and QCV tests'],
        ['Valve tests (typical)', 'ESDV leak (seat) test at intervals per philosophy; record closure times against acceptance criteria'],
        ['After modification', 'MoC, update C&E, re-validate and test affected SIFs, back up logic solver application'],
        ['Class / survey', 'Witnessed tests of emergency stops and shutdowns as required by class and flag']]) +
      L([
        'Test the <b>whole loop</b> where possible: sensor, logic, solenoid, actuator, valve, breaker – not only the PLC input.',
        'Record <b>as-found</b> condition before adjusting anything – this data feeds the SIL failure-rate verification.',
        'Use approved test procedures with overrides logged and removed afterwards; confirm all bypasses are cleared.',
        'Keep backups of the logic solver application and configuration; verify version against the approved copy.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Spurious ESD / PSD trip', 'Faulty transmitter, loose terminal, 24 V supply dip, single-channel input without voting, wrong setpoint', 'Read first-out alarm and SOE log, check initiator wiring and supply, compare redundant transmitters'],
        ['Line fault alarm (open / short)', 'Broken cable, missing or wrong end-of-line resistor, water ingress in junction box, damaged push-button', 'Measure loop resistance against design value, inspect JB and gland, check EOL resistor'],
        ['ESD will not reset', 'Initiator still active, push-button not released, override needed for start-up permissive, higher level still latched', 'Check active causes on C&E / HMI, reset in correct order (field then CCR), check reset key switch'],
        ['ESDV does not close on test', 'Solenoid stuck or coil burnt, exhaust port blocked, actuator spring failure, valve seized, hydraulic accumulator', 'Check solenoid voltage drop, vent path, actuator air / hydraulic, partial-stroke history; report as dangerous failure'],
        ['ESDV closes too slowly', 'Restricted exhaust, quick-exhaust valve fault, sticky stem, wrong speed control', 'Measure closing time, inspect exhaust and QEV, compare with acceptance criteria'],
        ['Shunt trip / ISC breaker not tripping', 'Shunt coil faulty, trip supply missing, wiring error, breaker mechanism', 'Check trip voltage at coil, breaker test, compare with ISC group list'],
        ['Logic solver CPU / I/O card fault', 'Hardware failure, overheating, firmware mismatch', 'Check diagnostics, redundancy status, replace card per maker procedure under permit; system runs degraded'],
        ['UPS on battery / low battery alarm', 'Input supply lost, charger fault, aged batteries', 'Restore input, check charger, battery voltage and autonomy; plan for controlled shutdown risk'],
        ['Earth fault on ESD 24 V DC', 'Insulation damage in field cable or device', 'Locate by sectioning with permit and overrides, as earth faults can cause false trips or block trips'],
        ['Ship remote stop does not stop fan / pump', 'Stop circuit bridged, contactor welded, relay fault, wrong group wiring', 'Check stop relay, contactor, wiring to the group list; repair before next sailing / survey']]) +
      L(['Always use the <b>Sequence of Events (SOE)</b> / first-out record to identify what tripped first – do not guess.', 'A failure found during proof testing is a <b>dangerous failure</b>: report it, risk-assess compensating measures and repair promptly.']) + NOTE
    ],
    ['lessons', '📚', 'Safety & lessons', () =>
      H('Lessons from incidents (general)') + L([
        '<b>Piper Alpha (1988)</b> – permit-to-work and handover failures, and lack of riser isolation from adjacent pipelines, led to escalation; this drove riser ESDVs and modern safety-case regimes.',
        'Repeated industry findings: ESD functions <b>left bypassed</b> after maintenance, valves that failed to close on demand, and C&amp;E charts not matching the installed logic.',
        'Spurious trips cause loss of trust – operators then bypass systems. Fix the cause instead of overriding it.',
        'On ships, fires have spread because remote stops or quick-closing valves did not work or had been tied open.']) +
      H('Safety rules for the ETO') + L([
        'Never bypass, force or jumper an ESD or F&amp;G function without a valid permit, override register entry and CCR / OIM agreement.',
        'Remove all overrides and test equipment after work – verify with the CCR and the override register.',
        'Isolate correctly: ESD circuits are often fed from UPS and multiple sources – prove dead on all of them.',
        'Work on field devices in hazardous areas only with gas testing, hot-work / Ex rules and certified tools.',
        'Treat a failed test as a real safety issue – report it, do not just reset and move on.',
        'Do not change logic, setpoints or time delays without MoC and SIL review.',
        'Know your escape routes and the nearest manual ESD point – you may be the one who has to press it.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Emergency Shutdown (ESD) System', icon: '🛑', accent: '#b91c1c',
    subtitle: 'What the ETO should know about ESD on offshore units and ships – shutdown levels, architecture, initiators and executive actions, ignition source control, SOLAS emergency stops, Cause & Effect, bypasses and resets, interfaces, proof testing, troubleshooting and lessons learned.',
    refs: ['IEC 61508', 'IEC 61511', 'ISO 13702', 'API RP 14C', 'SOLAS II-2', 'IMO MODU Code'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
