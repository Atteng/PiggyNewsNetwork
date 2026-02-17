import { prisma } from '@/lib/prisma';
import NewsClient from '@/app/components/news/NewsClient';

// Revalidate every 60 seconds to reduce DB load
export const revalidate = 60;

async function getArticles() {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { publishedAt: 'desc' }, // or createdAt
            where: {
                status: 'published' // Only show published
            },
            include: {
                author: true
            }
        });

        // Map Prisma result to our Frontend 'Article' type if needed.
        // Our 'Article' type in lib/types.ts might expect 'thumbnail' vs 'thumbnailUrl', 'timeAgo' etc.
        // Let's do a light mapping here.
        return articles.map((a: any) => ({
            id: a.slug, // Frontend uses ID for routing, usually slug
            title: a.title,
            excerpt: a.excerpt || '',
            content: a.content || '',
            category: a.category,
            thumbnail: a.thumbnailUrl || '/api/placeholder/400/320', // Fallback
            author: {
                name: a.author?.name || 'PiggyDAO',
                avatar: a.author?.avatarUrl || '/api/placeholder/32/32'
            },
            // Calculate timeAgo roughly or use date
            timeAgo: new Date(a.createdAt).toLocaleDateString(),
            views: a.views.toString(),
            featured: a.featured
        }));

    } catch (error: any) {
        console.error("Database Error:", error);
        return [];
    }
}

export default async function NewsPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen relative">
            {/* Page-specific background - bg-2.jpg */}
            <div className="fixed inset-0 z-0 h-[100dvh]">
                <img
                    src="/bg-2.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
                <NewsClient initialArticles={articles} />
            </div>
        </div>
    );
}
