"use client";

import { useState, useEffect } from "react";

const INITIAL_MEDIA = [
  // Pattern: Video -> Pic -> Pic -> Video -> Pic -> Pic
  { src: "https://res.cloudinary.com/didymerkz/video/upload/v1777316915/crc_production_assets/crcvid.mov", type: "video", poster: "https://res.cloudinary.com/didymerkz/image/upload/v1777316922/crc_production_assets/crc1.jpg" },
  { src: "https://res.cloudinary.com/didymerkz/image/upload/v1777316922/crc_production_assets/crc1.jpg", type: "image" },
  { src: "https://res.cloudinary.com/didymerkz/image/upload/v1777316926/crc_production_assets/crc2.jpg", type: "image" },
  
  { src: "https://res.cloudinary.com/didymerkz/video/upload/v1777316915/crc_production_assets/crcvid.mov", type: "video", poster: "https://res.cloudinary.com/didymerkz/image/upload/v1777316922/crc_production_assets/crc1.jpg" },
  { src: "https://res.cloudinary.com/didymerkz/image/upload/v1777316929/crc_production_assets/crc3.jpg", type: "image" },
  { src: "https://res.cloudinary.com/didymerkz/image/upload/v1777316930/crc_production_assets/crc4.jpg", type: "image" },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INITIAL_MEDIA.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {INITIAL_MEDIA.map((media, idx) => {
        const isCurrent = idx === currentIndex;
        const isVideo = media.type === "video";

        return (
          <div
            key={`${media.src}-${idx}`}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {isVideo ? (
               <video 
                 src={media.src}
                 poster={media.poster}
                 autoPlay
                 muted
                 loop
                 playsInline
                 preload="auto"
                 className="absolute inset-0 w-full h-full object-cover"
                 style={{ opacity: isCurrent ? 1 : 0, transition: 'opacity 2s ease-in-out' }}
               />
            ) : (
              <img 
                src={media.src} 
                alt="CRC Gallery" 
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: isCurrent ? 1 : 0, transition: 'opacity 2s ease-in-out' }}
              />
            )}
            <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
