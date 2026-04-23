import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { TopBar } from "@/components/site/TopBar";
import { Footer } from "@/components/site/Footer";
import { StickyCallBar } from "@/components/site/StickyCallBar";
import { logImpressionOnce } from "@/lib/ab-test";
import {
  consentDefaultsSnippet,
  ga4InitSnippet,
  ga4ScriptUrl,
  gtmHeadSnippet,
  GtmNoScript,
} from "@/components/site/TrackingScripts";
import { ConsentBanner } from "@/components/site/ConsentBanner";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { EngagementTracker } from "@/components/site/EngagementTracker";
import { captureAttributionFromUrl } from "@/lib/attribution";
import { trackPageView } from "@/lib/datalayer";
import { SITE } from "@/data/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      // 1) Consent Mode v2 defaults — MUST run before any tracking script
      { children: consentDefaultsSnippet() },
      // 2) GTM container (hub for all events)
      ...(gtmHeadSnippet() ? [{ children: gtmHeadSnippet() as string }] : []),
      // 3) gtag.js (GA4 + Google Ads direct fallback)
      ...(ga4ScriptUrl() ? [{ src: ga4ScriptUrl() as string, async: true }] : []),
      ...(ga4InitSnippet() ? [{ children: ga4InitSnippet() as string }] : []),
      // 4) LocalBusiness JSON-LD schema
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: SITE.name,
          telephone: SITE.phone,
          areaServed: SITE.areas,
          openingHours: "Mo-Su 00:00-23:59",
          priceRange: "$$",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const chrome = !pathname.startsWith("/admin") && pathname !== "/login";
  useEffect(() => {
    if (chrome) logImpressionOnce();
  }, [chrome]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {chrome && <TopBar />}
      <div className={`flex-1 ${chrome ? "pb-20 md:pb-0" : ""}`}>
        <Outlet />
      </div>
      {chrome && <Footer />}
      {chrome && <StickyCallBar />}
    </div>
  );
}
