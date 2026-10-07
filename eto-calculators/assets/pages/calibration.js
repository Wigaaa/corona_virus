(function () {
  const { R, lvl, esc, fmt } = ETO;
  const n = (x, d) => fmt(x, d == null ? 3 : d);
  ETO.page({
    title: 'Calibration & Loop Check', icon: '✅', accent: '#16a34a',
    subtitle: 'Printable calibration certificates with as-found / as-left errors, switch set-point tests and loop-check sheets.',
    refs: ['IEC 61298', 'ISO/IEC 17025 practice', 'Printable'],
    calcs: [
      {
        id: 'cal5', icon: '✅', title: 'Transmitter calibration record (5-point)', report: true,
        desc: 'Apply the input at each point, record the output as-found (before adjustment) and as-left (after). Error is in % of span; compared with the tolerance.',
        formula: 'Expected = 4 + 16 × (input − LRV)/(URV − LRV) mA     error % span = (measured − expected)/16 × 100',
        inputs: [{ k: 'tag', t: 'text', l: 'Instrument tag', v: 'PT-1201' }, { k: 'desc', t: 'text', l: 'Description', v: 'Fire main pressure transmitter' }, { k: 'mk', t: 'text', l: 'Maker / model / serial', v: '' }, { k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'lrv', l: 'LRV', v: 0 }, { k: 'urv', l: 'URV', v: 16 }, { k: 'u', t: 'text', l: 'Unit', v: 'bar' }, { k: 'tol', l: 'Tolerance', u: '± % span', v: 0.5, min: 0.001 }, { k: 'ref', t: 'text', l: 'Reference instrument & certificate', v: '' },
          { k: 'tbl', t: 'table', l: 'Readings', v: [{ p: 0, af: 4.02, al: 4.00 }, { p: 25, af: 8.05, al: 8.01 }, { p: 50, af: 12.09, al: 12.00 }, { p: 75, af: 16.11, al: 16.01 }, { p: 100, af: 20.14, al: 20.00 }], cols: [{ k: 'p', l: 'Point % of span', t: 'num', d: 0, w: 80 }, { k: 'af', l: 'As-found mA', t: 'num', d: 4 }, { k: 'al', l: 'As-left mA', t: 'num', d: 4 }] }],
        run: v => {
          const span = v.urv - v.lrv; if (span === 0) throw new Error('URV must differ from LRV');
          const rows = v.tbl.map(r => { const inp = v.lrv + r.p / 100 * span, exp = 4 + 0.16 * r.p, ef = (r.af - exp) / 16 * 100, el = (r.al - exp) / 16 * 100; return { p: r.p, inp, exp, af: r.af, al: r.al, ef, el }; });
          const mf = Math.max(...rows.map(r => Math.abs(r.ef))), ml = Math.max(...rows.map(r => Math.abs(r.el))), sf = mf <= v.tol ? 'ok' : 'bad', sl = ml <= v.tol ? 'ok' : 'bad';
          let h = ETO.reportHead('Instrument Calibration Record', [['Tag', v.tag], ['Description', v.desc], ['Maker / model / serial', v.mk], ['Range', `${v.lrv} … ${v.urv} ${v.u} → 4 … 20 mA`], ['Tolerance', '± ' + v.tol + ' % of span'], ['Reference', v.ref], ['Date', v.date]]);
          h += `<table class="rt"><thead><tr><th>Point</th><th>Input (${esc(v.u)})</th><th>Expected mA</th><th>As-found mA</th><th>Error %</th><th>As-left mA</th><th>Error %</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.p} %</td><td>${n(r.inp)}</td><td>${n(r.exp)}</td><td>${r.af}</td><td class="${Math.abs(r.ef) <= v.tol ? '' : 's-bad'}" style="${Math.abs(r.ef) > v.tol ? 'color:var(--bad);font-weight:700' : ''}">${n(r.ef)}</td><td>${r.al}</td><td style="${Math.abs(r.el) > v.tol ? 'color:var(--bad);font-weight:700' : ''}">${n(r.el)}</td></tr>`).join('')}</tbody></table>`;
          h += `<p><b>As-found:</b> ${sf === 'ok' ? 'PASS' : 'FAIL'} (max ${n(mf)} %) &nbsp; · &nbsp; <b>As-left:</b> ${sl === 'ok' ? 'PASS' : 'FAIL'} (max ${n(ml)} %)</p><div class="sign"><div>Calibrated by</div><div>Checked by</div></div>`;
          return { head: '<span></span>', results: [R('As-found max error', mf, '% span', 3, sf, true), R('As-left max error', ml, '% span', 3, sl, true)], verdict: { s: sl === 'bad' ? 'bad' : sf === 'bad' ? 'warn' : 'ok', t: sl === 'bad' ? 'As-left out of tolerance – do not return to service.' : sf === 'bad' ? 'As-found was out of tolerance – instrument adjusted; consider shortening the calibration interval and assessing past readings.' : 'Within tolerance as found and as left.' }, html: h };
        }
      },
      {
        id: 'switch', icon: '🔘', title: 'Pressure / temperature / level switch test', report: true, desc: 'Set-point (trip) and reset test with deadband.',
        formula: 'error = trip − setpoint     deadband = |trip − reset|',
        inputs: [{ k: 'tag', t: 'text', l: 'Switch tag', v: 'PSL-0105 LO pressure low' }, { k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'dir', l: 'Action', opts: [['fall', 'Trips on FALLING value (low switch)'], ['rise', 'Trips on RISING value (high switch)']], v: 'fall' }, { k: 'sp', l: 'Required set-point', v: 2.5 }, { k: 'tol', l: 'Tolerance', u: '±', v: 0.1, min: 0 }, { k: 'u', t: 'text', l: 'Unit', v: 'bar' }, { k: 'trip', l: 'Measured trip value', v: 2.45 }, { k: 'rst', l: 'Measured reset value', v: 2.8 }, { k: 'dbm', l: 'Maximum deadband allowed', v: 0.5, min: 0 }],
        run: v => {
          const e = v.trip - v.sp, db = Math.abs(v.rst - v.trip), ok1 = Math.abs(e) <= v.tol, okd = (v.dir === 'fall' ? v.rst > v.trip : v.rst < v.trip), ok2 = db <= v.dbm, s = ok1 && okd && ok2 ? 'ok' : 'bad';
          const h = ETO.reportHead('Switch Test Record', [['Tag', v.tag], ['Date', v.date], ['Set-point', `${v.sp} ${v.u} ${v.dir === 'fall' ? 'falling' : 'rising'} ± ${v.tol}`], ['Trip / reset measured', `${v.trip} / ${v.rst} ${v.u}`]]) + '<div class="sign"><div>Tested by</div><div>Witness</div></div>';
          return { head: '<span></span>', results: [R('Set-point error', e, v.u, 3, ok1 ? 'ok' : 'bad', true), R('Deadband', db, v.u, 3, ok2 ? 'ok' : 'warn'), R('Reset on correct side', okd ? 'YES' : 'NO', '', 0, okd ? 'ok' : 'bad')], verdict: { s, t: s === 'ok' ? 'Switch within tolerance.' : !okd ? 'Reset is on the wrong side of the trip point – check switch action / wiring (NO vs NC).' : 'Adjust set-point / deadband and retest.' }, html: h };
        }
      },
      {
        id: 'loopchk', icon: '🔗', title: 'Loop check sheet (field → control system)', report: true, desc: 'Inject at the field device and confirm the indication in the control system / alarm panel.',
        formula: 'deviation = displayed − expected (in % of span)',
        inputs: [{ k: 'tag', t: 'text', l: 'Loop tag', v: 'LT-3302 Ballast tank 3P level' }, { k: 'date', t: 'date', l: 'Date', v: '' }, { k: 'lrv', l: 'LRV', v: 0 }, { k: 'urv', l: 'URV', v: 8 }, { k: 'u', t: 'text', l: 'Unit', v: 'm' }, { k: 'tol', l: 'Tolerance', u: '± % span', v: 1, min: 0 },
          { k: 'tbl', t: 'table', l: 'Points (injected mA → displayed value)', v: [{ ma: 4, d: 0.02 }, { ma: 12, d: 4.01 }, { ma: 20, d: 7.98 }], cols: [{ k: 'ma', l: 'Injected mA', t: 'num', d: 12 }, { k: 'd', l: 'Displayed', t: 'num', d: 0 }] },
          { k: 'alm', t: 'area', l: 'Alarms / trips checked (one per line)', v: 'LAL 0.5 m – OK\nLAH 7.5 m – OK', rows: 2 }],
        run: v => {
          const sp = v.urv - v.lrv; if (sp === 0) throw new Error('URV must differ from LRV');
          const rows = v.tbl.map(r => { const exp = v.lrv + (r.ma - 4) / 16 * sp, dev = (r.d - exp) / sp * 100; return { ...r, exp, dev, ok: Math.abs(dev) <= v.tol }; }), ok = rows.every(r => r.ok);
          const h = ETO.reportHead('Loop Check Sheet', [['Loop', v.tag], ['Range', `${v.lrv} … ${v.urv} ${v.u}`], ['Date', v.date]]) + `<table class="rt"><thead><tr><th>Injected mA</th><th>Expected</th><th>Displayed</th><th>Deviation % span</th><th>Result</th></tr></thead><tbody>${rows.map(r => `<tr class="${r.ok ? 's-ok' : 's-bad'}"><td>${r.ma}</td><td>${n(r.exp)}</td><td>${r.d}</td><td>${n(r.dev, 2)}</td><td>${r.ok ? '✅' : '⛔'}</td></tr>`).join('')}</tbody></table><h3>Alarms / trips</h3><p style="white-space:pre-wrap">${esc(v.alm)}</p><div class="sign"><div>Field</div><div>Control room</div></div>`;
          return { head: '<span></span>', verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Loop correct end-to-end.' : 'Deviation – check scaling (LRV/URV) in the control system, wiring and isolator.' }, html: h };
        }
      }
    ]
  });
})();
