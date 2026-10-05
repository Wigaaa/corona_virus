(function () {
  const { R, esc, fmt } = ETO;
  const CRIT = [['c', '🟥 Critical'], ['h', '🟧 High'], ['n', '🟨 Normal']];
  const CN = { c: 'Critical', h: 'High', n: 'Normal' };
  ETO.page({
    title: 'Spares & Requisitions', icon: '📦', accent: '#ca8a04',
    subtitle: 'Track critical electrical spares, see what to reorder, and generate clear, professional requisition descriptions in seconds.',
    refs: ['Saved in this browser', 'Copy to purchasing system'],
    calcs: [
      {
        id: 'stock', icon: '📦', title: 'Critical spares stock & reorder list', report: true,
        desc: 'Enter spares with on-board and minimum quantities. Items below minimum are listed for reorder, ranked by criticality and lead time. <b>Stored only in this browser</b> – copy out regularly.',
        inputs: [{ k: 'q', t: 'text', l: '🔍 Search', v: '' }, { k: 'tbl', t: 'table', l: 'Spares', v: [
          { eq: 'Thruster VFD', pn: 'Example-P/N-001', desc: 'Cooling fan assembly', qty: 1, min: 2, cr: 'c', lt: 10, loc: 'ECR store, shelf A3' },
          { eq: 'MSB ACB', pn: 'Example-P/N-002', desc: 'Shunt trip coil 220 VAC', qty: 0, min: 1, cr: 'c', lt: 6, loc: 'Elec. store B1' },
          { eq: 'General', pn: '—', desc: 'Contactor 3-pole 95 A, 230 VAC coil', qty: 3, min: 2, cr: 'h', lt: 3, loc: 'Elec. store C2' },
          { eq: 'Nav lights', pn: '—', desc: 'LED masthead lamp unit', qty: 1, min: 2, cr: 'c', lt: 4, loc: 'Bridge store' }],
          cols: [{ k: 'eq', l: 'Equipment', t: 'text', d: '', w: 120 }, { k: 'pn', l: 'Part no.', t: 'text', d: '', w: 120 }, { k: 'desc', l: 'Description', t: 'text', d: '', w: 200 }, { k: 'qty', l: 'On board', t: 'num', d: 0, w: 60 }, { k: 'min', l: 'Min', t: 'num', d: 1, w: 55 }, { k: 'cr', l: 'Criticality', t: 'sel', opts: CRIT, d: 'n' }, { k: 'lt', l: 'Lead time (weeks)', t: 'num', d: 4, w: 70 }, { k: 'loc', l: 'Location', t: 'text', d: '', w: 120 }] }],
        run: v => {
          const q = String(v.q).toLowerCase(), all = v.tbl.filter(r => !q || Object.values(r).join(' ').toLowerCase().includes(q));
          const rank = r => ({ c: 0, h: 1, n: 2 }[r.cr] * 1000 - r.lt);
          const re = all.filter(r => r.qty < r.min).sort((a, b) => rank(a) - rank(b)), zeroCrit = all.filter(r => r.qty <= 0 && r.cr === 'c').length;
          const html = ETO.reportHead('Spares reorder list', [['Date', new Date().toISOString().slice(0, 10)], ['Items below minimum', re.length]]) + `<table class="rt"><thead><tr><th>Priority</th><th>Equipment</th><th>Part no.</th><th>Description</th><th>On board</th><th>Min</th><th>Order qty</th><th>Lead time</th><th>Location</th></tr></thead><tbody>${re.map(r => `<tr class="${r.cr === 'c' ? 's-bad' : r.cr === 'h' ? 's-warn' : ''}"><td>${(CRIT.find(c => c[0] === r.cr) || ['', ''])[1]}</td><td>${esc(r.eq)}</td><td>${esc(r.pn)}</td><td><span class="kb">${esc(r.desc)}</span></td><td>${r.qty}</td><td>${r.min}</td><td><b>${r.min - r.qty}</b></td><td>${r.lt} wk</td><td>${esc(r.loc)}</td></tr>`).join('') || '<tr><td colspan="9">Nothing below minimum 👍</td></tr>'}</tbody></table>`;
          return { head: '<span></span>', results: [R('Spares listed', all.length, '', 0), R('To reorder', re.length, '', 0, re.length ? 'warn' : 'ok', true), R('Critical items at ZERO stock', zeroCrit, '', 0, zeroCrit ? 'bad' : 'ok', true), R('Longest critical lead time', Math.max(0, ...all.filter(r => r.cr === 'c').map(r => r.lt)), 'weeks', 0)], verdict: zeroCrit ? { s: 'bad', t: `${zeroCrit} critical spare(s) with zero stock – a single failure would stop the equipment until delivery.` } : null, html };
        }
      },
      {
        id: 'rq', icon: '📝', title: 'Requisition description generator', report: true,
        desc: 'Fill in what you know – the tool writes a complete, unambiguous requisition line that purchasing and the vendor can act on without coming back with questions.',
        inputs: [
          { k: 'item', t: 'text', l: 'Item (what is it?)', v: 'Variable frequency drive – complete power unit' }, { k: 'mk', t: 'text', l: 'Manufacturer', v: '' }, { k: 'model', t: 'text', l: 'Model / type', v: '' }, { k: 'pn', t: 'text', l: 'Part / order number', v: '' }, { k: 'sn', t: 'text', l: 'Serial no. of the equipment (for compatibility)', v: '' },
          { k: 'spec', t: 'text', l: 'Ratings / specification', v: '690 V, 3-phase, 60 Hz, 250 kW, IP54, liquid-cooled' }, { k: 'qty', l: 'Quantity', v: 1, min: 1, step: 1 }, { k: 'uom', t: 'text', l: 'Unit', v: 'pcs' },
          { k: 'eq', t: 'text', l: 'For equipment / system / tag', v: 'Thruster No.2 drive' }, { k: 'reason', l: 'Reason', opts: [['fail', 'Replacement of failed part'], ['stock', 'Restore minimum stock'], ['pms', 'Planned maintenance'], ['upg', 'Upgrade / modification'], ['class', 'Class / flag requirement']], v: 'fail' },
          { k: 'why', t: 'text', l: 'Failure / justification details', v: 'existing unit failed with earth-fault trip, power module damaged' },
          { k: 'pr', l: 'Priority', opts: [['urgent', 'URGENT – equipment out of service / safety / class'], ['high', 'HIGH – reduced redundancy'], ['normal', 'NORMAL – stock replenishment']], v: 'urgent' },
          { k: 'cert', l: 'Certificates required', opts: [['none', 'None'], ['coc', 'Certificate of conformity'], ['class', 'Class certificate (e.g. type-approved)'], ['ex', 'Ex / ATEX / IECEx certificate']], v: 'coc' },
          { k: 'deliv', t: 'text', l: 'Delivery to', v: '' }
        ],
        run: v => {
          const reason = { fail: 'Replacement of failed part', stock: 'To restore minimum stock level', pms: 'Required for planned maintenance', upg: 'Required for upgrade / modification', class: 'Required to meet class / flag requirement' }[v.reason];
          const pr = { urgent: 'URGENT', high: 'HIGH', normal: 'NORMAL' }[v.pr], cert = { none: '', coc: 'Supply with certificate of conformity.', class: 'Supply with class certificate / type-approval documentation.', ex: 'Supply with valid Ex certificate (ATEX / IECEx) matching the original marking.' }[v.cert];
          const parts = [v.item, v.spec, v.mk && 'manufacturer ' + v.mk, v.model && 'type ' + v.model, v.pn && 'P/N ' + v.pn].filter(Boolean).join(', ');
          const txt = `${v.qty} ${v.uom} – ${parts}. ${reason} for ${v.eq}${v.why ? ' – ' + v.why : ''}.${v.sn ? ' Equipment serial no. ' + v.sn + ' (please confirm compatibility).' : ''} ${cert} Priority: ${pr}.${v.deliv ? ' Deliver to: ' + v.deliv + '.' : ''}`.replace(/\s+/g, ' ').trim();
          const miss = [!v.mk && 'manufacturer', !v.model && 'model', !v.pn && 'part number'].filter(Boolean);
          return { head: '<span></span>', verdict: miss.length ? { s: 'warn', t: 'Missing: ' + miss.join(', ') + ' – vendors usually need these to quote the correct part.' } : { s: 'ok', t: 'Description is complete.' }, html: ETO.reportHead('Requisition – ' + pr, [['Equipment', v.eq], ['Date', new Date().toISOString().slice(0, 10)]]) + `<h3>Requisition text (copy into the purchasing system)</h3><div class="formula" style="white-space:pre-wrap;color:var(--ink)">${esc(txt)}</div>`, results: [R('Words', txt.split(' ').length, '', 0)], copy: txt };
        }
      },
      {
        id: 'risk', icon: '⏳', title: 'Spare-holding risk (lead time vs failure rate)', desc: 'How many spares to hold so that you do not run out while the replacement is on order (Poisson demand during lead time).',
        formula: 'Demand during lead time λ = N × (L / MTBF);   choose smallest s with P(demand ≤ s) ≥ target',
        inputs: [{ k: 'n', l: 'Number of identical items installed', v: 6, min: 1, step: 1 }, { k: 'mtbf', l: 'MTBF of one item', u: 'years', v: 8, min: 0.01 }, { k: 'lt', l: 'Re-supply lead time', u: 'weeks', v: 10, min: 0.1 }, { k: 'p', l: 'Target availability of a spare', u: '%', v: 95, min: 50, max: 99.99 }],
        run: v => {
          const lam = v.n * (v.lt / 52.18) / v.mtbf; let s = 0, cum = Math.exp(-lam), term = cum; while (cum < v.p / 100 && s < 50) { s++; term *= lam / s; cum += term; }
          return { results: [R('Expected failures during lead time', lam, '', 3), R('Recommended spares on board', s, 'pcs', 0, null, true), R('Probability of not running out', cum * 100, '%', 2)], notes: ['Use maker MTBF data or your own failure history. For safety-critical single items always hold at least one.'] };
        }
      }
    ]
  });
})();
