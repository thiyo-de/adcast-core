import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { AdBanner } from "@/components/AdBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const fetchVideos = async () => {
    // Fetch featured videos (most recent)
    const { data: featured } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    // Fetch trending videos (most viewed)
    const { data: trending } = await supabase
      .from("videos")
      .select("*")
      .order("views", { ascending: false })
      .limit(8);

    setFeaturedVideos(featured || []);
    setTrendingVideos(trending || []);
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

      <main className="container mx-auto px-4 py-8">
        {/* Top Banner Ad */}
        <div className="flex justify-center mb-8">
          <AdBanner size="728x90" />
        </div>

        {/* Featured Section */}
        {featuredVideos.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gradient">Featured Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link key={category} to={`/category/${category}`}>
                  <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all">
                    {category}
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Section */}
        {trendingVideos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Trending Now 🔥</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom Ad */}
        <div className="flex justify-center mt-12">
          <AdBanner size="728x90" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
