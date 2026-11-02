/* Guest name from the ?to= link. Pure functions, no DOM, so they can be unit tested.
   Exposes window.WeddingGuest. */
(function (root) {
  'use strict';

  var MAX_CHARS = 40;

  // Text only: strips control characters and angle brackets, collapses spaces, caps length.
  // Returns the fallback when nothing usable is left.
  function sanitizeGuestName(raw, fallback) {
    var clean = String(raw || '')
      .replace(/[\u0000-\u001F\u007F<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    var chars = Array.from(clean).slice(0, MAX_CHARS).join('');
    return chars || fallback || '';
  }

  root.WeddingGuest = {
    MAX_CHARS: MAX_CHARS,
    sanitizeGuestName: sanitizeGuestName
  };
})(window);
