"use client";

import { useState } from "react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  bgMediaUrl: string;
}

export function PageHero({ title, subtitle, bgMediaUrl }: PageHeroProps) {
  const isVideo = bgMediaUrl.match(/\.(mp4|mov|webm|mov)$/i);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="relative h-[45vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-slate-950">
        {isVideo ? (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url(${bgMediaUrl.replace(/\.(mp4|mov|webm|mov)$/i, '.jpg')})` }}
          >
            <video
              src={bgMediaUrl.replace('/upload/', '/upload/q_auto,f_auto,br_auto/')}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        ) : (
          <img
            src={bgMediaUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white font-medium drop-shadow-lg text-balance">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
