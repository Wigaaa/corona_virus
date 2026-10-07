(function () {
  const { R, lvl } = ETO;
  const PI = Math.PI, D = 180 / PI, RAD = PI / 180;
  const sh = (...a) => v => a.includes(v.s);
  // volume of liquid (m³) in a horizontal cylinder of radius r, length L, filled to height h
  const hcyl = (r, L, h) => { h = Math.min(Math.max(h, 0), 2 * r); return L * (r * r * Math.acos((r - h) / r) - (r - h) * Math.sqrt(Math.max(0, 2 * r * h - h * h))); };
  ETO.page({
    title: 'Geometry & Tanks', icon: '🔺', accent: '#0891b2',
    subtitle: 'Areas, volumes, circle segments, partly-filled tanks, pipes and distances.',
    refs: ['Plane & solid geometry'],
    calcs: [
      {
        id: 'area', icon: '⬛', title: 'Area & perimeter (2-D shapes)', desc: 'Pick a shape and enter its dimensions (any consistent unit).',
        formula: 'Circle πr²   Rectangle w·h   Triangle ½b·h   Trapezoid ½(a+b)h   Ellipse πab   Ring π(R²−r²)',
        inputs: [{ k: 's', l: 'Shape', opts: [['circle', 'Circle'], ['rect', 'Rectangle'], ['tri', 'Triangle (base, height)'], ['tri3', 'Triangle (three sides)'], ['trap', 'Trapezoid'], ['para', 'Parallelogram'], ['ell', 'Ellipse'], ['ring', 'Ring / annulus'], ['sect', 'Circular sector'], ['poly', 'Regular polygon']], v: 'circle' },
          { k: 'r', l: 'Radius r (outer R for ring)', v: 5, min: 0.0001, show: sh('circle', 'ring', 'sect') }, { k: 'ri', l: 'Inner radius', v: 3, min: 0, show: sh('ring') }, { k: 'ang', l: 'Sector angle', u: '°', v: 60, min: 0.01, max: 360, show: sh('sect') },
          { k: 'w', l: 'Width / base', v: 4, min: 0.0001, show: sh('rect', 'tri', 'para') }, { k: 'h', l: 'Height', v: 3, min: 0.0001, show: sh('rect', 'tri', 'trap', 'para') }, { k: 'sl', l: 'Slant side (parallelogram)', v: 3.5, min: 0.0001, show: sh('para') },
          { k: 'a', l: 'Side a / parallel side a / semi-axis a', v: 6, min: 0.0001, show: sh('trap', 'tri3', 'ell') }, { k: 'b', l: 'Side b / parallel side b / semi-axis b', v: 4, min: 0.0001, show: sh('trap', 'tri3', 'ell') }, { k: 'c', l: 'Side c', v: 5, min: 0.0001, show: sh('tri3') }, { k: 'sd', l: 'Slant side (trapezoid legs sum)', v: 6, min: 0.0001, show: sh('trap') },
          { k: 'n', l: 'Number of sides', v: 6, min: 3, step: 1, show: sh('poly') }, { k: 'len', l: 'Side length', v: 2, min: 0.0001, show: sh('poly') }],
        run: v => {
          let A, P, note = '';
          switch (v.s) {
            case 'circle': A = PI * v.r ** 2; P = 2 * PI * v.r; break;
            case 'rect': A = v.w * v.h; P = 2 * (v.w + v.h); break;
            case 'tri': A = v.w * v.h / 2; P = NaN; note = 'Perimeter needs all three sides.'; break;
            case 'tri3': { if (v.a + v.b <= v.c || v.a + v.c <= v.b || v.b + v.c <= v.a) throw new Error('Not a triangle'); const s = (v.a + v.b + v.c) / 2; A = Math.sqrt(s * (s - v.a) * (s - v.b) * (s - v.c)); P = 2 * s; break; }
            case 'trap': A = (v.a + v.b) * v.h / 2; P = v.a + v.b + v.sd; break;
            case 'para': A = v.w * v.h; P = 2 * (v.w + v.sl); break;
            case 'ell': A = PI * v.a * v.b; P = PI * (3 * (v.a + v.b) - Math.sqrt((3 * v.a + v.b) * (v.a + 3 * v.b))); note = 'Ellipse perimeter by Ramanujan\'s approximation.'; break;
            case 'ring': if (v.ri >= v.r) throw new Error('Inner radius must be smaller'); A = PI * (v.r ** 2 - v.ri ** 2); P = 2 * PI * (v.r + v.ri); break;
            case 'sect': A = PI * v.r ** 2 * v.ang / 360; P = 2 * v.r + 2 * PI * v.r * v.ang / 360; break;
            default: A = v.n * v.len ** 2 / (4 * Math.tan(PI / v.n)); P = v.n * v.len;
          }
          const res = [R('Area', A, '', 'auto', null, true)]; if (isFinite(P)) res.push(R('Perimeter / circumference', P, '', 'auto'));
          if (v.s === 'poly') res.push(R('Circumradius', v.len / (2 * Math.sin(PI / v.n)), '', 'auto'), R('Apothem', v.len / (2 * Math.tan(PI / v.n)), '', 'auto'));
          return { results: res, notes: note ? [note] : [] };
        }
      },
      {
        id: 'vol', icon: '🧊', title: 'Volume & surface area (solids)', desc: 'Cylinder, cone, sphere, box, pipe wall and more. Results in the cube of your input unit; litres shown for metre inputs.',
        formula: 'Cylinder πr²h   Cone ⅓πr²h   Sphere 4/3πr³   Frustum ⅓πh(r₁²+r₁r₂+r₂²)   Torus 2π²Rr²',
        inputs: [{ k: 's', l: 'Solid', opts: [['cyl', 'Cylinder'], ['cone', 'Cone'], ['sph', 'Sphere'], ['hem', 'Hemisphere'], ['box', 'Rectangular box'], ['fru', 'Cone frustum'], ['pyr', 'Square pyramid'], ['tor', 'Torus'], ['pipe', 'Hollow cylinder (pipe)']], v: 'cyl' },
          { k: 'r', l: 'Radius r (outer for pipe / small radius torus)', v: 1, min: 0.0001, show: sh('cyl', 'cone', 'sph', 'hem', 'pipe', 'tor') }, { k: 'ri', l: 'Inner radius (pipe) / large radius R (torus)', v: 0.9, min: 0.0001, show: sh('pipe', 'tor') }, { k: 'r2', l: 'Second radius r₂ (frustum)', v: 0.5, min: 0, show: sh('fru') }, { k: 'r1', l: 'First radius r₁ (frustum)', v: 1, min: 0.0001, show: sh('fru') },
          { k: 'h', l: 'Height / length', v: 2, min: 0.0001, show: sh('cyl', 'cone', 'fru', 'pyr', 'pipe', 'box') }, { k: 'l', l: 'Length (box)', v: 3, min: 0.0001, show: sh('box') }, { k: 'w', l: 'Width (box)', v: 2, min: 0.0001, show: sh('box') }, { k: 'a', l: 'Base side (pyramid)', v: 2, min: 0.0001, show: sh('pyr') }],
        run: v => {
          let V, S;
          switch (v.s) {
            case 'cyl': V = PI * v.r ** 2 * v.h; S = 2 * PI * v.r * (v.r + v.h); break;
            case 'cone': { const sl = Math.hypot(v.r, v.h); V = PI * v.r ** 2 * v.h / 3; S = PI * v.r * (v.r + sl); break; }
            case 'sph': V = 4 / 3 * PI * v.r ** 3; S = 4 * PI * v.r ** 2; break;
            case 'hem': V = 2 / 3 * PI * v.r ** 3; S = 3 * PI * v.r ** 2; break;
            case 'box': V = v.l * v.w * v.h; S = 2 * (v.l * v.w + v.l * v.h + v.w * v.h); break;
            case 'fru': { const sl = Math.hypot(v.r1 - v.r2, v.h); V = PI * v.h / 3 * (v.r1 ** 2 + v.r1 * v.r2 + v.r2 ** 2); S = PI * (v.r1 ** 2 + v.r2 ** 2 + (v.r1 + v.r2) * sl); break; }
            case 'pyr': { const sl = Math.hypot(v.h, v.a / 2); V = v.a ** 2 * v.h / 3; S = v.a ** 2 + 2 * v.a * sl; break; }
            case 'tor': V = 2 * PI * PI * v.ri * v.r ** 2; S = 4 * PI * PI * v.ri * v.r; break;
            default: if (v.ri >= v.r) throw new Error('Inner radius must be smaller than outer radius'); V = PI * (v.r ** 2 - v.ri ** 2) * v.h; S = 2 * PI * (v.r + v.ri) * v.h + 2 * PI * (v.r ** 2 - v.ri ** 2);
          }
          return { results: [R('Volume', V, '', 'auto', null, true), R('Surface area', S, '', 'auto'), R('Volume if input in m → litres', V * 1000, 'L', 'auto')] };
        }
      },
      {
        id: 'circ', icon: '⭕', title: 'Circle quick converter', desc: 'Give any one of diameter, radius, circumference or area.',
        formula: 'C = πD     A = πr² = πD²/4',
        inputs: [{ k: 'g', l: 'Known', opts: [['d', 'Diameter'], ['r', 'Radius'], ['c', 'Circumference'], ['a', 'Area']], v: 'd' }, { k: 'x', l: 'Value', v: 100, min: 0.0001 }],
        run: v => { const r = v.g === 'd' ? v.x / 2 : v.g === 'r' ? v.x : v.g === 'c' ? v.x / (2 * PI) : Math.sqrt(v.x / PI); return { results: [R('Diameter', 2 * r, '', 'auto', null, true), R('Radius', r, '', 'auto'), R('Circumference', 2 * PI * r, '', 'auto'), R('Area', PI * r * r, '', 'auto')] }; }
      },
      {
        id: 'seg', icon: '🌙', title: 'Circle segment, chord & arc', desc: 'Chord length, arc length and segment area from the radius and one more value.',
        formula: 'chord = 2r·sin(θ/2)    arc = rθ    segment area = r²(θ − sinθ)/2',
        inputs: [{ k: 'r', l: 'Radius', v: 10, min: 0.0001 }, { k: 'by', l: 'Second value is', opts: [['ang', 'Central angle (°)'], ['ch', 'Chord length'], ['ht', 'Segment height (sagitta)']], v: 'ang' }, { k: 'x', l: 'Value', v: 60, min: 0.0001 }],
        run: v => {
          let th;
          if (v.by === 'ang') { if (v.x > 360) throw new Error('Angle cannot exceed 360°'); th = v.x * RAD; } else if (v.by === 'ch') { if (v.x > 2 * v.r) throw new Error('Chord cannot exceed the diameter'); th = 2 * Math.asin(v.x / (2 * v.r)); } else { if (v.x > 2 * v.r) throw new Error('Height cannot exceed the diameter'); th = 2 * Math.acos((v.r - v.x) / v.r); }
          const r = v.r;
          return { results: [R('Central angle', th * D, '°', 3), R('Chord length', 2 * r * Math.sin(th / 2), '', 'auto', null, true), R('Arc length', r * th, '', 'auto'), R('Segment height', r * (1 - Math.cos(th / 2)), '', 'auto'), R('Segment area', r * r * (th - Math.sin(th)) / 2, '', 'auto', null, true), R('Sector area', r * r * th / 2, '', 'auto')] };
        }
      },
      {
        id: 'hcyl', icon: '🛢️', title: 'Horizontal cylindrical tank – partial volume', desc: 'Volume at a measured liquid level (sounding), or the level for a given fill percentage. Flat ends assumed.',
        formula: 'V = L·[r²·acos((r−h)/r) − (r−h)·√(2rh − h²)]',
        inputs: [{ k: 'm', l: 'Calculate', opts: [['v', 'Volume from liquid height'], ['h', 'Height from fill %']], v: 'v' }, { k: 'dia', l: 'Tank diameter', u: 'm', v: 2.4, min: 0.01 }, { k: 'len', l: 'Tank length', u: 'm', v: 6, min: 0.01 }, { k: 'h', l: 'Liquid height', u: 'm', v: 0.9, min: 0, show: v => v.m === 'v' }, { k: 'p', l: 'Fill', u: '%', v: 40, min: 0, max: 100, show: v => v.m === 'h' }],
        run: v => {
          const r = v.dia / 2, Vt = PI * r * r * v.len; let h;
          if (v.m === 'v') { if (v.h > v.dia) throw new Error('Liquid height exceeds the tank diameter'); h = v.h; } else { const tgt = v.p / 100 * Vt; let lo = 0, hi = v.dia; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (hcyl(r, v.len, mid) < tgt) lo = mid; else hi = mid; } h = (lo + hi) / 2; }
          const V = hcyl(r, v.len, h);
          return { results: [R('Liquid volume', V, 'm³', 4, null, true), R('Liquid volume', V * 1000, 'litres', 1), R('Fill', V / Vt * 100, '%', 2), R('Liquid height', h, 'm', 4, null, v.m === 'h'), R('Total capacity', Vt, 'm³', 3)], notes: ['Dished / conical heads and trim or heel are ignored – use the vessel\'s tank calibration table for custody figures.'] };
        }
      },
      {
        id: 'vtank', icon: '🗄️', title: 'Vertical cylindrical & rectangular tank', desc: 'Contents and fill level of upright round tanks or box tanks.',
        formula: 'Cylinder: V = π(D/2)²·h     Box: V = L·W·h',
        inputs: [{ k: 't', l: 'Tank shape', opts: [['c', 'Vertical cylinder'], ['b', 'Rectangular box']], v: 'c' }, { k: 'dia', l: 'Diameter', u: 'm', v: 3, min: 0.01, show: v => v.t === 'c' }, { k: 'l', l: 'Length', u: 'm', v: 4, min: 0.01, show: v => v.t === 'b' }, { k: 'w', l: 'Width', u: 'm', v: 3, min: 0.01, show: v => v.t === 'b' }, { k: 'H', l: 'Tank height', u: 'm', v: 4, min: 0.01 }, { k: 'h', l: 'Liquid height', u: 'm', v: 2.5, min: 0 }, { k: 'd', l: 'Liquid density (for mass)', u: 'kg/L', v: 0.85, min: 0.1, step: 0.01 }],
        run: v => {
          if (v.h > v.H) throw new Error('Liquid height exceeds tank height');
          const A = v.t === 'c' ? PI * (v.dia / 2) ** 2 : v.l * v.w, V = A * v.h, Vt = A * v.H;
          return { results: [R('Contents', V, 'm³', 3, null, true), R('Contents', V * 1000, 'litres', 0), R('Contents mass', V * v.d, 'tonnes', 3), R('Fill', V / Vt * 100, '%', 1), R('Capacity per metre of height', A, 'm³/m', 3), R('Ullage (empty space)', Vt - V, 'm³', 3)] };
        }
      },
      {
        id: 'pipe', icon: '🪈', title: 'Pipe volume & weight', desc: 'Internal volume, steel weight and weight when full.',
        formula: 'ID = OD − 2t     V = π/4·ID²·L     m_steel = π/4·(OD² − ID²)·L·ρ_steel',
        inputs: [{ k: 'od', l: 'Outside diameter', u: 'mm', v: 114.3, min: 1 }, { k: 't', l: 'Wall thickness', u: 'mm', v: 6.02, min: 0.1 }, { k: 'l', l: 'Length', u: 'm', v: 6, min: 0.01 }, { k: 'rs', l: 'Steel density', u: 'kg/m³', v: 7850, min: 1000 }, { k: 'rf', l: 'Fluid density', u: 'kg/m³', v: 1000, min: 0 }],
        run: v => {
          const id = v.od - 2 * v.t; if (id <= 0) throw new Error('Wall thickness too large');
          const ai = PI / 4 * (id / 1000) ** 2, as = PI / 4 * ((v.od / 1000) ** 2 - (id / 1000) ** 2), vol = ai * v.l, ms = as * v.l * v.rs;
          return { results: [R('Inside diameter', id, 'mm', 2), R('Internal volume', vol * 1000, 'L', 1, null, true), R('Volume per metre', ai * 1000, 'L/m', 3), R('Steel weight', ms, 'kg', 1), R('Steel weight per metre', as * v.rs, 'kg/m', 2), R('Weight when full', ms + vol * v.rf, 'kg', 1)] };
        }
      },
      {
        id: 'slope', icon: '⛰️', title: 'Slope / gradient / gangway angle', desc: 'Rise and run to percent, degrees and ratio.',
        formula: 'gradient % = rise/run × 100     angle = atan(rise/run)',
        inputs: [{ k: 'rise', l: 'Rise', v: 1, min: 0 }, { k: 'run', l: 'Run (horizontal)', v: 12, min: 0.0001 }],
        run: v => ({ results: [R('Gradient', v.rise / v.run * 100, '%', 2, null, true), R('Angle', Math.atan(v.rise / v.run) * D, '°', 2, null, true), R('Ratio 1 : n', v.rise === 0 ? 'flat' : '1 : ' + ETO.fmt(v.run / v.rise, 2), ''), R('Slope length', Math.hypot(v.rise, v.run), '', 'auto')] })
      },
      {
        id: 'dist', icon: '📍', title: 'Distance between two points (2-D / 3-D)', desc: 'Straight-line distance, midpoint and bearing.',
        formula: 'd = √((x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²)',
        inputs: [{ k: 'x1', l: 'x₁', v: 0 }, { k: 'y1', l: 'y₁', v: 0 }, { k: 'z1', l: 'z₁', v: 0 }, { k: 'x2', l: 'x₂', v: 30 }, { k: 'y2', l: 'y₂', v: 40 }, { k: 'z2', l: 'z₂', v: 0 }],
        run: v => {
          const dx = v.x2 - v.x1, dy = v.y2 - v.y1, dz = v.z2 - v.z1;
          return { results: [R('Distance', Math.sqrt(dx * dx + dy * dy + dz * dz), '', 'auto', null, true), R('Horizontal distance', Math.hypot(dx, dy), '', 'auto'), R('Bearing (from +y, clockwise)', (Math.atan2(dx, dy) * D + 360) % 360, '°', 2), R('Midpoint', `(${ETO.fmt((v.x1 + v.x2) / 2, 3)}, ${ETO.fmt((v.y1 + v.y2) / 2, 3)}, ${ETO.fmt((v.z1 + v.z2) / 2, 3)})`, '')] };
        }
      }
    ]
  });
})();
