import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Target, Lightbulb, HeartPulse } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export default function AboutPage() {
  return (
    <div className="bg-background pb-24">
      <PageHero 
        title="About CRC"
        subtitle="A peaceful destination for retreats, accommodation, meetings, celebrations, family relaxation, and memorable experiences."
        bgMediaUrl="/images/PEACEFUL.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* CORE VALUES & INFO */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-6 relative inline-block">
              Our Identity
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full" />
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Christian Retreat Centre is a premier destination built on the foundation of providing a serene, safe, and highly comfortable environment for our guests. Whether you are looking for a personal spiritual retreat, an executive business meeting, or a fun-filled family vacation, our facilities are tailored to give you an unforgettable experience.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-l-4 border-l-primary shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Target className="mr-3 text-primary h-6 w-6" /> Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">To create memorable experiences in a peaceful and excellent environment.</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-primary shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Lightbulb className="mr-3 text-primary h-6 w-6" /> Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">To become the leading retreat and hospitality center known for excellence and comfort.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CHAIRMAN'S MESSAGE */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
          <div className="md:w-2/5 relative min-h-[400px]">
            <img 
              src="/images/about.jpg" 
              alt="Pastor Ibrahim - Chairman" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="font-heading font-bold text-2xl tracking-wide">Pastor Ibrahim</p>
              <p className="text-primary-light">Chairman / Visionary</p>
            </div>
          </div>
          <div className="md:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
            <QuoteIcon className="text-primary/20 h-16 w-16 mb-6" />
            <h3 className="text-2xl font-bold font-heading mb-4 text-foreground">Message from the Chairman</h3>
            <div className="prose prose-lg text-gray-600">
              <p>
                Welcome to the Christian Retreat Centre. When we envisioned this facility, our primary goal was to create an oasis—a place where people can escape the noise of daily life and find true peace, comfort, and rejuvenation. 
              </p>
              <p>
                At CRC, excellence is our standard. Our dedicated team is committed to ensuring that every moment you spend with us is wonderful and inspiring. Whether you are here for a corporate event, a family getaway, or a spiritual retreat, know that this place was built for you.
              </p>
              <p className="font-semibold text-gray-800 mt-6">
                Thank you for choosing CRC. We look forward to hosting you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
    </svg>
  );
}
