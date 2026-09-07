interface Env {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
  GTM_ID?: string;
  VITE_GTM_ID?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Normalize path for ASSETS lookup
    // Both /connect/solid-example and /connect/solid-example/ serve the root index.html directly
    const prefix = '/connect/solid-example';
    if (url.pathname === prefix || url.pathname === `${prefix}/`) {
      url.pathname = '/';
    } else if (url.pathname.startsWith(`${prefix}/`)) {
      const stripped = url.pathname.slice(prefix.length);
      url.pathname = stripped === '' ? '/' : stripped;
    }

    const res = await env.ASSETS.fetch(new Request(url.toString(), request));

    // Handle GTM injection / cleanup on HTML responses
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      let html = await res.text();
      const activeGtm = env.VITE_GTM_ID || env.GTM_ID;
      if (activeGtm && activeGtm !== '__GTM_ID__') {
        html = html.replaceAll('__GTM_ID__', activeGtm);
      } else {
        // If no GTM ID configured, strip the GTM block cleanly
        html = html
          .replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\n?/g, '')
          .replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\n?/g, '');
      }
      return new Response(html, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    }

    return res;
  },
};
