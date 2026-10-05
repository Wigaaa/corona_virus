(function () {
  const { esc } = ETO;
  // Recommended preventive-maintenance steps per system: [interval, task, how / what to look for]
  // Intervals are typical marine practice – the vessel PMS, maker manuals and class requirements take precedence.
  const PM = {
    motor: ['⚙️', 'Motors & starters', 'Isolate, lock and prove dead before opening terminal boxes or starters.', [
      ['Daily / watch', 'Listen and feel during rounds', 'Unusual noise, vibration, smell of burning, hot frame; running current on panel ammeter as normal.'],
      ['Monthly', 'Running current – all three phases', 'Compare with nameplate FLC and previous readings; imbalance should stay below ≈ 10 %.'],
      ['Monthly', 'Cooling path', 'Fan cover, fins and air inlets clean and unobstructed; external fan intact.'],
      ['Monthly', 'Bearing condition', 'Temperature by touch / IR thermometer (typically < 80–90 °C), noise, vibration trend if measured.'],
      ['3-monthly', 'Anti-condensation heater', 'Heater energised when motor is stopped; check heater current or warm frame.'],
      ['Per lubrication plate', 'Bearing greasing', 'Correct grease type and quantity; open grease relief, run motor to purge excess. Do not over-grease.'],
      ['6-monthly', 'Terminal box', 'Gasket, glands and cable entry sealed; no moisture, tracking or discolouration; terminals tight.'],
      ['6–12-monthly', 'Insulation resistance', 'Megger winding to earth (500 V for ≤ 690 V motors), correct to 40 °C, compare with history; PI for motors > 100 kW.'],
      ['12-monthly', 'Starter / contactor', 'Contacts (wear, pitting), coil, arc chutes; overload relay set to nameplate FLC; terminal torque.'],
      ['12-monthly', 'Thermography under load', 'Starter, cable lugs and terminal box; investigate hot spots > 10 K above similar parts.'],
      ['12-monthly', 'Mechanical', 'Coupling, alignment and foundation bolts; soft foot; belt tension where fitted.'],
      ['Major overhaul', 'Workshop overhaul', 'Clean, dry and varnish winding, replace bearings, balance rotor, test winding resistance & IR.']]],
    gen: ['🛢️', 'Generators (alternator & AVR)', 'Lock out engine start AND generator breaker; beware of residual voltage from PMG / excitation.', [
      ['Daily', 'Running checks', 'Voltage, frequency, kW / kVAR sharing, power factor, winding & bearing temperatures, alarms.'],
      ['Weekly', 'Standby generator', 'Space heater on; no water, oil or dirt around air intake; breaker in correct position for auto start.'],
      ['Monthly', 'Air intake / filters', 'Clean or replace alternator air filters; check for oil mist ingress from engine.'],
      ['Monthly', 'Load sharing & PMS', 'kW sharing within limits on parallel running; load-dependent start/stop working.'],
      ['3-monthly', 'Bearings', 'Noise, temperature, grease per plate (or oil level for sleeve bearings).'],
      ['6-monthly', 'AVR & terminal box', 'Connections tight, no overheating, sensing fuses intact; AVR settings recorded.'],
      ['12-monthly', 'Insulation tests', 'Stator IR + PI, exciter and rotor IR (disconnect AVR and diodes first); compare with history.'],
      ['12-monthly', 'Rotating diodes & varistor', 'Visual and diode test (forward / reverse); replace as a set if one has failed.'],
      ['12-monthly', 'Load test', 'Run at high load; check voltage regulation, frequency, temperatures and current balance.'],
      ['Class survey cycle (often 30 months)', 'Protection relays', 'Secondary-injection test: reverse power, overcurrent, short-circuit, under/over-voltage, under-frequency, preferential trips.'],
      ['Per maker / 30–60 months', 'Generator ACB', 'Service mechanism, contact resistance (ductor), trip unit test.']]],
    swbd: ['🔌', 'Main & emergency switchboards (ACB / MCCB)', 'Busbar work only with the board dead or under a live-work permit with arc-flash PPE. Racked-out ACBs still hold charged springs.', [
      ['Daily', 'Visual & indications', 'Meters, lamps, insulation monitor / earth lamps reading; no smell or noise from panels.'],
      ['Monthly', 'Insulation monitor', 'Record reading; investigate any falling trend or alarm promptly.'],
      ['Monthly', 'Panel heaters & ventilation', 'Heaters and fans working; doors and seals closed.'],
      ['12-monthly', 'Thermography under load', 'Busbars, ACB / MCCB terminals and cable lugs at > 40 % load; compare similar components.'],
      ['12-monthly', 'ACB functional test', 'Spring charging, UV release, shunt trip, close / open, mechanical & electrical interlocks (bus-tie, shore, generators).'],
      ['12-monthly', 'Clean & inspect', 'Vacuum dust, check insulators and barriers, cable glands and earthing / bonding straps.'],
      ['30 months (survey)', 'Trip unit test', 'Secondary injection of ACB / generator protection; preferential trip and load-shedding functional test.'],
      ['30–60 months (dead)', 'Busbar joints', 'Re-torque joints to specified values, check for discolouration; contact resistance where specified.'],
      ['Per maker', 'ACB service', 'Lubricate mechanism, inspect arc chutes and main contacts; service kit per operation count.']]],
    vfd: ['🎛️', 'VFDs / drives', 'DC link stays charged after isolation – wait the label time and measure DC+ / DC− < 50 V.', [
      ['Weekly', 'Status & alarms', 'Warning / fault history read and recorded; cabinet temperature normal.'],
      ['Monthly', 'Cooling', 'Fans running; for liquid-cooled drives check coolant flow, temperature, pressure and leaks.'],
      ['3-monthly', 'Air filters', 'Clean or replace cabinet filters (more often in dusty / engine-room areas).'],
      ['6-monthly', 'Heat sink & cabinet', 'Clean dust from heat sink and boards with dry air / vacuum (ESD precautions).'],
      ['6-monthly', 'DC link', 'DC voltage and ripple in normal range; no capacitor bulging or leakage.'],
      ['12-monthly', 'Power connections', 'Terminal torque and thermography; cable glands and screen (EMC) terminations.'],
      ['12-monthly', 'Parameter backup', 'Save parameters to file / keypad with date; also after every change.'],
      ['12-monthly', 'Motor cable IR', 'Megger motor cable and motor with the DRIVE DISCONNECTED.'],
      ['12-monthly (spares)', 'Capacitor reforming', 'Reform DC capacitors of spare drives / modules in store per maker procedure.'],
      ['Per hours (≈ 30–50 k h)', 'Fan & capacitor replacement', 'Replace cooling fans and, per maker, DC capacitors before end of life.']]],
    ups: ['🔋', 'UPS systems', 'UPS output stays live on battery – isolate input, output, bypass and battery; check for back-feed.', [
      ['Weekly', 'Status', 'Mode (inverter / bypass), alarms, load %, displayed autonomy; room temperature 20–25 °C.'],
      ['Monthly', 'Event log', 'Review and record events, transfers and battery tests.'],
      ['3-monthly', 'Fans & filters', 'Fans running, filters clean.'],
      ['3-monthly', 'Battery block voltages', 'Float voltage of each block; spread small (≈ ±0.05 V/cell).'],
      ['6-monthly', 'Battery internal resistance', 'Measure each block; investigate > 25 % above baseline, replace > 50 %.'],
      ['12-monthly', 'Autonomy (discharge) test', 'Controlled discharge on real or dummy load; compare runtime with design.'],
      ['12-monthly', 'Bypass transfer test', 'Transfer to bypass and back per maker procedure.'],
      ['12-monthly', 'Connections', 'Terminal torque and thermography of power and battery connections.'],
      ['3–5 / 10 years', 'Battery replacement', 'Replace the battery string at design life or when capacity < 80 %.']]],
    batt: ['🔋', 'Batteries & DC chargers (24 V / 110 V DC)', 'Batteries cannot be switched off – insulated tools, no rings / watches, eye protection, ventilate.', [
      ['Daily', 'DC earth-fault meter', 'Both poles balanced to earth; investigate any earth fault.'],
      ['Weekly', 'Charger', 'Float voltage and current normal; no alarms; boost not stuck on.'],
      ['Monthly', 'Cell / block voltages', 'Within float range; no cell much higher or lower than the rest.'],
      ['Monthly', 'Vented cells', 'Electrolyte level and specific gravity; top up with distilled water only.'],
      ['Monthly', 'Ventilation', 'Battery room / locker fan or natural vents clear; no gas smell; temperature normal.'],
      ['3-monthly', 'Terminals', 'Clean, tight, petroleum jelly applied; no corrosion or swelling.'],
      ['12-monthly', 'Capacity test', 'Discharge test against rated capacity (e.g. emergency / GMDSS / UPS batteries).'],
      ['12-monthly', 'Charger test', 'Current limit, boost / float changeover, alarms (low / high voltage, earth fault, charger fail).']]],
    egen: ['🆘', 'Emergency generator & ESB', 'Ensure the test does not interrupt essential consumers unexpectedly; follow the SMS test procedure.', [
      ['Weekly', 'Pre-start checks', 'Fuel level, lube oil, coolant, start battery voltage / air pressure; second start source available.'],
      ['Weekly', 'Start & run', 'Start from local panel, check voltage and frequency, run off-load as per SMS.'],
      ['Monthly', 'Automatic start on blackout', 'Simulate loss of main supply; EDG starts and connects to the ESB within 45 s (SOLAS II-1/44).'],
      ['Monthly', 'On-load run', 'Run with emergency loads connected; check voltage, frequency, temperatures.'],
      ['Monthly', 'Changeover', 'Return to normal supply / back-synchronisation; interlock between MSB feeder and EDG breaker.'],
      ['Monthly', 'Room', 'Louvres, ventilation, heater, lighting and fuel tank quick-closing valve.'],
      ['12-monthly', 'Shutdowns & alarms', 'Overspeed, low LO pressure, high temperature tested.'],
      ['12-monthly', 'Generator insulation', 'Stator IR, AVR and terminal box check.']]],
    trf: ['🧲', 'Transformers (dry type)', 'Isolate both primary and secondary (including any back-feed) before opening the enclosure.', [
      ['Monthly', 'Temperature & noise', 'Winding temperature indicator / alarms; no unusual hum or smell.'],
      ['3-monthly', 'Ventilation', 'Fans (if fitted) running; enclosure filters and grilles clean.'],
      ['12-monthly', 'Thermography under load', 'Terminals, links and cable lugs.'],
      ['12-monthly', 'Clean & inspect', 'Remove dust from coils and ducts, check for tracking, cracks, loose spacers.'],
      ['12-monthly', 'Insulation resistance', 'HV–E, LV–E and HV–LV; compare with history.'],
      ['12-monthly', 'Connections & taps', 'Terminal torque; tap links in the recorded position.'],
      ['When suspect', 'Turns ratio & winding resistance', 'TTR within ±0.5 %; winding resistance balance within ≈ 2 %.']]],
    light: ['💡', 'Lighting, emergency lighting & navigation lights', 'Isolate the lighting circuit before changing fittings; navigation lights must stay available when under way.', [
      ['Daily / before departure', 'Navigation lights', 'All lamps lit, nav-light panel failure alarm tested, both supplies (main & emergency) available.'],
      ['Weekly', 'Lighting rounds', 'Failed lamps in machinery spaces, escape routes and deck areas replaced.'],
      ['Monthly', 'Emergency lighting', 'Function test from emergency source; escape-route and low-location lighting working.'],
      ['3-monthly', 'Deck fittings', 'Gaskets, glass and glands of deck / exposed fittings; no water ingress.'],
      ['12-monthly', 'Duration test', 'Battery-backed emergency fittings run for their rated duration.'],
      ['12-monthly', 'Circuit IR', 'Insulation test of lighting circuits (disconnect electronic drivers).']]],
    cable: ['🧵', 'Cables, junction boxes & deck equipment', 'Isolate circuits before opening junction boxes; follow Ex rules in hazardous areas.', [
      ['Monthly', 'Deck walk-round', 'Cable damage, chafing, loose cable trays and clamps, missing gland seals.'],
      ['3-monthly', 'Junction boxes on deck', 'Gaskets, lids and drain plugs; no water ingress or corrosion.'],
      ['6-monthly', 'Deck equipment', 'Socket outlets, heaters, winch / windlass terminal boxes – seals and insulation.'],
      ['12-monthly', 'Insulation of circuits', 'Megger deck and wet-area circuits; trend readings to find deterioration early.'],
      ['12-monthly', 'Earthing & bonding', 'Bonding straps and earth connections of deck equipment and cable armour.'],
      ['Per IEC 60079-17', 'Ex equipment', 'Visual / close / detailed inspection of Ex equipment in hazardous areas.']]]
  };
  const calcs = Object.keys(PM).map(id => {
    const [icon, title, safe, rows] = PM[id];
    return {
      id, icon, title, noActions: true, inputs: [],
      desc: 'Recommended preventive-maintenance steps with typical intervals. Follow the vessel PMS and maker manuals where they differ.',
      run: () => ({ head: '<span></span>', verdict: { s: 'warn', t: '🦺 ' + esc(safe) }, html: `<table class="rt"><thead><tr><th>Interval</th><th>Task</th><th>How / what to look for</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${esc(r[0])}</b></td><td><span class="kb">${esc(r[1])}</span></td><td><span class="kb">${esc(r[2])}</span></td></tr>`).join('')}</tbody></table>` })
    };
  });
  ETO.page({
    title: 'Preventive Maintenance Guide', icon: '🛠️', accent: '#16a34a',
    subtitle: 'Recommended preventive-maintenance steps for each electrical system, with typical intervals and what to look for.',
    refs: ['Typical marine practice', 'Vessel PMS & maker manuals govern'],
    calcs
  });
})();
