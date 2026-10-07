(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const NOTE = '<p>Values are typical. Always use the equipment maker’s data and procedures, and work only on isolated and proven-dead equipment unless live testing is authorised.</p>';

  const S = [
    ['ghost', '👻', 'Ghost voltages & LoZ', () =>
      `<p>A digital multimeter has a very high input impedance (≈ 10 MΩ). On a cable that is <b>disconnected or switched off</b> but runs next to live cables, capacitive coupling can show a “ghost” voltage – often 20–200 V – even though the conductor cannot supply any real current.</p>` +
      H('How to tell a ghost from a real voltage') + L([
        'Switch the meter to <b>LoZ</b> (low impedance, ≈ 3 kΩ): the meter loads the conductor – a ghost voltage collapses to near zero, a real voltage stays.',
        'Without LoZ: measure again with a small load (e.g. a two-pole voltage tester with load, or a test lamp) – the ghost disappears.',
        'Typical places: long control cables in trays, unused cores, switched-off lighting circuits, cables next to VFD output cables.']) +
      H('When NOT to use LoZ') + L([
        'On sensitive electronic or control circuits – the low impedance draws current and can operate relays, PLC inputs or trip an RCD (between L and PE).',
        'On 4–20 mA, RS-485 or sensor signals – use the normal high-impedance V range.',
        'LoZ ranges are for verifying presence / absence of mains voltage, not for precise measurements.']) +
      H('Proving dead correctly') + L(['Use a two-pole voltage tester (GS38 probes) – prove it on a known live source, test the circuit (all phases to each other and to earth), prove the tester again.', 'A multimeter on a high-impedance range alone is not a reliable “dead” test because of ghost voltages – and a faulty setting may show nothing on a live circuit.']) + NOTE
    ],
    ['trms', '📐', 'True-RMS vs average-reading', () =>
      `<p>Average-responding meters measure the average value and multiply by 1.11 – correct <b>only for a pure sine wave</b>. True-RMS meters calculate the real heating value of any waveform.</p>` +
      TB(['Waveform', 'Average-reading meter', 'True-RMS meter'], [
        ['Pure sine (resistive load, motor DOL)', 'Correct', 'Correct'],
        ['Rectifier / SMPS current (computers, LED drivers, UPS input)', 'Reads up to ≈ 30–50 % LOW', 'Correct'],
        ['VFD input current (6-pulse)', 'Reads low', 'Correct'],
        ['VFD output voltage (PWM)', 'Wrong / unstable', 'Often wrong too – use VFD / low-pass mode'],
        ['Square wave', '≈ 10 % high', 'Correct'],
        ['DC + AC ripple', 'AC part only', 'Use AC+DC mode for total']]) +
      H('Tips') + L([
        'Crest factor (peak / RMS): sine = 1.41; rectifier current can be 2–3. The meter’s crest-factor rating must be high enough or it will clip and read low.',
        'Neutral currents in 3-phase 4-wire systems with many single-phase electronic loads can exceed the phase current (triplen harmonics) – only a true-RMS clamp shows this.',
        'If two meters disagree on the same current, the true-RMS one is right – and the waveform is distorted (check harmonics).']) + NOTE
    ],
    ['vfd', '⚙️', 'Measuring VFDs correctly', () =>
      H('Input side') + L(['Measure all three line voltages; unbalance more than ≈ 2 % causes extra ripple and diode stress.', 'Input current is distorted – use a true-RMS clamp.']) +
      H('DC bus') + L(['DC bus voltage ≈ <b>1.35 × V(line)</b> under load (≈ 1.41 × V at no load): 400 V → ≈ 540–565 V DC; 690 V → ≈ 930–975 V DC.', 'Measure at the DC bus terminals (+ / −) with a CAT III 1000 V meter.', 'Ripple: AC voltage on the DC bus – high ripple indicates a lost input phase or weak capacitors.']) +
      H('Output side') + L([
        'The output is PWM pulses at a high carrier frequency (2–16 kHz). Normal meters read high or jump.',
        'Use the meter’s <b>VFD / low-pass-filter mode</b> – it shows the fundamental voltage and frequency, matching the drive display.',
        'Compare U-V, V-W, W-U: they should be equal (± 1–2 %). A difference indicates an output module problem.',
        'Output current is close to a sine – a true-RMS clamp reads well. Compare the three phases.',
        'Measuring the output frequency without the low-pass filter can show the carrier frequency instead.']) +
      H('Safety') + L(['After switching off, wait the time shown on the drive label (typically 5–15 minutes) and <b>measure the DC bus below 50 V</b> before touching anything.', 'A motor turning (e.g. a wind-milling fan or a thruster) can feed voltage back into the drive – stop and secure it.', 'Use arc-flash PPE on large drives.']) + NOTE
    ],
    ['diode', '➡️', 'Testing diodes & rectifier bridges', () =>
      L(['Isolate, discharge and disconnect the component (or at least the circuit) before testing.',
        'Select <b>diode test</b> mode: the meter shows the forward voltage drop.',
        '<b>Forward</b> (red on anode, black on cathode): silicon ≈ 0.4–0.7 V; power diodes ≈ 0.3–0.5 V; Schottky ≈ 0.15–0.45 V.',
        '<b>Reverse</b> (swap leads): OL (open).',
        'Both directions ≈ 0 V = shorted. Both directions OL = open.']) +
      H('Three-phase rectifier bridge (6 diodes)') + TB(['Red lead', 'Black lead', 'Expected'], [
        ['L1 / L2 / L3 (each)', 'DC +', '≈ 0.3–0.5 V'],
        ['DC +', 'L1 / L2 / L3 (each)', 'OL'],
        ['DC −', 'L1 / L2 / L3 (each)', '≈ 0.3–0.5 V'],
        ['L1 / L2 / L3 (each)', 'DC −', 'OL']]) +
      L(['All six “forward” readings should be nearly equal – one different reading points to a damaged diode.', 'Large DC bus capacitors may give a rising reading at first (charging) – wait for it to settle.']) + NOTE
    ],
    ['igbt', '🔲', 'Testing IGBTs / drive power modules', () =>
      `<p>A meter test finds <b>shorted or open</b> IGBTs and freewheeling diodes – the most common failures. It cannot prove the IGBT switches correctly under load.</p>` +
      H('Preparation') + L(['Isolate the drive, wait the discharge time and measure DC bus < 50 V.', 'Disconnect the motor cables (U, V, W) and the input cables.', 'Diode test mode.']) +
      H('Output stage test (each phase U, V, W)') + TB(['Red lead', 'Black lead', 'Expected (diode of the IGBT)'], [
        ['U / V / W', 'DC +', '≈ 0.3–0.5 V (upper freewheeling diode)'],
        ['DC +', 'U / V / W', 'OL'],
        ['DC −', 'U / V / W', '≈ 0.3–0.5 V (lower freewheeling diode)'],
        ['U / V / W', 'DC −', 'OL']]) +
      L(['≈ 0 V in both directions = shorted IGBT / module – do not power up.', 'All phases should read nearly equal.', '<b>Gate–emitter</b> (on a removed module): should be very high resistance / OL. A low resistance means a damaged gate.', 'Check the <b>brake chopper</b> IGBT and brake resistor the same way (resistor value against the drive nameplate).', 'After replacing a module: check gate drivers and the cause (motor cable insulation, overload, cooling) before starting.']) + NOTE
    ],
    ['coil', '🧲', 'Testing contactor & relay coils', () =>
      L(['Isolate and disconnect at least one coil wire (to avoid parallel paths).',
        'Measure coil resistance and compare with the data sheet or an identical coil.',
        '<b>OL</b> = open coil (burnt). <b>Much lower than normal</b> = shorted turns (often burnt smell or discoloured).',
        'AC coils have a low DC resistance (tens to hundreds of Ω) because their current is limited by inductance – do not reject them for a “low” reading; compare with a good coil.',
        'DC coils with an electronic economiser module cannot be measured simply – check per maker.',
        'Insulation test coil to frame (500 V DC) on large contactors.']) +
      H('If the coil is good but the contactor does not pull in') + L(['Measure the voltage <b>at the coil terminals</b> while the command is ON: should be within ≈ 85–110 % of rated.', 'Low voltage at pull-in: weak control transformer, long cable, loose terminal, failed contact in the control circuit.', 'Check AC / DC and voltage rating of the coil against the circuit – a 110 V coil on 230 V burns quickly; a 230 V coil on 110 V chatters.', 'Humming / chatter on AC contactors: dirty pole faces or a broken shading ring.']) + NOTE
    ],
    ['cap', '🔋', 'Testing capacitors', () =>
      H('Safety first') + L(['Capacitors keep charge after isolation. <b>Discharge through a suitable resistor</b> (never a screwdriver short) and measure 0 V before handling.', 'DC bus capacitors in drives can hold lethal voltage for minutes.']) +
      H('Measurement') + L([
        'Use the meter’s <b>capacitance</b> mode with the capacitor disconnected from the circuit.',
        'Compare with the nameplate: motor-run capacitors typically ± 5 %; electrolytic capacitors -10 / +20 % or more.',
        'A reading clearly below nameplate (e.g. > 10–20 % low) means the capacitor is ageing – replace.',
        'Electrolytic capacitors: also look for bulging, leaking electrolyte, venting; an <b>ESR meter</b> shows internal resistance increasing with age.',
        'Motor-start / run capacitors: a shorted capacitor reads ≈ 0 Ω on resistance range; open = no capacitance.']) +
      H('Power-factor correction capacitors') + L(['Measure capacitance per phase and compare between phases.', 'With the bank in service, clamp the current of each step and compare with rated current.', 'Check the discharge resistors / reactors and the contactor (special capacitor-duty contactors).', 'Detuned reactors overheating = harmonic problem; consult the PQ analyser data.']) + NOTE
    ],
    ['clamp', '🗜️', 'Clamp-meter tricks', () =>
      L([
        '<b>One conductor only</b> for load current – clamping a whole cable (phase + neutral) shows almost zero.',
        '<b>All live conductors together</b> (L1+L2+L3+N or L+N) – shows leakage / residual current. Use a leakage clamp for mA.',
        '<b>Small currents</b>: wind the conductor N turns through the jaw and divide the reading by N.',
        '<b>Inrush mode</b>: captures motor starting current (≈ 100 ms window) – compare with the expected 6–8 × FLC for DOL.',
        '<b>DC clamps</b> (Hall effect): press “zero” with the jaw closed and away from conductors before measuring; turn the clamp around to check polarity.',
        'Keep the conductor in the centre of the jaw and the jaw faces clean and fully closed.',
        'Neutral current higher than phase current = triplen harmonics (electronic loads) – needs a true-RMS clamp.',
        '3-phase motor: compare the three phase currents – unbalance more than ≈ 10 % with balanced voltage points to a winding or connection problem.',
        '<b>Max / Min / Hold</b> records peaks while you watch the equipment.']) + NOTE
    ],
    ['mistakes', '⚠️', 'Common meter mistakes & safety', () =>
      TB(['Mistake', 'Result', 'Prevention'], [
        ['Lead left in A socket, then measuring voltage', 'Short circuit through the meter → arc flash', 'Leads back to V/Ω after current measurement; meters with HRC fuses and jack alert'],
        ['Meter CAT rating too low for the location', 'Meter can explode on a transient', 'CAT III 1000 V / CAT IV 600 V for switchboards and distribution'],
        ['Unshrouded long probe tips', 'Short circuit between terminals', 'GS38 probes (max 4 mm exposed tip), shrouded'],
        ['Measuring resistance / continuity on a live circuit', 'Damaged meter, wrong reading', 'Prove dead first'],
        ['Measuring resistance in circuit', 'Parallel paths give wrong value', 'Disconnect one end of the component'],
        ['Low battery', 'Incorrect readings', 'Replace when the indicator shows'],
        ['Not proving the tester', 'A faulty tester shows “dead” on a live circuit', 'Prove – test – prove'],
        ['Average-reading meter on distorted waveform', 'Reads low', 'True-RMS meter'],
        ['Auto-hold left on', 'Old reading shown', 'Check the display mode'],
        ['Wrong range for mA loop (V instead of mA)', 'No reading / loop disturbed', 'Measure mA in series or use mA clamp']]) + NOTE
    ]
  ];
  ETO.page({
    title: 'Multimeter & Clamp-Meter Tricks', icon: '🔎', accent: '#ca8a04',
    subtitle: 'Practical meter tricks for the ETO – ghost voltages and LoZ, true-RMS, measuring VFDs, testing diodes, IGBTs, coils and capacitors, clamp tricks and common mistakes.',
    refs: ['IEC 61010', 'IEC 61243-3', 'HSE GS38'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
