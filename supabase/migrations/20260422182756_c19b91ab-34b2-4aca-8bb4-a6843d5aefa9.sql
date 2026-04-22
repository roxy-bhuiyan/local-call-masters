
-- Replace overly-permissive insert policy with one that requires basic shape.
DROP POLICY IF EXISTS "anyone insert call lead" ON public.call_leads;
CREATE POLICY "anyone insert call lead"
  ON public.call_leads FOR INSERT TO anon, authenticated
  WITH CHECK (
    page_path IS NOT NULL
    AND char_length(page_path) BETWEEN 1 AND 200
    AND (service_slug IS NULL OR char_length(service_slug) <= 64)
    AND (phone IS NULL OR char_length(phone) <= 32)
  );

-- Seed FAQs
INSERT INTO public.faqs (service_slug, question, answer, sort_order) VALUES
  ('plumbing','Do you charge for estimates?','Diagnosis is free with any repair. We give you a flat-rate quote before any work begins — no surprise charges.',1),
  ('plumbing','How fast can you get here?','For emergencies in our service area, our average arrival time is under 60 minutes, 24/7.',2),
  ('plumbing','Are your plumbers licensed?','Yes — every technician is state-licensed, background-checked, drug-tested, and fully insured.',3),
  ('plumbing','Do you offer warranties?','Absolutely. All repairs include a workmanship warranty, and parts carry manufacturer warranties.',4),

  ('pest-control','Are your treatments safe for pets and children?','Yes. We use EPA-approved low-toxicity products and follow strict safety protocols. Your family and pets can usually return within 1–2 hours.',1),
  ('pest-control','How long does treatment take?','Most homes are treated in 30–60 minutes. Severe infestations may need follow-up visits, all included in your plan.',2),
  ('pest-control','What if the pests come back?','Our treatments are guaranteed. If pests return between scheduled visits, we re-treat at no charge.',3),
  ('pest-control','Do you treat termites?','Yes — we offer full termite inspections, spot treatments, and complete protection plans.',4),

  ('roofing','Do you offer free roof inspections?','Yes — we''ll inspect your roof, document any damage with photos, and give you a written report at no cost.',1),
  ('roofing','Do you work with insurance?','We do this every day. We meet adjusters on-site and handle most of the paperwork to get your claim approved.',2),
  ('roofing','How long does a roof replacement take?','Most homes are completed in 1–2 days. We protect your landscaping and clean up thoroughly.',3),
  ('roofing','What warranty do you offer?','Up to lifetime workmanship warranty on full replacements, plus manufacturer material warranties.',4),

  ('water-damage','How fast can you arrive?','Our average emergency response time is under 60 minutes, 24/7/365. Time matters — mold can start within 24 hours.',1),
  ('water-damage','Will my insurance cover this?','Most homeowner policies cover sudden water damage. We work directly with all major insurers and handle documentation.',2),
  ('water-damage','How long does drying take?','Typically 3–5 days with our industrial equipment. We monitor moisture levels daily until your home is fully dry.',3),
  ('water-damage','Do you handle sewage backups?','Yes — we are certified for Category 3 (black water) cleanup with full PPE and disinfection protocols.',4),

  ('floor-coating','How long does installation take?','Most residential garages are completed in a single day. You can walk on it in 4–6 hours and drive on it the next day.',1),
  ('floor-coating','What''s the difference between epoxy and polyaspartic?','Polyaspartic cures faster, resists UV yellowing, and is more flexible. We typically recommend a hybrid system for best durability.',2),
  ('floor-coating','Will it crack or peel?','Not when installed correctly. Our diamond-grinding prep ensures a permanent bond — and we back it with a lifetime warranty.',3),
  ('floor-coating','Can I customize the color?','Yes — hundreds of base colors and decorative flake blends. We bring physical samples to your free consultation.',4);
