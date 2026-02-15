"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // We might need to create this util or remove it if not used yet

// Navigation items matching UI mockup exactly
const navItems = [
    { name: "Landing Page", href: "/" },
    { name: "News & Publication Network", href: "/news" },
    { name: "The Porktocracy", href: "/porktocracy" },
    { name: "Proposals & Governance", href: "/governance" },
    { name: "Character Library & Brand Hub", href: "/character-library" },
    { name: "Documentation", href: "/documentation" },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-[66px] z-40 w-full transition-colors duration-300 ${isScrolled ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
                }`}
        >
            {/* Bottom Border Line - positioned absolute at bottom, lower Z-index */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <ul className="flex items-center gap-8 overflow-x-auto md:overflow-visible py-3 no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                        return (
                            <li key={item.name} className="shrink-0">
                                <Link
                                    href={item.href}
                                    className={`relative text-sm font-medium transition-colors hover:text-piggy-deep-pink ${isActive ? "text-piggy-deep-pink" : "text-white"
                                        }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <div className="absolute -bottom-[15px] left-0 h-[3px] w-full bg-piggy-deep-pink shadow-[0_0_10px_#ff2f7a] z-20" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
