import { useEffect, useState } from "react";
import { VideoCard } from "@/components/VideoCard";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { AdUnit } from "@/components/AdUnit";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { PaginationControls } from "@/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { supabase } from "@/integrations/supabase/client";

export default function AllVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(videos.length);
  const paginatedVideos = videos.slice(startIndex, endIndex);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("videos")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    setVideos(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <BackButton />

        {/* Top Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mb-6 lg:mb-8">
          <AdUnit size="728x90" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">All Videos 📺</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
          </div>
        ) : videos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No videos found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
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
