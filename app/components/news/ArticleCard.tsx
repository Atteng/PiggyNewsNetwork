'use client';

import { Article } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps extends Article {
    variant?: 'standard' | 'featured';
    className?: string;
    index?: number;
}

export function ArticleCard({
    id,
    title,
    category,
    thumbnail,
    timeAgo,
    views,
    variant = 'standard',
    className,
    index = 0,
}: ArticleCardProps) {

    const isFeatured = variant === 'featured';
    const href = category === 'Proposal' ? `/governance/${id}` : `/news/${id}`;

    return (
        <Link href={href} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={cn(
                    "group relative overflow-hidden rounded-xl bg-black/40 border border-white/10 shadow-lg h-full flex flex-col",
                    "hover:shadow-[0_8px_30px_rgba(255,47,122,0.15)] hover:border-piggy-deep-pink/30 transition-shadow duration-300",
                    className
                )}
            >
                {/* Image Background */}
                <div className={cn(
                    "absolute inset-0 z-0",
                    isFeatured ? "h-full" : "h-full"
                )}>
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient Overlay - Stronger gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Hover Overlay - Additional darkening on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-5 flex flex-col h-full justify-between">

                    {/* Top: Category Badge */}
                    <div className="flex items-start justify-between">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md border uppercase tracking-wider",
                            "bg-white/10 text-white border-white/20 backdrop-blur-md"
                        )}>
                            {category}
                        </span>
                    </div>

                    {/* Bottom: Title & Metadata */}
                    <div className="mt-auto space-y-3">
                        <h3 className={cn(
                            "font-bold text-white leading-tight group-hover:text-piggy-deep-pink transition-colors text-sm"
                        )}>
                            {title}
                        </h3>

                        <div className="flex items-center gap-4 text-[10px] text-gray-300 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{timeAgo}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5" />
                                <span>{views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
