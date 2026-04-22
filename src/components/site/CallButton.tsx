import { Phone } from "lucide-react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";
import { trackCallClick } from "@/lib/track-call";
import { animClassesFor, getVariants } from "@/lib/ab-test";
import { useEffect, useState } from "react";

interface Props {
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "accent" | "white" | "outline";
  className?: string;
  fullWidth?: boolean;
  phone?: string;
  phoneHref?: string;
  serviceSlug?: string | null;
  /** Opt out of A/B label override (e.g. context-specific copy like "Call for Immediate Help"). */
  fixedLabel?: boolean;
}

export function CallButton({ label, size = "md", variant = "accent", className, fullWidth, phone, phoneHref, serviceSlug, fixedLabel }: Props) {
  const displayPhone = phone ?? SITE.phone;
  const displayHref = phoneHref ?? SITE.phoneHref;
  // Resolve A/B variants on the client only — avoid SSR hydration mismatch.
  const [ab, setAb] = useState<{ label: string; anim: "calm" | "standard" | "intense" }>({
    label: label ?? "Call Now",
    anim: "standard",
  });
  useEffect(() => {
    const v = getVariants();
    setAb({ label: fixedLabel && label ? label : (label ?? v.label), anim: v.anim });
  }, [label, fixedLabel]);
  const animClasses = animClassesFor(ab.anim);
  const sizes = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-5 py-3 text-base gap-2",
    lg: "px-7 py-4 text-lg gap-3",
    xl: "px-8 py-5 text-xl md:text-2xl gap-3",
  };
  const variants = {
    accent: "bg-cta-gradient text-accent-foreground shadow-[var(--shadow-cta)] hover:brightness-110",
    white: "bg-white text-primary hover:bg-white/90 shadow-lg",
    outline: "border-2 border-white text-white hover:bg-white hover:text-primary",
  };
  return (
    <a
      href={displayHref}
      onClick={() => trackCallClick({ serviceSlug: serviceSlug ?? null, phone: displayPhone })}
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 active:scale-95 whitespace-nowrap",
        animClasses.wrapper,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
    >
      <Phone className={cn(animClasses.icon, size === "xl" ? "h-7 w-7" : size === "lg" ? "h-6 w-6" : "h-5 w-5")} fill="currentColor" />
      <span>{ab.label}</span>
      {(size === "lg" || size === "xl") && <span className="hidden sm:inline">— {displayPhone}</span>}
    </a>
  );
}
