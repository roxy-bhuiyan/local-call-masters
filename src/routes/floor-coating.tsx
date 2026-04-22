import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import img from "@/assets/service-floor.jpg";

export const Route = createFileRoute("/floor-coating")({
  head: () => ({
    meta: [
      { title: "Epoxy Floor Coating Near Me | Garage & Commercial Floors" },
      { name: "description", content: "Premium epoxy & polyaspartic floor coatings for garages, basements & commercial spaces. 1-day install. Lifetime warranty. Call now!" },
      { property: "og:title", content: "Premium Epoxy Floor Coating" },
      { property: "og:description", content: "1-day install. Lifetime warranty. Free in-home estimates." },
      { property: "og:image", content: img },
      { name: "twitter:image", content: img },
    ],
  }),
  component: () => (
    <ServicePage
      badge="✨ 1-Day Install · Lifetime Warranty"
      title="Premium Epoxy Floor Coating"
      subtitle="Transform your garage, basement, or shop in a single day. Stain-proof, slip-resistant, and built to last forever."
      image={img}
      problems={[
        "Ugly, cracked, or stained concrete floor",
        "Slippery surface that's a safety risk",
        "Oil and chemical stains you can't scrub out",
        "Cheap DIY epoxy that already peeled",
        "Want a showroom-quality garage finish",
        "Need durable flooring for a business",
      ]}
      solutions={[
        "Free in-home consultation with color samples",
        "Diamond-grind prep — the secret to bonding that lasts",
        "Premium polyaspartic coating cures in hours, not days",
        "Hundreds of color & flake combinations available",
        "Lifetime warranty against peeling, chipping, or yellowing",
      ]}
      benefits={[
        { icon: "Clock", title: "1-Day Install", text: "Drive on it the next day." },
        { icon: "ShieldCheck", title: "Lifetime Warranty", text: "Backed for as long as you own it." },
        { icon: "DollarSign", title: "Free Estimates", text: "In-home with color samples." },
        { icon: "Wrench", title: "Pro-Grade Prep", text: "Diamond-ground for max bonding." },
      ]}
      faqs={[
        { q: "How long does installation take?", a: "Most residential garages are completed in a single day. You can walk on it in 4–6 hours and drive on it the next day." },
        { q: "What's the difference between epoxy and polyaspartic?", a: "Polyaspartic cures faster, resists UV yellowing, and is more flexible. We typically recommend a hybrid system for best durability." },
        { q: "Will it crack or peel?", a: "Not when installed correctly. Our diamond-grinding prep ensures a permanent bond — and we back it with a lifetime warranty." },
        { q: "Can I customize the color?", a: "Yes — hundreds of base colors and decorative flake blends. We bring physical samples to your free consultation." },
      ]}
    />
  ),
});
