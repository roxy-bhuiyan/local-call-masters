export const SITE = {
  name: "ProShield Home Services",
  phone: "(888) 555-0199",
  phoneHref: "tel:+18885550199",
  areas: "Serving Your Local Area 24/7",
  yearsExperience: 18,
  jobsCompleted: "12,400+",
};

export const SERVICES = [
  { slug: "plumbing", name: "Plumbing", short: "Leaks, drains, water heaters & emergency repairs.", icon: "Wrench" },
  { slug: "pest-control", name: "Pest Control", short: "Roaches, ants, rodents, termites — gone for good.", icon: "Bug" },
  { slug: "roofing", name: "Roofing", short: "Repairs, replacements & storm damage specialists.", icon: "Home" },
  { slug: "water-damage", name: "Water Damage", short: "24/7 emergency water removal & restoration.", icon: "Droplets" },
  { slug: "floor-coating", name: "Floor Coating", short: "Premium epoxy garage & commercial floors.", icon: "Paintbrush" },
] as const;

export type ServiceSlug = typeof SERVICES[number]["slug"];
