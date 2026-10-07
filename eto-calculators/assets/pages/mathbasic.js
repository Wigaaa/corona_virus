(function () {
  const { R, lvl, esc } = ETO;
  const D = 180 / Math.PI, RAD = Math.PI / 180;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const cstr = (a, b, d) => `${ETO.fmt(a, d == null ? 4 : d)} ${b < 0 ? '−' : '+'} j${ETO.fmt(Math.abs(b), d == null ? 4 : d)}`;
  const nums = s => String(s).split(/[\s,;]+/).filter(x => x !== '').map(Number);
  ETO.page({
    title: 'Mathematics', icon: '🧮', accent: '#e11d48',
    subtitle: 'Everyday maths for engineers: percentages, ratios, equations, triangles, trigonometry, complex numbers, statistics and number bases.',
    refs: ['Algebra', 'Trigonometry', 'Complex numbers', 'Statistics'],
    calcs: [
      {
        id: 'pct', icon: '％', title: 'Percentages', desc: 'Six common percentage problems.',
        formula: 'X% of Y = X·Y/100     change% = (Y − X)/X × 100',
        inputs: [{ k: 'm', l: 'Problem', opts: [['of', 'X % of Y'], ['is', 'X is what % of Y'], ['chg', '% change from X to Y'], ['up', 'Increase Y by X %'], ['down', 'Decrease Y by X %'], ['rev', 'Original value before an X % increase gave Y']], v: 'of' }, { k: 'x', l: 'X', v: 15 }, { k: 'y', l: 'Y', v: 240 }],
        run: v => {
          if ((v.m === 'is' && v.y === 0) || (v.m === 'chg' && v.x === 0)) throw new Error('Division by zero – check X and Y');
          const r = { of: [v.x * v.y / 100, ''], is: [v.x / v.y * 100, '%'], chg: [(v.y - v.x) / v.x * 100, '%'], up: [v.y * (1 + v.x / 100), ''], down: [v.y * (1 - v.x / 100), ''], rev: [v.y / (1 + v.x / 100), ''] }[v.m];
          return { results: [R('Result', r[0], r[1], 'auto', null, true)] };
        }
      },
      {
        id: 'ratio', icon: '⚖️', title: 'Ratio & proportion (rule of three)', desc: 'If A is to B as C is to X, find X. Also simplifies the ratio A : B.',
        formula: 'A / B = C / X   →   X = B × C / A',
        inputs: [{ k: 'a', l: 'A', v: 3 }, { k: 'b', l: 'B', v: 12 }, { k: 'c', l: 'C', v: 25 }],
        run: v => {
          if (v.a === 0) throw new Error('A cannot be zero');
          const ok = Number.isInteger(v.a) && Number.isInteger(v.b), g = ok ? gcd(v.a, v.b) : 1;
          return { results: [R('X', v.b * v.c / v.a, '', 'auto', null, true), R('Ratio A : B (simplified)', ok && g ? `${v.a / g} : ${v.b / g}` : 'enter integers', ''), R('A / B', v.a / v.b, '', 6), R('Scale factor C / A', v.c / v.a, '', 6)] };
        }
      },
      {
        id: 'interp', icon: '📈', title: 'Linear interpolation', desc: 'Find y at a given x between two known points (extrapolates outside).',
        formula: 'y = y1 + (x − x1)(y2 − y1)/(x2 − x1)',
        inputs: [{ k: 'x1', l: 'x1', v: 40 }, { k: 'y1', l: 'y1', v: 0.9 }, { k: 'x2', l: 'x2', v: 50 }, { k: 'y2', l: 'y2', v: 0.82 }, { k: 'x', l: 'x (wanted)', v: 45 }],
        run: v => {
          if (v.x2 === v.x1) throw new Error('x1 and x2 must be different');
          const out = v.x < Math.min(v.x1, v.x2) || v.x > Math.max(v.x1, v.x2), y = v.y1 + (v.x - v.x1) * (v.y2 - v.y1) / (v.x2 - v.x1);
          return { results: [R('y', y, '', 'auto', out ? 'warn' : 'ok', true), R('Slope', (v.y2 - v.y1) / (v.x2 - v.x1), '', 'auto')], verdict: out ? { s: 'warn', t: 'x is outside the two points – this is extrapolation, treat with caution.' } : null, notes: ['Typical use: derating factors between table temperatures, cable ratings between sizes.'] };
        }
      },
      {
        id: 'quad', icon: 'x²', title: 'Quadratic equation', desc: 'Roots of ax² + bx + c = 0 (real or complex).',
        formula: 'x = (−b ± √(b² − 4ac)) / 2a',
        inputs: [{ k: 'a', l: 'a', v: 1 }, { k: 'b', l: 'b', v: -3 }, { k: 'c', l: 'c', v: 2 }],
        run: v => {
          if (v.a === 0) { if (v.b === 0) throw new Error('Not an equation (a = b = 0)'); return { results: [R('Linear root x', -v.c / v.b, '', 'auto', null, true)] }; }
          const d = v.b * v.b - 4 * v.a * v.c, vx = -v.b / (2 * v.a);
          const res = [R('Discriminant', d, '', 'auto', d < 0 ? 'warn' : 'ok')];
          if (d >= 0) { const q = Math.sqrt(d); res.unshift(R('x₁', (-v.b + q) / (2 * v.a), '', 'auto', null, true), R('x₂', (-v.b - q) / (2 * v.a), '', 'auto', null, true)); }
          else { const q = Math.sqrt(-d) / (2 * Math.abs(v.a)); res.unshift(R('x₁', cstr(vx, q), '', 0, null, true), R('x₂', cstr(vx, -q), '', 0, null, true)); }
          res.push(R('Vertex x', vx, '', 'auto'), R('Vertex y', v.c - v.b * v.b / (4 * v.a), '', 'auto'), R('Sum of roots', -v.b / v.a, '', 'auto'), R('Product of roots', v.c / v.a, '', 'auto'));
          return { results: res };
        }
      },
      {
        id: 'lin2', icon: '🔗', title: 'Two simultaneous equations', desc: 'Solve a₁x + b₁y = c₁ and a₂x + b₂y = c₂ (Cramer\'s rule).',
        formula: 'x = (c₁b₂ − c₂b₁)/D     y = (a₁c₂ − a₂c₁)/D     D = a₁b₂ − a₂b₁',
        inputs: [{ k: 'a1', l: 'a₁', v: 2 }, { k: 'b1', l: 'b₁', v: 3 }, { k: 'c1', l: 'c₁', v: 13 }, { k: 'a2', l: 'a₂', v: 1 }, { k: 'b2', l: 'b₂', v: -1 }, { k: 'c2', l: 'c₂', v: 1 }],
        run: v => {
          const D = v.a1 * v.b2 - v.a2 * v.b1;
          if (Math.abs(D) < 1e-12) return { results: [R('Determinant', D, '', 'auto', 'bad')], verdict: { s: 'bad', t: 'D = 0: the lines are parallel (no solution) or identical (infinite solutions).' } };
          const x = (v.c1 * v.b2 - v.c2 * v.b1) / D, y = (v.a1 * v.c2 - v.a2 * v.c1) / D;
          return { results: [R('x', x, '', 'auto', null, true), R('y', y, '', 'auto', null, true), R('Determinant D', D, '', 'auto')] };
        }
      },
      {
        id: 'lin3', icon: '🧩', title: 'Three simultaneous equations', desc: 'Solve a 3×3 linear system (e.g. mesh / node equations) by Cramer\'s rule.',
        formula: 'x = Dx/D, y = Dy/D, z = Dz/D',
        inputs: [].concat(['1', '2', '3'].flatMap(r => ['x', 'y', 'z', 'k'].map((c, i) => ({ k: 'm' + r + i, l: `Eq ${r}: ${['x', 'y', 'z', '= const'][i]}`, v: [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]][r - 1][i] })))),
        run: v => {
          const m = [[v.m10, v.m11, v.m12], [v.m20, v.m21, v.m22], [v.m30, v.m31, v.m32]], k = [v.m13, v.m23, v.m33];
          const det = a => a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
          const D = det(m);
          if (Math.abs(D) < 1e-12) return { results: [R('Determinant', D, '', 'auto', 'bad')], verdict: { s: 'bad', t: 'D = 0: no unique solution.' } };
          const rep = c => m.map((r, i) => r.map((x, j) => (j === c ? k[i] : x)));
          return { results: [R('x', det(rep(0)) / D, '', 'auto', null, true), R('y', det(rep(1)) / D, '', 'auto', null, true), R('z', det(rep(2)) / D, '', 'auto', null, true), R('Determinant D', D, '', 'auto')] };
        }
      },
      {
        id: 'rtri', icon: '📐', title: 'Right-angled triangle', desc: 'Solve a right triangle from any two known values (sides a, b opposite/adjacent to angle A, hypotenuse c).',
        formula: 'c² = a² + b²     sin A = a/c     cos A = b/c     tan A = a/b',
        inputs: [{ k: 'm', l: 'Known', opts: [['ab', 'Legs a and b'], ['ac', 'Leg a and hypotenuse c'], ['aA', 'Leg a and angle A'], ['bA', 'Leg b and angle A'], ['cA', 'Hypotenuse c and angle A']], v: 'ab' },
          { k: 'a', l: 'Side a (opposite A)', v: 3, min: 0.0001, show: v => v.m !== 'bA' && v.m !== 'cA' }, { k: 'b', l: 'Side b (adjacent A)', v: 4, min: 0.0001, show: v => v.m === 'ab' || v.m === 'bA' }, { k: 'c', l: 'Hypotenuse c', v: 5, min: 0.0001, show: v => v.m === 'ac' || v.m === 'cA' }, { k: 'A', l: 'Angle A', u: '°', v: 30, min: 0.0001, max: 89.9999, show: v => /A$/.test(v.m) }],
        run: v => {
          let a, b, c, A;
          if (v.m === 'ab') { a = v.a; b = v.b; c = Math.hypot(a, b); A = Math.atan2(a, b); }
          else if (v.m === 'ac') { if (v.a >= v.c) throw new Error('Hypotenuse must be longer than the leg'); a = v.a; c = v.c; b = Math.sqrt(c * c - a * a); A = Math.asin(a / c); }
          else { A = v.A * RAD; if (v.m === 'aA') { a = v.a; b = a / Math.tan(A); c = a / Math.sin(A); } else if (v.m === 'bA') { b = v.b; a = b * Math.tan(A); c = b / Math.cos(A); } else { c = v.c; a = c * Math.sin(A); b = c * Math.cos(A); } }
          return { results: [R('a', a, '', 'auto', null, true), R('b', b, '', 'auto', null, true), R('c (hypotenuse)', c, '', 'auto', null, true), R('Angle A', A * D, '°', 4), R('Angle B', 90 - A * D, '°', 4), R('Area', a * b / 2, '', 'auto'), R('Perimeter', a + b + c, '', 'auto'), R('Height to hypotenuse', a * b / c, '', 'auto')] };
        }
      },
      {
        id: 'tri3', icon: '🔺', title: 'Any triangle (sine & cosine rule)', desc: 'Solve oblique triangles from three sides (SSS), two sides + included angle (SAS) or two angles + side (ASA).',
        formula: 'c² = a² + b² − 2ab·cos C     a/sin A = b/sin B = c/sin C     Area = ½ab·sin C',
        inputs: [{ k: 'm', l: 'Known', opts: [['sss', 'Three sides (SSS)'], ['sas', 'Sides a, b and included angle C (SAS)'], ['asa', 'Angles A, B and side c (ASA)']], v: 'sss' },
          { k: 'a', l: 'Side a', v: 7, min: 0.0001, show: v => v.m !== 'asa' }, { k: 'b', l: 'Side b', v: 8, min: 0.0001, show: v => v.m !== 'asa' }, { k: 'c', l: 'Side c', v: 9, min: 0.0001, show: v => v.m !== 'sas' },
          { k: 'A', l: 'Angle A', u: '°', v: 40, min: 0.001, max: 179, show: v => v.m === 'asa' }, { k: 'B', l: 'Angle B', u: '°', v: 60, min: 0.001, max: 179, show: v => v.m === 'asa' }, { k: 'C', l: 'Angle C', u: '°', v: 60, min: 0.001, max: 179, show: v => v.m === 'sas' }],
        run: v => {
          let a, b, c, A, B, C;
          if (v.m === 'sss') { a = v.a; b = v.b; c = v.c; if (a + b <= c || a + c <= b || b + c <= a) throw new Error('Not a triangle (each side must be shorter than the sum of the others)'); A = Math.acos((b * b + c * c - a * a) / (2 * b * c)); B = Math.acos((a * a + c * c - b * b) / (2 * a * c)); C = Math.PI - A - B; }
          else if (v.m === 'sas') { a = v.a; b = v.b; C = v.C * RAD; c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C)); A = Math.acos((b * b + c * c - a * a) / (2 * b * c)); B = Math.PI - A - C; }
          else { A = v.A * RAD; B = v.B * RAD; if (A + B >= Math.PI) throw new Error('A + B must be below 180°'); C = Math.PI - A - B; c = v.c; a = c * Math.sin(A) / Math.sin(C); b = c * Math.sin(B) / Math.sin(C); }
          return { results: [R('a', a, '', 'auto', null, true), R('b', b, '', 'auto', null, true), R('c', c, '', 'auto', null, true), R('Angle A', A * D, '°', 3), R('Angle B', B * D, '°', 3), R('Angle C', C * D, '°', 3), R('Area', a * b * Math.sin(C) / 2, '', 'auto'), R('Perimeter', a + b + c, '', 'auto')] };
        }
      },
      {
        id: 'trig', icon: '〰️', title: 'Trigonometric functions', desc: 'sin, cos, tan and reciprocals for an angle, plus inverse functions.',
        formula: 'tan θ = sin θ / cos θ     sin²θ + cos²θ = 1',
        inputs: [{ k: 'x', l: 'Angle', v: 30 }, { k: 'u', l: 'Unit', opts: [['deg', 'degrees'], ['rad', 'radians']], v: 'deg' }, { k: 'r', l: 'Ratio for inverse functions (−1…1)', v: 0.5, min: -1, max: 1, step: 0.01 }],
        run: v => {
          const t = v.u === 'deg' ? v.x * RAD : v.x, s = Math.sin(t), c = Math.cos(t), z = x => (Math.abs(x) < 1e-12 ? 'undefined' : x), cl = x => (Math.abs(x) < 1e-12 ? 0 : x);
          return { results: [R('sin', cl(s), '', 6, null, true), R('cos', cl(c), '', 6, null, true), R('tan', Math.abs(c) < 1e-12 ? 'undefined' : s / c, '', 6, null, true), R('cot', Math.abs(s) < 1e-12 ? 'undefined' : c / s, '', 6), R('sec', Math.abs(c) < 1e-12 ? 'undefined' : 1 / c, '', 6), R('csc', Math.abs(s) < 1e-12 ? 'undefined' : 1 / s, '', 6), R('Angle in degrees', t * D, '°', 6), R('Angle in radians', t, 'rad', 6), R('asin(ratio)', Math.asin(v.r) * D, '°', 4), R('acos(ratio)', Math.acos(v.r) * D, '°', 4), R('atan(ratio)', Math.atan(v.r) * D, '°', 4)] };
        }
      },
      {
        id: 'cplx', icon: '🧮', title: 'Complex numbers (j-operator)', desc: 'Add, subtract, multiply or divide two complex numbers; results in rectangular and polar form.',
        formula: 'Z = a + jb = |Z|∠θ     |Z| = √(a² + b²)     θ = atan2(b, a)     (a+jb)(c+jd) = (ac − bd) + j(ad + bc)',
        inputs: [{ k: 'a', l: 'Z₁ real (a)', v: 3 }, { k: 'b', l: 'Z₁ imaginary (b)', v: 4 }, { k: 'op', l: 'Operation', opts: [['+', 'Z₁ + Z₂'], ['-', 'Z₁ − Z₂'], ['*', 'Z₁ × Z₂'], ['/', 'Z₁ ÷ Z₂']], v: '*' }, { k: 'c', l: 'Z₂ real (c)', v: 1 }, { k: 'd', l: 'Z₂ imaginary (d)', v: -2 }],
        run: v => {
          let re, im; const den = v.c * v.c + v.d * v.d;
          if (v.op === '+') { re = v.a + v.c; im = v.b + v.d; } else if (v.op === '-') { re = v.a - v.c; im = v.b - v.d; } else if (v.op === '*') { re = v.a * v.c - v.b * v.d; im = v.a * v.d + v.b * v.c; }
          else { if (den === 0) throw new Error('Cannot divide by zero'); re = (v.a * v.c + v.b * v.d) / den; im = (v.b * v.c - v.a * v.d) / den; }
          return { results: [R('Result (rectangular)', cstr(re, im), '', 0, null, true), R('Magnitude', Math.hypot(re, im), '', 'auto'), R('Angle', Math.atan2(im, re) * D, '°', 4), R('|Z₁|∠', `${ETO.fmt(Math.hypot(v.a, v.b), 4)} ∠ ${ETO.fmt(Math.atan2(v.b, v.a) * D, 3)}°`, ''), R('|Z₂|∠', `${ETO.fmt(Math.hypot(v.c, v.d), 4)} ∠ ${ETO.fmt(Math.atan2(v.d, v.c) * D, 3)}°`, '')] };
        }
      },
      {
        id: 'polar', icon: '🎯', title: 'Rectangular ↔ polar', desc: 'Convert a + jb to magnitude ∠ angle, or back.',
        formula: 'r = √(x² + y²)    θ = atan2(y, x)    x = r·cosθ    y = r·sinθ',
        inputs: [{ k: 'm', l: 'Convert', opts: [['rp', 'Rectangular → polar'], ['pr', 'Polar → rectangular']], v: 'rp' }, { k: 'x', l: 'x (real) / magnitude r', v: 3 }, { k: 'y', l: 'y (imaginary) / angle θ (degrees)', v: 4 }],
        run: v => {
          if (v.m === 'rp') return { results: [R('Magnitude r', Math.hypot(v.x, v.y), '', 'auto', null, true), R('Angle θ', Math.atan2(v.y, v.x) * D, '°', 4, null, true), R('Angle (0–360°)', (Math.atan2(v.y, v.x) * D + 360) % 360, '°', 4)] };
          return { results: [R('x (real)', v.x * Math.cos(v.y * RAD), '', 'auto', null, true), R('y (imaginary)', v.x * Math.sin(v.y * RAD), '', 'auto', null, true)] };
        }
      },
      {
        id: 'phasor', icon: '🔄', title: 'Phasor / vector addition', desc: 'Add several phasors or vectors given as magnitude and angle (e.g. currents or voltages from different phases).',
        formula: 'ΣX = Σ r·cosθ     ΣY = Σ r·sinθ     R = √(ΣX² + ΣY²)',
        inputs: [{ k: 'tbl', t: 'table', l: 'Phasors (add negative magnitude or +180° to subtract)', v: [{ n: 'I1', r: 100, a: 0 }, { n: 'I2', r: 100, a: -120 }, { n: 'I3', r: 100, a: 120 }], cols: [{ k: 'n', l: 'Name', t: 'text', d: 'P' }, { k: 'r', l: 'Magnitude', t: 'num', d: 0 }, { k: 'a', l: 'Angle °', t: 'num', d: 0 }] }],
        run: v => {
          const X = v.tbl.reduce((s, p) => s + p.r * Math.cos(p.a * RAD), 0), Y = v.tbl.reduce((s, p) => s + p.r * Math.sin(p.a * RAD), 0), r = Math.hypot(X, Y);
          return { results: [R('Resultant magnitude', Math.abs(r) < 1e-9 ? 0 : r, '', 'auto', null, true), R('Resultant angle', Math.abs(r) < 1e-9 ? 0 : Math.atan2(Y, X) * D, '°', 3), R('Real part', Math.abs(X) < 1e-9 ? 0 : X, '', 'auto'), R('Imag part', Math.abs(Y) < 1e-9 ? 0 : Y, '', 'auto')], notes: ['The default is a balanced 3-phase set – the sum is zero (neutral current = 0). Change one magnitude to see the neutral current of an unbalanced load.'] };
        }
      },
      {
        id: 'stat', icon: '📊', title: 'Statistics', desc: 'Paste or type numbers separated by spaces, commas or new lines.',
        formula: 'mean = Σx/n     s = √(Σ(x − mean)²/(n − 1))     RMS = √(Σx²/n)',
        inputs: [{ k: 'd', t: 'area', l: 'Data', v: '12.1, 11.8, 12.4, 12.0, 11.9, 12.3', rows: 4 }],
        run: v => {
          const a = nums(v.d); if (!a.length || a.some(x => !isFinite(x))) throw new Error('Enter numbers only, separated by spaces, commas or new lines');
          const n = a.length, sum = a.reduce((p, c) => p + c, 0), mean = sum / n, ss = a.reduce((p, c) => p + (c - mean) ** 2, 0), sorted = [...a].sort((x, y) => x - y), med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
          return { results: [R('Count', n, '', 0), R('Sum', sum, '', 'auto'), R('Mean', mean, '', 'auto', null, true), R('Median', med, '', 'auto'), R('Minimum', sorted[0], '', 'auto'), R('Maximum', sorted[n - 1], '', 'auto'), R('Range', sorted[n - 1] - sorted[0], '', 'auto'), R('Std deviation (sample)', n > 1 ? Math.sqrt(ss / (n - 1)) : 'n/a', '', 'auto'), R('Std deviation (population)', Math.sqrt(ss / n), '', 'auto'), R('Variance (sample)', n > 1 ? ss / (n - 1) : 'n/a', '', 'auto'), R('RMS', Math.sqrt(a.reduce((p, c) => p + c * c, 0) / n), '', 'auto')] };
        }
      },
      {
        id: 'wavg', icon: '⚖️', title: 'Weighted average', desc: 'Average of values with different weights (e.g. average PF weighted by kW).',
        formula: 'x̄ = Σ(w·x) / Σw',
        inputs: [{ k: 'tbl', t: 'table', l: 'Values', v: [{ x: 0.85, w: 300 }, { x: 0.9, w: 120 }, { x: 0.8, w: 450 }], cols: [{ k: 'x', l: 'Value', t: 'num', d: 0 }, { k: 'w', l: 'Weight', t: 'num', d: 1 }] }],
        run: v => { const sw = v.tbl.reduce((s, r) => s + r.w, 0); if (sw === 0) throw new Error('Sum of weights is zero'); return { results: [R('Weighted average', v.tbl.reduce((s, r) => s + r.w * r.x, 0) / sw, '', 'auto', null, true), R('Total weight', sw, '', 'auto'), R('Simple average', v.tbl.reduce((s, r) => s + r.x, 0) / v.tbl.length, '', 'auto')] }; }
      },
      {
        id: 'tol', icon: '🎚️', title: 'Tolerance & error', desc: 'Tolerance band for a nominal value and percentage error of a measurement.',
        formula: 'min/max = N × (1 ∓ tol%)     error% = (measured − reference)/reference × 100',
        inputs: [{ k: 'n', l: 'Nominal value', v: 100 }, { k: 'tol', l: 'Tolerance', u: '±%', v: 5, min: 0 }, { k: 'm', l: 'Measured value', v: 104.2 }],
        run: v => {
          if (v.n === 0) throw new Error('Nominal value cannot be zero');
          const lo = v.n * (1 - v.tol / 100), hi = v.n * (1 + v.tol / 100), e = (v.m - v.n) / v.n * 100, ok = v.m >= Math.min(lo, hi) && v.m <= Math.max(lo, hi);
          return { results: [R('Minimum', lo, '', 'auto'), R('Maximum', hi, '', 'auto'), R('Measured error', e, '%', 3, ok ? 'ok' : 'bad', true), R('Within tolerance', ok ? 'YES' : 'NO', '', 0, ok ? 'ok' : 'bad')] };
        }
      },
      {
        id: 'base', icon: '💾', title: 'Number bases (binary / octal / decimal / hex)', desc: 'Convert whole numbers between bases – useful for PLC / alarm / Modbus addresses and bit patterns.',
        formula: 'value = Σ digit × base^position',
        inputs: [{ k: 's', t: 'text', l: 'Number', v: 'FF' }, { k: 'b', l: 'Number is in base', opts: [[2, 'Binary (2)'], [8, 'Octal (8)'], [10, 'Decimal (10)'], [16, 'Hexadecimal (16)']], v: 16 }],
        run: v => {
          const t = String(v.s).trim().replace(/^0x/i, '').replace(/[\s_]/g, '').toUpperCase(), ok = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9A-F]+$/ }[v.b];
          if (!t || !ok.test(t)) throw new Error('Not a valid base-' + v.b + ' number');
          const n = parseInt(t, v.b); if (n > Number.MAX_SAFE_INTEGER) throw new Error('Number too large (max 2⁵³ − 1)');
          return { results: [R('Decimal', n.toString(10), '', 0, null, true), R('Binary', n.toString(2), '', 0), R('Octal', n.toString(8), '', 0), R('Hexadecimal', n.toString(16).toUpperCase(), '', 0, null, true), R('Bits needed', n === 0 ? 1 : Math.floor(Math.log2(n)) + 1, 'bit', 0)] };
        }
      },
      {
        id: 'logexp', icon: 'ℯ', title: 'Powers, roots & logarithms', desc: 'x², √x, xⁿ, ⁿ√x, logₐ(x), ln, eˣ, 10ˣ.',
        formula: 'log_b x = ln x / ln b',
        inputs: [{ k: 'x', l: 'x', v: 100 }, { k: 'n', l: 'n (power / root)', v: 3 }, { k: 'b', l: 'Log base b', v: 2, min: 0.0001 }],
        run: v => {
          const x = v.x, r = [R('x²', x * x, '', 'auto'), R('x³', x ** 3, '', 'auto'), R('xⁿ', x ** v.n, '', 'auto'), R('1/x', x === 0 ? 'undefined' : 1 / x, '', 'auto'), R('√x', x >= 0 ? Math.sqrt(x) : 'imaginary', '', 'auto', null, true), R('ⁿ√x', x >= 0 || v.n % 2 !== 0 ? Math.sign(x) * Math.abs(x) ** (1 / v.n) : 'imaginary', '', 'auto'), R('eˣ', Math.exp(x), '', 'auto'), R('10ˣ', 10 ** x, '', 'auto')];
          if (x > 0) { r.push(R('log₁₀ x', Math.log10(x), '', 'auto', null, true), R('ln x', Math.log(x), '', 'auto'), R('log_b x', v.b === 1 ? 'undefined' : Math.log(x) / Math.log(v.b), '', 'auto'), R('log₂ x', Math.log2(x), '', 'auto')); }
          return { results: r };
        }
      },
      {
        id: 'round', icon: '🔢', title: 'Rounding, significant figures & notation', desc: 'Round a number and show it in scientific / engineering notation.',
        formula: 'Engineering notation: exponent is a multiple of 3',
        inputs: [{ k: 'x', l: 'Number', v: 12345.6789 }, { k: 'dp', l: 'Decimal places', v: 2, min: 0, max: 15, step: 1 }, { k: 'sf', l: 'Significant figures', v: 4, min: 1, max: 15, step: 1 }],
        run: v => {
          const x = v.x; if (x === 0) return { results: [R('Result', 0, '', 0)] };
          const e = Math.floor(Math.log10(Math.abs(x))), ee = Math.floor(e / 3) * 3;
          return { results: [R('Rounded to decimals', x.toFixed(v.dp), '', 0, null, true), R('Rounded to significant figures', Number(x.toPrecision(v.sf)).toString(), '', 0, null, true), R('Scientific notation', `${(x / 10 ** e).toFixed(Math.max(0, v.sf - 1))} × 10^${e}`, '', 0), R('Engineering notation', `${Number((x / 10 ** ee).toPrecision(v.sf))} × 10^${ee}`, '', 0), R('Nearest integer', Math.round(x), '', 0), R('Floor / ceiling', `${Math.floor(x)} / ${Math.ceil(x)}`, '', 0)] };
        }
      },
      {
        id: 'series', icon: '🪜', title: 'Arithmetic & geometric series', desc: 'n-th term and sum.',
        formula: 'AP: aₙ = a₁ + (n−1)d, Sₙ = n(a₁+aₙ)/2     GP: aₙ = a₁rⁿ⁻¹, Sₙ = a₁(1−rⁿ)/(1−r)',
        inputs: [{ k: 't', l: 'Series', opts: [['ap', 'Arithmetic (common difference d)'], ['gp', 'Geometric (common ratio r)']], v: 'ap' }, { k: 'a', l: 'First term a₁', v: 2 }, { k: 'd', l: 'd or r', v: 3 }, { k: 'n', l: 'Number of terms n', v: 10, min: 1, step: 1 }],
        run: v => {
          if (v.t === 'ap') { const an = v.a + (v.n - 1) * v.d; return { results: [R('aₙ', an, '', 'auto', null, true), R('Sₙ', v.n * (v.a + an) / 2, '', 'auto', null, true)] }; }
          const an = v.a * v.d ** (v.n - 1), sn = v.d === 1 ? v.a * v.n : v.a * (1 - v.d ** v.n) / (1 - v.d);
          return { results: [R('aₙ', an, '', 'auto', null, true), R('Sₙ', sn, '', 'auto', null, true), R('Sum to infinity', Math.abs(v.d) < 1 ? v.a / (1 - v.d) : 'diverges', '', 'auto')] };
        }
      },
      {
        id: 'comb', icon: '🎲', title: 'Factorial, permutations & combinations', desc: 'n!, nPr and nCr.',
        formula: 'nPr = n!/(n−r)!     nCr = n!/(r!(n−r)!)',
        inputs: [{ k: 'n', l: 'n', v: 10, min: 0, max: 170, step: 1 }, { k: 'r', l: 'r', v: 3, min: 0, max: 170, step: 1 }],
        run: v => {
          if (!Number.isInteger(v.n) || !Number.isInteger(v.r) || v.r > v.n) throw new Error('n and r must be whole numbers with r ≤ n');
          let p = 1; for (let i = 0; i < v.r; i++) p *= v.n - i; let f = 1; for (let i = 2; i <= v.n; i++) f *= i; let rf = 1; for (let i = 2; i <= v.r; i++) rf *= i;
          return { results: [R('n!', f, '', 'auto'), R('nPr (ordered)', p, '', 'auto', null, true), R('nCr (unordered)', p / rf, '', 'auto', null, true)] };
        }
      },
      {
        id: 'gcd', icon: '➗', title: 'GCD, LCM & fractions', desc: 'Greatest common divisor, least common multiple and simplest fraction (e.g. gear tooth ratios).',
        formula: 'LCM = |a·b| / GCD',
        inputs: [{ k: 'a', l: 'a (integer)', v: 48, step: 1 }, { k: 'b', l: 'b (integer)', v: 180, step: 1 }],
        run: v => {
          if (!Number.isInteger(v.a) || !Number.isInteger(v.b) || (v.a === 0 && v.b === 0)) throw new Error('Enter whole numbers (not both zero)');
          const g = gcd(v.a, v.b);
          return { results: [R('GCD', g, '', 0, null, true), R('LCM', Math.abs(v.a * v.b) / g, '', 0), R('Fraction a/b simplified', v.b === 0 ? 'undefined' : `${v.a / g * Math.sign(v.b)} / ${Math.abs(v.b / g)}`, '', 0), R('Decimal a/b', v.b === 0 ? 'undefined' : v.a / v.b, '', 6)] };
        }
      }
    ]
  });
})();
