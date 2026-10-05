(function () {
  const { R, lvl, esc } = ETO;
  const ip2n = s => { const p = String(s).trim().split('.'); if (p.length !== 4 || p.some(x => !/^\d{1,3}$/.test(x) || +x > 255)) return null; return ((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + +p[3]; };
  const n2ip = n => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

  // ---------- NMEA 0183 / AIS decoder ----------
  const NMEA = (function () {
    const TALK = { GP: 'GPS', GN: 'GNSS (combined)', GL: 'GLONASS', GA: 'Galileo', GB: 'BeiDou', BD: 'BeiDou', HE: 'Gyro compass', HC: 'Magnetic compass', HN: 'Non-north-seeking gyro', II: 'Integrated instrument', IN: 'Integrated navigation', SD: 'Depth sounder', VW: 'Speed log (water)', VD: 'Doppler log', WI: 'Weather instrument', AG: 'Autopilot', AP: 'Autopilot', RA: 'Radar / ARPA', TI: 'Turn-rate indicator', YX: 'Transducer', AI: 'AIS', EC: 'ECDIS', ER: 'Engine room' };
    const dm = (d, hs) => { const a = Math.abs(d), deg = Math.floor(a), m = (a - deg) * 60; return `${deg}°${m.toFixed(3)}′${d < 0 ? hs[1] : hs[0]}`; };
    const coord = (v, h, isLon) => { if (!v) return null; const dd = isLon ? 3 : 2, d = parseFloat(v.slice(0, dd)) + parseFloat(v.slice(dd)) / 60; return h === 'S' || h === 'W' ? -d : d; };
    const time = t => (t ? `${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4)} UTC` : '');
    const date = d => (d && d.length === 6 ? `${d.slice(0, 2)}/${d.slice(2, 4)}/${+d.slice(4) < 80 ? '20' : '19'}${d.slice(4)} (dd/mm/yyyy)` : '');
    const num = (x, u) => (x === '' || x == null ? '(empty)' : x + (u ? ' ' + u : ''));
    const FIX = { 0: 'Invalid / no fix', 1: 'GPS fix (SPS)', 2: 'Differential GPS fix', 3: 'PPS fix', 4: 'RTK fixed', 5: 'RTK float', 6: 'Estimated (dead reckoning)', 7: 'Manual input', 8: 'Simulation' };
    const MODE = { A: 'Autonomous', D: 'Differential', E: 'Estimated (DR)', F: 'Float RTK', M: 'Manual', N: 'Data not valid', P: 'Precise', R: 'RTK', S: 'Simulator' };
    const posRows = (f, i) => { const la = coord(f[i], f[i + 1]), lo = coord(f[i + 2], f[i + 3], true); return { rows: [['Latitude', `${f[i]} ${f[i + 1]}`, la == null ? '(empty)' : `${dm(la, 'NS')}  =  ${la.toFixed(6)}°`], ['Longitude', `${f[i + 2]} ${f[i + 3]}`, lo == null ? '(empty)' : `${dm(lo, 'EW')}  =  ${lo.toFixed(6)}°`]], pos: la != null && lo != null ? [la, lo] : null }; };
    const SENT = {
      GGA: ['Global positioning fix data', f => { const p = posRows(f, 2); return { pos: p.pos, rows: [['UTC time', f[1], time(f[1])]].concat(p.rows, [['Fix quality', f[6], FIX[f[6]] || '?'], ['Satellites used', f[7], f[7]], ['HDOP', f[8], f[8] ? (f[8] < 1 ? 'ideal' : f[8] < 2 ? 'excellent' : f[8] < 5 ? 'good' : f[8] < 10 ? 'moderate' : 'poor') + ' horizontal geometry' : ''], ['Antenna altitude (MSL)', f[9] + ' ' + f[10], num(f[9], 'm')], ['Geoid separation', f[11] + ' ' + f[12], num(f[11], 'm')], ['Age of DGPS data', f[13], num(f[13], 's')], ['DGPS station ID', f[14], num(f[14])]]) }; }],
      RMC: ['Recommended minimum navigation data', f => { const p = posRows(f, 3); return { pos: p.pos, rows: [['UTC time', f[1], time(f[1])], ['Status', f[2], f[2] === 'A' ? 'A = data valid' : 'V = WARNING, data not valid']].concat(p.rows, [['Speed over ground', f[7], num(f[7], 'kn') + (f[7] ? ` (${(f[7] * 1.852).toFixed(1)} km/h)` : '')], ['Course over ground (true)', f[8], num(f[8], '°')], ['Date', f[9], date(f[9])], ['Magnetic variation', `${f[10]} ${f[11]}`, f[10] ? `${f[10]}° ${f[11] === 'E' ? 'East' : 'West'}` : '(empty)'], ['Mode', f[12] || '', MODE[f[12]] || '(not given)']]) }; }],
      GLL: ['Geographic position (lat / lon)', f => { const p = posRows(f, 1); return { pos: p.pos, rows: p.rows.concat([['UTC time', f[5], time(f[5])], ['Status', f[6], f[6] === 'A' ? 'Valid' : 'Not valid'], ['Mode', f[7] || '', MODE[f[7]] || '(not given)']]) }; }],
      VTG: ['Course & speed over ground', f => ({ rows: [['COG true', f[1], num(f[1], '°T')], ['COG magnetic', f[3], num(f[3], '°M')], ['SOG', f[5], num(f[5], 'kn')], ['SOG', f[7], num(f[7], 'km/h')], ['Mode', f[9] || '', MODE[f[9]] || '(not given)']] }) ],
      HDT: ['Heading – true (gyro)', f => ({ rows: [['True heading', f[1], num(f[1], '° true')]] })],
      THS: ['True heading & status', f => ({ rows: [['True heading', f[1], num(f[1], '° true')], ['Status', f[2], { A: 'Autonomous', E: 'Estimated', M: 'Manual', S: 'Simulator', V: 'Not valid' }[f[2]] || f[2]]] })],
      HDG: ['Heading, deviation & variation (magnetic)', f => { const dv = f[2] ? (f[3] === 'W' ? -1 : 1) * f[2] : 0, va = f[4] ? (f[5] === 'W' ? -1 : 1) * f[4] : 0; return { rows: [['Magnetic sensor heading', f[1], num(f[1], '°')], ['Deviation', `${f[2]} ${f[3]}`, f[2] ? `${f[2]}° ${f[3]}` : '(empty)'], ['Variation', `${f[4]} ${f[5]}`, f[4] ? `${f[4]}° ${f[5]}` : '(empty)'], ['→ True heading', '', f[1] ? ((+f[1] + dv + va + 360) % 360).toFixed(1) + '° (sensor + deviation + variation)' : '']] }; }],
      ZDA: ['Time & date', f => ({ rows: [['UTC time', f[1], time(f[1])], ['Date', `${f[2]}/${f[3]}/${f[4]}`, `${f[2]}/${f[3]}/${f[4]} (dd/mm/yyyy)`], ['Local zone', `${f[5]}:${f[6]}`, f[5] ? `UTC ${+f[5] <= 0 ? '+' : '−'}${Math.abs(+f[5])} h ${f[6] || 0} min (zone description)` : '(empty)']] })],
      GSA: ['DOP & active satellites', f => ({ rows: [['Mode', f[1], f[1] === 'A' ? 'Automatic 2D/3D' : 'Manual'], ['Fix type', f[2], { 1: 'No fix', 2: '2D fix', 3: '3D fix' }[f[2]] || f[2]], ['Satellites used', f.slice(3, 15).filter(Boolean).join(' '), f.slice(3, 15).filter(Boolean).length + ' satellites'], ['PDOP', f[15], f[15]], ['HDOP', f[16], f[16]], ['VDOP', f[17], f[17]]] })],
      GSV: ['Satellites in view', f => { const rows = [['Message', `${f[2]} of ${f[1]}`, `part ${f[2]} of ${f[1]}`], ['Satellites in view', f[3], f[3]]]; for (let i = 4; i + 3 < f.length; i += 4) if (f[i]) rows.push([`PRN ${f[i]}`, `${f[i + 1]},${f[i + 2]},${f[i + 3]}`, `elevation ${f[i + 1] || '?'}°, azimuth ${f[i + 2] || '?'}°, SNR ${f[i + 3] ? f[i + 3] + ' dB-Hz' : 'not tracked'}`]); return { rows }; }],
      VHW: ['Water speed & heading (log)', f => ({ rows: [['Heading true', f[1], num(f[1], '°T')], ['Heading magnetic', f[3], num(f[3], '°M')], ['Speed through water', f[5], num(f[5], 'kn')], ['Speed through water', f[7], num(f[7], 'km/h')]] })],
      VBW: ['Dual ground / water speed (Doppler log)', f => ({ rows: [['Longitudinal water speed', f[1], num(f[1], 'kn') + ' (− = astern)'], ['Transverse water speed', f[2], num(f[2], 'kn') + ' (− = port)'], ['Water speed status', f[3], f[3] === 'A' ? 'valid' : 'not valid'], ['Longitudinal ground speed', f[4], num(f[4], 'kn')], ['Transverse ground speed', f[5], num(f[5], 'kn')], ['Ground speed status', f[6], f[6] === 'A' ? 'valid' : 'not valid']] })],
      DPT: ['Depth', f => ({ rows: [['Depth below transducer', f[1], num(f[1], 'm')], ['Transducer offset', f[2], f[2] ? `${f[2]} m (+ = to waterline, − = to keel)` : '(empty)'], ['→ Depth from waterline / below keel', '', f[1] && f[2] ? (+f[1] + +f[2]).toFixed(2) + ' m' : ''], ['Max range scale', f[3] || '', num(f[3], 'm')]] })],
      DBT: ['Depth below transducer', f => ({ rows: [['Depth', f[1], num(f[1], 'ft')], ['Depth', f[3], num(f[3], 'm')], ['Depth', f[5], num(f[5], 'fathoms')]] })],
      MTW: ['Water temperature', f => ({ rows: [['Temperature', f[1], num(f[1], '°' + (f[2] || 'C'))]] })],
      MWV: ['Wind speed & angle', f => ({ rows: [['Wind angle', f[1], num(f[1], '°') + ' from the bow, clockwise'], ['Reference', f[2], f[2] === 'R' ? 'Relative (apparent)' : f[2] === 'T' ? 'True (theoretical)' : f[2]], ['Wind speed', `${f[3]} ${f[4]}`, `${f[3]} ${{ K: 'km/h', M: 'm/s', N: 'kn', S: 'mph' }[f[4]] || f[4]}`], ['Status', f[5], f[5] === 'A' ? 'valid' : 'not valid']] })],
      MWD: ['Wind direction & speed (true)', f => ({ rows: [['Direction true', f[1], num(f[1], '°T')], ['Direction magnetic', f[3], num(f[3], '°M')], ['Speed', f[5], num(f[5], 'kn')], ['Speed', f[7], num(f[7], 'm/s')]] })],
      ROT: ['Rate of turn', f => ({ rows: [['Rate of turn', f[1], f[1] ? `${f[1]} °/min (${+f[1] < 0 ? 'turning to port' : +f[1] > 0 ? 'turning to starboard' : 'steady'})` : '(empty)'], ['Status', f[2], f[2] === 'A' ? 'valid' : 'not valid']] })],
      RSA: ['Rudder sensor angle', f => ({ rows: [['Starboard / single rudder', f[1], f[1] ? `${f[1]}° (${+f[1] < 0 ? 'to port' : +f[1] > 0 ? 'to starboard' : 'midships'})` : '(empty)'], ['Status', f[2], f[2] === 'A' ? 'valid' : 'not valid'], ['Port rudder', f[3] || '', num(f[3], '°')], ['Status', f[4] || '', f[4] === 'A' ? 'valid' : f[4] ? 'not valid' : '']] })],
      XDR: ['Transducer measurements', f => { const rows = [], TY = { C: 'Temperature', P: 'Pressure', A: 'Angle', D: 'Displacement', F: 'Frequency', H: 'Humidity', I: 'Current', U: 'Voltage', N: 'Force', R: 'Flow', S: 'Switch / valve', T: 'Tachometer', V: 'Volume', G: 'Generic' }; for (let i = 1; i + 3 < f.length + 1; i += 4) if (f[i]) rows.push([f[i + 3] || 'Transducer', `${f[i]},${f[i + 1]},${f[i + 2]}`, `${TY[f[i]] || f[i]} = ${f[i + 1]} ${f[i + 2]}`]); return { rows }; }],
      TXT: ['Text message', f => ({ rows: [['Message', `${f[2]}/${f[1]}`, `part ${f[2]} of ${f[1]}, id ${f[3]}`], ['Text', f[4], f[4]]] })]
    };
    // ---- AIS ----
    const bits = p => { let b = ''; for (const ch of p) { let x = ch.charCodeAt(0) - 48; if (x > 40) x -= 8; b += x.toString(2).padStart(6, '0'); } return b; };
    const U = (b, s, l) => parseInt(b.substr(s, l) || '0', 2), S = (b, s, l) => { const u = U(b, s, l); return b[s] === '1' ? u - 2 ** l : u; };
    const T6 = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ !"#$%&\'()*+,-./0123456789:;<=>?';
    const TXT6 = (b, s, n) => { let t = ''; for (let i = 0; i < n; i++) t += T6[U(b, s + 6 * i, 6)] || ''; return t.replace(/@+$/, '').trim(); };
    const NAV = ['Under way using engine', 'At anchor', 'Not under command', 'Restricted manoeuvrability', 'Constrained by draught', 'Moored', 'Aground', 'Engaged in fishing', 'Under way sailing', 'Reserved (HSC)', 'Reserved (WIG)', 'Power-driven towing astern', 'Power-driven pushing / towing alongside', 'Reserved', 'AIS-SART / MOB / EPIRB active', 'Not defined'];
    const EPFD = ['Undefined', 'GPS', 'GLONASS', 'GPS + GLONASS', 'Loran-C', 'Chayka', 'Integrated navigation', 'Surveyed', 'Galileo'];
    const STYPE = n => n === 0 ? 'Not available' : n >= 20 && n <= 29 ? 'Wing in ground' : n === 30 ? 'Fishing' : n === 31 || n === 32 ? 'Towing' : n === 33 ? 'Dredging / underwater operations' : n === 34 ? 'Diving operations' : n === 35 ? 'Military' : n === 36 ? 'Sailing' : n === 37 ? 'Pleasure craft' : n >= 40 && n <= 49 ? 'High-speed craft' : n === 50 ? 'Pilot vessel' : n === 51 ? 'Search & rescue' : n === 52 ? 'Tug' : n === 53 ? 'Port tender' : n === 54 ? 'Anti-pollution' : n === 55 ? 'Law enforcement' : n === 58 ? 'Medical transport' : n >= 60 && n <= 69 ? 'Passenger' : n >= 70 && n <= 79 ? 'Cargo' : n >= 80 && n <= 89 ? 'Tanker' : n >= 90 && n <= 99 ? 'Other' : 'Reserved';
    const posA = (b, lonS, latS) => { const lo = S(b, lonS, 28) / 600000, la = S(b, latS, 27) / 600000; return { lo, la, ok: Math.abs(lo) <= 180 && Math.abs(la) <= 90 }; };
    const rotTxt = r => r === -128 ? 'not available' : r === 127 ? 'turning right > 5°/30 s (no turn indicator)' : r === -127 ? 'turning left > 5°/30 s (no turn indicator)' : r === 0 ? 'not turning' : `${(Math.sign(r) * (r / 4.733) ** 2).toFixed(1)} °/min (${r > 0 ? 'starboard' : 'port'})`;
    const ais = b => {
      const t = U(b, 0, 6), mmsi = String(U(b, 8, 30)).padStart(9, '0'), rows = [['Message type', t, { 1: 'Position report class A', 2: 'Position report class A (assigned)', 3: 'Position report class A (interrogated)', 5: 'Static & voyage data (class A)', 18: 'Position report class B', 24: 'Static data report (class B)' }[t] || 'Type ' + t + ' (not decoded)'], ['MMSI', mmsi, mmsi + (mmsi.startsWith('970') ? ' (AIS-SART)' : mmsi.startsWith('972') ? ' (MOB device)' : mmsi.startsWith('974') ? ' (EPIRB-AIS)' : mmsi.startsWith('00') ? ' (coast station)' : ` (MID ${mmsi.slice(0, 3)})`)]];
      let pos = null;
      if (t >= 1 && t <= 3) {
        const p = posA(b, 61, 89), sog = U(b, 50, 10), cog = U(b, 116, 12), hdg = U(b, 128, 9);
        rows.push(['Navigational status', U(b, 38, 4), NAV[U(b, 38, 4)]], ['Rate of turn', S(b, 42, 8), rotTxt(S(b, 42, 8))], ['Speed over ground', sog, sog === 1023 ? 'not available' : (sog / 10).toFixed(1) + ' kn'], ['Position accuracy', U(b, 60, 1), U(b, 60, 1) ? 'High (< 10 m, DGNSS)' : 'Low (> 10 m)'], ['Longitude', S(b, 61, 28), p.ok ? `${dm(p.lo, 'EW')} = ${p.lo.toFixed(6)}°` : 'not available'], ['Latitude', S(b, 89, 27), p.ok ? `${dm(p.la, 'NS')} = ${p.la.toFixed(6)}°` : 'not available'], ['Course over ground', cog, cog === 3600 ? 'not available' : (cog / 10).toFixed(1) + '°'], ['True heading', hdg, hdg === 511 ? 'not available' : hdg + '°'], ['Time stamp (UTC second)', U(b, 137, 6), U(b, 137, 6) < 60 ? U(b, 137, 6) + ' s' : 'not available / manual / DR']);
        if (p.ok) pos = [p.la, p.lo];
      } else if (t === 18) {
        const p = posA(b, 57, 85), sog = U(b, 46, 10), cog = U(b, 112, 12), hdg = U(b, 124, 9);
        rows.push(['Speed over ground', sog, sog === 1023 ? 'not available' : (sog / 10).toFixed(1) + ' kn'], ['Longitude', S(b, 57, 28), p.ok ? `${dm(p.lo, 'EW')} = ${p.lo.toFixed(6)}°` : 'not available'], ['Latitude', S(b, 85, 27), p.ok ? `${dm(p.la, 'NS')} = ${p.la.toFixed(6)}°` : 'not available'], ['Course over ground', cog, cog === 3600 ? 'not available' : (cog / 10).toFixed(1) + '°'], ['True heading', hdg, hdg === 511 ? 'not available' : hdg + '°']);
        if (p.ok) pos = [p.la, p.lo];
      } else if (t === 5) {
        const st = U(b, 232, 8), A = U(b, 240, 9), B = U(b, 249, 9), C = U(b, 258, 6), D = U(b, 264, 6);
        rows.push(['IMO number', U(b, 40, 30), U(b, 40, 30) || 'not available'], ['Call sign', '', TXT6(b, 70, 7)], ['Ship name', '', TXT6(b, 112, 20)], ['Ship type', st, `${st} – ${STYPE(st)}`], ['Dimensions (A/B/C/D)', `${A}/${B}/${C}/${D}`, `length ${A + B} m, beam ${C + D} m (antenna ${A} m from bow, ${C} m from port side)`], ['Position fix type', U(b, 270, 4), EPFD[U(b, 270, 4)] || 'other'], ['ETA (UTC)', '', `${String(U(b, 278, 5)).padStart(2, '0')}/${String(U(b, 274, 4)).padStart(2, '0')} ${String(U(b, 283, 5)).padStart(2, '0')}:${String(U(b, 288, 6)).padStart(2, '0')} (dd/mm hh:mm)`], ['Draught', U(b, 294, 8), (U(b, 294, 8) / 10).toFixed(1) + ' m'], ['Destination', '', TXT6(b, 302, 20)]);
      } else if (t === 24) {
        const part = U(b, 38, 2);
        if (part === 0) rows.push(['Part', 'A', 'Vessel name'], ['Ship name', '', TXT6(b, 40, 20)]);
        else { const st = U(b, 40, 8), A = U(b, 132, 9), B = U(b, 141, 9), C = U(b, 150, 6), D = U(b, 156, 6); rows.push(['Part', 'B', 'Static data'], ['Ship type', st, `${st} – ${STYPE(st)}`], ['Vendor ID', '', TXT6(b, 48, 7)], ['Call sign', '', TXT6(b, 90, 7)], ['Dimensions (A/B/C/D)', `${A}/${B}/${C}/${D}`, `length ${A + B} m, beam ${C + D} m`]); }
      }
      return { rows, pos };
    };
    const parts = {};
    const parse = line => {
      const st = line.search(/[$!]/), raw = st >= 0 ? line.slice(st) : line, star = raw.lastIndexOf('*');
      const body = raw.slice(1, star < 0 ? undefined : star); let x = 0; for (const ch of body) x ^= ch.charCodeAt(0);
      const calc = x.toString(16).toUpperCase().padStart(2, '0'), given = star >= 0 ? raw.slice(star + 1, star + 3).toUpperCase() : null, cs = given == null ? 'none' : given === calc ? 'ok' : 'bad';
      const f = body.split(','), addr = f[0] || '', res = { raw, cs, calc, given, rows: [], title: '' };
      if (st < 0) { res.title = 'Not an NMEA sentence'; res.err = 'Line must start with $ or !'; return res; }
      if (raw[0] === '!' || /VD[MO]$/.test(addr)) {
        const cnt = +f[1], num = +f[2], seq = f[3], key = (seq || '') + (f[4] || '') + cnt;
        parts[key] = parts[key] || []; parts[key][num - 1] = f[5] || '';
        res.title = `${addr} – AIS ${addr.endsWith('VDO') ? 'own-ship' : 'received'} message${cnt > 1 ? ` (${cnt} parts)` : ''}`;
        if (parts[key].filter(p => p != null).length < cnt) { res.ais = { wait: true, key, cnt, num, seq }; return res; }
        const payload = parts[key].join(''); delete parts[key]; res.aisKey = key;
        const a = ais(bits(payload)); res.rows = [['Channel', f[4], f[4] === 'A' ? '161.975 MHz (A)' : f[4] === 'B' ? '162.025 MHz (B)' : f[4]]].concat(a.rows); res.pos = a.pos; return res;
      }
      const tk = addr.slice(0, 2), ty = addr.slice(2), d = SENT[ty];
      res.title = `${addr} – ${d ? d[0] : 'unknown sentence type'}${TALK[tk] ? ' · talker ' + tk + ' = ' + TALK[tk] : addr.startsWith('P') ? ' · proprietary' : ''}`;
      try { if (d) { const o = d[1](f); res.rows = o.rows; res.pos = o.pos; } else res.rows = f.slice(1).map((v, i) => ['Field ' + (i + 1), v, v === '' ? '(empty)' : v]); } catch (e) { res.err = 'Could not decode: ' + e.message; }
      return res;
    };
    return { parse, dm, reset: () => { for (const k in parts) delete parts[k]; } };
  })();
  ETO.page({
    title: 'Communications & Networks', icon: '🌐', accent: '#4f46e5',
    subtitle: 'IP subnetting, RS-485 / Modbus RTU serial timing, NMEA 0183 & AIS decoding and PoE budgets – for DP, IAS and navigation networks.',
    refs: ['IEEE 802.3', 'Modbus RTU', 'NMEA 0183 / IEC 61162-1', 'ITU-R M.1371 (AIS)'],
    calcs: [
      {
        id: 'subnet', icon: '🔢', title: 'IPv4 subnet calculator', desc: 'Network, broadcast, host range and mask for an IP address and prefix.',
        formula: 'network = IP AND mask     broadcast = network OR NOT mask     hosts = 2^(32−prefix) − 2',
        inputs: [{ k: 'ip', t: 'text', l: 'IP address', v: '192.168.10.37' }, { k: 'p', l: 'Prefix length (CIDR)', v: 24, min: 0, max: 32, step: 1 }, { k: 'ip2', t: 'text', l: 'Second IP (check if same subnet)', v: '192.168.10.200' }],
        run: v => {
          const a = ip2n(v.ip); if (a == null) throw new Error('Invalid IPv4 address'); if (!Number.isInteger(v.p)) throw new Error('Prefix must be a whole number');
          const mask = v.p === 0 ? 0 : (0xffffffff << (32 - v.p)) >>> 0, net = (a & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, hosts = v.p >= 31 ? (v.p === 31 ? 2 : 1) : 2 ** (32 - v.p) - 2, b = ip2n(v.ip2), same = b != null && ((b & mask) >>> 0) === net;
          return { results: [R('Network', n2ip(net) + '/' + v.p, '', 0, null, true), R('Subnet mask', n2ip(mask), '', 0), R('Wildcard', n2ip(~mask >>> 0), '', 0), R('Broadcast', n2ip(bc), '', 0), R('First host', v.p >= 31 ? n2ip(net) : n2ip(net + 1), '', 0), R('Last host', v.p >= 31 ? n2ip(bc) : n2ip(bc - 1), '', 0), R('Usable hosts', hosts, '', 0), R('Second IP in same subnet', b == null ? '—' : same ? 'YES' : 'NO – needs a router / gateway', '', 0, b == null ? null : same ? 'ok' : 'warn')] };
        }
      },
      {
        id: 'serial', icon: '⏱️', title: 'Serial line timing (RS-485 / Modbus RTU)', desc: 'Character time, frame time and Modbus RTU silent intervals.',
        formula: 'bits/char = 1 start + data + parity + stop     t_char = bits/baud     RTU gap 3.5 chars (fixed 1.75 ms above 19 200 baud)',
        inputs: [{ k: 'b', l: 'Baud rate', opts: [[1200, '1200'], [2400, '2400'], [4800, '4800'], [9600, '9600'], [19200, '19200'], [38400, '38400'], [57600, '57600'], [115200, '115200']], v: 9600 }, { k: 'd', l: 'Data bits', opts: [[7, '7'], [8, '8']], v: 8 }, { k: 'p', l: 'Parity', opts: [[0, 'None'], [1, 'Even / odd']], v: 1 }, { k: 's', l: 'Stop bits', opts: [[1, '1'], [2, '2']], v: 1 }, { k: 'n', l: 'Frame length', u: 'bytes', v: 8, min: 1, step: 1 }],
        run: v => { const bits = 1 + v.d + v.p + v.s, tc = bits / v.b * 1000, gap = v.b > 19200 ? 1.75 : 3.5 * tc, ic = v.b > 19200 ? 0.75 : 1.5 * tc; return { results: [R('Bits per character', bits, '', 0), R('Character time', tc, 'ms', 3), R('Frame time', v.n * tc, 'ms', 2, null, true), R('Inter-frame gap (3.5 char)', gap, 'ms', 3), R('Inter-character timeout (1.5 char)', ic, 'ms', 3), R('Max characters per second', v.b / bits, '', 0)], notes: ['Modbus RTU requires 11-bit characters: 8 data + parity + 1 stop, or no parity + 2 stop bits.', 'RS-485: terminate both bus ends with 120 Ω, bias once, max ~1200 m at ≤ 100 kbit/s, 32 unit loads.'] }; }
      },
      {
        id: 'nmea', icon: '🧭', title: 'NMEA 0183 & AIS sentence decoder', report: true,
        desc: 'Paste one or more sentences (one per line) from a GPS, gyro, echo-sounder, anemometer, autopilot or AIS. Each line is checksum-verified and every field is decoded into plain language. Supports GGA, RMC, GLL, VTG, HDT, HDG, THS, ZDA, GSA, GSV, VHW, VBW, DPT, DBT, MTW, MWV, MWD, ROT, RSA, XDR, TXT and AIS !AIVDM / !AIVDO messages 1, 2, 3, 5, 18 & 24 (multi-part messages are joined).',
        formula: 'checksum = XOR of all characters between “$” / “!” and “*” (2 hex digits)     latitude ddmm.mmmm → dd + mm.mmmm / 60',
        inputs: [{ k: 's', t: 'area', l: 'Sentences', rows: 6, v: '$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47\n$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A\n$HEHDT,274.07,T*19\n!AIVDM,1,1,,A,15RTgt0PAso;90TKcjM8h6g208CQ,0*4A' }],
        run: v => {
          const lines = String(v.s).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          if (!lines.length) throw new Error('Paste at least one sentence');
          NMEA.reset(); const out = [], frag = {}; let okN = 0, firstPos = null;
          lines.forEach(line => {
            const r = NMEA.parse(line);
            if (r.cs === 'ok') okN++;
            if (r.ais && r.ais.wait) { frag[r.ais.key] = r; return; }
            if (r.aisKey) delete frag[r.aisKey];
            if (r.pos && !firstPos) firstPos = r.pos;
            out.push(r);
          });
          let h = ETO.reportHead('NMEA / AIS decode', [['Sentences', lines.length], ['Checksums valid', `${okN} of ${lines.length}`]]);
          out.forEach(r => {
            h += `<h3>${esc(r.title)}</h3><p style="margin:0 0 6px;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;word-break:break-all;color:var(--mut)">${esc(r.raw)}</p>`;
            h += `<p style="margin:0 0 6px"><b>Checksum:</b> ${{ ok: '✅ valid', bad: `⛔ mismatch – sentence says ${esc(r.given)}, calculated ${esc(r.calc)}`, none: `⚠️ none in sentence (calculated *${esc(r.calc)})` }[r.cs]}</p>`;
            if (r.err) h += `<p style="color:var(--bad);font-weight:600">${esc(r.err)}</p>`;
            if (r.rows.length) h += `<table class="rt"><thead><tr><th>Field</th><th>Raw</th><th>Decoded</th></tr></thead><tbody>${r.rows.map(x => `<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td><span class="kb">${esc(x[2])}</span></td></tr>`).join('')}</tbody></table>`;
          });
          Object.values(frag).forEach(r => { h += `<p style="color:var(--warn);font-weight:600">⚠️ AIS fragment ${esc(r.ais.num)} of ${esc(r.ais.cnt)} (seq ${esc(r.ais.seq || '-')}) – paste all parts to decode.</p>`; });
          const res = [R('Sentences', lines.length, '', 0), R('Checksums valid', okN + ' / ' + lines.length, '', 0, okN === lines.length ? 'ok' : 'bad', true)];
          if (firstPos) res.push(R('Position (decimal)', `${firstPos[0].toFixed(5)}, ${firstPos[1].toFixed(5)}`, '', 0, null, true), R('Position (deg-min)', NMEA.dm(firstPos[0], 'NS') + '  ' + NMEA.dm(firstPos[1], 'EW'), '', 0));
          return { head: '<span></span>', results: res, verdict: okN === lines.length ? { s: 'ok', t: 'All checksums valid.' } : { s: 'bad', t: 'Checksum errors – corrupted data: check baud rate / wiring / ground loops, or two talkers on one listener (IEC 61162-1 allows one talker per line).' }, html: h };
        }
      },
      {
        id: 'poe', icon: '🔌', title: 'PoE power budget', desc: 'Check that a PoE switch can power all cameras / access points / phones.',
        formula: 'Σ PSE power per port ≤ switch PoE budget     IEEE 802.3af 15.4 W · at 30 W · bt 60 / 90 W at the PSE',
        inputs: [{ k: 'bud', l: 'Switch PoE budget', u: 'W', v: 240, min: 0 }, { k: 'tbl', t: 'table', l: 'Devices', v: [{ n: 'IP camera', c: 'af', q: 8 }, { n: 'Wi-Fi AP', c: 'at', q: 3 }, { n: 'PTZ camera', c: 'bt60', q: 1 }], cols: [{ k: 'n', l: 'Device', t: 'text', d: '', w: 140 }, { k: 'c', l: 'Class', t: 'sel', opts: [['af', '802.3af (15.4 W)'], ['at', '802.3at (30 W)'], ['bt60', '802.3bt T3 (60 W)'], ['bt90', '802.3bt T4 (90 W)']], d: 'af' }, { k: 'q', l: 'Qty', t: 'num', d: 1, w: 60 }] }],
        run: v => { const P = { af: [15.4, 12.95], at: [30, 25.5], bt60: [60, 51], bt90: [90, 71.3] }, pse = v.tbl.reduce((s, r) => s + P[r.c][0] * r.q, 0), pd = v.tbl.reduce((s, r) => s + P[r.c][1] * r.q, 0), ok = pse <= v.bud; return { results: [R('Worst-case PSE demand', pse, 'W', 1, ok ? 'ok' : 'bad', true), R('Power at devices', pd, 'W', 1), R('Budget used', v.bud ? pse / v.bud * 100 : 0, '%', 0, lvl(v.bud ? pse / v.bud * 100 : 999, 80, 100))], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Switch PoE budget sufficient (class maximums).' : 'Budget exceeded – some ports will not power up; use a larger PoE switch or injectors.' }, notes: ['Copper Ethernet / PoE limit: 100 m per channel (90 m permanent link + patch cords).'] }; }
      }
    ]
  });
})();
