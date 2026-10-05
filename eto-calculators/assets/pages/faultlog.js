(function () {
  const { R, esc } = ETO;
  const FAM = [
    ['Overcurrent (OC, F0001-type, "IOC")', 'Output current exceeded the hardware / software limit', 'Short ramps, jammed load, brake not released, motor or cable earth/short, wrong motor data, IGBT/current sensor fault', 'Megger motor + cable (drive disconnected); check brake & mechanics; check ramps & motor data'],
    ['DC over-voltage (OV)', 'DC link above trip level', 'Regeneration (decel, lowering), braking chopper/resistor failed, supply over-voltage', 'Lengthen decel, check resistor Ω & chopper, check supply voltage'],
    ['DC under-voltage / supply loss (UV)', 'DC link below trip level', 'Supply dip, blown input fuse, phase loss, pre-charge fault', 'Measure 3 input phases, fuses, event log of dips'],
    ['Earth / ground fault (GF, EF)', 'Sum of output currents ≠ 0', 'Motor cable or winding insulation, moisture, long cable leakage', 'Megger cable & motor separately; check terminal box'],
    ['Over-temperature (OT, heat-sink)', 'Heat-sink / module too hot', 'Fan failed, filters blocked, cooling water, ambient high, overload', 'Check fans, filters, water flow & temperature, load'],
    ['Motor overload (I²t, OL)', 'Motor thermal model exceeded', 'Overload, wrong motor parameters, self-cooled motor at low speed', 'Compare current with FLC; check parameters'],
    ['Phase loss (output)', 'Motor phase open', 'Loose terminal, output contactor, cable, motor winding open', 'Check output terminals & contactor, winding resistance'],
    ['Communication / fieldbus timeout', 'No telegram from controller', 'Cable, termination, address, PLC stopped, EMC', 'LEDs, termination, address, screen earthing'],
    ['Encoder / feedback fault', 'Speed signal lost / implausible', 'Cable, supply, coupling, PPR parameter', 'Encoder supply, signal, coupling'],
    ['Safe torque off (STO) active', 'Safety input open', 'E-stop chain, safety relay, wiring', 'Check STO inputs & safety circuit – never bridge'],
    ['Power module / desaturation / short circuit', 'IGBT protection operated', 'Output short, failed IGBT, gate driver', 'Megger output; if healthy → module replacement by service'],
    ['Pre-charge / DC charge fault', 'DC link failed to charge in time', 'Pre-charge resistor/contactor, input supply', 'Measure DC rise on power-up, check pre-charge circuit']
  ];
  const ALARM = [
    ['Read & acknowledge', 'Read the full alarm text and time; note equipment, value and any related alarms (first-up).'],
    ['Assess safety', 'Is there a risk to people, DP position, propulsion, fire? Inform OOW / Chief Engineer as per SMS.'],
    ['Check the trend / history', 'Did it build up slowly (degradation) or happen instantly (trip / failure)?'],
    ['Verify locally', 'Confirm the alarm at the equipment: is it real or a sensor / wiring fault?'],
    ['Stabilise', 'Start standby equipment, reduce load, change over – before diagnosing.'],
    ['Diagnose', 'Use the Troubleshooting Assistant; measure rather than guess.'],
    ['Repair & test', 'Repair, test function, monitor after reset.'],
    ['Record', 'Log in this fault log + PMS; raise requisition if spares used.']
  ];
  ETO.page({
    title: 'Fault Log & Knowledge Base', icon: '🗂️', accent: '#475569',
    subtitle: 'Build your own vessel fault-code database from the manuals and past repairs – searchable, printable, saved in your browser. Plus maker-independent fault families and an alarm response routine.',
    refs: ['Your data stays in this browser', 'Maker-independent'],
    calcs: [
      {
        id: 'kb', icon: '🔍', title: 'My fault-code database (searchable)', report: true,
        desc: 'Add rows for every fault code you meet (equipment, maker/model, code, meaning, cause, fix). Type in the search box to filter. Use Copy results to export, or Print. <b>Data is stored only in this browser</b> – copy it out regularly as a backup.',
        inputs: [
          { k: 'q', t: 'text', l: '🔍 Search (code, equipment, maker, words…)', v: '' },
          { k: 'tbl', t: 'table', l: 'Fault entries', v: [
            { eq: 'Thruster 2 VFD', mk: 'Example – replace with your entries', code: 'OC-01', mean: 'Output overcurrent during acceleration', cause: 'Brake not releasing (rectifier failed)', fix: 'Replaced brake rectifier, tested', date: '2025-03-12' },
            { eq: 'DG3 AVR', mk: 'Example', code: 'UV', mean: 'Generator under-voltage after start', cause: 'Rotating diode open', fix: 'Replaced diode bridge + varistor', date: '2024-11-02' }],
            cols: [{ k: 'eq', l: 'Equipment', t: 'text', d: '', w: 130 }, { k: 'mk', l: 'Maker / model', t: 'text', d: '', w: 130 }, { k: 'code', l: 'Code', t: 'text', d: '', w: 80 }, { k: 'mean', l: 'Meaning', t: 'text', d: '', w: 180 }, { k: 'cause', l: 'Cause found', t: 'text', d: '', w: 180 }, { k: 'fix', l: 'Fix', t: 'text', d: '', w: 180 }, { k: 'date', l: 'Date', t: 'text', d: '', w: 95 }] }
        ],
        run: v => {
          const q = String(v.q || '').toLowerCase().trim(), rows = v.tbl.filter(r => !q || Object.values(r).join(' ').toLowerCase().includes(q));
          const html = ETO.reportHead('Fault log' + (q ? ` – search “${v.q}”` : ''), [['Entries', `${rows.length} of ${v.tbl.length}`]]) + `<table class="rt"><thead><tr><th>Equipment</th><th>Maker / model</th><th>Code</th><th>Meaning</th><th>Cause found</th><th>Fix</th><th>Date</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.eq)}</td><td>${esc(r.mk)}</td><td><b>${esc(r.code)}</b></td><td><span class="kb">${esc(r.mean)}</span></td><td><span class="kb">${esc(r.cause)}</span></td><td><span class="kb">${esc(r.fix)}</span></td><td>${esc(r.date)}</td></tr>`).join('') || '<tr><td colspan="7">No match</td></tr>'}</tbody></table>`;
          return { head: '<span></span>', results: [R('Matches', rows.length, '', 0, null, true), R('Total entries', v.tbl.length, '', 0)], html };
        }
      },
      {
        id: 'fam', icon: '🎛️', title: 'Drive fault families (maker-independent)', inputs: [{ k: 'q', t: 'text', l: '🔍 Filter', v: '' }],
        desc: 'Almost every drive maker uses the same fault families under different codes. Find the family from the code text in the manual, then use these causes and checks.',
        run: v => { const q = String(v.q).toLowerCase(), rows = FAM.filter(r => !q || r.join(' ').toLowerCase().includes(q)); return { head: '<span></span>', html: `<table class="rt"><thead><tr><th>Fault family</th><th>Meaning</th><th>Common causes</th><th>First checks</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${esc(r[0])}</b></td>${r.slice(1).map(x => `<td><span class="kb">${esc(x)}</span></td>`).join('')}</tr>`).join('')}</tbody></table>` }; }
      },
      {
        id: 'alarm', icon: '🚨', title: 'Alarm response routine', inputs: [], desc: 'A disciplined 8-step routine for any alarm – keeps the plant safe while you diagnose.',
        run: () => ({ head: '<span></span>', html: `<ol class="steps">${ALARM.map(a => `<li><b>${esc(a[0])}</b> – ${esc(a[1])}</li>`).join('')}</ol>` })
      }
    ]
  });
})();
