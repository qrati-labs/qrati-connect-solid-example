import * as CookieConsent from 'vanilla-cookieconsent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    showCookiePreferences?: () => void;
  }
}

const GEO_STORAGE_KEY = 'qrati_geo_consent_required';

/**
 * Initializes Google Tag Manager script if a GTM ID is provided
 * and not already loaded on the page.
 */
export function initGtm(gtmId?: string): void {
  if (typeof window === 'undefined') return;

  const id = gtmId || (import.meta.env.VITE_GTM_ID as string | undefined);

  if (!id || id === '__GTM_ID__') return;
  if (
    document.getElementById('gtm-script') ||
    (window as unknown as { google_tag_manager?: unknown }).google_tag_manager
  ) {
    return;
  }

  // Initialize dataLayer and push Consent Mode v2 defaults before GTM script parses
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args as unknown as object);
  }
  window.gtag = window.gtag || gtag;

  window.gtag('consent', 'default', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    region: [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
      'GB', 'CH',
    ],
    wait_for_update: 500,
  });

  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

/**
 * Maps user consent choices to Google Consent Mode v2 signals.
 */
export function updateGtagConsent(options: { analytics: boolean; ads?: boolean }): void {
  if (typeof window === 'undefined') return;

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  function gtag(...args: unknown[]) {
    dataLayer.push(args as unknown as object);
  }
  const fn = window.gtag || gtag;

  const analyticsState = options.analytics ? 'granted' : 'denied';
  const adsState = options.ads ? 'granted' : 'denied';

  fn('consent', 'update', {
    analytics_storage: analyticsState,
    ad_storage: adsState,
    ad_user_data: adsState,
    ad_personalization: adsState,
  });
}

/**
 * Checks whether visitor requires GDPR/PECR cookie opt-in.
 * Caches the response in sessionStorage to eliminate redundant network round-trips.
 */
export async function checkConsentRequired(): Promise<boolean> {
  try {
    const cached = sessionStorage.getItem(GEO_STORAGE_KEY);
    if (cached !== null) {
      return cached === 'true';
    }

    const geoUrl = window.location.hostname.includes('qrati.com')
      ? '/api/cookie-consent-geo'
      : 'https://qrati.com/api/cookie-consent-geo';

    const res = await fetch(geoUrl, { cache: 'no-store' });
    if (!res.ok) return true;

    const { required } = (await res.json()) as { required: boolean };
    sessionStorage.setItem(GEO_STORAGE_KEY, String(required));
    return required;
  } catch {
    // Geo lookup failed — default to showing (GDPR-safe: over-showing
    // the banner is safer than missing an opt-in region).
    return true;
  }
}

let initPromise: Promise<void> | null = null;

/**
 * Ensures CookieConsent is initialized.
 * Can be called proactively on mount or lazily on user demand (e.g. clicking footer link).
 */
export async function ensureCookieConsentInitialized(requiredParam?: boolean): Promise<void> {
  if (typeof window === 'undefined') return;

  if (!initPromise) {
    initPromise = (async () => {
      const required = requiredParam !== undefined ? requiredParam : await checkConsentRequired();

      if (!required) {
        // Non-GDPR visitor (US, India, etc.): immediately grant analytics & ad consent
        updateGtagConsent({ analytics: true, ads: true });
      }

      await CookieConsent.run({
        mode: required ? 'opt-in' : 'opt-out',
        autoShow: required,
        cookie: {
          name: 'qrati_consent',
          domain: window.location.hostname.includes('qrati.com') ? '.qrati.com' : undefined,
          path: '/',
          expiresAfterDays: 182, // 6 months per EDPB guidelines
          sameSite: 'Lax',
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true,
          },
          analytics: {
            enabled: !required,
            autoClear: {
              cookies: [
                { name: /^_ga/ }, // Clears all _ga and _ga_<container-id> cookies
                { name: '_gid' },
              ],
            },
          },
        },
        onFirstConsent: () => {
          const accepted = CookieConsent.acceptedCategory('analytics');
          updateGtagConsent({ analytics: accepted, ads: !required || accepted });
        },
        onConsent: () => {
          const accepted = CookieConsent.acceptedCategory('analytics');
          updateGtagConsent({ analytics: accepted, ads: !required || accepted });
        },
        onChange: () => {
          const accepted = CookieConsent.acceptedCategory('analytics');
          updateGtagConsent({ analytics: accepted, ads: !required || accepted });
        },
        guiOptions: {
          consentModal: {
            layout: 'box',
            position: 'bottom left',
            equalWeightButtons: true,
          },
          preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
          },
        },
        language: {
          default: 'en',
          translations: {
            en: {
              consentModal: {
                title: 'We use cookies',
                description:
                  'We use essential cookies to keep you signed in. With your permission, we also use analytics cookies to understand how Qrati is used and improve your experience.',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject analytics',
                showPreferencesBtn: 'Manage preferences',
              },
              preferencesModal: {
                title: 'Cookie preferences',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject analytics',
                savePreferencesBtn: 'Save preferences',
                closeIconLabel: 'Close',
                sections: [
                  {
                    title: 'Strictly necessary cookies',
                    description:
                      'These cookies are essential for the proper functioning of Qrati and cannot be disabled.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytics cookies',
                    description:
                      'Cookies used for analytics help us collect aggregated data that allows us to understand how visitors interact with Qrati, helping us build better features.',
                    linkedCategory: 'analytics',
                    cookieTable: {
                      headers: {
                        name: 'Cookie',
                        domain: 'Provider',
                        description: 'Purpose',
                        expiration: 'Expiration',
                      },
                      body: [
                        {
                          name: '_ga',
                          domain: 'Google Analytics',
                          description:
                            'Used to distinguish unique visitors and measure website traffic.',
                          expiration: '2 years',
                        },
                        {
                          name: '_gid',
                          domain: 'Google Analytics',
                          description:
                            'Used to identify user journey across 24-hour sessions.',
                          expiration: '24 hours',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      });
    })();
  }

  return initPromise;
}

/**
 * Open the cookie preferences modal programmatically from anywhere (e.g. footer link).
 */
export async function showCookiePreferences(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await ensureCookieConsentInitialized();
    CookieConsent.showPreferences();
  } catch (err) {
    console.error('Failed to open cookie preferences modal:', err);
  }
}
