-- Add is_public column to videos table
ALTER TABLE videos ADD COLUMN is_public boolean DEFAULT true NOT NULL;

-- Create index for better query performance
CREATE INDEX idx_videos_is_public ON videos(is_public);

-- Add comment for documentation
COMMENT ON COLUMN videos.is_public IS 'Controls whether video appears on public pages. True = public, false = unlisted but accessible via direct link.';