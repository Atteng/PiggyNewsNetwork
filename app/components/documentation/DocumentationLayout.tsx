'use client';

import { DocNavItem } from '@/lib/types';
import { DocSidebar } from './DocSidebar';
import { TableOfContents } from './TableOfContents';
import { TocItem } from '@/lib/markdownUtils';
import { useEffect } from 'react';
import { LayoutGrid, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useDocContext } from '@/app/context/DocSidebarContext';

interface DocumentationLayoutProps {
    children: React.ReactNode;
    navigation: DocNavItem[];
    activePageId?: string; // Optional now, as page sets it
}

export function DocumentationLayout({ children, navigation, activePageId }: DocumentationLayoutProps) {
    const { isOpen, setIsOpen, setNavigation, setActivePageId, headings } = useDocContext();

    // Update context when props change (initial load)
    useEffect(() => {
        setNavigation(navigation);
        if (activePageId) setActivePageId(activePageId);
    }, [navigation, activePageId, setNavigation, setActivePageId]);

    return (
        <div className="min-h-screen h-full pt-24 pb-20 relative">
            {/* Page-specific background - bg-2.jpg */}
            <div className="fixed inset-0 z-[-1]">
                <Image
                    src="/bg-2.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                    quality={100}
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 relative z-10">

                {/* Mobile Categories Trigger */}
                <div className="lg:hidden px-4 mb-6 sticky top-[80px] z-30">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between bg-[#1a0f0f]/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white font-medium shadow-lg transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="w-5 h-5 text-piggy-deep-pink" />
                            <span>Categories</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <DocSidebar navigation={navigation} activePageId={activePageId || ''} />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {children}
                    </AnimatePresence>
                </main>

                {/* Right Sidebar (TOC) - Reads headings from Context now */}
                <aside className="hidden xl:block w-64 shrink-0 sticky top-32 h-[calc(100vh-10rem)]">
                    <TableOfContents headings={headings} />
                </aside>
            </div>
        </div>
    );
}
