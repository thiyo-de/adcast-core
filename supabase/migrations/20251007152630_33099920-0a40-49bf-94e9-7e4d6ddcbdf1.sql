-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  embed_code TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Public can read all videos
CREATE POLICY "Anyone can view videos"
  ON public.videos
  FOR SELECT
  USING (true);

-- Only authenticated users can insert videos (for admin)
CREATE POLICY "Authenticated users can insert videos"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update videos
CREATE POLICY "Authenticated users can update videos"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete videos
CREATE POLICY "Authenticated users can delete videos"
  ON public.videos
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for slug lookups
CREATE INDEX idx_videos_slug ON public.videos(slug);

-- Create index for category lookups
CREATE INDEX idx_videos_category ON public.videos(category);

-- Create index for tags using GIN
CREATE INDEX idx_videos_tags ON public.videos USING GIN(tags);

-- Create index for created_at for sorting
CREATE INDEX idx_videos_created_at ON public.videos(created_at DESC);