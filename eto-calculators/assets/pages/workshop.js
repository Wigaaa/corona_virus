(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const NOTE = '<p>Adapt the list to the vessel type, voltage levels and equipment makers on board. Tools used in hazardous areas need a permit or Ex-suitable design.</p>';

  const S = [
    ['hand', '🪛', 'Hand tools', () =>
      TB(['Tool', 'Notes'], [
        ['Insulated screwdriver set (1000 V, IEC 60900 / VDE)', 'Slotted, Phillips, Pozidriv, Torx; slim shafts for terminals'],
        ['Terminal screwdrivers 0.4 × 2.5 / 0.6 × 3.5 mm', 'For spring-cage and small terminals'],
        ['Insulated pliers, side cutters, long-nose pliers', '1000 V rated; one set kept only for electrical work'],
        ['Automatic wire stripper', '0.2–6 mm²; plus a coax / data stripper'],
        ['Insulated cable knife', 'Hook blade for sheath removal'],
        ['Insulated socket & spanner set', 'Metric (and imperial if needed); ratchet'],
        ['Torque screwdriver & torque wrench', 'Terminal and busbar torques from the maker – loose connections cause most hot spots'],
        ['Allen keys & Torx keys', 'Ball-end and T-handle'],
        ['Inspection mirror, magnet pick-up, telescopic grabber', 'For panels and tight spaces'],
        ['Head torch & hand lamp', 'Ex-certified for hazardous areas'],
        ['Tool lanyards & tool bag', 'Dropped-object prevention when working at height']]) +
      H('Tips') + L(['Check insulated tools before use: no cracks or cuts in the insulation – remove damaged tools.', 'Keep a separate small kit in a pouch for quick jobs around the vessel.']) + NOTE
    ],
    ['crimp', '🔗', 'Crimping, stripping & terminating', () =>
      TB(['Tool', 'Use'], [
        ['Ratchet crimper for insulated lugs', 'Red (0.5–1.5 mm²), blue (1.5–2.5 mm²), yellow (4–6 mm²) colour-coded dies'],
        ['Ferrule crimper (square / hexagonal)', '0.25–10 mm² (and 16–50 mm² for larger terminals)'],
        ['Hydraulic crimper with hexagonal dies', 'Non-insulated lugs 10–300 mm²; dies matching the lug maker and size'],
        ['Ratchet cable cutter', 'Clean cut on large cables up to ≈ 300 mm²'],
        ['Heat gun & heat-shrink assortment', 'Insulation, sealing, identification sleeves'],
        ['Connector tools', 'RJ45 crimper, M12 field-attachable tools, D-sub pin crimper, punch-down tool, coax tools'],
        ['Pin extraction tools', 'For multi-pin connectors (Harting, D-sub, Deutsch)']]) +
      H('Good crimping practice') + L(['Use the lug / ferrule size matching the conductor size – never fold extra strands or cut strands off.', 'Strip length = barrel length; no bare conductor outside the barrel, no insulation inside.', 'Use the matching die and complete the full ratchet cycle.', '<b>Pull test</b> every crimp by hand.', 'Use ferrules on fine-stranded conductors in screw terminals.', 'Use tinned copper lugs in marine environment.']) + NOTE
    ],
    ['solder', '🔥', 'Soldering & electronics bench', () =>
      L(['Temperature-controlled soldering station with assorted tips.',
        'Desoldering pump and wick (braid); hot-air station for SMD work.',
        'Solder (lead-free and Sn60/Pb40 for repair work), flux pen, isopropyl alcohol (IPA) for cleaning.',
        'Fume extractor.',
        '<b>ESD protection</b>: anti-static mat, wrist strap, ESD bags for PCBs and spare cards.',
        'Magnifier lamp, tweezers, small vice / PCB holder.',
        'Conformal coating spray for repaired boards in humid areas.',
        'Bench multimeter and component tester.']) +
      H('Tips') + L(['Handle PLC, VFD and control cards by the edges and only with ESD protection.', 'Most ship electronic repairs are board replacements – keep failed boards for repair / exchange with the maker.']) + NOTE
    ],
    ['power', '🔨', 'Power tools & drilling', () =>
      TB(['Tool', 'Notes'], [
        ['Cordless drill / driver (2 batteries)', 'With HSS and step-drill set'],
        ['Hole saws & knockout punch set (hydraulic)', 'Clean holes for cable glands in enclosures (M16–M63)'],
        ['Angle grinder', 'Hot-work permit; cutting discs and flap discs'],
        ['Jigsaw / multi-tool', 'Panel cut-outs'],
        ['Rotary tool (Dremel type)', 'Small cut-outs and finishing'],
        ['Heat gun', 'Heat-shrink, drying'],
        ['Rivet gun, tap & die set', 'Mounting rails and brackets']]) +
      L(['Use portable tools only from RCD-protected or low-voltage supplies, or cordless.', 'Check cables and plugs of portable tools regularly (portable appliance test) and record.', 'Hot work, sparks and drilling in hazardous areas need a permit and gas testing.']) + NOTE
    ],
    ['cable', '🧵', 'Cable pulling & glanding tools', () =>
      L(['Fish tape / draw wire and cable pulling sock (grip).',
        'Cable rollers and guides to protect cables at bends.',
        'Cable lubricant for long pulls and multi-cable transits.',
        'Armour / braid cutter and gland spanners (correct sizes).',
        '<b>Ex gland kit</b>: barrier glands with compound, correct seals, Ex stopping plugs.',
        'Multi-cable transit (MCT, e.g. Roxtec type) tools: lubricant, compression tools, spare modules and sealing blocks.',
        'Cable ties (UV-resistant and stainless steel for outside), tie gun, cable markers.',
        'Cable drum stand for larger cables.']) +
      H('Tips') + L(['Respect the minimum bending radius (typically 6–8 × cable diameter for power cables; per maker).', 'Separate power and signal cables; cross at 90°.', 'Every penetration that is opened must be resealed to its fire / watertight rating – an open transit is a common survey finding.']) + NOTE
    ],
    ['bench', '🔬', 'Test bench setup', () =>
      L(['Bench supply from an <b>isolation transformer</b> with RCD protection.',
        'Variable AC supply (variac) 0–250 V for testing coils, lamps, transformers.',
        'Bench DC power supply 0–30 V / 5 A (current-limited) and a fixed 24 V DC supply for relays, sensors and PLC I/O.',
        'Series lamp (light-bulb) tester for first power-up of a repaired unit.',
        'Signal sources: loop calibrator, function generator.',
        'Small PLC / relay test board for checking spare modules.',
        'Motor test connection with protection for small motors.',
        'Good lighting, non-conductive bench top, rubber mat on the floor, emergency stop.']) +
      H('Tips') + L(['Label the bench supplies with voltage and maximum current.', 'Test spare modules on arrival – not when you need them in an emergency.']) + NOTE
    ],
    ['consum', '📦', 'Consumables & stock list', () =>
      TB(['Item', 'Typical stock'], [
        ['Insulated & non-insulated lugs (tinned copper)', 'All common sizes 0.5–240 mm²'],
        ['Bootlace ferrules', '0.25–16 mm²'],
        ['Heat-shrink tubing (incl. adhesive-lined)', 'Assorted sizes and colours'],
        ['Tapes', 'PVC (colours), self-amalgamating, glass-cloth, aluminium'],
        ['Cable ties & mounts', 'Plastic UV-resistant and stainless steel'],
        ['Cable markers & labels', 'Printed sleeves / label printer tapes'],
        ['Contact cleaner, IPA, dielectric grease', 'Silicone-free products near gas detectors'],
        ['Fuses', 'All types and ratings used on board (HRC, glass, semiconductor)'],
        ['Lamps / LED tubes / indicator lamps', 'Per lighting survey'],
        ['Relays, contactors, terminal blocks, DIN rail, MCBs', 'Most common types'],
        ['Cable glands & blanking plugs (incl. Ex-certified)', 'M16–M63'],
        ['Batteries', 'For instruments, torches, handheld radios'],
        ['Cleaning cloths, brushes, vacuum cleaner (ESD-safe)', 'Switchboard cleaning']]) +
      L(['Keep a minimum / re-order level for each item and check monthly.', 'Order early – deliveries offshore take time.']) + NOTE
    ],
    ['org', '🗂️', 'Workshop organisation & tool control', () =>
      L(['<b>Shadow boards</b> and labelled drawers – a missing tool is seen immediately.',
        '<b>Tool register</b> for instruments and special tools (serial no., calibration date, location).',
        'Tool check-out / check-in for work at height or near open machinery (dropped-object and FOD prevention).',
        '<b>Red-tag</b> and remove damaged tools and instruments immediately.',
        'Keep the workshop dry: dehumidifier or heater, closed cabinets; light oil / corrosion inhibitor on steel tools.',
        'Store electronic spares in ESD bags, dry and labelled; use silica gel in boxes.',
        'Separate shelf for critical spares (generator AVR, governor, PLC CPU, VFD cards) – labelled and checked.',
        'First-in-first-out for consumables with shelf life (compounds, batteries, adhesives).',
        'Secure everything for sea – heavy items low, drawers latched.',
        'Keep manuals, drawings and a laptop with configuration software in the workshop or electrical office.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Workshop Tools for ETO', icon: '🔧', accent: '#64748b',
    subtitle: 'The workshop tools an ETO should have on board – hand tools, crimping, soldering, power tools, cable tools, test bench, consumables and workshop organisation.',
    refs: ['IEC 60900', 'IEC 61340 (ESD)', 'EN 50110'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
