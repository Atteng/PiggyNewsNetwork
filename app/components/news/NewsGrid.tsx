'use client';

import { Article } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import { Search } from 'lucide-react';

interface NewsGridProps {
    articles: Article[];
    isLoading?: boolean;
    className?: string;
}

export function NewsGrid({ articles, isLoading, className }: NewsGridProps) {

    if (isLoading) {
        return (
            <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", className)}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[320px] rounded-xl bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-white/50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                <p className="text-gray-400">Try selecting a different category.</p>
            </div>
        );
    }

    return (
        <motion.div
            layout
            className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[320px]", className)}
        >
            <AnimatePresence mode='popLayout'>
                {articles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        {...article}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
