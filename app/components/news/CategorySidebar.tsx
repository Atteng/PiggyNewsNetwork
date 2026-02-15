'use client';

import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { useState } from 'react';

interface CategorySidebarProps {
    activeCategory: Category | 'All';
    onChange: (category: Category | 'All') => void;
    className?: string;
}

const categories: (Category | 'All')[] = [
    'All',
    'Proposal',
    'Temp Check',
    'General',
    'Marketing',
    'Operations',
];

export function CategorySidebar({ activeCategory, onChange, className }: CategorySidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={cn("flex flex-col", className)}>
            {/* Mobile Header - Click to Toggle */}
            {/* Mobile Header - Click to Toggle */}
            <div className="lg:hidden mb-4 sticky top-[80px] z-30">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between bg-[#3d1f1f]/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white font-medium shadow-lg transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-piggy-deep-pink" />
                        <span>Categories</span>
                    </div>
                    <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Desktop Header - Always Visible */}
            <div className="hidden lg:flex items-center gap-2 text-white px-4 mb-2">
                <LayoutGrid className="w-4 h-4" />
                <span className="font-bold text-base tracking-wide">Categories</span>
            </div>

            {/* Navigation List - Collapsible on Mobile, Always Visible on Desktop */}
            <nav className={cn(
                "flex flex-col overflow-hidden transition-all duration-300 ease-in-out lg:!h-auto lg:!opacity-100",
                isExpanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
            )}>
                {categories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => {
                                onChange(category);
                                setIsExpanded(false); // Close on selection for mobile
                            }}
                            className={cn(
                                "relative text-left px-4 py-2 transition-all duration-300 group",
                                isActive
                                    ? "text-piggy-deep-pink font-bold"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-piggy-deep-pink shadow-[0_0_10px_#ff2f7a]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}

                            <span className="relative z-10 text-sm">{category}</span>

                            {/* Hover Background */}
                            <div className={cn(
                                "absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 -z-0",
                                !isActive && "group-hover:opacity-100"
                            )} />
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
