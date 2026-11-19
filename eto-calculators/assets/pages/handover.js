(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const PRE = t => `<pre style="white-space:pre-wrap;background:var(--field);color:var(--ink);border:1px solid var(--line);padding:12px;border-radius:10px;font-size:13px;overflow-x:auto">${esc(t)}</pre>`;
  const NOTE = '<p>Follow the company SMS forms and procedures – these tips complement them.</p>';

  const S = [
    ['note', '📝', 'A good handover note', () =>
      `<p>The handover note is the most important document you leave for your relief. A good one lets the incoming ETO work safely from the first hour without calling you.</p>` +
      H('What it must contain') + L([
        '<b>Plant status</b>: generators, switchboards, breakers open / locked, shore connection, systems running in manual or abnormal mode.',
        '<b>Isolations &amp; LOTO</b> in place, open permits and who holds them.',
        '<b>Inhibits, overrides, bypasses &amp; jumpers</b> (alarms, F&amp;G, safety systems) – with reason and the plan to remove them.',
        '<b>Open defects &amp; ongoing faults</b>: symptoms, what was checked, what was found, next steps.',
        '<b>Temporary repairs</b> and what the permanent repair needs.',
        '<b>PMS status</b>: overdue or upcoming jobs, jobs started but not finished.',
        '<b>Spares</b>: ordered, expected, critical items out of stock.',
        '<b>Surveys / audits / class items</b>: dates, outstanding conditions of class, findings to close.',
        '<b>Modifications &amp; software changes</b> made during the tour (with backups and MoC references).',
        '<b>Earth faults / insulation readings</b> that are low or trending down.',
        '<b>Contacts</b>: service engineers, office superintendent, maker support numbers.',
        '<b>Lessons learned &amp; tips</b> specific to this vessel.']) +
      H('Example layout') + PRE(`HANDOVER – ETO            Vessel: ________    Date: ________
Outgoing: ________        Incoming: ________

1. PLANT STATUS
   DG1 ___ DG2 ___ DG3 ___ DG4 ___  EmGen: auto / tested __/__
   Abnormal modes: ...
2. ISOLATIONS / PERMITS OPEN
   Tag no. | Equipment | Reason | Holder
3. INHIBITS / OVERRIDES / JUMPERS
   System | Point | Reason | Since | Plan to remove
4. OPEN DEFECTS & FAULTS
   Equipment | Symptom | Done so far | Next step
5. TEMPORARY REPAIRS
6. PMS – overdue / in progress
7. SPARES – ordered / awaited / critical missing
8. SURVEYS, AUDITS, CLASS ITEMS
9. MODIFICATIONS / SOFTWARE CHANGES (backup location)
10. INSULATION / EARTH-FAULT STATUS
11. CONTACTS
12. NOTES & TIPS

Signed (outgoing): ______   Signed (incoming): ______`) +
      H('Tips') + L(['Walk round the vessel together – show, don’t only write.', 'Prioritise: put safety-critical items first.', 'Keep the note factual, short and readable; attach photos and references.', 'Both sign and keep a copy in the office / shared drive.']) + NOTE
    ],
    ['markup', '🖍️', 'Drawing mark-ups (redlines)', () =>
      L([
        'Mark every change on the <b>master drawing set</b> on board – one controlled set, not loose copies.',
        'Common convention: <b>red = added</b>, <b>green = removed</b>, <b>blue = comments / notes</b> (follow your company standard).',
        'Write clearly: cable numbers, terminal numbers, wire colours, breaker / fuse ratings.',
        'Date, name and reference (work order / MoC) next to each mark-up.',
        'Send mark-ups to the office / design office for <b>as-built</b> update; replace the master set when the revised drawing arrives.',
        'Keep a <b>temporary-jumper / modification register</b> – a jumper that is not on the drawing is a trap for the next ETO.',
        'Photograph terminal rows before disconnecting – the photo is a quick “as-found” record.',
        'Scan marked-up drawings so the change is not lost if the paper copy is damaged.']) + NOTE
    ],
    ['log', '📒', 'Keeping the electrical log', () =>
      H('What to record') + L([
        'Daily rounds: generator loads, switchboard readings, insulation monitor (IMD) readings per switchboard.',
        'Alarms and trips: time, equipment, cause, action taken, who was informed.',
        'Breaker operations on main and emergency switchboards (incl. shore connection).',
        'Emergency generator, emergency lighting and battery tests.',
        'Insulation (megger) tests with temperature, and earth-fault finding.',
        'Major work done, equipment out of service and returned to service.',
        'Abnormal conditions: blackouts, partial blackouts, overloads, harmonic problems.']) +
      H('Good practice') + L(['Write at the time of the event – not from memory at the end of the day.', 'Factual and legible; use 24-hour time and the ship’s time zone.', 'Never erase: strike through with a single line, initial and correct.', 'Keep it consistent with the engine log book and PMS records.', 'The log is evidence in an investigation – write it as if someone will read it later.']) + NOTE
    ],
    ['records', '🗃️', 'Records to keep', () =>
      TB(['Record', 'Why it matters'], [
        ['Insulation resistance records (with trends)', 'Shows deterioration before failure; surveyors check'],
        ['IMD / earth-fault log', 'Proof that earth faults are found and removed'],
        ['Emergency generator & battery test records', 'SOLAS / class requirement'],
        ['PMS records with findings', 'Evidence of maintenance; basis for planning'],
        ['Instrument calibration certificates', 'Validity of every test you record'],
        ['Ex equipment register & inspection records (IEC 60079-17)', 'Safety and audit requirement in hazardous areas'],
        ['F&G / fire detection test records', 'Safety system integrity'],
        ['Protection relay settings & test reports', 'Correct selectivity and trip values'],
        ['Modification / MoC records & jumper register', 'Control of changes'],
        ['Permits & LOTO records', 'Safe work evidence'],
        ['Training & competence (HV, Ex, LOTO)', 'Audit requirement'],
        ['Service engineer reports', 'History of major repairs']]) +
      L(['Keep records organised by system and date, on paper and electronically.', 'Retain records for the period required by the company and class (often at least the survey cycle).']) + NOTE
    ],
    ['label', '🏷️', 'Labelling & cable numbering', () =>
      L([
        'Every cable labelled at <b>both ends</b> with the number from the cable schedule / drawing.',
        'Every core / wire labelled with its terminal or wire number (printed heat-shrink sleeves are durable).',
        'Terminal strips numbered as on the drawing.',
        'Breakers and fuses labelled with the consumer name exactly as in the feeder list and drawing.',
        'Spare ways labelled “SPARE”; disconnected cables made safe (insulated, labelled, coiled).',
        'Warning labels: multiple supplies, capacitors, back-feed, high voltage, UPS outputs.',
        'Replace labels damaged by heat, UV or cleaning.',
        'Use a label printer – hand-written labels fade and are hard to read.']) + NOTE
    ],
    ['backup', '💾', 'Digital backups (PLC, VFD, relays)', () =>
      L([
        'Keep backups of <b>PLC programs, HMI projects, VFD parameters, AVR / governor settings, protection relay settings, network switch configurations</b> and IAS / PMS configurations.',
        'File naming: equipment – tag – date – version (e.g. “VFD_Thruster1_2026-10-05_v3”).',
        'Store in at least <b>two places</b> on board (e.g. electrical office PC + external drive) and one copy with the office.',
        'Take a new backup <b>after every change</b> and before every software update.',
        'Record firmware / software versions and licences / dongles.',
        'VFD keypads can often store a parameter copy – use it as a quick extra backup.',
        'Test that a backup can be opened – a corrupt backup is no backup.',
        'Passwords and engineering laptops are controlled per the vessel cyber-security procedure.',
        'Keep the programming cables and software on board with the backups.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Handover & Documentation Tips', icon: '📝', accent: '#7c3aed',
    subtitle: 'How to write a good handover note, mark up drawings, keep the electrical log, records, labels and digital backups.',
    refs: ['ISM Code', 'Company SMS'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
