import { createSignal, onMount } from 'solid-js';
import { ORGANIZATION_ID, QRATI_SCRIPT_URL, GITHUB_ORG, REPO } from './config';
import CookieConsentBanner from './components/CookieConsentBanner';
import { showCookiePreferences } from './lib/cookieConsent';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'qrati-connect': JSX.HTMLAttributes<HTMLElement> & {
        'attr:organization-id'?: string;
        'attr:theme'?: 'light' | 'dark';
        'attr:router'?: 'hash' | 'memory';
        'organization-id'?: string;
        theme?: 'light' | 'dark';
        router?: 'hash' | 'memory';
        uid?: string;
        fname?: string;
        lname?: string;
      };
    }
  }
}

const repoUrl = `https://github.com/${GITHUB_ORG}/${REPO}`;
const vscodeUrl = `https://vscode.dev/github/${GITHUB_ORG}/${REPO}`;
const npmUrl = 'https://www.npmjs.com/package/@qratilabs/qrati-connect';
const year = new Date().getFullYear();

function initTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const t =
    (localStorage.getItem('qc-theme') as 'light' | 'dark') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
  return t;
}

export default function App() {
  const [theme, setTheme] = createSignal<'light' | 'dark'>(initTheme());

  const applyTheme = (t: 'light' | 'dark') => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('qc-theme', t);
  };

  const toggleTheme = () => {
    applyTheme(theme() === 'dark' ? 'light' : 'dark');
  };

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
    <div class="app">
      <button
        class="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme() === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme() === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <div class="page-shell">
        <div class="page-frame">
          <header class="hero">
            <p class="hero-kicker">Embeddable Solid Gallery SDK</p>
            <h1>
              <a href="https://qrati.com" target="_blank" rel="noopener noreferrer">Qrati</a>
              {' '}Connect inside a Solid host site
            </h1>
            <p class="hero-copy">
              A drop-in web component for embedding live event photo galleries with guest uploads,
              full-screen lightbox, emoji reactions, and contest leaderboards. Fine-grained Solid
              reactivity, controlled host theme, clean link-outs, and zero backend configuration.
            </p>

            <div class="action-pills" aria-label="Example links">
              <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                  />
                </svg>
                <span>View on GitHub</span>
              </a>
              <a href={vscodeUrl} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M10.863 13.919a.8.8 0 0 1-.644.025a.8.8 0 0 1-.279-.183L4.816 9.063l-2.232 1.703a.54.54 0 0 1-.691-.031l-.716-.655a.546.546 0 0 1 0-.805L3.112 7.5L1.177 5.725a.546.546 0 0 1 0-.805l.716-.655a.54.54 0 0 1 .691-.031l2.232 1.703L9.94 1.239a.805.805 0 0 1 .923-.159l2.677 1.295c.281.136.46.422.46.736V8h-3.248V4.534L6.864 7.5l3.888 2.966V8H14v3.889c0 .314-.179.6-.46.736z"
                  />
                </svg>
                <span>Open in VS Code</span>
              </a>
              <a href={npmUrl} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M1.5 0h21v24h-10.5v-19.5h-5.25v19.5h-5.25z"/>
                </svg>
                <span>npm package</span>
              </a>
            </div>
          </header>

          <main class="content-shell">
            <section class="widget-frame" aria-label="Interactive Solid Event Gallery">
              <h2 class="sr-only">Live Event Photo Gallery Component</h2>
              <qrati-connect
                attr:organization-id={ORGANIZATION_ID}
                attr:theme={theme()}
                attr:router="hash"
              />
            </section>

            {/* Features Section */}
            <section class="seo-section" aria-labelledby="features-heading">
              <div class="seo-section-header">
                <span class="seo-kicker">Event Gallery Features</span>
                <h2 id="features-heading">Why Developers Choose Qrati Connect</h2>
                <p>
                  Deliver an engaging live event photo wall and user-generated content (UGC)
                  experience embedded directly into your Solid application with zero backend overhead.
                </p>
              </div>

              <div class="seo-features-grid">
                <article class="seo-feature-card">
                  <div class="seo-feature-icon" aria-hidden="true">🖼️</div>
                  <h3>Live Event Photo Wall</h3>
                  <p>
                    Responsive masonry grid layout, blurhash loading placeholders, and full-screen
                    lightbox with keyboard navigation for stunning visual presentation.
                  </p>
                </article>

                <article class="seo-feature-card">
                  <div class="seo-feature-icon" aria-hidden="true">📸</div>
                  <h3>Guest Media Uploads</h3>
                  <p>
                    Frictionless guest uploads via QR code or direct upload with client-side image
                    compression and automatic HEIC to JPEG conversion.
                  </p>
                </article>

                <article class="seo-feature-card">
                  <div class="seo-feature-icon" aria-hidden="true">⭐</div>
                  <h3>Reactions &amp; Contests</h3>
                  <p>
                    Boost attendee engagement with interactive emoji reactions, community star ratings,
                    and real-time contest leaderboard rankings.
                  </p>
                </article>

                <article class="seo-feature-card">
                  <div class="seo-feature-icon" aria-hidden="true">⚡</div>
                  <h3>Native Web Component</h3>
                  <p>
                    Solid renders custom elements natively with zero-overhead fine-grained reactive
                    attribute bindings and instant light/dark theme synchronization.
                  </p>
                </article>
              </div>
            </section>

            {/* Quickstart Section */}
            <section class="seo-section" aria-labelledby="quickstart-heading">
              <div class="seo-section-header">
                <span class="seo-kicker">Developer Integration</span>
                <h2 id="quickstart-heading">Embed in 3 Simple Steps</h2>
                <p>
                  Load the web component bundle, render &lt;qrati-connect&gt;, and bind your theme signal.
                </p>
              </div>

              <div class="seo-quickstart-card">
                <div class="code-header">
                  <div class="code-dots">
                    <span class="code-dot"></span>
                    <span class="code-dot"></span>
                    <span class="code-dot"></span>
                  </div>
                  <span>EventGallery.tsx</span>
                </div>
                <pre>
                  <code>
{`// 1. Load element styles & script from CDN or bundle
// Styles: https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/element/styles.css
// Script: https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/element/web.es.js

// 2. Import Solid primitives
import { createSignal, onMount } from 'solid-js';

// 3. Render <qrati-connect> in your Solid component
export function EventGallery() {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');

  return (
    <qrati-connect
      organization-id="your-organization-id"
      theme={theme()}
      router="hash"
    />
  );
}`}
                  </code>
                </pre>
              </div>
            </section>

            {/* FAQ Section */}
            <section class="seo-section" aria-labelledby="faq-heading">
              <div class="seo-section-header">
                <span class="seo-kicker">Common Questions</span>
                <h2 id="faq-heading">Frequently Asked Questions</h2>
                <p>
                  Everything you need to know about embedding an event photo gallery in Solid.
                </p>
              </div>

              <div class="faq-list">
                <details class="faq-item" open>
                  <summary class="faq-question">
                    <span>How do I embed an event photo gallery in Solid?</span>
                    <span class="faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div class="faq-answer">
                    Solid renders custom elements natively without wrappers. Import or load the Qrati Connect element bundle, then render <code style={{ color: 'var(--brand-accent)' }}>&lt;qrati-connect organization-id="YOUR_ORG_ID" theme={'{theme()}'} router="hash" /&gt;</code>. It provides responsive masonry galleries, lightbox, and photo uploads out of the box.
                  </div>
                </details>

                <details class="faq-item">
                  <summary class="faq-question">
                    <span>Can event attendees upload photos directly through the Solid gallery?</span>
                    <span class="faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div class="faq-answer">
                    Yes. When media uploads are enabled in your Qrati organization settings, attendees can upload photos and videos directly from mobile or desktop devices with client-side image compression and automatic HEIC conversion.
                  </div>
                </details>

                <details class="faq-item">
                  <summary class="faq-question">
                    <span>How does Solid handle web component attribute reactivity with Qrati Connect?</span>
                    <span class="faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div class="faq-answer">
                    Solid's fine-grained reactivity tracks signals like <code style={{ color: 'var(--brand-accent)' }}>theme()</code> and updates the custom element attributes directly without virtual DOM overhead, guaranteeing optimal runtime performance.
                  </div>
                </details>

                <details class="faq-item">
                  <summary class="faq-question">
                    <span>Does the Qrati Connect web component support dark mode?</span>
                    <span class="faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div class="faq-answer">
                    Yes. The component accepts a <code style={{ color: 'var(--brand-accent)' }}>theme</code> attribute (<code style={{ color: 'var(--brand-accent)' }}>'light'</code> or <code style={{ color: 'var(--brand-accent)' }}>'dark'</code>), enabling seamless synchronization with your Solid application's theme signal and system color preferences.
                  </div>
                </details>

                <details class="faq-item">
                  <summary class="faq-question">
                    <span>Can I run photo contests and display rankings in the Solid gallery?</span>
                    <span class="faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div class="faq-answer">
                    Yes. Qrati Connect supports contest mode, star ratings, emoji reactions, and ranked leaderboards configured directly from your Qrati organization dashboard.
                  </div>
                </details>
              </div>
            </section>

            {/* Event Hosting & Integration CTA Section */}
            <section class="seo-section seo-cta-section" aria-labelledby="cta-heading">
              <div class="seo-cta-card">
                <div class="seo-cta-content">
                  <span class="seo-kicker">Host on Qrati &middot; Embed Anywhere</span>
                  <h2 id="cta-heading">
                    Host Your Event on Qrati.{' '}
                    <span class="cta-highlight">Stream the Live Gallery on Your Website.</span>
                  </h2>
                  <p class="seo-cta-copy">
                    Planning a conference, festival, wedding, summit, or private celebration?
                    Host your event on Qrati to capture every attendee memory with instant QR uploads,
                    moderation workflows, and a live interactive photo wall embedded in your Solid application.
                  </p>

                  <div class="seo-cta-steps">
                    <div class="cta-step">
                      <span class="cta-step-num">1</span>
                      <div>
                        <strong>Create Your Event</strong>
                        <p>Set up your event space on Qrati with branding, upload permissions, and privacy controls in 60 seconds.</p>
                      </div>
                    </div>
                    <div class="cta-step">
                      <span class="cta-step-num">2</span>
                      <div>
                        <strong>Attendees Snap &amp; Upload</strong>
                        <p>Guests scan your event QR code to upload photos and videos instantly—no app download required.</p>
                      </div>
                    </div>
                    <div class="cta-step">
                      <span class="cta-step-num">3</span>
                      <div>
                        <strong>Embed Live Gallery</strong>
                        <p>Drop &lt;qrati-connect&gt; into your Solid app to display the live mosaic photo stream to all your visitors.</p>
                      </div>
                    </div>
                  </div>

                  <div class="seo-cta-actions">
                    <a
                      href="https://qrati.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-cta-primary"
                    >
                      Host Your Event on Qrati
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer class="footer">
            <div class="footer-brand">
              <img
                src="https://assets.qrati.com/images/qrati-connect-logo-square.png"
                alt="Qrati Connect logo"
                referrerpolicy="no-referrer"
              />
              <div>
                <span class="footer-title"><span>Qrati</span> Connect</span>
                <p>Elevate your event experience.</p>
              </div>
            </div>
            <div class="footer-meta">
              <nav aria-label="Footer navigation">
                <a href="https://qrati.com" target="_blank" rel="noopener noreferrer">qrati.com</a>
                <a href={npmUrl} target="_blank" rel="noopener noreferrer">npm</a>
                <a href={`https://github.com/${GITHUB_ORG}`} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://qrati.com/pricing" target="_blank" rel="noopener noreferrer">Pricing</a>
                <button
                  type="button"
                  class="footer-cookie-btn"
                  data-cc="show-preferencesModal"
                  onClick={() => showCookiePreferences()}
                >
                  Cookie Preferences
                </button>
              </nav>
              <p class="footer-note">&copy; {year} Qrati Labs. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>

      <CookieConsentBanner />
    </div>
  );
}
