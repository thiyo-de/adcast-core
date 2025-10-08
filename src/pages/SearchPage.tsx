import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { AdUnit } from "@/components/AdUnit";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PaginationControls } from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/usePagination";
import { supabase } from "@/integrations/supabase/client";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'featured' | 'latest'>('all');

  const { currentPage, totalPages, startIndex, endIndex, goToPage, resetPage } = usePagination(videos.length);
  const paginatedVideos = videos.slice(startIndex, endIndex);

  useEffect(() => {
    if (query) {
      searchVideos();
      resetPage();
    }
  }, [query, activeFilter]);

  const searchVideos = async () => {
    setLoading(true);
    
    let queryBuilder = supabase
      .from("videos")
      .select("*")
      .eq("is_public", true);

    if (query.trim()) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,` +
        `description.ilike.%${query}%,` +
        `category.ilike.%${query}%,` +
        `tags.cs.{${query}}`
      );
    }

    switch (activeFilter) {
      case 'trending':
      case 'featured':
        queryBuilder = queryBuilder.order('views', { ascending: false });
        break;
      case 'latest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
        break;
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    const { data } = await queryBuilder;
    setVideos(data || []);
    setLoading(false);
  };

  const handleFilterChange = (filter: 'all' | 'trending' | 'featured' | 'latest') => {
    setActiveFilter(filter);
    resetPage();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mb-6 lg:mb-8">
          <AdUnit size="728x90" />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
          Search results for <span className="text-gradient break-words">"{query}"</span>
        </h1>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('all')}
          >
            All Results
          </Button>
          <Button
            variant={activeFilter === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('trending')}
          >
            🔥 Trending
          </Button>
          <Button
            variant={activeFilter === 'featured' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('featured')}
          >
            ⭐ Featured
          </Button>
          <Button
            variant={activeFilter === 'latest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('latest')}
          >
            🆕 Latest
          </Button>
        </div>

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
            <p className="text-lg sm:text-xl text-muted-foreground">No videos found matching your search</p>
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
