(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values are typical. SOLAS / MODU Code requirements, flag state and class rules, the vessel’s approved drawings and maker manuals always govern.</p>';

  const S = [
    ['overview', '💡', 'Lighting overview', () =>
      `<p>Lighting on ships and offshore units is a <b>safety system</b>, not just a comfort system. If the lights go out, people must still be able to find escape routes, reach muster and embarkation stations, operate machinery and control stations, and the vessel must still show the correct navigation and signal lights.</p>` +
      H('Lighting layers') + TB(['Layer', 'Supply (typical)', 'Purpose'], [
        ['Main (normal) lighting', 'MSB via lighting transformers and lighting distribution boards', 'General lighting of all spaces in normal operation'],
        ['Emergency lighting', 'Emergency switchboard (ESB) fed by the emergency generator', 'Escape routes, muster / embarkation, machinery and control spaces after loss of main power'],
        ['Transitional / battery lighting', 'Self-contained fittings or a central battery / UPS', 'Covers the gap until the emergency generator is on load, and backs up critical areas'],
        ['Low-location lighting (LLL)', 'Photoluminescent strips or electrically powered', 'Marks escape routes close to the deck when smoke hides ceiling lights (passenger ships)'],
        ['Navigation & signal lights', 'Dedicated nav light panel, dual supply (main + emergency)', 'COLREG lights, NUC / RAM, signal lights, with failure alarm'],
        ['Helideck & obstruction lights', 'Emergency-backed supplies, often with UPS', 'Safe helicopter operations and aviation obstruction marking on rigs'],
        ['Floodlights & working lights', 'Main lighting, some on emergency', 'Deck work, cranes, mooring, boat launching areas'],
        ['Ex lighting', 'As above, with certified Ex fittings', 'Hazardous areas: pump rooms, paint stores, battery rooms, drill floor, process areas']]) +
      H('Key principles') + L([
        'Loss of a single final circuit must <b>not leave a space in darkness</b> – lights in a space are split over at least two circuits.',
        'Emergency lighting must come on <b>automatically</b> on loss of main power.',
        'Transitional (battery) lighting bridges the gap until the emergency generator takes the load.',
        'Lighting in hazardous areas must be certified for the zone, gas group and temperature class.']) +
      `<p>Related pages: ${A('lighting.html', 'Lighting calculations')}, ${A('switchboards.html', 'MSB &amp; ESB guide')}, ${A('hazardous.html', 'Ex / Hazardous Area Guide')}, ${A('upsguide.html', 'Battery &amp; UPS guide')}.</p>` + NOTE
    ],
    ['main', '🔌', 'Main lighting distribution', () =>
      TB(['Item', 'Typical arrangement'], [
        ['Voltage', '230 V or 110/115 V single-phase or three-phase lighting systems; 440 V / 690 V main bus stepped down'],
        ['Lighting transformers', 'Usually two (one duty, one standby or each feeding half) from the MSB; often IT (insulated) secondary'],
        ['Main lighting switchboard', 'Distribution section fed by the transformers; feeds lighting distribution boards (LDBs) around the ship'],
        ['Lighting distribution boards', 'Local panels with MCBs per final circuit, located per fire zone / deck'],
        ['Final circuits', 'Typically limited in current and number of points per circuit by class rules (e.g. 16 A or less)'],
        ['Earthing', 'Insulated (IT) systems common with insulation monitoring; earthed systems need RCD / earth fault protection per rules'],
        ['Switching', 'Local switches; corridors, stairways and machinery spaces often not individually switched']]) +
      H('Design rules (qualitative)') + L([
        'Lighting in machinery spaces, corridors, stairways, large public spaces and control stations is split over <b>at least two final circuits</b>, ideally from different distribution boards, so that one tripped MCB does not darken the space.',
        'Main and emergency lighting systems are arranged so that a <b>fire or casualty</b> in the space containing the main source does not disable the emergency lighting, and vice versa where required.',
        'Distribution boards for main and emergency lighting are kept physically separate where practical.',
        'Lighting transformers: standby capacity so that the loss of one transformer does not black out the lighting (check class rules).',
        'Cable sizing for voltage drop is important at 110/115 V – long runs to deck lights can give significant drop.']) +
      H('Insulation monitoring') + L([
        'On IT lighting systems an <b>earth-fault (insulation) monitor</b> alarms on low insulation – a common cause is water ingress into deck fittings and junction boxes.',
        'Earth faults are located by switching off circuits one by one (with care – never darken escape routes or the engine room without warning).']) + NOTE
    ],
    ['emergency', '🚨', 'Emergency lighting', () =>
      `<p>Emergency lighting is supplied from the <b>emergency switchboard (ESB)</b>, which is powered by the emergency generator (or an emergency battery on some smaller ships) when the main supply fails. In normal operation the ESB is fed from the MSB via an interconnector.</p>` +
      H('Areas that typically require emergency lighting (SOLAS / MODU Code – qualitative)') + L([
        'Muster and embarkation stations, and over the side at survival-craft launching areas and the sea below.',
        'Alleyways, stairways and exits giving access to muster and embarkation stations (escape routes).',
        'Machinery spaces and the main generating set positions, emergency generator room.',
        'Control stations: navigation bridge, engine control room, radio station, fire control station, main and emergency switchboards.',
        'Fireman’s outfit storage positions, steering gear, fire pump, sprinkler pump and emergency bilge pump positions.',
        'Helideck and its access / escape routes; on MODUs also drill floor, process and other areas defined by the MODU Code and flag.',
        'Lifts (passenger ships) and certain public spaces per the rules.']) +
      H('Duration') + L([
        'SOLAS and the MODU Code specify a minimum emergency power duration for lighting, which differs between <b>passenger ships, cargo ships and MODUs</b>. Check the applicable regulation and the vessel’s approved emergency load balance – do not rely on a general figure.',
        'The emergency generator must start and take the load automatically within the time required by the rules.']) +
      H('Typical arrangement') + L([
        'Emergency light fittings are often <b>marked</b> (e.g. red dot or “E” label) so crew can recognise them.',
        'Many emergency fittings are normally on (fed from ESB at all times) – they are part of the normal lighting, which ensures failed lamps are noticed.',
        'Emergency lighting is often 230 V from an ESB lighting transformer; some vessels have 24 V DC emergency lighting.',
        'Switches on emergency circuits are avoided or arranged so the light cannot be left off in an emergency.']) + NOTE
    ],
    ['battery', '🔋', 'Battery / self-contained & transitional lighting', () =>
      TB(['Type', 'Description', 'Typical points'], [
        ['Self-contained (maintained) fitting', 'Fitting with internal battery, charger and inverter; lamp on in normal and emergency mode', 'Common in accommodation and escape routes; NiCd, NiMH or LiFePO4 battery'],
        ['Self-contained (non-maintained)', 'Lamp lights only on loss of supply', 'Used for exit signs and stairways; failure not obvious without testing'],
        ['Central battery system', 'One battery bank and charger feeds many emergency fittings via dedicated circuits', 'Easier testing and monitoring; cable routing must survive fire'],
        ['Transitional source', 'Battery or UPS supply that covers the period until the emergency generator is on load', 'Required on passenger ships and some others where the emergency source is a generator'],
        ['Portable / hand lamps', 'Rechargeable torches at key positions', 'Kept charged in holders; part of fireman’s outfit (Ex-rated)']]) +
      H('Key points') + L([
        'Transitional and battery lighting must come on <b>automatically</b> and instantly on loss of supply.',
        'Required durations differ by ship type and regulation (SOLAS, MODU Code, flag) – <b>check the applicable rules and the approved documentation</b>; do not assume.',
        'Batteries in self-contained fittings age – capacity drops with heat and time. Typical replacement life is a few years (check the maker).',
        'Self-testing fittings (auto-test) report failures via an indicator LED or addressable system – read and act on the indicators.',
        'Some fittings have a <b>test switch / key</b> or a central test function; testing should simulate the loss of the supply to the fitting, not just switch the lamp.']) +
      H('Low-location lighting (LLL)') + L([
        'Required on <b>passenger ships</b> (SOLAS / FSS Code / IMO resolutions) to mark escape routes at low level, since smoke rises and hides ceiling lights.',
        'Photoluminescent (PL) types need adequate normal lighting to charge – check that luminaires near PL strips are working.',
        'Electrically powered LLL is fed from emergency / battery supply and must be tested and maintained like emergency lighting.',
        'Damaged, painted-over or dirty strips must be replaced or cleaned – surveyors check continuity of the marked route.']) +
      `<p>See ${A('upsguide.html', 'Battery &amp; UPS guide')} for battery types, charging and testing.</p>` + NOTE
    ],
    ['nav', '🚢', 'Navigation, signal & helideck / obstruction lights', () =>
      H('Navigation light panel') + L([
        'COLREG lights (masthead, sidelights, stern, anchor, NUC / RAM, towing, etc.) are controlled from a dedicated <b>navigation light control panel</b> on the bridge.',
        'Typically <b>two independent supplies</b>: one from the MSB and one from the ESB (or main + emergency), with automatic or manual changeover.',
        'Each main navigation light circuit has a <b>failure alarm</b> (lamp / circuit failure detected by current monitoring) – audible and visual on the bridge.',
        'Many lanterns are <b>double</b> (two lamps or two LED modules, primary and spare) selectable from the panel.',
        'When retrofitting LED lanterns, the panel’s failure detection must suit the low LED current – use type-approved LED lanterns and compatible panels.']) +
      H('Signal lights') + L(['Morse / daylight signalling lamp (with independent battery supply on many ships).', 'Signal mast lights, “not under command” lights, deck and Suez / Panama canal lights.', 'Whistle lights and other special signals as fitted.']) +
      H('Helideck lighting (CAP 437 – qualitative)') + TB(['Light', 'Purpose'], [
        ['Perimeter lights', 'Green lights around the landing area edge to define the deck at night'],
        ['TD/PM circle & H lighting', 'Touchdown / positioning marking and H lit (modern standard on many installations)'],
        ['Floodlights', 'Illuminate the deck surface, positioned to avoid dazzling the pilot'],
        ['Status lights', 'Red flashing lights warning that the deck is unsafe for landing (e.g. gas release, unsafe condition)'],
        ['Wind sock lighting', 'Wind direction indicator illuminated at night'],
        ['Obstacle lights', 'Red lights on obstacles near the helideck approach']]) +
      L(['Helideck lighting must be supplied from a source that remains available on loss of main power (emergency / UPS) per the applicable rules.', 'CAP 437 and national aviation / flag requirements govern specifications; the HLO and helideck inspections (e.g. HCA) verify compliance.']) +
      H('Obstruction / aviation lights (rigs and units)') + L([
        'Tall structures (derricks, cranes, flare booms) carry <b>aviation obstruction lights</b> – red or white, steady or flashing, according to the coastal state / aviation authority.',
        'Fixed installations may also need <b>marine navigation aids</b> (white flashing Morse “U” lights, fog horn) per coastal state rules.',
        'Supplies are typically backed by battery / UPS with failure alarm to the control room.',
        'Access for lamp change on high structures needs work-at-height control and permits.']) + NOTE
    ],
    ['ex', '⚠️', 'Ex lighting in hazardous areas', () =>
      TB(['Protection type', 'Use in lighting (typical)'], [
        ['Ex d (flameproof)', 'Robust fittings for Zone 1 / 2; flamepath condition and bolts critical'],
        ['Ex e (increased safety)', 'Common for fluorescent / LED luminaires; terminals and lamp holders designed to avoid sparks'],
        ['Ex nA / Ex ec', 'Zone 2 only fittings'],
        ['Ex tb / tc', 'Dust hazardous areas'],
        ['Ex mb / Ex ib', 'Encapsulated or intrinsically safe parts (e.g. emergency battery packs, drivers)']]) +
      H('Key points') + L([
        'Fittings must be certified (IECEx / ATEX) for the <b>zone</b>, <b>gas group</b> (IIA / IIB / IIC) and <b>temperature class</b> (T1–T6) of the area.',
        'Only replace lamps / LED modules / batteries with the <b>certified type</b> stated on the label – a wrong lamp can exceed the T-class.',
        'Ex emergency fittings with internal batteries: the battery pack is part of the certification – use only the approved spare.',
        'Inspect gaskets, glass, cable glands and earthing; corrosion and broken glasses are common on open deck.',
        'Isolate before opening; in Zone 1 work under permit with gas testing.',
        'Keep the Ex register up to date after any lamp or fitting change.']) +
      `<p>See ${A('hazardous.html', 'Ex / Hazardous Area Guide')} for zones, protection concepts and inspection grades.</p>` + NOTE
    ],
    ['led', '🔆', 'LED technology & retrofits', () =>
      TB(['Topic', 'What to watch (typical)'], [
        ['Drivers', 'Electronic constant-current drivers; most failures are in the driver, not the LEDs; heat shortens life'],
        ['Harmonics', 'Many small LED drivers inject harmonic current; large retrofits may increase THD on lighting transformers'],
        ['Inrush current', 'Capacitive drivers give high short inrush; MCBs may trip on switch-on if too many fittings per circuit'],
        ['EMC', 'Poor drivers can disturb radio, VHF, GNSS and nav equipment; use type-approved marine fittings'],
        ['Power factor', 'Cheap drivers may have low PF; check maker data'],
        ['Thermal management', 'LED output and life fall with heat; keep heatsinks clean and use fittings rated for the ambient'],
        ['Emergency fittings', 'LED emergency modules need compatible drivers / battery packs; recheck duration after retrofit'],
        ['Nav lights', 'Only type-approved LED nav lanterns; failure alarm circuits must detect LED faults'],
        ['Colour / glare', 'Colour temperature and glare matter on the bridge (night vision) and helideck']]) +
      H('Benefits') + L(['Lower power consumption and heat load (helps emergency load balance and HVAC).', 'Long life – fewer lamp changes, less work at height.', 'Instant start (no warm-up as with HID / sodium floodlights).']) +
      H('Retrofit checklist') + L([
        'Use <b>marine type-approved</b> fittings (class / flag), and Ex-certified fittings in hazardous areas.',
        'Check inrush and number of fittings per MCB – change MCB curve only within rules.',
        'Recalculate the emergency load balance and battery durations.',
        'Check for EMC interference on bridge equipment after installation.',
        'Update drawings, spare parts lists and the Ex register; inform class where required.']) +
      H('Dimming & photocells') + L([
        'Bridge lighting is dimmable (red / dimmed lighting at night) to preserve night vision; dimmers must not cause EMC interference.',
        'LED dimming types: 1–10 V, DALI, phase-cut (leading / trailing edge) – driver and dimmer must match.',
        'Photocells / timers switch deck and floodlights automatically; check that they do not switch off lights required for operations.',
        'Lux levels: see ' + A('lighting.html', 'Lighting calculations') + ' for illuminance and lumen-method calculations.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The <b>lighting single-line diagram</b>: lighting transformers, main and emergency lighting boards, distribution boards and which circuits feed which spaces.',
        'Which fittings are <b>emergency</b> and which are <b>transitional / battery</b>, and how they are marked.',
        'The emergency generator start and ESB changeover sequence, and the expected emergency lighting behaviour during a blackout.',
        'Location and test method of self-contained fittings and central battery systems.',
        'Navigation light panel: supplies, changeover, failure alarm, spare lamps / modules.',
        'Helideck and obstruction lighting supplies and tests (offshore units).',
        'Ex lighting: certification of fittings, correct spares, Ex register.',
        'Insulation monitoring of lighting systems and how to locate earth faults safely.',
        'LED retrofit issues: inrush, harmonics, EMC, type approval.',
        'Spare parts: lamps, LED modules, drivers, batteries, glasses, gaskets – keep stock of critical spares (nav and emergency).',
        'Records for surveys: emergency lighting tests, battery duration tests, nav light alarm tests.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Nav lights check at sunset (all lanterns lit, panel alarms clear); report failed lamps in escape routes and machinery spaces'],
        ['Weekly', 'Emergency generator test run with emergency lighting check; insulation monitor readings for lighting systems'],
        ['Monthly', 'Functional test of emergency and self-contained lighting (simulate supply failure, check all fittings light); exit signs; LLL visual check'],
        ['Monthly', 'Navigation light failure alarm test and changeover between main and emergency supply'],
        ['Monthly / per HLO', 'Helideck lighting check: perimeter, floodlights, status lights, wind sock light'],
        ['3-monthly', 'Ex lighting visual inspection in hazardous areas; obstruction lights check'],
        ['Yearly', 'Duration test of self-contained and central battery emergency lighting for the required period (per rules / maker)'],
        ['Yearly', 'Insulation resistance test of lighting circuits; inspection of deck fittings, gaskets and junction boxes'],
        ['Per maker / condition', 'Battery replacement in self-contained fittings; LED driver replacement'],
        ['After blackout test', 'Verify all emergency and transitional lighting came on as expected; record failures']]) +
      L(['Plan duration tests so the batteries are recharged before the vessel needs them again (recharge can take many hours).', 'Record all tests – emergency lighting is checked at PSC, flag and class surveys and safety audits.', 'Never leave escape routes dark during tests – test in sections and warn the crew.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Emergency lights do not come on in blackout test', 'Emergency generator not started, ESB breaker not closed, circuit off', 'Check emergency generator start, ESB changeover, emergency lighting breakers'],
        ['Self-contained fitting fails duration test', 'Aged or failed battery, charger fault, supply not reaching fitting', 'Check charging indicator, battery voltage, replace battery with approved type'],
        ['Self-contained fitting lit permanently on battery', 'Lost permanent supply to the fitting (unswitched live)', 'Check the feed circuit and connection; battery will discharge'],
        ['Nav light failure alarm', 'Lamp / LED module failed, fuse, cable or water ingress, panel sensing fault', 'Switch to spare lamp, check lantern and cable, replace module'],
        ['Nav light alarm with LED lanterns', 'Panel cannot detect low LED current, incompatible lantern', 'Check panel and lantern compatibility and maker settings'],
        ['Earth fault alarm on lighting system', 'Water in deck fittings or junction boxes, damaged cable', 'Isolate circuits one by one, check deck lights after rain or washing'],
        ['MCB trips on switch-on', 'LED inrush current, too many fittings per circuit, short circuit', 'Check number of drivers per circuit, MCB curve, insulation'],
        ['LED fitting flickers', 'Failing driver, loose connection, incompatible dimmer, voltage fluctuation', 'Check connections, driver, dimmer compatibility'],
        ['Radio / GNSS interference', 'EMC noise from LED drivers or dimmers', 'Switch circuits off to identify source, replace with EMC-compliant fittings'],
        ['Floodlights not switching on at night', 'Photocell dirty or failed, contactor or timer fault', 'Clean / bypass photocell, check contactor and control circuit'],
        ['Helideck status lights fault', 'Lamp failure, controller fault, supply lost', 'Check controller alarms, supply, lamps; inform HLO'],
        ['Ex fitting with broken glass or missing bolts', 'Mechanical damage, corrosion', 'Isolate, replace with certified parts, update Ex register']]) + NOTE
    ],
    ['lessons', '📚', 'Safety & lessons', () =>
      H('Safety') + L([
        '<b>Isolate and lock out</b> before working on lighting circuits – 230 V and 110 V lighting can kill.',
        'Lighting systems are often IT systems: one earth fault does not trip, so a circuit may be live with an earth fault present.',
        'Self-contained emergency fittings stay <b>live from their battery</b> after isolating the supply.',
        'Work at height (masts, derricks, floodlight towers) requires a permit, harness and radar / transmitter isolation near antennas.',
        'In hazardous areas: permit, gas testing and certified spares only.',
        'Dispose of batteries and fluorescent / HID lamps (mercury) as hazardous waste.']) +
      H('Lessons learned') + L([
        'Emergency lighting failures are a common PSC / survey finding – most are aged batteries in self-contained fittings found during tests.',
        'Blackouts have shown escape routes going dark because emergency lights had been wrongly switched or circuits left off after maintenance.',
        'LED retrofits without type approval have caused VHF and GNSS interference on the bridge.',
        'Water ingress into deck fittings is the main source of earth faults on lighting systems – maintain gaskets and glands.',
        'Nav light alarm systems that do not suit LED lanterns may not detect a failed light – verify after any retrofit.',
        'Keep critical spares (nav lamps / modules, emergency batteries) on board – lighting faults must be fixed before departure.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Lighting Systems (Guide)', icon: '💡', accent: '#65a30d',
    subtitle: 'Main, emergency, transitional and battery lighting, low-location lighting, navigation, signal, helideck and obstruction lights, Ex lighting and LED retrofits – with maintenance, testing and troubleshooting for the ETO.',
    refs: ['SOLAS Ch. II-1 & II-2', 'IMO MODU Code', 'COLREG', 'CAP 437', 'IEC 60092', 'IEC 60079'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
