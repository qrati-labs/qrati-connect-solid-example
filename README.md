# Qrati Connect — Solid Example

[![Qrati Connect — embeddable event photo galleries](public/qrati-connect-og.png)](https://qrati.com/connect)

Embed a fast, interactive event photo gallery in Solid with guest uploads, full-screen lightbox, emoji reactions, and photo-contest leaderboards. [Explore Qrati Connect](https://qrati.com/connect) or [view the live Solid example](https://qrati.com/connect/solid-example).

Embeds [Qrati Connect](https://qrati.com) into a Solid + Vite application using the
framework-agnostic **web component** (`<qrati-connect>`), with host-controlled
light/dark theme synchronization, full SEO optimization, and zero backend configuration.

## Integration method: Web Component

Solid renders custom elements natively. Load the web component bundle and styles once on mount, then render `<qrati-connect>` directly in your Solid JSX:

```tsx
import { createSignal, onMount } from 'solid-js';
import { ORGANIZATION_ID, QRATI_SCRIPT_URL } from './config';

export function EventGallery() {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');

  onMount(() => {
    const styleUrl = QRATI_SCRIPT_URL.replace(/\/web\.es\.js$/, '/styles.css');
    if (!document.querySelector(`link[href="${styleUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = styleUrl;
      document.head.appendChild(link);
    }
    import(/* @vite-ignore */ QRATI_SCRIPT_URL);
  });

  return (
    <qrati-connect
      organization-id={ORGANIZATION_ID}
      theme={theme()}
      router="hash"
    />
  );
}
```

## Features

- **Drop-in Web Component**: Native Solid JSX support for custom elements with fine-grained reactive attribute bindings.
- **Live Event Photo Wall**: Responsive masonry grid layout, blurhash loading placeholders, and full-screen lightbox with keyboard navigation.
- **Guest Media Uploads**: Attendees scan a QR code to upload photos and videos directly with automatic client-side compression and HEIC conversion.
- **Interactive Reactions & Leaderboards**: Live emoji reactions, star ratings, and real-time contest rankings.
- **Host Theme Control**: Reactive light and dark mode synchronization.
- **GDPR & Consent Mode v2**: Integrated cookie consent banner with EU/EEA geo-lookup and Google Consent Mode v2 support.
- **Cloudflare Subpath Routing**: Configured for `/connect/solid-example/` with SPA fallback and runtime GTM handling.

## Run Locally

```bash
pnpm install
cp .env.example .env   # optional — sensible defaults are baked in
pnpm dev
```

## Configuration

Set these in `.env` (all optional; the demo organization is used as a fallback):

| Variable               | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `VITE_ORGANIZATION_ID` | Your Qrati organization ID (defaults to public demo org)           |
| `VITE_CDN_URL`         | CDN URL of the web-component bundle (`element/web.es.js`)          |
| `VITE_GTM_ID`          | Optional Google Tag Manager container ID                           |

## Build & Deploy

```bash
# Build both client SPA and Cloudflare Worker
pnpm build

# Preview locally with Vite
pnpm preview

# Deploy to Cloudflare Workers
pnpm run deploy
```

## Other Integration Methods

- **React Component** — `import QratiConnect from '@qratilabs/qrati-connect'` (see the React, Next.js, and Preact examples).
- **Web Component** — `<qrati-connect>` (see the Svelte, Vue, Solid, and Lit examples).
- **Embed (no-code)** — single `<script>` tag with `data-*` attributes (see the Vanilla JS, Marko, and Ember examples).

Docs: <https://www.npmjs.com/package/@qratilabs/qrati-connect>
