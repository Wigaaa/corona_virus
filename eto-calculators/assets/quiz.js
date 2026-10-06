/* Quick-quiz questions for the guides: [question, [A, B, C, D], correct index, explanation] */
window.ETO_QUIZ = window.ETO_QUIZ || {};
window.ETO_QUIZ = window.ETO_QUIZ || {};
Object.assign(window.ETO_QUIZ, {
  pmsguide: [
    ["Which typical load level triggers a PMS load-dependent start of the next standby generator?",
      ["Approx. 40-60 % of online capacity", "Approx. 80-90 % of online capacity", "Approx. 100-105 % of online capacity", "Approx. 60-70 % of online capacity"], 1,
      "The guide gives a typical load-dependent start setting of about 80-90 % of online capacity with a 5-30 s delay."],
    ["Generators keep starting and stopping repeatedly. What is the most likely cause?",
      ["Start and stop limits too close or delays too short", "Reverse power relay set too low on one set", "Synch-check relay window set too wide", "Dead-bus confirmation time set too long"], 0,
      "A dead band between start and stop limits plus time delays prevents hunting; limits too close or short delays cause it."],
    ["During blackout recovery, how many generator breakers may close onto the dead bus at once?",
      ["All standby sets that reached rated speed", "Two sets, one per bus section", "Only one, interlocked against a second closing", "None until the emergency generator disconnects"], 2,
      "Only one breaker may close on a dead bus; the others then synchronise normally to the live bus."],
    ["Which condition stops a generator from being counted as available standby?",
      ["Engine preheated and LO priming running", "Breaker racked in and spring charged", "Selected to AUTO / remote mode", "Selector left in local or manual position"], 3,
      "A set in manual or local is not a standby, a common hidden reason for failed blackout recovery."],
    ["What is the main defence against a cascade blackout when a generator trips on a DP or diesel-electric vessel?",
      ["Starting the next standby generator", "Fast load reduction / thruster phase-back", "Opening the shore connection breaker", "Raising the frequency set-point"], 1,
      "Fast load reduction is much faster than starting a standby set, so it is the main defence against cascade blackout."],
    ["Sets share kW equally but show unequal current and power factor. What should you check first?",
      ["Governor droop settings and actuators", "Load-dependent start delays", "AVR droop settings and droop CT wiring", "Preferential trip stage timers"], 2,
      "Unequal kVAr at equal kW points to AVR droop settings and CT wiring or polarity."],
    ["Why may automatic recovery fail even when a standby set is healthy and in AUTO?",
      ["Bus-tie breaker was closed before the blackout", "Load-dependent stop limit set too high", "Spinning reserve was larger than needed", "PMS 24 V DC supply was lost in the blackout"], 3,
      "Loss of the PMS / genset controller 24 V DC supply during a blackout can stop recovery."],
    ["How should you prepare before working on a generator or its breaker that the PMS can control?",
      ["Put it in local / blocked, isolate starting system, rack out breaker, apply LOTO", "Leave it in AUTO but lower its standby priority to last", "Set the PMS to semi-auto and inform the bridge", "Open the bus-tie so the set is on its own section"], 0,
      "PMS commands can start engines and close breakers remotely, so local/blocked, isolation, rack-out and LOTO are required."]
  ],
  dieselgen: [
    ["What is the typical overspeed shutdown setting for a diesel generator?",
      ["About 103-105 % rated speed", "About 125-130 % rated speed", "About 110-115 % rated speed", "About 95-100 % rated speed"], 2,
      "The guide lists overspeed shutdown at typically 110-115 % rated speed."],
    ["A self-excited generator runs at rated speed but builds no voltage after a long lay-up. What is a likely cause?",
      ["Loss of residual magnetism", "Governor droop set too high", "Reverse power relay tripped", "Space heater left switched on"], 0,
      "A self-excited alternator relies on residual magnetism; field flashing per maker restores it."],
    ["In a brushless alternator, what feeds DC to the main rotor field?",
      ["Slip rings and carbon brushes from the AVR", "The PMG mounted on the stator frame", "The varistor across the main stator", "The rotating diode bridge rectifying exciter output"], 3,
      "The exciter armature output is rectified by the rotating diode bridge on the shaft and feeds the main field."],
    ["Within what time must the emergency generator start and connect to the ESB under SOLAS?",
      ["30 seconds", "45 seconds", "60 seconds", "90 seconds"], 1,
      "SOLAS requires automatic start and connection to the emergency switchboard within 45 seconds."],
    ["What typical air gap does the guide give for a magnetic speed pickup on the flywheel teeth?",
      ["0.1-0.2 mm", "2-3 mm", "0.5-1 mm", "5-10 mm"], 2,
      "The speed pickup air gap is typically 0.5-1 mm."],
    ["One generator trips on reverse power. Which cause is most likely?",
      ["Fuel starvation or a governor / actuator fault", "Wrong AVR droop CT polarity", "Space heaters left on while running", "Overspeed trip set too low"], 0,
      "Reverse power means the set is motoring, typically from fuel starvation or a governor / actuator fault."],
    ["Why is the non-drive-end bearing of an alternator often insulated?",
      ["To reduce bearing noise", "To allow faster bearing changes", "To protect the RTD wiring", "To stop shaft currents through the bearing"], 3,
      "The insulated NDE bearing stops shaft currents; the insulation must not be bridged."],
    ["What typical speed droop does the guide give for kW sharing between governors?",
      ["0.5-1 %", "3-5 %", "8-15 %", "10-20 %"], 1,
      "kW sharing by speed droop is typically 3-5 %."]
  ],
  switchboards: [
    ["Most ship LV systems are insulated neutral (IT). What happens on a single earth fault?",
      ["The feeder breaker trips instantly", "The generator breaker trips on overcurrent", "Nothing trips; the IMD alarms and services keep running", "The bus-tie opens to split the board"], 2,
      "In an IT system a single earth fault does not trip, so essential services keep running while the IMD alarms."],
    ["Why must the first earth fault on an IT system be located and cleared quickly?",
      ["A second fault on another phase becomes a phase-to-phase short circuit", "The IMD will stop working after a few hours", "The emergency generator will be blocked from starting", "The preferential trip will shed all non-essential loads"], 0,
      "A second earth fault on another phase turns into a phase-to-phase short circuit and a large trip."],
    ["An ACB will not close. Which of these is a typical cause listed in the guide?",
      ["Feeder IR value too high", "Closing spring not charged or UV release not energised", "IMD reading in the normal range", "Bus-tie breaker already open"], 1,
      "Spring not charged, undervoltage release not energised, interlocks or check-sync blocking stop a breaker closing."],
    ["What is the correct rule for instrument transformer secondaries?",
      ["CT - do not short, VT - do not open", "Both may be opened if the meter is removed", "Both must always be shorted before work", "VT - do not short, CT - do not open"], 3,
      "A VT secondary must not be shorted and a loaded CT secondary must never be open-circuited."],
    ["In which racking position can a breaker be function-tested without energising the feeder?",
      ["Connected / Service", "Test position", "Removed from the cubicle", "Any position with the door open"], 1,
      "In Test the main contacts are out but the control circuit is connected for closing / tripping tests."],
    ["On a 60 Hz ship connected to 50 Hz shore power, what does the guide say about motors?",
      ["They run about 17 % slower and voltage must be reduced proportionally", "They run about 17 % faster and voltage must be raised", "Speed is unchanged because the voltage is the same", "They run 50 % slower and must be stopped"], 0,
      "On 50 Hz motors run about 17 % slower; voltage must be reduced proportionally (V/f) to avoid over-fluxing."],
    ["Under what condition should thermography of switchboard joints be carried out?",
      ["With the board de-energised and cool", "Only during a blackout test", "Only at no load to avoid false readings", "With the board loaded, typically at least 40 % load"], 3,
      "Thermography must be done with the board loaded, typically at least 40 % load, comparing similar phases."],
    ["After a blackout the ESB does not take load. Which cause does the guide list first?",
      ["Shore breaker interlock active", "Preferential trip stage 1 operated", "Emergency generator left in MANUAL", "IMD alarm on the 230 V system"], 2,
      "An emergency generator in MANUAL, start failure or low battery are typical causes of the ESB not taking load."]
  ],
  upsguide: [
    ["Which UPS topology is the normal choice for critical loads such as IAS, PMS and DP?",
      ["Offline / standby (VFD)", "Line-interactive (VI)", "Online double conversion (VFI)", "Ferro-resonant standby"], 2,
      "Online double conversion has no break because the inverter already supplies the load."],
    ["A UPS is running on static bypass. What does this mean for the load?",
      ["It is on raw supply with no battery protection", "It is on battery with full autonomy", "It is fed by the inverter with reduced output", "It is isolated and safe for maintenance"], 0,
      "On static bypass the load is on raw supply; a blackout now drops the load, so treat it as degraded."],
    ["Why must lead-acid and NiCd batteries never share a room, tools or hydrometers?",
      ["Their cell voltages are different", "Acid and alkaline electrolytes neutralise and destroy each other", "NiCd cells emit more hydrogen than lead-acid", "Their chargers interfere with each other"], 1,
      "The acid and alkaline electrolytes neutralise and destroy each other."],
    ["Where must the charger temperature-compensation sensor be installed?",
      ["Inside the charger cabinet", "In the battery room ventilation outlet", "On the DC distribution board", "On the battery itself"], 3,
      "The sensor must be on the battery, not in the charger cabinet, or compensation will be wrong."],
    ["Below what capacity is a battery commonly replaced according to the guide?",
      ["Below about 95 % of rated", "Below about 80 % of rated", "Below about 50 % of rated", "Below about 30 % of rated"], 1,
      "Capacity below about 80 % of rated is a common replacement criterion."],
    ["Why is the battery room ventilation outlet placed at the top of the room?",
      ["Hydrogen is lighter than air and collects at the top", "Electrolyte vapour is heavier than air", "Heat from the charger rises to the ceiling", "Class rules forbid low-level openings"], 0,
      "Hydrogen is lighter than air and explosive between about 4 % and 75 %, so it is vented from the top."],
    ["Which test is the only reliable way to know a UPS battery's real autonomy?",
      ["Measuring float voltage per block", "Checking specific gravity of a NiCd cell", "A capacity / discharge test", "Reading the charger output current"], 2,
      "The guide stresses that only discharge tests show real autonomy."],
    ["What is the risk of a second earth fault on the other pole of an insulated DC system?",
      ["The charger automatically switches to boost", "The UPS transfers to static bypass", "Battery capacity drops by half", "A short circuit and false operation of control circuits"], 3,
      "A second fault on the other pole is a short circuit and can energise relays falsely."]
  ],
  lightingguide: [
    ["Why are lights in machinery spaces and corridors split over at least two final circuits?",
      ["To reduce cable voltage drop", "So one tripped MCB does not darken the space", "To balance load on the generators", "To allow dimming at night"], 1,
      "Splitting over two circuits ensures loss of one final circuit does not leave a space in darkness."],
    ["What does transitional (battery) lighting do?",
      ["Bridges the gap until the emergency generator takes the load", "Replaces the emergency generator on all ships", "Provides lighting only during dry dock", "Supplies navigation lights in port"], 0,
      "Transitional lighting covers the period until the emergency generator is on load."],
    ["A self-contained emergency fitting is permanently lit on battery. What is the likely cause?",
      ["The battery is fully charged", "The LED driver has failed", "Lost permanent supply to the fitting", "The auto-test is in progress every minute"], 2,
      "A fitting lit permanently on battery has lost its permanent (unswitched) supply and will discharge."],
    ["After retrofitting LED nav lanterns, failed lights are not alarmed. What is the probable reason?",
      ["The panel cannot detect the low LED current", "LED lanterns never fail", "The emergency supply is disconnected", "The MCB curve is too slow"], 0,
      "The panel failure detection must suit the low LED current; use type-approved compatible lanterns and panels."],
    ["What is the main source of earth faults on ship lighting systems according to the guide?",
      ["LED driver harmonics", "Overloaded lighting transformers", "Wrong MCB curves", "Water ingress into deck fittings and junction boxes"], 3,
      "Water ingress into deck fittings is the main source of earth faults; maintain gaskets and glands."],
    ["MCBs trip when a circuit of new LED fittings is switched on. What is the likely cause?",
      ["Low power factor of the drivers", "Capacitive driver inrush with too many fittings per circuit", "Wrong colour temperature", "Photocell failure"], 1,
      "Capacitive LED drivers give high inrush, so too many fittings per MCB can cause trips."],
    ["What colour are helideck perimeter lights?",
      ["Red", "White", "Amber", "Green"], 3,
      "Perimeter lights are green and define the landing area edge at night."],
    ["What must an Ex lighting fitting be certified for?",
      ["IP rating and colour temperature only", "Voltage and lumen output only", "Zone, gas group and temperature class", "Supply type and switch type"], 2,
      "Ex fittings must be certified for the zone, gas group and temperature class of the area."]
  ],
  indcomms: [
    ["With power off, you measure about 120 ohms between A and B on an RS-485 line. What does it indicate?",
      ["Both terminators correctly fitted", "Three terminators fitted", "One terminator missing", "The cable is short-circuited"], 2,
      "About 60 ohms means two terminators; 120 ohms means one is missing."],
    ["Which TCP port does Modbus TCP use?",
      ["502", "44818", "2222", "80"], 0,
      "Modbus TCP uses TCP port 502."],
    ["A Modbus slave replies with exception code 02. What does it mean?",
      ["Slave device failure", "Illegal data address", "Illegal function", "Slave busy"], 1,
      "Exception 02 is illegal data address, often a wrong register map or offset."],
    ["What is the standard NMEA 0183 baud rate under IEC 61162-1?",
      ["9600 baud", "38 400 baud", "19 200 baud", "4800 baud"], 3,
      "Standard is 4800 baud; 38 400 baud is the high-speed IEC 61162-2 variant."],
    ["After replacing a PROFINET device the controller cannot connect. What is the most likely mistake?",
      ["The same device name was not assigned", "The cable colour is green", "Termination resistors were not fitted", "The baud rate was not set to 4800"], 0,
      "PROFINET identifies devices by device name; the replacement must get the same name, not just the IP."],
    ["What is the expected resistance between A and B at an end connector of a PROFIBUS DP segment (power off, terminators on)?",
      ["About 60 ohms", "About 120 ohms", "About 110 ohms", "About 40 ohms"], 2,
      "Two 220 ohm terminators in parallel give about 110 ohms."],
    ["On a CAN bus, which statement about arbitration is correct?",
      ["The node with the highest address always wins", "The master polls each node in turn", "Collisions are resolved by random back-off", "The lower identifier wins arbitration without collisions"], 3,
      "CAN is multi-master with message priority by identifier; the lower ID wins."],
    ["How many NMEA 0183 talkers may be connected on one line?",
      ["Up to 10", "Only one; combine sources with a multiplexer", "Up to 32", "Any number if terminated"], 1,
      "Only one talker per line is allowed; a multiplexer combines sources."]
  ]
});
window.ETO_QUIZ = window.ETO_QUIZ || {};
Object.assign(window.ETO_QUIZ, {
  dpsystem: [
    ["What does DP 3 require beyond DP 2?", ["Loss of any one compartment by fire or flood must not cause loss of position", "At least two independent joysticks on the main bridge console", "A taut wire system as one of the position references", "Closed bus operation with all bus-tie breakers kept closed"], 0, "DP 3 adds fire/flood (A60 / watertight) separation so losing one compartment does not lose position."],
    ["Why do DP2 / DP3 vessels normally fit three gyros and three MRUs?", ["Three units give a faster heading update rate to the controller", "With three, median voting can identify and reject the faulty one", "Class requires one sensor for each switchboard section in use", "Two sensors cannot be powered from separate UPS supplies"], 1, "With two sensors the DP only sees disagreement; three allow it to reject the one that differs."],
    ["How many position references should be simultaneously available on DP2 / DP3?", ["Two, provided both are DGNSS receivers", "Two, one absolute and one relative reference", "At least three, not all based on the same principle", "At least four, including one acoustic system"], 2, "The guide states at least three references, not all using the same principle."],
    ["Which thruster failure mode is described as the most dangerous?", ["Fail to zero thrust", "Fail as set (frozen command)", "Loss of thruster feedback signal", "Fail to full thrust or wrong direction"], 3, "Failure to full thrust or wrong direction causes drive-off and needs a fast thruster emergency stop."],
    ["A position jumps every time the vessel changes heading. What is a likely cause?", ["DGNSS correction subscription has expired", "Wrong lever-arm offsets for the antenna or transducer", "Wind sensor shadowed by the helideck structure", "Too few generators online for the thrust demand"], 1, "Incorrect lever-arm offsets cause position jumps when the heading changes."],
    ["What is the typical minimum battery autonomy for DP UPS units stated in the guide?", ["10 minutes", "15 minutes", "30 minutes", "60 minutes"], 2, "The guide gives UPS autonomy of at least 30 minutes per redundancy group."],
    ["An earth fault appears on a DP-related supply during operations. What should the ETO do?", ["Isolate the faulty feeder at once to protect the switchboard", "Ignore it until the DP operation has been completed", "Reset the insulation monitor and log the alarm only", "Locate it with care and isolate only with DPO agreement and ASOG check"], 3, "Earth faults on DP-critical systems are located carefully and isolated only with DPO agreement."],
    ["What does the ASOG Yellow alert status require?", ["Stop the activity and prepare to move to a safe position", "Continue normally while informing the client of the trend", "Abort immediately and disconnect from the installation", "Carry out a risk assessment and continue the task"], 0, "Yellow means degraded: stop the activity and prepare to move to safe position."]
  ],
  thrusterguide: [
    ["How is thrust varied on a CP (controllable pitch) thruster?", ["By varying the motor speed with a VFD", "The motor runs at constant speed and blade pitch is varied hydraulically", "By changing the azimuth angle of the unit only", "By switching the motor between star and delta"], 1, "On CP thrusters the motor runs at constant speed and pitch is changed hydraulically."],
    ["Which is a key disadvantage of a constant-speed CP thruster compared with FP on a VFD?", ["Slow response because pitch changes are limited by the drive", "Large harmonic distortion during normal running", "Significant losses at zero thrust because the motor runs at full speed", "It cannot be started without an active front end"], 2, "At zero pitch the CP motor still runs at full speed, giving significant zero-thrust losses."],
    ["What must be true before a CP thruster motor can start?", ["Pitch must be at zero (zero-pitch start interlock)", "Pitch must be set to full ahead for cooling flow", "The shaft brake must be applied during the start", "DP must already be in control of the thruster"], 0, "A zero-pitch start interlock requires pitch at zero before starting."],
    ["A thruster start request is refused. What is the most likely cause per the guide?", ["Water in oil alarm active", "Slip ring brushes worn", "Pitch feedback potentiometer fault", "Not enough available power or PMS blocking the start"], 3, "Start refusal is typically due to insufficient power, PMS blocking or wrong control location."],
    ["Why are PM thruster motors a particular hazard during maintenance?", ["They store energy in the DC link permanently", "They generate voltage whenever the propeller turns, e.g. by windmilling", "They cannot be isolated at the main breaker", "Their bearings are always insulated from earth"], 1, "A windmilling propeller can drive a PM motor as a generator, producing voltage."],
    ["What should be done before resetting a drive after a thruster trip?", ["Change the trip settings to avoid a repeat", "Power down the drive to clear the memory", "Save the alarm history and drive fault log", "Bypass the PMS permission to restart quickly"], 2, "The guide says to record the alarm history and fault log before resetting."],
    ["What is the purpose of the seal header (gravity) tank on a thruster?", ["Store hydraulic oil for the pitch system", "Supply cooling water to the VFD", "Provide lube oil to the steering motors", "Keep seal oil pressure above sea pressure"], 3, "The header tank keeps seal oil pressure above sea pressure to keep water out."],
    ["What usually happens when a thruster shows an azimuth or pitch follow-up error in DP?", ["The DP system may deselect the thruster", "The main breaker trips instantly", "The thruster goes to full thrust", "The PMS starts a standby generator"], 0, "Follow-up errors raise an alarm and DP may deselect the thruster."]
  ],
  jackingguide: [
    ["What is Rack Phase Difference (RPD)?", ["The speed difference between legs during jack-up", "The difference in vertical position between the racks of the chords of one leg", "The phase angle between motor current and voltage", "The difference between preload and storm leg load"], 1, "RPD is the vertical position difference between chord racks of one leg, indicating leg bending."],
    ["Why are jacking motors run in closed-loop vector / torque control?", ["To give full torque at zero speed so the load is held before the brake opens", "To allow the motors to run without encoders", "To reduce harmonics on the main switchboard", "To let the motors run above rated speed"], 0, "Full torque at zero speed is essential to hold the load before brake release."],
    ["What happens to the jacking motors during jack down?", ["They draw maximum current from the switchboard", "They are disconnected and only brakes are used", "They act as generators and feed energy back into the DC bus", "They run at constant speed with no load"], 2, "When lowering, motors regenerate energy into the DC bus."],
    ["A DC bus overvoltage trip occurs during jack down. What is a likely cause?", ["Worn brake linings on one motor", "Low hydraulic oil level in the HPU", "An encoder cable fault on a single chord", "Brake chopper or resistor failure"], 3, "Without a working chopper/resistor, regenerated energy raises the DC bus voltage and trips the drive."],
    ["Why is preload done with the hull at minimum air gap?", ["To reduce the electrical load on the generators", "So a punch-through lets the hull settle in the water and limits damage", "Because the jacking motors cannot lift the hull higher during preload", "To allow the raw water pumps to stay submerged"], 1, "Minimum air gap means the hull settles into the water if a leg punches through."],
    ["What does a spring-applied jacking motor brake do on loss of power or E-stop?", ["Releases so the leg can move freely", "Holds only if the drive keeps torque applied", "Applies automatically – all brakes are fail-safe", "Switches to hydraulic release mode"], 2, "Brakes are fail-safe spring-applied, so power loss or E-stop applies all brakes."],
    ["How is a static brake holding test typically performed?", ["The drive applies a defined torque against the closed brake and checks for encoder movement", "The brake is released and the motor speed is measured", "The brake coil resistance is measured with a multimeter", "The leg is jacked at full speed and stopped by E-stop"], 0, "The drive applies torque against the closed brake; encoder movement indicates slip."],
    ["Which lesson does the guide give about jack-house electrical faults?", ["Most faults start with overloading of the gearboxes", "Most faults are caused by PLC software errors", "Most faults are caused by wrong drive parameters", "Keep the jack-house dry and heated – most faults start with moisture"], 3, "The guide states most electrical faults start with moisture, so keep the jack-house dry and heated."]
  ],
  rawwater: [
    ["Why are raw water pumps needed when a jack-up is elevated?", ["Sea chests are in the air and a surface pump cannot lift water that high", "Sea chest pumps are not allowed by class when elevated", "The hull pumps are needed for preload only", "Elevated units must use fresh water for cooling"], 0, "Once elevated, sea chests are out of the water and suction lift is far too great."],
    ["How is a submersible pump motor cooled?", ["By a separate fresh water cooling jacket", "By forced air from a deck fan through the riser", "By the water flowing past it, often needing a minimum velocity", "By oil circulation from the deck HPU"], 2, "Submersible motors are cooled by water flowing past them; makers often require minimum flow."],
    ["Why is star-delta starting not normally used for submersible motors?", ["It causes too much water hammer in the riser", "Most submersible motors have only three leads brought up", "Class rules forbid it for fire pumps", "It cannot be combined with a non-return valve"], 1, "Star-delta needs six leads, but most submersible motors have three."],
    ["A submersible pump trips on underload / dry-run. What should be checked first?", ["Phase rotation at the starter", "Overload relay setting against the nameplate", "VFD output filter condition", "Water level against air gap, strainer DP and discharge valves"], 3, "Underload typically means loss of water: low level, blocked intake or closed discharge."],
    ["How should IR readings of submersible motors be evaluated?", ["Compare trends under similar conditions rather than single values", "Accept any reading above 1 megohm as good", "Compare only with the factory test value", "Measure only with the motor running"], 0, "Readings vary with cable length and temperature, so trends under similar conditions are used."],
    ["What do ESD cause-and-effect matrices normally do with fire pumps?", ["Trip all fire pumps immediately", "Fire pumps are normally not tripped by ESD", "Start the emergency fire pump only", "Switch fire pumps to local control"], 1, "Fire pumps are normally not tripped by ESD; other raw water pumps may be."],
    ["Which gas hazard is specific to electro-chlorination (MGPS) in caissons?", ["Carbon monoxide from the rectifier", "Methane from the sea water intake", "Hydrogen produced by the electrolysis cell", "Nitrogen from accumulator precharge"], 2, "Electro-chlorination produces hydrogen, needing degassing and ventilation interlocks."],
    ["IR is falling on a submersible pump. How do you find whether the cable or motor is faulty?", ["Run the pump and watch the IMD reading", "Increase the test voltage until breakdown", "Measure winding resistance at the starter only", "Split test at the junction box, cable and motor separately"], 3, "Separating motor and cable at a junction box shows which part is faulty."]
  ],
  jetting: [
    ["What is the main purpose of a jack-up leg jetting system?", ["To help pull legs out of soft, sticky seabed by breaking suction", "To increase leg penetration during preload", "To cool the spud-can during jacking", "To supply fire water to the legs"], 0, "Jetting mainly assists leg extraction by relieving suction under the spud-can."],
    ["What do the bottom nozzles on the spud-can mainly do?", ["Loosen soil lying on top of the can", "Flush the leg piping after use", "Break suction under the can", "Measure soil pressure"], 2, "Bottom nozzles break suction; top nozzles loosen soil on top of the can."],
    ["Why are check valves essential in the jetting lines?", ["They limit jetting pressure at the nozzles", "They stop mud and soil entering the pipe when jetting is off", "They allow reverse flushing from the seabed", "They balance flow between the legs"], 1, "Check valves prevent soil ingress; a mud-filled leg line is hard to clear."],
    ["What provides the main pull-out force during leg extraction?", ["The jetting pump pressure", "The jacking motor brakes", "The preload ballast water", "Hull buoyancy"], 3, "The hull is jacked down to achieve buoyancy, which provides the main pull-out force."],
    ["Jetting shows high pressure but low flow. What is a likely cause?", ["Worn pump impeller", "Air in the suction line", "Blocked nozzles or a closed leg valve", "Open relief or bypass valve"], 2, "High pressure with low flow points to a restriction such as blocked nozzles or a closed valve."],
    ["What margin does the guide suggest keeping on online generator capacity during extraction?", ["About 5 % typical", "Around 15–20 % typical", "About 40 % typical", "No margin is needed with PMS"], 1, "The simple load check keeps a margin of often around 15–20 %."],
    ["How should large jetting and jacking motors be started?", ["One at a time, letting voltage and frequency recover", "All together to shorten the extraction window", "Relying on load-dependent generator start", "Only via DOL to get full torque quickly"], 0, "Start generators first and start large motors one at a time."],
    ["Is jetting normally done during preload?", ["Yes, it always speeds up preload", "Yes, to prevent punch-through", "Only on hard sand or rock sites", "Normally not – it could cause uncontrolled penetration"], 3, "Reducing soil strength under a loaded can could cause uncontrolled penetration."]
  ],
  craneguide: [
    ["At what levels does a typical LMI / SLI warn and cut out?", ["About 90 % warning and cut-out at 100 %", "About 75 % warning and cut-out at 90 %", "About 100 % warning and cut-out at 110 %", "About 50 % warning and cut-out at 80 %"], 0, "The guide states warning at about 90 % and cut-out of moment-increasing motions at 100 %."],
    ["What is the function of MOPS?", ["Automatic release of the hoist under gross overload", "Operator-initiated release of the load in an emergency, e.g. hook snagged", "Monitoring of boom angle limits", "Stopping the hoist before the hook hits the boom tip"], 1, "MOPS lets the operator release the load, e.g. when snagged on a supply vessel."],
    ["What does the rig saver (air-intake shut-off valve) on a diesel crane do?", ["Reduces engine speed under high load", "Prevents exhaust sparks in hazardous areas", "Closes on overspeed or gas detection to stop a runaway engine", "Shuts off fuel when oil pressure is low"], 2, "It closes the air intake so the engine cannot run away on gas."],
    ["An earth fault appears whenever the crane slews. What is a likely cause?", ["Wrong star-delta timer setting", "LMI angle sensor drift", "Pump destroke valve fault", "Slip ring contamination or moisture"], 3, "Slip ring carbon dust and moisture commonly cause earth faults during slewing."],
    ["An all-electric crane with AFE regenerates while the ship load is low. What may happen?", ["Generators may see reverse power", "Brake resistors overheat", "Slip rings lose contact", "The LMI cuts out"], 0, "AFE returns energy to the switchboard, so generators may see reverse power at low load."],
    ["How are hydraulic crane brakes normally designed?", ["Hydraulically applied, spring released", "Spring-applied, hydraulically released (fail-safe)", "Electrically applied and released", "Applied only by the operator joystick"], 1, "Brakes apply on loss of pressure, making them fail-safe."],
    ["An HPU motor trips on start. Which check is relevant?", ["Wire rope wear", "Anemometer calibration", "Pump destroke valve and starter timing", "Radio remote battery"], 2, "Pumps not unloaded or wrong star-delta timing cause start trips."],
    ["What is the typical periodic load test interval for cranes per the guide?", ["Every year", "Every 2 years", "Every 10 years", "Every 5 years"], 3, "The typical periodic re-test interval is 5 years, plus after major repair or modification."]
  ]
});
window.ETO_QUIZ = window.ETO_QUIZ || {};
Object.assign(window.ETO_QUIZ, {
  pumps: [
    ["Why must a positive displacement pump have a relief valve?", ["Against a closed valve it builds pressure until something breaks", "It prevents the pump from losing its prime at start", "It limits the starting current of the motor", "It stops cavitation at the impeller eye"], 0, "A PD pump moves a fixed volume per revolution, so a closed discharge raises pressure without limit."],
    ["For a centrifugal pump, when is the motor load highest?", ["Running against a closed discharge valve", "At maximum flow and low head, such as a broken pipe", "At minimum speed on a VFD", "During priming with the suction closed"], 1, "Centrifugal pump power rises with flow, so the highest load is at maximum flow and low head."],
    ["Using the affinity laws, what is the ideal shaft power of a centrifugal pump at 80 % speed?", ["About 80 %", "About 64 %", "About 51 %", "About 40 %"], 2, "Power varies with speed cubed: 0.8 cubed is about 0.51."],
    ["A pump makes a gravel-like noise and its current is unstable and lower than normal. What is the most likely cause?", ["Wrong overload relay setting", "Single phasing of the motor", "Misaligned coupling", "Cavitation from low suction pressure"], 3, "Cavitation gives a gravel sound and fluctuating, lower current, often from blocked suction or low tank level."],
    ["After a motor replacement a centrifugal pump gives low pressure. What should be checked first?", ["The direction of rotation", "The anti-condensation heater", "The thermistor relay setting", "The VFD skip frequencies"], 0, "A centrifugal pump running backwards still gives some pressure, which can mislead for weeks."],
    ["What is the typical starting current of a DOL-started pump motor?", ["About 1/3 of rated current", "Roughly 5 to 8 times rated current", "Close to rated current", "About 2 to 4 times rated current"], 1, "DOL starting draws roughly 5 to 8 times rated current."],
    ["How should a standby pump started alarm be treated?", ["Acknowledge it, since the standby is doing its job", "Swap duty and standby and reset the alarm", "As a fault until the cause is known", "Raise the pressure switch set-point"], 2, "The cause of the standby start must be investigated, not just acknowledged."],
    ["Why are essential pumps restarted sequentially after a blackout?", ["To give the operator time to select duty and standby", "To let the pumps prime one after another", "To allow the IAS to reload its parameters", "So the generators are not overloaded by simultaneous starts"], 3, "Restart groups with delays prevent all motors starting together on the restored generators."]
  ],
  valves: [
    ["What happens to a standard electric valve actuator on loss of power?", ["The valve fails closed by spring", "The valve stays where it is, held by the self-locking worm gear", "The valve fails open by battery back-up", "The valve moves to mid position"], 1, "The standard electric actuator is fail-as-is because its worm gear is self-locking."],
    ["What is the most common type of remote-controlled valve in ballast and sea water systems?", ["Butterfly valve", "Gate valve", "Globe valve", "Ball valve"], 0, "The butterfly valve is quarter-turn, compact, low torque and the most common remote valve."],
    ["In a central HPU system, what stores energy for valve operation if the pumps stop?", ["The solenoid valve cabinet", "The relief valve", "The nitrogen pre-charged accumulators", "The hydraulic oil tank"], 2, "Accumulators store energy for valve operation and reduce pump starts."],
    ["All hydraulic valves on a ship become slow at the same time. Which is a likely cause?", ["A burnt solenoid coil on one valve", "A maladjusted limit switch", "Phase rotation reversed on one actuator", "Low HPU pressure or lost accumulator pre-charge"], 3, "A common fault affecting all valves points to the HPU, its pumps, oil level or accumulators."],
    ["What fail mode is typical for a fuel tank outlet valve?", ["Fail open", "Fail last position", "Fail closed", "Fail to mid travel"], 2, "Fuel tank outlets are fail closed to prevent fuel release on failure."],
    ["The mimic shows both open and closed limit signals on a deck valve. What is a likely cause?", ["Wrong torque switch setting", "Low instrument air pressure", "Accumulator pre-charge lost", "Short circuit or water ingress in a junction box"], 3, "Both or neither signals usually indicate a cable short, water ingress or a failed sensor."],
    ["What is the most common cause of trouble with pneumatic valve actuators?", ["Poor instrument air quality with water, oil or rust", "Wrong phase rotation", "Worn worm gear", "Low HPU oil level"], 0, "Contaminated instrument air causes sticky solenoid valves and positioners."],
    ["Why should stroke times of remote valves be recorded?", ["Class requires a fixed stroke time for every valve", "A slowly increasing stroke time warns of valve or actuator problems", "They are used to set the overload relay", "They determine the fail-safe mode"], 1, "Trending stroke times gives early warning of developing faults."]
  ],
  aircomp: [
    ["What is the typical pressure of a starting air system?", ["About 7 to 8 bar", "About 1.4 bar", "About 25 to 30 bar", "About 100 to 160 bar"], 2, "Starting air is typically 25 to 30 bar, with some smaller engines lower."],
    ["Why does a starting air compressor start with its drain or unloader valves open?", ["So it starts unloaded and the motor can accelerate", "To pre-heat the cylinders", "To check the safety valve setting", "To fill the intercooler with water"], 0, "Unloaded start prevents motor overload and failure to accelerate, especially with star-delta."],
    ["What typical pressure dew point does a refrigerant dryer achieve?", ["About -40 °C", "About -20 °C", "About +20 °C", "About +3 °C"], 3, "A refrigerant dryer cools the air to a pressure dew point of about +3 °C."],
    ["A compressor stage safety valve keeps lifting. What is the correct action?", ["Raise the safety valve setting", "Compare stage pressures and overhaul the valves of the next stage", "Bridge the high temperature trip", "Increase the overload relay setting"], 1, "Lifting indicates a leaking valve in the next stage or a blocked cooler; never adjust the safety valve to stop it."],
    ["In lead / lag control, when does the lag compressor start?", ["At the same pressure as the lead compressor", "Only after a blackout", "At a lower pressure if the lead cannot keep up", "When the lead compressor reaches its stop pressure"], 2, "The lag starts at a lower set point when the lead alone cannot maintain pressure."],
    ["Why is the low lube oil pressure trip bypassed for the first seconds after start?", ["Oil pressure needs time to build up after the compressor starts", "To allow the unloaders to close", "To test the trip each time", "To reduce motor starting current"], 0, "The trip has a start time delay because oil pressure builds after starting."],
    ["What must never replace a fusible plug in the compressor delivery line?", ["A plug of the same melting point", "A plug approved by the maker", "A new fusible plug from spares", "A solid plug"], 3, "The fusible plug protects against fire and explosion and must never be replaced by a solid plug."],
    ["Water is found in the control air lines. Which is the most likely cause?", ["High motor current", "Failed auto drains or dryer fault", "Wrong star-delta timer", "Low lube oil level"], 1, "Failed auto drains, a dryer fault or a fouled aftercooler let water into the air lines."]
  ],
  fuelpurifier: [
    ["What is the typical HFO separation temperature?", ["About 60 °C", "About 75 °C", "About 98 °C", "About 120 °C"], 2, "HFO is typically separated at about 98 °C for lower viscosity and better density difference."],
    ["In a conventional purifier, what sets the oil / water interface position?", ["The gravity disc", "The paring disc", "The sliding bowl bottom", "The back-pressure valve only"], 0, "The gravity disc size, chosen from a nomogram, sets the interface position."],
    ["How does an automatic (ALCAP-type) system deal with water?", ["It changes the gravity disc automatically", "It increases bowl speed", "It closes the three-way valve permanently", "It runs as a clarifier and a water transducer triggers discharge or drain"], 3, "A water transducer in the clean-oil outlet triggers sludge discharge or opens a drain valve."],
    ["Why must the separator starter and overload relay allow a long starting time?", ["The feed pump starts first", "Run-up of the heavy bowl takes several minutes", "The heater must reach temperature first", "The control unit runs a self test"], 1, "Bowl run-up typically takes 3 to 10 minutes."],
    ["A separator fails to discharge sludge. What is a classic cause?", ["Low or unstable operating water pressure", "Wrong overload relay class", "Speed sensor gap too small", "Wrong density setting on a level transmitter"], 0, "Low operating water pressure is a classic cause of failed or incomplete sludge discharge."],
    ["On most separator alarms, what does the three-way valve do?", ["Opens the sludge outlet", "Stops the feed pump", "Sends the oil to the overflow tank", "Diverts the oil to recirculation"], 3, "Recirculation prevents dirty oil from being sent to the service tank."],
    ["Why is the electric heater only energised when feed flow is proven?", ["To reduce motor starting current", "To save energy during start", "To avoid boiling or coking in the heater", "To allow the bowl to reach speed"], 2, "The flow interlock prevents overheating, boiling or coking with no flow."],
    ["A pressure transmitter shows a wrong tank level after a fuel grade change. What is the likely reason?", ["Radar sensor fouled", "Wrong density setting on the transmitter", "Overflow tank alarm active", "Quick-closing valve tripped"], 1, "Hydrostatic level transmitters need the correct density, which changes with fuel grade."]
  ]
});
window.ETO_QUIZ = window.ETO_QUIZ || {};
Object.assign(window.ETO_QUIZ, {
  watermaker: [
    ["What is the main heat source for a typical marine vacuum evaporator fresh water generator?", ["Main-engine jacket cooling water", "Exhaust gas economiser steam", "Electric immersion heaters", "Thermal oil from the boiler"], 0, "The common marine evaporator uses main-engine jacket cooling water as waste heat."],
    ["What is the typical working pressure of the high-pressure pump on a seawater RO plant?", ["About 10 to 15 bar", "About 25 to 27 bar", "About 55 to 70 bar", "About 100 to 120 bar"], 2, "Seawater RO HP pumps typically run at 55 to 70 bar, above the osmotic pressure of about 25 to 27 bar."],
    ["Why must chlorinated water never be used to flush RO membranes?", ["It raises the permeate TDS reading", "Chlorine and other oxidisers damage the membranes", "It blocks the cartridge filters", "It trips the salinometer dump valve"], 1, "Membranes are damaged by chlorine and other oxidisers, so flush water must be dechlorinated."],
    ["The cartridge filter differential pressure suddenly drops to a very low value. What may this indicate?", ["The membranes need chemical cleaning", "The antiscalant tank is empty", "The feed water is very clean", "A cartridge has burst"], 3, "A sudden low filter dP may mean a burst cartridge letting dirt through to the membranes."],
    ["Why does UV sterilisation alone not protect the potable water tanks?", ["UV only works on evaporator distillate", "UV raises the pH too much", "UV gives no residual protection", "UV removes the chlorine residual"], 2, "UV gives no residual protection, so tanks still need chlorination or another approved residual disinfectant."],
    ["An RO plant shows high salinity and the dump valve opens. Which is a likely cause?", ["Damaged membrane or O-ring", "High product tank level", "Low chemical level in dosing tank", "Engine jacket water too cold"], 0, "Damaged membranes or O-rings, low HP pressure or high feed temperature cause high permeate salinity."],
    ["Why is a VFD or soft starter preferred for the RO high-pressure pump?", ["It removes the need for a low-pressure switch", "It reduces water hammer that can crack membranes", "It increases the membrane recovery to 90 percent", "It allows the plant to run in port without filters"], 1, "Pressure shocks from DOL starting crack membranes and housings, so ramped starting is used."],
    ["What happens to the salinity reading if the conductivity cell temperature input is wrong?", ["Nothing, conductivity is not temperature dependent", "The dump valve is automatically bypassed", "The HP pump trips on high pressure", "The salinity value will be wrong"], 3, "Readings are temperature compensated, so a wrong temperature input gives wrong salinity."]
  ],
  sewage: [
    ["Which document is issued after survey to show compliance with MARPOL Annex IV?", ["IOPP certificate", "ISPP certificate", "IAPP certificate", "Ballast Water Management Certificate"], 1, "The International Sewage Pollution Prevention (ISPP) certificate is issued after survey."],
    ["In an extended aeration plant, what happens if the blowers stop for several hours?", ["Bacteria die and the plant turns anaerobic", "The UV lamps overheat and fail", "The effluent becomes cleaner", "The vacuum toilets stop flushing"], 0, "Biological plants depend on air; without it bacteria start dying and the plant turns anaerobic."],
    ["What is the most common cause of vacuum toilet system blockages?", ["Scale in the vacuum pump", "Faulty pressure switches", "Wipes, sanitary items and rags", "Low flush water pressure"], 2, "Blockages from wipes, sanitary items, rags and cloths are the most common cause of calls."],
    ["Vacuum pumps start too frequently and run for long periods. What is the most likely cause?", ["A blower has tripped", "The UV intensity is low", "The discharge pump is airlocked", "A toilet valve is stuck open or leaking"], 3, "Too-frequent starts indicate a leak, such as a toilet valve stuck open emptying the vacuum."],
    ["Which hazard is specific to electrolytic sewage treatment plants?", ["Hydrogen gas generation", "Ozone from UV lamps", "Mercury from electrodes", "Freezing of the effluent"], 0, "Electrolytic cells generate hydrogen, so ventilation is essential."],
    ["Why is H2S in a sewage space especially dangerous?", ["It is lighter than air and collects in the deckhead", "It deadens the sense of smell at higher concentrations", "It is only produced by aerobic bacteria", "It is harmless below the waterline"], 1, "H2S deadens the sense of smell at higher concentrations, so never trust smell; use a gas detector."],
    ["What should be done before entering a zero-discharge area?", ["Stop all blowers to save power", "Increase the chlorine dosing rate", "Switch STP discharge to the holding tank and log it", "Open the overboard valve fully"], 2, "Before a zero-discharge area the STP discharge must go to the holding tank and the change be logged."],
    ["How long does a biological plant typically need to reach full performance after start-up?", ["About 1 to 2 hours", "About 24 hours", "About 1 to 3 days", "About 1 to 3 weeks"], 3, "Full biological performance typically takes 1 to 3 weeks; seeding with sludge shortens it."]
  ],
  bwms: [
    ["What does the D-2 standard of the BWM Convention define?", ["Exchange of 95 percent of ballast volume at sea", "Limits on viable organisms and indicator microbes in discharged water", "Minimum distance from land for deballasting", "Maximum ballast pump flow rate"], 1, "D-2 is the performance standard limiting viable organisms and indicator microbes in the discharge."],
    ["Why must most UV-based BWMS also run during deballasting?", ["To neutralise the TRO before discharge", "To backflush the filter at sea", "Because water is treated again at discharge", "To produce hypochlorite for the tanks"], 2, "Most UV systems treat at uptake and again at discharge, so the system must run during deballasting."],
    ["In an electro-chlorination BWMS, what must be proven before the rectifier is energised?", ["Hydrogen ventilation / dilution is working", "The UV lamps have warmed up", "The neutraliser tank is empty", "The ballast tanks are full"], 0, "Hydrogen safety interlocks must prove ventilation / dilution before the rectifier is energised."],
    ["Discharge TRO is above the limit during deballasting. What is a likely cause?", ["Fouled UV quartz sleeves", "High salinity of the ballast water", "Filter backflush running continuously", "Neutraliser empty or dosing pump fault"], 3, "If the neutraliser is empty or its pump fails, discharge TRO exceeds the limit; stop discharge."],
    ["Why are rectifiers and UV lamp drivers a concern for the ship's electrical network?", ["They create harmonic currents and large load steps", "They operate only on DC from batteries", "They reduce generator load during ballasting", "They need no cooling or ventilation"], 0, "They are non-linear loads creating harmonics; check THD and generator capacity, especially on retrofits."],
    ["A low UV intensity / dose alarm occurs. Which is a likely cause?", ["Neutraliser tank low level", "Fouled quartz sleeves or turbid water", "Hydrogen detector fault", "Rectifier overtemperature"], 1, "Fouled sleeves, low UV transmittance water, aged lamps or a faulty sensor reduce UV intensity."],
    ["What must happen when the BWMS treatment is bypassed?", ["Nothing, bypass is a normal operating mode", "The ballast pumps must be stopped permanently", "An alarm must activate and it must be recorded in the BWMS log and BWRB", "Only the chief engineer's log needs an entry"], 2, "Bypass must activate an alarm and be recorded in both the BWMS data log and the BWRB."],
    ["What is a common reason for PSC detentions related to BWMS?", ["Using UV instead of electro-chlorination", "Backflush water discharged at the uptake location", "Ballast pumps fitted with VFDs", "Missing BWRB entries, data log gaps or unrecorded bypass"], 3, "PSC detentions often relate to records: missing BWRB entries, log gaps or unrecorded bypass use."]
  ],
  chiller: [
    ["How is superheat calculated?", ["Suction line temperature minus evaporating saturation temperature", "Condensing temperature minus liquid line temperature", "Discharge temperature minus suction temperature", "Room temperature minus evaporator temperature"], 0, "Superheat is suction line temperature minus the saturation temperature at suction pressure."],
    ["Why must chilled water flow be proven before a chiller compressor runs?", ["To prevent high discharge pressure", "To prevent the evaporator from freezing", "To start the crankcase heater", "To balance the motor phases"], 1, "Without proven chilled water flow the evaporator can freeze."],
    ["What is the purpose of the compressor crankcase heater?", ["To defrost the evaporator coils", "To heat the cold room door frames", "To stop refrigerant dissolving in the oil while stopped", "To raise the discharge temperature"], 2, "It keeps the oil warm so refrigerant does not dissolve in it, preventing foaming and oil loss at start."],
    ["In a provision plant on pump-down control, what stops the compressor when all room solenoids close?", ["The HP switch", "The oil pressure differential switch", "The anti-short-cycle timer", "The LP switch"], 3, "When all solenoids close, suction pressure falls and the LP switch stops the compressor."],
    ["During defrost of a cold room evaporator, what happens to the fans?", ["They stop and restart after a fan delay", "They run at double speed to dry the coil", "They reverse direction to blow off ice", "They keep running normally"], 0, "Fans stop during defrost and restart after a fan delay so water drips off first."],
    ["A chiller trips repeatedly on HP in warm waters. What is a frequent cause?", ["Iced evaporator", "Blocked filter drier", "Fouled condenser on the sea water side", "Low refrigerant charge"], 2, "Condenser fouling on the sea water side is a frequent cause of high-pressure trips in warm waters."],
    ["Why should a hermetic compressor never be meggered while the system is under vacuum?", ["The megger reading is always zero under vacuum", "There is a risk of winding damage", "The oil will foam immediately", "The LP switch will lock out permanently"], 1, "Insulation testing a hermetic compressor under vacuum risks winding damage."],
    ["The man-trapped alarm in a cold room fails its test. What is the correct action?", ["Record it and repair at the next dry dock", "Disconnect it to avoid false alarms", "Rely on the high temperature alarm instead", "Repair it immediately, as it is safety-critical"], 3, "Failed man-trapped alarms have caused fatalities, so they must be repaired immediately."]
  ]
});
window.ETO_QUIZ = window.ETO_QUIZ || {};
Object.assign(window.ETO_QUIZ, {
  esd: [
    ["In a typical ESD hierarchy, what does a higher shutdown level do?", ["Replaces the actions of the lower levels", "Includes all actions of the levels below it", "Only acts on the power system, not valves", "Resets the lower levels automatically"], 1, "Shutdown levels are hierarchical, so a higher level always includes all lower-level actions."],
    ["What does the de-energise-to-trip principle mean for an ESD circuit?", ["Loss of signal or power causes a shutdown", "A trip needs extra power to be applied", "The circuit is normally de-energised in service", "Only the PLC can initiate the trip"], 0, "The healthy circuit is energised, so loss of signal drives the plant to the safe state."],
    ["On loss of instrument air, what do fail-safe spring-return actuators do?", ["ESDVs open and BDVs close", "Both ESDVs and BDVs stay in last position", "ESDVs close and BDVs open", "Both ESDVs and BDVs close"], 2, "Fail-safe actuators close ESD valves and open blowdown valves on loss of air, hydraulics or power."],
    ["After the cause is cleared and an ESD is reset, what happens to the equipment?", ["Valves reopen and motors restart automatically", "The process restarts in the order it tripped", "Only the main generators restart automatically", "Nothing restarts; equipment is restarted locally in sequence"], 3, "Reset only permits restart; equipment is restarted locally and in sequence."],
    ["A line fault alarm appears on a manual ESD push-button circuit. What is a sensible first check?", ["Bridge the push-button to clear the alarm", "Replace the logic solver I/O card at once", "Measure loop resistance and check the end-of-line resistor", "Raise the alarm set-point in the PLC"], 2, "Line faults come from broken cables, wrong EOL resistors or water ingress, found by measuring loop resistance."],
    ["After a spurious ESD trip, how should you find out what tripped first?", ["Use the Sequence of Events / first-out record", "Ask the operators which alarm they saw first", "Reset everything and wait for it to recur", "Replace the most likely transmitter"], 0, "The SOE / first-out record shows the initiating cause, so you do not have to guess."],
    ["During a proof test an ESDV fails to close. What is the correct response?", ["Reset the ESD and repeat until it closes", "Note it and wait for the next planned test", "Bypass the valve until spares arrive", "Report it as a dangerous failure and arrange compensating measures"], 3, "A failure found in proof testing is a dangerous failure that must be reported, risk-assessed and repaired promptly."],
    ["Which statement about manual ESD push-buttons and APS is typical?", ["They can be bypassed by the duty operator", "They are normally not overridable", "They are disabled during start-up bypass", "They act only through the process control system"], 1, "Manual ESD push-buttons and APS are normally not overridable."]
  ],
  firegas: [
    ["Which gas detector type cannot detect hydrogen?", ["Catalytic bead (pellistor)", "Electrochemical H2 cell", "Infrared point detector", "Ultrasonic leak detector"], 2, "IR point detectors respond to hydrocarbon absorption and do not detect hydrogen."],
    ["A catalytic detector reads low when span gas is applied. What is the likely cause?", ["Sensor poisoning by silicone, H2S or lead", "Too much oxygen in the span gas", "The IR window is dirty", "The open-path beam is misaligned"], 0, "Catalytic beads are poisoned by silicones, lead and H2S, reducing sensitivity."],
    ["In F&G voting, what does a 2ooN confirmed detection typically initiate?", ["Only a local beacon in the area", "Executive actions such as ESD and deluge", "A detector self-test sequence", "Automatic inhibit of the detectors"], 1, "Two detectors in the same area confirm fire or gas and trigger executive actions."],
    ["What is a typical low alarm set-point for an H2S detector?", ["1 ppm", "20 ppm", "50 ppm", "5 ppm"], 3, "The guide lists 5 ppm as the typical H2S low alarm, confirmed against the C&E."],
    ["Where should detectors for methane or hydrogen generally be placed?", ["High, because these gases rise", "Low, because these gases sink", "Only at floor drains", "Only in the HVAC exhaust"], 0, "Light gases such as methane and hydrogen rise, so detectors are mounted high."],
    ["Before testing detectors in an area protected by gaseous extinguishing, what must be done?", ["Open all doors to ventilate the room", "Raise the detector alarm set-points", "Only inform the bridge by phone", "Isolate (lock out) the release circuit"], 3, "The release circuit must be isolated before testing to avoid an accidental discharge."],
    ["A 4-20 mA gas detector shows fault below 4 mA. What is a good first check?", ["Recalibrate the span immediately", "Increase the alarm delay in the logic", "Measure supply voltage at the head and loop current", "Swap it with a smoke detector"], 2, "Low current indicates power, cable, water or sensor problems, so check supply and loop first."],
    ["What is the correct way to function-test a heat detector?", ["Use a lighter flame close to the head", "Use a heat tool, never an open flame", "Short its terminals at the panel", "Spray it with test aerosol"], 1, "Heat detectors are tested with a heat tool; open flames must not be used."]
  ],
  safety: [
    ["Which action counts as isolation of an LV motor?", ["Pressing the local stop push-button", "Stopping it from the control station", "Switching off at the remote control panel", "Breaker OFF or racked out at the point of isolation and locked"], 3, "Switching off at a control station or push-button is not isolation."],
    ["What is the correct prove-test-prove sequence?", ["Prove tester on known live, test for dead, re-prove tester", "Test for dead, then prove tester once", "Prove tester, test for dead, then earth only", "Test with a voltage stick, then a multimeter"], 0, "Re-proving shows the tester did not fail during the test."],
    ["What is the correct use of a non-contact voltage stick?", ["To prove dead before touching conductors", "To replace a two-pole voltage detector", "Only as an indication, never to prove dead", "To test HV cables after IR testing"], 2, "Voltage sticks are only an indication and must never be used to prove dead."],
    ["On an insulated (IT) ship system with one earth fault present, what happens?", ["The breaker trips immediately", "Healthy phases rise to line voltage to hull", "All phase voltages fall to zero", "The fault clears itself after reset"], 1, "With one earth fault, the healthy phases rise to line voltage relative to the hull."],
    ["Before touching parts in a VFD after isolation, what should you do?", ["Touch the DC bus with insulated gloves", "Work immediately since the input is off", "Wait the label time, then measure DC+ to DC- below 50 V", "Check only that the display is dark"], 2, "The DC link can hold hundreds of volts for minutes, so wait and measure."],
    ["At shift change under LOTO, what is the correct practice?", ["The new person applies a lock before the leaving person removes theirs", "The leaving person leaves their lock for the new person", "Locks are removed and reapplied by the Chief Engineer", "The danger tag alone is enough during handover"], 0, "Isolation must never be left unprotected during handover."],
    ["Which extinguisher is correct for a fire on live electrical equipment?", ["Water spray", "Foam", "Wet chemical", "CO2 or dry powder"], 3, "CO2 or dry powder are used on live electrical equipment, never water or foam."],
    ["What is the rated sensitivity of a personal-protection RCD?", ["10 mA", "30 mA", "100 mA", "300 mA"], 1, "Personal-protection RCDs are rated at 30 mA."]
  ],
  hazardous: [
    ["Which zone describes an explosive gas atmosphere likely to occur occasionally in normal operation?", ["Zone 0", "Zone 1", "Zone 2", "Zone 21"], 1, "Zone 1 is where a gas atmosphere is likely to occur occasionally in normal operation."],
    ["What is the maximum surface temperature of T4 equipment?", ["135 degrees C", "100 degrees C", "200 degrees C", "85 degrees C"], 0, "T4 equipment has a maximum surface temperature of 135 degrees C."],
    ["Equipment marked IIC may be used in areas of which gas groups?", ["IIC only", "IIA only", "IIB and IIA only", "IIC, IIB and IIA"], 3, "IIC is the most demanding group, so IIC equipment suits IIB and IIA too."],
    ["Which equipment protection level (EPL) is required for Zone 1?", ["Da", "Gc", "Gb", "Db"], 2, "Zone 1 requires EPL Gb, and higher-level Ga equipment may also be used."],
    ["What minimum separation is typically required between IS and non-IS circuits?", ["50 mm or an earthed screen / partition", "10 mm with no partition", "5 mm if cables are blue", "No separation if armoured"], 0, "IS circuits must be kept at least 50 mm from non-IS circuits or separated by an earthed screen."],
    ["How should an unused cable entry on an Ex enclosure be closed?", ["Leave it open for ventilation", "Seal it with silicone compound", "Fit any ordinary plastic plug", "Use a certified blanking / stopping plug"], 3, "Unused entries must be closed with certified blanking or stopping plugs."],
    ["What does an X suffix on an Ex certificate number mean?", ["The device is an Ex component only", "The device is for mines", "Specific conditions of use apply", "The certificate has expired"], 2, "X means specific conditions of use, so read the certificate before installing."],
    ["What is the correct practice before opening an Ex d enclosure?", ["Open it live if it is quick work", "Isolate it, hold a permit and gas-test first", "Remove only half the bolts to reduce gas entry", "Grease the flame path with ordinary grease"], 1, "Ex d enclosures must never be opened energised and need a permit and gas test."]
  ]
});
