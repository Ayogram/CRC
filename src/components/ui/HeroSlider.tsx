"use client";

import { useState, useEffect } from "react";

const mediaAssets = [
  { src: "/images/crcvid.mov", type: "video" },
  { src: "/images/crc1.jpg", type: "image" },
  { src: "/images/crc2.jpg", type: "image" },
  { src: "/images/crc3.jpg", type: "image" },
  { src: "/images/crc4.jpg", type: "image" },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaAssets.length);
    }, 5000); // Change media every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {mediaAssets.map((media, idx) => (
        <div
          key={media.src}
          className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out transform ${
            idx === currentIndex 
              ? "opacity-60 scale-105 z-10" 
              : "opacity-0 scale-100 z-0"
          }`}
        >
          {media.type === "video" ? (
             <video 
               src={media.src}
               autoPlay
               muted
               loop
               playsInline
               className="w-full h-full object-cover"
             />
          ) : (
            <img 
              src={media.src} 
              alt="CRC Gallery" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-20" />
    </div>
  );
}
