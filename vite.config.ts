import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const gtmId = env.VITE_GTM_ID || process.env.VITE_GTM_ID || '__GTM_ID__';

  return {
    base: process.env.BASE_PATH || (command === 'build' ? '/connect/solid-example/' : '/'),
    plugins: [
      solid(),
      cloudflare(),
      {
        name: 'vite-plugin-gtm',
        transformIndexHtml(html) {
          if (!gtmId || gtmId === '__GTM_ID__') {
            return html
              .replace('<!-- %GTM_HEAD% -->\n', '')
              .replace('<!-- %GTM_HEAD% -->', '')
              .replace('<!-- %GTM_BODY% -->\n', '')
              .replace('<!-- %GTM_BODY% -->', '');
          }

          const gtmHead = `<!-- Google Tag Manager -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
      wait_for_update: 500
    });
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  </script>
  <!-- End Google Tag Manager -->`;

          const gtmBody = `<!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;

          return html
            .replace('<!-- %GTM_HEAD% -->', gtmHead)
            .replace('<!-- %GTM_BODY% -->', gtmBody);
        },
      },
    ],
  };
});
