(function () {
  const { R, lvl, esc } = ETO;
  const ip2n = s => { const p = String(s).trim().split('.'); if (p.length !== 4 || p.some(x => !/^\d{1,3}$/.test(x) || +x > 255)) return null; return ((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + +p[3]; };
  const n2ip = n => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  ETO.page({
    title: 'Communications & Networks', icon: '🌐', accent: '#4f46e5',
    subtitle: 'IP subnetting, fibre-optic link budgets, Modbus addressing and timing, NMEA 0183 checksums, CAN / NMEA 2000 limits and PoE budgets – for DP, IAS and navigation networks.',
    refs: ['IEEE 802.3', 'Modbus spec v1.1b3', 'NMEA 0183 / 2000', 'CiA 301 (CANopen)', 'IEC 61162'],
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
        id: 'fibre', icon: '💡', title: 'Fibre-optic power budget', desc: 'Will the optical link work with margin?',
        formula: 'Loss = L × α + n_c × connector loss + n_s × splice loss     margin = (P_tx − S_rx) − loss − safety margin',
        inputs: [{ k: 'tx', l: 'Transmitter power (min)', u: 'dBm', v: -8, max: 10 }, { k: 'rx', l: 'Receiver sensitivity', u: 'dBm', v: -24 }, { k: 'ft', l: 'Fibre / wavelength', opts: [[3.0, 'Multimode 850 nm (3.0 dB/km)'], [1.0, 'Multimode 1300 nm (1.0 dB/km)'], [0.35, 'Single-mode 1310 nm (0.35 dB/km)'], [0.25, 'Single-mode 1550 nm (0.25 dB/km)']], v: 3.0 }, { k: 'l', l: 'Length', u: 'm', v: 450, min: 0 }, { k: 'nc', l: 'Mated connector pairs', v: 4, min: 0, step: 1 }, { k: 'cl', l: 'Loss per connector pair', u: 'dB', v: 0.75, min: 0 }, { k: 'ns', l: 'Splices', v: 2, min: 0, step: 1 }, { k: 'sl', l: 'Loss per splice', u: 'dB', v: 0.3, min: 0 }, { k: 'sm', l: 'Safety / ageing margin', u: 'dB', v: 3, min: 0 }],
        run: v => { const loss = v.l / 1000 * v.ft + v.nc * v.cl + v.ns * v.sl, bud = v.tx - v.rx, m = bud - loss - v.sm; return { results: [R('Power budget', bud, 'dB', 2), R('Total link loss', loss, 'dB', 2), R('Expected receive power', v.tx - loss, 'dBm', 2), R('Remaining margin', m, 'dB', 2, m >= 0 ? 'ok' : 'bad', true)], verdict: { s: m >= 0 ? 'ok' : 'bad', t: m >= 0 ? 'Link should work with the safety margin.' : 'Not enough optical budget – clean / replace connectors, reduce splices or use single-mode / higher-power optics.' }, notes: ['Connector / splice values are TIA-568 maximums (0.75 / 0.3 dB); real values are often lower. Always clean connectors before measuring.'] }; }
      },
      {
        id: 'modbus', icon: '🔗', title: 'Modbus address & function-code helper', desc: 'Convert between the “data-model” reference (e.g. 40001) and the zero-based protocol address used on the wire.',
        formula: '4xxxx = holding register (FC 03/06/16)   3xxxx = input register (FC 04)   1xxxx = discrete input (FC 02)   0xxxx = coil (FC 01/05/15)   on-wire address = reference − base',
        inputs: [{ k: 'm', l: 'Convert', opts: [['ref', 'Reference (e.g. 40001 / 400001) → protocol address'], ['addr', 'Table + protocol address → reference']], v: 'ref' }, { k: 'ref', t: 'text', l: 'Reference number', v: '40108', show: v => v.m === 'ref' }, { k: 'tb', l: 'Table', opts: [['4', 'Holding registers'], ['3', 'Input registers'], ['1', 'Discrete inputs'], ['0', 'Coils']], v: '4', show: v => v.m === 'addr' }, { k: 'a', l: 'Protocol (zero-based) address', v: 107, min: 0, max: 65535, step: 1, show: v => v.m === 'addr' }],
        run: v => {
          const INFO = { 4: ['Holding register', 'FC 03 read · FC 06 write single · FC 16 write multiple'], 3: ['Input register', 'FC 04 read'], 1: ['Discrete input', 'FC 02 read'], 0: ['Coil', 'FC 01 read · FC 05 write single · FC 15 write multiple'] };
          let t, a;
          if (v.m === 'ref') { const s = String(v.ref).trim(); if (!/^[0134]\d{4,5}$/.test(s)) throw new Error('Enter a 5- or 6-digit reference starting with 0, 1, 3 or 4'); t = s[0]; a = parseInt(s.slice(1), 10) - 1; if (a < 0) throw new Error('Reference numbers start at x0001'); }
          else { t = String(v.tb); a = v.a; if (!Number.isInteger(a)) throw new Error('Address must be whole number'); }
          return { results: [R('Data type', INFO[t][0], '', 0, null, true), R('Protocol address (decimal)', a, '', 0, null, true), R('Protocol address (hex)', '0x' + a.toString(16).toUpperCase().padStart(4, '0'), '', 0), R('5-digit reference', a < 9999 ? t + String(a + 1).padStart(4, '0') : 'n/a (> 9999)', '', 0), R('6-digit reference', t + String(a + 1).padStart(5, '0'), '', 0), R('Function codes', INFO[t][1], '', 0)], notes: ['“Off by one” is the most common Modbus commissioning error – check whether the device manual lists references (start at 1) or addresses (start at 0).'] };
        }
      },
      {
        id: 'serial', icon: '⏱️', title: 'Serial line timing (RS-485 / Modbus RTU)', desc: 'Character time, frame time and Modbus RTU silent intervals.',
        formula: 'bits/char = 1 start + data + parity + stop     t_char = bits/baud     RTU gap 3.5 chars (fixed 1.75 ms above 19 200 baud)',
        inputs: [{ k: 'b', l: 'Baud rate', opts: [[1200, '1200'], [2400, '2400'], [4800, '4800'], [9600, '9600'], [19200, '19200'], [38400, '38400'], [57600, '57600'], [115200, '115200']], v: 9600 }, { k: 'd', l: 'Data bits', opts: [[7, '7'], [8, '8']], v: 8 }, { k: 'p', l: 'Parity', opts: [[0, 'None'], [1, 'Even / odd']], v: 1 }, { k: 's', l: 'Stop bits', opts: [[1, '1'], [2, '2']], v: 1 }, { k: 'n', l: 'Frame length', u: 'bytes', v: 8, min: 1, step: 1 }],
        run: v => { const bits = 1 + v.d + v.p + v.s, tc = bits / v.b * 1000, gap = v.b > 19200 ? 1.75 : 3.5 * tc, ic = v.b > 19200 ? 0.75 : 1.5 * tc; return { results: [R('Bits per character', bits, '', 0), R('Character time', tc, 'ms', 3), R('Frame time', v.n * tc, 'ms', 2, null, true), R('Inter-frame gap (3.5 char)', gap, 'ms', 3), R('Inter-character timeout (1.5 char)', ic, 'ms', 3), R('Max characters per second', v.b / bits, '', 0)], notes: ['Modbus RTU requires 11-bit characters: 8 data + parity + 1 stop, or no parity + 2 stop bits.', 'RS-485: terminate both bus ends with 120 Ω, bias once, max ~1200 m at ≤ 100 kbit/s, 32 unit loads.'] }; }
      },
      {
        id: 'nmea', icon: '🧭', title: 'NMEA 0183 checksum', desc: 'Calculate / verify the checksum of an NMEA 0183 sentence (GPS, gyro, echo-sounder, AIS…).',
        formula: 'checksum = XOR of all characters between “$” (or “!”) and “*”, as two hex digits',
        inputs: [{ k: 's', t: 'text', l: 'Sentence', v: '$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47' }],
        run: v => {
          const s = String(v.s).trim(), st = s.search(/[$!]/); if (st < 0) throw new Error('Sentence must start with $ or !');
          const star = s.indexOf('*', st), body = s.slice(st + 1, star < 0 ? undefined : star); let cs = 0; for (const ch of body) cs ^= ch.charCodeAt(0);
          const hex = cs.toString(16).toUpperCase().padStart(2, '0'), given = star >= 0 ? s.slice(star + 1, star + 3).toUpperCase() : null, ok = given === hex;
          return { results: [R('Calculated checksum', hex, '', 0, null, true), R('Checksum in sentence', given || '(none)', '', 0, given ? (ok ? 'ok' : 'bad') : 'warn'), R('Talker / sentence', body.split(',')[0], '', 0), R('Fields', body.split(',').length - 1, '', 0)], verdict: given ? { s: ok ? 'ok' : 'bad', t: ok ? 'Checksum valid.' : 'Checksum mismatch – corrupted data (wiring, baud rate, ground loop, two talkers on one listener).' } : { s: 'info', t: 'Complete sentence: ' + s.slice(st, star < 0 ? undefined : star) + '*' + hex } };
        }
      },
      {
        id: 'can', icon: '🚌', title: 'CAN / CANopen / NMEA 2000 bus length', desc: 'Maximum bus length for a bit rate (bit-timing limited).',
        formula: 'Recommended lengths per CiA 301 (CANopen); NMEA 2000 = 250 kbit/s',
        inputs: [{ k: 'r', l: 'Bit rate', opts: [[1000, '1 Mbit/s'], [800, '800 kbit/s'], [500, '500 kbit/s'], [250, '250 kbit/s (NMEA 2000, J1939)'], [125, '125 kbit/s'], [50, '50 kbit/s'], [20, '20 kbit/s'], [10, '10 kbit/s']], v: 250 }, { k: 'l', l: 'Planned bus (backbone) length', u: 'm', v: 120, min: 0 }],
        run: v => { const max = { 1000: 25, 800: 50, 500: 100, 250: 250, 125: 500, 50: 1000, 20: 2500, 10: 5000 }[v.r], ok = v.l <= max; return { results: [R('Maximum bus length', max, 'm', 0, null, true), R('Planned', v.l, 'm', 0, ok ? 'ok' : 'bad')], verdict: { s: ok ? 'ok' : 'bad', t: ok ? 'Within the length limit.' : 'Too long for this bit rate – reduce bit rate or use repeaters / bridges.' }, notes: ['120 Ω terminator at each end of the backbone only. NMEA 2000: backbone max 200 m (Mid cable) / 100 m (Light); drop cables ≤ 6 m each, ≤ 78 m total.'] }; }
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
