import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../services/visit-mail/worker.mjs';

const site = 'https://pachinoss.github.io';
const env = {
  SITE_URL: site + '/LandingPage-GO/',
  RESEND_API_KEY: 'test-only', MAIL_FROM: 'Portfolio <test@example.com>', MAIL_TO: 'owner@example.com',
  VISIT_LIMITER: { limit: async () => ({ success: true }) }
};
function event() {
  return { id: '12345678-1234-4123-8123-123456789012', started: new Date().toISOString(), path: '/LandingPage-GO/index.html' };
}
function request(body = event(), headers = {}) {
  return new Request('https://notifications.example.com/visit', {
    method: 'POST', headers: { Origin: site, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}
test('rejects unapproved origins and methods', async () => {
  assert.equal((await worker.fetch(request(event(), { Origin: 'https://other.example' }), env)).status, 403);
  assert.equal((await worker.fetch(new Request('https://notifications.example.com/visit', { headers: { Origin: site } }), env)).status, 405);
});
test('supports CORS preflight only for the configured site', async () => {
  const response = await worker.fetch(new Request('https://notifications.example.com/visit', { method: 'OPTIONS', headers: { Origin: site } }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), site);
});
test('fails closed without email credentials or a limiter', async () => {
  assert.equal((await worker.fetch(request(), { ...env, RESEND_API_KEY: '' })).status, 503);
  assert.equal((await worker.fetch(request(), { ...env, VISIT_LIMITER: null })).status, 503);
});
test('enforces the rate limit and body size', async () => {
  assert.equal((await worker.fetch(request(), { ...env, VISIT_LIMITER: { limit: async () => ({ success: false }) } })).status, 429);
  assert.equal((await worker.fetch(request('x'.repeat(1025)), env)).status, 413);
});
test('rejects bad JSON, stale sessions, offsite paths and query strings', async () => {
  for (const value of ['{broken', null, { ...event(), id: 'invalid' }, { ...event(), started: '2001-01-01' }, { ...event(), path: '//other.example' }, { ...event(), path: '/LandingPage-GO/?secret=value' }]) {
    assert.equal((await worker.fetch(request(value), env)).status, 400);
  }
});
test('uses only the server recipient, omits IP and keeps retries idempotent', async () => {
  const fetchOriginal = globalThis.fetch, sent = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    sent.push(options);
    return new Response('{"id":"test-message"}', { status: 200 });
  };
  try {
    const payload = { ...event(), to: 'attacker@example.com' };
    assert.equal((await worker.fetch(request(payload), env)).status, 204);
    assert.equal((await worker.fetch(request(payload), env)).status, 204);
    assert.equal(sent[0].headers['Idempotency-Key'], sent[1].headers['Idempotency-Key']);
    assert.equal(sent[0].body, sent[1].body);
    assert.deepEqual(JSON.parse(sent[0].body).to, [env.MAIL_TO]);
    assert(!sent[0].body.includes('192.0.2.1'));
    assert(!sent[0].body.includes('attacker@example.com'));
  } finally { globalThis.fetch = fetchOriginal; }
});
test('reports provider errors without claiming delivery', async () => {
  const fetchOriginal = globalThis.fetch;
  globalThis.fetch = async () => new Response('unavailable', { status: 503 });
  try { assert.equal((await worker.fetch(request(), env)).status, 502); }
  finally { globalThis.fetch = fetchOriginal; }
});
