import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Chatbot } from "@/components/ui/Chatbot";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Christian Retreat Centre (CRC) | Making your experience wonderful",
  description: "CRC is a peaceful destination for retreats, accommodation, meetings, celebrations, family relaxation, spiritual gatherings, and memorable experiences in Lagos, Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col font-sans tracking-tight text-foreground bg-background">
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W4CQ8TC4');
          `}
        </Script>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W4CQ8TC4"
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <Chatbot />
      </body>
    </html>
  );
}
