# ETO Handbook – Marine Electrical Engineering, Guides & Tools

**Everything an ETO Needs**

Open `ETO-Handbook.html` (single file) or `index.html` (multi-page) in any browser – phone, tablet or laptop. No install, works offline.

**42 pages · calculators & tools in 8 levels**

| Level | Pages |
|---|---|
| 1 – Daily ETO calculations | Electrical power, power factor, cables, motors, generators, transformers, battery & UPS (incl. emergency-generator starting battery, battery-room ventilation, DC fault current) |
| 2 – Protection, earthing & power quality | Short-circuit & protection, earthing & insulation, VFD / drives, harmonics, lighting |
| 3 – Power plant, DP & specialist systems | Power plant & load balance (incl. shore power), PMS / DP / blackout simulator, dynamic positioning (DP) guide, thrusters, jacking, cranes |
| 4 – Instrumentation, control & communications | Signals & loops, temperature sensors, process measurement, calibration & loop check, industrial communications guide, communications & network calculators |
| 5 – ETO operations | Troubleshooting assistant (incl. drive fault families), testing & commissioning, preventive maintenance guide |
| 6 – Safety & hazardous areas | Electrical safety & isolation, Ex / hazardous area guide, offshore fire & gas system guide |
| 7 – Tips & tricks for ETO | Instruments & how to use them, multimeter & clamp-meter tricks, workshop tools, handover & documentation, survey / audit / class tips, offshore ETO interview preparation |
| 8 – Maths & conversions (reference) | Unit converters (mechanical, electrical & marine), mathematics, geometry & tanks, circuit theory, mechanical / fluid / thermal |

- Shared engine `assets/common.js`, styles `assets/style.css`, one file per page in `assets/pages/`.
- `python3 build_single_file.py` rebuilds `ETO-Handbook.html` after edits.
- Inputs are remembered in the browser (localStorage).
- Default values are typical examples. Always verify against vessel drawings, nameplates, maker data and class / flag rules.
