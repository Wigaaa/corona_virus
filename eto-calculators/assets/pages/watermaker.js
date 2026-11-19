(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const A = (f, t) => `<a href="${window.ETO_BUNDLE ? '#' : ''}${f}">${t}</a>`;
  const NOTE = '<p>General guidance only – all values are typical. The maker’s manuals, potable-water regulations (WHO guidance, MLC 2006, flag-State and port-health rules), the company SMS and class rules always govern.</p>';

  const S = [
    ['overview', '🚿', 'Overview', () =>
      `<p>A <b>fresh water maker</b> (FWG – fresh water generator) produces technical and potable water from seawater. Two principles are used on board: <b>reverse osmosis (RO)</b>, which pushes seawater through semi-permeable membranes at high pressure, and <b>evaporators / vacuum distillation</b>, which boil seawater at low pressure using waste heat (usually main-engine jacket cooling water) and condense the vapour.</p>` +
      H('Comparison (typical)') + TB(['Item', 'Reverse osmosis', 'Evaporator / distillation'], [
        ['Energy', 'Electrical – HP pump is the main load (several kW per m3/h)', 'Waste heat from jacket water; electrical load mainly ejector / seawater pump'],
        ['Availability', 'Any time power is available, incl. in port (if water quality allows) and with engine stopped', 'Only when the engine runs with enough jacket-water heat (at sea, sufficient load)'],
        ['Product quality', 'Typically a few hundred ppm TDS (single pass); second pass for lower', 'Very pure – typically below 2–10 ppm; needs rehardening for drinking'],
        ['Sensitivity', 'Feed water quality (oil, sediment, chlorine, temperature, fouling)', 'Scale on heat surfaces, vacuum leaks, jacket-water temperature'],
        ['Consumables', 'Membranes, cartridge filters, chemicals', 'Anti-scale chemical, zinc anodes / acid cleaning'],
        ['Typical ships', 'Offshore vessels, yachts, passenger ships, ships without large waste heat', 'Merchant ships with large slow / medium-speed engines']]) +
      H('Why the ETO is involved') + L([
        'Motor starters and <b>VFDs</b> for the high-pressure pump, feed / booster pumps and ejector pump.',
        'The <b>PLC / control panel</b>, sensors (pressure, flow, conductivity, temperature, level) and the <b>salinometer + dump valve</b>.',
        'UV steriliser lamp ballasts, dosing pumps, chlorinator, heaters and alarm interfaces to the AMS.',
        'Calibration, fault finding and records that port-health and flag inspectors may check.']) +
      `<p>Related pages: ${A('pumps.html', 'Pumps guide')}, ${A('motor.html', 'Motors')}, ${A('signals.html', 'Signals & Loops')}.</p>` + NOTE
    ],
    ['ro', '🧪', 'Reverse osmosis plant structure', () =>
      `<p>Osmosis moves water from the dilute side to the concentrated side of a membrane. Applying a pressure higher than the <b>osmotic pressure</b> of seawater (typically about 25–27 bar at normal salinity) reverses the flow: fresh water (<b>permeate</b>) passes the membrane, salts stay in the <b>brine / concentrate</b>.</p>` +
      H('Typical flow path') + TB(['Stage', 'Function', 'Notes (typical)'], [
        ['Sea chest / feed pump', 'Supplies seawater at low pressure to pretreatment', 'Centrifugal, a few bar; dedicated or from a seawater main'],
        ['Multimedia / sand filter', 'Removes suspended solids', 'Backwashed automatically or manually by differential pressure or time'],
        ['Cartridge filters', 'Fine filtration before the membranes', 'Typically 20 µm then 5 µm; change on differential pressure'],
        ['Antiscalant / chemical dosing', 'Prevents scale and fouling on membranes', 'Small diaphragm dosing pump, proportional to feed flow'],
        ['Low-pressure switch', 'Protects the HP pump against dry running', 'Trips HP pump if feed pressure is too low'],
        ['High-pressure pump', 'Raises feed to membrane pressure', 'Typically 55–70 bar for seawater; plunger / piston or multistage centrifugal; often on a VFD'],
        ['Membrane pressure vessels', 'Spiral-wound membrane elements in GRP / stainless housings', 'Recovery typically 20–45 % for seawater'],
        ['Brine regulating valve', 'Sets back-pressure on membranes and so permeate flow', 'Manual needle valve or motorised; never close fully'],
        ['Energy recovery device', 'Recovers pressure from the brine (larger plants)', 'Pressure exchanger or turbine'],
        ['Salinometer / dump valve', 'Sends off-spec permeate to drain', 'Three-way solenoid or pneumatic valve'],
        ['Post-treatment', 'Rehardening, UV, chlorination', 'Then to the potable-water tanks']]) +
      H('Key points') + L([
        'Membrane rejection falls with <b>higher feed temperature</b> and rises with pressure; permeate flow rises with temperature (roughly a few % per °C) – plants are rated at a reference temperature, typically 25 °C.',
        'Membranes are damaged by <b>chlorine</b> and other oxidisers, oil, and pressure shocks (water hammer) – feed must be dechlorinated if chlorinated water is used for flushing.',
        'Never let membranes dry out; stored membranes are flushed and preserved (typically with a preservative solution) per maker.',
        'Some plants have a <b>second pass</b> (permeate re-treated) when lower TDS is needed (e.g. boiler feed).']) + NOTE
    ],
    ['evap', '♨️', 'Evaporator / distillation plant', () =>
      `<p>The common marine type is a <b>single-stage vacuum evaporator</b> (plate or shell-and-tube) heated by main-engine <b>jacket cooling water</b>. Under vacuum, seawater boils at a low temperature, so engine waste heat at typically 70–85 °C is enough.</p>` +
      TB(['Component', 'Function', 'Notes (typical)'], [
        ['Evaporator section (heat exchanger)', 'Jacket water heats seawater feed until it boils', 'Boiling typically around 40–60 °C at the plant vacuum'],
        ['Separator / demister', 'Removes droplets (salt carry-over) from the vapour', 'Wire mesh; fouling or high boiling causes carry-over'],
        ['Condenser', 'Condenses vapour with seawater cooling', 'Its seawater outlet often supplies the feed water'],
        ['Combined brine / air ejector', 'Creates vacuum and removes brine and non-condensable gases', 'Driven by the ejector pump; vacuum typically about 90–95 %'],
        ['Ejector pump', 'Seawater pump driving the ejector (and often feed and cooling)', 'Main electrical consumer of the plant'],
        ['Distillate pump', 'Extracts fresh water from the condenser', 'Often with a mechanical seal that can leak air – check vacuum'],
        ['Feed water treatment', 'Antiscale chemical dosed into the feed', 'Reduces scale on heating surfaces'],
        ['Jacket-water bypass / control valve', 'Sets heat input; protects engine cooling temperature', 'Three-way valve, manual or thermostatic'],
        ['Salinometer + dump solenoid', 'Returns off-spec distillate to the evaporator or bilge / drain', 'Alarm typically in the range 2–10 ppm']]) +
      H('Operating notes') + L([
        'Start only when the engine is at stable load and jacket water is at normal temperature; maker usually sets a minimum distance from shore and a minimum engine load.',
        'Watch the <b>engine jacket-water temperature</b> – taking too much heat can over-cool the engine; the bypass valve must work.',
        'Low boiling temperature (below roughly 40 °C, typical) does <b>not</b> pasteurise – distillate must still be disinfected before drinking.',
        'Multi-stage flash and multi-effect plants (and steam-heated units) exist on larger ships; the principle is the same.']) + NOTE
    ],
    ['treat', '💧', 'Pre- & post-treatment (UV, mineralisation, chlorination)', () =>
      H('Pretreatment (mainly RO)') + L([
        '<b>Strainers / sand or multimedia filters</b> remove sediment and weed; backwash by time or differential pressure.',
        '<b>Cartridge filters</b> (typically 20 µm + 5 µm) protect the membranes; change on high ΔP – a sudden low ΔP may mean a burst cartridge.',
        '<b>Antiscalant dosing</b> prevents carbonate / sulphate scale; dose per maker.',
        '<b>Dechlorination</b> (activated carbon or sodium bisulphite) if feed or flush water contains chlorine.',
        '<b>Fresh-water flushing</b> after shutdown displaces seawater and stops fouling and corrosion; usually automatic, with product (not chlorinated) water.']) +
      H('Post-treatment') + TB(['Step', 'Purpose', 'Typical values / notes'], [
        ['Mineralisation (rehardening)', 'Adds calcium / bicarbonate, raises pH, makes water less corrosive and better to drink', 'Dolomite / calcite (marble) filter or CO2 + calcite; pH typically 7–8.5 after'],
        ['UV sterilisation', 'Kills bacteria and viruses by UV-C (254 nm)', 'Lamp life typically about 9000–12000 h; dose typically 30–40 mJ/cm2 or more; quartz sleeve must be clean'],
        ['Chlorination', 'Disinfection and residual protection in tanks and pipes', 'Hypochlorite dosing or electrochlorination; free residual chlorine typically 0.2–0.5 mg/l at the tap, per flag / company rules'],
        ['Silver ion / other', 'Used on some ships as residual disinfectant', 'Only if approved by flag / health authority'],
        ['Filters at outlets', 'Final filtration / taste', 'Activated carbon taste filters only where allowed; change regularly']]) +
      L([
        'UV gives <b>no residual</b> protection – tanks still need chlorination or another approved residual disinfectant.',
        'Distilled and RO water is aggressive (low hardness, low pH) – without rehardening it corrodes copper and steel pipes and tastes flat.',
        'Bunkered shore water is also tested and chlorinated as required.']) + NOTE
    ],
    ['ctrl', '🎛️', 'Controls, sensors & salinometer', () =>
      TB(['Device', 'Function', 'Typical signal / setting'], [
        ['PLC / controller', 'Sequences start, flush, run, stop; alarms and trips', 'HMI on local panel; summary alarm to AMS'],
        ['Feed low-pressure switch', 'Protects HP pump from cavitation / dry running', 'Trip with time delay, typically around 1 bar'],
        ['HP high-pressure switch', 'Protects membranes and piping', 'Trip typically a few bar above normal working pressure (around 70–82 bar on seawater units)'],
        ['Pressure transmitters', 'Feed, membrane inlet, brine, permeate', '4–20 mA; also used for filter ΔP'],
        ['Flow meters', 'Permeate and brine flow; recovery calculation', 'Paddle wheel, magnetic or rotameter; pulse or 4–20 mA'],
        ['Conductivity / salinity cell', 'Measures product quality', 'Temperature-compensated; µS/cm or ppm TDS'],
        ['Dump valve (3-way)', 'Diverts off-spec water to drain', 'Solenoid / pneumatic, fail-safe to dump'],
        ['Temperature sensor', 'Feed temperature for correction and limits', 'PT100 or NTC'],
        ['Tank level switches / transmitters', 'Stop production on high tank level', 'Float switch or level transmitter'],
        ['VFD on HP pump', 'Soft start, ramps pressure up / down, adjusts output', 'Reduces water hammer and starting current'],
        ['Auto-flush valve', 'Fresh-water flush after stop / periodically', 'Timer in PLC; solenoid valve']]) +
      H('Salinometer & limits (typical)') + L([
        'Evaporators: alarm / dump typically about <b>2–10 ppm</b> (often given as a few µS/cm), as set by the maker.',
        'RO: product limit typically about <b>500 ppm TDS</b> (roughly 750–1000 µS/cm, depending on conversion factor); many plants are set lower.',
        'ppm ≈ µS/cm × factor (typically 0.5–0.7 – depends on the salt mix); use the meter’s own setting consistently.',
        'Readings are temperature compensated (to 25 °C typical) – a wrong temperature input gives wrong salinity.',
        'Test the salinometer regularly with a <b>calibration / test solution</b> or test button, and prove that the dump valve actually operates on alarm.']) +
      `<p>See ${A('signals.html', 'Signals & Loops')} for 4–20 mA loop checks.</p>` + NOTE
    ],
    ['elec', '⚡', 'Electrical & alarms', () =>
      TB(['Item', 'Typical arrangement', 'ETO checks'], [
        ['HP pump motor', 'DOL, star-delta, soft starter or VFD; often the largest load (several to tens of kW)', 'Insulation, current balance, overload setting, VFD parameters, bearings'],
        ['Feed / booster / ejector pumps', 'DOL starters with thermal overload', 'Contactors, overloads, rotation direction after work'],
        ['Dosing pumps', 'Small single-phase or 24 V DC; pulse from PLC', 'Stroke and frequency, low chemical-level switch'],
        ['UV lamp ballast', 'Electronic ballast with lamp-fail and hour counter; UV intensity sensor', 'Lamp hours, intensity reading, ballast LED, sleeve cleanliness'],
        ['Heaters', 'Panel / anti-condensation heaters; some units have feed heaters', 'Thermostat, insulation, current'],
        ['Control supply', '230 V AC / 24 V DC via transformer and PSU', 'Fuses, PSU voltage, earth faults'],
        ['Solenoid valves', 'Dump, flush, backwash valves (24 V DC or 230 V AC)', 'Coil resistance, manual override, valve actually moves']]) +
      H('Typical alarms and trips') + TB(['Alarm', 'Typical effect'], [
        ['High salinity', 'Dump valve opens; plant may stop after delay'],
        ['Low feed pressure', 'HP pump trip'],
        ['High HP pressure', 'HP pump trip'],
        ['High filter differential pressure', 'Alarm – change cartridges / backwash'],
        ['Motor overload / VFD fault', 'Pump stop'],
        ['UV lamp failure / low intensity', 'Alarm; water to tank may be blocked by an interlock valve'],
        ['Low chemical level', 'Alarm – refill dosing tank'],
        ['High product tank level', 'Production stop'],
        ['Low vacuum / high boiling temp (evaporator)', 'Alarm – check ejector and air leaks'],
        ['Low engine jacket-water temperature (evaporator)', 'Reduce heat input or stop – protect engine']]) +
      `<p>See ${A('motor.html', 'Motors')} and ${A('pumps.html', 'Pumps guide')}.</p>` + NOTE
    ],
    ['ops', '🚦', 'Operation & water quality rules', () =>
      H('Where NOT to produce water') + L([
        'Do <b>not</b> produce potable water in ports, harbours, rivers, estuaries, close to the coast, near sewage outfalls, dredging, oil spills or other contaminated water.',
        'Company rules commonly set a minimum distance from land – typically 12 to 20 nautical miles – check your SMS and flag requirements.',
        'Stop production when passing oil slicks, algae blooms or during tank cleaning / ballast operations near the sea suction.',
        'Oil in the feed ruins RO membranes quickly.']) +
      H('Potable water rules (summary)') + L([
        '<b>MLC 2006</b> Regulation 3.2 / Standard A3.2 – adequate drinking water of suitable quality; master’s inspections include drinking water.',
        '<b>WHO Guide to Ship Sanitation</b> and the WHO drinking-water quality guidelines are the common technical references.',
        '<b>ISO 15748</b> (potable water supply on ships) and flag-State / port-health requirements (e.g. ship sanitation certificate under the IHR).',
        'Typical company programme: water safety plan, tank cleaning and disinfection, regular residual chlorine / pH checks, periodic lab microbiological analysis (e.g. E. coli, coliforms, Legionella) – intervals per flag / company.',
        'Separate technical water (e.g. for boilers) and potable water systems; no cross-connections; protected air pipes and filling connections.']) +
      H('Records') + L([
        'Water maker log: running hours, production, salinity, pressures, position at start / stop.',
        'Chlorine / pH test results, lab analysis reports, UV lamp changes, filter and membrane changes, chemical consumption.',
        'Tank cleaning / disinfection records and bunkering certificates for shore water.']) + NOTE
    ],
    ['eto', '🎓', 'What the ETO should know', () =>
      L([
        'The plant <b>P&amp;ID and electrical drawings</b>: which pumps, valves and sensors exist and where the PLC I/O goes.',
        'Start / stop / flush <b>sequence</b> and all trip permissives – why the plant does not start (low pressure, level high, filter ΔP, flush pending).',
        'How to <b>calibrate and test the salinometer</b> and prove the dump valve – never bypass it.',
        'VFD settings on the HP pump: ramp times, max frequency, pressure control loop, fault history.',
        'UV steriliser: lamp hours, intensity sensor, ballast faults, safe lamp handling (UV radiation, mercury).',
        'Dosing pump setup and low-level alarms; chemical safety data sheets.',
        'Membrane limits: pressure, temperature, chlorine, pH – electrical errors (wrong pressure transmitter, failed switch) can destroy membranes.',
        'Evaporator: ejector-pump motor, vacuum and temperature signals, interaction with engine jacket-water control.',
        'Alarm interface to the AMS and what each alarm means.',
        'Records required by the company and inspectors – instrument calibrations are part of them.']) + NOTE
    ],
    ['maint', '🛠️', 'Maintenance & testing', () =>
      TB(['Interval (typical)', 'Task'], [
        ['Each run / daily', 'Log pressures, flows, salinity, temperature, production; check leaks, alarms, chemical levels'],
        ['Weekly', 'Test salinometer alarm and dump valve; check cartridge-filter ΔP; residual chlorine and pH checks; UV lamp status'],
        ['Monthly', 'Clean conductivity cell; check dosing pump output; check HP pump oil and seals; motor current and insulation trend'],
        ['As required by ΔP', 'Change cartridge filters; backwash multimedia filter'],
        ['3–6 monthly', 'Calibrate pressure transmitters and switches; test HP / LP trips; clean UV quartz sleeve'],
        ['Yearly or by hours', 'Change UV lamp (typically about 9000–12000 h or yearly); check rehardening filter media; service HP pump'],
        ['When performance drops', 'Chemical cleaning (CIP) of membranes – acid / alkaline per maker; evaporator acid descaling'],
        ['Several years (typical)', 'Replace RO membranes when normalised permeate flow or rejection is too low'],
        ['Before long lay-up', 'Flush and preserve membranes; drain or protect evaporator per maker']]) +
      L(['Use <b>normalised</b> data (corrected for temperature and pressure) to judge membrane fouling – raw flow figures mislead.', 'Keep records of calibrations, lamp changes and cleaning – they are checked by port-health and flag inspectors.']) + NOTE
    ],
    ['trouble', '🧰', 'Troubleshooting', () =>
      TB(['Symptom', 'Likely causes', 'Checks / actions'], [
        ['High salinity / dump valve open', 'Damaged membrane or O-ring, low HP pressure, high feed temperature, evaporator carry-over, dirty cell', 'Compare with a hand meter, clean cell, check pressure and temperature, check each membrane vessel permeate'],
        ['Salinity reading zero or frozen', 'Cell disconnected, cable fault, wrong cell constant, meter failure', 'Check cable and cell, test with calibration solution'],
        ['Low permeate flow', 'Fouled membranes, low feed temperature, low HP pressure, brine valve too open', 'Normalise data, check ΔP across membranes, plan cleaning'],
        ['HP pump trips on low feed pressure', 'Blocked cartridge filters, feed pump fault, air in suction, faulty switch', 'Filter ΔP, feed pump current and rotation, switch calibration'],
        ['HP pump trips on high pressure', 'Brine valve closed, blocked brine line, faulty transmitter or switch, VFD pressure loop', 'Check valve position, compare gauge vs transmitter'],
        ['VFD fault on HP pump', 'Overcurrent, overvoltage on fast stop, motor insulation, cooling', 'Read fault log, check ramps, motor insulation, fan'],
        ['Rapid filter ΔP rise', 'Dirty feed water (near coast, sediment), failed multimedia backwash', 'Stop near coast, check backwash sequence'],
        ['UV lamp alarm', 'Lamp end of life, ballast fault, dirty sleeve, sensor fault', 'Lamp hours, ballast LED, clean sleeve, replace lamp'],
        ['Dosing pump not dosing', 'Air lock, empty tank, no pulse from PLC, failed diaphragm', 'Prime pump, check level switch and PLC output'],
        ['Low vacuum (evaporator)', 'Ejector pump low pressure, worn ejector nozzle, air leaks, high seawater temperature', 'Ejector pump pressure and current, leak test, nozzle check'],
        ['Low output (evaporator)', 'Low jacket-water temperature or flow, scale on plates, low vacuum', 'Engine load, bypass valve, plan descaling'],
        ['Plant does not start', 'Permissive missing: tank full, flush pending, alarm not reset, E-stop', 'Check PLC permissive list and I/O status']]) + NOTE
    ],
    ['safety', '📚', 'Safety & lessons', () =>
      H('Safety') + L([
        'High pressure (typically 55–70 bar or more on RO): never open housings or loosen fittings under pressure; depressurise and isolate first.',
        'Isolate and lock out motors and VFDs; allow DC-bus discharge time on VFDs.',
        '<b>UV-C radiation</b> burns eyes and skin – never look at a running lamp; lamps contain mercury – handle broken lamps as hazardous waste.',
        'Chemicals (antiscalant, acid / alkaline cleaners, hypochlorite, bisulphite): PPE, SDS, never mix chlorine with acid.',
        'Hot jacket water and hot surfaces on evaporators; vacuum vessels must be vented before opening.']) +
      H('Lessons learned') + L([
        'Bypassed salinometers and dump valves have put salt or contaminated water into potable tanks – <b>never bypass</b> quality protection.',
        'Producing water near the coast or in port has caused illness on board – follow the distance rules.',
        'Chlorinated water used to flush RO membranes destroyed them – check what is in the flush line.',
        'Pressure shocks from DOL starting or fast closing valves crack membranes and housings – use VFD / soft starters and correct ramps.',
        'UV units with a failed lamp went unnoticed for months – check intensity and hours, not just the “on” light.',
        'Taking too much jacket-water heat on low engine load caused engine temperature problems – respect evaporator start conditions.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Fresh Water Maker (Guide)', icon: '🚿', accent: '#0284c7',
    subtitle: 'Reverse osmosis and evaporator fresh water generators from the ETO view – principles, pre- and post-treatment, controls, salinometer, electrical, alarms, water quality rules, maintenance, troubleshooting and safety.',
    refs: ['MLC 2006 Reg. 3.2', 'WHO Guide to Ship Sanitation', 'ISO 15748', 'Maker manuals'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
