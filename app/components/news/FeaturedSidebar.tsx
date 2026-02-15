'use client';

import { Article } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { ArticleCard } from './ArticleCard';

interface FeaturedSidebarProps {
    articles: Article[];
    className?: string;
}

export function FeaturedSidebar({ articles, className }: FeaturedSidebarProps) {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className="flex items-center justify-between px-1 gap-4">
                <div className="flex items-center gap-2">
                    <Menu className="w-5 h-5 text-white shrink-0" />
                    <h2 className="text-base font-bold text-white leading-tight">
                        Latest Initiatives
                    </h2>
                </div>
                <Link
                    href="/governance"
                    className="text-xs font-medium text-piggy-deep-pink hover:text-white transition-colors flex items-center gap-1 shrink-0"
                >
                    See All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                {articles.map((article, index) => (
                    <div key={article.id} className="h-[280px]">
                        <ArticleCard
                            {...article}
                            variant="featured"
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
