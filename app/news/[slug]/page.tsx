import { CategorySidebar } from '@/app/components/news/CategorySidebar';
import { FeaturedSidebar } from '@/app/components/news/FeaturedSidebar';
import { prisma } from '@/lib/prisma';
import { Category } from '@/lib/types'; // Update types if needed
import { Clock, Eye, User, Calendar, ArrowLeft, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleDetailClient from '../../components/news/ArticleDetailClient';

// Force dynamic rendering if we want view counts to be live, or ISR.
// For now, dynamic is safest.
export const dynamic = 'force-dynamic';

async function getArticle(slug: string) {
    try {
        const article = await prisma.article.findUnique({
            where: { slug },
            include: { author: true }
        });

        if (!article) return null;

        // Map to frontend type
        return {
            id: article.slug,
            title: article.title,
            excerpt: article.excerpt || '',
            content: article.content || '',
            category: article.category,
            thumbnail: article.thumbnailUrl || '/api/placeholder/400/320',
            author: {
                name: article.author?.name || 'PiggyDAO',
                avatar: article.author?.avatarUrl || '/api/placeholder/32/32'
            },
            timeAgo: new Date(article.createdAt).toLocaleDateString(),
            views: article.views.toString(),
            featured: article.featured
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getFeaturedArticles(currentSlug: string) {
    // Fetch 2 latest proposals excluding current
    try {
        const articles = await prisma.article.findMany({
            where: {
                category: 'Proposal',
                slug: { not: currentSlug },
                status: 'published'
            },
            orderBy: { createdAt: 'desc' },
            take: 2
        });

        return articles.map((a: any) => ({
            id: a.slug,
            title: a.title,
            excerpt: a.excerpt || '',
            content: a.content || '',
            category: a.category,
            thumbnail: a.thumbnailUrl || '/api/placeholder/400/320',
            author: { name: 'DAO' }, // minimal
            timeAgo: new Date(a.createdAt).toLocaleDateString(),
            views: a.views.toString(),
            featured: a.featured
        }));
    } catch (e) {
        return [];
    }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);
    const sidebarArticles = await getFeaturedArticles(slug);

    if (!article) {
        // Option: Show custom 404 or use Next.js notFound()
        // The mock implementation showed a "not found" article state.
        // notFound() is more standard.
        notFound();
    }

    // Increment view count (fire and forget, server side)
    // We can do this here without awaiting
    prisma.article.update({
        where: { slug },
        data: { views: { increment: 1 } }
    }).catch((e: any) => console.error("Failed to increment view", e));

    return (
        <div className="min-h-screen relative">
            {/* Page Background */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/bg-2.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR - Reused via Client Wrapper for navigation */}
                    <div className="hidden lg:block w-64 shrink-0">
                        {/* We can pass initial active category or just let it default to All/Current */}
                        <ArticleDetailClient />
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">

                        {/* Mobile Header / Breadcrumb */}
                        <div className="lg:hidden mb-6 flex items-center justify-between bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 text-white/70">
                                <Menu className="w-5 h-5" />
                                <span className="text-sm font-medium">Categories</span>
                            </div>
                            <Link href="/news" className="text-sm text-piggy-deep-pink font-medium">
                                Back to News
                            </Link>
                        </div>

                        <article className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">

                            {/* Hero Image Section */}
                            <div className="relative w-full h-[300px] md:h-[400px]">
                                <Image
                                    src={article.thumbnail}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Metadata Row (Pink Accents) */}
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-sm font-mono">
                                    <span className="text-piggy-deep-pink font-bold uppercase tracking-wider">
                                        {article.category}
                                    </span>
                                    <span className="text-piggy-deep-pink font-bold">
                                        {article.timeAgo}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl md:text-4xl font-bold text-white mb-8 leading-[0.95]">
                                    {article.title}
                                </h1>

                                {/* Body Content */}
                                <div className="space-y-6 text-gray-300 text-base leading-relaxed font-light whitespace-pre-wrap">
                                    {article.content}
                                </div>

                            </div>
                        </article>

                    </div>

                    {/* RIGHT SIDEBAR - Reused */}
                    <div className="hidden xl:block w-96 shrink-0">
                        <div className="sticky top-28">
                            {/* FeaturedSidebar expects 'articles' prop which is compatible */}
                            {/* @ts-ignore - types mismatch slightly between prisma/frontend but compatible at runtime */}
                            <FeaturedSidebar articles={sidebarArticles} />
                        </div>
                    </div>

                </div>

                {/* Mobile Featured Section */}
                <div className="mt-12 xl:hidden">
                    {/* @ts-ignore */}
                    <FeaturedSidebar articles={sidebarArticles} />
                </div>

            </div>
        </div>
    );
}
