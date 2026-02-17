"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Sparkles, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAI } from "@/app/context/AIContext";

interface HeroProps {
    content?: {
        badgeText: string | null;
        headlineLine1: string | null;
        headlineLine2: string | null;
        headlineLine3: string | null;
        tagline: string | null;
    } | null;
}

export default function Hero({ content }: HeroProps) {
    const { openWithQuery } = useAI();
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        openWithQuery(input);
        setInput("");
    };

    // Default Fallbacks
    const badgeText = content?.badgeText || "The Source of Truth for PiggyDAO";
    const h1Lines = [
        content?.headlineLine1 || "The Art of",
        content?.headlineLine2 || "Financial",
        content?.headlineLine3 || "Independence"
    ];
    const tagline = content?.tagline || "Now fully documented and archived for your perusal";

    return (
        <section className="relative h-full w-full overflow-hidden flex flex-col justify-center">
            {/* Background handled globally in layout.tsx */}

            {/* Content */}
            <div className="relative z-10 flex h-full overflow-hidden flex-col justify-center pt-32 px-8 md:px-16 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl w-full flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                    {/* Badge - Keep "Source of Truth" (user likes this!) */}
                    <div className="mb-6 inline-flex items-center rounded-full border border-piggy-deep-pink/40 bg-black/40 px-4 py-1.5 text-xs font-medium text-piggy-deep-pink backdrop-blur-sm">
                        <Sparkles className="mr-2 h-3 w-3 text-piggy-deep-pink" />
                        <span>{badgeText}</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="mb-4 text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-[0_0_20px_rgba(251,108,200,0.6)]">
                        {h1Lines.map((line, i) => i === 0 || line ? <div key={i}>{line}</div> : null)}
                    </h1>

                    {/* Subheadline */}
                    <p className="mb-10 text-xs md:text-base font-light tracking-[0.2em] text-gray-200 uppercase font-mono max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                        {tagline}
                    </p>

                    {/* Hero Search Bar */}
                    <div className="relative w-full max-w-xl lg:max-w-3xl group mx-auto lg:mx-0">
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center rounded-full border border-piggy-deep-pink/30 bg-black/30 backdrop-blur-md overflow-hidden transition-colors hover:border-piggy-deep-pink/50 group-focus-within:border-piggy-deep-pink group-focus-within:ring-1 group-focus-within:ring-piggy-deep-pink max-w-full"
                        >
                            <Search className="ml-4 h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors shrink-0" />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask AI or search articles..."
                                className="flex-1 bg-transparent py-3 md:py-4 px-3 md:px-4 text-white placeholder-gray-400 focus:outline-none text-sm md:text-base min-w-0"
                            />
                            {/* Keyboard Shortcut Indicator - Hidden on mobile */}
                            <div className="hidden md:flex mr-3 items-center gap-1 rounded-md border border-gray-600 bg-black/40 px-2.5 py-1 text-xs font-medium text-gray-300 shrink-0">
                                <span>Ctrl</span>
                                <span className="text-gray-500">+</span>
                                <span>I</span>
                            </div>
                            {/* Arrow Submit Button */}
                            <button
                                type="submit"
                                className="mr-1 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-piggy-deep-pink transition-all hover:bg-piggy-light-pink hover:shadow-[0_0_15px_rgba(255,47,122,0.8)] shrink-0"
                            >
                                <ArrowUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
