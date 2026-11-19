(function () {
  const { R, lvl, esc, fmt } = ETO;
  const n0 = x => fmt(x, 0), n1 = x => fmt(x, 1);
  const STATE = [['on', 'On line'], ['sb', 'Standby (auto)'], ['off', 'Off / not available']];
  ETO.page({
    title: 'PMS / DP / Blackout Simulator', icon: '🔄', accent: '#be123c',
    subtitle: '“What happens if…” – step-by-step power-management logic, spinning reserve, DP worst-case failure and blackout recovery timelines.',
    refs: ['IEC 60092-301', 'SOLAS II-1/42-44', 'IMO MSC.1/Circ.1580 (DP)', 'Class PMS rules'],
    calcs: [
      {
        id: 'trip', icon: '💥', title: '“What if DG trips?” simulator', report: true,
        desc: 'Set the generators, the load and the PMS preferential-trip (load-shedding) stages, choose which generator trips, and follow the PMS sequence step by step.',
        formula: 'Loading = load / Σ online rating → shed stages until ≤ 100 % → start standby → restore stages while ≤ restore level',
        inputs: [
          { k: 'dg', t: 'table', l: 'Generators', v: [{ n: 'DG1', kw: 1600, st: 'on' }, { n: 'DG2', kw: 1600, st: 'on' }, { n: 'DG3', kw: 1600, st: 'sb' }, { n: 'DG4', kw: 1600, st: 'off' }], cols: [{ k: 'n', l: 'Name', t: 'text', d: 'DG' }, { k: 'kw', l: 'Rated kW', t: 'num', d: 1600 }, { k: 'st', l: 'State', t: 'sel', opts: STATE, d: 'sb' }] },
          { k: 'load', l: 'Plant load before the event', u: 'kW', v: 1700, min: 0 },
          { k: 'trip', t: 'text', l: 'Generator that trips (name)', v: 'DG1' },
          { k: 'pt', t: 'table', l: 'Preferential-trip stages (shed in this order)', v: [{ n: 'Stage 1 – HVAC / galley / laundry', kw: 280, t: 2 }, { n: 'Stage 2 – workshop / deck cranes', kw: 350, t: 5 }, { n: 'Stage 3 – non-essential pumps', kw: 200, t: 10 }], cols: [{ k: 'n', l: 'Stage', t: 'text', d: 'Stage', w: 220 }, { k: 'kw', l: 'kW', t: 'num', d: 0 }, { k: 't', l: 'Delay s', t: 'num', d: 5, w: 60 }] },
          { k: 'ts', l: 'Standby start + synchronise + close time', u: 's', v: 40, min: 1 },
          { k: 'ol', l: 'Generator short-time overload capability', u: '%', v: 110, min: 100, max: 150, hint: 'Above this, the remaining DGs trip (blackout) before shedding completes' },
          { k: 'rs', l: 'Restore shed loads while loading ≤', u: '%', v: 85, min: 10, max: 100 }
        ],
        run: v => {
          const dg = v.dg.map(d => ({ ...d })), t = dg.find(d => d.n.trim().toLowerCase() === String(v.trip).trim().toLowerCase());
          if (!t || t.st !== 'on') throw new Error('Enter the name of a generator that is ON LINE');
          const cap = () => dg.filter(d => d.st === 'on').reduce((s, d) => s + d.kw, 0);
          const tl = []; let load = v.load, time = 0, shed = [], black = false;
          const push = (ev, s) => tl.push({ time, ev, cap: cap(), load, pct: cap() ? load / cap() * 100 : Infinity, s });
          push('Normal operation', lvl(load / cap() * 100, 85, 100));
          t.st = 'trip'; push(`⚡ ${t.n} trips – its ${n0(t.kw)} kW transfers to the remaining generators`, lvl(load / Math.max(cap(), 1) * 100, 85, 100));
          if (cap() === 0) { black = true; time = 0; push('⛔ No generator left on line → BLACKOUT', 'bad'); }
          else if (load / cap() * 100 > v.ol) { black = true; push(`⛔ Loading ${n0(load / cap() * 100)} % exceeds overload capability ${v.ol} % → remaining DG(s) trip on overcurrent / under-frequency → BLACKOUT`, 'bad'); }
          else {
            for (const st of v.pt) { if (load / cap() <= 1) break; time = st.t; load = Math.max(0, load - st.kw); shed.push(st); push(`🔻 Preferential trip: ${st.n} (−${n0(st.kw)} kW)`, lvl(load / cap() * 100, 95, 100)); }
            if (load / cap() > 1) { black = true; push('⛔ All shedding stages used, still overloaded → BLACKOUT risk', 'bad'); }
          }
          if (black) {
            // remaining sets tripped on overload / under-frequency – healthy, so the PMS blackout-recovery recloses them with the standby set(s)
            dg.forEach(d => { if (d.st === 'on') d.st = 'rec'; });
            load = 0; time = Math.max(time, 1); push('⛔ BLACKOUT – all main generator breakers open', 'bad');
            const rec = dg.filter(d => d.st === 'rec' || d.st === 'sb');
            if (!rec.length) push('No generator available for recovery – emergency generator only', 'bad');
            else {
              time = v.ts; rec.forEach(d => (d.st = 'on'));
              const all = v.pt.reduce((s, x) => s + x.kw, 0); load = Math.max(0, v.load - all); shed = v.pt.slice();
              push(`▶ Blackout recovery: ${rec.map(d => d.n).join(' + ')} closed on dead bus; essential loads restarted (${n0(load)} kW)`, lvl(load / cap() * 100, 85, 100));
              for (const st of shed.slice().reverse()) { if ((load + st.kw) / cap() * 100 > v.rs) break; time += 5; load += st.kw; push(`🔺 Restore ${st.n} (+${n0(st.kw)} kW)`, lvl(load / cap() * 100, v.rs, 100)); }
            }
          } else {
            const sb = dg.filter(d => d.st === 'sb');
            if (sb.length) { time = Math.max(time, v.ts); sb[0].st = 'on'; push(`▶ Standby ${sb[0].n} started, synchronised and closed (${n0(sb[0].kw)} kW)`, lvl(load / cap() * 100, 85, 100)); }
            else push('⚠ No standby generator available – plant remains with reduced capacity', 'warn');
            for (const st of shed.slice().reverse()) { if ((load + st.kw) / cap() * 100 > v.rs) break; time += 5; load += st.kw; push(`🔺 Restore ${st.n} (+${n0(st.kw)} kW)`, lvl(load / cap() * 100, v.rs, 100)); }
          }
          const fin = tl[tl.length - 1], unrest = v.load - load;
          const h = ETO.reportHead('PMS event simulation', [['Event', `${t.n} trip at ${n0(v.load)} kW`], ['Result', black ? 'BLACKOUT' : 'Plant survives']]) + `<table class="rt"><thead><tr><th>t (s)</th><th>Event</th><th>Online kW</th><th>Load kW</th><th>Loading %</th></tr></thead><tbody>${tl.map(r => `<tr class="s-${r.s}"><td>${r.time}</td><td><span class="kb">${esc(r.ev)}</span></td><td>${n0(r.cap)}</td><td>${n0(r.load)}</td><td>${isFinite(r.pct) ? n1(r.pct) : '—'}</td></tr>`).join('')}</tbody></table>`;
          return { head: '<span></span>', results: [R('Outcome', black ? 'BLACKOUT' : 'SURVIVES', '', 0, black ? 'bad' : 'ok', true), R('Load shed (max)', shed.reduce((s, x) => s + x.kw, 0), 'kW', 0, shed.length ? 'warn' : 'ok'), R('Not yet restored', unrest, 'kW', 0, unrest > 0 ? 'warn' : 'ok'), R('Final loading', fin.pct, '%', 1, fin.s)],
            verdict: { s: black ? 'bad' : shed.length ? 'warn' : 'ok', t: black ? 'This configuration does not survive a single generator trip – run more generators, reduce load or add / speed-up preferential trips (blackout prevention).' : shed.length ? 'Survives with load shedding – consider running one more DG during critical operations.' : 'Survives without load shedding (N−1 secure).' }, html: h, notes: ['Logic simulation only – real frequency / voltage transients depend on engine response. Use for planning and training, then verify with the PMS functional test.'] };
        }
      },
      {
        id: 'reserve', icon: '🛡️', title: 'Spinning reserve & N−1 check', desc: 'Is there enough reserve on line for the largest step load or the loss of the largest generator?',
        formula: 'Reserve = Σ online − load     N−1 loading = load / (Σ online − largest online DG)',
        inputs: [{ k: 'cap', l: 'Total online rating', u: 'kW', v: 4800, min: 1 }, { k: 'big', l: 'Largest online generator', u: 'kW', v: 1600, min: 0 }, { k: 'load', l: 'Present load', u: 'kW', v: 2900, min: 0 }, { k: 'step', l: 'Largest consumer to be started', u: 'kW', v: 600, min: 0 }, { k: 'lim', l: 'Max allowed loading', u: '%', v: 90, min: 10, max: 110 }],
        run: v => {
          const rsv = v.cap - v.load, n1 = v.cap - v.big > 0 ? v.load / (v.cap - v.big) * 100 : Infinity, step = (v.load + v.step) / v.cap * 100, s1 = lvl(n1, 100, 110), s2 = lvl(step, v.lim, 100);
          return { results: [R('Spinning reserve', rsv, 'kW', 0, rsv >= v.step ? 'ok' : 'bad', true), R('Loading now', v.load / v.cap * 100, '%', 1), R('Loading after largest DG lost', n1, '%', 1, s1, true), R('Loading after starting consumer', step, '%', 1, s2)], verdict: { s: s1 === 'bad' || s2 === 'bad' ? 'bad' : s1 === 'warn' || s2 === 'warn' ? 'warn' : 'ok', t: s1 === 'ok' ? 'N−1 secure.' : 'Not N−1 secure – loss of the largest DG would overload the remaining sets.' } };
        }
      },
      {
        id: 'dp', icon: '🧭', title: 'DP split-bus worst-case failure (WCF)', desc: 'With the bus-tie open, check that either bus alone can provide the thrust power needed to hold position (WCFDI = loss of one bus).',
        formula: 'Available for thrusters on surviving bus = min(generation − hotel, Σ thrusters on bus)  ≥  DP power required',
        inputs: [{ k: 'ga', l: 'Bus A: online generation', u: 'kW', v: 3200, min: 0 }, { k: 'ha', l: 'Bus A: hotel / auxiliary load', u: 'kW', v: 450, min: 0 }, { k: 'ta', l: 'Bus A: thruster rated power (sum)', u: 'kW', v: 3000, min: 0 }, { k: 'gb', l: 'Bus B: online generation', u: 'kW', v: 3200, min: 0 }, { k: 'hb', l: 'Bus B: hotel / auxiliary load', u: 'kW', v: 500, min: 0 }, { k: 'tb', l: 'Bus B: thruster rated power (sum)', u: 'kW', v: 3000, min: 0 }, { k: 'req', l: 'Thruster power needed to hold position (from DP capability / consequence analysis)', u: 'kW', v: 2200, min: 0 }],
        run: v => {
          const avA = Math.max(0, Math.min(v.ga - v.ha, v.ta)), avB = Math.max(0, Math.min(v.gb - v.hb, v.tb)), sA = avB >= v.req ? 'ok' : 'bad', sB = avA >= v.req ? 'ok' : 'bad';
          return { results: [R('Bus A lost → available on B', avB, 'kW', 0, sA, true), R('Bus B lost → available on A', avA, 'kW', 0, sB, true), R('Margin (worst case)', Math.min(avA, avB) - v.req, 'kW', 0, Math.min(avA, avB) >= v.req ? 'ok' : 'bad'), R('Intact available', avA + avB, 'kW', 0)], verdict: { s: sA === 'ok' && sB === 'ok' ? 'ok' : 'bad', t: sA === 'ok' && sB === 'ok' ? 'Position can be held after the worst-case failure (loss of either bus).' : 'Worst-case failure exceeds the capability of the surviving bus – change the operating mode (more DGs, reduce hotel load) or reduce the operation limits per the ASOG / CAMO.' }, notes: ['Planning aid only – the vessel\'s FMEA, ASOG and DP capability plots govern.'] };
        }
      },
      {
        id: 'bo', icon: '🌑', title: 'Blackout & emergency recovery timeline', report: true, desc: 'Sequence after a total loss of main power: transitional source, emergency generator, then main-plant recovery.',
        formula: 'SOLAS II-1/43-44: emergency generator on load ≤ 45 s; transitional source ≥ 30 min',
        inputs: [{ k: 'edg', l: 'Emergency generator: blackout → ESB energised', u: 's', v: 25, min: 1 }, { k: 'mdg', l: 'Main DG: blackout start → breaker closed (dead bus)', u: 's', v: 35, min: 1 }, { k: 'steps', l: 'Sequential restart steps', v: 5, min: 0, step: 1 }, { k: 'dt', l: 'Interval between restart steps', u: 's', v: 5, min: 0 }, { k: 'ups', l: 'Transitional source (UPS / battery) autonomy', u: 'min', v: 30, min: 0 }, { k: 'bt', l: 'Bus-tie / EDG back-feed changeover time', u: 's', v: 5, min: 0 }],
        run: v => {
          const ok45 = v.edg <= 45, okups = v.ups >= 30, t = [];
          t.push([0, 'Blackout – main switchboard dead; transitional source (UPS / battery) supplies emergency lighting, alarms, radio, navigation', 'warn']);
          t.push([v.edg, 'Emergency generator started and emergency switchboard energised', ok45 ? 'ok' : 'bad']);
          t.push([v.mdg, 'Main DG on dead bus – main switchboard energised', 'ok']);
          let tm = v.mdg; for (let i = 1; i <= v.steps; i++) { tm += v.dt; t.push([tm, `Sequential restart step ${i} (steering, LO / cooling pumps, compressors, …)`, 'ok']); }
          t.push([tm + v.bt, 'Emergency switchboard transferred back to main supply / EDG stopped after cool-down', 'ok']);
          const h = ETO.reportHead('Blackout recovery timeline', []) + `<table class="rt"><thead><tr><th>t (s)</th><th>Event</th></tr></thead><tbody>${t.map(r => `<tr class="s-${r[2]}"><td>${r[0]}</td><td><span class="kb">${esc(r[1])}</span></td></tr>`).join('')}</tbody></table>`;
          return { head: '<span></span>', results: [R('Emergency power restored at', v.edg, 's', 0, ok45 ? 'ok' : 'bad', true), R('Main power restored at', v.mdg, 's', 0), R('Full plant restored at', tm, 's', 0), R('Transitional source', v.ups, 'min', 0, okups ? 'ok' : 'bad')], verdict: { s: ok45 && okups ? 'ok' : 'bad', t: !ok45 ? 'Emergency generator takes longer than 45 s – not SOLAS compliant; check start system / auto-start logic.' : !okups ? 'Transitional source below 30 min.' : 'Recovery sequence meets the SOLAS time limits.' }, html: h };
        }
      },
      {
        id: 'rocof', icon: '📉', title: 'Generator frequency dip (screening)', desc: 'Initial rate of change of frequency after a load step or the loss of a generator, from the inertia constant – a quick screen, not a dynamic study.',
        formula: 'ROCOF = f₀ × ΔP / (2 × H × S)     dip ≈ ROCOF × governor response time',
        inputs: [{ k: 'f', l: 'Frequency', u: 'Hz', v: 60, min: 1 }, { k: 's', l: 'Remaining online rating (kVA)', u: 'kVA', v: 4000, min: 1 }, { k: 'h', l: 'Inertia constant H (engine + alternator)', u: 's', v: 1.0, min: 0.1, step: 0.1, hint: 'Typical diesel gen-sets 0.5–2 s' }, { k: 'dp', l: 'Load step / lost generation', u: 'kW', v: 800, min: 0 }, { k: 'tr', l: 'Governor / engine response time', u: 's', v: 0.5, min: 0, step: 0.1 }],
        run: v => {
          const rocof = v.f * v.dp / (2 * v.h * v.s), dip = rocof * v.tr, pct = dip / v.f * 100, st = lvl(pct, 5, 10);
          return { results: [R('Initial ROCOF', rocof, 'Hz/s', 2, null, true), R('Estimated dip', dip, 'Hz', 2), R('Estimated dip', pct, '%', 1, st, true), R('Lowest frequency', v.f - dip, 'Hz', 2)], verdict: { s: st, t: st === 'bad' ? 'Exceeds ±10 % transient limit (IEC 60092-301) – under-frequency trips and blackout likely.' : st === 'warn' ? 'Large dip – check under-frequency load-shedding settings.' : 'Within transient limits (screening).' }, notes: ['Linear screening ignores load-frequency dependency and governor dynamics – real dips are usually smaller. A dynamic study / load-step test governs.'] };
        }
      }
    ]
  });
})();
