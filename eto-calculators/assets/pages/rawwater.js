(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance with typical values only. The pump and motor maker’s manuals, the unit’s operations manual, drawings and procedures, flag requirements and class rules always govern.</p>';

  const S = [
    ['overview', '🌊', 'Why jack-ups need raw water pumps', () =>
      `<p>A <b>jack-up</b> floats like a barge when moving, but when on location its legs stand on the seabed and the hull is jacked clear of the sea – often tens of metres above the water. Once elevated, the normal <b>sea chests and hull suctions are in the air</b> and cannot supply water. All sea water the unit needs must then be <b>lifted from the sea</b> by raw water pumps that reach down to below the lowest expected water level.</p>` +
      H('Afloat vs elevated') + L([
        '<b>Afloat / under tow / preloading start</b>: hull sea chests and conventional centrifugal pumps may be used (where fitted).',
        '<b>Elevated</b>: suction lift from the hull is far beyond what a surface centrifugal pump can draw (practical suction lift is only a few metres, typical) – so the pump itself must be placed <b>in the water</b>, or a long lineshaft pump must reach down to it.',
        'The air gap changes with tide, storm surge and jacking height – pump intakes must stay submerged at the lowest water level and clear of the seabed at the highest risk of scour.']) +
      H('Typical raw water uses on a jack-up') + TB(['Use', 'Notes (typical)'], [
        ['Fire main and deluge', 'Fire water for hydrants, monitors, helideck foam / water and deluge systems; often the main reason for the pump sizing'],
        ['Cooling water', 'Sea water to heat exchangers for engines, generators, HVAC, drilling equipment and VFD / SCR rooms'],
        ['Preload / ballast filling', 'Filling preload tanks to prove the leg foundation before elevating to operating air gap; large flow over a short time'],
        ['Drill water', 'Sea water for mixing and drilling where allowed by the programme'],
        ['Jetting supply', 'Water to leg / spudcan jetting systems to help free legs from the seabed during pulling'],
        ['Deck wash and utility', 'Hoses, washdown, sanitary flushing (where sea water is used)'],
        ['Fresh water maker feed', 'Feed for reverse osmosis or evaporator water makers'],
        ['Service to other systems', 'Cement unit, mud mixing, electro-chlorination (MGPS) feed, sewage dilution']]) +
      `<p>Related pages: ${A('pumps.html', 'Pumps guide')} (general pump theory, starters, protection), ${A('jackingguide.html', 'Jacking Systems guide')}, ${A('jetting.html', 'Jetting System guide')}, ${A('insulation.html', 'Earthing &amp; Insulation')}.</p>` + NOTE
    ],
    ['install', '🏗️', 'Pump types & installation', () =>
      TB(['Type', 'Arrangement', 'Pros / cons (typical)'], [
        ['Electric submersible pump (ESP)', 'Motor and pump hung together on a riser pipe or guide inside a caisson; power via submersible cable from deck', 'Compact, no long shaft; motor sealed and exposed to sea water – insulation and seals are the weak points; must be pulled for any repair'],
        ['Vertical turbine / lineshaft (deepwell) pump', 'Motor on deck; long column pipe with lineshaft and bearings down to bowl assembly below water', 'Motor accessible and dry; long shaft needs alignment and bearing lubrication; pulling the column is heavy work'],
        ['Hydraulic submersible pump', 'Hydraulic motor at the pump end, driven by a hydraulic power unit on deck through hoses', 'No electrical power in the water; power pack (often electric or diesel) on deck; hose damage and oil leakage risk'],
        ['Hull / sea chest centrifugal pumps', 'Conventional pumps in the hull', 'Usable only when afloat or with hull immersed; not available when elevated'],
        ['Portable / temporary submersibles', 'Lowered over the side or through a caisson for a specific job', 'Flexible back-up; temporary cables and supports need control and inspection']]) +
      H('Caissons and sea water towers') + L([
        'A <b>caisson</b> (sea water tower) is a vertical steel tube fixed to the hull side or through the hull, extending down below the lowest operating water level. It protects the pump and cable from waves, current and debris.',
        'Some designs place pumps inside the <b>legs</b> or in tubes attached to the legs; others use caissons on the hull that are fixed in length – the maximum water depth / air gap at which the pump can still be submerged must be known.',
        'The caisson bottom is open (or has an intake screen / strainer basket); slots or holes near the bottom let water in.',
        'Pump is usually suspended from a <b>head plate</b> at the top of the caisson; riser pipe sections are flanged and lowered one by one.',
        'Guide rails or centralisers keep the pump from swinging and chafing the cable against the caisson wall.']) +
      H('Intake screens and strainers') + L([
        'Intake screens at the caisson bottom keep out fish, jellyfish, plastic and debris; deck strainers (duplex or self-cleaning) protect heat exchangers and nozzles.',
        'Differential pressure across strainers is a good indicator of blockage – an alarm on high DP is common on cooling systems.',
        'Blocked intakes lead to low suction head, cavitation, overheating of the motor (reduced flow past it) and dry-run trips.']) +
      H('Installation points') + L([
        'Submersible motors are cooled by the water flowing past them – many makers require a minimum flow velocity past the motor or a <b>shroud / cooling sleeve</b>.',
        'Submergence above the pump intake must be enough to avoid vortex and air drawing (maker data).',
        'Non-return valve on the discharge / riser holds the column full and prevents reverse rotation on stop.',
        'Discharge at deck goes through valves, strainers and to the fire / sea water ring main.']) + NOTE
    ],
    ['power', '⚡', 'Power cables, starters & VFD', () =>
      H('Submersible power cable') + L([
        'Special flat or round <b>submersible cable</b> rated for continuous immersion in sea water (water-blocked, often with lead sheath or special jacket on some designs).',
        'Cable is clamped to the riser pipe at regular intervals (stainless or banded clamps) so it does not hang on its own weight and chafe.',
        'At the top it passes through a <b>cable hanger / gland</b> on the caisson head plate and into a deck <b>junction box</b>; from there a normal marine cable runs to the starter.',
        'Some units use <b>cable reels</b> (motor or manual) for pumps that are raised and lowered often, or to follow jacking height changes; slip rings on reels need inspection.',
        'Splices / factory joints between motor lead and power cable are typical failure points – use only maker-approved splice kits.',
        'Cable damage: chafing at the caisson mouth, crushing during pump pulling, wave slam at splash zone, sharp edges, UV and mechanical damage on deck.']) +
      H('Starters') + TB(['Method', 'Typical use on raw water pumps'], [
        ['DOL', 'Smaller utility / cooling pumps; simple; high starting current and water hammer'],
        ['Star-delta', 'Not normally possible for submersible motors unless six leads are brought up – most have three leads'],
        ['Soft starter', 'Common on submersibles; reduces starting current and mechanical shock on riser, cable and column; ramp times per maker (submersible motors often need a short ramp to reach speed quickly for bearing lubrication)'],
        ['VFD', 'Flow and pressure control, energy saving, reduced water hammer; long submersible cables may need output filters (dV/dt or sine) to protect motor insulation from voltage reflections'],
        ['Auto-transformer', 'Large fire pumps on older units']]) +
      H('Power supply points') + L([
        'Fire pumps are normally fed from the main switchboard with an alternative supply arrangement (and / or a diesel-driven or emergency-supplied pump) – see the fire-water tab.',
        'Large raw water pumps are heavy consumers – PMS heavy-consumer request / start blocking may apply.',
        'Voltage drop on long cables at start: check motor terminal voltage at starting meets maker minimum.',
        `See ${A('pumps.html', 'Pumps guide')} for general starter and VFD theory.`]) + NOTE
    ],
    ['protect', '🛡️', 'Motor protection & insulation monitoring', () =>
      TB(['Protection', 'Why it matters for submersibles', 'Typical device'], [
        ['Overload / thermal model', 'Motor is cooled by water flow only; overload heats windings fast', 'Electronic motor protection relay or VFD motor model, set to nameplate (often lower service factor offshore)'],
        ['Underload / dry-run', 'Loss of water (pump above water level, blocked intake, broken riser) gives low power; motor overheats and seals / bearings fail', 'Underload (low kW / cos phi) relay, flow switch, low discharge pressure with delay'],
        ['Phase loss / unbalance', 'Single phasing destroys submersible motors in minutes; cable faults often start on one phase', 'Phase failure / unbalance relay, motor protection relay'],
        ['Winding temperature', 'Detects overheating from poor cooling flow', 'PTC thermistor or PT100 where fitted (needs extra conductors in cable)'],
        ['Moisture / seal leak', 'Water entering through the shaft seal into the motor', 'Moisture or conductivity probe in seal chamber / oil chamber, wired to a seal monitoring relay'],
        ['Earth fault / insulation monitoring', 'Insulation breakdown of motor or cable in sea water', 'IMD on IT system, earth-fault relay; some relays measure IR offline when the motor is stopped'],
        ['Short circuit', 'Cable or motor faults', 'Breaker / fuses coordinated with starter'],
        ['Restart lockout / starts per hour', 'Repeated starts overheat the motor', 'Start counter / anti-restart timer per maker']]) +
      H('Insulation monitoring of submersible motors') + L([
        'Insulation resistance (IR) of motor + cable is measured from the deck junction box or starter, phase to earth, with the motor isolated and leads disconnected from the starter.',
        'Use the test voltage the maker allows (often 500 V or 1000 V DC for LV motors, typical) – check the manual for submersible motors and VFD outputs (disconnect drives before testing).',
        'Readings fall with cable length and water temperature – compare <b>trends</b> under similar conditions rather than single values.',
        'A <b>falling trend</b> is the early warning: plan to pull the pump before an earth fault or burn-out.',
        'Offline insulation monitors in the starter can measure IR automatically every time the motor stops and block start below a set level.',
        'Separate the motor from the cable at a junction box (where possible) to find whether the cable or motor is faulty.',
        `See ${A('insulation.html', 'Earthing &amp; Insulation')} for IR testing and IT system earth faults.`]) + NOTE
    ],
    ['control', '🎛️', 'Control, pressure & level', () =>
      H('Pressure control') + L([
        'Fire / sea water ring main pressure is kept by a <b>jockey pump</b> or one duty raw water pump; main pumps start automatically on falling ring main pressure (pressure switch or transmitter with time delay).',
        'Cooling water pumps run duty / standby with auto start on low header pressure.',
        'With VFDs the pressure transmitter feeds a PID controller holding constant header pressure.',
        'Relief / dump valves or overboard recirculation avoid running against closed valves and limit pressure on the ring main.']) +
      H('Level and water depth') + L([
        'Low water level in the caisson (tide, low air gap setting, swell) can uncover the intake – level switches or a pressure transmitter in the caisson may block start or trip the pump.',
        'Jacking height and tide tables should be checked against pump submergence before changing air gap.',
        'Preload tank filling uses tank level gauging to stop pumps and close valves – often from the jacking / ballast control station.']) +
      H('Remote control and interlocks') + L([
        'Start / stop and status from the IAS, fire control station, driller’s or jacking control panels as designed.',
        'Fire pumps must be startable from the fire control station and other locations required by flag / class.',
        'Interlocks may include: discharge valve position, caisson level, seal leak alarm, insulation low, PMS start permission.',
        'Emergency shutdown (ESD) cause-and-effect: fire pumps are normally <b>not</b> tripped by ESD; other raw water pumps may be tripped per the matrix.',
        'Restart after blackout: fire pumps and essential cooling pumps should restart per the unit’s sequence – test it.']) + NOTE
    ],
    ['fire', '🔥', 'Fire-water role & redundancy', () =>
      `<p>On an elevated jack-up the raw water pumps <b>are</b> the fire pumps (or feed them). Losing raw water means losing fire fighting, deluge and helideck protection – so redundancy and independence are critical.</p>` +
      H('Typical arrangements (qualitative)') + L([
        'Two or more main fire pumps, each able to supply the required fire main pressure and flow, often in separate caissons or locations so one fire or one damaged caisson does not remove all.',
        'An <b>emergency fire pump</b> independent of the main machinery space: e.g. diesel-driven lineshaft or diesel-hydraulic submersible pump, or electric pump supplied from the emergency switchboard / emergency generator.',
        'Power cables of different fire pumps routed separately so one fire does not damage both.',
        'Some units can cross-connect raw water and fire main systems through valves – know the line-up.',
        'Jockey pump keeps the ring main pressurised to avoid water hammer and give immediate water.',
        'When afloat (moving), sea chest fire pumps may be used instead – know which pumps are available in each mode.']) +
      H('Redundancy for other services') + L([
        'Cooling water: duty / standby pumps; loss of cooling to generators may cause a blackout – common-mode risks include shared caisson, shared strainer, shared switchboard section.',
        'Preload: several pumps in parallel to fill preload tanks quickly; a failed pump slows preloading but should not create an unsafe condition.',
        'Jetting supply: may share pumps with fire main – check that jetting use does not reduce fire main capacity below requirements.']) +
      H('ETO points') + L([
        'Never leave a fire pump isolated without the OIM’s / master’s and chief engineer’s approval, a permit and alternative arrangements logged.',
        'Test remote starts of fire pumps from every station regularly.',
        'Fire pump protection philosophy may differ (e.g. overload alarm only) – check before changing settings.',
        'Know the required fire main pressure and the pumps needed to maintain it.']) + NOTE
    ],
    ['fouling', '🐚', 'Marine growth, sand & wear', () =>
      H('Marine growth') + L([
        'Caissons are dark, still and warm – ideal for mussels, barnacles and weed. Growth blocks intake screens and narrows the annulus around the motor (less cooling flow).',
        '<b>MGPS / electro-chlorination</b>: an electrolysis cell makes sodium hypochlorite from sea water, dosed at the caisson intake or pump suction. The ETO maintains the rectifier, cells, flow switches and hydrogen venting / interlocks.',
        'Copper / aluminium anode MGPS (impressed current) is used on some units – anode current and anode wear are checked.',
        'Dosing rate is kept at the level stated by the maker and local discharge permits.',
        'Electro-chlorination produces <b>hydrogen</b> – degassing tank and ventilation interlocks must work; the cell must not run without flow.']) +
      H('Sand, silt and seabed effects') + L([
        'In shallow water, waves and current stir up sand and silt; pumps near the seabed draw abrasive water.',
        'Abrasion wears impellers, wear rings, bowls, lineshaft bearings and seals – flow and pressure fall, current changes.',
        'Seabed scour or leg penetration changes the distance between the intake and the seabed – set the pump depth with margin.',
        'Jetting and preload operations disturb the seabed and increase silt near the legs.']) +
      H('Temperature and corrosion') + L([
        'Warm tropical sea water reduces motor cooling margin and increases fouling rate.',
        'Galvanic corrosion of pump parts and fittings: material selection and sacrificial anodes on pump / caisson where fitted.',
        'Splash zone parts of the cable and clamps corrode and wear fastest.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'Which raw water pumps exist, their caisson locations, and which services each feeds (fire, cooling, preload, jetting, drill water).',
        'Which pumps are <b>fire pumps</b>, the emergency fire pump arrangement, and their power supplies (main / emergency switchboard, diesel).',
        'Minimum water level / maximum air gap at which each pump still works.',
        'Motor data: rated current, voltage, start method, maximum starts per hour, minimum cooling flow.',
        'Cable route from motor to starter: splices, junction boxes, hangers, reels – and where damage is most likely.',
        'Protection settings: overload, underload / dry-run, phase loss, seal leak, insulation; and which trip and which only alarm.',
        'IR history of every submersible motor and cable, with conditions (temperature, test voltage).',
        'Pump pulling procedure, lifting equipment, and how to disconnect / reconnect the cable safely.',
        'MGPS / electro-chlorination system: rectifier, cells, flow and hydrogen interlocks.',
        'Interaction with jacking and preloading – do not change pump status during critical jacking without coordination.',
        `Background: ${A('jackingguide.html', 'Jacking Systems guide')}, ${A('jetting.html', 'Jetting System guide')}.`]) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Daily / each watch', 'Running pumps: current, discharge pressure, strainer DP; alarms; MGPS rectifier current; ring main pressure'],
        ['Weekly', 'Fire pump and emergency fire pump test runs; remote start tests from fire control station (per programme)'],
        ['Monthly', 'IR test and trend of stopped submersible motors and cables; seal / moisture relay test; underload and phase-loss relay function check; duty / standby changeover'],
        ['3-monthly', 'Junction boxes and cable hangers on caisson heads: seals, glands, corrosion; visible cable sections and clamps; MGPS cell inspection / cleaning'],
        ['6-monthly', 'Starter / soft starter / VFD inspection, cleaning, terminal tightness; protection settings verified against the list'],
        ['Yearly or by condition', 'Pull pump(s) for inspection: impeller / bowl wear, seal, motor IR and winding resistance, cable and splice condition, intake screen cleaning'],
        ['Survey / as required', 'Fire pump capacity test; motor overhaul or exchange; caisson internal inspection (ROV / diver or when accessible)'],
        ['After re-installation', 'IR and winding resistance before lowering and after landing; rotation check (flow / pressure, not only sound); current against nameplate; protection and auto start test']]) +
      L(['Intervals are only typical – follow the planned maintenance system and maker manuals.',
        'Record IR with date, motor temperature, test voltage and whether cable was included – a trend is worthless without conditions.',
        'Keep a spare pump / motor set and splice kit ready – pulling a failed pump is easier with a ready replacement.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['Pump will not start', 'No supply, tripped breaker, low IR start block, seal leak lockout, caisson low level, interlock, anti-restart timer', 'Check starter and relay alarms, interlock status, IR, control supply, mode selector'],
        ['Trips on underload / dry-run', 'Water level below intake, blocked screen, air locked, broken riser or coupling, closed discharge', 'Check water level vs air gap, strainer DP, discharge valves; inspect riser if persistent'],
        ['Trips on overload', 'Worn or sand-jammed pump, low voltage, phase unbalance, high flow (open hydrants / broken pipe)', 'Measure voltage and current on all phases, check system demand, compare to normal'],
        ['Phase loss / unbalance trip', 'Cable damage, failed splice, loose terminal in junction box, contactor contact wear', 'IR and winding resistance per phase from deck; inspect junction box and contactor'],
        ['Low or falling IR', 'Seal leak, cable jacket damage, splice failure, moisture in deck junction box', 'Split test at junction box (cable vs motor); check box seals; plan pump pull'],
        ['Earth fault alarm on IMD when pump runs', 'Motor or cable insulation breakdown in water', 'Identify by isolating feeders; IR test; do not keep running a faulted submersible'],
        ['Seal / moisture alarm', 'Mechanical seal wear, sand damage, probe fault', 'Check relay and probe circuit; schedule pull; limit running per maker'],
        ['Low pressure / low flow', 'Wear from sand, blocked intake or strainer, reverse rotation, leaking riser joint, marine growth', 'Check rotation, strainer DP, current; pull and inspect'],
        ['Noisy, fluctuating current', 'Cavitation or air drawing from low submergence, vortex', 'Check submergence, tide, intake condition'],
        ['Soft starter / VFD fault on start', 'Wrong ramp settings, cable fault, long cable reflections, blocked pump', 'Check fault log, motor and cable IR, ramp and current limit settings'],
        ['Fire main pressure drops, pumps keep starting', 'Leak on ring main, jockey pump failed, pressure switch fault', 'Walk the ring main, check jockey pump, compare gauges and transmitter'],
        ['MGPS low current / alarm', 'Scaled or worn cells, low flow, rectifier fault, hydrogen interlock', 'Check flow, rectifier output, clean cells per maker, check interlock']]) + NOTE
    ],
    ['safety', '⚠️', 'Safety & lessons', () =>
      H('Lifting and pump pulling') + L([
        'Pulling a submersible or lineshaft pump is a <b>heavy lift</b>: lift plan, certified lifting gear, crane / gantry, competent people and good weather.',
        'Riser sections are held by clamps / elevators at the head plate – never let a section hang unsecured; dropped objects into the caisson are expensive to recover.',
        'Handle the cable so it is not crushed by clamps or pulled tight over edges; use a cable sheave or reel.',
        'Open caisson heads are fall-through hazards – barriers and fall protection.']) +
      H('Caisson work') + L([
        'Caissons are <b>confined spaces</b>: permit, gas test (H2S from decaying growth, low oxygen, hydrogen from electro-chlorination), standby person, rescue plan.',
        'Isolate MGPS dosing and pumps in the caisson before entry or work.',
        'Wave and swell action inside the caisson can be strong – work only within agreed weather limits.']) +
      H('Electrical') + L([
        'Lock out at the starter and verify dead at the deck junction box before touching leads; discharge cable capacitance after IR tests (long cables hold charge).',
        'VFD-fed pumps: wait for DC bus discharge time.',
        'Remove automatic start (pressure-start, remote start from fire station) and inform the control room – a fire pump may start on low ring main pressure.',
        'Fire pump isolations only with approval and alternative arrangements logged.']) +
      H('Lessons') + L([
        'Submersible motors rarely fail without warning – a falling IR trend was usually visible weeks before.',
        'Dry-running from a too-high air gap or blocked intake burns seals and motors quickly – underload protection must work.',
        'Cable chafe at the caisson mouth and failed splices are the most common electrical faults.',
        'Fire pump remote starts that were never tested failed when needed – test all stations.',
        'Shared caissons, strainers or supplies can remove “redundant” pumps together – look for common points.',
        'After every pump pull, check rotation, current and protection before declaring the pump available.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Raw Water Pumps – Jack-ups (Guide)', icon: '🌊', accent: '#0e7490',
    subtitle: 'Raw (sea) water pumps on jack-up barges and rigs from the ETO point of view – why they are needed when elevated, submersible and lineshaft pumps in caissons, cables, starters, protection and insulation monitoring, fire-water role, marine growth, maintenance, troubleshooting and safety.',
    refs: ['SOLAS Ch. II-2', 'FSS Code', 'MODU Code', 'IEC 60092', 'Class rules'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
