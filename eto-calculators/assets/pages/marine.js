(function () {
  const { R, lvl, S3, esc, std, STD_BREAKERS } = ETO;
  ETO.page({
    title: 'Marine Systems & Shore Power', icon: '⚓', accent: '#1e40af',
    subtitle: 'Shore connection, navigation lights (COLREG), GMDSS reserve source, emergency-generator starting batteries, battery-room ventilation and DC fault current.',
    refs: ['SOLAS II-1 & IV', 'COLREG 1972 Annex I', 'IEC 80005-3 (LV shore)', 'IEC 62485-2'],
    calcs: [
      {
        id: 'shore', icon: '🔌', title: 'Shore power compatibility & sizing', desc: 'Check the shore supply against the vessel system and size the connection.',
        formula: 'I = P / (√3 · V · PF)     breaker ≥ I     cables in parallel = ⌈I / cable rating⌉',
        inputs: [{ k: 'sv', l: 'Shore voltage', u: 'V', v: 400, min: 1 }, { k: 'sf', l: 'Shore frequency', opts: [[50, '50 Hz'], [60, '60 Hz']], v: 50 }, { k: 'sk', l: 'Shore supply available', u: 'kVA', v: 630, min: 1 }, { k: 'se', l: 'Shore earthing system', opts: [['tn', 'TN (neutral earthed)'], ['it', 'IT (insulated)']], v: 'tn' }, { k: 'vv', l: 'Vessel voltage', u: 'V', v: 440, min: 1 }, { k: 'vf', l: 'Vessel frequency', opts: [[50, '50 Hz'], [60, '60 Hz']], v: 60 }, { k: 've', l: 'Vessel earthing system', opts: [['it', 'IT (insulated)'], ['tn', 'TN']], v: 'it' }, { k: 'kw', l: 'Vessel load on shore power', u: 'kW', v: 350, min: 0 }, { k: 'pf', l: 'Power factor', v: 0.85, min: 0.3, max: 1, step: 0.01 }, { k: 'cr', l: 'Rating of one shore cable', u: 'A', v: 250, min: 1 }],
        run: v => {
          const s = v.kw / v.pf, i = s * 1000 / (S3 * v.vv), dv = (v.sv - v.vv) / v.vv * 100, fOk = +v.sf === +v.vf, vOk = Math.abs(dv) <= 6, kOk = s <= v.sk, eOk = v.se === v.ve, nc = Math.ceil(i / v.cr);
          const issues = [!fOk && `Frequency mismatch ${v.sf} Hz shore vs ${v.vf} Hz vessel – motors run ${v.sf < v.vf ? 'slower' : 'faster'} by ${Math.abs(v.sf / v.vf - 1) * 100 | 0} % and transformers/ballasts may overheat; a frequency converter is required.`, !vOk && `Voltage differs ${dv.toFixed(1)} % – use a transformer / converter.`, !kOk && 'Shore capacity too small for the load – shed load or request higher capacity.', !eOk && 'Different earthing systems – use an isolation transformer so the vessel IT system is not earthed by the shore supply.'].filter(Boolean);
          return { results: [R('Shore current at vessel voltage', i, 'A', 0, null, true), R('Apparent power', s, 'kVA', 0, kOk ? 'ok' : 'bad'), R('Voltage difference', dv, '%', 1, vOk ? 'ok' : 'bad'), R('Frequency', fOk ? 'match' : 'MISMATCH', '', 0, fOk ? 'ok' : 'bad'), R('Shore cables needed', nc, '', 0), R('Shore breaker (std ≥ I)', std(STD_BREAKERS, i), 'A', 0)], verdict: issues.length ? { s: 'bad', t: issues.join(' ') } : { s: 'ok', t: 'Shore supply compatible.' }, notes: ['Before closing: check phase sequence (phase-sequence relay / meter), insulation of shore cables, earth / bonding connection first, interlock with generator breakers (no paralleling unless designed).'] };
        }
      },
      {
        id: 'nav', icon: '🚦', title: 'Navigation lights (COLREG Rule 22)', desc: 'Minimum visibility range of each light by vessel length, plus status-light combinations.',
        formula: 'COLREG Rule 22 / Annex I',
        inputs: [{ k: 'l', l: 'Vessel length overall', u: 'm', v: 72, min: 1 }, { k: 'w', l: 'Lamp power per light', u: 'W', v: 25, min: 0 }, { k: 'n', l: 'Number of navigation lights fitted', v: 6, min: 0, step: 1 }, { k: 'v', l: 'Supply voltage', u: 'V', v: 24, min: 1 }],
        run: v => {
          const L = v.l, r = L >= 50 ? [6, 3, 3, 3, 3] : L >= 20 ? [5, 2, 2, 2, 2] : L >= 12 ? [3, 2, 2, 2, 2] : [2, 1, 2, 2, 2], P = v.w * v.n;
          return { results: [R('Masthead light', r[0], 'nm', 0, null, true), R('Sidelights', r[1], 'nm', 0, null, true), R('Stern light', r[2], 'nm', 0), R('Towing light', r[3], 'nm', 0), R('All-round lights', r[4], 'nm', 0), R('Navigation-light load', P, 'W', 0), R('Current', P / v.v, 'A', 1)],
            tables: [{ title: 'Common status lights (all-round)', head: ['Situation', 'Lights'], rows: [['Not under command (Rule 27a)', 'Two red, vertical'], ['Restricted in ability to manoeuvre (Rule 27b)', 'Red – white – red, vertical'], ['At anchor ≥ 50 m (Rule 30)', 'White forward + lower white aft (and deck lights if ≥ 100 m)'], ['Aground (Rule 30d)', 'Anchor lights + two red vertical'], ['Constrained by draught (Rule 28)', 'Three red, vertical'], ['Engaged in dredging / underwater ops (Rule 27d)', 'RAM lights + two red (obstructed side) / two green (passable side)']] }], notes: ['Navigation lights need a dedicated distribution board with failure alarm and supply from main and emergency source (SOLAS II-1/43).', 'Lengths: ≥ 50 m / 20–50 m / 12–20 m / < 12 m per Rule 22 (sidelights 2 nm from 12 m; masthead 3 nm for 12–20 m).'] };
        }
      },
      {
        id: 'gmdss', icon: '📡', title: 'GMDSS reserve source of energy', desc: 'Battery capacity for the radio installation reserve source (SOLAS IV/13).',
        formula: 'Load = ½ × transmit + receive + additional;  Ah = Load/V × hours × factor;  recharge ≤ 10 h',
        inputs: [{ k: 'tbl', t: 'table', l: 'Radio equipment', v: [{ n: 'VHF DSC', tx: 60, rx: 8 }, { n: 'MF/HF DSC', tx: 350, rx: 25 }, { n: 'Inmarsat-C / SSAS', tx: 120, rx: 15 }, { n: 'NAVTEX', tx: 0, rx: 10 }, { n: 'Radio lighting', tx: 0, rx: 20 }], cols: [{ k: 'n', l: 'Equipment', t: 'text', d: '', w: 160 }, { k: 'tx', l: 'Transmit W', t: 'num', d: 0 }, { k: 'rx', l: 'Receive / standby W', t: 'num', d: 0 }] }, { k: 'v', l: 'Battery voltage', u: 'V', v: 24, min: 1 }, { k: 'h', l: 'Required duration', opts: [[1, '1 h (emergency source complies with II-1/42-43)'], [6, '6 h (otherwise)']], v: 1 }, { k: 'f', l: 'Ageing / temperature / DoD factor', v: 1.5, min: 1, step: 0.05 }],
        run: v => {
          const W = v.tbl.reduce((s, r) => s + 0.5 * r.tx + r.rx, 0), ah = W / v.v * v.h * v.f;
          return { results: [R('Average load', W, 'W', 0), R('Load current', W / v.v, 'A', 2), R('Minimum battery capacity', ah, 'Ah', 0, null, true), R('Charger current to recharge in 10 h', ah * 1.2 / 10, 'A', 1)], notes: ['Check the battery monthly (off-load voltage and on-load test) and its capacity yearly – see SOLAS IV/13 and IMO COMSAR/Circ.32 guidelines.'] };
        }
      },
      {
        id: 'start', icon: '🔋', title: 'Emergency generator starting battery', desc: 'Capacity for consecutive cranking attempts (SOLAS II-1/44: stored energy for at least three consecutive starts).',
        formula: 'Ah = I_crank × t_crank × N / 3600 × factor',
        inputs: [{ k: 'i', l: 'Cranking current', u: 'A', v: 450, min: 1 }, { k: 't', l: 'Cranking time per attempt', u: 's', v: 10, min: 1 }, { k: 'n', l: 'Consecutive starts required', v: 3, min: 1, step: 1 }, { k: 'f', l: 'Low-temperature / ageing factor', v: 2.0, min: 1, step: 0.1, hint: 'Cold starts and high-rate discharge reduce usable capacity strongly' }, { k: 'cca', l: 'Battery CCA rating', u: 'A', v: 640, min: 0 }],
        run: v => { const ah = v.i * v.t * v.n / 3600 * v.f, ok = v.cca >= v.i * 1.25; return { results: [R('Energy per series of starts', v.i * v.t * v.n / 3600, 'Ah', 2), R('Minimum capacity (with factor)', ah, 'Ah', 1, null, true), R('CCA vs cranking current', v.cca / v.i, '×', 2, ok ? 'ok' : 'warn')], verdict: { s: ok ? 'ok' : 'warn', t: ok ? 'CCA rating has margin over cranking current.' : 'CCA rating close to / below cranking current – starting at low temperature may fail.' }, notes: ['In practice high-rate (CCA) capability, not Ah, decides the starting battery – select per engine maker.'] }; }
      },
      {
        id: 'h2', icon: '💨', title: 'Battery room hydrogen ventilation (IEC 62485-2)', desc: 'Air flow needed to keep hydrogen below the safe concentration while charging.',
        formula: 'Q = 0.05 × n × I_gas × C_rt × 10⁻³  (m³/h)     natural ventilation opening A ≥ 28 × Q (cm²)',
        inputs: [{ k: 'n', l: 'Number of cells', v: 12, min: 1, step: 1 }, { k: 'c', l: 'Capacity C_rt (10 h rate)', u: 'Ah', v: 200, min: 1 }, { k: 'ty', l: 'Battery type & charge mode (I_gas, mA/Ah)', opts: [[1, 'VRLA – float (1)'], [8, 'VRLA – boost (8)'], [5, 'Vented lead-acid – float (5)'], [20, 'Vented lead-acid – boost (20)'], [50, 'Vented NiCd – boost (50)']], v: 8 }],
        run: v => { const q = 0.05 * v.n * v.ty * v.c * 1e-3; return { results: [R('Required air flow', q, 'm³/h', 3, null, true), R('Natural ventilation opening (inlet & outlet each)', 28 * q, 'cm²', 0)], notes: ['Formula includes the dilution factor (24), gas volume per Ah and safety factor 5 of IEC 62485-2. Inlet low, outlet high; never recirculate. Ex-rated fans if the fan is in the air stream.'] }; }
      },
      {
        id: 'dcsc', icon: '⚡', title: 'DC battery short-circuit current', desc: 'Prospective fault current of a battery through its connections – check fuse / breaker DC breaking capacity.',
        formula: 'I_sc ≈ V_oc / (n × R_cell + R_links + R_cable)',
        inputs: [{ k: 'n', l: 'Cells / blocks in series', v: 2, min: 1, step: 1 }, { k: 'voc', l: 'Open-circuit voltage per cell / block', u: 'V', v: 12.8, min: 0.1 }, { k: 'ri', l: 'Internal resistance per cell / block', u: 'mΩ', v: 4.2, min: 0.001 }, { k: 'rl', l: 'Inter-cell links total', u: 'mΩ', v: 0.5, min: 0 }, { k: 'l', l: 'Cable length (one way)', u: 'm', v: 3, min: 0 }, { k: 's', l: 'Cable size', u: 'mm²', v: 50, min: 1 }, { k: 'icu', l: 'Fuse / breaker DC breaking capacity', u: 'kA', v: 10, min: 0.1 }],
        run: v => { const rc = 2 * v.l * ETO.res('Cu', v.s, 20), rt = v.n * v.ri / 1000 + v.rl / 1000 + rc, isc = v.n * v.voc / rt, ok = isc / 1000 <= v.icu; return { results: [R('Prospective DC fault current', isc / 1000, 'kA', 2, ok ? 'ok' : 'bad', true), R('Total circuit resistance', rt * 1000, 'mΩ', 2), R('Cable share', rc / rt * 100, '%', 0)], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Protective device can interrupt the DC fault.' : 'Fault current exceeds the device\'s DC rating – use a DC-rated fuse / breaker with higher capacity, as close to the battery as possible.' }, notes: ['Use the maker\'s short-circuit current figure if available (often quoted per cell). Check the device is DC-rated at the full battery voltage.'] }; }
      }
    ]
  });
})();
