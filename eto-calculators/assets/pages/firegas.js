(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const NOTE = '<p>Set-points, intervals and actions shown are typical industry values. The installation’s Cause &amp; Effect charts, Safety Requirement Specification, maker manuals and class / flag requirements always govern.</p>';

  const S = [
    ['overview', '🔥', 'System overview & architecture', () =>
      `<p>The <b>Fire &amp; Gas (F&amp;G) system</b> detects fire and hydrocarbon / toxic gas releases on an offshore unit and automatically starts protective actions – alarms, shutdowns, ventilation changes and fire-fighting – before an incident can escalate. It is a <b>safety system</b>, normally separated from the process control (PCS / IAS) and working together with the Emergency Shutdown (ESD) system.</p>` +
      H('Main building blocks') + TB(['Part', 'Function', 'Examples'], [
        ['Field detectors', 'Sense fire, heat, smoke, flammable gas, toxic gas, O₂ deficiency', 'Flame (IR3 / UV-IR), smoke, heat, point & open-path gas, H₂S, ultrasonic'],
        ['Manual call points (MAC / MCP)', 'Person raises a fire alarm', 'Break-glass / push-button, Ex-certified outdoors'],
        ['F&G logic solver', 'Reads inputs, applies voting and Cause & Effect, drives outputs; SIL-rated, often redundant', 'Safety PLC / SIS controller (dual / triple redundant CPUs and I/O)'],
        ['Fire alarm panel', 'Addressable fire-detection loops in accommodation & technical rooms', 'EN 54 / approved panel interfaced to the F&G logic'],
        ['Operator interface', 'Mimic / matrix, alarm list, inhibit & override handling', 'F&G HMI in CCR, repeater on bridge / ECR'],
        ['Outputs / final elements', 'Protective actions', 'PA/GA alarm, beacons & sounders, ESD trips, HVAC dampers & fans, deluge valves, fire-pump start, gaseous release, ignition-source isolation'],
        ['Power supply', 'Uninterruptible supply from main + emergency source', 'Dual UPS / 24 V DC with battery back-up']]) +
      H('Key standards & rules') + L([
        '<b>IMO MODU Code</b> (fire safety, gas detection, ventilation) and <b>SOLAS II-2 / FSS Code</b> (fire detection & alarm systems).',
        '<b>IEC 61508 / IEC 61511</b> – functional safety, SIL of F&amp;G functions, proof testing.',
        '<b>ISO 13702</b> – control and mitigation of fires and explosions on offshore installations; <b>NORSOK S-001</b> (Norway) technical safety.',
        '<b>IEC 60079-29-1 / -29-2</b> – flammable gas detector performance and selection, installation, use and maintenance; <b>IEC 60079-14 / -17</b> for Ex installation and inspection.',
        '<b>EN 54</b> – fire detection components and panels; <b>API RP 14C</b> / ISO 10418 – safety analysis of process systems.',
        'Class society rules (DNV, ABS, BV, LR…) and the field operator’s own technical requirements.']) + NOTE
    ],
    ['iface', '🔗', 'Interfaces the ETO must understand', () =>
      `<p>The F&amp;G system does not act alone – its value is in the actions it triggers in other systems. Knowing each interface tells you what will happen on board when a detector goes into alarm, and what to isolate before testing.</p>` + L([
        '<b>ESD system</b> – confirmed gas or fire initiates the defined ESD level (e.g. process shutdown, ESD of the area, abandon-platform level).',
        '<b>HVAC</b> – gas at an air inlet trips fans and closes fire / gas-tight dampers; fire in a room closes its dampers.',
        '<b>Electrical / PMS</b> – <b>ignition-source control</b>: confirmed gas trips non-Ex / non-essential electrical equipment in the affected area (and sometimes the whole unit), leaving only equipment certified for operation during a gas emergency.',
        '<b>Fire-water</b> – fire pumps start, deluge / water-mist valves open in the affected fire area.',
        '<b>PA/GA &amp; beacons</b> – general alarm, muster, abandon signals.',
        '<b>DP / marine systems</b> – on mobile units, gas detection at engine-room air intakes and around generators matters for position keeping (generator shutdowns).']) + NOTE
    ],
    ['fire', '🚨', 'Fire detection devices', () =>
      TB(['Detector', 'Principle', 'Where used', 'Watch-outs'], [
        ['Optical smoke', 'Light scattering in a chamber', 'Accommodation, control rooms, switchboard & instrument rooms', 'Dust, steam, cooking fumes, insects; chamber contamination → drift'],
        ['Ionisation smoke', 'Ionised chamber current change', 'Old installations only (being phased out)', 'Radioactive source – special disposal'],
        ['Heat – fixed temperature', 'Operates at a set temperature (e.g. 57 / 78 °C classes)', 'Galleys, laundries, engine rooms, dirty / steamy areas', 'Slow response; set temperature must suit ambient'],
        ['Heat – rate-of-rise', 'Operates on fast temperature rise', 'Machinery spaces', 'False alarms from hot-air blasts, doors to hot areas'],
        ['Flame – UV', 'Detects UV radiation of flames', 'Indoor process areas, turbine hoods', 'Welding arcs, lightning, X-ray; blinded by smoke / oil film'],
        ['Flame – UV/IR', 'Both UV and IR must see the fire', 'Process areas', 'Reduced false alarms; keep both windows clean'],
        ['Flame – multi-IR (IR3)', 'Several IR bands, CO₂ emission signature', 'Open process decks, wellhead, flare-exposed areas', 'Best for hydrocarbon fires and long range; sun / hot surfaces handled by algorithm'],
        ['Linear heat cable', 'Cable shorts / changes at set temperature', 'Cable trays, conveyors, tank tops', 'Mechanical damage gives false alarm; replace the activated section'],
        ['Fusible plug / pneumatic loop', 'Plug melts → loss of air pressure', 'Wellhead, process modules (often trips deluge directly)', 'Air leaks give alarm; check pressure switches'],
        ['Aspirating smoke (ASD)', 'Air sampled through pipes to a very sensitive detector', 'Server, telecom and switchgear rooms, under-floor voids', 'Blocked holes / filters → flow fault'],
        ['Manual call point', 'Break-glass / push-button', 'Escape routes, exits, muster areas', 'Test with key; Ex-certified type in hazardous areas']]) +
      H('Wiring & loops') + L([
        '<b>Addressable loops</b> (fire panel): every device has an address; loop runs out and back (Class A) with <b>short-circuit isolators</b> so a single fault loses only a small section.',
        '<b>Conventional zones</b>: detectors in parallel with an <b>end-of-line (EOL) resistor</b>; the panel monitors line current – open circuit = fault, short / high current = alarm or fault.',
        '<b>4–20 mA field detectors</b> (flame and gas) wired to the F&amp;G logic analogue inputs; currents below 4 mA indicate fault, inhibit or test (vendor-specific code).',
        'In hazardous areas devices are <b>Ex d / Ex e / Ex i</b> certified; IS loops use barriers or isolators – never add uncertified devices to an IS loop.']) + NOTE
    ],
    ['gas', '💨', 'Gas detection devices', () =>
      TB(['Detector', 'Measures', 'Principle', 'Strengths', 'Limitations'], [
        ['Catalytic bead (pellistor)', '0–100 % LEL flammable gas', 'Gas burns on a heated bead → resistance change', 'Detects H₂ and most flammables; low cost', 'Needs oxygen; poisoned by silicones, lead, H₂S; drift → frequent calibration'],
        ['Infrared point', '0–100 % LEL hydrocarbons', 'IR absorption at hydrocarbon wavelengths', 'No O₂ needed, fail-safe, cannot be poisoned, low drift', 'Does NOT detect hydrogen; optics fouled by dirt / water'],
        ['Open-path IR (line of sight)', '0–5 LEL·m along a beam', 'IR beam between transmitter and receiver (up to ≈ 100–200 m)', 'Covers large open areas and boundaries', 'Beam blocked by fog, heavy rain, scaffolding, cranes; needs good alignment and rigid mounting'],
        ['Electrochemical toxic', 'H₂S, CO, etc. (ppm)', 'Electrochemical cell', 'Accurate at low ppm', 'Limited life (≈ 2–3 years); dries out in heat; cross-sensitivity'],
        ['Metal-oxide (MOS) H₂S', 'H₂S ppm', 'Semiconductor resistance change', 'Robust in hot climates', 'Can sleep after long gas-free periods; humidity effects'],
        ['Oxygen', '0–25 % vol O₂', 'Electrochemical cell', 'Detects inert-gas leaks (N₂, CO₂)', 'Limited cell life'],
        ['Ultrasonic leak', 'Sound pressure (dB) of high-pressure leaks', 'Microphone picks up ultrasound from escaping gas', 'Detects leak independent of wind / gas dilution', 'Background noise must be mapped; does not measure concentration']]) +
      H('Typical alarm set-points (confirm in C&E)') + TB(['Gas / detector', 'Low alarm', 'High alarm'], [
        ['Point hydrocarbon (IR / catalytic)', '20 % LEL', '40–60 % LEL'],
        ['Open-path hydrocarbon', '1 LEL·m', '2–3 LEL·m'],
        ['HVAC air-inlet hydrocarbon', '10 % LEL', '20–30 % LEL (trip ventilation)'],
        ['Hydrogen (battery rooms)', '10–20 % LEL', '25–40 % LEL'],
        ['H₂S', '5 ppm', '10–15 ppm'],
        ['Oxygen deficiency', '19.5 % vol', '≈ 18 % vol'],
        ['Ultrasonic', '≈ 6 dB above background', 'Time-delayed confirmation']]) +
      H('Placement basics') + L([
        'Light gases (methane, hydrogen) rise – detectors high; heavy gases (propane, H₂S, condensate vapour) sink – detectors low.',
        'Locate according to the <b>gas-detection layout</b> / dispersion study: leak sources, air inlets, enclosed modules, boundaries.',
        'Fit weather / splash guards and keep sensors accessible for calibration (remote calibration adapters where access is difficult).']) + NOTE
    ],
    ['logic', '🧮', 'Voting, Cause & Effect, inhibits', () =>
      H('Voting') + L([
        '<b>1ooN</b> (any one detector) – raises an alarm and usually low-level actions (alarm, start of fans, beacons).',
        '<b>2ooN</b> (two detectors in the same area) – <b>confirmed</b> fire / gas → executive actions: ESD, ignition-source isolation, deluge, gaseous release.',
        'Detector <b>faults</b> may count as a vote (degraded voting) so a failed detector does not leave the area unprotected – know how your system treats faults and inhibits.',
        'Different detector types are often combined (e.g. one flame + one heat detector) to reduce false trips.']) +
      H('Cause & Effect (C&E) chart') + L([
        'A matrix: rows = causes (detectors, call points, groups), columns = effects (alarms, ESD, HVAC, deluge, PA/GA). Every crossing shows the action and voting.',
        'It is the master document for testing – every function test is signed off against the C&E.',
        'Changes to the C&E are <b>Management of Change</b> items – never modify logic without approved MoC and re-testing.']) +
      H('Inhibits, overrides & bypasses') + L([
        '<b>Inhibit</b> = the detector signal is ignored (for maintenance, calibration, faulty device). <b>Override</b> = an output / action is blocked.',
        'Always under a <b>permit</b> with risk assessment, control-room approval, time limit, compensating measures (portable detectors, fire watch) and an entry in the inhibit / override register.',
        'Remove every inhibit after the job and confirm on the HMI that the device is healthy and active.',
        'Long-standing inhibits are a major audit finding – review them every shift.']) +
      H('Typical 4–20 mA status codes (vendor-specific)') + TB(['Current', 'Typical meaning'], [
        ['0 mA', 'Loop open / power lost'], ['< 1–2 mA', 'Detector fault'], ['≈ 1.5–2 mA', 'Inhibit / calibration mode'], ['≈ 2–3 mA', 'Beam block (open-path) or dirty optics warning'], ['4 mA', 'Zero (no gas / no fire)'], ['4–20 mA', 'Measured value (e.g. 0–100 % LEL)'], ['> 20.5–21 mA', 'Over-range / fault']]) + NOTE
    ],
    ['outputs', '🚿', 'Protective actions & suppression', () =>
      TB(['System', 'How it is released', 'ETO points'], [
        ['Deluge (open nozzles)', 'Deluge valve opened by solenoid / pilot (or fusible-plug pneumatic loop)', 'Solenoid coil and line monitoring; manual release stations; test with release blocked where design allows'],
        ['Water mist', 'Section valves + pump unit', 'Pump control panel, pressure switches, section valve position feedback'],
        ['Fire pumps', 'Automatic start on fire / pressure drop', 'Start circuits, diesel-pump batteries & charger, controller in auto'],
        ['Foam', 'Foam pumps / proportioners with water systems (helideck, process)', 'Valve actuators, low-level alarms of foam tanks'],
        ['CO₂ total flooding', 'Manual release after evacuation; pre-discharge alarm + delay', 'LOCK-OUT valve / system isolated before entry for maintenance; ventilation & door interlocks; release alarms'],
        ['Clean agents (FM-200, Novec 1230, inert gas)', 'Automatic or manual release in switch / control rooms', 'Hold / abort switches, door contacts, cylinder pressure / weight monitoring'],
        ['HVAC dampers & fans', 'Close / stop on gas at inlet or fire in room', 'Damper end-switch feedback, fail-safe direction'],
        ['Ignition-source control', 'Trips non-essential electrical equipment', 'Know which consumers are tripped at each level and which remain for emergency use'],
        ['PA/GA & beacons', 'Alarm tones and coloured beacons (colours per installation)', 'Amplifier redundancy, loudspeaker line monitoring, beacon lamp checks']]) +
      L(['Outputs are normally <b>energise-to-act</b> (deluge, release) or <b>de-energise-to-trip</b> (ESD) – check which, because it decides how wire breaks are handled and monitored.',
        'Line monitoring of solenoids, sounders and beacons uses small test currents or EOL devices – an open line shows as a fault.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'Read the <b>F&amp;G layout drawings</b>, <b>C&amp;E charts</b>, loop diagrams and the Safety Requirement Specification; know the fire areas and gas zones of the installation.',
        'Know the logic solver architecture: redundant CPUs, I/O cards, power supplies, communications to ESD / PCS / fire panel, and what happens on single failures.',
        'Know the <b>inhibit / override procedure</b> and permit-to-work rules – the F&amp;G system must never be left blind without compensating measures.',
        'Understand detector technologies and their limitations (catalytic poisoning, IR blind to H₂, open-path beam blocks, electrochemical life).',
        'Calibrate with <b>certified calibration gas</b> of the right type and concentration (or the maker’s cross-calibration factor), correct regulator flow and adapter.',
        'Maintain <b>Ex integrity</b>: certified spares, correct glands, gaps, IS barriers; follow IEC 60079-17 inspection.',
        'Know the <b>SIL functions</b> and their <b>proof-test intervals</b>; records of proof tests are part of the safety case.',
        'Power: check UPS / battery autonomy, chargers and earth-fault monitoring of the 24 V DC system.',
        'Keep spare detectors, sensors, calibration gas (within expiry) and a test kit (smoke aerosol, heat gun, flame simulator, magnet / IR tool).',
        'Record everything: calibration certificates, as-found / as-left values, faults, inhibits, test sheets – auditors and class check them.',
        'Software / configuration changes only through <b>MoC</b> with backup, version control and re-testing of the affected functions.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Every shift / daily', 'Check F&G HMI for alarms, faults, inhibits & overrides; panel lamp test; UPS status'],
        ['Weekly', 'Test a share of manual call points & sounders in rotation; check deluge / fire-pump panels in AUTO; visual check of detectors in exposed areas'],
        ['Monthly', 'Bump-test gas detectors (gas reaches alarm, signal reaches logic); clean IR / flame windows; open-path signal-strength check'],
        ['3-monthly', 'Functional test of smoke / heat / flame detectors with aerosol, heat tool, flame simulator; check beam-block and fault annunciation'],
        ['6-monthly', 'Calibration of gas detectors (zero & span) – catalytic more often if drift seen; toxic sensors check; ultrasonic detector self-test / verification'],
        ['Yearly', 'Full C&E function test per area (inputs → logic → outputs incl. ESD, HVAC, deluge, PA/GA); UPS battery discharge test; Ex inspection sample'],
        ['Per SIL proof-test interval', 'Documented proof test of each SIF, end-to-end, as specified in the SRS'],
        ['2–3 years / on failure', 'Replace electrochemical and catalytic sensors; replace detectors at end of maker life']]) + NOTE
    ],
    ['cal', '🧪', 'Gas detector calibration steps', () =>
      L([
        'Obtain permit; inform control room; <b>inhibit</b> the detector (and its executive actions).',
        'Check calibration-gas cylinder: correct gas, concentration, certificate and expiry date.',
        'Apply <b>zero gas</b> (clean air / N₂ for O₂-independent sensors) and set zero.',
        'Apply <b>span gas</b> at the maker’s flow rate through the correct adapter; wait for a stable reading; adjust span.',
        'Record as-found and as-left values; investigate large drift (poisoning, contamination).',
        'Allow reading to return to zero, confirm the 4–20 mA at the logic solver and HMI.',
        'Remove the inhibit, confirm healthy status, close the permit.']) + NOTE
    ],
    ['firetest', '🔦', 'Fire detector test steps', () =>
      L([
        'Inhibit the zone / outputs as per procedure (avoid deluge or gaseous release!).',
        'Smoke: approved test aerosol through a test cup. Heat: heat tool, never an open flame. Flame: maker’s flame simulator at stated distance.',
        'Confirm the alarm at the panel / HMI and the correct address / tag; reset and restore.',
        'For gaseous-extinguishing areas, the release circuit must be isolated (lock-out) before testing detectors.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Gas detector in fault (< 4 mA)', 'Power loss, cable damage, water ingress, sensor failure, open-path beam block', 'Measure supply at the head (typ. 18–32 V DC), loop current, junction-box condition; read detector diagnostics'],
        ['Reading drifts / negative', 'Contamination, temperature, sensor ageing, wrong zero', 'Clean optics, re-zero in clean air, calibrate; replace sensor if span not reachable'],
        ['Catalytic detector reads low on span gas', 'Poisoning (silicone, H₂S, lead) or inhibition', 'Replace sensor; find the poison source (sprays, sealants)'],
        ['Open-path frequent beam block', 'Misalignment from vibration, fog / rain, scaffolding, dirty lenses', 'Re-align with tool, clean lenses, check mounting rigidity, review obstruction'],
        ['Spurious flame alarm', 'Welding / grinding, sun reflections, flare radiation, hot exhaust, lightning', 'Check for hot work without inhibit; review field of view; adjust sensitivity per maker'],
        ['Spurious smoke alarm', 'Dust, steam, cooking, painting, exhaust fumes', 'Clean / replace detector; consider heat detector for the area'],
        ['H₂S detector slow / no response', 'Cell dried out (hot climate), expired cell, blocked filter', 'Bump test; replace cell / filter; use detector suited to climate'],
        ['Addressable loop fault', 'Open / short in the loop, isolator operated, duplicated address', 'Panel loop diagnostics, locate isolator in open state, insulation test with devices disconnected'],
        ['Earth fault on 24 V DC', 'Wet junction box, damaged cable, failed device', 'Earth-fault monitor reading; split the system section by section'],
        ['Output (solenoid, sounder) line fault', 'Open circuit, missing EOL, failed coil', 'Measure line resistance with outputs isolated; check EOL value'],
        ['Logic solver card / CPU fault', 'Hardware failure, power supply, communication', 'Check redundancy is still healthy; replace card hot-swap only per maker procedure; record']]) +
      H('Safe troubleshooting rules') + L([
        'Inform the control room and work under permit – any wire you touch can trigger ESD, deluge or general alarm.',
        'Inhibit inputs and override outputs as required; arrange compensating measures (portable gas monitors, fire watch).',
        'Use only Ex-approved test equipment in hazardous areas or obtain a hot-work / gas-free permit.',
        'Never short or disconnect an output line to “stop an alarm” – find the cause.',
        'After repair: test the device end-to-end, remove inhibits, confirm healthy on HMI and record the work.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Fire & Gas System (Offshore)', icon: '🧯', accent: '#dc2626',
    subtitle: 'Offshore Fire & Gas systems – detectors, logic and voting, protective actions, what the ETO should know, maintenance, calibration and troubleshooting.',
    refs: ['IMO MODU Code', 'IEC 61511', 'ISO 13702', 'IEC 60079-29', 'EN 54'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
