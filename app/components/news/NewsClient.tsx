'use client';

import { CategorySidebar } from '@/app/components/news/CategorySidebar';
import { FeaturedSidebar } from '@/app/components/news/FeaturedSidebar';
import { NewsGrid } from '@/app/components/news/NewsGrid';
import { Category } from '@/lib/types'; // We might need to map Prisma types to this local type or update the local type
import { Menu } from 'lucide-react';
import { useState } from 'react';

// Define a type compatible with what we expect. 
// The Prisma 'Article' might differ slightly from our frontend 'Article' type.
// For now, let's assume we pass down the prisma result and map it, or use 'any'.
// To be safe/clean, we should update lib/types.ts to match Prisma or create a mapper.
// Let's use 'any' temporarily for the prop to unblock, but cast inside.

export default function NewsClient({ initialArticles }: { initialArticles: any[] }) {
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

    // Filter logic
    const filteredArticles = activeCategory === 'All'
        ? initialArticles
        : initialArticles.filter((a: any) => a.category === activeCategory);

    // Featured articles for sidebar - only Proposals
    // In a real app, we might fetch 'featured' specifically or 'proposals' specifically.
    // Here we filter from the main list for simplicity, similar to the mock logic.
    const sidebarArticles = initialArticles.filter((a: any) => a.category === 'Proposal').slice(0, 2);

    return (
        <div className="flex flex-col lg:flex-row gap-8">

            {/* Left Sidebar: Categories (Desktop) */}
            <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-28 bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <CategorySidebar
                        activeCategory={activeCategory}
                        onChange={setActiveCategory}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                {/* Mobile Category Selector - Now Collapsible */}
                <div className="lg:hidden">
                    <CategorySidebar
                        activeCategory={activeCategory}
                        onChange={setActiveCategory}
                    />
                </div>

                <div className="mb-6 flex items-center gap-2">
                    <Menu className="w-5 h-5 text-white" />
                    <h1 className="text-base font-bold text-white">News & Data</h1>
                </div>

                <NewsGrid articles={filteredArticles} />
            </div>

            {/* Right Sidebar: Featured (Desktop/Large Tablet) */}
            <div className="hidden xl:block w-96 shrink-0">
                <div className="sticky top-28">
                    <FeaturedSidebar articles={sidebarArticles} />
                </div>
            </div>

        </div>
    );
}
