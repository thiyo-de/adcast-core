import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { AdUnit } from "@/components/AdUnit";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { PaginationControls } from "@/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { supabase } from "@/integrations/supabase/client";

export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(trendingVideos.length);
  const paginatedVideos = trendingVideos.slice(startIndex, endIndex);

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    // Fetch featured videos (most recent)
    const { data: featured } = await supabase
      .from("videos")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3);

    // Fetch trending videos (most viewed) - fetch more for pagination
    const { data: trending } = await supabase
      .from("videos")
      .select("*")
      .eq("is_public", true)
      .order("views", { ascending: false })
      .limit(200);

    setFeaturedVideos(featured || []);
    setTrendingVideos(trending || []);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("videos")
      .select("category");

    if (data) {
      const uniqueCategories = [...new Set(data.map(v => v.category))];
      setCategories(uniqueCategories);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Top Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mb-6 lg:mb-8">
          <AdUnit size="728x90" />
        </div>

        {/* Featured Section */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <FeaturedCarousel videos={featuredVideos} isLoading={isLoading} />
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <Link key={category} to={`/category/${category}`}>
                  <Button 
                    variant="outline" 
                    className="hover:bg-primary hover:text-primary-foreground transition-all text-sm sm:text-base min-h-[44px]"
                  >
                    {category}
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Section with Inline Ads */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Trending Now 🔥</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              <>
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
              </>
            ) : (
              paginatedVideos.map((video, index) => (
                <>
                  <VideoCard key={video.id} {...video} />
                  {/* Inline Ad every 6 videos - Hidden on mobile */}
                  {(index + 1) % 6 === 0 && index !== paginatedVideos.length - 1 && (
                    <div className="hidden sm:flex col-span-full justify-center my-4">
                      <AdUnit size="728x90" />
                    </div>
                  )}
                </>
              ))
            )}
          </div>

          {!isLoading && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
        </section>

        {/* Footer Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mt-8 lg:mt-12">
          <AdUnit size="728x90" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
