import { CallButton } from "./CallButton";

export function StickyCallBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border shadow-2xl p-3">
      <CallButton fullWidth size="lg" />
    </div>
  );
}
