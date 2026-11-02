/* RSVP form: cleaning and checks are pure (unit tested); mount() binds the form and sends it.
   Exposes window.WeddingRsvp. */
(function (root) {
  'use strict';

  var MAX_NAME = 40;
  var MAX_PHONE = 15;
  var MAX_MESSAGE = 1000;
  var MAX_COUNT = 10;

  // Trims and caps every field. Anything unexpected falls back to a safe value.
  function cleanRsvp(raw) {
    var text = function (value, max) { return String(value == null ? '' : value).trim().slice(0, max); };
    var count = Math.min(MAX_COUNT, Math.max(1, parseInt(raw.count, 10) || 1));
    return {
      name: text(raw.name, MAX_NAME),
      phone: text(raw.phone, MAX_PHONE),
      attend: raw.attend === 'no' ? 'no' : 'yes',
      count: count,
      guestOf: raw.guestOf === 'groom' ? 'groom' : 'bride',
      message: text(raw.message, MAX_MESSAGE),
      website: text(raw.website, 100)
    };
  }

  // Phone: 9–15 characters of digits, spaces, + . or -, with at least 9 digits
  function isPhone(value) {
    return /^[0-9+\s.-]{9,15}$/.test(value) && value.replace(/\D/g, '').length >= 9;
  }

  // Returns the text key of the first problem, or null when the form can be sent
  function firstProblem(clean) {
    if (!clean.name) return 'rsvpNameRequired';
    if (!isPhone(clean.phone)) return 'rsvpPhoneRequired';
    return null;
  }

  function mount(config, text) {
    var form = document.getElementById('rsvp-form');
    if (!form) return;
    var status = document.getElementById('rsvp-status');
    var submit = document.getElementById('rsvp-submit');
    var thanks = document.getElementById('thanks');

    function readForm() {
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      return cleanRsvp(data);
    }

    function setBusy(busy) {
      submit.disabled = busy;
      submit.textContent = busy ? text.sending : text.submit;
    }

    function showThanks() {
      form.hidden = true;
      thanks.hidden = false;
    }

    function send(clean) {
      if (!config.rsvp || !config.rsvp.url) {
        status.textContent = text.rsvpMissing;
        return;
      }
      setBusy(true);
      status.textContent = '';
      fetch(config.rsvp.url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(clean)
      }).then(function (res) { return res.json(); })
        .then(function (body) {
          if (!body.ok) throw new Error('rejected');
          showThanks();
        })
        .catch(function () {
          setBusy(false);
          status.textContent = text.rsvpError;
        });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var clean = readForm();
      if (clean.website) return showThanks(); // honeypot: a bot filled the hidden field, pretend success
      var problem = firstProblem(clean);
      if (problem) {
        status.textContent = text[problem];
        return;
      }
      send(clean);
    });
  }

  root.WeddingRsvp = {
    cleanRsvp: cleanRsvp,
    isPhone: isPhone,
    firstProblem: firstProblem,
    mount: mount
  };
})(window);
