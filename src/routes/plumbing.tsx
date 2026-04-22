import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import img from "@/assets/service-plumbing.jpg";

export const Route = createFileRoute("/plumbing")({
  head: () => ({
    meta: [
      { title: "Emergency Plumbing Service Near Me | 24/7 Plumbers" },
      { name: "description", content: "Licensed plumbers for leaks, clogs, water heaters & burst pipes. Same-day & 24/7 emergency plumbing service. Call now!" },
      { property: "og:title", content: "Emergency Plumbing Service Near You" },
      { property: "og:description", content: "24/7 licensed plumbers — same-day repairs, upfront pricing." },
      { property: "og:image", content: img },
      { name: "twitter:image", content: img },
    ],
  }),
  component: () => (
    <ServicePage
      dept="plumbing"
      badge="🚨 24/7 Emergency Plumbers"
      title="Emergency Plumbing Services Near You"
      subtitle="Burst pipe? Clogged drain? No hot water? Our licensed plumbers are dispatched in minutes — not hours."
      image={img}
      problems={[
        "Water gushing and you can't find the shut-off",
        "Toilet overflowing or won't flush",
        "No hot water — cold showers all morning",
        "Slow drains that keep coming back",
        "Mystery leak ruining your floors or ceiling",
        "Old plumbing that needs a full repipe",
      ]}
      solutions={[
        "Live dispatcher answers in 30 seconds — no voicemail",
        "Master plumber on-site, often within the hour",
        "Upfront flat-rate pricing before any work starts",
        "Quality parts with workmanship warranty",
        "Clean uniformed techs who respect your home",
      ]}
      benefits={[
        { icon: "Clock", title: "Same-Day Service", text: "Most jobs completed the day you call." },
        { icon: "ShieldCheck", title: "Licensed Plumbers", text: "State-certified, bonded & insured." },
        { icon: "DollarSign", title: "Upfront Pricing", text: "Approve the price before we start." },
        { icon: "Wrench", title: "Quality Parts", text: "Backed by our workmanship guarantee." },
      ]}
      faqs={[
        { q: "Do you charge for estimates?", a: "Diagnosis is free with any repair. We give you a flat-rate quote before any work begins — no surprise charges." },
        { q: "How fast can you get here?", a: "For emergencies in our service area, our average arrival time is under 60 minutes, 24/7." },
        { q: "Are your plumbers licensed?", a: "Yes — every technician is state-licensed, background-checked, drug-tested, and fully insured." },
        { q: "Do you offer warranties?", a: "Absolutely. All repairs include a workmanship warranty, and parts carry manufacturer warranties." },
      ]}
    />
  ),
});
