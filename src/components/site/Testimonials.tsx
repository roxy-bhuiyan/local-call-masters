import { Star } from "lucide-react";

const reviews = [
  { name: "Sarah M.", city: "Local Resident", text: "Called at 9pm with a burst pipe — they were here in 30 minutes and fixed everything. Lifesavers!", service: "Plumbing" },
  { name: "Mike R.", city: "Homeowner", text: "Roof was leaking after a storm. Honest pricing, quality work, and they cleaned up after themselves.", service: "Roofing" },
  { name: "Jennifer K.", city: "Verified Customer", text: "Got rid of our roach problem in one visit. Friendly tech, fair price, and the kids/pets are safe.", service: "Pest Control" },
  { name: "David L.", city: "Business Owner", text: "Flooded basement at 3am — they showed up fast and saved my floors. Insurance loved them too.", service: "Water Damage" },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <p className="text-accent font-bold uppercase tracking-wider text-sm mb-2">Real Reviews</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">What Our Neighbors Say</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)]">
              <div className="flex gap-1 mb-3 text-accent">
                {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">"{r.text}"</p>
              <div className="border-t border-border pt-3">
                <div className="font-bold text-sm text-foreground">{r.name}</div>
                <div className="text-xs text-foreground/75">{r.city} · {r.service}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
