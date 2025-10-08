import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface AdUnitProps {
  size: "728x90" | "300x250" | "300x600" | "160x600";
  className?: string;
  adSlot?: string; // Google AdSense slot ID
  format?: string; // Ad format (auto, rectangle, etc.)
  provider?: "adsense" | "propeller" | "media.net" | "placeholder";
}

const placeholderImages = {
  "728x90": "https://via.placeholder.com/728x90/1C1C1C/FF3366?text=Advertisement+728x90",
  "300x250": "https://via.placeholder.com/300x250/1C1C1C/FF3366?text=Advertisement+300x250",
  "300x600": "https://via.placeholder.com/300x600/1C1C1C/FF3366?text=Advertisement+300x600",
  "160x600": "https://via.placeholder.com/160x600/1C1C1C/FF3366?text=Advertisement+160x600",
};

export const AdUnit = ({ 
  size, 
  className, 
  adSlot, 
  format = "auto",
  provider = "placeholder" 
}: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const dimensions = size.split("x");
  const width = dimensions[0];
  const height = dimensions[1];

  useEffect(() => {
    // Initialize ad networks when ready
    if (provider === "adsense" && adSlot) {
      try {
        // @ts-ignore
        if (window.adsbygoogle && adRef.current) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, [provider, adSlot]);

  // Render Google AdSense
  if (provider === "adsense" && adSlot) {
    return (
      <div 
        ref={adRef}
        className={cn("overflow-hidden rounded-lg border border-border/50", className)}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: `${width}px`, height: `${height}px` }}
          data-ad-client="ca-pub-XXXXXXXXXX" // Replace with your publisher ID
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive="false"
        />
      </div>
    );
  }

  // Render PropellerAds
  if (provider === "propeller" && adSlot) {
    return (
      <div 
        ref={adRef}
        className={cn("overflow-hidden rounded-lg border border-border/50", className)}
      >
        <div id={`propeller-${adSlot}`} style={{ width: `${width}px`, height: `${height}px` }} />
      </div>
    );
  }

  // Render Media.net
  if (provider === "media.net" && adSlot) {
    return (
      <div 
        ref={adRef}
        className={cn("overflow-hidden rounded-lg border border-border/50", className)}
      >
        <div 
          id={adSlot}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      </div>
    );
  }

  // Fallback: Placeholder ad
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/50", className)}>
      <div className="relative group">
        <img
          src={placeholderImages[size]}
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