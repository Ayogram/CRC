"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Check, Users, Maximize, X } from "lucide-react";

export function AccommodationClient({ 
  initialRooms, 
  initialDormitories, 
  initialFacilities 
}: { 
  initialRooms: any[], 
  initialDormitories: any[], 
  initialFacilities: any[] 
}) {
  const [selectedLightboxVideo, setSelectedLightboxVideo] = useState<string | null>(null);

  // Map room name to its hardcoded video path if not found in DB relations yet
  // This is a safety bridge for the migration
  const getRoomMedia = (roomName: string) => {
    const mapping: Record<string, string> = {
      "Goshen Ultra": "https://res.cloudinary.com/didymerkz/video/upload/q_auto,f_auto/v1777317041/crc_production_assets/goshen_ultra.mp4",
      "Bethel": "https://res.cloudinary.com/didymerkz/video/upload/q_auto,f_auto/v1777317599/crc_production_assets/Bethel.mp4",
      "Zion Signature": "https://res.cloudinary.com/didymerkz/video/upload/q_auto,f_auto/v1777318481/crc_production_assets/Zionssignature.mp4",
      "Beulah": "https://res.cloudinary.com/didymerkz/video/upload/q_auto,f_auto/v1777320915/crc_production_assets/Beulah.mp4",
      "Rehoboth": "https://res.cloudinary.com/didymerkz/video/upload/q_auto,f_auto/v1777321464/crc_production_assets/Rehoboth.mp4"
    };
    return mapping[roomName] || "/images/placeholder.jpg";
  };

  const VideoPreview = ({ url, alt, onClick, offset = "so_3" }: { url: string, alt: string, onClick?: () => void, offset?: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    // Better regex to handle query parameters
    // Use the provided offset for an "attracting" preview frame
    const placeholder = url.split('?')[0].replace('/upload/', `/upload/${offset}/`).replace(/\.(mp4|mov|webm|mov)$/i, '.jpg');

    return (
      <div 
        className="relative w-full h-full cursor-pointer group/video overflow-hidden bg-slate-200"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={placeholder} 
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 group-hover/video:bg-black/40">
          <div className="bg-white/90 backdrop-blur rounded-full p-4 shadow-2xl transform transition-all duration-300 group-hover/video:scale-110 group-hover/video:bg-primary group-hover/video:text-white">
            <Maximize className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Video Preview
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ROOMS SECTION */}
      <section>
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-3 flex items-center">
            <span className="bg-primary w-2 h-8 mr-4 rounded-full inline-block"></span> Premium Rooms
          </h2>
          <p className="text-gray-500 text-lg">Indulge in comfort with our exclusive private suites.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {initialRooms.map((room) => {
            const mediaUrl = getRoomMedia(room.name);
            const isVideo = mediaUrl.match(/\.(mp4|mov|webm)$/i);
            // Custom offsets for better previews on specific rooms
            const customOffset = room.name.includes("Goshen") ? "so_22" : room.name.includes("Zion") ? "so_10" : "so_3";
            
            return (
              <Card key={room.id || room.name} className="overflow-hidden flex flex-col group border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-[2rem]">
                <div className="relative h-72 overflow-hidden bg-slate-100">
                  {isVideo ? (
                    <VideoPreview url={mediaUrl} alt={room.name} onClick={() => setSelectedLightboxVideo(mediaUrl)} offset={customOffset} />
                  ) : (
                    <img src={mediaUrl} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary-dark font-bold tracking-tight">{room.name}</CardTitle>
                  <CardDescription className="text-base mt-2 leading-relaxed">{room.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-300 mb-4 px-1">Room Amenities</h4>
                  <ul className="grid grid-cols-2 gap-3">
                    {room.amenities.map((item: string, i: number) => (
                      <li key={i} className="flex items-center text-sm text-slate-600 font-medium">
                        <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 border-t border-slate-50 bg-slate-50/30">
                  <Button className="w-full h-12 rounded-xl bg-[#8DC63F] hover:bg-[#7db137] text-white font-bold shadow-md" asChild>
                    <a href={`https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(room.name)}%20at%20Christian%20Retreat%20Centre.%20Please%20share%20availability%20and%20price.`} target="_blank" rel="noopener noreferrer">
                      Book on WhatsApp
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* DORMITORIES SECTION */}
      <section className="mt-24">
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-3 flex items-center">
            <span className="bg-primary-dark w-2 h-8 mr-4 rounded-full inline-block"></span> Group Dormitories
          </h2>
          <p className="text-gray-500 text-lg">Perfectly organized, spacious, and secure group lodgings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {initialDormitories.map((dorm) => {
            let mediaUrl = dorm.mediaUrls?.[0] || (dorm.name.includes("12") ? "https://res.cloudinary.com/didymerkz/video/upload/q_auto,f_auto/v1777321591/crc_production_assets/12beddom.mp4" : "https://res.cloudinary.com/didymerkz/video/upload/q_auto,f_auto/v1778717799/crc_production_assets/24beddom.mp4");
            if (mediaUrl.includes('res.cloudinary.com')) {
               mediaUrl = mediaUrl.replace('/upload/', '/upload/q_auto,f_auto/');
            }
            const isVideo = mediaUrl.match(/\.(mp4|mov|webm)$/i);

            return (
              <div key={dorm.id || dorm.name} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500">
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-slate-900">
                  {isVideo ? (
                    <VideoPreview url={mediaUrl} alt={dorm.name} onClick={() => setSelectedLightboxVideo(mediaUrl)} />
                  ) : (
                    <img src={mediaUrl} alt={dorm.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center text-[10px] font-black text-primary uppercase tracking-widest shadow-lg">
                    <Users className="h-3 w-3 mr-2" /> {dorm.capacity} Beds
                  </div>
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-2xl font-bold font-heading text-slate-900 mb-4">{dorm.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{dorm.description}</p>
                    
                    <div className="space-y-4 mb-10">
                      <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-slate-300">Specifications</h4>
                      <ul className="grid grid-cols-1 gap-3">
                        {(dorm.details || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start text-sm text-slate-600 font-medium">
                            <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
                    <Button className="flex-1 h-12 rounded-xl bg-[#8DC63F] hover:bg-[#7db137] text-white font-bold shadow-md" asChild>
                      <a href={`https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(dorm.name)}.%20Please%20share%20details.`} target="_blank" rel="noopener noreferrer">
                        Book on WhatsApp
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50" asChild>
                       <a href={`https://wa.me/2349069168041?text=Inquiry%20about%20${encodeURIComponent(dorm.name)}`} target="_blank">Enquire Now</a>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FACILITIES SECTION */}
      <section>
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-3 flex items-center">
            <span className="bg-primary-light w-2 h-8 mr-4 rounded-full inline-block"></span> Our Facilities
          </h2>
          <p className="text-gray-500 text-lg">World-class amenities to compliment your stay and event needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialFacilities.map((fac) => {
            const mediaUrl = fac.mediaUrls?.[0] || "/images/placeholder.jpg";
            const isVideo = mediaUrl.match(/\.(mp4|mov|webm)$/i);
            const isLightboxOpenable = isVideo || mediaUrl.includes("playground");

            return (
              <Card key={fac.id || fac.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div 
                  className={`relative h-56 overflow-hidden rounded-t-xl ${isLightboxOpenable ? "cursor-pointer group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-black/20" : ""}`}
                  onClick={() => isLightboxOpenable && isVideo ? setSelectedLightboxVideo(mediaUrl) : null}
                >
                  {isVideo ? (
                    <div className="w-full h-full">
                      <VideoPreview url={mediaUrl} alt={fac.name} onClick={() => setSelectedLightboxVideo(mediaUrl)} />
                    </div>
                  ) : (
                    <img src={mediaUrl} alt={fac.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-black/10 p-6 flex flex-col justify-end pointer-events-none">
                    <h3 className="text-xl font-bold text-white mb-1 font-heading drop-shadow-lg">{fac.name}</h3>
                  </div>
                  {isLightboxOpenable && (
                     <div className="absolute top-4 right-4 bg-primary/90 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Maximize className="h-4 w-4" />
                     </div>
                  )}
                </div>
                <CardContent className="pt-4 flex-grow">
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{fac.description}</p>
                  <ul className="space-y-1.5 mb-2">
                    {(fac.details || []).slice(0, 4).map((detail: string, i: number) => (
                      <li key={i} className="flex items-center text-xs text-slate-600">
                        <Check className="h-3 w-3 text-primary mr-2 flex-shrink-0" /> {detail}
                      </li>
                    ))}
                    {(fac.details || []).length > 4 && (
                      <li className="text-[10px] text-primary font-bold uppercase tracking-tighter pl-5">+ More Features</li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0 flex flex-col gap-2">
                  <Button className="w-full h-12 rounded-xl bg-[#8DC63F] hover:bg-[#7db137] text-white font-bold shadow-md" asChild>
                     <a href={`https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20reserve%20the%20${encodeURIComponent(fac.name)}.%20Kindly%20assist%20me.`} target="_blank" rel="noopener noreferrer">
                      Book on WhatsApp
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full text-xs h-8 text-slate-400 hover:text-primary" onClick={() => isLightboxOpenable && isVideo ? setSelectedLightboxVideo(mediaUrl) : null}>
                    View Full Details & Video
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedLightboxVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
            onClick={() => setSelectedLightboxVideo(null)}
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-5xl w-full">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
                <video 
                  src={selectedLightboxVideo.replace('/upload/', '/upload/q_auto,f_auto/')} 
                  poster={selectedLightboxVideo.replace('/upload/', '/upload/so_3/').replace(/\.(mp4|mov|webm|mov)$/i, '.jpg')}
                  autoPlay 
                  loop 
                  muted={!selectedLightboxVideo.includes("playground")}
                  controls
                  playsInline 
                  preload="auto"
                  className="w-full h-full object-contain relative z-10"
                  ref={(el) => {
                    if (el) {
                      el.muted = !selectedLightboxVideo.includes("playground");
                    }
                  }}
                  onLoadedData={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.style.opacity = "1";
                  }}
                />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
