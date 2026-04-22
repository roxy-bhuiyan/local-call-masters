export const SITE = {
  name: "ProShield Home Services",
  phone: "(888) 555-0199",
  phoneHref: "tel:+18885550199",
  areas: "Serving Your Local Area 24/7",
  yearsExperience: 18,
  jobsCompleted: "12,400+",
};

// Department-specific tracking phone numbers so each call is attributed
// to the right service line (Plumbing, Pest Control, Roofing, Water Damage,
// Floor Coating). Swap these with real CallRail / Google Ads forwarding
// numbers when wiring up call tracking.
export const SERVICES = [
  {
    slug: "plumbing",
    name: "Plumbing",
    short: "Leaks, drains, water heaters & emergency repairs.",
    icon: "Wrench",
    phone: "(888) 555-0111",
    phoneHref: "tel:+18885550111",
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    short: "Roaches, ants, rodents, termites — gone for good.",
    icon: "Bug",
    phone: "(888) 555-0122",
    phoneHref: "tel:+18885550122",
  },
  {
    slug: "roofing",
    name: "Roofing",
    short: "Repairs, replacements & storm damage specialists.",
    icon: "Home",
    phone: "(888) 555-0133",
    phoneHref: "tel:+18885550133",
  },
  {
    slug: "water-damage",
    name: "Water Damage",
    short: "24/7 emergency water removal & restoration.",
    icon: "Droplets",
    phone: "(888) 555-0144",
    phoneHref: "tel:+18885550144",
  },
  {
    slug: "floor-coating",
    name: "Floor Coating",
    short: "Premium epoxy garage & commercial floors.",
    icon: "Paintbrush",
    phone: "(888) 555-0155",
    phoneHref: "tel:+18885550155",
  },
] as const;

export type ServiceSlug = typeof SERVICES[number]["slug"];

export function getServicePhone(slug: ServiceSlug) {
  const s = SERVICES.find((x) => x.slug === slug);
  return s
    ? { phone: s.phone, phoneHref: s.phoneHref }
    : { phone: SITE.phone, phoneHref: SITE.phoneHref };
}
