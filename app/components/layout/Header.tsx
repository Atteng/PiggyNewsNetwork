"use client";

import React, { useEffect, useState } from "react";
import { Search, MessageSquare, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAI } from "@/app/context/AIContext";

// --- 3D Spinning Logo Component ---
function SpinningLogo() {
    return (
        <div className="relative h-10 w-10 [perspective:1000px] group cursor-pointer">
            <style jsx>{`
                @keyframes spin-cube {
                    from { transform: rotateY(0deg) rotateX(0deg); }
                    to { transform: rotateY(360deg) rotateX(0deg); }
                }
                .cube-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    animation: spin-cube 8s linear infinite;
                }
                .cube-face {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background-color: #ff2f7a; /* original pink */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.2);
                    backface-visibility: hidden; /* Optional: simpler render */
                }
                /* Faces */
                .face-front  { transform: rotateY(0deg) translateZ(20px); }
                .face-back   { transform: rotateY(180deg) translateZ(20px); }
                .face-right  { transform: rotateY(90deg) translateZ(20px); }
                .face-left   { transform: rotateY(-90deg) translateZ(20px); }
                .face-top    { transform: rotateX(90deg) translateZ(20px); background-color: #d1105a; }
                .face-bottom { transform: rotateX(-90deg) translateZ(20px); background-color: #d1105a; }
            `}</style>

            <div className="cube-wrapper">
                {/* Front */}
                <div className="cube-face face-front">
                    <Image src="/white-icon.png" alt="Logo" width={32} height={32} className="rounded-sm" />
                </div>
                {/* Back */}
                <div className="cube-face face-back">
                    <Image src="/white-icon.png" alt="Logo" width={32} height={32} className="rounded-sm" />
                </div>
                {/* Right */}
                <div className="cube-face face-right">
                    <Image src="/white-icon.png" alt="Logo" width={32} height={32} className="rounded-sm" />
                </div>
                {/* Left */}
                <div className="cube-face face-left">
                    <Image src="/white-icon.png" alt="Logo" width={32} height={32} className="rounded-sm" />
                </div>
                {/* Top & Bottom (Solid Color) */}
                <div className="cube-face face-top"></div>
                <div className="cube-face face-bottom"></div>
            </div>
        </div>
    );
}

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { toggle: toggleAI } = useAI();

    // useEffect only runs on the client, so now we can safely show the UI
    // Scroll detection for background change
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && (e.key === 'i' || e.key === 'I')) {
                e.preventDefault();
                toggleAI();
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [toggleAI]);

    // Prevent hydration mismatch by returning null or placeholder until mounted
    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 w-full border-b border-piggy-deep-pink/20 bg-transparent backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Placeholder content to maintain layout during hydration */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-piggy-deep-pink"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b border-white/30 transition-colors duration-300 ${isScrolled ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo Area - PNN in pink box */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <SpinningLogo />
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden flex-1 items-center justify-center px-8 md:flex">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="w-full rounded-full border border-piggy-deep-pink/30 bg-black/5 dark:bg-black/20 py-2 pl-10 pr-4 text-sm text-foreground dark:text-white placeholder-gray-400 focus:border-piggy-deep-pink focus:outline-none focus:ring-1 focus:ring-piggy-deep-pink transition-colors"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Ask AI Button */}
                    <button
                        onClick={toggleAI}
                        className="flex items-center gap-2 rounded-full bg-piggy-deep-pink px-4 py-2 text-sm font-medium text-white transition-all hover:bg-piggy-deep-pink/80 hover:shadow-[0_0_15px_rgba(255,47,122,0.5)]"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Ask AI</span>
                    </button>

                    {/* Goto Piggy Club Button */}
                    <button className="hidden sm:flex items-center gap-2 rounded-full bg-piggy-deep-pink px-4 py-2 text-sm font-medium text-white transition-all hover:bg-piggy-deep-pink/80 hover:shadow-[0_0_15px_rgba(255,47,122,0.5)]">
                        <span>Goto Piggy Club</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-foreground dark:text-gray-300 transition-colors hover:text-piggy-deep-pink"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
