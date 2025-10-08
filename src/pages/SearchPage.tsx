import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { AdUnit } from "@/components/AdUnit";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query]);

  const searchVideos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("videos")
      .select("*")
      .eq("is_public", true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    setVideos(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Leaderboard Ad */}
        <div className="flex justify-center mb-8">
          <AdUnit size="728x90" />
        </div>

        <h1 className="text-4xl font-bold mb-8">
          Search results for <span className="text-gradient">"{query}"</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No videos found matching your search</p>
          </div>
        )}

        {/* Footer Leaderboard Ad */}
        <div className="flex justify-center mt-12">
          <AdUnit size="728x90" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
