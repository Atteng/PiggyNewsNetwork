'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { VideoBackground } from '@/app/components/common/VideoBackground';

export default function NotFound() {
    return (
        <div className="min-h-screen relative flex items-center justify-center">
            {/* Video Background - Responsive */}
            <VideoBackground
                desktopVideoWebm="/videos/desktop/404-vid.webm"
                desktopVideoMp4="/videos/desktop/404-vid.mp4"
                mobileVideoWebm="/videos/mobile/404-vid.webm"
                mobileVideoMp4="/videos/mobile/404-vid.mp4"
                posterDesktop="/videos/desktop/404-vid-poster.jpg"
                posterMobile="/videos/mobile/404-vid-poster.jpg"
                fallbackImage="/404.jpg"
                overlayOpacity={0.6}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto -translate-y-[30%] md:translate-y-0">
                {/* 404 Text */}
                <div className="mb-4 md:mb-8">
                    <h1 className="text-[80px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff2f7a] to-[#ff6b9d] leading-none">
                        404
                    </h1>
                    <div className="text-xl md:text-4xl font-bold text-white mb-2 md:mb-4">
                        Oink! This Piggy Got Lost
                    </div>
                    <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-8">
                        The page you're looking for seems to have wandered off to the piggy bank.
                        Let's get you back on track!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-0">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#ff2f7a] hover:bg-[#ff4589] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff2f7a]/50 text-sm md:text-base"
                    >
                        <Home className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-0.5 transition-transform" />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm text-sm md:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
                    <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4">Or explore these popular pages:</p>
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        <Link
                            href="/news"
                            className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-xs md:text-sm transition-colors border border-white/10"
                        >
                            News
                        </Link>
                        <Link
                            href="/governance"
                            className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-xs md:text-sm transition-colors border border-white/10"
                        >
                            Governance
                        </Link>
                        <Link
                            href="/porktocracy"
                            className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-xs md:text-sm transition-colors border border-white/10"
                        >
                            Porktocracy
                        </Link>
                        <Link
                            href="/docs"
                            className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-xs md:text-sm transition-colors border border-white/10"
                        >
                            Documentation
                        </Link>
                    </div>
                </div>

                {/* Fun Pig ASCII Art - Hidden on mobile */}
                <div className="mt-8 md:mt-12 text-[#ff2f7a]/30 font-mono text-xs hidden md:block">
                    <pre>{`
    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/'\_   _/\`\\
\\___)=(___/
                    `}</pre>
                </div>
            </div>
        </div>
    );
}
