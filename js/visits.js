(function () {
  'use strict';
  var config = window.GO_VISITS;
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (!config || !config.endpoint || navigator.webdriver || (location.protocol !== 'https:' && !(local && config.allowLocal && location.protocol === 'http:'))) return;
  var endpoint;
  try { endpoint = new URL(config.endpoint, location.href); } catch (_) { return; }
  if (endpoint.protocol !== 'https:' && !(local && config.allowLocal && endpoint.origin === location.origin && endpoint.protocol === 'http:')) return;
  var key = 'go-visit-session', session, now = Date.now(), sending = false, dayTimer;
  function madridDay() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    var values = Object.fromEntries(parts.map(function (part) { return [part.type, part.value]; }));
    return values.year + '-' + values.month + '-' + values.day;
  }
  // Without session storage, skip counting instead of counting every reload.
  try {
    session = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (!session || !session.event || session.day !== madridDay() || now - session.lastSeen > 30 * 60 * 1000) {
      session = { event: { id: crypto.randomUUID(), started: new Date(now).toISOString(), path: location.pathname }, day: madridDay(), sent: false };
    }
    session.lastSeen = now;
    sessionStorage.setItem(key, JSON.stringify(session));
  } catch (_) { return; }
  function send() {
    if (sending || document.hidden) return;
    if (session.day !== madridDay()) {
      session = { event: { id: crypto.randomUUID(), started: new Date().toISOString(), path: location.pathname }, day: madridDay(), lastSeen: Date.now(), sent: false };
      try { sessionStorage.setItem(key, JSON.stringify(session)); } catch (_) { return; }
    }
    if (session.sent) return;
    var event = session.event;
    sending = true;
    fetch(endpoint.href, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event), credentials: 'omit', referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(12000)
    }).then(function (response) {
      if (!response.ok) return;
      session.sent = true;
      try { sessionStorage.setItem(key, JSON.stringify(session)); } catch (_) {}
    }).catch(function () { /* Counting never interrupts browsing. */ }).finally(function () { sending = false; });
  }
  // Wait for a visible page. A background tab is not counted again at midnight.
  if (!document.hidden) setTimeout(send, 2000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) send(); });
  // Check the day boundary for tabs that remain open, without counting every minute.
  dayTimer = setInterval(function () { if (!document.hidden && session.day !== madridDay()) send(); }, 60000);
  window.addEventListener('pagehide', function () { clearInterval(dayTimer); });
})();
