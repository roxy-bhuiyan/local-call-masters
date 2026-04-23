import { TRACKING } from "@/lib/tracking-config";
import { trackWhatsAppClick } from "@/lib/datalayer";
import { useCurrentService } from "@/hooks/use-current-service";

export function WhatsAppButton() {
  const { slug } = useCurrentService();
  const href = `https://wa.me/${TRACKING.WHATSAPP_NUMBER}?text=${encodeURIComponent(TRACKING.WHATSAPP_DEFAULT_MSG)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => trackWhatsAppClick({ serviceSlug: slug })}
      className="fixed bottom-28 md:bottom-28 right-4 md:right-6 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3.2 28.8l6.6-1.72a12.74 12.74 0 0 0 6.2 1.6h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.7 12.7 0 0 0 16.01 3.2zm0 23.36h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.92 1.03 1.05-3.82-.25-.4a10.6 10.6 0 0 1-1.62-5.66c0-5.86 4.77-10.62 10.63-10.62 2.84 0 5.5 1.1 7.5 3.11a10.55 10.55 0 0 1 3.11 7.51c0 5.86-4.77 10.62-10.62 10.62zm5.83-7.95c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1 1.27-.18.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.18-.32-.02-.5.14-.66.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.72-1.74-.99-2.39-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.55.08-.84.4-.29.32-1.1 1.07-1.1 2.61 0 1.55 1.13 3.04 1.29 3.25.16.21 2.23 3.4 5.4 4.77.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z"/>
      </svg>
    </a>
  );
}
