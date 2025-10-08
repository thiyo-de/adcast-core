-- Create categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view categories"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
ON public.categories
FOR UPDATE
USING (true);

CREATE POLICY "Authenticated users can delete categories"
ON public.categories
FOR DELETE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Seed with existing categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Food', 'food', 'Food and cooking related content'),
  ('Gaming', 'gaming', 'Gaming and esports content'),
  ('Lifestyle', 'lifestyle', 'Lifestyle and daily life content'),
  ('Music', 'music', 'Music and audio content'),
  ('Sports', 'sports', 'Sports and fitness content'),
  ('Technology', 'technology', 'Technology and gadgets content'),
  ('Travel', 'travel', 'Travel and adventure content');