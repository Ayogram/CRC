"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

// Social SVGs
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
const TikTokIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>);


export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    // Lazy import the server action since we added "use client"
    const { submitContactForm } = await import("@/app/actions/contact");
    const formData = new FormData(e.currentTarget);
    
    const res = await submitContactForm(formData);
    if (res.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(res.error || "Something went wrong.");
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="bg-background min-h-screen">
      <PageHero 
        title="Contact Us"
        subtitle="We’re here to help you plan your stay, retreat, or event with ease."
        bgMediaUrl="/images/crcvid.mov"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* CONTACT INFO */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-heading mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our dedicated team is always ready to assist you. Whether you want to book a room, reserve a hall, or ask questions about our retreat programs, contact us today.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Our Location</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    1, CRC Close, End of Ago-Iwoye Street,<br /> 
                    Off Isawo Road, Agric Bus-Stop,<br /> 
                    Owutu, Ikorodu, Lagos State, Nigeria
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone / WhatsApp</h3>
                  <p className="text-gray-600 text-sm">
                    <a href="https://wa.me/2349069168041" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      09069168041
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email Address</h3>
                  <p className="text-gray-600 text-sm">
                    <a href="mailto:christianretreatcentrelagos@gmail.com" className="hover:text-primary transition-colors">
                      christianretreatcentrelagos@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://web.facebook.com/crcikorodu" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-primary hover:text-white text-gray-500 p-3 rounded-full transition-colors flex items-center justify-center h-12 w-12">
                  <FacebookIcon />
                </a>
                <a href="https://www.instagram.com/crcikorodu?igsh=MTI1dHU4NHZzYjYxMA==" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-primary hover:text-white text-gray-500 p-3 rounded-full transition-colors flex items-center justify-center h-12 w-12">
                  <InstagramIcon />
                </a>
                <a href="https://www.tiktok.com/@christianretreatcentre?_r=1&_d=emh06fb3a909l5&sec_uid=MS4wLjABAAAAi7_XdoTqzvPx19GwPa777fBpb6rql3rX-Ma2MAF07D2elokj__B6exkZ6PDyr3On&share_author_id=7368176337934992389&sharer_language=en&source=h5_m&u_code=e9k77b6gkd3k91&item_author_type=2&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=224E7501-E477-4EB8-ACFD-E93733920EA5&user_id=7273100360154907654&sec_user_id=MS4wLjABAAAA__DHEKnHmlYRMFSu25QoC2xFSs1KVSpfLlTy6UKjqwBM6YFNXjzZWajNIRels4T0&social_share_type=5&ug_btm=b6880,b5836&utm_campaign=client_share&share_app_id=1233" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-primary hover:text-white text-gray-500 p-3 rounded-full transition-colors flex items-center justify-center h-12 w-12">
                  <TikTokIcon />
                </a>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold font-heading mb-8">Send Us A Message</h2>
                {success ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center my-6">
                    <h3 className="font-bold mb-2">Message Sent Successfully!</h3>
                    <p className="text-sm">Thank you for reaching out. We will get back to you shortly.</p>
                    <Button className="mt-4" onClick={() => setSuccess(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {errorMsg && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {errorMsg}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          id="name" 
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          id="email" 
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
                          placeholder="john@example.com" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        name="phone"
                        id="phone" 
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
                        placeholder="+234 900 000 0000" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                      <textarea 
                        name="message"
                        id="message" 
                        rows={5} 
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-y" 
                        placeholder="How can we help you?" 
                        required 
                      ></textarea>
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto mt-4 px-8" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"} {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

        {/* MAP */}
        <div className="mt-24 h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15852.138!2d3.4358!3d6.6433!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bea66870da157%3A0x6b44ab53fb89f2a4!2sChristian%20Retreat%20Centre%2C%20CRC!5e0!3m2!1sen!2sng!4v1715424560731!5m2!1sen!2sng" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="CRC Location Map"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
