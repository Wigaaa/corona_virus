# ETO Handbook – Marine Electrical Engineering, Guides & Tools

**Everything an ETO Needs** – by: ETO / Wagdy Mohamed

Open `ETO-Handbook.html` (single file) or `index.html` (multi-page) in any browser – phone, tablet or laptop. No install, works offline.

**61 pages · 29 calculator pages + 32 guides**

### 🧮 Calculators
| Group | Pages |
|---|---|
| A – Power & Distribution | Electrical power, power factor, cables, generators, transformers, battery & UPS |
| B – Machines & Drives | Motors, VFD / drives, thrusters, jacking system, cranes |
| C – Protection & Power Quality | Short-circuit & protection, earthing & insulation, harmonics, lighting |
| D – Power Plant & DP | Power plant & load balance (incl. shore power), PMS / DP / blackout simulator |
| E – Instrumentation & Networks | Signals & loops, temperature sensors, process measurement, calibration & loop check, communications & network calculators |
| F – Testing & Commissioning | Field test evaluation |
| G – Maths & Conversions | Unit converters, mathematics, geometry & tanks, circuit theory, mechanical / fluid / thermal |

### 📘 Guides & Knowledge
Guides in groups 1–5 end with a **📝 Quick quiz** tab (8 questions each, instant feedback and score). Questions live in `assets/quiz.js`.

| Group | Pages |
|---|---|
| 1 – Power, Electrical & Automation | Power management system, diesel generators, MSB & ESB, battery & UPS, lighting, industrial communications |
| 2 – DP, Propulsion & Positioning | Dynamic positioning, thrusters |
| 3 – Jack-up & Offshore Systems | Jacking systems, raw water pumps, jetting system, cranes |
| 4 – Auxiliary & Marine Systems | Pumps, remote control valves, air compressors, fuel oil & purifiers, fresh water maker, sewage treatment, ballast water management, chiller & refrigeration |
| 5 – Safety Systems & Hazardous Areas | Emergency shutdown (ESD), offshore fire & gas, electrical safety & isolation, Ex / hazardous areas |
| 6 – Operations | Troubleshooting assistant, preventive maintenance guide |
| 7 – Tips & Tricks for ETO | Instruments, meter tricks, workshop tools, handover & documentation, survey / audit / class tips, offshore interview preparation |

- Shared engine `assets/common.js`, styles `assets/style.css`, one file per page in `assets/pages/`.
- `python3 build_single_file.py` rebuilds `ETO-Handbook.html` after edits. For the release file set `TERSER=/path/to/terser` (or have `terser` on PATH) – the code is then scrambled (minified + mangled). `node tests/bundle.js` checks the built file.
- © 2026 Wagdy Mohamed Abdel Aziz – all rights reserved, see `LICENSE`. Every page shows the copyright and version, printouts carry a watermark, and the app shows a warning if the author's name is removed or changed.
- Inputs are remembered in the browser (localStorage).
- Default values are typical examples. Always verify against vessel drawings, nameplates, maker data and class / flag rules.
