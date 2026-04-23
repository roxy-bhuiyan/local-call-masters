// =============================================================
// GTM + GA4 + Google Ads — script loader + Consent Mode v2 defaults
// =============================================================
// Inject করা হয় __root.tsx এর shellComponent এর head/body থেকে।
// সব script শুধুমাত্র তখনই load হয় যখন config ID placeholder নয়।
// =============================================================

import { TRACKING, TRACKING_ENABLED } from "@/lib/tracking-config";

/** Inline snippet that runs before any tracking script — sets Consent
 *  Mode v2 defaults to "denied" so EU traffic stays compliant until
 *  the user accepts the cookie banner. */
export function consentDefaultsSnippet() {
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);`;
}

export function gtmHeadSnippet() {
  if (!TRACKING_ENABLED.gtm) return null;
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TRACKING.GTM_ID}');`;
}

export function ga4ScriptUrl() {
  if (!TRACKING_ENABLED.ga4) return null;
  return `https://www.googletagmanager.com/gtag/js?id=${TRACKING.GA4_ID}`;
}

export function ga4InitSnippet() {
  if (!TRACKING_ENABLED.ga4 && !TRACKING_ENABLED.ads) return null;
  const lines: string[] = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);} window.gtag = gtag;",
    "gtag('js', new Date());",
  ];
  if (TRACKING_ENABLED.ga4) lines.push(`gtag('config', '${TRACKING.GA4_ID}', { send_page_view: true });`);
  if (TRACKING_ENABLED.ads) lines.push(`gtag('config', '${TRACKING.GOOGLE_ADS_ID}');`);
  return lines.join("\n");
}

/** GTM <noscript> iframe — must live in <body>, NOT in <head>. */
export function GtmNoScript() {
  if (!TRACKING_ENABLED.gtm) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${TRACKING.GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
