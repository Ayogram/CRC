"use client";

interface PageHeroProps {
  title: string;
  subtitle: string;
  bgMediaUrl: string;
}

export function PageHero({ title, subtitle, bgMediaUrl }: PageHeroProps) {
  const isVideo = bgMediaUrl.match(/\.(mp4|mov|webm|mov)$/i);

  return (
    <section className="relative h-[45vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            src={bgMediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={bgMediaUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 text-balance">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
