// Falls back to the public demo org if no env is set, so the example runs out of the box.
export const ORGANIZATION_ID =
  import.meta.env.VITE_ORGANIZATION_ID || '69ad9c7876d8bf6f864b3a65';

export const QRATI_SCRIPT_URL =
  import.meta.env.VITE_CDN_URL ||
  'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/element/web.es.js';

// Demo-login endpoint that maps an email to a uid against the org's custom auth settings.
// Leave empty to skip the network call and run purely client-side.
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '';

export const GITHUB_ORG = 'qrati-labs';
export const REPO = 'qrati-connect-solid-example';
