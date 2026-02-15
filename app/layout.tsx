import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import { Providers } from "./providers";
import { VideoBackground } from "./components/common/VideoBackground";
import { AIAssistant } from "./components/ai/AIAssistant";
import { GlobalDocSidebar } from "./components/documentation/GlobalDocSidebar";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PNN | PiggyDAO",
  description: "Your source for PiggyDAO news and updates",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} antialiased font-mono bg-background text-foreground`}
      >
        {/* Global Video Background */}
        <VideoBackground
          desktopVideoWebm="/videos/desktop/bg-1-vid.webm"
          desktopVideoMp4="/videos/desktop/bg-1-vid.mp4"
          mobileVideoWebm="/videos/mobile/bg-1-vid.webm"
          mobileVideoMp4="/videos/mobile/bg-1-vid.mp4"
          posterDesktop="/videos/desktop/bg-1-vid-poster.jpg"
          posterMobile="/videos/mobile/bg-1-vid-poster.jpg"
          fallbackImage="/bg-1.jpg"
          overlay={true}
          overlayOpacity={0.4}
          className="z-0"
        />
        {/* Additional overlay gradient for readability - simplified to black tint at bottom */}
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

        <Providers>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <Navigation />
            <main className="flex-1 container mx-auto px-4 pb-0">
              {children}
            </main>
            <AIAssistant />
            <GlobalDocSidebar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
