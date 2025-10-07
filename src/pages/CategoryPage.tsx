import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export default function CategoryPage() {
  const { category } = useParams();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchVideos();
    }
  }, [category]);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("videos")
      .select("*")
      .eq("category", category)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    setVideos(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-gradient">{category}</span> Videos
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
            <p className="text-xl text-muted-foreground">No videos found in this category</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
