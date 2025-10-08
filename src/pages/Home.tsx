import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdUnit } from "@/components/AdUnit";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { VideoSection } from "@/components/VideoSection";
import { supabase } from "@/integrations/supabase/client";

export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    // Fetch trending videos (most viewed)
    const { data: trending } = await supabase
      .from("videos")
      .select("*")
      .eq("is_public", true)
      .order("views", { ascending: false })
      .limit(200);

    // Fetch all videos (most recent)
    const { data: all } = await supabase
      .from("videos")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(200);

    // Use top 5 trending videos for carousel
    setFeaturedVideos(trending?.slice(0, 5) || []);
    setTrendingVideos(trending || []);
    setAllVideos(all || []);
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

        {/* Featured Videos Section */}
        <VideoSection
          title="Featured Videos ⭐"
          videos={trendingVideos}
          isLoading={isLoading}
          viewMoreLink="/featured"
        />

        {/* Trending Now Section */}
        <VideoSection
          title="Trending Now 🔥"
          videos={trendingVideos}
          isLoading={isLoading}
          viewMoreLink="/trending"
        />

        {/* All Videos Section */}
        <VideoSection
          title="All Videos 📺"
          videos={allVideos}
          isLoading={isLoading}
          viewMoreLink="/all-videos"
        />

        {/* Footer Leaderboard Ad - Hidden on mobile */}
        <div className="hidden sm:flex justify-center mt-8 lg:mt-12">
          <AdUnit size="728x90" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
