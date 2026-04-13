-- Seller Applications table for admin approval workflow
CREATE TABLE IF NOT EXISTS public.seller_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  gstin TEXT,
  category TEXT,
  address TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id)
);

ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Users can view/insert their own application
CREATE POLICY "Users can view own application" ON public.seller_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit own application" ON public.seller_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can see and update all applications
CREATE POLICY "Admins can manage all applications" ON public.seller_applications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Function: when admin approves an application, upsert into sellers and grant seller role
CREATE OR REPLACE FUNCTION public.approve_seller_application(
  _application_id UUID,
  _admin_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _app public.seller_applications;
BEGIN
  SELECT * INTO _app FROM public.seller_applications WHERE id = _application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  -- Mark application approved
  UPDATE public.seller_applications
  SET status = 'approved', reviewed_at = now(), reviewed_by = _admin_id
  WHERE id = _application_id;

  -- Upsert into sellers table
  INSERT INTO public.sellers (user_id, business_name, gstin, category, address, description, status, verified)
  VALUES (_app.user_id, _app.business_name, _app.gstin, _app.category, _app.address, _app.description, 'approved', true)
  ON CONFLICT (user_id) DO UPDATE
    SET status = 'approved', verified = true, updated_at = now();

  -- Grant seller role (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_app.user_id, 'seller')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Function: when admin rejects an application
CREATE OR REPLACE FUNCTION public.reject_seller_application(
  _application_id UUID,
  _admin_id UUID,
  _notes TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.seller_applications
  SET status = 'rejected', reviewed_at = now(), reviewed_by = _admin_id, admin_notes = _notes
  WHERE id = _application_id;

  -- Update seller record if exists
  UPDATE public.sellers
  SET status = 'rejected', verified = false, updated_at = now()
  WHERE user_id = (SELECT user_id FROM public.seller_applications WHERE id = _application_id);
END;
$$;
