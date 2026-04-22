import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import img from "@/assets/service-pest.jpg";

export const Route = createFileRoute("/pest-control")({
  head: () => ({
    meta: [
      { title: "Emergency Pest Control Near Me | Same-Day Treatment" },
      { name: "description", content: "Eliminate roaches, ants, rodents, termites & spiders fast. Family & pet-safe pest control. Same-day service. Call now!" },
      { property: "og:title", content: "Same-Day Pest Control Near You" },
      { property: "og:description", content: "Pet & family-safe treatments. Guaranteed results." },
      { property: "og:image", content: img },
      { name: "twitter:image", content: img },
    ],
  }),
  component: () => (
    <ServicePage
      badge="🐜 Same-Day Pest Treatment"
      title="Get Rid of Pests — Fast & Safe"
      subtitle="Roaches, ants, rodents, termites, spiders. Pet & family-safe treatments with guaranteed results."
      image={img}
      problems={[
        "Seeing roaches in the kitchen at night",
        "Ants marching across countertops",
        "Mice or rats scratching in the walls",
        "Termites quietly destroying your home",
        "Spiders, wasps, or bees out of control",
        "Treatments that never seem to work",
      ]}
      solutions={[
        "Free inspection to find the source — not just the symptom",
        "EPA-approved, pet & kid-safe products",
        "Targeted treatment plans, not one-size-fits-all spray",
        "Re-treatment guarantee until they're gone",
        "Discreet unmarked vehicles available on request",
      ]}
      benefits={[
        { icon: "Clock", title: "Same-Day Visits", text: "Treat today, sleep easy tonight." },
        { icon: "ShieldCheck", title: "Pet & Kid Safe", text: "EPA-approved low-toxicity products." },
        { icon: "DollarSign", title: "Affordable Plans", text: "One-time or quarterly options." },
        { icon: "Wrench", title: "Guaranteed Results", text: "Free re-treatment if pests return." },
      ]}
      faqs={[
        { q: "Are your treatments safe for pets and children?", a: "Yes. We use EPA-approved low-toxicity products and follow strict safety protocols. Your family and pets can usually return within 1–2 hours." },
        { q: "How long does treatment take?", a: "Most homes are treated in 30–60 minutes. Severe infestations may need follow-up visits, all included in your plan." },
        { q: "What if the pests come back?", a: "Our treatments are guaranteed. If pests return between scheduled visits, we re-treat at no charge." },
        { q: "Do you treat termites?", a: "Yes — we offer full termite inspections, spot treatments, and complete protection plans." },
      ]}
    />
  ),
});
