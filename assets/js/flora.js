/* Procedural line-art branches. Each branch grows from a root: stem first, then twigs,
   leaves and blossoms. A seed gives a repeatable shape, so left and right florals differ
   and nothing looks mirrored. Pure functions for buildBranch; mountFlora touches the DOM.
   Exposes window.WeddingFlora. */
(function (root) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var VIEW_MIN = 6;
  var VIEW_MAX = 154;

  // Small seeded random generator (mulberry32). Same seed, same drawing.
  function random(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(v) {
    return Math.min(VIEW_MAX, Math.max(VIEW_MIN, v));
  }

  function point(p) {
    return p[0].toFixed(1) + ' ' + p[1].toFixed(1);
  }

  // Smooth path through the points (Catmull-Rom converted to cubic segments)
  function curveD(pts) {
    var d = 'M' + point(pts[0]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(i - 1, 0)];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[Math.min(i + 2, pts.length - 1)];
      var c1 = [clamp(p1[0] + (p2[0] - p0[0]) / 6), clamp(p1[1] + (p2[1] - p0[1]) / 6)];
      var c2 = [clamp(p2[0] - (p3[0] - p1[0]) / 6), clamp(p2[1] - (p3[1] - p1[1]) / 6)];
      d += ' C' + point(c1) + ' ' + point(c2) + ' ' + point(p2);
    }
    return d;
  }

  // Almond leaf from base b along angle a. Returns the outline and the centre vein.
  function leafShapes(b, a, len, width) {
    var tip = [clamp(b[0] + Math.cos(a) * len), clamp(b[1] + Math.sin(a) * len)];
    var nx = -Math.sin(a) * width;
    var ny = Math.cos(a) * width;
    var mid = [b[0] + Math.cos(a) * len * 0.45, b[1] + Math.sin(a) * len * 0.45];
    var c1 = [clamp(mid[0] + nx), clamp(mid[1] + ny)];
    var c2 = [clamp(mid[0] - nx), clamp(mid[1] - ny)];
    var vein = [b, [b[0] + Math.cos(a) * len * 0.7, b[1] + Math.sin(a) * len * 0.7]];
    return [
      { tag: 'path', cls: 'ln', attrs: { d: 'M' + point(b) + ' Q' + point(c1) + ' ' + point(tip) + ' Q' + point(c2) + ' ' + point(b) + ' Z' } },
      { tag: 'path', cls: 'ln', attrs: { d: 'M' + point(vein[0]) + ' L' + point(vein[1]) } }
    ];
  }

  // Five teardrop petals fanned around a centre, each an ellipse turned to point outward,
  // plus a small centre. Petals fill in after their lines are drawn (see .petal in style.css).
  function blossomShapes(c, r) {
    var shapes = [];
    for (var k = 0; k < 5; k++) {
      var a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      var cx = clamp(c[0] + Math.cos(a) * r * 0.55);
      var cy = clamp(c[1] + Math.sin(a) * r * 0.55);
      shapes.push({
        tag: 'ellipse',
        cls: 'ln petal',
        attrs: {
          cx: cx.toFixed(1),
          cy: cy.toFixed(1),
          rx: (r * 0.42).toFixed(1),
          ry: (r * 0.6).toFixed(1),
          transform: 'rotate(' + ((a * 180) / Math.PI + 90).toFixed(1) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')'
        }
      });
    }
    shapes.push({
      tag: 'circle',
      cls: 'ln petal',
      attrs: { cx: c[0].toFixed(1), cy: c[1].toFixed(1), r: (r * 0.22).toFixed(1) }
    });
    return shapes;
  }

  // opts: { root: [x, y], dir: 'up' | 'down', lean: 1 | -1 }
  // lean picks which side the branch bends to. Left and right florals use different leans and seeds.
  function buildBranch(seed, opts) {
    var rand = random(seed);
    var base = opts.dir === 'down' ? Math.PI / 2 : -Math.PI / 2;
    var lean = opts.lean;
    var pts = [[clamp(opts.root[0]), clamp(opts.root[1])]];
    // A branch growing down from the top corners needs a wider spread to reach into the screen
    var spread = opts.dir === 'down' ? 0.9 : 0.35;
    var ang = base + lean * spread;
    for (var i = 0; i < 5; i++) {
      ang += lean * (0.08 + rand() * 0.1) + (rand() - 0.5) * 0.35;
      var step = 24 + rand() * 6;
      var last = pts[pts.length - 1];
      pts.push([clamp(last[0] + Math.cos(ang) * step), clamp(last[1] + Math.sin(ang) * step)]);
    }

    var shapes = [{ tag: 'path', cls: 'ln', attrs: { d: curveD(pts) } }];
    var twigs = [];

    // Twigs leave the stem alternately left and right
    for (var k = 1; k < pts.length - 1; k++) {
      var side = k % 2 ? 1 : -1;
      var dir = Math.atan2(pts[k + 1][1] - pts[k][1], pts[k + 1][0] - pts[k][0]);
      var tAng = dir + side * (0.7 + rand() * 0.25);
      var tLen = 34 + rand() * 14;
      var mid = [pts[k][0] + Math.cos(tAng) * tLen * 0.5, pts[k][1] + Math.sin(tAng) * tLen * 0.5];
      var end = [pts[k][0] + Math.cos(tAng) * tLen, pts[k][1] + Math.sin(tAng) * tLen];
      var twig = [pts[k], [clamp(mid[0]), clamp(mid[1])], [clamp(end[0]), clamp(end[1])]];
      twigs.push(twig);
      shapes.push({ tag: 'path', cls: 'ln', attrs: { d: curveD(twig) } });
    }

    var leaves = [];
    pts.slice(1).forEach(function (p) {
      leaves.push({ at: p, a: base + lean * (0.5 + rand() * 0.6), len: 18 + rand() * 6 });
    });
    twigs.forEach(function (twig) {
      var tip = twig[2];
      var before = twig[1];
      var a = Math.atan2(tip[1] - before[1], tip[0] - before[0]);
      leaves.push({ at: before, a: a + 0.6, len: 16 + rand() * 6 });
    });
    leaves.forEach(function (lf) {
      leafShapes(lf.at, lf.a, lf.len, 5 + rand() * 2).forEach(function (s) { shapes.push(s); });
    });

    // Large blossoms on every twig tip and at the end of the stem, so the middle of the cover is not empty
    twigs.slice(-2).forEach(function (twig) {
      blossomShapes(twig[2], 9 + rand() * 2).forEach(function (s) { shapes.push(s); });
    });
    blossomShapes(pts[pts.length - 1], 9 + rand() * 2).forEach(function (s) { shapes.push(s); });

    return shapes;
  }

  // Plum-blossom branch (hồng mai) from the quanbui210/wedding-invitation template, used with the
  // author's permission (GitHub issue #1, 2026-11-02). Credit is kept in the page footer and README.
  var MAI_BRANCH = [
    'M0 262 C40 232 70 202 96 170 C120 140 150 122 190 106 C220 94 250 72 268 50',
    'M96 170 C110 142 112 112 104 84',
    'M190 106 C202 122 224 130 248 128',
    'M150 124 C160 112 170 102 172 88',
    'M58 212 C80 208 96 200 110 188',
    'M232 84 C238 76 240 68 238 60'
  ];
  var MAI_BLOSSOMS = [[268, 50, 8], [104, 84, 7], [248, 128, 7.5], [172, 88, 6], [130, 134, 5.5], [110, 188, 5.5]];
  var MAI_BLOOM_SCALE = 1.35; // the template's blossoms, drawn larger for the cover
  // Each top corner keeps a different set of twigs, blossoms and crop, so the two are not copies
  var MAI_TOP = {
    'top-left': { branches: [0, 1, 3], blossoms: [[268, 50, 8], [104, 84, 7], [172, 88, 6]], box: '0 0 300 264' },
    'top-right': { branches: [0, 2, 3, 5], blossoms: [[248, 128, 7.5], [238, 60, 6]], box: '70 0 230 264' }
  };
  var MAI_DOTS = [[238, 58, 2.6], [60, 210, 2.4], [214, 98, 2.2]];
  var MAI_SPARKLES = [[206, 40, 4], [60, 150, 3]];

  function sparkleD(x, y, r) {
    return 'M' + x + ' ' + (y - r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) +
      ' Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - r);
  }

  // One blossom: five petals that fill in once drawn, a centre and a short stamen
  function maiBlossom(x, y, r) {
    var shapes = [];
    for (var i = 0; i < 5; i++) {
      var a = ((i * 72 - 90 + (x % 30)) * Math.PI) / 180;
      shapes.push({ tag: 'circle', cls: 'ln petal', attrs: { cx: (x + Math.cos(a) * r).toFixed(1), cy: (y + Math.sin(a) * r).toFixed(1), r: (r * 0.7).toFixed(1) } });
    }
    shapes.push({ tag: 'circle', cls: 'ln', attrs: { cx: String(x), cy: String(y), r: (r * 0.28).toFixed(1) } });
    shapes.push({ tag: 'path', cls: 'ln', attrs: { d: 'M' + x + ' ' + y + ' L' + (x + r * 0.5) + ' ' + (y - r * 0.55) + ' M' + x + ' ' + y + ' L' + (x - r * 0.55) + ' ' + (y - r * 0.4) } });
    return shapes;
  }

  function maiShapes(branches, blossoms) {
    var shapes = (branches || MAI_BRANCH.map(function (d, i) { return i; })).map(function (i) { return { tag: 'path', cls: 'ln', attrs: { d: MAI_BRANCH[i] } }; });
    (blossoms || MAI_BLOSSOMS).forEach(function (b) { maiBlossom(b[0], b[1], b[2] * MAI_BLOOM_SCALE).forEach(function (s) { shapes.push(s); }); });
    MAI_DOTS.forEach(function (c) { shapes.push({ tag: 'circle', cls: 'ln', attrs: { cx: String(c[0]), cy: String(c[1]), r: String(c[2]) } }); });
    MAI_SPARKLES.forEach(function (c) { shapes.push({ tag: 'path', cls: 'ln', attrs: { d: sparkleD(c[0], c[1], c[2]) } }); });
    return shapes;
  }

  // Reads data-seed, data-root-x, data-root-y, data-dir, data-lean from the svg, then draws it.
  // data-art="mai" draws the plum-blossom branch instead.
  function mountFlora(svg) {
    if (svg.childNodes.length > 0) return;
    var d = svg.dataset;
    var shapes;
    if (d.art === 'mai') {
      var top = MAI_TOP[d.variant];
      svg.setAttribute('viewBox', top ? top.box : '0 0 300 264');
      shapes = top ? maiShapes(top.branches, top.blossoms) : maiShapes();
    } else {
      shapes = buildBranch(Number(d.seed) || 1, {
        root: [Number(d.rootX) || 0, Number(d.rootY) || 0],
        dir: d.dir || 'up',
        lean: Number(d.lean) || 1
      });
    }
    shapes.forEach(function (s) {
      var el = document.createElementNS(NS, s.tag);
      Object.keys(s.attrs).forEach(function (key) { el.setAttribute(key, s.attrs[key]); });
      el.setAttribute('class', s.cls);
      svg.appendChild(el);
    });
  }

  // A falling blossom in a 40 x 40 box, drawn as outlines: five round petals that overlap a little, and a centre dot
  function fallingBloomShapes() {
    var shapes = [];
    for (var i = 0; i < 5; i++) {
      shapes.push({ tag: 'path', attrs: { d: 'M20 19 C13 17 12 9 20 5 C28 9 27 17 20 19 Z', transform: 'rotate(' + (i * 72) + ' 20 20)' } });
    }
    shapes.push({ tag: 'circle', attrs: { cx: '20', cy: '20', r: '1.6' } });
    return shapes;
  }

  // Petals that fall once across the cover. Each one gets its own start, drift and speed from the seed.
  // Each petal falls slowly, starts at a different time, and sways on its own period and
  // amplitude while it turns over, so no two drop the same way.
  function fallingPetals(seed, count) {
    var rand = random(seed);
    var petals = [];
    for (var i = 0; i < count; i++) {
      var duration = Math.round(11000 + rand() * 2000);
      var period = Math.round(1800 + rand() * 1400);
      petals.push({
        left: Math.round(rand() * 100),
        drift: Math.round((rand() - 0.5) * 170),
        delay: Math.round(rand() * 7000),
        duration: duration,
        size: Math.round(12 + rand() * 8),
        period: period,
        amp: Math.round(24 + rand() * 34),
        turn: Math.round(300 + rand() * 420)
      });
    }
    return petals;
  }

  // Adds the petals to the container. Only called when motion is allowed (see main.js).
  function leafElement() {
    var leaf = document.createElement('span');
    leaf.className = 'fall__leaf';
    return leaf;
  }

  function bloomElement() {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('class', 'fall__leaf fall__bloom');
    svg.setAttribute('aria-hidden', 'true');
    fallingBloomShapes().forEach(function (s) {
      var el = document.createElementNS(NS, s.tag);
      Object.keys(s.attrs).forEach(function (key) { el.setAttribute(key, s.attrs[key]); });
      svg.appendChild(el);
    });
    return svg;
  }

  function mountPetalFall(container, seed, count) {
    fallingPetals(seed, count).forEach(function (p, i) {
      var outer = document.createElement('span');
      outer.className = 'fall__petal';
      outer.style.setProperty('--x', p.left + '%');
      outer.style.setProperty('--dx', p.drift + 'px');
      outer.style.setProperty('--d', p.delay + 'ms');
      outer.style.setProperty('--t', p.duration + 'ms');
      // Every third piece is a blossom, the rest are gold leaves, so the two alternate as they fall
      var leaf = i % 3 === 1 ? bloomElement() : leafElement();
      leaf.style.setProperty('--s', p.size + 'px');
      leaf.style.setProperty('--p', p.period + 'ms');
      leaf.style.setProperty('--amp', p.amp + 'px');
      leaf.style.setProperty('--turn', p.turn + 'deg');
      outer.appendChild(leaf);
      container.appendChild(outer);
    });
  }

  root.WeddingFlora = {
    buildBranch: buildBranch,
    mountFlora: mountFlora,
    maiShapes: maiShapes,
    fallingBloomShapes: fallingBloomShapes,
    MAI_TOP: MAI_TOP,
    fallingPetals: fallingPetals,
    mountPetalFall: mountPetalFall
  };
})(window);
