import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import NavScrollIndicator from "./components/layout/NavScrollIndicator";
import { Providers } from "./providers";
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
        {/* Global Static Background Image */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/videos/desktop/bg-1-vid-poster.jpg")' }}
        />
        {/* Dark overlay for readability */}
        <div className="fixed inset-0 z-[1] bg-black/40 pointer-events-none" />

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
