(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  // instrument section: what it is for, how to use, safety, common mistakes
  const I = (use, how, safety, mistakes) => `<p>${use}</p>` + H('How to use it') + L(how) + H('Safety') + L(safety) + H('Common mistakes') + L(mistakes);
  const NOTE = '<p>Always follow the instrument maker’s manual and the vessel’s safety procedures. Use instruments with a valid calibration certificate.</p>';

  const S = [
    ['mm', '🔢', 'Multimeter & clamp meter', () =>
      I('The everyday tool: voltage, current, resistance, continuity, diode test, frequency and capacitance. The clamp meter measures current without breaking the circuit. Choose <b>true-RMS</b>, <b>CAT III 1000 V / CAT IV 600 V</b>, with LoZ and low-pass-filter (VFD) modes.',
        ['Check the meter on a known live source before and after the measurement (prove – test – prove).', 'Select the function first, then connect – black lead to COM first, remove it last.', 'Clamp only ONE conductor for load current; clamp all live conductors together for leakage current.', 'See the <b>Multimeter &amp; Clamp-Meter Tricks</b> page for ghost voltages, VFD outputs, diode, IGBT, coil and capacitor tests.'],
        ['Use GS38-type probes (shrouded, max 4 mm exposed tip) and test leads with the same CAT rating as the meter.', 'Never measure voltage with a lead in the A / mA socket.'],
        ['Using an average-reading meter on distorted waveforms.', 'Measuring resistance on a live circuit.', 'Trusting a meter with a low battery.']) + NOTE
    ],
    ['megger', '🧲', 'Insulation tester (megger)', () =>
      I('Measures insulation resistance (MΩ / GΩ) of cables, motors, generators and switchboards using a DC test voltage. The single most important preventive test for an ETO – the <b>trend</b> over time tells more than one reading.',
        ['Isolate, lock out, prove dead; discharge the circuit to earth.', '<b>Disconnect electronics</b>: VFDs, soft starters, AVRs, PLC cards, insulation monitors, surge arresters, capacitors and electronic meters.', 'Select the test voltage: 500 V DC for circuits up to 500 V (1000 V DC for 690 V), 250 V DC for 24–110 V control circuits; HV machines per IEEE 43 (2.5–5 kV).', 'Test each phase to earth and phase to phase; for motors and generators test at the terminals with the cable disconnected to find out which part is weak.', 'Read at 1 minute; for machines also at 10 minutes – <b>PI = R10 / R1</b> (≥ 2 good for class F insulation); DAR = R60 / R30 (≥ 1.25).', 'Record winding temperature – insulation resistance roughly halves for every 10 °C rise; correct to 40 °C before comparing.', 'Discharge the circuit after the test (the tester often does this automatically – wait for it).'],
        ['Test voltage is dangerous – keep others away and cover exposed conductors.', 'Long cables and machines store charge – always discharge.', 'In hazardous areas use only with a gas-free / hot-work permit (the tester can spark).'],
        ['Forgetting to disconnect a VFD or IMD – destroys electronics.', 'Comparing readings at different temperatures or humidity without correction.', 'Accepting “above 1 MΩ” when last year’s reading was 500 MΩ – the trend shows the problem.']) + NOTE
    ],
    ['ductor', '🔩', 'Low-resistance ohmmeter (Ductor)', () =>
      I('Measures very low resistance (µΩ / mΩ) of breaker contacts, busbar joints, cable lugs, bonding connections and windings, using a high test current and four-wire (Kelvin) connection.',
        ['Isolate and earth the equipment as per procedure; close the breaker under test.', 'Connect the <b>current leads</b> outside and the <b>potential leads</b> inside, as close as possible to the contact or joint.', 'Use a high current for contacts and joints (typ. 10–100 A, 100 A for breaker main contacts).', 'Take readings in both current directions and average them (cancels thermal EMF).', 'Compare with the maker’s value and between phases; a phase much higher than the others (typ. > 50 %) needs investigation.'],
        ['On inductive loads (windings, transformers) wait until the reading is stable and let the instrument discharge the winding before disconnecting.'],
        ['Potential leads placed outside the current leads (reads lead and clamp resistance).', 'Dirty or painted contact points.', 'Testing breaker contacts with a low current – it may not break through the contact film.']) + NOTE
    ],
    ['earthleak', '🌍', 'Earth leakage tester', () =>
      `<p>Two jobs on board: (1) proving that <b>RCDs / ELCBs</b> trip correctly, and (2) <b>finding earth leakage</b> on circuits, especially on insulated (IT) ship systems where the first earth fault does not trip anything.</p>` +
      H('RCD / ELCB testing') + L([
        'RCDs are fitted on circuits with an earthed supply (TN subsystems fed through a transformer): accommodation sockets, galley, laundry, wet areas, workshop and portable tools. On a pure IT system an RCD cannot see the first earth fault.',
        'Press the RCD <b>test button</b> monthly – proves the mechanism only.',
        'With an RCD tester at the outlet: test at <b>½ × IΔn</b> – must NOT trip; at <b>1 × IΔn</b> – must trip (general type ≤ 300 ms); at <b>5 × IΔn</b> – must trip ≤ 40 ms.',
        'Test both half-cycles (0° and 180°) and record the slowest time.',
        'Warn users – the test switches off the circuit (computers, fridges).']) +
      H('Finding leakage with a leakage clamp') + L([
        'Clamp <b>all live conductors together</b> (L1, L2, L3 and N): the reading is the leakage current to earth. A healthy circuit reads near zero.',
        'Use a leakage clamp with mA resolution and a magnetic shield – normal clamps cannot read a few mA accurately.',
        'On an IT system with a low insulation alarm: the insulation monitor (IMD) shows the switchboard is low. Use an <b>earth-fault location system</b> (injection type) if fitted, or clamp each outgoing feeder to find the one carrying the injected / leakage current.',
        'If no locator: with permission, switch off non-essential feeders one at a time and watch the IMD reading recover. Never isolate essential services without agreement from the bridge / engine room.',
        'Also clamp the PE conductor of a piece of equipment – current on PE confirms leakage inside that equipment.']) +
      H('Common mistakes') + L(['Clamping only one phase (shows load current, not leakage).', 'Testing RCDs without warning users.', 'Leaving a known earth fault on an IT system – a second fault on another phase becomes a short circuit.']) + NOTE
    ],
    ['rotation', '🔄', 'Phase rotation meter', () =>
      I('Shows the phase sequence (L1-L2-L3 clockwise or anticlockwise) of a supply, and – with the non-contact or motor-rotation types – the rotation direction of a motor before it is connected.',
        ['Connect L1, L2, L3 in the order of the labels; read the direction indicator.', 'Use before connecting <b>shore power</b>, after changing a feeder cable, after re-terminating a motor and on a new generator connection.', 'Motor rotation tester: with the motor de-energised and disconnected, connect to the motor terminals and turn the shaft by hand in the required direction – the tester shows which terminal should get L1, L2, L3.'],
        ['Rated for the system voltage; use fused leads.', 'Verify the absence of voltage before using a motor rotation tester on a motor.'],
        ['Checking only that voltage is present – a wrong sequence reverses every motor on shore power.', 'Not re-checking after a feeder repair.']) + NOTE
    ],
    ['pq', '📈', 'Power quality / harmonic analyser', () =>
      I('Records voltage, current, power, power factor, harmonics (THD), unbalance, flicker, dips and swells over time. Used for harmonic problems from VFDs, unexplained trips, generator load sharing and before / after modifications.',
        ['Set the nominal voltage, frequency (50 / 60 Hz) and the wiring configuration (3-wire / 4-wire).', 'Connect voltage leads first, then current clamps / flexible probes with the <b>arrow towards the load</b>; check that each clamp is on the matching phase (the analyser’s phasor diagram must look correct).', 'Record long enough to see normal and worst operation (e.g. thrusters at full load, jacking, crane lifting).', 'Compare THD-V with the class limit (often 8 % on ships – check your class rules) and individual harmonics with the limits.', 'Save the data and export a report.'],
        ['Connect in CAT-rated conditions, with arc-flash PPE where required.', 'Flexible probes must not be placed on bare live conductors unless rated.'],
        ['Clamp phases swapped – power and PF readings are wrong.', 'Recording only a few minutes at light load.']) + NOTE
    ],
    ['scope', '〰️', 'Oscilloscope', () =>
      I('Shows signal shape over time: communication signals (RS-485, CAN), encoder and sensor pulses, PWM, ripple on DC supplies, noise and transients.',
        ['Use <b>differential probes</b> or an <b>isolated-channel</b> handheld scope for anything connected to mains or drive circuits.', 'Set the probe ratio (×1 / ×10 / ×100) on the scope to match the probe.', 'Trigger on the signal edge; adjust time base to see a few cycles.', 'For RS-485: measure A-B differentially – a clean signal has sharp edges and > 1.5 V amplitude; ringing means a termination problem.', 'For DC supplies: AC coupling to see ripple and noise.'],
        ['<b>Never connect the earth clip of a mains-powered bench scope to a live point</b> – the clip is connected to earth and causes a short circuit.', 'Use CAT-rated probes and scope for power measurements.'],
        ['Wrong probe ratio setting.', 'Long earth lead picking up noise.']) + NOTE
    ],
    ['loopcal', '🎚️', 'Loop calibrator (mA)', () =>
      I('Sources, measures and simulates 4–20 mA signals. Used to test transmitters, control-system inputs and outputs, positioners and the complete loop.',
        ['<b>Measure</b> mode: in series with the loop to read the actual current.', '<b>Source</b> mode: replaces the transmitter and drives current into the input card – checks the PLC / IAS scaling and alarms (4 mA = 0 %, 12 mA = 50 %, 20 mA = 100 %).', '<b>Simulate</b> mode: acts as a 2-wire transmitter powered by the loop supply.', '<b>Loop power</b> (24 V): powers a transmitter on the bench for testing.', 'For HART, add a 250 Ω resistor in the loop if the loop has none.', 'Check alarm currents (NAMUR NE43: ≤ 3.6 mA / ≥ 21 mA) are handled correctly by the control system.'],
        ['Inhibit alarms and trips in the control system before injecting signals – you may start or stop equipment.', 'Use an intrinsically safe calibrator in hazardous areas.'],
        ['Breaking a loop without telling the control room (gives a fault / trip).', 'Testing only 4 and 20 mA – check mid-scale too.']) + NOTE
    ],
    ['tempcal', '🌡️', 'Temperature calibrator / RTD-thermocouple simulator', () =>
      I('Simulates RTDs (Pt100, Pt1000) and thermocouples (K, J, T…) into the measuring equipment, or measures sensor signals. Dry-block calibrators heat the real sensor to a known temperature.',
        ['<b>Simulate RTD</b>: disconnect the sensor, connect the calibrator in the same 2 / 3 / 4-wire configuration and set test temperatures; compare the display / IAS value.', '<b>Simulate thermocouple</b>: use the correct type and <b>thermocouple compensating cable / connector</b>; the calibrator handles cold-junction compensation.', '<b>Check the sensor</b>: measure Pt100 resistance (100 Ω at 0 °C, ≈ 138.5 Ω at 100 °C) or put it in a dry block at several temperatures.', 'Record as-found and as-left values.'],
        ['Dry blocks are hot – let them cool before packing.', 'Inhibit alarms and trips before simulating.'],
        ['Using copper wires instead of thermocouple wire (wrong reading).', 'Wrong RTD wiring configuration (lead resistance error).']) + NOTE
    ],
    ['thermal', '📷', 'Thermal (IR) camera', () =>
      I('Finds hot spots on connections, breakers, busbars, motors, bearings and cables without contact – an excellent PM tool when used under load.',
        ['Inspect with the equipment at least ≈ 40 % of normal load (higher is better).', 'Set emissivity: painted surfaces and insulation ≈ 0.9–0.95; <b>bare shiny metal reads far too low</b> – measure on the insulation, a lug or a piece of tape.', 'Compare similar components (phase to phase) under the same load. Typical NETA guidance: 1–3 °C difference = possible problem, 4–15 °C = probable problem, > 15 °C = major problem – repair as soon as possible.', 'Watch for reflections (sun, lamps, your own body heat).', 'Save image and visible photo; record load current at the time.'],
        ['Opening switchboard doors exposes live parts – follow the arc-flash procedure and PPE, or use IR windows.'],
        ['Inspecting at no load – nothing shows.', 'Trusting the temperature reading on bare copper.']) + NOTE
    ],
    ['battery', '🔋', 'Battery tester', () =>
      I('Checks battery health by measuring voltage and internal resistance / conductance. Used for UPS, emergency, starting and GMDSS batteries.',
        ['Measure each cell / block with the battery at rest and fully charged.', 'Compare internal resistance with the baseline (when new) and between blocks; an increase of more than ≈ 25–30 % (or the maker’s limit) indicates a weak block.', 'For flooded lead-acid: hydrometer – specific gravity ≈ 1.28 fully charged (check maker); all cells should be close to each other.', 'The definitive test is a <b>capacity (discharge) test</b> with a load bank – do it per the maintenance plan.', 'Record per block to build a trend.'],
        ['Battery rooms: no sparks, ventilation running, face shield, gloves, eyewash available.', 'Insulated tools only – a battery short circuit can melt tools.'],
        ['Judging a battery by float voltage only.', 'Comparing internal resistance at very different temperatures.']) + NOTE
    ],
    ['cablefault', '🧵', 'Cable fault locator', () =>
      I('Locates breaks, short circuits and insulation faults along cables and traces cable routes.',
        ['<b>TDR (time-domain reflectometer)</b>: sends a pulse and shows the distance to an open circuit (upward reflection) or short (downward). Set the cable’s velocity factor (from data or by testing a known length).', '<b>Insulation faults</b>: if the fault is high resistance, a TDR may not see it – use a bridge method (Murray loop with a healthy core) or, for HV cables, a surge generator (thumper) with acoustic pinpointing.', '<b>Cable tracer / tone generator</b>: identifies a cable and its route through trays and bulkheads.', 'Test from both ends and compare to confirm the location.'],
        ['The cable must be isolated, proved dead and discharged.', 'Surge generators produce high voltage – only trained persons.'],
        ['Wrong velocity factor (wrong distance).', 'Not allowing for extra cable length in loops and junction boxes.']) + NOTE
    ],
    ['nettest', '🌐', 'Network / serial tester', () =>
      I('Checks Ethernet cables and serial links (RS-232 / RS-485 / NMEA) and reads the data on them.',
        ['<b>Ethernet cable tester / verifier</b>: wire map (opens, shorts, crossed or split pairs), length, link speed, PoE presence.', '<b>Laptop + Wireshark</b> on a switch mirror port: see Modbus TCP, PROFINET, NMEA over UDP traffic and errors.', '<b>USB-RS485 / RS-232 adapter</b> with terminal or Modbus software: listen to a serial line or poll a device.', '<b>NMEA</b>: listen to the talker output and check sentences and checksums (see the NMEA decoder in this handbook).', 'Check termination resistance on RS-485 / CAN with power off (≈ 60 Ω).'],
        ['Connecting a laptop to ship networks must follow the vessel cyber-security procedure (scanned, authorised device).'],
        ['Transmitting on a live bus and disturbing the master.', 'Swapping A / B on RS-485.']) + NOTE
    ],
    ['kit', '🎒', 'Minimum instrument kit on board', () =>
      TB(['Instrument', 'Priority', 'Typical calibration', 'Main use'], [
        ['True-RMS multimeter (CAT III 1000 V)', 'Essential (2 pcs)', 'Yearly', 'Daily measurements, fault finding'],
        ['Clamp meter (AC/DC, true-RMS)', 'Essential', 'Yearly', 'Load and motor currents'],
        ['Two-pole voltage tester (GS38)', 'Essential (2 pcs)', 'Check before use / yearly', 'Proving dead'],
        ['Insulation tester 250 V – 1 kV (5 kV for HV)', 'Essential', 'Yearly', 'Cables, motors, generators'],
        ['Leakage clamp (mA)', 'Essential', 'Yearly', 'Earth leakage, IT system earth faults'],
        ['RCD tester / installation tester', 'Recommended', 'Yearly', 'RCD trip tests'],
        ['Phase rotation meter', 'Essential', 'Function check', 'Shore power, feeders, motors'],
        ['Loop calibrator (mA)', 'Essential', 'Yearly', '4–20 mA loops and instruments'],
        ['Temperature calibrator (RTD / TC)', 'Recommended', 'Yearly', 'Temperature loops'],
        ['Low-resistance ohmmeter', 'Recommended', 'Yearly', 'Breaker contacts, joints, bonding'],
        ['Thermal camera', 'Recommended', 'Per maker', 'PM hot-spot surveys'],
        ['Power quality analyser', 'Recommended (or via service)', 'Per maker', 'Harmonics, VFD problems'],
        ['Handheld oscilloscope (isolated)', 'Recommended', 'Per maker', 'Signals, comms, drives'],
        ['Battery tester / hydrometer', 'Recommended', 'Per maker', 'UPS and emergency batteries'],
        ['Cable / network tester', 'Recommended', 'Function check', 'Ethernet, serial, cable faults']]) +
      H('Tips') + L(['Keep a <b>calibration register</b> with serial numbers and due dates – surveyors and auditors ask for it.', 'Label each instrument with its calibration due date.', 'Carry spare test leads, fuses (correct HRC type) and batteries.', 'Store instruments dry and protected; remove batteries during long storage.', 'Verify a meter on a known source after any drop or overload.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'ETO Instruments & How to Use Them', icon: '🧰', accent: '#0d9488',
    subtitle: 'The test instruments an ETO should have on board – what each is for, how to use it step by step, safety and common mistakes.',
    refs: ['IEC 61010 / 61557', 'IEEE 43', 'EN 50110'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
