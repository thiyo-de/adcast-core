import { cn } from "@/lib/utils";

interface AdBannerProps {
  size: "728x90" | "300x250" | "300x600" | "160x600";
  className?: string;
}

const adImages = {
  "728x90": "https://via.placeholder.com/728x90/1C1C1C/FF3366?text=Advertisement+728x90",
  "300x250": "https://via.placeholder.com/300x250/1C1C1C/FF3366?text=Advertisement+300x250",
  "300x600": "https://via.placeholder.com/300x600/1C1C1C/FF3366?text=Advertisement+300x600",
  "160x600": "https://via.placeholder.com/160x600/1C1C1C/FF3366?text=Advertisement+160x600",
};

export const AdBanner = ({ size, className }: AdBannerProps) => {
  const dimensions = size.split("x");
  const width = dimensions[0];
  const height = dimensions[1];

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/50", className)}>
      <div className="relative group">
        <img
          src={adImages[size]}
          alt={`Advertisement ${size}`}
          className="w-full h-auto"
          style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
        />
        <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
          Ad
        </div>
      </div>
    </div>
  );
};
