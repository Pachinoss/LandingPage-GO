// This file runs on Cloudflare Workers, independently of GitHub Pages.
export default {
  async fetch(request, env) {
    const site = new URL(env.SITE_URL);
    const origin = request.headers.get('Origin');
    if (origin !== site.origin) return new Response('Forbidden', { status: 403 });
    const headers = {
      'Access-Control-Allow-Origin': site.origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin', 'Cache-Control': 'no-store'
    };
    const respond = (message, status) => new Response(message, { status, headers });
    if (new URL(request.url).pathname !== '/visit') return respond('Not found', 404);
    if (request.method === 'OPTIONS') return respond(null, 204);
    if (request.method !== 'POST') return respond('Method not allowed', 405);
    if (!env.RESEND_API_KEY || !env.MAIL_FROM || !env.MAIL_TO || !env.VISIT_LIMITER) return respond('Service not configured', 503);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return respond('Invalid content type', 415);
    if (Number(request.headers.get('Content-Length')) > 1024) return respond('Payload too large', 413);
    const ip = request.headers.get('CF-Connecting-IP');
    if (!ip) return respond('Missing network context', 403);
    const { success } = await env.VISIT_LIMITER.limit({ key: ip });
    if (!success) return respond('Too many requests', 429);
    // Stop reading oversized bodies, including chunked requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return respond('Invalid payload', 400);
    let bytes = 0, chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 1024) { await reader.cancel(); return respond('Payload too large', 413); }
      chunks.push(value);
    }
    let event;
    try {
      const body = new Uint8Array(bytes);
      let offset = 0;
      for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
      event = JSON.parse(new TextDecoder().decode(body));
    } catch (_) { return respond('Invalid JSON', 400); }
    if (!event || typeof event !== 'object') return respond('Invalid event', 400);
    const { id, started, path } = event;
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return respond('Invalid session', 400);
    if (typeof started !== 'string' || started.length > 30 || !Number.isFinite(Date.parse(started)) || Math.abs(Date.now() - Date.parse(started)) > 86400000) return respond('Invalid date', 400);
    if (typeof path !== 'string' || path.length > 250 || !path.startsWith(site.pathname) || /[\r\n?#\\]/.test(path)) return respond('Invalid page', 400);
    const page = new URL(path, site);
    if (page.origin !== site.origin) return respond('Invalid page', 400);
    const date = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Madrid' }).format(new Date(started));
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `portfolio-visit/${id}` },
        body: JSON.stringify({
          from: env.MAIL_FROM, to: [env.MAIL_TO], subject: 'Nueva visita a tu portfolio — Germán Orozco',
          text: `Se ha detectado una nueva sesión en tu portfolio.\n\nPágina: ${page.href}\nFecha: ${date} (España)\n\nSe envía un aviso por sesión; las recargas no generan avisos adicionales. Es una detección aproximada y no identifica a la persona.`
        })
      });
      if (!response.ok) return respond('Email service unavailable', 502);
      return respond(null, 204);
    } catch (_) { return respond('Email service unavailable', 502); }
  }
};
