(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – values shown are typical. MARPOL Annex IV (current consolidated text and amendments), the maker’s manuals, the plant’s type-approval certificate and flag / class / port-state rules always govern.</p>';

  const S = [
    ['overview', '🌍', 'Overview & regulations', () =>
      `<p>A <b>Sewage Treatment Plant (STP)</b> treats black water (toilets, urinals, hospital drains) and, on many ships, grey water (showers, galley, laundry) so that the effluent can be discharged in accordance with <b>MARPOL Annex IV</b>. For the ETO it is a small process plant: blowers, pumps, level switches, a PLC or timer panel, UV lamps or dosing pumps, heaters and alarms.</p>` +
      H('MARPOL Annex IV – basics') + L([
        'Applies to ships of <b>400 GT and above</b>, and to smaller ships certified to carry <b>more than 15 persons</b> on international voyages.',
        'Ships must have one of: an <b>approved sewage treatment plant</b>, an approved <b>comminuting and disinfecting system</b> (with temporary storage), or a <b>holding tank</b> of adequate capacity – plus a pipeline to a <b>standard shore discharge connection</b>.',
        '<b>ISPP certificate</b> (International Sewage Pollution Prevention Certificate) is issued after survey and kept on board; renewal and surveys follow the ship’s harmonised survey cycle.',
        'Discharge at sea is permitted only under conditions: distance from the nearest land, ship en route at a minimum speed, moderate discharge rate, and effluent that does not produce visible floating solids or discolour the water. Treated effluent from an approved plant has the most freedom; untreated sewage the least.',
        '<b>Special areas</b> (currently the Baltic Sea) have stricter rules for passenger ships, including nitrogen and phosphorus removal for plants approved to the special-area standard.',
        'Many coastal states, ports, rivers and lakes (e.g. US waters, EU ports, Alaska, some ECA / inland waters) have <b>local rules stricter than MARPOL</b> – always check the voyage plan and port information.']) +
      H('Type approval of STPs') + TB(['Standard', 'Applies to (typical)', 'Main points'], [
        ['IMO MEPC.2(VI)', 'Older plants (installed before 2010)', 'Original effluent standards – coliform, suspended solids'],
        ['IMO MEPC.159(55)', 'Plants installed from 1 Jan 2010', 'Adds BOD5, COD, pH and residual chlorine limits; shore and ship testing'],
        ['IMO MEPC.227(64) (as amended)', 'Plants installed from 1 Jan 2016', 'Same effluent principles, updated test guidance; optional special-area standard with nitrogen and phosphorus removal']]) +
      H('Typical effluent parameters (MEPC.227(64) – check the certificate)') + TB(['Parameter', 'Typical limit / note'], [
        ['Thermotolerant coliforms', 'About 100 per 100 ml (geometric mean of samples)'],
        ['Total suspended solids (TSS)', 'About 35 mg/l (higher values allowed when diluted / flushing water corrected)'],
        ['BOD5', 'About 25 mg/l'],
        ['COD', 'About 125 mg/l'],
        ['pH', 'About 6 to 8.5'],
        ['Total residual chlorine', 'As low as reasonably practicable, about 0.5 mg/l max'],
        ['Nitrogen / phosphorus', 'Only for special-area (Baltic passenger ship) approval']]) +
      `<p>Related pages: ${A('pumps.html', 'Pumps guide')}, ${A('motor.html', 'Motors')}.</p>` + NOTE
    ],
    ['types', '🧪', 'Plant types', () =>
      TB(['Type', 'Principle', 'Pros', 'Cons / ETO notes'], [
        ['Biological – extended aeration (activated sludge)', 'Bacteria digest organic matter in an aerated chamber; sludge settles and is returned; effluent disinfected', 'Simple, low chemical use, common on cargo ships', 'Needs continuous air and stable loading; bacteria die if blowers stop or chemicals / detergents overdosed; start-up takes days to weeks'],
        ['Membrane bioreactor (MBR)', 'Biological treatment with ultrafiltration membranes instead of a settling tank', 'Very clean effluent, compact, meets special-area standards, common on cruise ships', 'Membrane fouling, cleaning-in-place (CIP) chemicals, more pumps, sensors and PLC logic; higher power'],
        ['Physical-chemical', 'Screening, flocculation / coagulation chemicals, settling or filtration, then disinfection', 'Fast start-up, tolerant of intermittent use', 'Continuous chemical supply, more sludge, dosing pumps critical'],
        ['Electrolytic / electro-chemical', 'Macerated sewage mixed with seawater passes electrolytic cells producing hypochlorite which disinfects and oxidises', 'Compact, no bacteria to keep alive, quick start', 'High DC current (rectifier), electrode wear and scaling, hydrogen gas generation – ventilation essential; needs seawater (salinity) for operation'],
        ['Comminutor + disinfection only', 'Macerates and disinfects, no biological treatment', 'Simple', 'Discharge restrictions as for comminuted / disinfected sewage; not an STP in the full sense'],
        ['Holding tank (zero discharge)', 'Store and discharge ashore or at sea when allowed', 'No treatment equipment', 'Level monitoring, aeration / ventilation to limit H2S, discharge pump and shore connection']]) +
      L(['Ships often combine types: e.g. an STP for normal operation plus a holding tank for zero-discharge areas.',
        'Grey water is not regulated by MARPOL Annex IV, but some ports / areas regulate it – know where your grey water goes.']) + NOTE
    ],
    ['process', '🏗️', 'Plant structure & process', () =>
      H('Typical extended-aeration plant (flow order)') + L([
        '<b>Inlet / screen or macerator</b> – breaks up solids and rags; protects pumps.',
        '<b>Aeration chamber</b> – air from <b>blowers</b> (usually side-channel or rotary-lobe / roots type) through <b>diffusers</b> at the tank bottom keeps bacteria alive and the contents mixed.',
        '<b>Clarification / settling chamber</b> – calm zone where activated sludge settles out.',
        '<b>Return sludge airlift</b> – compressed air lifts settled sludge back to the aeration chamber; a surface skimmer airlift may return floating scum.',
        '<b>Disinfection</b> – chlorination (hypochlorite tablets or dosing pump) in a contact chamber, or <b>UV lamps</b> in a flow-through reactor.',
        '<b>Dechlorination</b> (if chlorine is used) – sodium sulphite / bisulphite tablets or dosing to reduce residual chlorine before discharge.',
        '<b>Discharge (effluent) pump</b> – level controlled, discharges overboard or to the holding tank.',
        '<b>Sludge</b> – excess sludge is periodically removed to the sludge / holding tank and discharged ashore or at sea where permitted.']) +
      H('Key components') + TB(['Component', 'Function', 'Typical electrical item'], [
        ['Blower(s)', 'Air for aeration and airlifts', 'Induction motor, DOL starter, often duty / standby with auto change-over'],
        ['Diffusers', 'Fine or coarse bubble air distribution', 'None – but blockage shows as higher blower pressure'],
        ['Airlift pumps', 'Return sludge and scum', 'None – driven by blower air; adjusted with valves'],
        ['Macerator / comminutor', 'Cuts solids', 'Motor, overload, sometimes timer'],
        ['Discharge pump', 'Empties effluent chamber', 'Motor with float / level control, overload'],
        ['Disinfection unit', 'Kills pathogens', 'UV ballast and lamps with intensity sensor, or dosing pump'],
        ['Heaters', 'Keep process temperature in cold climates (some plants)', 'Immersion heater with thermostat'],
        ['Control panel', 'Sequences, alarms', 'PLC or relays / timers, 24 V DC controls, HMI']]) + NOTE
    ],
    ['vacuum', '🌀', 'Vacuum toilet & collection system', () =>
      `<p>Most modern ships use a <b>vacuum collection system</b>: each toilet flushes with a small amount of water and the waste is sucked through the piping to a collection tank. The vacuum is created by <b>vacuum pumps</b> (e.g. liquid-ring or screw) or by <b>ejectors</b> driven by a circulation pump.</p>` +
      H('Typical arrangements') + TB(['Arrangement', 'How it works', 'ETO notes'], [
        ['Vacuum pump + collection tank', 'Vacuum pumps keep a set vacuum in the piping / tank; discharge pumps empty the tank to the STP', 'Pressure switches / transmitters start-stop the pumps; duty / standby rotation'],
        ['Ejector unit (e.g. Vacuumarator style)', 'A circulation pump drives sewage through an ejector which creates vacuum and macerates', 'Pump motor, pressure switch, valves to STP / holding tank; ejector blockage common'],
        ['Gravity system', 'Conventional toilets drain by gravity to the STP', 'Higher flush water volume; no vacuum equipment']]) +
      H('Typical controls and alarms') + L([
        'Vacuum pressure switch or transmitter: pumps <b>start at low vacuum</b> and <b>stop at set vacuum</b> (typical working range about -0.35 to -0.6 bar, check maker).',
        'Low-vacuum alarm after a time delay – toilets will not flush.',
        'Pump running-time / too-frequent starts alarm – indicates a leak (a toilet valve stuck open).',
        'Tank high-level alarm; discharge pump control by level switches.',
        'Toilet flush valve: pneumatic or electric (24 V), with a flush button and timer controller in each toilet.']) +
      H('Common problems') + L([
        'Blockages from wipes, sanitary items, rags and cloths – the most common cause of calls.',
        'Scale (urine stone) build-up in pipes and ejectors – periodic descaling with approved chemicals.',
        'Leaking discharge valve on one toilet empties the vacuum – listen for hissing, isolate section by section.',
        'Faulty pressure switch or blocked sensing line gives wrong start / stop.']) + NOTE
    ],
    ['elec', '⚡', 'Electrical, controls & alarms', () =>
      TB(['Item', 'Typical arrangement', 'What to check'], [
        ['Blower motors', 'Small induction motors, DOL, duty / standby; some on VFD', 'Current vs nameplate, bearings, belt (if belt-driven), filters, pressure switch'],
        ['Pump motors', 'Discharge, ejector / circulation, vacuum, sludge pumps', 'Overloads, insulation resistance, seals leaking into terminal boxes'],
        ['Level / float switches', 'Low, high, high-high levels in chambers and tanks; or conductive / ultrasonic / pressure level', 'Free movement, fouling with grease and sludge, cable condition'],
        ['PLC / timers', 'Sequences pumps, airlift cycles, sludge return, dosing; alarm logic', 'I/O status, backup of program and settings, 24 V supply'],
        ['UV system', 'Lamps with electronic ballasts, intensity sensor, quartz sleeves', 'Lamp hours, intensity alarm, sleeve cleaning, ballast faults'],
        ['Dosing pumps', 'Chlorine, dechlorination, MBR cleaning or flocculant chemicals', 'Stroke / frequency setting, chemical level switch, priming'],
        ['Heaters', 'Process or tank heaters with thermostat', 'Insulation resistance, thermostat, contactor'],
        ['Electrolytic cell rectifier', 'DC supply to electrodes (electro-chemical plants)', 'Cell current / voltage, scaling, hydrogen ventilation interlock']]) +
      H('Typical alarms') + L([
        '<b>High level</b> in aeration / effluent chamber or collection tank – risk of overflow into the machinery space.',
        '<b>Blower failure</b> (motor trip or low air pressure) – bacteria start dying after some hours; restart quickly.',
        'Discharge pump failure / running too long.',
        'UV lamp failure or low UV intensity.',
        'Low vacuum (collection system).',
        'Chemical tank low level.',
        'Common alarm to the engine room alarm / monitoring system (AMS) and often to the bridge.']) +
      L(['Motors and pumps in wet, corrosive, H2S-rich spaces suffer from corrosion – check IP rating, glands and terminal boxes.',
        'See ' + A('motor.html', 'Motors') + ' and ' + A('pumps.html', 'Pumps guide') + ' for motor and pump fault finding.']) + NOTE
    ],
    ['ops', '🚦', 'Operation & discharge rules', () =>
      H('Discharge conditions – qualitative (check current rules)') + TB(['Effluent', 'General MARPOL condition (typical)'], [
        ['From an approved STP', 'May be discharged when the effluent shows no visible floating solids and does not discolour the water; special-area and local rules may still restrict'],
        ['Comminuted and disinfected (approved system)', 'Only beyond a minimum distance from the nearest land (a few nautical miles), en route'],
        ['Untreated sewage from holding tank', 'Only further from land (about 12 nm), ship en route at a minimum speed (about 4 knots), at a moderate approved rate'],
        ['Special area (Baltic) passenger ships', 'Discharge only from plants approved to the special-area standard, otherwise to shore reception'],
        ['Port / coastal state rules', 'Often zero discharge in port, rivers, lakes and some coastal zones – use holding tank']]) +
      H('Normal operation') + L([
        'Keep blowers running continuously in biological plants – the process depends on air.',
        'Keep chemicals (chlorine / dechlorination tablets, dosing chemicals) topped up and record use.',
        'Avoid disinfectants, bleach, oil, grease, paint and large amounts of detergent going into the toilets and drains – they kill the bacteria.',
        'Remove excess sludge as per maker interval; check sludge volume (settled sludge test in a 1 l cylinder, typical 30 min).',
        'Before entering a zero-discharge area: switch STP discharge to the holding tank and log the change.',
        'When discharging the holding tank: check position, speed and distance requirements with the bridge, record the operation.']) +
      H('Start-up of a biological plant') + L([
        'Fill with water, start blowers; seeding with activated sludge from another plant shortens start-up.',
        'Full biological performance typically takes <b>1–3 weeks</b> – the effluent may not meet standards before that, so use the holding tank where required.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The plant type, maker, model and <b>type-approval standard</b> (MEPC.2(VI), MEPC.159(55) or MEPC.227(64)) shown on the certificate.',
        'Location of the control panel, its supply breaker (often from an emergency or main switchboard group starter panel) and the alarms to the AMS.',
        'Duty / standby logic of blowers and pumps and how to change over manually.',
        'Level switch set-points and what each switch does (start pump, stop pump, high-level alarm, high-high trip).',
        'UV lamp ratings, number of lamps, ballast type and spare lamps / sleeves on board.',
        'How the vacuum system creates vacuum and its pressure switch set-points.',
        'Overboard and holding-tank valve positions and any interlocks (some ships interlock overboard discharge with position / zone).',
        'PLC program and parameter backups; maker contact details.',
        'Hazards: H2S, methane, hydrogen (electrolytic cells), biological contamination – and the confined-space procedure.',
        'Records required by the company SMS and what port state control may ask about (ISPP certificate, discharge log, maintenance records).']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily', 'Check blowers running and air pressure, alarm panel, levels, airlift flow, disinfection chemical level, UV lamp status, vacuum pump running hours / starts'],
        ['Weekly', 'Clean UV quartz sleeves (or as per maker), test high-level alarm and float switches, check discharge pump operation, sludge settling test'],
        ['Monthly', 'Blower air filters, belts, oil level (roots blowers); motor currents; insulation readings on pump and blower motors; check dosing pumps'],
        ['3 monthly', 'Clean level switches and electrodes, inspect diffusers air distribution, check vacuum toilet valves and controllers, descale where needed'],
        ['Yearly', 'Desludge and inspect tanks internally (confined space), diffuser renewal as needed, UV lamp renewal by running hours, test all alarms to AMS / bridge'],
        ['By running hours', 'UV lamps (typical lamp life roughly 8 000–12 000 h, check maker), blower and pump bearing / seal overhaul'],
        ['Survey / PSC', 'Effluent sampling if required, ISPP certificate validity, standard shore connection flange, discharge records']]) +
      H('Effluent sampling') + L([
        'Sampling point is normally after disinfection / before overboard discharge – use the designated sample cock.',
        'Some flags, classes, charterers and ports (e.g. certain cruise areas) require periodic laboratory analysis; follow the sampling and chain-of-custody instructions from the lab.',
        'On-board checks: visual (no solids, clear), pH strips, residual chlorine test kits, sludge settling test.',
        'Wear gloves and eye protection; wash hands; samples are a biological hazard.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Blower failure / tripped', 'Overload from blocked diffusers or closed valve, bearing failure, belt broken, motor insulation fault', 'Start standby blower; check air pressure, valves, filter, motor current and insulation; reset overload only after cause found'],
        ['Low air pressure', 'Air leak, broken pipe, worn blower, relief valve open', 'Inspect piping and joints, relief valve, blower condition'],
        ['High air pressure', 'Diffusers clogged, valve closed, high liquid level', 'Check valve positions, clean / renew diffusers, check level'],
        ['High level alarm', 'Discharge pump not running, pump airlocked or blocked, float stuck, discharge valve closed, high inflow', 'Check pump and valves, float switch, consider manual pumping to holding tank; prevent overflow'],
        ['Discharge pump not starting', 'Overload tripped, control fuse, level switch fault, PLC output, contactor coil', 'Measure control voltage, test level switch, check PLC I/O LED, motor insulation'],
        ['Float switch stuck', 'Grease and sludge build-up, mechanical damage, cable twisted', 'Clean, free and test; fit cleaner or move switch if repeated'],
        ['UV failure / low intensity alarm', 'Lamp end of life, dirty quartz sleeve, ballast failure, sensor dirty', 'Check lamp hours, clean sleeve, swap lamp / ballast, clean sensor window'],
        ['Vacuum loss / toilets not flushing', 'Leaking toilet valve, vacuum pump fault, pressure switch fault, pipe blockage or leak', 'Isolate sections to find leak, check pump and switch, listen for hissing'],
        ['Vacuum pumps running continuously', 'Leak in system, worn pump, wrong set-point', 'Check toilet valves, set-points, pump capacity'],
        ['Odour / H2S smell', 'Blower stopped (anaerobic conditions), vent blocked, overloaded plant, water seals dry', 'Restart aeration, check vents and fans, refill traps; ventilate, use gas detector'],
        ['Turbid effluent / floating solids', 'Sludge carry-over, too much sludge, airlift not working, overload, bacteria killed by chemicals', 'Desludge, adjust airlift, check what went into drains, reduce load'],
        ['High residual chlorine or chemicals running out fast', 'Dosing pump setting wrong, dechlorination empty', 'Adjust dosing, refill dechlorination tablets, test residual chlorine']]) + NOTE
    ],
    ['safety', '⚠️', 'Safety & lessons', () =>
      H('Hazards') + TB(['Hazard', 'Why', 'Control'], [
        ['Hydrogen sulphide (H2S)', 'Produced by anaerobic sewage; toxic, deadens sense of smell at higher concentrations, heavier than air', 'Never trust smell; portable gas detector; ventilate; keep aeration running'],
        ['Methane and hydrogen', 'Methane from sludge; hydrogen from electrolytic cells – flammable', 'Ventilation, gas detection, no ignition sources, Ex equipment where required'],
        ['Oxygen deficiency', 'Tanks consume oxygen', 'Confined-space entry permit, atmosphere testing, standby person, rescue plan'],
        ['Biological hazards', 'Bacteria, viruses (e.g. hepatitis, norovirus), parasites', 'Gloves, eye protection, overalls; wash hands; cover cuts; vaccinations per company policy'],
        ['Chemicals', 'Chlorine tablets, hypochlorite, acids for descaling, MBR cleaning chemicals', 'SDS, PPE, never mix chlorine with acids'],
        ['Electrical', 'Wet areas, pumps and floats in liquid, corroded terminals', 'Isolate and lock out, test dead, check IP ratings and RCD / earth-fault protection']]) +
      H('Lessons learned') + L([
        'Fatal accidents have happened when crew entered sewage tanks or bent over open manholes – <b>treat every sewage tank as a toxic confined space</b>.',
        'H2S can be released suddenly when sludge is disturbed or when a stopped tank is pumped – ventilate and monitor continuously.',
        'A blower stopped for hours turns the plant anaerobic – restart quickly and expect odour and poor effluent for some time.',
        'Repeated high-level alarms are usually mechanical (float switches, blocked pumps) – fix the root cause, do not bypass alarms.',
        'Wrong valve position (overboard instead of holding tank) in a zero-discharge area has led to PSC detentions and fines – double-check and log.',
        'Educate the crew: wipes, rags and chemicals in toilets cause most blockages and plant failures.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Sewage Treatment Plant (Guide)', icon: '🚽', accent: '#65a30d',
    subtitle: 'Sewage treatment plants for the ETO – MARPOL Annex IV basics, plant types, process, vacuum collection, electrical controls and alarms, discharge rules, maintenance, troubleshooting and safety.',
    refs: ['MARPOL Annex IV', 'IMO MEPC.227(64)', 'IMO MEPC.159(55)', 'Maker manuals'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
