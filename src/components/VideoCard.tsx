import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  id: string;
  title: string;
  slug: string;
  thumbnail_url?: string;
  category: string;
  views: number;
  likes: number;
  tags: string[];
}

export const VideoCard = ({ 
  title, 
  slug, 
  thumbnail_url, 
  category, 
  views, 
  likes,
  tags 
}: VideoCardProps) => {
  return (
    <Link to={`/video/${slug}`} className="block min-h-[44px]">
      <Card className="overflow-hidden hover-lift border-border bg-card group h-full">
        <div className="aspect-video relative overflow-hidden bg-secondary">
          {thumbnail_url ? (
            <img 
              src={thumbnail_url} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="text-3xl sm:text-4xl">🎬</span>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs">
            {category}
          </Badge>
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {likes}
            </span>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
