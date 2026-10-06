(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values shown are typical. The maker’s manuals, SOLAS, the flag state, class rules and the vessel’s own procedures always govern.</p>';

  const S = [
    ['overview', '🔋', 'Overview & uses on board', () =>
      `<p>Batteries and UPS (Uninterruptible Power Supply) systems keep essential and safety equipment running when the main or emergency AC supply is lost, during the gap before the emergency generator connects, and through transients and blackouts. On offshore units and DP vessels they are part of the redundancy concept – a weak battery is a hidden failure.</p>` +
      H('Where batteries & UPS are used') + TB(['Application', 'Purpose', 'Typical supply'], [
        ['Transitional source of emergency power (SOLAS II-1/42-43)', 'Bridges the gap until the emergency generator is on line – emergency lighting, alarms, communications', 'Accumulator battery, 24 V DC or UPS; typically 30 min'],
        ['Emergency source (where battery is the emergency source)', 'Supplies emergency services directly for the required period (small ships / some installations)', 'Large battery bank; period per SOLAS / class'],
        ['GMDSS radio installation', 'Reserve source for VHF, MF/HF, Inmarsat / satellite terminals', 'Dedicated 24 V battery with automatic charger; typically 1 h (or 6 h without emergency generator)'],
        ['Emergency generator start', 'Electric starter batteries (one of the starting means)', '24 V battery with own charger; repeated start attempts'],
        ['24 V DC control & alarm systems', 'Alarm monitoring, engine safety, fire detection, PA / GA, internal comms, navigation lights', '24 V DC distribution from charger + battery'],
        ['IAS / PMS / DP control', 'Controllers, operator stations, network, sensors, references', 'AC UPS per redundancy group; typically ≥ 30 min'],
        ['Fire & Gas, ESD (offshore)', 'Detection, executive actions, shutdowns must work after loss of main power', 'Dedicated UPS / DC systems, often dual; autonomy per safety philosophy'],
        ['Navigation equipment', 'Gyro, ECDIS, radar consoles, VDR (VDR has its own reserve source)', 'UPS or 24 V DC'],
        ['Switchboard control', 'Breaker closing / tripping, protection relays, synchronising', '24 V or 110 V DC from battery / UPS'],
        ['Hybrid / ESS (brief)', 'Peak shaving, spinning reserve, zero-emission harbour mode', 'Large Li-ion battery systems with BMS and DC converters']]) +
      H('Related pages') + `<p>${A('battery.html', 'Battery &amp; UPS calculations')} (capacity, autonomy, charger sizing), ${A('instruments.html', 'ETO Instruments (battery tester)')}, ${A('switchboards.html', 'MSB &amp; ESB guide')}.</p>` + NOTE
    ],
    ['types', '🧪', 'Battery types', () =>
      TB(['Type', 'Nominal cell voltage', 'Characteristics', 'Ventilation / gas', 'Typical life (typical)'], [
        ['Vented (flooded) lead-acid', '2.0 V', 'Cheap, robust, electrolyte level visible, needs topping up with distilled water; specific gravity shows state of charge', 'Significant hydrogen during charge, especially boost / equalise – battery room ventilation essential', '10–20 years (stationary types)'],
        ['VRLA – AGM', '2.0 V', 'Sealed, recombination of gases, no topping up, sensitive to high temperature and overcharge; short life above 25 °C', 'Low gas emission in normal float but safety valve can vent – ventilation still required', '3–12 years design (often less in practice)'],
        ['VRLA – Gel', '2.0 V', 'Gelled electrolyte, better deep-cycle and heat tolerance than AGM, lower high-rate performance', 'Low emission; ventilation still required', '5–15 years design'],
        ['Nickel-cadmium (NiCd)', '1.2 V', 'Very robust, tolerant of temperature, deep discharge and abuse; good for engine starting and offshore safety systems; cell voltage does not show state of charge well; memory effect in some types', 'Vented types emit hydrogen; alkaline (KOH) electrolyte', '15–25 years'],
        ['Lithium-ion (LFP, NMC etc.)', '3.2–3.7 V', 'High energy density, high efficiency, long cycle life; needs a Battery Management System (BMS) for cell voltage, temperature and balancing', 'Normally no gas in operation, but thermal runaway releases flammable and toxic gases', '10–20 years (cycle dependent)']]) +
      H('Key points') + L([
        '<b>Never mix</b> lead-acid and NiCd in the same room or use the same tools / hydrometers – the electrolytes (acid / alkaline) neutralise and destroy each other.',
        'Capacity is rated in Ah at a stated discharge time (e.g. C10 or C5) and temperature – at higher discharge rates the usable capacity is lower (Peukert effect).',
        'Lead-acid life roughly halves for every ~10 °C above 20–25 °C (typical rule of thumb).',
        'Lithium-ion: chemistry matters – LFP (lithium iron phosphate) is more thermally stable than NMC. Class rules for Li-ion (e.g. DNV, ABS, LR, BV) require risk assessment, BMS, separate battery space, ventilation, gas detection, fire extinguishing and approval of the system above a certain capacity (rule-dependent).',
        'Use only battery types approved for the application – replacing a NiCd bank with VRLA (or vice versa) needs charger settings changed and may need class acceptance.']) + NOTE
    ],
    ['chargers', '🔌', 'Chargers & DC distribution', () =>
      H('Charging modes') + TB(['Mode', 'Purpose', 'Typical setting (typical – check maker)'], [
        ['Float', 'Keeps a fully charged battery at 100 % and supplies the DC load', 'Lead-acid VRLA ~2.23–2.27 V/cell; vented ~2.20–2.25 V/cell; NiCd ~1.40–1.45 V/cell'],
        ['Boost / fast charge', 'Recharges quickly after discharge', 'Lead-acid ~2.35–2.40 V/cell; NiCd ~1.50–1.65 V/cell; time-limited'],
        ['Equalise', 'Equalises cell voltages and specific gravity in vented lead-acid', 'Higher than float, periodic and time-limited; not normally for VRLA unless maker allows'],
        ['Commissioning / initial charge', 'First charge of new cells', 'Per battery maker only']]) +
      L([
        '<b>Temperature compensation</b>: float voltage is reduced as battery temperature rises (typically ~ −3 to −5 mV/°C per cell for lead-acid) – the sensor must be on the battery, not in the charger cabinet.',
        'Charger must supply the full DC load <b>plus</b> recharge current; typical requirement is to recharge the battery from discharged to (about) 80 % within ~10 h (check SOLAS / class for the application).',
        'Current limiting protects VRLA batteries from excessive charge current.',
        'Boost charging on loads connected: high DC voltage may exceed equipment limits – some systems use dropper diodes or a separate load bus.',
        'Chargers and rectifiers alarm on: mains failure, charger failure, high / low DC voltage, battery breaker open, earth fault, high temperature.']) +
      H('DC distribution & earth fault') + L([
        'Ship DC systems are normally <b>insulated (IT) systems</b> – neither pole earthed – so a single earth fault does not trip anything but must be found and cleared.',
        'An <b>earth-fault (insulation) monitor</b> alarms on low insulation on either pole; a second fault on the other pole is a short circuit and can cause false operation of control circuits (e.g. a relay energised without its contact).',
        'Find DC earth faults by sectioning circuits (with permission), or with a portable DC earth-fault locator (injection + clamp) – avoid disconnecting safety circuits without informing the bridge / ECR.',
        'Distribution boards have fuses or MCBs per circuit; selectivity matters so one fault does not lose a whole board.']) +
      `<p>Charger and autonomy calculations: ${A('battery.html', 'Battery &amp; UPS calculations')}.</p>` + NOTE
    ],
    ['ups', '🔄', 'UPS topologies & bypass', () =>
      TB(['Topology', 'How it works', 'Transfer on mains loss', 'Typical use'], [
        ['Online double conversion (VFI)', 'Rectifier → DC bus (battery) → inverter supplies the load continuously', 'No break – inverter already supplying', 'IAS, PMS, DP, F&G / ESD, navigation – the normal choice for critical loads'],
        ['Line-interactive (VI)', 'Load on mains through an AVR transformer; inverter assists and takes over on failure', 'Short transfer (few ms)', 'Office / IT loads, less critical consumers'],
        ['Offline / standby (VFD)', 'Load on mains; inverter starts on failure', 'Transfer break (typically several ms)', 'Small PCs, non-critical equipment']]) +
      H('Main parts of an online UPS') + TB(['Part', 'Function'], [
        ['Rectifier / charger', 'Converts AC input to DC, charges battery and feeds inverter'],
        ['Battery and battery breaker', 'Energy store; breaker or fuse isolates the battery for maintenance – check it is closed after work'],
        ['Inverter', 'Converts DC to clean AC for the load'],
        ['Static bypass (static switch)', 'Automatically transfers load to the bypass supply on inverter fault or overload, without a break (needs synchronised bypass)'],
        ['Maintenance (manual) bypass', 'Manual switch that feeds the load directly from bypass supply so the UPS can be isolated for work'],
        ['Isolation transformer (if fitted)', 'Galvanic separation, keeps IT systems isolated']]) +
      H('Bypass – points to remember') + L([
        'On <b>static bypass</b> the load is on raw supply – <b>no battery protection</b>. A blackout now drops the load. Treat “UPS on bypass” as a degraded condition (on DP it is usually an ASOG item).',
        'Bypass transfer without break requires the inverter to be synchronised to the bypass supply; if out of sync the transfer may be blocked or with a break.',
        'Follow the maker’s sequence exactly when switching to / from maintenance bypass – a wrong sequence can drop the load or parallel unsynchronised sources.',
        'Separate bypass input from a different supply section gives better redundancy than bypass from the same board as the rectifier.',
        'Parallel / redundant UPS (N+1) share the load; a failed module disconnects automatically.']) + NOTE
    ],
    ['rooms', '🧯', 'Battery rooms, ventilation & Li-ion safety', () =>
      H('Battery rooms & lockers') + L([
        'Large vented batteries are installed in a dedicated <b>battery room</b> or deck locker; smaller ones in ventilated boxes. Location and ventilation according to SOLAS / class (IEC 60092-305 / -507 / IEC 62485 type requirements).',
        '<b>Hydrogen</b> is lighter than air and explosive between ~4 % and ~75 % in air – ventilation outlet at the <b>top</b> of the room, natural or mechanical; fans of non-sparking / certified type, motors outside the gas flow where required.',
        'Charger output for boost charging may be interlocked with ventilation running (where required).',
        '<b>No ignition sources</b>: no smoking, naked flames or sparks; only certified (Ex) lighting and equipment inside; use insulated tools; remove rings and watches.',
        'Warning signs on the door: no smoking / naked flames, battery type, corrosive electrolyte.',
        'Shelves and racks secured against ship motion; cells protected against short circuit by covers on terminals.',
        'Do not use the battery room for storage.']) +
      H('Personal protection') + L([
        'PPE: face shield / goggles, acid- or alkali-resistant gloves and apron, safety boots.',
        '<b>Eyewash</b> station or bottles close to the batteries; rinse with clean water for at least 15 minutes and get medical advice.',
        'Separate tools, hydrometers and electrolyte for lead-acid and NiCd.',
        'When mixing electrolyte: always add acid to water, never water to acid.']) +
      H('Lithium-ion safety (qualitative)') + L([
        '<b>Thermal runaway</b>: internal short, overcharge, over-discharge, mechanical damage or overheating can make a cell self-heat uncontrollably, vent flammable and toxic gases (including hydrogen fluoride) and spread to neighbouring cells.',
        'The <b>BMS</b> monitors cell voltages, temperatures and current and disconnects the battery outside safe limits – its alarms must never be ignored or bypassed.',
        'Class rules typically require: risk assessment / FMEA, approved system and cells, separate battery space with A-class boundaries depending on size, ventilation, off-gas / temperature detection, suitable fixed fire-fighting (often water-based), and emergency shutdown.',
        'Damaged, swollen or overheated Li-ion modules: isolate, keep personnel away, follow the maker’s and vessel’s emergency procedure.',
        'Also applies to small Li-ion packs (tools, portable radios, laptops): approved chargers, no charging unattended in cabins, store away from heat.']) + NOTE
    ],
    ['redund', '🛡️', 'Redundancy & critical consumers', () =>
      H('Redundancy principles') + L([
        'Critical systems are fed from <b>two independent UPS / DC systems (A / B)</b>, each supplied from a different switchboard section, ideally in different fire zones.',
        'Dual-input equipment (e.g. controllers, network switches) takes one feed from A and one from B; single-input equipment is allocated to one group consistent with the redundancy design.',
        '<b>Diode decoupling</b> (or redundancy modules) allows two DC supplies to feed one bus without a fault on one side back-feeding the other – check diodes, they can fail short or open silently.',
        'Avoid <b>common points</b>: shared bypass supply, shared battery, shared distribution board, cross-connections and temporary jumpers.',
        'Monitor each supply separately – loss of one feed must alarm, otherwise the redundancy is hidden-lost.']) +
      H('Critical consumers') + TB(['System', 'Typical requirement (typical – check rules / FMEA)'], [
        ['DP control (DP2 / DP3)', 'One UPS per redundancy group, typically ≥ 30 min autonomy; DP3 back-up station on its own UPS in a separate fire zone'],
        ['PMS / IAS', 'Redundant UPS so control and monitoring survive blackout and recovery'],
        ['Fire & Gas, ESD (offshore)', 'Dedicated, often dual, UPS; autonomy per safety philosophy (often 30 min to several hours)'],
        ['GMDSS', 'Reserve source of energy with automatic charger and charge / voltage indication'],
        ['Emergency / transitional lighting', 'Battery or UPS to cover the period until the emergency generator connects, typically 30 min'],
        ['PA / GA, internal comms', 'Battery-backed for required duration'],
        ['Switchboard DC control', 'Two supplies where breaker control is essential; battery-backed for blackout recovery']]) +
      L(['Redundancy is proven by testing – annual DP trials and FMEA tests include UPS / battery failure tests.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'Every UPS and battery on board: location, type, voltage, capacity (Ah), age and what it feeds.',
        'The <b>single-line diagram</b> of AC UPS and DC distribution, including bypass supplies and A / B allocation.',
        'Required autonomy for each system (SOLAS, class, FMEA, safety philosophy) and the last measured autonomy.',
        'Charger settings: float, boost, equalise, current limit, temperature compensation – and that they match the installed battery type.',
        'How to switch each UPS to maintenance bypass and back <b>safely</b>, step by step from the maker’s manual.',
        'Alarms: UPS on battery, on bypass, inverter fault, battery fault, earth fault, high temperature – and who must be informed (bridge, DPO, OIM, chief engineer).',
        'DC earth-fault finding methods on IT systems.',
        'Battery room safety, hydrogen hazard, PPE and first aid for electrolyte.',
        'Li-ion: BMS alarms, emergency procedure, fire-fighting arrangement.',
        'Battery replacement planning: lead times, approved types, disposal as hazardous waste.',
        `Autonomy and charger calculations – see ${A('battery.html', 'Battery &amp; UPS calculations')}.`]) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'UPS and charger status, alarms, DC voltage, charge current, earth-fault monitor reading, battery room ventilation'],
        ['Weekly', 'Visual check of batteries (leaks, corrosion, swelling), vented cells electrolyte level, GMDSS battery voltage and charger; emergency generator starter battery voltage'],
        ['Monthly', 'Float voltage of each cell / block, pilot cell specific gravity and temperature (vented lead-acid), terminal cleanliness, UPS fans and filters'],
        ['3-monthly', 'Internal resistance / impedance / conductance measurement of blocks – trend against baseline; ventilation function test'],
        ['6-monthly', 'Terminal torque check (per maker), equalise charge where applicable, UPS transfer to battery test (mains-fail simulation)'],
        ['Yearly', 'Capacity / discharge (autonomy) test on actual or dummy load, static bypass and maintenance bypass function test, insulation check of DC system, charger calibration'],
        ['As per maker / age', 'UPS fan and capacitor replacement, battery replacement at end of service life or when capacity < ~80 %']]) +
      H('Test methods') + L([
        '<b>Capacity (discharge) test</b>: discharge at a constant current or power to the end voltage (e.g. ~1.75–1.80 V/cell lead-acid, ~1.0–1.1 V/cell NiCd – typical) and record time; capacity below ~80 % of rated is a common replacement criterion.',
        '<b>Load / autonomy test</b>: open the UPS input under real load and record time and voltage curve – agree with the bridge / DPO first, have the battery fully charged and be ready to restore mains.',
        '<b>Internal resistance / conductance</b>: quick test with a battery tester; useful for trends – a rising resistance (e.g. > 20–30 % above baseline) indicates a weak block.',
        '<b>Float voltage</b> per cell / block: large deviations show weak or shorted cells.',
        '<b>Specific gravity</b> (vented lead-acid): shows state of charge; NiCd SG does not show state of charge.',
        'Record ambient and battery temperature with every reading.']) +
      H('Records') + L([
        'Battery log: date, cell / block voltages, SG, temperature, internal resistance, actions.',
        'UPS log: alarms, transfers, autonomy test results, firmware and settings.',
        'GMDSS battery checks are recorded in the GMDSS radio log.',
        'Keep records in the PMS (planned maintenance system) – checked by class, flag, PSC and clients.']) +
      `<p>Testers: ${A('instruments.html', 'ETO Instruments (battery tester)')}.</p>` + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['UPS on static bypass', 'Inverter fault, overload, over-temperature, manual selection, DC voltage low', 'Check UPS alarm log and load %, reduce load, reset per maker; inform bridge / DPO – load is unprotected'],
        ['UPS on battery (mains fail alarm)', 'Input breaker tripped, upstream supply lost, rectifier fault', 'Check input breaker and supply section, rectifier alarms; monitor remaining autonomy'],
        ['Battery not charging', 'Charger fault, battery breaker / fuse open, wrong mode, charger in current limit, temperature sensor fault', 'Measure charger output and battery current, check breaker / fuse, settings and sensor'],
        ['Short autonomy', 'Aged or sulphated cells, one weak block, battery not fully charged, load increased, high temperature', 'Internal resistance and block voltages under discharge, check load, capacity test'],
        ['DC earth fault alarm', 'Damaged cable, moisture in junction box, faulty equipment, sensor in wet area', 'Read monitor (+ or − pole), section circuits with permission, use DC earth-fault locator'],
        ['Battery overheating / high temperature', 'Overcharge, failed temperature compensation, poor ventilation, shorted cell, thermal runaway (VRLA / Li-ion)', 'Reduce / stop charge, check float voltage and room ventilation; isolate if temperature keeps rising'],
        ['Inverter fault', 'Power semiconductor failure, DC bus fault, control board, fan failure', 'Load to bypass, read fault code, check fans and DC bus, contact maker'],
        ['Charger alarm high DC voltage', 'Charger stuck in boost, regulation failure, wrong setting', 'Check mode and setpoint, isolate charger if needed – high voltage can damage loads'],
        ['Charger alarm low DC voltage', 'Charger off or failed, overload, battery discharged', 'Check charger supply and output, DC load current'],
        ['Swollen / leaking cells', 'Overcharge, overheating, end of life', 'Isolate and replace, check charger settings; handle electrolyte with PPE'],
        ['Bypass transfer blocked', 'Bypass supply out of tolerance or not synchronised', 'Check bypass input voltage / frequency and breaker, sync status'],
        ['Frequent UPS fan / temperature alarms', 'Blocked filters, failed fan, high room temperature', 'Clean filters, replace fans, check room cooling'],
        ['Li-ion BMS alarm', 'Cell imbalance, over / under temperature, cell voltage limit, communication loss', 'Follow BMS manual, do not bypass; contact maker']]) + NOTE
    ],
    ['safety', '📚', 'Safety & lessons', () =>
      H('Safety') + L([
        'Batteries cannot be switched off – the terminals are always live and a short circuit gives very high current, arcing and burns. Use insulated tools and cover terminals.',
        'UPS outputs and DC links are live even with the input isolated – isolate the battery breaker and wait for capacitors to discharge (per maker) before work.',
        'Permit to work and isolation / lock-out for work on UPS and battery systems; inform the bridge / DPO / control room before any change.',
        'Large DC systems (110 V, 220 V, ESS several hundred volts) need appropriate arc-flash precautions.',
        'Ventilate before entering a battery room after boost charging; no ignition sources.',
        'Electrolyte: PPE, eyewash, neutralising agents; spillage clean-up per safety data sheet.',
        'Dispose of old batteries as hazardous waste ashore – record in the garbage / waste records as required.']) +
      H('Lessons learned') + L([
        'Many blackouts and DP incidents became worse because a UPS battery had lost capacity without anyone knowing – <b>only discharge tests show real autonomy</b>.',
        'UPS left on bypass after maintenance – always confirm normal mode and battery breaker closed after work.',
        'Loads added to a UPS over the years without recalculation reduce autonomy – review the load list.',
        'Charger with wrong settings after battery type change has destroyed new batteries.',
        'Temperature sensors placed in the charger cabinet instead of on the battery give wrong compensation.',
        'DC earth faults left unresolved lead to a second fault and false operation of control circuits.',
        'Redundant A / B supplies cross-connected by a temporary cable defeated the redundancy.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Battery & UPS Systems (Guide)', icon: '🔋', accent: '#ca8a04',
    subtitle: 'Batteries, chargers and UPS on ships and offshore units – uses on board, battery types, chargers and DC distribution, UPS topologies and bypass, battery rooms and Li-ion safety, redundancy, maintenance, testing and troubleshooting.',
    refs: ['SOLAS II-1/42, 43, 44', 'SOLAS IV (GMDSS reserve source)', 'IEC 60092-305 / IEC 62485', 'IEC 62040 (UPS)', 'Class rules (incl. Li-ion)'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
