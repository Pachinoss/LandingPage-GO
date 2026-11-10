(function () {
  'use strict';
  var config = window.GO_VISITS;
  if (!config || !config.endpoint || location.protocol !== 'https:' || navigator.webdriver || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;
  var endpoint;
  try { endpoint = new URL(config.endpoint); } catch (_) { return; }
  if (endpoint.protocol !== 'https:') return;
  var key = 'go-visit-session', session, now = Date.now(), sending = false;
  // Without session storage, skip notifications instead of emailing on each reload.
  try {
    session = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (!session || !session.event || now - session.lastSeen > 30 * 60 * 1000) {
      session = { event: { id: crypto.randomUUID(), started: new Date(now).toISOString(), path: location.pathname }, sent: false };
    }
    session.lastSeen = now;
    sessionStorage.setItem(key, JSON.stringify(session));
  } catch (_) { return; }
  function send() {
    if (session.sent || sending || document.hidden) return;
    sending = true;
    fetch(endpoint.href, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session.event), credentials: 'omit', referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(12000)
    }).then(function (response) {
      if (!response.ok) return;
      session.sent = true;
      try { sessionStorage.setItem(key, JSON.stringify(session)); } catch (_) {}
    }).catch(function () { /* Notifications never interrupt browsing. */ }).finally(function () { sending = false; });
  }
  // Wait for a visible page; revisiting within the session won't send another email.
  if (!document.hidden) setTimeout(send, 2000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) send(); });
})();
