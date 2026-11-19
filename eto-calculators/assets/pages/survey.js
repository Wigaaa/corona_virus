(function () {
  const { esc } = ETO;
  const H = t => `<h3>${esc(t)}</h3>`;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const TB = (head, rows) => `<table class="rt"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${esc(c)}</b>` : `<span class="kb">${esc(c)}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const NOTE = '<p>Requirements differ by flag, class, vessel type and client. Use this as a practical guide alongside the class survey checklist and company procedures.</p>';

  const S = [
    ['types', '📋', 'Survey & audit types', () =>
      TB(['Type', 'Who', 'Electrical focus'], [
        ['Class annual survey', 'Classification society', 'General condition, emergency power, alarms, safety systems'],
        ['Intermediate / renewal (special) survey', 'Classification society', 'Detailed testing: insulation, generators, switchboards, protection, emergency systems'],
        ['Continuous survey of machinery (CSM)', 'Class (some items credited to chief engineer)', 'Generators, motors and switchboards opened / tested on a rolling cycle'],
        ['Flag state inspection', 'Flag administration', 'SOLAS / MODU Code compliance, certificates'],
        ['Port State Control (PSC)', 'Port authority (Paris / Tokyo MoU, USCG …)', 'Emergency generator, emergency lights, nav lights, fire detection, alarms'],
        ['Vetting / client inspection', 'Charterer / oil major (SIRE, OVID, CMID / eCMID)', 'Maintenance records, critical equipment, competence'],
        ['DP annual trials / FMEA proving', 'DP surveyor / class', 'Redundancy, blackout recovery, UPS, power management'],
        ['ISM internal / external audit', 'Company / flag / class', 'Procedures, records, permits, training']]) + NOTE
    ],
    ['check', '🔍', 'What inspectors usually check', () =>
      TB(['Area', 'Typical checks'], [
        ['Emergency generator', 'Auto start and connection to the emergency switchboard (within 45 s), fuel level, start batteries / air, test records'],
        ['Emergency switchboard', 'Condition, labels, interlocks with main switchboard, feeder test'],
        ['Emergency lighting & low-location lighting', 'All lights working on emergency supply; battery-backed fittings tested'],
        ['Batteries & battery rooms', 'Ventilation working, no ignition sources, charger alarms, condition and records'],
        ['Main switchboard', 'Clean, covers fitted, rubber mats, labels, earth-fault (IMD) readings, synchronising and protection'],
        ['Insulation monitoring', 'Readings on all systems, earth faults followed up'],
        ['Navigation lights', 'Main and spare, failure alarms, supply from two sources'],
        ['Steering gear', 'Power units, changeover, alarms, emergency supply'],
        ['Fire detection & general alarm', 'Detector tests, panel faults, GA / PA audible everywhere'],
        ['Hazardous areas', 'Ex equipment certified and intact, glands, unused entries plugged'],
        ['Shore connection', 'Interlocks, phase sequence indication, earthing'],
        ['Cable installation', 'Penetrations sealed, no damaged cables, no temporary wiring'],
        ['Watertight / fire doors', 'Indicators, alarms, closing from bridge'],
        ['CO₂ / fixed fire-fighting', 'Release alarms, ventilation trips']]) + NOTE
    ],
    ['records', '🗂️', 'Records to have ready', () =>
      L(['Insulation resistance records (trend) for generators, motors, switchboards and cables.',
        'IMD / earth-fault log and the actions taken.',
        'Emergency generator test records (weekly start, periodic on-load test).',
        'Emergency lighting and battery test records.',
        'PMS history for electrical equipment and overdue-job explanation.',
        'Calibration certificates of test instruments.',
        'Ex equipment register and inspection records (IEC 60079-17).',
        'Fire detection / F&amp;G test records.',
        'Protection relay settings and test reports; generator protection and preferential-trip tests.',
        'Electrical drawings up to date (as-built), single-line diagram in the switchboard room.',
        'Permit-to-work and LOTO records.',
        'Training and competence records (HV, Ex, electrical safety).',
        'Outstanding conditions of class / recommendations and their close-out evidence.']) +
      H('Tip') + L(['Prepare a folder (paper or digital) per survey type – when the surveyor asks, you answer in seconds. It builds confidence.']) + NOTE
    ],
    ['findings', '❗', 'Common findings & how to avoid them', () =>
      TB(['Common finding', 'How to avoid'], [
        ['Emergency lights not working', 'Monthly round of all emergency fittings; stock of lamps / batteries'],
        ['Emergency generator not starting automatically / slow', 'Weekly tests, battery and charger checks, fuel and pre-heating'],
        ['Battery room ventilation not working / blocked', 'Include fans and louvres in PMS'],
        ['Earth faults on IMD not rectified', 'Find and remove earth faults promptly; log actions'],
        ['Missing covers, blanking plates, open panels', 'Close up after every job; walk-round check before survey'],
        ['Unsealed cable penetrations / transits', 'Reseal immediately after cable work; transit register'],
        ['Ex equipment damaged, wrong glands, missing stopping plugs', 'Ex inspections per IEC 60079-17; Ex-certified spares only'],
        ['Missing or wrong labels', 'Labelling programme; label printer'],
        ['Navigation light failure alarm not working', 'Test failure alarms regularly'],
        ['Overdue calibration of instruments', 'Calibration register with due dates'],
        ['Temporary wiring / extension cables', 'Remove after use; proper installation for permanent needs'],
        ['Rubber mats missing or damaged in front of switchboards', 'Inspect and replace'],
        ['Drawings not updated', 'Redline and send for as-built after every change'],
        ['Records incomplete', 'Fill PMS and logs at the time of the job']]) + NOTE
    ],
    ['pre', '✅', 'Pre-survey checklist (week before)', () =>
      L(['Read the survey scope / checklist and the outstanding class items.',
        'Test emergency generator auto start and on-load; record.',
        'Check all emergency and low-location lights, navigation lights and their alarms.',
        'Check battery rooms, chargers, batteries and ventilation.',
        'Check IMD readings – find and clear any earth faults.',
        'Walk round switchboards and panels: covers, labels, mats, cleanliness, lamps.',
        'Check Ex equipment in hazardous areas and cable penetrations.',
        'Test fire detection, GA / PA and alarms that are in scope.',
        'Update PMS records and prepare the record folders.',
        'Check instrument calibration validity and charge instrument batteries.',
        'Prepare keys, ladders, torches and access to all spaces.',
        'Brief the electrical team on who does what during the survey.']) + NOTE
    ],
    ['day', '🤝', 'On survey day', () =>
      L(['Accompany the surveyor; bring instruments, keys, drawings and a notebook.',
        'Be <b>honest and factual</b> – if something is not working, say so and explain the plan.',
        'Demonstrate tests confidently and safely; follow permits even when time is short.',
        'Do not argue – ask for the rule reference politely if a finding is unclear.',
        'Fix small items on the spot where possible and safe.',
        'Write down every remark and finding with location.',
        'After the survey: plan corrective actions, close them with evidence (photos, test records) and inform the office.',
        'Record lessons for the next survey in the handover note.']) + NOTE
    ]
  ];
  ETO.page({
    title: 'Survey, Audit & Class Tips', icon: '🧾', accent: '#0f766e',
    subtitle: 'Prepare for class surveys, PSC, vetting and audits – what inspectors usually check, records to have ready, common findings, pre-survey checklist and survey-day tips.',
    refs: ['SOLAS II-1', 'MODU Code', 'ISM Code', 'IEC 60079-17'],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
