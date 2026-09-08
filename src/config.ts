// Falls back to the public demo org if no env is set, so the example runs out of the box.
export const ORGANIZATION_ID =
  import.meta.env.VITE_ORGANIZATION_ID || '';

export const QRATI_SCRIPT_URL =
  import.meta.env.VITE_CDN_URL ||
  'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/element/web.es.js';

export const GITHUB_ORG = 'qrati-labs';
export const REPO = 'qrati-connect-solid-example';
