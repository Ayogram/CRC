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
      "Goshen Ultra": "/images/goshen_ultra.mp4",
      "Bethel": "/images/Bethel.MOV",
      "Zion Signature": "/images/Zionssignature.mov",
      "Beulah": "/images/Beulah.MOV",
      "Rehoboth": "/images/Rehoboth .mov"
    };
    return mapping[roomName] || "/images/placeholder.jpg";
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
            
            return (
              <Card key={room.id || room.name} className="overflow-hidden flex flex-col group border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-72 overflow-hidden">
                  {isVideo ? (
                    <video key={mediaUrl} autoPlay loop muted playsInline src={mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <img src={mediaUrl} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary-dark">{room.name}</CardTitle>
                  <CardDescription className="text-base mt-2">{room.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Amenities</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {room.amenities.map((item: string, i: number) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4 border-t border-gray-100 bg-gray-50/50">
                  <Button className="w-full text-md h-12" asChild>
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
      <section>
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-3 flex items-center">
            <span className="bg-primary-dark w-2 h-8 mr-4 rounded-full inline-block"></span> Group Dormitories
          </h2>
          <p className="text-gray-500 text-lg">Perfectly organized, spacious, and secure group lodgings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {initialDormitories.map((dorm) => {
            const mediaUrl = dorm.mediaUrls?.[0] || (dorm.name.includes("12") ? "/images/12beddom.MOV" : "/images/24beddom.MOV");
            const isVideo = mediaUrl.match(/\.(mp4|mov|webm)$/i);

            return (
              <div key={dorm.id || dorm.name} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row group hover:shadow-xl transition-shadow">
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                  {isVideo ? (
                    <video key={mediaUrl} autoPlay loop muted playsInline src={mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <img src={mediaUrl} alt={dorm.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center text-sm font-bold text-gray-700">
                    <Users className="h-4 w-4 mr-2" /> {dorm.capacity} Beds
                  </div>
                </div>
                <div className="md:w-3/5 p-6 flex flex-col justify-between bg-slate-50/30">
                  <div>
                    <h3 className="text-2xl font-bold font-heading text-foreground mb-3">{dorm.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">{dorm.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Specifications</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {(dorm.details || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start text-sm text-slate-700">
                            <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-primary-dark hover:bg-black" asChild>
                      <a href={`https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(dorm.name)}.%20Please%20share%20details.`} target="_blank" rel="noopener noreferrer">
                        Book Now
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                       <a href={`https://wa.me/2349069168041?text=Inquiry%20about%20${encodeURIComponent(dorm.name)}`} target="_blank">WhatsApp Inquiry</a>
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
                    <video key={mediaUrl} autoPlay loop muted playsInline src={mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <img src={mediaUrl} alt={fac.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                    <h3 className="text-xl font-bold text-white mb-1 font-heading">{fac.name}</h3>
                  </div>
                  {isLightboxOpenable && (
                     <div className="absolute top-4 right-4 bg-primary/90 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Maximize className="h-4 w-4" />
                     </div>
                  )}
                </div>
                <CardContent className="pt-4 flex-grow">
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 italic">{fac.description}</p>
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
                  <Button className="w-full" asChild>
                     <a href={`https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20reserve%20the%20${encodeURIComponent(fac.name)}.%20Kindly%20assist%20me.`} target="_blank" rel="noopener noreferrer">
                      Book Hall
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
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                <video 
                  src={selectedLightboxVideo} 
                  autoPlay 
                  loop 
                  controls
                  playsInline 
                  className="w-full h-full object-contain"
                />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
