import { onMount } from 'solid-js';
import { checkConsentRequired, ensureCookieConsentInitialized } from '../lib/cookieConsent';

export default function CookieConsentBanner() {
  onMount(async () => {
    try {
      const required = await checkConsentRequired();
      if (required) {
        await ensureCookieConsentInitialized(true);
      } else {
        await ensureCookieConsentInitialized(false);
      }
    } catch {
      await ensureCookieConsentInitialized(true);
    }
  });

  return null;
}
