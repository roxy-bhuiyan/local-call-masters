import { useEffect, useState } from "react";
import { setConsent, getStoredConsent } from "@/lib/datalayer";

export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (getStoredConsent() === null) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-24 md:bottom-6 left-3 right-3 md:left-6 md:right-auto md:max-w-md z-[60] bg-card border border-border shadow-2xl rounded-2xl p-4">
      <p className="text-sm text-foreground mb-3">
        We use cookies for analytics and ad measurement. You can accept or decline.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => { setConsent(true); setShow(false); }}
          className="flex-1 bg-primary text-primary-foreground rounded-full px-4 py-2 font-semibold text-sm hover:opacity-90"
        >
          Accept
        </button>
        <button
          onClick={() => { setConsent(false); setShow(false); }}
          className="flex-1 border border-border text-foreground rounded-full px-4 py-2 font-semibold text-sm hover:bg-muted"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
