'use client';

import { CategorySidebar } from '@/app/components/news/CategorySidebar';
import { Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ArticleDetailClient() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

    const handleCategoryChange = (category: Category | 'All') => {
        setActiveCategory(category);
        router.push(`/news?category=${category}`); // Navigate back to news with filter
    };

    return (
        <div className="sticky top-28 bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <CategorySidebar
                activeCategory={activeCategory}
                onChange={handleCategoryChange}
            />
        </div>
    );
}
