(function () {
  const { R, lvl, esc } = ETO;
  const SST = [['ok', '✅ Done'], ['na', 'N/A'], ['nd', '⏳ Not done']];
  const checklist = (id, icon, title, items, desc) => ({
    id, icon, title, report: true, desc,
    inputs: [{ k: 'job', t: 'text', l: 'Equipment / job', v: '' }, { k: 'ptw', t: 'text', l: 'Permit / isolation certificate no.', v: '' }, { k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'tbl', t: 'table', l: 'Steps (in order)', v: items.map(t => ({ item: t, st: 'nd', by: '' })), cols: [{ k: 'item', l: 'Step', t: 'text', d: '', w: 380 }, { k: 'st', l: 'Status', t: 'sel', opts: SST, d: 'nd' }, { k: 'by', l: 'By / remark', t: 'text', d: '', w: 140 }] }],
    run: v => {
      const nd = v.tbl.filter(r => r.st === 'nd');
      const h = ETO.reportHead(title, [['Equipment / job', v.job], ['Permit no.', v.ptw], ['Date', v.date]]) + `<table class="rt"><thead><tr><th>#</th><th>Step</th><th>Status</th><th>By / remark</th></tr></thead><tbody>${v.tbl.map((r, i) => `<tr class="${r.st === 'ok' ? 's-ok' : r.st === 'nd' ? 's-warn' : ''}"><td>${i + 1}</td><td><span class="kb">${esc(r.item)}</span></td><td>${SST.find(s => s[0] === r.st)[1]}</td><td>${esc(r.by)}</td></tr>`).join('')}</tbody></table><div class="sign"><div>Authorised person</div><div>Competent person doing the work</div></div>`;
      return { head: '<span></span>', results: [R('Steps open', nd.length, '', 0, nd.length ? 'bad' : 'ok', true)], verdict: nd.length ? { s: 'bad', t: `STOP – ${nd.length} step(s) not complete. Do not start work until every step is done or marked N/A.` } : { s: 'ok', t: 'All steps complete – safe to start work under the permit.' }, html: h };
    }
  });
  ETO.page({
    title: 'Electrical Safety & Isolation', icon: '🦺', accent: '#b91c1c',
    subtitle: 'Safe isolation, lock-out / tag-out, high-voltage switching, stored-energy discharge and touch-voltage checks. Every checklist prints as a record.',
    refs: ['IEC 60364-4-41', 'IEC 60204-1', 'EN 50110-1', 'IEC 61243-3 (voltage detectors)', 'Company SMS / PTW'],
    calcs: [
      checklist('loto', '🔒', 'LV safe isolation & LOTO checklist', ['Identify equipment and ALL energy sources (incl. back-feed, UPS, heaters, control supplies)', 'Inform OOW / Chief Engineer, permit-to-work issued', 'Switch off and open the isolator / breaker (rack out if withdrawable)', 'Lock off with personal padlock and attach danger tag', 'Isolate auxiliary / heater / control supplies', 'Prove the voltage detector on a known live source (or proving unit)', 'Test for dead: all phases phase-phase and phase-earth at the point of work', 'Re-prove the voltage detector on the known source', 'Discharge capacitors / stored energy (VFD DC link: wait & measure)', 'Apply earths if required (HV / long cables)', 'Barriers and signs around the work area'], 'Step-by-step safe isolation (EN 50110 / “dead-working” principle): isolate, secure, prove dead.'),
      checklist('hv', '⚡', 'HV switching & isolation checklist (> 1 kV)', ['Switching programme written and approved by authorised person', 'Single-line diagram checked; points of isolation identified', 'Switch off – confirm open on mechanical indicator', 'Rack breaker to isolated / test position and lock shutters', 'Lock and tag all points of isolation; keys in key-safe', 'Prove HV voltage indicator (proving unit / known live)', 'Test for dead on all phases at point of work', 'Re-prove the HV indicator', 'Apply circuit main earths (earthing switch / portable earths)', 'Issue sanction-for-work / permit; brief the team', 'Area barriered and signed; arc-flash PPE worn for switching'], 'High-voltage work needs an authorised person, a written switching programme and circuit earths.'),
      checklist('ptw', '📝', 'Electrical permit-to-work checklist', ['Job description and scope clear', 'Risk assessment / JSA reviewed with the team', 'Toolbox talk held', 'Isolation certificate attached and verified', 'Competent persons assigned; numbers known', 'Test equipment calibrated (CAT rating suitable)', 'PPE: insulating gloves, face shield / arc-rated clothing as required', 'Emergency arrangements (rescue, first aid, CPR / AED) known', 'Permit displayed at the work site', 'On completion: earths removed, tools cleared, permit cancelled, equipment tested before return to service'], 'Pre-start verification for electrical work.'),
      {
        id: 'disch', icon: '⏳', title: 'Capacitor / DC-link discharge time', desc: 'Time for a capacitor (VFD DC link, PF capacitor, cable) to discharge through its bleed resistor to a safe level.',
        formula: 'V(t) = V₀·e^(−t/RC)     t = RC·ln(V₀/V_safe)     IEC 60204-1: ≤ 60 V within 5 s for accessible parts',
        inputs: [{ k: 'v0', l: 'Initial voltage', u: 'V', v: 650, min: 0.001 }, { k: 'c', l: 'Capacitance', u: 'µF', v: 9400, min: 0.000001 }, { k: 'r', l: 'Discharge (bleed) resistance', u: 'kΩ', v: 47, min: 0.000001 }, { k: 'vs', l: 'Safe voltage', u: 'V', v: 50, min: 0.001 }, { k: 'tw', l: 'Waiting time on the label / procedure', u: 'min', v: 5, min: 0 }],
        run: v => {
          const tau = v.r * 1e3 * v.c * 1e-6, t = v.v0 > v.vs ? tau * Math.log(v.v0 / v.vs) : 0, rem = v.v0 * Math.exp(-v.tw * 60 / tau), st = rem <= v.vs ? 'ok' : 'bad';
          return { results: [R('Time constant τ', tau, 's', 1), R('Time to safe voltage', t, 's', 0, null, true), R('Time to safe voltage', t / 60, 'min', 1), R('Voltage after waiting time', rem, 'V', 1, st, true), R('Stored energy', 0.5 * v.c * 1e-6 * v.v0 ** 2, 'J', 0)], verdict: { s: st, t: st === 'ok' ? 'Waiting time sufficient – STILL measure DC+ to DC− before touching.' : 'Waiting time NOT sufficient – bleed resistor may be failed or capacitance larger. Measure and wait.' } };
        }
      },
      {
        id: 'touch', icon: '✋', title: 'Touch voltage during an earth fault', desc: 'Voltage on an exposed metal part when an earth-fault current flows through the protective conductor.',
        formula: 'U_touch = I_f × R_PE     limit U_L = 50 V AC / 120 V ripple-free DC (IEC 60364-4-41)',
        inputs: [{ k: 'if', l: 'Earth-fault current', u: 'A', v: 600, min: 0 }, { k: 'rpe', l: 'Protective conductor resistance (fault to main earth)', u: 'Ω', v: 0.12, min: 0 }, { k: 'ac', l: 'Supply', opts: [['ac', 'AC'], ['dc', 'DC']], v: 'ac' }, { k: 'tdis', l: 'Disconnection time', u: 's', v: 0.4, min: 0 }],
        run: v => {
          const u = v.if * v.rpe, ul = v.ac === 'ac' ? 50 : 120, st = u <= ul ? 'ok' : v.tdis <= 0.4 ? 'warn' : 'bad';
          return { results: [R('Touch voltage', u, 'V', 1, st, true), R('Conventional limit', ul, 'V', 0)], verdict: { s: st, t: u <= ul ? 'Below the conventional touch-voltage limit.' : v.tdis <= 0.4 ? 'Above U_L – acceptable only because disconnection is fast; consider supplementary bonding.' : 'Above U_L with slow disconnection – improve bonding / PE size or use RCD.' } };
        }
      },
      {
        id: 'ptp', icon: '🧪', title: 'Prove – test – prove (voltage detector) procedure', inputs: [], run: () => ({ results: [] }), desc: 'The correct way to test for dead.',
        html: `<ol class="steps"><li><b>Select</b> a voltage detector to IEC 61243-3 (two-pole tester) with suitable CAT rating (CAT III / IV for switchboards) and fused leads. Multimeters on the wrong range are a common cause of accidents.</li><li><b>Prove</b> the detector on a known live source or a proving unit.</li><li><b>Test</b> the isolated circuit: every phase to every phase, every phase to neutral and to earth, at the point of work.</li><li><b>Prove</b> the detector again on the known source – confirms it did not fail during the test.</li><li>If any voltage is found: <b>STOP</b>, do not work, investigate the isolation.</li><li>For capacitive / induced voltages on long cables: apply earths before work.</li></ol>`
      },
      {
        id: 'arc', icon: '🔥', title: 'Arc-flash – what this toolkit does NOT calculate', inputs: [], run: () => ({ results: [] }), desc: 'Why there is no incident-energy calculator here.',
        html: `<p>Arc-flash incident energy (IEEE 1584-2018) depends on electrode configuration, enclosure size, gap, bolted fault current and the exact protective-device clearing time. A simplified calculator can be dangerously wrong in either direction, so it is <b>not</b> provided here.</p><ul class="steps"><li>Use the vessel\'s arc-flash study / labels on the switchboard where available.</li><li>Prefer dead working. Where live work is unavoidable, follow the company live-work procedure and the PPE category on the label.</li><li>Reduce risk: maintenance mode on ACB trip units, remote racking / switching, closed-door switching.</li><li>The <b>Short-circuit & Protection</b> page gives the fault current and clearing times that feed an arc-flash study.</li></ul>`
      }
    ]
  });
})();
