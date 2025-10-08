import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VideoCard } from "@/components/VideoCard";
import { AdUnit } from "@/components/AdUnit";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function VideoPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [video, setVideo] = useState<any>(null);
  const [suggestedVideos, setSuggestedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchVideo();
    }
  }, [slug]);

  const fetchVideo = async () => {
    try {
      // Fetch video by slug
      const { data: videoData, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("slug", slug)
        .single();

      if (videoError) throw videoError;

      setVideo(videoData);

      // Increment view count
      await supabase
        .from("videos")
        .update({ views: videoData.views + 1 })
        .eq("id", videoData.id);

      // Fetch suggested videos based on category and tags (only public videos)
      const { data: suggested } = await supabase
        .from("videos")
        .select("*")
        .eq("is_public", true)
        .neq("id", videoData.id)
        .or(`category.eq.${videoData.category},tags.cs.{${videoData.tags.join(",")}}`)
        .limit(6);

      setSuggestedVideos(suggested || []);
    } catch (error) {
      console.error("Error fetching video:", error);
      toast({
        title: "Error",
        description: "Failed to load video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!video || hasLiked) return;

    try {
      const { error } = await supabase
        .from("videos")
        .update({ likes: video.likes + 1 })
        .eq("id", video.id);

      if (error) throw error;

      setVideo({ ...video, likes: video.likes + 1 });
      setHasLiked(true);
      toast({
        title: "Liked!",
        description: "You liked this video",
      });
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Video link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Video not found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Top Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mb-4 sm:mb-6">
          <AdUnit size="728x90" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2">
            {/* Video Player */}
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-3 sm:mb-4">
              <div dangerouslySetInnerHTML={{ __html: video.embed_code }} className="w-full h-full" />
            </div>

            {/* VPN Hint */}
            <Alert className="mb-3 sm:mb-4 border-primary/50 text-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                If the video does not play, try using a VPN (some partner sites may be blocked in certain regions)
              </AlertDescription>
            </Alert>

            {/* Video Info */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{video.title}</h1>
                <Badge variant="outline" className="self-start sm:ml-4 flex-shrink-0">{video.category}</Badge>
              </div>
              
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{video.description}</p>

              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <Button 
                  variant={hasLiked ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleLike}
                  disabled={hasLiked}
                  className="min-h-[44px]"
                >
                  <Heart className={`h-4 w-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="hidden xs:inline">{video.likes} Likes</span>
                  <span className="xs:hidden">{video.likes}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="min-h-[44px]">
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Share</span>
                </Button>
              </div>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {video.tags.map((tag: string) => (
                    <Link key={tag} to={`/tag/${tag}`}>
                      <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors text-xs">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Inline Ad - Hidden on mobile */}
            <div className="hidden sm:block mb-6 lg:mb-8">
              <AdUnit size="728x90" />
            </div>

            {/* Suggested Videos */}
            {suggestedVideos.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Suggested Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {suggestedVideos.map((suggestedVideo) => (
                    <VideoCard key={suggestedVideo.id} {...suggestedVideo} />
                  ))}
                </div>
                
                {/* Inline Ad below suggested videos - Hidden on mobile */}
                <div className="hidden sm:flex justify-center mt-4 sm:mt-6">
                  <AdUnit size="728x90" />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile and tablet, shown on xl+ */}
          <div className="hidden xl:flex flex-col gap-6">
            <AdUnit size="300x250" />
            <AdUnit size="300x600" className="hidden 2xl:block" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
