import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import img from "@/assets/service-roofing.jpg";

export const Route = createFileRoute("/roofing")({
  head: () => ({
    meta: [
      { title: "Roof Repair & Replacement Near Me | Storm Damage Experts" },
      { name: "description", content: "Local roofers for leaks, missing shingles, storm damage & full replacements. Free estimates. Insurance claims welcome. Call now!" },
      { property: "og:title", content: "Roofing Experts Near You — Free Estimates" },
      { property: "og:description", content: "Storm damage specialists. Insurance claims welcome." },
      { property: "og:image", content: img },
      { name: "twitter:image", content: img },
    ],
  }),
  component: () => (
    <ServicePage
      dept="roofing"
      badge="🏠 Free Roof Inspection"
      title="Trusted Local Roofers — Repairs & Replacements"
      subtitle="Leaks, missing shingles, or storm damage? Free inspection and we work directly with your insurance."
      image={img}
      problems={[
        "Leak staining your ceiling after every rain",
        "Missing or curling shingles after a storm",
        "Insurance company giving you the runaround",
        "Roof is 20+ years old and starting to fail",
        "Granules clogging your gutters",
        "Worried about hail or wind damage you can't see",
      ]}
      solutions={[
        "Free, no-pressure roof inspection with photo report",
        "We document damage and work directly with your insurer",
        "Premium GAF & Owens Corning materials",
        "Full tear-offs or targeted repairs — your choice",
        "Lifetime workmanship warranty on replacements",
      ]}
      benefits={[
        { icon: "Clock", title: "Fast Tarping", text: "Emergency leak protection same-day." },
        { icon: "ShieldCheck", title: "Certified Installers", text: "Manufacturer-certified crews." },
        { icon: "DollarSign", title: "Insurance Help", text: "We handle the claim paperwork." },
        { icon: "Wrench", title: "Lifetime Warranty", text: "On qualifying replacements." },
      ]}
      faqs={[
        { q: "Do you offer free roof inspections?", a: "Yes — we'll inspect your roof, document any damage with photos, and give you a written report at no cost." },
        { q: "Do you work with insurance?", a: "We do this every day. We meet adjusters on-site and handle most of the paperwork to get your claim approved." },
        { q: "How long does a roof replacement take?", a: "Most homes are completed in 1–2 days. We protect your landscaping and clean up thoroughly." },
        { q: "What warranty do you offer?", a: "Up to lifetime workmanship warranty on full replacements, plus manufacturer material warranties." },
      ]}
    />
  ),
});
