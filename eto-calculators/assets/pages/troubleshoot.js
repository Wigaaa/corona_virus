(function () {
  const { esc } = ETO;
  // Knowledge base: equipment -> symptom -> {t: title, c: likely causes (most likely first), k: ordered checks, m: [measurement, expected / good value], a: corrective actions, s: safety note}
  const SAFE_LV = 'Isolate, lock & tag, and prove dead (test–prove–test) before touching conductors. Live testing only with suitable CAT III/IV meter, insulated tools and permit where required.';
  const SAFE_VFD = 'VFD DC link stays charged after isolation – wait the time on the drive label (typically 5–15 min) and measure DC+ / DC− < 50 V before working.';
  const KB = {
    motor: {
      name: 'AC induction motor & starter', icon: '⚙️', s: SAFE_LV,
      sym: {
        nostart: { t: 'Motor will not start (no hum, no movement)', c: ['No supply – feeder breaker / fuse open or tripped', 'Control circuit dead – control fuse, control transformer, 24 V supply', 'Stop / emergency-stop circuit open, local-remote selector in wrong position', 'Interlock or permissive missing (PLC, pressure, level, door, brake, lube)', 'Overload relay tripped and not reset', 'Contactor coil open-circuit or contactor mechanically stuck', 'Loose / burnt terminal, open motor lead', 'VFD / soft-starter fault or not enabled'],
          k: ['Check alarm / fault history on starter, PLC and VFD', 'Verify incoming voltage at starter line side (all three phases)', 'Verify control voltage at coil terminals when start is commanded', 'Walk the control circuit: E-stop, stop PBs, selector, permissives, OL contact', 'Check contactor pulls in; if yes, measure voltage at load side T1–T3', 'Isolate and measure motor winding resistance & insulation'],
          m: [['Line voltage L1-L2 / L2-L3 / L3-L1', 'Nominal ±10 %, balanced within 1–2 %'], ['Control voltage at coil', 'Coil rating ±10 % (e.g. 230 VAC / 24 VDC)'], ['Contactor coil resistance', 'Finite, per datasheet – open = failed coil'], ['Winding resistance phase-phase', 'Three readings within ±2 %'], ['IR winding-earth (500/1000 V)', '> 5 MΩ LV motor (corrected to 40 °C)']],
          a: ['Restore supply / replace fuse after finding why it blew', 'Repair control circuit fault, replace coil or contactor', 'Clear interlock cause – do not bypass permissives', 'Repair terminals; replace or rewind motor if winding open'] },
        hum: { t: 'Motor hums but does not turn / stalls', c: ['Single-phasing – one phase lost (fuse, contact, cable)', 'Mechanical seizure – bearing failure, pump seized, brake not releasing', 'Very low voltage / excessive voltage drop on start', 'Load too high for starting method (star-delta on high-torque load)', 'Wrong connection (star/delta) or broken rotor bars'],
          k: ['STOP immediately – locked rotor overheats winding within seconds', 'Measure current in all three phases during the start attempt', 'Check fuses / contactor contacts / terminals for an open phase', 'Isolate, turn the shaft by hand / check brake release', 'Check voltage at motor terminals during start'],
          m: [['Phase currents during start', 'All three ≈ equal; one ≈ 0 A = single phasing'], ['Voltage at terminals during start', '≥ 85 % of rated'], ['Brake coil voltage (if fitted)', 'Rated value when released; air gap within limit']],
          a: ['Replace blown fuse / worn contactor contacts', 'Repair / replace seized bearing or driven equipment', 'Adjust brake air gap / replace rectifier', 'Change to soft starter / VFD or DOL if star-delta torque insufficient'] },
        ol: { t: 'Overload relay trips repeatedly', c: ['Genuine overload – mechanical load increased (clogged pump, throttling, damaged impeller, bearing)', 'Low or unbalanced supply voltage', 'Overload set incorrectly / wrong trip class for long start', 'Single phasing or high-resistance joint', 'Frequent starts – thermal memory not cooled', 'Winding fault (shorted turns)'],
          k: ['Compare relay setting with motor nameplate FLC', 'Measure running current in all phases and compare with FLC', 'Measure line voltage balance', 'Check driven equipment (discharge pressure, valve position, coupling)', 'Check start time vs trip class; count starts per hour', 'Isolate – winding resistance balance and IR'],
          m: [['Running current', '≤ nameplate FLC (× service factor)'], ['Current unbalance', '< 10 %'], ['Voltage unbalance', '< 1–2 %'], ['Winding resistance balance', '< 2 % difference']],
          a: ['Set relay to FLC (do not over-set to stop trips)', 'Fix mechanical cause / reduce load', 'Correct supply / repair joints', 'Use class 20/30 relay for long acceleration', 'Rewind / replace motor if shorted turns'] },
        highcur: { t: 'High running current (but no trip yet)', c: ['Mechanical overload or wrong pump duty point', 'Low supply voltage', 'High-resistance / bad bearing / misalignment', 'Wrong connection (motor wound for different voltage)', 'Frequency high (pump/fan load increases with speed³)', 'Partial winding short'],
          k: ['Measure current, voltage, frequency, and if possible kW & PF', 'Compare with previous trend readings', 'Check driven machine performance (pressure / flow)', 'Check bearing temperature and vibration'],
          m: [['Current vs FLC', '≤ 100 %'], ['Supply frequency', 'Rated ±1 %'], ['Power factor at load', '0.8 – 0.9 near full load']],
          a: ['Restore correct duty point (throttle / impeller)', 'Correct voltage (taps, AVR setting)', 'Replace bearings, realign coupling'] },
        unbal: { t: 'Unbalanced phase currents', c: ['Voltage unbalance in supply (single-phase loads, taps)', 'High-resistance connection on one phase', 'Contactor contact worn on one pole', 'Winding fault (shorted turns) or broken rotor bar', 'Earth fault developing on one phase'],
          k: ['Rotate the three supply leads one position at the motor: if the high current follows the supply phase → supply problem; if it stays on the motor terminal → motor problem', 'Measure voltage unbalance', 'Thermal-image the starter and terminal box', 'Contact resistance of contactor poles'],
          m: [['Current unbalance', '< 10 %'], ['Voltage unbalance', '< 1 %'], ['Contact resistance per pole', 'Within manufacturer value, poles similar']],
          a: ['Tighten / renew lugs and terminals', 'Replace contactor contacts', 'Rebalance single-phase loads', 'Repair motor if unbalance follows the motor'] },
        hot: { t: 'Motor overheating', c: ['Overload / high current', 'Blocked cooling – dirty fins, failed fan, fan cover blocked, high ambient', 'Too many starts', 'Voltage unbalance (6–10× current unbalance)', 'Running on VFD at low speed with self-cooled fan', 'Bearing friction'],
          k: ['Measure current and voltage balance', 'Check cooling air path and fan', 'Measure winding temperature (PT100 / resistance method)', 'Check VFD minimum speed and torque at low speed'],
          m: [['Frame temperature', 'Typically < 80–90 °C for class F with B rise (check datasheet)'], ['Winding temperature (PT100)', 'Below alarm (class F ≈ 140 °C)']],
          a: ['Clean motor, repair fan', 'Reduce load / starts', 'Fit forced-ventilation fan for low-speed VFD duty'] },
        vib: { t: 'High vibration / noise', c: ['Misalignment or soft foot', 'Unbalance (impeller, coupling)', 'Bearing damage (grease, contamination, electrical fluting from VFD)', 'Loose foundation bolts', 'Electrical: rotor bar fault, air-gap eccentricity (vibration at 2× line frequency)', 'Resonance at a VFD speed'],
          k: ['Check whether vibration disappears instantly when power is removed (electrical cause) or decays with speed (mechanical)', 'Check foundation, coupling and alignment', 'Measure vibration and bearing temperature', 'Listen / measure bearing condition (shock pulse)'],
          m: [['Vibration velocity (ISO 10816 / 20816)', 'Within zone A/B for machine class'], ['Bearing temperature', 'Stable, typically < 90 °C']],
          a: ['Realign, correct soft foot', 'Balance rotor / impeller', 'Replace bearings; for VFD motors use insulated bearing / shaft earthing brush', 'Skip resonant frequencies in VFD'] },
        dir: { t: 'Wrong direction of rotation', c: ['Two phases swapped after cable / motor change', 'Phase sequence of supply changed (shore supply, new generator)'],
          k: ['Check phase rotation with phase-sequence meter', 'Confirm with the equipment arrow before running pumps (dry-run damage)'],
          m: [['Phase sequence', 'L1-L2-L3 clockwise (per vessel standard)']],
          a: ['Swap any two phases at the motor terminals (not at the switchboard unless whole board is wrong)'] },
        ef: { t: 'Earth fault / low insulation on motor circuit', c: ['Moisture in winding or terminal box (condensation, wash-down, anti-condensation heater off)', 'Damaged cable insulation (chafing, crushed, gland)', 'Contaminated winding (oil, salt, carbon dust)', 'Winding insulation breakdown (age, overheating)'],
          k: ['Isolate, disconnect cable at motor', 'Megger cable and motor separately to locate the fault', 'Check heater operation and terminal-box gaskets', 'Record IR / PI and compare with history'],
          m: [['IR cable', '> 1 MΩ (ship circuits), typically ≫ 100 MΩ healthy'], ['IR motor (corrected to 40 °C)', '> 5 MΩ LV; PI ≥ 2']],
          a: ['Dry out motor (heaters, low-voltage dry-out current, oven) and retest', 'Clean / varnish winding', 'Replace damaged cable section', 'Rewind if insulation does not recover'] }
      }
    },
    gen: {
      name: 'Generator / alternator & AVR', icon: '🛢️', s: 'Generator terminals are live whenever the engine turns with excitation. Lock out the engine start AND the generator breaker; beware of residual magnetism and PMG output.',
      sym: {
        novolt: { t: 'Runs at speed but no / very low voltage', c: ['Loss of residual magnetism (after long standstill, after insulation test or reverse polarity)', 'AVR fuse blown or AVR failed', 'Exciter field open circuit / loose AVR wiring (F+/F−)', 'Rotating diode(s) failed short or open, varistor failed', 'PMG (if fitted) failed', 'Voltage-sensing wiring wrong / open'],
          k: ['Check speed (frequency) is correct', 'Check AVR fuses, LEDs and alarms', 'Measure exciter field voltage F+/F− (should be several V DC)', 'Measure residual voltage at terminals with AVR disconnected (few % of rated)', 'Test rotating diodes and varistor (stopped & isolated)', 'Flash the field per the manufacturer procedure (battery, correct polarity, short time)'],
          m: [['Residual voltage at terminals', '≈ 2–5 % of rated at rated speed'], ['Exciter field resistance', 'Per datasheet (typically 10–40 Ω)'], ['Rotating diode forward / reverse', 'Forward ≈ 0.4–0.7 V (diode test), reverse open']],
          a: ['Field flash (only per maker procedure)', 'Replace diode bridge / varistor as a set', 'Replace AVR (copy all settings / jumpers)', 'Repair sensing / field wiring'] },
        voltage: { t: 'Voltage too low / too high / unstable', c: ['AVR setpoint or droop (quadrature) setting wrong', 'Speed (frequency) wrong – AVR U/f roll-off active at low speed', 'Sensing lost on one phase → over-voltage', 'AVR stability (gain) setting causing hunting', 'Weak rotating diode → cannot carry load', 'Overload / very low PF load'],
          k: ['Check frequency first', 'Measure all three line voltages and AVR sensing input', 'Compare no-load and full-load voltage (regulation)', 'Check AVR stability adjustment and excitation current at load'],
          m: [['Steady-state voltage', 'Rated ±2.5 %'], ['Excitation current no-load vs full-load', 'Rises smoothly with load; compare with test report']],
          a: ['Adjust AVR set-point / droop / stability per maker', 'Repair sensing', 'Replace diodes / AVR'] },
        freq: { t: 'Low frequency / hunting / unstable speed', c: ['Governor / actuator problem, sticky fuel rack or linkage', 'Fuel supply restriction (filters, air in fuel)', 'Load sharing line fault between paralleled DGs', 'Governor gain / droop settings', 'Engine overload or turbocharger problem'],
          k: ['Observe hunting with DG alone vs in parallel', 'Check fuel pressure / filters', 'Check actuator signal and linkage freedom', 'Check load-sharing module signals (kW lines, bias)'],
          m: [['Frequency', 'Rated ±0.5 % steady state'], ['Actuator output', 'Steady, not oscillating']],
          a: ['Repair fuel system / linkage', 'Retune governor (gain, stability)', 'Repair load-sharing wiring'] },
        revp: { t: 'Reverse-power trip', c: ['Engine loses power while in parallel (fuel, governor, shutdown)', 'Poor load sharing – one DG unloaded', 'Synchronizing with incoming generator slower than bus', 'Wrong CT / VT polarity on relay'],
          k: ['Check engine alarms at time of trip', 'Check kW of each DG before trip (trend / PMS log)', 'Check sync slip direction (incoming should be slightly faster)', 'Verify relay CT polarity with a load test'],
          m: [['Reverse-power setting', 'Typically 2–15 % rated (by prime mover), 3–10 s'], ['kW sharing deviation', 'Within ±15 % of rated of largest unit']],
          a: ['Fix engine / governor fault', 'Adjust load-sharing', 'Correct synchroniser settings / CT polarity'] },
        sync: { t: 'Will not synchronize / breaker will not close', c: ['Frequency or voltage outside synchroniser window', 'Phase sequence different (after maintenance)', 'Breaker not charged / UV coil not energised / interlock', 'Sync-check relay fault or bus VT fuse blown', 'Dead-bus closing logic not satisfied'],
          k: ['Compare frequency, voltage and phase angle (sync scope)', 'Check breaker spring charged, UV coil voltage, closing coil supply', 'Check bus and generator VT fuses', 'Verify phase sequence after any cable work'],
          m: [['Δf / ΔV / Δφ at closing', '≤ 0.1–0.2 Hz, ≤ 5 %, ≤ ±10°']],
          a: ['Adjust governor / AVR set-points', 'Replace VT fuse / sync relay', 'Repair breaker closing circuit'] },
        ef: { t: 'Generator / bus earth fault alarm', c: ['Moisture in alternator (heater off on standby)', 'Cable / terminal insulation damage', 'Earth fault downstream on the bus (not in the generator)'],
          k: ['Check which bus section alarms; split the bus if possible', 'Megger alternator stator and main cable (isolated)', 'Use insulation monitor / portable fault finder on outgoing feeders'],
          m: [['Stator IR (corrected)', '> (kV + 1) MΩ; PI ≥ 2']],
          a: ['Dry out alternator; repair heater', 'Locate & repair downstream fault'] }
      }
    },
    vfd: {
      name: 'VFD / drive (maker-independent fault families)', icon: '🎛️', s: SAFE_VFD,
      sym: {
        oc: { t: 'Overcurrent trip', c: ['Acceleration ramp too short or high inertia', 'Mechanical jam / brake not released', 'Short circuit or earth fault in motor cable / motor', 'Wrong motor data / poorly tuned current controller', 'Output contactor opening / closing while running', 'Failed IGBT / current sensor'],
          k: ['Note: at start, during acceleration, at constant speed or decel?', 'Disconnect motor cable at drive and megger cable + motor (NOT the drive)', 'Check brake release and mechanical freedom', 'Check motor parameters and run motor identification', 'Check output contactor interlock'],
          m: [['Motor cable IR', '> 1 MΩ, typically ≫ 100 MΩ'], ['Motor winding balance', '< 2 %']],
          a: ['Lengthen ramps / increase current limit within motor rating', 'Repair cable / motor', 'Correct parameters', 'Replace power module only after cable/motor proved healthy'] },
        ov: { t: 'DC-bus over-voltage trip', c: ['Regenerative energy during deceleration or lowering (hoist, jacking, fan coasting)', 'Braking chopper / resistor failed or not enabled', 'Supply over-voltage or transients (capacitor switching)', 'Decel ramp too short'],
          k: ['Check when it trips (decel / lowering?)', 'Measure braking resistor resistance and check chopper fault', 'Check incoming voltage', 'Enable over-voltage controller or lengthen ramp'],
          m: [['Brake resistor value', 'Within ±10 % of nameplate'], ['DC bus at standstill', '≈ 1.35 × line voltage']],
          a: ['Increase decel time / enable OV control', 'Replace resistor / chopper', 'Fit active front end / regenerative unit for continuous regen'] },
        uv: { t: 'DC-bus under-voltage / supply phase loss', c: ['Supply dip (motor starting, generator transient)', 'Input fuse blown / phase loss', 'Loose input terminals', 'Pre-charge circuit or rectifier fault', 'DC-link capacitors aged'],
          k: ['Measure input phase voltages (all three)', 'Check input fuses and contactor', 'Check drive event log for supply dips', 'Check DC bus ripple'],
          m: [['Input voltage', 'Rated ±10 %, balanced'], ['DC bus', '≈ 1.35 × V_LL, low ripple']],
          a: ['Replace fuses / tighten terminals', 'Enable kinetic buffering / auto-restart if acceptable', 'Replace capacitors / pre-charge components'] },
        gf: { t: 'Earth fault / ground fault', c: ['Motor cable insulation failure', 'Moisture in motor / terminal box', 'Long motor cable – high capacitive leakage (nuisance)', 'Damaged output filter / sine filter'],
          k: ['Isolate, disconnect at drive, megger cable and motor separately', 'Check terminal box and glands for water', 'Check cable length vs drive limits / filter'],
          m: [['IR motor + cable', '> 1 MΩ']],
          a: ['Repair / dry insulation', 'Fit du/dt or sine filter for long cables', 'Adjust earth-fault sensitivity only per maker guidance'] },
        ot: { t: 'Drive over-temperature', c: ['Cooling fan failed', 'Blocked filters / heat sink fouled', 'Cooling water flow / temperature problem (liquid-cooled)', 'High ambient or switching frequency too high', 'Drive overloaded'],
          k: ['Check fans running and filters', 'Check cabinet air temperature and cooling water ΔT', 'Check load current vs rating', 'Reduce switching frequency'],
          m: [['Cabinet ambient', 'Within drive rating (often 40 °C, derate above)'], ['Heat-sink temperature', 'Below warning level']],
          a: ['Replace fan / filters, clean heat sink', 'Restore cooling water', 'Derate or upsize drive'] },
        comm: { t: 'Communication / fieldbus fault', c: ['Loose connector or damaged cable', 'Termination resistor missing / wrong', 'Wrong node address / baud rate after replacement', 'Controller (PLC) stopped or network switch failure', 'EMC – cable routed with power cables, screen not earthed'],
          k: ['Check status LEDs on drive and network module', 'Check termination and address', 'Check cable screen termination (360° gland)', 'Check PLC / switch status'],
          m: [['RS-485 / Profibus termination', '≈ 120 Ω / 220 Ω across data lines at each end (powered off)']],
          a: ['Re-make connectors, correct termination', 'Restore address / parameters', 'Re-route cable, earth screens properly'] },
        enc: { t: 'Encoder / speed feedback fault', c: ['Encoder cable damaged / connector loose', 'Encoder supply missing', 'Encoder coupling slip / bearing', 'Wrong pulses-per-rev parameter', 'Noise from unscreened cable'],
          k: ['Check encoder supply voltage', 'Check signal with scope / drive diagnostics while turning slowly', 'Check mechanical coupling'],
          m: [['Encoder supply', '5 V or 24 V ±5 %']],
          a: ['Replace cable / encoder', 'Correct PPR parameter', 'Improve screening'] },
        mol: { t: 'Motor overload (I²t) in drive', c: ['Mechanical overload', 'Motor parameter / thermal model wrong', 'Self-cooled motor at low speed', 'Brake dragging'],
          k: ['Compare output current with motor FLC', 'Check motor parameters', 'Check brake release / mechanical load'],
          m: [['Output current', '≤ motor FLC continuous']],
          a: ['Correct parameters', 'Reduce load or fit forced cooling', 'Repair brake'] }
      }
    },
    ups: {
      name: 'UPS system', icon: '🔋', s: 'A UPS output stays live on battery after the input is isolated. Isolate input, output, bypass AND battery; check for back-feed.',
      sym: {
        bypass: { t: 'UPS on bypass', c: ['Inverter overload / overtemperature', 'Inverter fault', 'Manual bypass switch selected', 'Output short circuit cleared on bypass'],
          k: ['Read UPS event log', 'Check load % and ambient temperature', 'Check maintenance bypass switch position'],
          m: [['Load', '≤ 80 % recommended']],
          a: ['Reduce load / restore cooling', 'Transfer back to inverter per maker procedure', 'Service inverter'] },
        batt: { t: 'Battery fault / short autonomy', c: ['Aged batteries (VRLA design life 3–5 or 10 years at 20–25 °C)', 'High battery temperature (life halves per +10 °C)', 'One weak block in the string', 'Loose / corroded inter-block links', 'Charger float voltage wrong'],
          k: ['Measure each block voltage on float and during a discharge test', 'Measure internal resistance / conductance of each block', 'Thermal-image connections', 'Check float voltage and temperature compensation'],
          m: [['Block float voltage (12 V VRLA)', '≈ 13.5–13.8 V at 20–25 °C, spread < ±0.2 V'], ['Internal resistance', '< 25–30 % above baseline']],
          a: ['Replace weak blocks / whole string if aged', 'Tighten / clean links', 'Correct charger settings'] },
        charger: { t: 'Rectifier / charger fault', c: ['Input supply out of tolerance', 'Input fuse blown', 'Rectifier module / fan failure', 'Over-temperature'],
          k: ['Check input voltage & frequency (generator vs shore)', 'Check fuses and fans', 'Event log'],
          m: [['Input voltage', 'Within UPS input window']],
          a: ['Restore supply / replace fuse', 'Replace module / fan'] },
        alarm: { t: 'Over-temperature / fan alarm', c: ['Fan failed', 'Room A/C failure', 'Filters blocked'],
          k: ['Check fans, filters, room temperature'], m: [['Room temperature', '20–25 °C for battery life']], a: ['Replace fans/filters, restore A/C'] }
      }
    },
    swbd: {
      name: 'Switchboard / ACB / MCCB', icon: '🔌', s: 'Main switchboard work needs bus isolation or a live-work permit with arc-flash PPE. Racked-out ACBs still have charged springs – discharge before handling.',
      sym: {
        noclose: { t: 'ACB will not close', c: ['Closing spring not charged (motor, limit switch, supply)', 'Under-voltage release not energised', 'Shunt trip permanently energised (protection relay / trip circuit)', 'Mechanical or electrical interlock (bus-tie, shore, generator)', 'Breaker not fully racked in (test/disconnected position)', 'Trip unit "ready" contact not made (tripped, needs reset)', 'Closing coil failed'],
          k: ['Check "spring charged" and "ready to close" indicators', 'Measure UV coil voltage', 'Check reset button / trip indicator', 'Check interlock conditions and PMS / synchroniser command', 'Measure closing coil supply when close is commanded', 'Attempt manual close (mechanical) only if procedure allows'],
          m: [['UV coil supply', 'Rated ±10 %'], ['Closing coil resistance', 'Finite, per datasheet'], ['Charging motor current', 'Runs and stops at limit']],
          a: ['Repair charging motor / limit switch', 'Restore UV supply / repair trip circuit', 'Replace coil', 'Clear interlock condition'] },
        notrip: { t: 'Breaker will not trip / open', c: ['Shunt trip coil open / no supply', 'Mechanism stiff (lack of lubrication, age)', 'Trip unit fault'],
          k: ['Test trip with push button and remote command', 'Measure shunt coil resistance & supply', 'Secondary injection test of trip unit'],
          m: [['Opening time', 'Per maker (typ. 30–60 ms)']],
          a: ['Replace coil / trip unit', 'Service mechanism (maker service kit)'] },
        nuisance: { t: 'Nuisance / unexplained trips', c: ['Settings too close to load / inrush (Ii, Isd)', 'Earth-fault setting too sensitive', 'High-resistance joint heating the trip unit', 'Harmonics affecting thermal / electronic trip', 'Under-voltage release dropping on voltage dips'],
          k: ['Read trip unit memory (L/S/I/G, current)', 'Compare settings with coordination study', 'Thermal-image connections under load', 'Check voltage dips at motor starts'],
          m: [['Connection temperature rise', '< 10–15 K above similar joints']],
          a: ['Correct settings per study', 'Re-torque / clean joints', 'Add UV time delay'] },
        hot: { t: 'Hot joint / busbar or cable lug overheating', c: ['Loose bolted joint / wrong torque', 'Oxidised contact surfaces', 'Undersized cable / overloaded circuit', 'Unbalanced load'],
          k: ['Thermal-image under load (> 40 % load)', 'Measure load current per phase', 'Ductor (micro-ohm) test after isolation'],
          m: [['ΔT vs similar component', '1–10 K monitor, 10–20 K repair soon, > 20 K urgent (typical IR-thermography guidance)']],
          a: ['Isolate, clean, re-torque to specified value', 'Replace damaged lugs / bolts', 'Re-balance or upsize'] }
      }
    },
    batt: {
      name: 'Battery & DC charger', icon: '🔋', s: 'Batteries cannot be isolated internally – use insulated tools, remove rings/watches, ventilate (hydrogen), wear eye protection.',
      sym: {
        low: { t: 'Low DC voltage / battery discharged', c: ['Charger failed or off', 'Charger current limit too low for load', 'Battery aged / failed cell', 'Excessive DC load or a DC earth fault'],
          k: ['Measure charger output voltage and current', 'Measure load current', 'Measure each cell / block voltage', 'Check DC earth-fault alarm'],
          m: [['Float voltage (lead-acid)', '2.23–2.27 V/cell (VRLA) at 20–25 °C'], ['NiCd float', '1.40–1.45 V/cell']],
          a: ['Repair charger', 'Replace weak cells / blocks', 'Remove fault / excess load'] },
        gassing: { t: 'Overcharging / gassing / hot battery', c: ['Float or boost voltage set too high', 'Temperature compensation missing', 'Charger stuck in boost', 'Shorted cell causing others to overcharge'],
          k: ['Measure charger float & boost voltages', 'Measure cell temperatures', 'Check ventilation fan'],
          m: [['Cell temperature', 'Close to ambient; > 10 K above = alarm']],
          a: ['Correct voltage / enable temp compensation', 'Replace shorted cell', 'Restore ventilation'] },
        dcearth: { t: 'DC earth fault alarm', c: ['Moisture in junction boxes / solenoid valves', 'Damaged cable on deck', 'Failed device (relay coil, sensor) with leakage to earth'],
          k: ['Read earth-fault meter: + or − pole to earth?', 'Isolate DC feeders one at a time (with permission – some are critical) until alarm clears', 'Megger the identified circuit with electronics disconnected'],
          m: [['Pole-to-earth voltage', 'Balanced ≈ half system voltage each when healthy']],
          a: ['Dry / repair junction box or device', 'Replace damaged cable'] }
      }
    },
    earth: {
      name: 'Insulation monitor alarm (IT system)', icon: '⏚', s: SAFE_LV,
      sym: {
        alarm: { t: 'Low insulation / earth fault alarm on 440 V or 230 V bus', c: ['Moisture / condensation in deck equipment (lights, heaters, motors) after rain or wash-down', 'Damaged cable', 'Heating elements with deteriorated insulation', 'Galley / laundry equipment'],
          k: ['Note insulation reading and time; check if it changed with weather or equipment switching', 'Check whether one phase voltage to earth is low (indicates faulted phase)', 'Use the insulation-monitor locator or portable fault finder if fitted', 'Otherwise switch off non-essential feeders one at a time (with permission) and watch the reading', 'When the feeder is found, isolate and megger each consumer'],
          m: [['Phase-to-earth voltages (IT 440 V)', 'Healthy ≈ 254 V each; faulted phase → low, others → up to 440 V'], ['Feeder IR', '> 1 MΩ (ship circuits)']],
          a: ['Repair / dry the faulty consumer', 'Record the fault in the log', 'Do not leave a first earth fault uncleared – a second fault on another phase causes a phase-to-phase short'] }
      }
    }
  };
  const list = arr => '<ol class="steps">' + arr.map(x => `<li>${esc(x)}</li>`).join('') + '</ol>';
  const calcs = Object.keys(KB).map(id => {
    const e = KB[id];
    const keys = Object.keys(e.sym);
    return {
      id, icon: e.icon, title: e.name, report: true,
      desc: 'Choose the symptom. You get the most likely causes (most likely first), an ordered check sequence, measurements with expected values and corrective actions. Add your findings and print a troubleshooting record.',
      inputs: [
        { k: 'sym', l: 'Symptom', opts: keys.map(k => [k, e.sym[k].t]), v: keys[0] },
        { k: 'tag', t: 'text', l: 'Equipment / tag', v: '' },
        { k: 'date', t: 'date', l: 'Date', v: '' },
        { k: 'find', t: 'area', l: 'Findings / readings taken (optional – appears on the printed record)', v: '', rows: 3 },
        { k: 'act', t: 'area', l: 'Action taken / result (optional)', v: '', rows: 2 }
      ],
      run: v => {
        const s = e.sym[v.sym];
        let h = ETO.reportHead('Troubleshooting record – ' + e.name, [['Equipment / tag', v.tag], ['Symptom', s.t], ['Date', v.date]]);
        h += `<h3>1 · Most likely causes</h3>${list(s.c)}<h3>2 · Check sequence</h3>${list(s.k)}`;
        h += `<h3>3 · Measurements & expected values</h3><table class="rt"><thead><tr><th>Measurement</th><th>Expected / healthy</th></tr></thead><tbody>${s.m.map(r => `<tr><td><span class="kb">${esc(r[0])}</span></td><td><span class="kb">${esc(r[1])}</span></td></tr>`).join('')}</tbody></table>`;
        h += `<h3>4 · Corrective actions</h3>${list(s.a)}`;
        if (v.find) h += `<h3>Findings</h3><p style="white-space:pre-wrap">${esc(v.find)}</p>`;
        if (v.act) h += `<h3>Action taken / result</h3><p style="white-space:pre-wrap">${esc(v.act)}</p>`;
        h += '<div class="sign"><div>ETO signature</div><div>Chief Engineer</div></div>';
        return { head: '<span></span>', verdict: { s: 'warn', t: '🦺 ' + esc(e.s) }, html: h, notes: ['Generic guidance – always follow the equipment manual, the vessel\'s safety management system and permit-to-work.'] };
      }
    };
  });
  ETO.page({
    title: 'Troubleshooting Assistant', icon: '🩺', accent: '#dc2626',
    subtitle: 'Equipment → symptom → likely causes → ordered checks → measurements → corrective action. Maker-independent, field-proven fault-finding logic.',
    refs: ['Maker-independent', 'Safe isolation first', 'Printable record'],
    calcs
  });
})();
