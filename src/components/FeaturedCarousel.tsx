import { useRef } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from "embla-carousel-autoplay";

interface Video {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  description: string | null;
  category: string;
}

interface FeaturedCarouselProps {
  videos: Video[];
  isLoading: boolean;
}

export function FeaturedCarousel({ videos, isLoading }: FeaturedCarouselProps) {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  if (isLoading) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        loop: true,
        align: "start",
      }}
      plugins={[plugin.current]}
      className="w-full"
    >
      <CarouselContent>
        {videos.map((video) => (
          <CarouselItem key={video.id}>
            <Link to={`/video/${video.slug}`} className="block relative group">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: video.thumbnail_url
                      ? `url(${video.thumbnail_url})`
                      : "linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--secondary)))",
                  }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs sm:text-sm font-semibold">
                    {video.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-16">
                  {/* Play Button */}
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-lg max-w-4xl">
                    {video.title}
                  </h3>

                  {/* Description */}
                  {video.description && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 line-clamp-2 sm:line-clamp-3 max-w-3xl drop-shadow-md">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <CarouselPrevious className="left-2 sm:left-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white" />
      <CarouselNext className="right-2 sm:right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white" />
    </Carousel>
  );
}
