# ETO Toolkit – Electrical Calculators (Jack-up Barge)

Open `index.html` in any browser (phone, tablet or laptop). No install, no internet needed.

22 pages, 220+ calculators: power, power factor, cables, motors, generators, transformers, battery/UPS,
short-circuit & protection, earthing/insulation, VFD, harmonics, lighting, jacking, cranes, thrusters,
plant load balance / PMS / blackout recovery / emergency generator, and Level 4: unit converters (mechanical, electrical, marine), mathematics, geometry & tanks, circuit theory, mechanical / fluid / thermal.

- Shared engine: `assets/common.js`, styling: `assets/style.css`
- One file per page in `assets/pages/` – each calculator is a small object (inputs, formula, `run()`), easy to edit.
- Inputs are remembered per calculator (browser localStorage). Results can be copied or printed.
- Default values are typical 440 V / 60 Hz marine examples. Always verify against vessel drawings,
  nameplates, manufacturer data and class rules.
