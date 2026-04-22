-- Add A/B variant columns to call_leads
ALTER TABLE public.call_leads
  ADD COLUMN IF NOT EXISTS ab_label_variant text,
  ADD COLUMN IF NOT EXISTS ab_anim_variant text;

-- Update insert RLS check to allow short variant strings (and keep all prior limits).
DROP POLICY IF EXISTS "anyone insert call lead" ON public.call_leads;
CREATE POLICY "anyone insert call lead"
ON public.call_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  page_path IS NOT NULL
  AND char_length(page_path) BETWEEN 1 AND 200
  AND (service_slug IS NULL OR char_length(service_slug) <= 64)
  AND (phone IS NULL OR char_length(phone) <= 32)
  AND (ab_label_variant IS NULL OR char_length(ab_label_variant) <= 32)
  AND (ab_anim_variant IS NULL OR char_length(ab_anim_variant) <= 32)
);

-- Impressions table: counts how many sessions saw each variant combo per day.
-- We aggregate per (day, label_variant, anim_variant) to keep volume tiny.
CREATE TABLE IF NOT EXISTS public.ab_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  label_variant text NOT NULL,
  anim_variant text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (day, label_variant, anim_variant)
);

ALTER TABLE public.ab_impressions ENABLE ROW LEVEL SECURITY;

-- Public can read aggregate counts (no PII). Admins manage rows.
DROP POLICY IF EXISTS "ab_impressions public read" ON public.ab_impressions;
CREATE POLICY "ab_impressions public read"
ON public.ab_impressions
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "ab_impressions admin write" ON public.ab_impressions;
CREATE POLICY "ab_impressions admin write"
ON public.ab_impressions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Atomic upsert/increment via SECURITY DEFINER RPC, callable by anon.
CREATE OR REPLACE FUNCTION public.record_ab_impression(_label text, _anim text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _label_clean text := substring(coalesce(_label, '') from 1 for 32);
  _anim_clean  text := substring(coalesce(_anim,  '') from 1 for 32);
BEGIN
  IF _label_clean = '' OR _anim_clean = '' THEN
    RETURN;
  END IF;

  INSERT INTO public.ab_impressions AS ai (day, label_variant, anim_variant, count, updated_at)
  VALUES ((now() AT TIME ZONE 'utc')::date, _label_clean, _anim_clean, 1, now())
  ON CONFLICT (day, label_variant, anim_variant)
  DO UPDATE SET count = ai.count + 1, updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_ab_impression(text, text) TO anon, authenticated;