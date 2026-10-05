# ETO Toolkit – Marine Electrical Engineering & Troubleshooting

Open `ETO-Toolkit.html` (single file) or `index.html` (multi-page) in any browser – phone, tablet or laptop. No install, works offline.

**39 pages · 318 calculators / tools in 7 levels**

| Level | Pages |
|---|---|
| 1 – Daily ETO calculations | Power, power factor, cables, motors, generators, transformers, battery & UPS |
| 2 – Professional troubleshooting | Short-circuit & protection (incl. coordination chart, IDMT, CT burden), earthing & insulation (incl. NGR), VFD, harmonics, lighting |
| 3 – Specialist systems | Jacking, cranes, thrusters, power plant & load balance |
| 4 – Maths & conversions | Unit converters (mechanical, electrical & marine), mathematics, geometry & tanks, circuit theory, mechanical / fluid / thermal |
| 5 – ETO Operations | Troubleshooting assistant, testing & commissioning, test records & reports, maintenance & condition trends, fault log, spares & requisitions |
| 6 – Instrumentation & Control | Signals & loops (4–20 mA, NE43, PLC counts), temperature sensors (Pt100, TC K/J), process measurement, calibration & loop check |
| 7 – Systems, safety & marine | PMS / DP / blackout simulator, Ex / hazardous area, electrical safety & isolation, marine systems & shore power, communications & networks |

- Shared engine `assets/common.js`, styles `assets/style.css`, one file per page in `assets/pages/`.
- `python3 build_single_file.py` rebuilds `ETO-Toolkit.html` after edits.
- Inputs, fault log, spares and checklists are stored only in the browser (localStorage) – copy results out regularly.
- Reports print / save to PDF with the vessel & ETO profile set on the Test Records page.
- Default values are typical examples. Always verify against vessel drawings, nameplates, maker data and class / flag rules.
