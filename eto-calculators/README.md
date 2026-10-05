# ETO Toolkit – Marine Electrical Engineering & Troubleshooting

Open `ETO-Toolkit.html` (single file) or `index.html` (multi-page) in any browser – phone, tablet or laptop. No install, works offline.

**35 pages · calculators & tools in 7 levels**

| Level | Pages |
|---|---|
| 1 – Daily ETO calculations | Power, power factor, cables, motors, generators, transformers, battery & UPS |
| 2 – Professional troubleshooting | Short-circuit & protection (incl. coordination chart, IDMT, CT burden), earthing & insulation (incl. NGR), VFD, harmonics, lighting |
| 3 – Specialist systems | Jacking, cranes, thrusters, power plant & load balance |
| 4 – Maths & conversions | Unit converters (mechanical, electrical & marine), mathematics, geometry & tanks, circuit theory, mechanical / fluid / thermal |
| 5 – ETO Operations | Troubleshooting assistant (incl. drive fault families), testing & commissioning, preventive maintenance guide, industrial communications guide (all protocols + comparison) |
| 6 – Instrumentation & Control | Signals & loops (4–20 mA, NE43, PLC counts), temperature sensors (Pt100, TC K/J), process measurement, calibration & loop check |
| 7 – Systems, safety & marine | PMS / DP / blackout simulator, Ex / hazardous area, electrical safety & isolation, marine systems & shore power, communications & networks |

- Shared engine `assets/common.js`, styles `assets/style.css`, one file per page in `assets/pages/`.
- `python3 build_single_file.py` rebuilds `ETO-Toolkit.html` after edits.
- Inputs are remembered in the browser (localStorage).
- Default values are typical examples. Always verify against vessel drawings, nameplates, maker data and class / flag rules.
