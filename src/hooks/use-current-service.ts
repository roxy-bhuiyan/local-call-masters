import { useLocation } from "@tanstack/react-router";
import { SITE, SERVICES, getServicePhone, type ServiceSlug } from "@/data/site";

/**
 * Single source of truth for resolving the active service (and its phone
 * number) from the current URL. Used by the top bar, sticky call bar, and
 * any other component that needs route-aware call routing.
 */
export function useCurrentService(): {
  phone: string;
  phoneHref: string;
  slug: ServiceSlug | null;
} {
  const { pathname } = useLocation();
  const first = pathname.replace(/^\/+/, "").split("/")[0] as ServiceSlug | "";
  const match = SERVICES.find((s) => s.slug === first);
  if (match) {
    const { phone, phoneHref } = getServicePhone(match.slug);
    return { phone, phoneHref, slug: match.slug };
  }
  return { phone: SITE.phone, phoneHref: SITE.phoneHref, slug: null };
}
