(function () {
  const { R, esc } = ETO;
  const TCL = [['T1', 450], ['T2', 300], ['T3', 200], ['T4', 135], ['T5', 100], ['T6', 85]];
  const ZONE = {
    0: ['Ga', '1G', 'Explosive gas atmosphere present continuously or for long periods', ['ia', 'ma', 'da (Ex d in Zone 0 only by special design)', 'op is']],
    1: ['Gb', '2G', 'Likely to occur in normal operation occasionally', ['d / db', 'e / eb', 'ib', 'mb', 'p / pxb, pyb', 'q / qb', 'o / ob', 'op pr', '+ all Zone 0 concepts']],
    2: ['Gc', '3G', 'Not likely in normal operation; if it occurs, only for a short period', ['ec', 'nA / nR / nC (older)', 'ic', 'mc', 'pzc', 'op sh', '+ all Zone 0 & 1 concepts']],
    20: ['Da', '1D', 'Combustible dust cloud continuously / frequently', ['ta', 'ia (dust)', 'ma (dust)']],
    21: ['Db', '2D', 'Dust cloud likely occasionally in normal operation', ['tb', 'ib', 'mb', 'pb', '+ Zone 20 concepts']],
    22: ['Dc', '3D', 'Dust cloud not likely, short duration only', ['tc', 'ic', 'mc', 'pc', '+ Zone 20 & 21 concepts']]
  };
  // typical values – confirm with the SDS / IEC 60079-20-1
  const GAS = [['methane', 'Methane / natural gas', 'IIA', 595], ['propane', 'Propane', 'IIA', 470], ['butane', 'Butane', 'IIA', 365], ['hexane', 'Hexane', 'IIA', 225], ['diesel', 'Diesel / marine gas oil (vapour)', 'IIA', 220], ['gasoline', 'Gasoline / petrol', 'IIA', 280], ['methanol', 'Methanol', 'IIA', 440], ['ammonia', 'Ammonia', 'IIA', 630], ['ethylene', 'Ethylene', 'IIB', 425], ['h2s', 'Hydrogen sulphide', 'IIB', 260], ['hydrogen', 'Hydrogen', 'IIC', 560], ['acetylene', 'Acetylene', 'IIC', 305], ['custom', 'Other (enter group & AIT)', 'IIA', 300]];
  const GORD = { IIA: 1, IIB: 2, IIC: 3 };
  const reqT = ait => (TCL.find(t => t[1] < ait) || ['none', 0]);
  ETO.page({
    title: 'Ex / Hazardous Area', icon: '💥', accent: '#ea580c',
    subtitle: 'Select and verify Ex equipment: zone → EPL → protection concepts, gas group and temperature class, Ex-marking decoder, intrinsic-safety loop check and inspection records.',
    refs: ['IEC 60079-0 / -10-1 / -14 / -17', 'ATEX 2014/34/EU', 'IECEx'],
    calcs: [
      {
        id: 'select', icon: '🎯', title: 'Equipment requirement for a location', desc: 'Required EPL, protection concepts, gas group and temperature class for a zone and gas.',
        formula: 'Equipment max. surface temperature (T-class) < auto-ignition temperature of the gas;  equipment group ≥ gas group (IIC covers IIB & IIA)',
        inputs: [{ k: 'z', l: 'Zone', opts: [[0, 'Zone 0'], [1, 'Zone 1'], [2, 'Zone 2'], [20, 'Zone 20 (dust)'], [21, 'Zone 21 (dust)'], [22, 'Zone 22 (dust)']], v: 1 }, { k: 'g', l: 'Gas / vapour', opts: GAS.map(x => [x[0], x[1]]), v: 'diesel' }, { k: 'cg', l: 'Group (custom gas)', opts: [['IIA', 'IIA'], ['IIB', 'IIB'], ['IIC', 'IIC']], v: 'IIA', show: v => v.g === 'custom' }, { k: 'ait', l: 'Auto-ignition temperature (custom)', u: '°C', v: 300, min: 50, show: v => v.g === 'custom' }],
        run: v => {
          const z = ZONE[v.z], gas = GAS.find(x => x[0] === v.g), grp = v.g === 'custom' ? v.cg : gas[2], ait = v.g === 'custom' ? v.ait : gas[3], dust = v.z >= 20, t = reqT(ait);
          return { results: [R('Required EPL', z[0], '', 0, null, true), R('ATEX category', z[1], '', 0), R('Gas group required', dust ? 'IIIA/IIIB/IIIC (dust type)' : grp + ' or higher', '', 0, null, true), R('Temperature class required', dust ? 'T ≤ (dust ignition temp – margin)' : t[0] + ' (≤ ' + t[1] + ' °C) or better', '', 0, null, true), R('Gas AIT', dust ? '—' : ait, '°C', 0)],
            html: `<h3>Zone ${v.z}: ${esc(z[2])}</h3><p><b>Permitted protection concepts:</b></p><ul class="steps">${z[3].map(c => `<li>Ex ${esc(c)}</li>`).join('')}</ul>`,
            notes: ['Gas data are typical values – use the cargo / product SDS and IEC 60079-20-1. Hazardous-area classification drawings of the vessel govern zone boundaries.', 'Dust: max surface temperature ≤ ⅔ of the cloud ignition temperature and ≤ layer ignition temperature − 75 K (5 mm layer) – IEC 60079-14.'] };
        }
      },
      {
        id: 'decode', icon: '🏷️', title: 'Ex marking decoder & suitability check', desc: 'Paste the Ex marking from the nameplate (e.g. "II 2G Ex db eb IIC T4 Gb") and check it against the location.',
        formula: 'Suitable if EPL ≥ required, group ≥ gas group, T-class temperature < gas AIT',
        inputs: [{ k: 'm', t: 'text', l: 'Ex marking', v: 'II 2G Ex db eb IIB T4 Gb' }, { k: 'z', l: 'Installation zone', opts: [[0, 'Zone 0'], [1, 'Zone 1'], [2, 'Zone 2']], v: 1 }, { k: 'g', l: 'Gas group of the area', opts: [['IIA', 'IIA'], ['IIB', 'IIB'], ['IIC', 'IIC']], v: 'IIA' }, { k: 'ait', l: 'Lowest gas AIT in the area', u: '°C', v: 220, min: 50 }],
        run: v => {
          const s = ' ' + String(v.m).replace(/[(),]/g, ' ') + ' ';
          const epl = (s.match(/\b(G[abc]|D[abc]|M[ab])\b/) || [])[1], grp = (s.match(/\b(IIC|IIB\+H2|IIB|IIA|IIIC|IIIB|IIIA)\b/) || [])[1], tcl = (s.match(/\bT([1-6])\b/) || [])[1], tdust = (s.match(/\bT\s?(\d{2,3})\s?°?C\b/) || [])[1], cat = (s.match(/\b([123])\s?(G|D)\b/) || []).slice(1).join('');
          const conc = (s.match(/\bEx\s+([a-z0-9 ]+?)\s+(?=I{1,3}[ABC]?\b)/i) || [])[1];
          const zoneEpl = { 0: 'Ga', 1: 'Gb', 2: 'Gc' }[v.z], rankE = { Ga: 3, Gb: 2, Gc: 1 }, gOk = grp ? (grp.startsWith('III') ? false : GORD[grp === 'IIB+H2' ? 'IIB' : grp] >= GORD[v.g]) : null; // IIB+H2 treated as IIB (conservative)
          const tMax = tcl ? TCL[tcl - 1][1] : null, tOk = tMax != null ? tMax < v.ait : null, eOk = epl ? (rankE[epl] || 0) >= rankE[zoneEpl] : null;
          const st = x => (x == null ? 'warn' : x ? 'ok' : 'bad'), all = [eOk, gOk, tOk];
          return { results: [R('Protection concept(s)', conc ? 'Ex ' + conc.trim() : 'not found', '', 0), R('EPL', epl || 'not found', '', 0, st(eOk)), R('ATEX category', cat || '—', '', 0), R('Gas group', grp || 'not found', '', 0, st(gOk)), R('Temperature class', tcl ? `T${tcl} (≤ ${tMax} °C)` : tdust ? `T${tdust} °C` : 'not found', '', 0, st(tOk))],
            verdict: all.every(x => x === true) ? { s: 'ok', t: 'Equipment marking is suitable for this location.' } : all.some(x => x === false) ? { s: 'bad', t: 'NOT suitable: ' + [eOk === false && 'EPL too low for the zone', gOk === false && 'gas group too low', tOk === false && 'T-class too hot for the gas'].filter(Boolean).join(', ') + '.' } : { s: 'warn', t: 'Could not read every field – check the marking text.' }, notes: ['Also check the certificate number, special conditions ("X" suffix), ambient range (Ta) and that the installation follows the certificate (glands, IP, cable).'] };
        }
      },
      {
        id: 'is', icon: '🔐', title: 'Intrinsic-safety entity check (loop)', desc: 'Compare the associated apparatus (barrier / isolator) output parameters with the field device input parameters plus the cable.',
        formula: 'Uo ≤ Ui   Io ≤ Ii   Po ≤ Pi   Ci + Ccable ≤ Co   Li + Lcable ≤ Lo',
        inputs: [{ k: 'uo', l: 'Uo (barrier)', u: 'V', v: 28, min: 0 }, { k: 'io', l: 'Io', u: 'mA', v: 93, min: 0 }, { k: 'po', l: 'Po', u: 'W', v: 0.65, min: 0 }, { k: 'co', l: 'Co (for gas group)', u: 'nF', v: 83, min: 0 }, { k: 'lo', l: 'Lo (for gas group)', u: 'mH', v: 4.2, min: 0 },
          { k: 'ui', l: 'Ui (field device)', u: 'V', v: 30, min: 0 }, { k: 'ii', l: 'Ii', u: 'mA', v: 100, min: 0 }, { k: 'pi', l: 'Pi', u: 'W', v: 0.75, min: 0 }, { k: 'ci', l: 'Ci', u: 'nF', v: 10, min: 0 }, { k: 'li', l: 'Li', u: 'mH', v: 0, min: 0 },
          { k: 'len', l: 'Cable length', u: 'm', v: 300, min: 0 }, { k: 'cc', l: 'Cable capacitance', u: 'nF/km', v: 200, min: 0 }, { k: 'lc', l: 'Cable inductance', u: 'mH/km', v: 1, min: 0 }],
        run: v => {
          const Cc = v.cc * v.len / 1000, Lc = v.lc * v.len / 1000, c = [['Uo ≤ Ui', v.uo, v.ui, 'V'], ['Io ≤ Ii', v.io, v.ii, 'mA'], ['Po ≤ Pi', v.po, v.pi, 'W'], ['Ci + Ccable ≤ Co', v.ci + Cc, v.co, 'nF'], ['Li + Lcable ≤ Lo', v.li + Lc, v.lo, 'mH']];
          const ok = c.every(x => x[1] <= x[2]), lmaxC = v.cc ? (v.co - v.ci) / v.cc * 1000 : Infinity, lmaxL = v.lc ? (v.lo - v.li) / v.lc * 1000 : Infinity;
          return { results: [R('Loop', ok ? 'COMPLIANT' : 'NOT COMPLIANT', '', 0, ok ? 'ok' : 'bad', true), R('Max cable length (C limit)', lmaxC, 'm', 0), R('Max cable length (L limit)', lmaxL, 'm', 0)], tables: [{ title: 'Entity comparison', head: ['Check', 'Value', 'Limit', 'Unit', 'Result'], rows: c.map(x => [x[0], fmtN(x[1]), fmtN(x[2]), x[3], x[1] <= x[2] ? '✅' : '⛔']), states: c.map(x => (x[1] <= x[2] ? 'ok' : 'bad')) }], notes: ['When both Ci and Li exceed 1 % of Co / Lo, IEC 60079-14 limits apply to 50 % of Co / Lo – check the barrier certificate. Use Co / Lo for the actual gas group.'] };
        }
      },
      {
        id: 'insp', icon: '📋', title: 'Ex inspection checklist (IEC 60079-17)', report: true, desc: 'Record a visual / close / detailed inspection of an Ex item. Statuses update the summary.',
        inputs: [{ k: 'tag', t: 'text', l: 'Equipment / tag', v: '' }, { k: 'mark', t: 'text', l: 'Ex marking', v: '' }, { k: 'grade', l: 'Inspection grade', opts: [['v', 'Visual'], ['c', 'Close'], ['d', 'Detailed']], v: 'c' }, { k: 'date', t: 'date', l: 'Date', v: '' },
          { k: 'tbl', t: 'table', l: 'Checks', v: ['Equipment appropriate to EPL / zone, group & T-class', 'Circuit identification correct', 'Enclosure, glass and seals undamaged', 'No unauthorised modifications', 'Bolts, glands, blanking elements complete & tight', 'Flamepath gaps / surfaces clean, not painted (Ex d)', 'Cable type & condition correct, no damage', 'Earthing / bonding connections tight', 'IP / gasket condition, no water ingress', 'Lamps / ratings correct (luminaires)', 'Certificate special conditions (X) complied with'].map(t => ({ item: t, st: 'nd', rem: '' })), cols: [{ k: 'item', l: 'Check', t: 'text', d: '', w: 320 }, { k: 'st', l: 'Status', t: 'sel', opts: [['ok', '✅ OK'], ['def', '⛔ Defect'], ['na', 'N/A'], ['nd', '⏳ Not done']], d: 'nd' }, { k: 'rem', l: 'Remark', t: 'text', d: '', w: 180 }] }],
        run: v => {
          const def = v.tbl.filter(r => r.st === 'def'), nd = v.tbl.filter(r => r.st === 'nd').length;
          const h = ETO.reportHead('Ex Equipment Inspection Record', [['Equipment', v.tag], ['Ex marking', v.mark], ['Grade', { v: 'Visual', c: 'Close', d: 'Detailed' }[v.grade]], ['Date', v.date]]) + `<table class="rt"><thead><tr><th>#</th><th>Check</th><th>Status</th><th>Remark</th></tr></thead><tbody>${v.tbl.map((r, i) => `<tr class="${r.st === 'def' ? 's-bad' : r.st === 'ok' ? 's-ok' : ''}"><td>${i + 1}</td><td><span class="kb">${esc(r.item)}</span></td><td>${{ ok: '✅ OK', def: '⛔ Defect', na: 'N/A', nd: '⏳' }[r.st]}</td><td>${esc(r.rem)}</td></tr>`).join('')}</tbody></table><div class="sign"><div>Inspected by (Ex competent person)</div><div>Chief Engineer</div></div>`;
          return { head: '<span></span>', results: [R('Defects', def.length, '', 0, def.length ? 'bad' : 'ok', true), R('Not done', nd, '', 0, nd ? 'warn' : 'ok')], verdict: { s: def.length ? 'bad' : nd ? 'warn' : 'ok', t: def.length ? 'Defects found – equipment must be repaired or isolated; Ex repairs only by competent person / per IEC 60079-19.' : nd ? 'Inspection incomplete.' : 'No defects.' }, html: h };
        }
      },
      {
        id: 'ref', icon: '📘', title: 'Quick reference: T-classes, groups, EPL', inputs: [], run: () => ({ results: [] }),
        html: `<table><tr><th>T-class</th><th>Max surface temp</th></tr>${TCL.map(t => `<tr><td>${t[0]}</td><td>${t[1]} °C</td></tr>`).join('')}</table><p></p>
<table><tr><th>Group</th><th>Representative gas</th><th>Equipment marked … may be used in</th></tr><tr><td>IIA</td><td>Propane</td><td>IIA</td></tr><tr><td>IIB</td><td>Ethylene</td><td>IIB, IIA</td></tr><tr><td>IIC</td><td>Hydrogen, acetylene</td><td>IIC, IIB, IIA</td></tr><tr><td>IIIA / IIIB / IIIC</td><td>Combustible flyings / non-conductive dust / conductive dust</td><td>IIIC covers IIIB & IIIA</td></tr></table><p></p>
<table><tr><th>Zone</th><th>EPL</th><th>ATEX category</th></tr><tr><td>0 / 1 / 2</td><td>Ga / Gb / Gc</td><td>1G / 2G / 3G</td></tr><tr><td>20 / 21 / 22</td><td>Da / Db / Dc</td><td>1D / 2D / 3D</td></tr></table>`
      }
    ]
  });
  function fmtN(x) { return ETO.fmt(x, 'auto'); }
})();
