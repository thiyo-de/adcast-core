import { Link } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Video {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  category: string;
  views: number;
  likes: number;
  tags: string[];
}

interface VideoSectionProps {
  title: string;
  videos: Video[];
  isLoading: boolean;
  viewMoreLink: string;
}

export const VideoSection = ({ title, videos, isLoading, viewMoreLink }: VideoSectionProps) => {
  return (
    <section className="mb-8 sm:mb-10 lg:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>
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
          videos.slice(0, 8).map((video) => (
            <VideoCard key={video.id} {...video} />
          ))
        )}
      </div>
      {!isLoading && videos.length > 0 && (
        <div className="flex justify-center mt-6">
          <Link to={viewMoreLink}>
            <Button className="min-h-[44px]">
              View More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};
