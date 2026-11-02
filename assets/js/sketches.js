/* Hand-drawn line illustrations as inline SVG. Adapted from quanbui210/wedding-invitation
   (sketches.js; permission in README). Exposes window.Sketches.
   element(name) returns an <svg> node; markup is built from fixed strings only, never user text. */
(function (root) {
  'use strict';

  function heart(x, y, s) {
    return '<path d="M' + x + ' ' + (y + 3 * s) + ' C' + (x - 1 * s) + ' ' + y + ' ' + (x - 6 * s) + ' ' + (y - 1 * s) + ' ' + (x - 6 * s) + ' ' + (y + 3 * s) +
      ' C' + (x - 6 * s) + ' ' + (y + 6 * s) + ' ' + (x - 2 * s) + ' ' + (y + 8 * s) + ' ' + x + ' ' + (y + 11 * s) +
      ' C' + (x + 2 * s) + ' ' + (y + 8 * s) + ' ' + (x + 6 * s) + ' ' + (y + 6 * s) + ' ' + (x + 6 * s) + ' ' + (y + 3 * s) +
      ' C' + (x + 6 * s) + ' ' + (y - 1 * s) + ' ' + (x + 1 * s) + ' ' + y + ' ' + x + ' ' + (y + 3 * s) + '"/>';
  }
  function sparkle(x, y, r) {
    return '<path d="M' + x + ' ' + (y - r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) +
      ' Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + '"/>';
  }
  function blossom(x, y, r) { // five-petal hoa mai
    var p = '';
    for (var i = 0; i < 5; i++) {
      var a = (i * 72 - 90) * Math.PI / 180;
      p += '<circle cx="' + (x + Math.cos(a) * r).toFixed(1) + '" cy="' + (y + Math.sin(a) * r).toFixed(1) + '" r="' + (r * .62).toFixed(1) + '"/>';
    }
    return p + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .3).toFixed(1) + '"/>';
  }
  // Filled glyph that fades in after the lines
  function hy(x, y, size) {
    return '<text class="sketch__ink" x="' + x + '" y="' + y + '" font-size="' + size + '" text-anchor="middle">囍</text>';
  }

  // Three-bay house with upturned eaves, lanterns under the roof and an areca palm on one side
  function house(treeSide) {
    var d = '';
    function L(x1, y1, x2, y2) { return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '"/>'; }
    d += L(6, 108, 154, 108);
    d += '<path d="M30 108 L30 102 L130 102 L130 108"/><path d="M66 108 L66 105 L94 105 L94 108"/>';
    d += L(38, 102, 38, 64) + L(122, 102, 122, 64) + L(58, 102, 58, 64) + L(102, 102, 102, 64);
    d += '<path d="M70 102 L70 76 L90 76 L90 102"/>' + L(80, 77, 80, 102) + hy(80, 92, 8);
    [44, 106].forEach(function (x) {
      d += '<path d="M' + x + ' 90 L' + x + ' 76 L' + (x + 10) + ' 76 L' + (x + 10) + ' 90 Z"/>' + L(x + 3.3, 76, x + 3.3, 90) + L(x + 6.7, 76, x + 6.7, 90);
    });
    d += '<path d="M24 64 C44 67 116 67 136 64"/>';
    d += '<path d="M24 64 C19 62 17 58 19 55"/><path d="M136 64 C141 62 143 58 141 55"/>';
    d += L(26, 62, 48, 40) + L(134, 62, 112, 40) + L(46, 40, 114, 40);
    d += '<path d="M46 40 C42 38 40 34 42 31"/><path d="M114 40 C118 38 120 34 118 31"/>';
    for (var x = 56; x <= 104; x += 8) d += L(x, 42, x + (x - 80) * .12, 63);
    d += '<circle cx="80" cy="35" r="3"/><path d="M72 39 C70 35 73 33 75 35 M88 39 C90 35 87 33 85 35"/>';
    [31, 129].forEach(function (x) {
      d += L(x, 65, x, 70) + '<path d="M' + (x - 3) + ' 71 C' + (x - 6) + ' 74 ' + (x - 6) + ' 79 ' + (x - 3) + ' 82 L' + (x + 3) + ' 82 C' + (x + 6) + ' 79 ' + (x + 6) + ' 74 ' + (x + 3) + ' 71 Z"/>' + L(x, 82, x, 86);
    });
    var t = treeSide === 'left' ? 14 : 146, k = treeSide === 'left' ? 1 : -1;
    d += '<path d="M' + t + ' 108 C' + (t - 1) + ' 80 ' + (t + 1) + ' 50 ' + t + ' 22"/>';
    for (var y = 34; y <= 98; y += 9) d += L(t - 1.6, y, t + 1.6, y - .6);
    d += '<path d="M' + t + ' 22 C' + (t + 8 * k) + ' 15 ' + (t + 15 * k) + ' 17 ' + (t + 20 * k) + ' 23"/>';
    d += '<path d="M' + t + ' 22 C' + (t + 6 * k) + ' 12 ' + (t + 12 * k) + ' 9 ' + (t + 18 * k) + ' 11"/>';
    d += '<path d="M' + t + ' 22 C' + (t - 4 * k) + ' 13 ' + (t - 9 * k) + ' 11 ' + (t - 12 * k) + ' 14"/>';
    d += '<path d="M' + t + ' 22 C' + (t - 6 * k) + ' 17 ' + (t - 11 * k) + ' 20 ' + (t - 12 * k) + ' 27"/>';
    d += '<path d="M' + t + ' 22 C' + (t + 1) + ' 14 ' + (t - 1) + ' 9 ' + t + ' 5"/>';
    d += '<circle cx="' + (t + 2.5 * k) + '" cy="27" r="1.6"/><circle cx="' + (t + 4.5 * k) + '" cy="29.5" r="1.6"/><circle cx="' + (t + 1.5 * k) + '" cy="30.5" r="1.6"/>';
    d += sparkle(treeSide === 'left' ? 140 : 20, 20, 3.5);
    return d;
  }

  // Hội An silk lantern hanging from a cord
  function lantern(cx, top, s) {
    function X(v) { return (cx + v * s).toFixed(1); }
    function Y(v) { return (top + v * s).toFixed(1); }
    return '<path d="M' + X(0) + ' ' + Y(-12) + ' L' + X(0) + ' ' + Y(0) + '"/>' +
      '<path d="M' + X(-5) + ' ' + Y(3) + ' L' + X(-5) + ' ' + Y(0) + ' L' + X(5) + ' ' + Y(0) + ' L' + X(5) + ' ' + Y(3) + '"/>' +
      '<path d="M' + X(-6) + ' ' + Y(3) + ' C' + X(-22) + ' ' + Y(16) + ' ' + X(-22) + ' ' + Y(40) + ' ' + X(-6) + ' ' + Y(52) +
        ' L' + X(6) + ' ' + Y(52) + ' C' + X(22) + ' ' + Y(40) + ' ' + X(22) + ' ' + Y(16) + ' ' + X(6) + ' ' + Y(3) + ' Z"/>' +
      '<path d="M' + X(-3) + ' ' + Y(3) + ' C' + X(-13) + ' ' + Y(18) + ' ' + X(-13) + ' ' + Y(38) + ' ' + X(-3) + ' ' + Y(52) + '"/>' +
      '<path d="M' + X(3) + ' ' + Y(3) + ' C' + X(13) + ' ' + Y(18) + ' ' + X(13) + ' ' + Y(38) + ' ' + X(3) + ' ' + Y(52) + '"/>' +
      '<path d="M' + X(-5) + ' ' + Y(52) + ' L' + X(-5) + ' ' + Y(55) + ' L' + X(5) + ' ' + Y(55) + ' L' + X(5) + ' ' + Y(52) + '"/>' +
      '<path d="M' + X(0) + ' ' + Y(55) + ' L' + X(0) + ' ' + Y(60) + ' M' + X(-2) + ' ' + Y(60) + ' L' + X(-3) + ' ' + Y(72) +
        ' M' + X(0) + ' ' + Y(60) + ' L' + X(0) + ' ' + Y(73) + ' M' + X(2) + ' ' + Y(60) + ' L' + X(3) + ' ' + Y(72) + '"/>' +
      hy(X(0), Y(32), (11 * s).toFixed(1));
  }

  var ART = {
    // Đón khách: two silk lanterns on a ribbon
    lanterns: function () {
      return '<path d="M8 16 C50 30 110 30 152 10"/>' +
        lantern(56, 38, 1) + lantern(110, 34, .82) +
        blossom(18, 20, 3) + blossom(144, 13, 2.6) +
        sparkle(84, 18, 4) + sparkle(138, 44, 3);
    },

    // Tơ hồng: two threads from the families, tied in a heart between the couple
    thread: function () {
      return '<path d="M100 0 C100 34 150 30 189 50"/>' +
        '<path d="M300 0 C300 34 250 30 211 50"/>' +
        heart(200, 40, 1.8) +
        '<path d="M200 62 C178 70 104 66 100 110"/>' +
        '<path d="M200 62 C222 70 296 66 300 110"/>' +
        sparkle(160, 20, 4) + sparkle(242, 24, 3.5);
    },

    // Lễ vu quy: the bride's house
    houseBride: function () { return house('right'); },
    // Nhà trai: the groom's house
    houseGroom: function () { return house('left'); },

    // Lễ thành hôn: teapot and two cups for the tea ceremony
    tea: function () {
      return '<path d="M40 64 C36 86 48 97 60 97 C72 97 84 86 80 64"/>' +
        '<path d="M40 64 C47 60 73 60 80 64"/>' +
        '<path d="M48 62 C50 55 70 55 72 62"/><circle cx="60" cy="52" r="3"/>' +
        '<path d="M41 80 C31 78 26 64 20 54 L24 54 C28 61 33 68 40 70"/>' +
        '<path d="M80 68 C96 65 97 89 78 87"/>' +
        '<path d="M51 97 L53 101 L67 101 L69 97"/>' +
        hy(60, 84, 11) +
        '<path d="M96 84 L118 84 C117 95 113 100 107 100 C101 100 97 95 96 84 Z"/><path d="M103 100 L102 103 L112 103 L111 100"/>' +
        '<path d="M122 84 L144 84 C143 95 139 100 133 100 C127 100 123 95 122 84 Z"/><path d="M129 100 L128 103 L138 103 L137 100"/>' +
        '<path d="M107 78 C103 72 111 68 107 61"/><path d="M133 78 C129 72 137 68 133 61"/>' +
        '<path d="M86 108 C108 112 132 112 152 107"/>' +
        sparkle(30, 30, 4) + sparkle(142, 40, 3);
    },

    // Tiệc cưới: three-tier cake with apricot blossoms
    cake: function () {
      function scallop(x0, x1, y) {
        var d = 'M' + x0 + ' ' + y;
        for (var x = x0; x < x1; x += 8) d += ' Q' + (x + 4) + ' ' + (y + 5) + ' ' + (x + 8) + ' ' + y;
        return '<path d="' + d + '"/>';
      }
      return '<path d="M36 104 L124 104"/><path d="M42 107 L118 107"/>' +
        '<path d="M44 104 L44 80 L116 80 L116 104"/>' + scallop(44, 116, 80) +
        '<path d="M54 80 L54 62 L106 62 L106 80"/>' + scallop(54, 102, 62) +
        '<path d="M64 62 L64 46 L96 46 L96 62"/>' + scallop(64, 96, 46) +
        heart(80, 28, 1.2) + '<path d="M80 41 L80 46"/>' +
        blossom(50, 92, 3) + blossom(110, 90, 2.6) + blossom(60, 71, 2.4) + blossom(100, 72, 2.4) +
        sparkle(30, 40, 4) + sparkle(130, 30, 3.5);
    }
  };

  var VIEWBOX = { thread: '0 0 400 110' }; // wide drawings; the rest are 160 × 120

  function markup(name) {
    if (!ART[name]) return '';
    return '<svg xmlns="http://www.w3.org/2000/svg" class="sketch sketch--' + name + '" viewBox="' + (VIEWBOX[name] || '0 0 160 120') + '" aria-hidden="true" focusable="false">' +
      '<g filter="url(#hand)" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">' +
      ART[name]() + '</g></svg>';
  }

  // Each stroke gets pathLength=1 and class .ln so style.css can draw it on when its block is revealed.
  // --i sets the stroke order within the drawing.
  function prepStrokes(svg) {
    svg.querySelectorAll('path, circle, text').forEach(function (el, i) {
      if (el.tagName === 'text') return;
      el.setAttribute('pathLength', '1');
      el.classList.add('ln');
      el.style.setProperty('--i', i);
    });
  }

  // Parses the fixed markup above into a node. Only our own strings reach the parser.
  function element(name) {
    var text = markup(name);
    if (!text) return null;
    var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    var svg = document.importNode(doc.documentElement, true);
    prepStrokes(svg);
    return svg;
  }

  root.Sketches = { element: element };
})(window);
