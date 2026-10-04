(function () {
  const { R, lvl, S3, esc } = ETO;
  const CAT = [[1, '1 – Vital (safety / blackout recovery)'], [2, '2 – Essential (operation)'], [3, '3 – Non-essential (preferential trip)']];
  ETO.page({
    title: 'Power Plant & Load Balance', icon: '🏭', accent: '#be123c',
    subtitle: 'Jack-up specialist: vessel electrical load balance, PMS thresholds, critical-load analysis, blackout recovery and emergency generator capacity.',
    refs: ['IEC 60092-301', 'SOLAS II-1 Part D', 'IACS UR E', 'Class – PMS / blackout'],
    calcs: [
      {
        id: 'balance', icon: '🧮', title: 'Complete vessel load balance', desc: 'Consumers × operating mode → total demand per mode, DGs needed and N+1 check.',
        formula: 'P_mode = Σ Qty × kW × (use % in mode)     DGs = ⌈P / (P_DG × max loading)⌉',
        inputs: [
          { k: 'dg', l: 'DG rating', u: 'kW', v: 1600, min: 1 }, { k: 'inst', l: 'DGs installed', v: 4, min: 1, step: 1 }, { k: 'max', l: 'Max loading per running DG', u: '%', v: 85, min: 10, max: 100 }, { k: 'pf', l: 'Average PF', v: 0.85, min: 0.3, max: 1, step: 0.01 }, { k: 'dv', l: 'Diversity / demand factor', v: 0.9, min: 0.1, max: 1, step: 0.01 },
          { k: 'tbl', t: 'table', l: 'Consumers (use % in each mode)', v: [
            { n: 'Jacking system', q: 24, kw: 30, j: 100, e: 0, t: 0, p: 0 }, { n: 'Cranes', q: 2, kw: 150, j: 20, e: 60, t: 0, p: 30 }, { n: 'Thrusters / propulsion', q: 4, kw: 1000, j: 0, e: 0, t: 70, p: 0 },
            { n: 'Hydraulic power units', q: 4, kw: 55, j: 50, e: 60, t: 30, p: 30 }, { n: 'Ballast / bilge pumps', q: 4, kw: 45, j: 50, e: 40, t: 20, p: 20 }, { n: 'Fire & seawater pumps', q: 3, kw: 90, j: 30, e: 30, t: 30, p: 30 }, { n: 'Air compressors', q: 3, kw: 45, j: 60, e: 60, t: 60, p: 60 },
            { n: 'HVAC / accommodation', q: 1, kw: 350, j: 100, e: 100, t: 100, p: 100 }, { n: 'Galley / laundry', q: 1, kw: 80, j: 70, e: 70, t: 70, p: 70 }, { n: 'Lighting', q: 1, kw: 150, j: 80, e: 80, t: 80, p: 80 }, { n: 'Nav / comms / control', q: 1, kw: 60, j: 100, e: 100, t: 100, p: 100 }, { n: 'Workshop / welding', q: 1, kw: 80, j: 20, e: 40, t: 5, p: 30 }],
            cols: [{ k: 'n', l: 'Consumer', t: 'text', d: 'Consumer', w: 150 }, { k: 'q', l: 'Qty', t: 'num', d: 1, w: 50 }, { k: 'kw', l: 'kW each', t: 'num', d: 0, w: 70 }, { k: 'j', l: 'Jacking %', t: 'num', d: 0, w: 70 }, { k: 'e', l: 'Elevated %', t: 'num', d: 0, w: 70 }, { k: 't', l: 'Transit %', t: 'num', d: 0, w: 70 }, { k: 'p', l: 'Port %', t: 'num', d: 0, w: 70 }] }
        ],
        run: v => {
          const modes = [['Jacking', 'j'], ['Elevated / working', 'e'], ['Transit / tow', 't'], ['Port / standby', 'p']];
          const rows = [], states = [];
          let worst = 'ok'; let big = 0;
          modes.forEach(([n, k]) => {
            const p = v.tbl.reduce((a, r) => a + r.q * r.kw * r[k] / 100, 0) * v.dv, s = p / v.pf, need = Math.max(1, Math.ceil(p / (v.dg * v.max / 100) - 1e-9)), ld = p / (need * v.dg) * 100, sb = v.inst - need;
            const st = sb >= 1 ? 'ok' : sb === 0 ? 'warn' : 'bad'; if (st === 'bad') worst = 'bad'; else if (st === 'warn' && worst === 'ok') worst = 'warn';
            rows.push([n, p, s, need, ld, Math.max(sb, 0), sb >= 1 ? '✅ N+1' : sb === 0 ? '⚠️ no standby' : '⛔ short']); states.push(st); big = Math.max(big, p);
          });
          return { results: [R('Peak mode demand', big, 'kW', 0, null, true), R('Installed capacity', v.inst * v.dg, 'kW', 0), R('Installed − 1 DG', (v.inst - 1) * v.dg, 'kW', 0, big <= (v.inst - 1) * v.dg ? 'ok' : 'warn')],
            tables: [{ title: 'Load balance by mode', head: ['Mode', 'Demand kW', 'kVA', 'DGs running', 'Loading %', 'Standby DGs', 'Status'], rows, states }], verdict: { s: worst, t: worst === 'ok' ? 'All modes satisfy N+1 with the loading limit.' : worst === 'warn' ? 'Some modes run with no standby DG – verify operating philosophy / class single-failure requirement.' : 'Installed generation is insufficient in at least one mode.' }, notes: ['Edit the consumer list with your vessel\'s load balance document values.'] };
        }
      },
      {
        id: 'pms', icon: '🧠', title: 'PMS load-dependent start / stop', desc: 'Where is the plant relative to PMS thresholds and what will the PMS do?',
        formula: 'Start if load% > start-level   Stop if load after stop (÷ n−1) < stop-level   Heavy consumer permit if (P + P_hc) / (n·P_DG) ≤ limit',
        inputs: [{ k: 'dg', l: 'DG rating', u: 'kW', v: 1600, min: 1 }, { k: 'n', l: 'DGs online', v: 3, min: 1, step: 1 }, { k: 'inst', l: 'DGs installed', v: 4, min: 1, step: 1 }, { k: 'p', l: 'Plant load', u: 'kW', v: 3300, min: 0 }, { k: 'st', l: 'Start standby above', u: '%', v: 80, min: 10, max: 100 }, { k: 'sp', l: 'Stop a DG if remaining load below', u: '%', v: 65, min: 10, max: 100 }, { k: 'pt', l: 'Preferential trip level', u: '%', v: 95, min: 50, max: 120 }, { k: 'hc', l: 'Heavy consumer to start', u: 'kW', v: 400, min: 0 }, { k: 'hl', l: 'Heavy-consumer permit limit', u: '%', v: 85, min: 10, max: 100 }],
        run: v => {
          const cap = v.n * v.dg, ld = v.p / cap * 100, after = v.n > 1 ? v.p / ((v.n - 1) * v.dg) * 100 : Infinity, hc = (v.p + v.hc) / cap * 100;
          const act = ld >= v.pt ? ['bad', 'PREFERENTIAL TRIP – non-essential loads will be shed.'] : ld >= v.st ? (v.n < v.inst ? ['warn', 'START STANDBY DG (loading above start level).'] : ['bad', 'No standby DG available – start level exceeded.']) : after <= v.sp && v.n > 1 ? ['ok', 'Plant could stop one DG (load-dependent stop).'] : ['ok', 'No PMS action – loading in normal band.'];
          return { results: [R('Plant loading', ld, '%', 1, lvl(ld, v.st, v.pt), true), R('Loading if one DG stopped', after, '%', 0, after <= v.sp ? 'ok' : 'warn'), R('With heavy consumer', hc, '%', 1, hc <= v.hl ? 'ok' : 'bad'), R('Spare before start level', Math.max(0, v.st / 100 * cap - v.p), 'kW', 0)],
            verdict: { s: act[0], t: act[1] + (hc > v.hl ? ' Heavy-consumer start would be BLOCKED until another DG is online.' : ' Heavy consumer permitted.') } };
        }
      },
      {
        id: 'crit', icon: '🎯', title: 'Critical-load analysis', desc: 'Which categories can be supplied if generation is reduced (single DG, failed DG, emergency)?',
        formula: 'Supply capacity = n × P_DG × limit    categories added in order Vital → Essential → Non-essential',
        inputs: [{ k: 'cap', l: 'Available generation', u: 'kW', v: 3200, min: 0, hint: 'e.g. 2 DGs after losing 2 of 4' }, { k: 'max', l: 'Max loading', u: '%', v: 90, min: 10, max: 100 },
          { k: 'tbl', t: 'table', l: 'Consumers', v: [{ n: 'Steering / jacking control', kw: 40, c: 1 }, { n: 'Fire pumps', kw: 180, c: 1 }, { n: 'Emergency air compressors', kw: 90, c: 1 }, { n: 'Ballast pumps', kw: 180, c: 2 }, { n: 'Jacking motors', kw: 540, c: 2 }, { n: 'Cranes', kw: 300, c: 2 }, { n: 'Accommodation HVAC', kw: 350, c: 3 }, { n: 'Galley / laundry', kw: 80, c: 3 }, { n: 'Workshop', kw: 80, c: 3 }],
            cols: [{ k: 'n', l: 'Consumer', t: 'text', d: 'Load', w: 160 }, { k: 'kw', l: 'kW', t: 'num', d: 0 }, { k: 'c', l: 'Category', t: 'sel', opts: CAT, d: 2 }] }],
        run: v => {
          const lim = v.cap * v.max / 100; let cum = 0; const rows = [], states = [];
          CAT.forEach(([c, name]) => { const s = v.tbl.filter(r => +r.c === c).reduce((a, r) => a + r.kw, 0); cum += s; rows.push([name, s, cum, cum <= lim ? '✅ supplied' : '⛔ exceeds']); states.push(cum <= lim ? 'ok' : 'bad'); });
          const c1 = rows[0][2], c2 = rows[1][2];
          const st = c1 > lim ? 'bad' : c2 > lim ? 'warn' : 'ok';
          return { results: [R('Supply limit', lim, 'kW', 0), R('Vital load', c1, 'kW', 0, c1 <= lim ? 'ok' : 'bad', true), R('Vital + Essential', c2, 'kW', 0, c2 <= lim ? 'ok' : 'warn'), R('Total demand', cum, 'kW', 0), R('To be shed (preferential trip)', Math.max(0, cum - lim), 'kW', 0, cum > lim ? 'warn' : 'ok')],
            tables: [{ title: 'Cumulative', head: ['Category', 'kW', 'Cumulative kW', 'Result'], rows, states }], verdict: { s: st, t: st === 'ok' ? 'Vital and essential loads can be supplied with this generation.' : st === 'warn' ? 'Essential operations would need to be reduced – shed loads / stop jacking.' : 'Even vital loads cannot be supplied.' } };
        }
      },
      {
        id: 'bo', icon: '🌑', title: 'Blackout recovery sequence', desc: 'Re-energise loads in steps from the first generator; check voltage dip and loading at each step.',
        formula: 'S_step = (kW/PF) × start multiple    dip = S_step / (S_step + n·S_DG/X″d)    loading = ΣkW / (n·P_DG)',
        inputs: [{ k: 'dg', l: 'DG rating', u: 'kW', v: 1600, min: 1 }, { k: 'n', l: 'DGs available at recovery', v: 1, min: 1, step: 1 }, { k: 'pf', l: 'PF', v: 0.8, min: 0.3, max: 1, step: 0.01 }, { k: 'x', l: 'X″d', v: 0.16, min: 0.05, step: 0.01 }, { k: 'lim', l: 'Max voltage dip', u: '%', v: 15, min: 1, max: 40 },
          { k: 'tbl', t: 'table', l: 'Restart sequence', v: [{ n: 'Essential LV board / lighting', kw: 120, m: 1, d: 0 }, { n: 'Steering & control UPS chargers', kw: 40, m: 1, d: 5 }, { n: 'Lube oil / cooling water pumps', kw: 150, m: 6, d: 10 }, { n: 'Air compressors', kw: 90, m: 6, d: 15 }, { n: 'Fire pump 1', kw: 90, m: 6, d: 20 }, { n: 'Ballast pump', kw: 180, m: 6, d: 25 }, { n: 'HVAC', kw: 350, m: 3, d: 35 }, { n: 'Hydraulic power units', kw: 110, m: 6, d: 45 }],
            cols: [{ k: 'n', l: 'Step', t: 'text', d: 'Load', w: 170 }, { k: 'kw', l: 'Running kW', t: 'num', d: 0 }, { k: 'm', l: 'Start multiple', t: 'num', d: 1, w: 70 }, { k: 'd', l: 'Delay s', t: 'num', d: 5, w: 60 }] }],
        run: v => {
          const sg = v.n * v.dg / v.pf, ssc = sg / v.x, cap = v.n * v.dg; let cum = 0; let bad = 0, warn = 0, maxdip = 0, tt = 0;
          const rows = [], states = [];
          v.tbl.forEach((r, i) => {
            const s = r.kw / v.pf * r.m, dip = s / (s + ssc) * 100; cum += r.kw; tt += r.d; const ld = cum / cap * 100;
            const st = ld > 100 || dip > v.lim ? 'bad' : ld > 90 || dip > v.lim * 0.8 ? 'warn' : 'ok'; if (st === 'bad') bad++; if (st === 'warn') warn++; maxdip = Math.max(maxdip, dip);
            rows.push([i + 1, esc(r.n), r.kw, cum, ld, s, dip, st === 'ok' ? '✅' : st === 'warn' ? '⚠️' : '⛔']); states.push(st);
          });
          return { results: [R('Final loading', cum / cap * 100, '%', 0, lvl(cum / cap * 100, 90, 100), true), R('Worst voltage dip', maxdip, '%', 1, lvl(maxdip, v.lim * 0.8, v.lim)), R('Steps failing', bad, '', 0, bad ? 'bad' : 'ok'), R('Total sequence time', tt, 's', 0)],
            tables: [{ title: 'Sequence', head: ['#', 'Step', 'kW', 'Cumulative kW', 'Loading %', 'Start kVA', 'Dip %', ''], rows, states }], verdict: { s: bad ? 'bad' : warn ? 'warn' : 'ok', t: bad ? 'Sequence fails – add delays, start more DGs first, or soft-start the large motors.' : warn ? 'Sequence marginal on some steps.' : 'Recovery sequence is feasible from the available generation.' } };
        }
      },
      {
        id: 'egen', icon: '🆘', title: 'Emergency generator capacity', desc: 'Size the emergency generator for connected emergency loads plus the largest motor start; estimate fuel for the required endurance.',
        formula: 'P ≥ Σ(kW × demand)    kVA = P/PF    dip from largest start    fuel = P × SFOC × t',
        inputs: [{ k: 'gen', l: 'Emergency generator rating', u: 'kW', v: 250, min: 1 }, { k: 'pf', l: 'PF', v: 0.8, min: 0.3, max: 1, step: 0.01 }, { k: 'x', l: 'X″d', v: 0.18, min: 0.05, step: 0.01 }, { k: 'lm', l: 'Largest motor started last', u: 'kW', v: 90, min: 0 }, { k: 'mm', l: 'Start multiple', v: 6, min: 1, step: 0.5 }, { k: 'hrs', l: 'Required endurance', u: 'h', v: 18, min: 0.5, hint: 'SOLAS II-1/43: 18 h cargo, 36 h passenger (check class / flag)' }, { k: 'sf', l: 'SFOC', u: 'g/kWh', v: 230, min: 1 },
          { k: 'tbl', t: 'table', l: 'Emergency loads', v: [{ n: 'Emergency lighting', kw: 15, d: 100 }, { n: 'Nav & comms', kw: 10, d: 100 }, { n: 'Fire pump (emergency)', kw: 90, d: 100 }, { n: 'Steering gear', kw: 25, d: 50 }, { n: 'Emergency air compressor', kw: 30, d: 50 }, { n: 'Battery chargers', kw: 12, d: 100 }, { n: 'Alarm & fire detection', kw: 3, d: 100 }, { n: 'Emergency ventilation', kw: 15, d: 50 }], cols: [{ k: 'n', l: 'Load', t: 'text', d: 'Load', w: 170 }, { k: 'kw', l: 'kW', t: 'num', d: 0 }, { k: 'd', l: 'Demand %', t: 'num', d: 100 }] }],
        run: v => {
          const tot = v.tbl.reduce((a, r) => a + r.kw * r.d / 100, 0), ld = tot / v.gen * 100, st = lvl(ld, 80, 100), sstart = v.lm / v.pf * v.mm, ssc = v.gen / v.pf / v.x, dip = sstart / (sstart + ssc) * 100, sd = lvl(dip, 15, 20);
          const kg = tot * v.sf / 1000 * v.hrs, l = kg / 0.85;
          return { results: [R('Emergency load', tot, 'kW', 0, null, true), R('Generator loading', ld, '%', 0, st), R('Minimum gen rating', tot / 0.8, 'kW @ 80% loading', 0), R('Largest-motor start dip', dip, '%', 1, sd), R('Fuel for endurance', l, 'L', 0), R('Fuel for endurance', l / 1000, 'm³', 2)],
            tables: [{ title: 'Loads', head: ['Load', 'kW', 'Demand %', 'Demand kW'], rows: v.tbl.map(r => [esc(r.n), r.kw, r.d, r.kw * r.d / 100]) }], verdict: { s: st === 'bad' || sd === 'bad' ? 'bad' : st === 'warn' || sd === 'warn' ? 'warn' : 'ok', t: st === 'ok' && sd === 'ok' ? 'Emergency generator adequate.' : 'Check generator rating / motor-starting sequence.' }, notes: ['Check sequential starting of emergency loads and that fuel for the endurance is available in the emergency generator service tank.'] };
        }
      }
    ]
  });
})();
