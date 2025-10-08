import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { AdUnit } from "@/components/AdUnit";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PaginationControls } from "@/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { supabase } from "@/integrations/supabase/client";

export default function CategoryPage() {
  const { category } = useParams();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentPage, totalPages, startIndex, endIndex, goToPage, resetPage } = usePagination(videos.length);
  const paginatedVideos = videos.slice(startIndex, endIndex);

  useEffect(() => {
    if (category) {
      fetchVideos();
      resetPage();
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
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mb-6 lg:mb-8">
          <AdUnit size="728x90" />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">
          <span className="text-gradient">{category}</span> Videos
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl text-muted-foreground">No videos found in this category</p>
          </div>
        )}

        {/* Footer Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mt-8 lg:mt-12">
          <AdUnit size="728x90" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
