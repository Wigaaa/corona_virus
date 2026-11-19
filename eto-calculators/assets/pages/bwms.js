(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values are typical. The BWM Convention, the system’s type-approval certificate (IMO / USCG), the ship’s approved BWM Plan, flag / port-state requirements and the maker’s manuals always govern.</p>';

  const S = [
    ['overview', '🌊', 'Overview & regulations', () =>
      `<p>A <b>Ballast Water Management System (BWMS)</b> treats ballast water so that harmful aquatic organisms and pathogens are not carried from one region to another. For the ETO it is a high-power, sensor-rich, automated plant whose correct operation and <b>records</b> are checked by port-state control.</p>` +
      H('BWM Convention – the two standards') + TB(['Standard', 'Meaning', 'Notes'], [
        ['D-1 Ballast water exchange', 'Exchange of at least 95 % of the ballast volume at sea (sequential, or flow-through by pumping three times the tank volume)', 'Normally at least 200 nm from land in at least 200 m depth (50 nm as a fallback); now only an interim / contingency method'],
        ['D-2 Performance standard', 'Discharged water must contain fewer than set limits of viable organisms and indicator microbes', 'Fewer than 10 viable organisms per m3 of 50 µm and larger; fewer than 10 per mL of 10 to 50 µm; limits for toxicogenic Vibrio cholerae, E. coli and intestinal Enterococci'],
        ['Phase-in', 'Ships had to meet D-2 by the first IOPP renewal survey on or after 8 September 2019', 'Final deadline 8 September 2024 – ships in international trade must now meet D-2']]) +
      H('Documents and approvals') + L([
        '<b>BWM Plan</b> – ship-specific, approved by flag / class; describes the system, procedures, safety, sampling points and responsible officer.',
        '<b>Ballast Water Record Book (BWRB)</b> – every ballast operation (uptake, treatment, discharge, bypass, exchange, accidental discharge, failures) is recorded; kept on board for a set number of years (typically 2 on board, total retention longer).',
        '<b>International Ballast Water Management Certificate</b> – issued after survey.',
        '<b>Type approval</b> – originally IMO Guidelines <b>G8</b>; replaced by the mandatory <b>BWMS Code</b> for systems installed from late 2020. Systems using active substances (e.g. chlorine, ozone) also need IMO <b>G9</b> (GESAMP) approval.',
        '<b>USCG type approval</b> (46 CFR 162.060) is required for discharge in US waters; it uses its own test protocols, and some systems have different operating limits under USCG and IMO certificates.',
        '<b>Commissioning testing</b> (sampling and analysis after installation) is now required for new installations – see the maintenance tab.']) +
      `<p>Related pages: ${A('pumps.html', 'Pumps guide')}, ${A('valves.html', 'Remote Control Valves guide')}, ${A('harmonics.html', 'Harmonics / THD')}.</p>` + NOTE
    ],
    ['tech', '🧪', 'Treatment technologies', () =>
      `<p>Almost all systems use two stages: <b>solid–liquid separation</b> (filtration, sometimes cyclone) to remove larger organisms and sediment, followed by <b>disinfection</b>. The two most common disinfection methods on ships are <b>UV</b> and <b>electro-chlorination</b>.</p>` +
      TB(['Technology', 'Principle', 'Strengths', 'Limitations (typical)'], [
        ['Filtration + UV', 'Filter (typically 20–50 µm) then UV-C light damages DNA so organisms cannot reproduce', 'No chemicals, no residual oxidant, simple discharge', 'Water must be treated again at discharge on most systems; low UV transmittance (muddy / turbid water) reduces dose and capacity; high power; lamp life'],
        ['Electro-chlorination (electrolysis)', 'Seawater electrolysis produces sodium hypochlorite (active substance); measured as TRO; neutralised before discharge', 'Treat once at uptake (residual keeps working); scales to large flows; lower power per m3 for big ships', 'Needs sufficient salinity and temperature (fresh / cold water may need brine or heating); hydrogen by-product; neutralisation chemicals; corrosion concerns'],
        ['Chemical dosing', 'Stored biocide (e.g. hypochlorite or other approved oxidant) dosed into the ballast line, then neutralised', 'Low electrical power, independent of salinity', 'Chemical storage, handling and supply; crew exposure risk'],
        ['Ozone', 'Ozone generator injects ozone; forms oxidants in seawater', 'Strong oxidant', 'Toxic gas handling, generator power and cooling; neutralisation'],
        ['Deoxygenation (inert gas)', 'Removes oxygen from ballast water (e.g. with inert gas) so organisms die', 'Can reduce tank corrosion', 'Needs holding time of several days; gas generator; mostly niche use'],
        ['Other / combined', 'Cavitation, heat, advanced oxidation, combined UV + other methods', 'Varies', 'Check type-approval limits']]) +
      H('Key parameters on the type-approval certificate') + L([
        'Treatment rated capacity (TRC) in m3/h.',
        'Limits on <b>salinity</b>, <b>temperature</b> and (for UV) <b>UV transmittance</b>.',
        'Minimum <b>holding time</b> in the tank before discharge.',
        'Maximum allowable discharge concentration of active substances (e.g. TRO).',
        'IMO and USCG limits may differ – the operator must know which apply in the current port.']) + NOTE
    ],
    ['uv', '💡', 'UV system structure', () =>
      TB(['Component', 'Function', 'ETO notes'], [
        ['Automatic backflush filter', 'Removes organisms and sediment above the mesh size before the UV reactor', 'Differential pressure transmitter, backflush valve / motor, drain to overboard'],
        ['UV reactor(s)', 'Stainless chamber with lamps in quartz sleeves; water flows past the lamps', 'Often several reactors in parallel for large flow'],
        ['UV lamps', 'Medium-pressure (high power per lamp) or low-pressure / amalgam lamps', 'Lamp life typically a few thousand hours; hours counter per lamp; contains mercury – handle as hazardous waste'],
        ['Lamp drivers / ballasts', 'Electronic power supplies controlling lamp power (often dimmable)', 'Heat, cooling fans / water cooling, fault signals, harmonics'],
        ['UV intensity sensors', 'Measure UV irradiance in the reactor to calculate dose', 'Need periodic calibration / reference check; fouling gives low readings'],
        ['Wipers / cleaning', 'Mechanical wipers clean the quartz sleeves; some systems use CIP chemical cleaning', 'Wiper motor, limit switches, wiper failure alarm'],
        ['Temperature sensors / flow', 'Protect reactor from overheating when flow stops; flow meter for dose', 'Lamp shutdown on high temperature or no flow'],
        ['Control panel / PLC', 'Calculates dose, controls lamp power and flow, logs data', 'HMI, data storage, remote panel on bridge / ECR']]) +
      H('How dose is controlled') + L([
        'UV dose ≈ intensity × exposure time; the PLC adjusts lamp power and / or limits flow to keep the dose above the approved minimum.',
        'If UV transmittance is low (turbid water) the system may <b>reduce flow</b> (flow-control valve) or alarm.',
        'Most UV systems treat at <b>uptake and again at discharge</b> – so the system must run during deballasting too.',
        'Lamps need a warm-up / cool-down period – ballast pumps should not start before the system reports ready.']) + NOTE
    ],
    ['ec', '⚗️', 'Electro-chlorination structure', () =>
      TB(['Component', 'Function', 'ETO notes'], [
        ['Filter', 'As for UV – removes larger organisms; backflush to sea', 'dP monitoring, backflush valve control'],
        ['Side-stream booster pump', 'Takes a small part of ballast flow through the electrolyser', 'Motor starter / VFD, low-flow interlock'],
        ['Electrolyser cells', 'Titanium electrodes with coating; DC current produces hypochlorite from seawater', 'Cell voltage / current monitoring; scaling (acid cleaning); coating wear'],
        ['Rectifier / DC power supply', 'Converts AC to controlled DC for the cells (high current, low voltage)', 'Thyristor or IGBT rectifier, transformer, cooling, harmonics, earth-fault monitoring of DC circuit'],
        ['Degas tank / H2 separation', 'Separates hydrogen gas produced in electrolysis', 'Dilution fans, H2 gas detectors, airflow switches – interlocked with rectifier'],
        ['Dosing line / injection', 'Injects the hypochlorite solution into the main ballast line', 'Dosing valve, flow meter'],
        ['TRO sensors / analysers', 'Measure Total Residual Oxidant after dosing and before discharge', 'Reagent-based (e.g. DPD) or amperometric; reagents, calibration, sample pump'],
        ['Neutralisation unit', 'Doses reducing agent (e.g. sodium thiosulfate or bisulfite) during deballasting so discharge TRO is below the limit', 'Tank level, dosing pump, mixing, TRO check at discharge'],
        ['Salinity / temperature sensors', 'Check water is within approved limits for electrolysis', 'Low salinity may need a brine tank / dosing or other method']]) +
      H('Typical operating logic') + L([
        'At uptake the controller doses to a TRO set-point (typically a few mg/L as Cl2, per type approval) proportional to the ballast flow.',
        'At discharge the neutralising agent is dosed so that discharge TRO is typically below about 0.1 mg/L (follow the certificate value).',
        'Hydrogen safety interlocks must prove ventilation / dilution before the rectifier is energised.',
        'Many systems allow treating only once (at uptake); TRO in tanks decays with time and temperature.']) + NOTE
    ],
    ['flow', '🔧', 'Filters, valves & flow control', () =>
      H('Filters') + L([
        'Automatic screen / disc filters, typically 20–50 µm mesh.',
        '<b>Backflush</b> is triggered by high differential pressure (dP) and / or time; a rotating suction scanner or valves clean the screen while the filter stays in service.',
        'Repeated backflush or continuous high dP means heavy sediment, mesh damage or backflush failure – flow may need to be reduced.',
        'Backflush water goes overboard at the uptake location (this is allowed since it returns to the same place).']) +
      H('Valves') + L([
        'Remote-controlled (pneumatic / hydraulic / electric) valves select treatment, bypass, backflush and overboard routes – see the ' + A('valves.html', 'Remote Control Valves guide') + '.',
        'Position feedback (limit switches) is critical: the BWMS logs valve positions to prove that water was treated and that <b>bypass was not used</b> without record.',
        'A <b>flow-control valve</b> after the reactor / dosing point limits flow to the treatment rated capacity.',
        'Interlocks prevent ballast pumps running through the system unless the system is ready.']) +
      H('Flow measurement') + L([
        'Electromagnetic flow meters are common; the BWMS uses flow to calculate UV dose or chlorine dosing.',
        'Flow meters need straight pipe runs, correct earthing and a full pipe – air and partial filling give false readings.',
        'Flow signals (4–20 mA) are logged; a failed flow meter usually stops treatment.']) +
      H('Pumps') + L([
        'Ballast pumps must not exceed the treatment rated capacity; VFDs or throttling may be needed – see the ' + A('pumps.html', 'Pumps guide') + '.',
        'Filter and reactor pressure drop reduce pump capacity – check after retrofit.']) + NOTE
    ],
    ['elec', '⚡', 'Electrical, power & control system', () =>
      TB(['Item', 'What to check (typical)'], [
        ['Power demand', 'UV systems and electrolysers can need tens to several hundred kW at full flow; check generator capacity and load-dependent start before ballasting'],
        ['PMS / heavy consumer', 'BWMS often defined as a heavy consumer – start request and power available signal from PMS'],
        ['Rectifiers and lamp drivers', 'Non-linear loads that create harmonic currents; check THD on the switchboard, especially on retrofits'],
        ['Cooling', 'Rectifiers, UV drivers and panels need ventilation or water cooling; overheating causes trips'],
        ['Hazardous area', 'On tankers and gas carriers equipment in the pump room or cargo area must be Ex-certified, or installed in a safe area with gas-tight separation; electrolysis hydrogen creates its own hazardous zone'],
        ['Earthing and EMC', 'Screened signal cables, separation from power cables, earth bonding of reactors and pipe sections'],
        ['Insulation monitoring', 'IT system earth faults from lamp drivers, wipers, rectifier DC side'],
        ['Control power / UPS', 'PLC and data logger supply; a power loss must not lose stored records']]) +
      H('Control system & data logging') + L([
        'A PLC with HMI in the BWMS room and often a remote panel in ECR / CCR / bridge.',
        'Logs operating data: mode, flow, UV intensity / dose or TRO, salinity, temperature, valve positions, alarms, bypass events, start / stop times and volumes.',
        'Records are typically required to be stored for at least 24 months and exported for PSC – back up and check the clock (UTC / ship time).',
        'Interface signals: ballast pump run / stop, valve remote control, PMS power request, alarm to the AMS.',
        'Software updates only by the maker and under Management of Change; keep the configuration backup.']) +
      `<p>See ${A('harmonics.html', 'Harmonics / THD')} for harmonic distortion checks.</p>` + NOTE
    ],
    ['ops', '🚦', 'Operation modes, bypass & records', () =>
      TB(['Mode', 'What happens (typical)'], [
        ['Ballasting (uptake)', 'Filter + disinfection (UV or electrolysis dosing); backflush overboard; data logged'],
        ['Deballasting (discharge)', 'UV systems: second UV treatment (filter usually bypassed). Electrolysis: TRO measured and neutralised before overboard'],
        ['Stripping', 'Small volumes from tank bottoms; may follow deballasting route with lower flow'],
        ['Internal transfer', 'Tank-to-tank transfer – check the BWM Plan whether treatment is required'],
        ['Bypass', 'Treatment bypassed (emergency, ship safety, or system failure); must activate an alarm and be recorded in the BWMS and the BWRB'],
        ['Cleaning / CIP', 'Sleeve, filter or electrolyser cleaning cycle; freshwater flushing after operation to protect the system'],
        ['Standby / shutdown', 'Lamps cooled down, lines flushed, reagent / chemical stock checked']]) +
      H('Bypass and failures') + L([
        'Bypass valves are monitored; opening them is <b>alarmed and logged</b> with time and position.',
        'If the BWMS fails, follow the <b>BWM Plan contingency</b> measures and inform flag / port state as required – do not discharge untreated water without approval.',
        'IMO guidance on contingency measures allows options such as exchange, discharge to a reception facility or retaining ballast, depending on port state agreement.',
        'Record failures and repairs in the BWRB and the maintenance system.']) +
      H('Records') + L([
        'BWRB entries signed by the officer in charge; master signs each page.',
        'Data log from the BWMS must agree with the BWRB and the ballast log / tank sounding.',
        'PSC often asks for: BWMS operating log, alarm history, BWRB, BWM Plan, certificate, maintenance and calibration records.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The type of system, its <b>treatment rated capacity</b>, and the limits on the type-approval certificate (salinity, temperature, UVT, holding time).',
        'The <b>single-line diagram</b>: which switchboard feeds the BWMS, breaker sizes, and how many generators are needed before ballasting.',
        'The start sequence and interlocks: lamps / rectifier ready, valves in position, pump start permissions.',
        'How to read the HMI, alarm list and data log – and how to export records for PSC.',
        'Sensor calibration: UV intensity sensors, TRO analysers, flow meters, salinity / temperature, dP transmitters.',
        'Hazards: UV radiation, mercury in lamps, hydrogen gas, chlorine / chemicals, high DC current, hot surfaces.',
        'Ex requirements if the system is in a hazardous area (tankers).',
        'Effect on the network: harmonics and load steps from rectifiers and lamp drivers.',
        'Spare parts: lamps, sleeves, wipers, sensors, reagents, filter elements, drivers / rectifier modules, fuses.',
        'Contingency measures in the BWM Plan when the system fails.',
        'Keep maker service bulletins and software versions on file.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Each operation', 'Check system ready, alarms, flow, dose / TRO values, filter dP and backflush; verify data logging; fresh-water flush after use if specified'],
        ['Weekly / before port', 'HMI alarm history, reagent and neutraliser stock, lamp hour counters, UPS / control power, clock check'],
        ['Monthly', 'Wiper operation, quartz sleeve condition, TRO analyser zero / span check, H2 detector and dilution fan test, valve feedback test'],
        ['3–6 monthly', 'UV intensity sensor reference check, flow meter verification, filter mesh inspection, rectifier and driver cooling clean'],
        ['Yearly', 'Insulation tests of lamps / motors, electrolyser inspection and cleaning, sensor calibration per maker, data log backup and archive, annual survey'],
        ['By lamp hours', 'UV lamp replacement (typically after a few thousand hours or when output falls); dispose as mercury waste'],
        ['After repair / modification', 'Function test, update records, inform class if required']]) +
      H('Commissioning testing & sampling') + L([
        'On new installations a <b>commissioning test</b> verifies that the installed system meets D-2: representative samples of treated ballast water are taken and analysed (indicative or detailed analysis) per IMO guidance.',
        'Sampling points (in line with the BWM Plan) must be installed and accessible on the discharge line.',
        'Port state may take samples during inspection – an indicative test first, detailed analysis if needed.',
        'Self-monitoring parameters (UV intensity, TRO, flow) are also checked during commissioning.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Low UV intensity / dose alarm', 'Fouled quartz sleeves, low UV transmittance water, aged lamps, faulty sensor', 'Run wipers / CIP, check lamp hours and power, check sensor, reduce flow'],
        ['UV lamp failure', 'Lamp end of life, broken lamp / sleeve, driver fault, cable / connector', 'Identify lamp from HMI, check driver alarms, replace lamp, check sleeve for water ingress'],
        ['Lamp driver / ballast fault', 'Overheating, cooling fan failure, supply voltage, component failure', 'Check cooling, ambient temperature, supply, reset per maker, replace module'],
        ['Wiper failure', 'Motor fault, mechanical jam, limit switch failure', 'Check motor supply and current, limit switches, mechanical drive'],
        ['Filter dP high / continuous backflush', 'Heavy sediment, clogged mesh, backflush valve or motor failure', 'Check backflush valve and motor, dP transmitter, mesh; reduce flow; clean filter'],
        ['Backflush failure', 'Valve not opening, drain line blocked, scanner motor fault', 'Check valve feedback, drain line, motor overload, control signal'],
        ['Flow too low / no flow alarm', 'Pump problem, valve not open, flow meter fault, filter blocked', 'Check valve positions, pump, flow meter signal and earthing, filter dP'],
        ['TRO out of range (high or low)', 'Analyser fault, reagent empty, electrolyser output low, wrong flow signal', 'Check reagents, calibration, sample flow, rectifier current, flow signal'],
        ['Discharge TRO above limit', 'Neutraliser empty or dosing pump fault', 'Stop discharge, check neutraliser tank and pump, analyser'],
        ['Rectifier fault / trip', 'Overcurrent, overtemperature, cooling failure, earth fault, H2 interlock', 'Check alarms, cooling, insulation, H2 fan and detector, cell condition'],
        ['Low cell current / high cell voltage', 'Scaling of electrodes, low salinity, low temperature, worn coating', 'Check salinity and temperature limits, acid clean, inspect electrodes'],
        ['Power trip / supply lost', 'Insufficient generators, overload, harmonics, cable / breaker fault', 'Check PMS and generator load, breaker trip reason, harmonics, start with more generators'],
        ['Data log not recording', 'Storage full, PLC / HMI fault, clock or power issue', 'Check storage, export and back up, check clock; record manually and report']]) +
      L(['If the system cannot treat, follow the <b>BWM Plan contingency</b> measures and inform the master – do not bypass without authorisation and records.']) + NOTE
    ],
    ['safety', '⚠️', 'Safety & lessons', () =>
      H('Hazards') + L([
        '<b>UV-C radiation</b> – never look at energised lamps; lamps only operated inside closed reactors with interlocks.',
        '<b>Mercury</b> – broken lamps release mercury; use spill kit, ventilate, dispose as hazardous waste.',
        '<b>Hydrogen gas</b> from electrolysis – explosion risk; ventilation, H2 detectors, no ignition sources.',
        '<b>Chemicals</b> – hypochlorite, neutralisers, reagents and CIP acids; PPE and SDS.',
        '<b>Electrical</b> – high current DC from rectifiers, capacitors in drivers; isolate and prove dead.',
        '<b>Pressure and hot surfaces</b> – reactors and pipework; drain before opening.']) +
      H('Lessons learned') + L([
        'Many systems were retrofitted with limited space – check ventilation, cable routing and access during design.',
        'Under-sized power supply and harmonic problems are common after retrofit – check generator capacity and THD.',
        'PSC detentions often relate to <b>records</b>: missing BWRB entries, data log gaps, or bypass use without record.',
        'Crew familiarity matters – train officers on the HMI, alarms and contingency procedures.',
        'Keep spares and consumables (lamps, reagents, neutraliser) on board – the system cannot run without them.',
        'Report failures early to the company and maker; repeated faults may need design changes.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Ballast Water Management System (Guide)', icon: '🌊', accent: '#0369a1',
    subtitle: 'What the ETO should know about BWMS – regulations, treatment technologies, UV and electro-chlorination systems, filters and valves, electrical and control, operating modes and records, maintenance, troubleshooting and safety.',
    refs: ['IMO BWM Convention (D-1 / D-2)', 'BWMS Code / G8 / G9', 'USCG 46 CFR 162.060', 'Ship BWM Plan & maker manuals'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
