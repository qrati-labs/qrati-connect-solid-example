# Qrati Connect — Solid Example

Embeds [Qrati Connect](https://qrati.com) into a Solid + Vite app using the
framework-agnostic **web component** integration, with a host-controlled
light/dark theme and a demo login for organizations that use custom auth.

## Integration method: Web component

Solid renders custom elements natively, so we load the element bundle from the
CDN and drop `<qrati-connect>` into the markup:

```jsx
<qrati-connect organization-id={ORGANIZATION_ID} uid={user.userId} theme={theme} router="hash" />
```

The bundle (and its styles) are loaded once on mount — see `src/App.solid`.

## Run it

```bash
bun install
cp .env.example .env   # optional — sensible defaults are baked in
bun dev
```

## Configuration

Set these in `.env` (all optional; the demo org is used as a fallback):

| Variable                 | Description                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| `VITE_ORGANIZATION_ID`   | Your Qrati organization ID                                        |
| `VITE_CDN_URL`  | CDN URL of the web-component bundle (`element/web.es.js`)          |
| `VITE_API_ENDPOINT`      | Demo-login endpoint for custom-auth orgs. Leave empty to skip it. |

## Demo auth

Orgs with custom auth expect a known user. The login form (`src/auth.ts`) derives
a stable `uid` from the email, optionally POSTs to `VITE_API_ENDPOINT`, then
renders the widget with `uid` / `fname` / `lname` so the user is recognized.

## Other integration methods

- **React component** — `import { QratiConnect }` (see the React/Next/Preact examples).
- **Embed (no-code)** — single `<script>` tag with `data-*` attributes (see the Vanilla JS / Marko / Ember examples).

Docs: <https://www.npmjs.com/package/@qratilabs/qrati-connect>
