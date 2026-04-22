import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import img from "@/assets/service-water.jpg";

export const Route = createFileRoute("/water-damage")({
  head: () => ({
    meta: [
      { title: "24/7 Water Damage Restoration Near Me | Emergency Cleanup" },
      { name: "description", content: "Flooded home? 24/7 emergency water removal, drying & restoration. IICRC certified. Insurance approved. Call now!" },
      { property: "og:title", content: "24/7 Water Damage Restoration" },
      { property: "og:description", content: "Emergency water removal & full restoration. IICRC certified." },
      { property: "og:image", content: img },
      { name: "twitter:image", content: img },
    ],
  }),
  component: () => (
    <ServicePage
      badge="🚨 24/7 Emergency Response"
      title="Water Damage Restoration — On-Site in 60 Minutes"
      subtitle="Flooded basement? Burst pipe? We're IICRC certified, insurance approved, and on the way right now."
      image={img}
      problems={[
        "Standing water in your home or basement",
        "Sewage backup creating a health hazard",
        "Wet drywall, carpet, or hardwood floors",
        "Worried about mold growing in 24–48 hours",
        "Insurance adjuster wants documentation",
        "No idea where to even start",
      ]}
      solutions={[
        "Emergency response truck dispatched within minutes",
        "Industrial water extraction & structural drying",
        "Mold prevention treatments included",
        "Direct billing & full documentation for your insurance",
        "Complete reconstruction if needed — one team, one job",
      ]}
      benefits={[
        { icon: "Clock", title: "60-Min Response", text: "Day, night, weekends, holidays." },
        { icon: "ShieldCheck", title: "IICRC Certified", text: "The gold standard in restoration." },
        { icon: "DollarSign", title: "Insurance Direct", text: "We bill your insurance directly." },
        { icon: "Wrench", title: "Full Restoration", text: "From extraction to rebuild." },
      ]}
      faqs={[
        { q: "How fast can you arrive?", a: "Our average emergency response time is under 60 minutes, 24/7/365. Time matters — mold can start within 24 hours." },
        { q: "Will my insurance cover this?", a: "Most homeowner policies cover sudden water damage. We work directly with all major insurers and handle documentation." },
        { q: "How long does drying take?", a: "Typically 3–5 days with our industrial equipment. We monitor moisture levels daily until your home is fully dry." },
        { q: "Do you handle sewage backups?", a: "Yes — we are certified for Category 3 (black water) cleanup with full PPE and disinfection protocols." },
      ]}
    />
  ),
});
