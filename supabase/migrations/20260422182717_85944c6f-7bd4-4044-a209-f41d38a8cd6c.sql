
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins see all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Services (editable phone + meta per department)
CREATE TABLE public.services (
  slug text PRIMARY KEY,
  name text NOT NULL,
  short text NOT NULL,
  icon text NOT NULL,
  phone text NOT NULL,
  phone_href text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.services (slug, name, short, icon, phone, phone_href, sort_order) VALUES
  ('plumbing','Plumbing','Leaks, drains, water heaters & emergency repairs.','Wrench','(888) 555-0111','tel:+18885550111',1),
  ('pest-control','Pest Control','Roaches, ants, rodents, termites — gone for good.','Bug','(888) 555-0122','tel:+18885550122',2),
  ('roofing','Roofing','Repairs, replacements & storm damage specialists.','Home','(888) 555-0133','tel:+18885550133',3),
  ('water-damage','Water Damage','24/7 emergency water removal & restoration.','Droplets','(888) 555-0144','tel:+18885550144',4),
  ('floor-coating','Floor Coating','Premium epoxy garage & commercial floors.','Paintbrush','(888) 555-0155','tel:+18885550155',5);

-- FAQs (per service)
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL REFERENCES public.services(slug) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs public read" ON public.faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "faqs admin write" ON public.faqs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Testimonials (site-wide)
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  city text NOT NULL,
  service text NOT NULL,
  text text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "testimonials admin write" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.testimonials (customer_name, city, service, text, rating, sort_order) VALUES
  ('Sarah M.','Local Resident','Plumbing','Called at 9pm with a burst pipe — they were here in 30 minutes and fixed everything. Lifesavers!',5,1),
  ('Mike R.','Homeowner','Roofing','Roof was leaking after a storm. Honest pricing, quality work, and they cleaned up after themselves.',5,2),
  ('Jennifer K.','Verified Customer','Pest Control','Got rid of our roach problem in one visit. Friendly tech, fair price, and the kids/pets are safe.',5,3),
  ('David L.','Business Owner','Water Damage','Flooded basement at 3am — they showed up fast and saved my floors. Insurance loved them too.',5,4);

-- Call leads (each Call-Now click)
CREATE TABLE public.call_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text,
  page_path text,
  phone text,
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.call_leads ENABLE ROW LEVEL SECURITY;
-- Anyone (anon) can insert a lead (a click), but cannot read.
CREATE POLICY "anyone insert call lead" ON public.call_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read leads" ON public.call_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete leads" ON public.call_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_call_leads_created_at ON public.call_leads (created_at DESC);
CREATE INDEX idx_faqs_service ON public.faqs (service_slug, sort_order);
