import { Article } from '@prisma/client';
import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';

async function getArticles(): Promise<any[]> {
    // In a server component, we can call DB directly or fetch API using absolute URL if needed.
    // Calling DB directly is often preferred in Server Components to avoid HTTP overhead.
    // But let's use the API pattern for consistency if we want.
    // Actually, importing prisma directly is better for Server Components.

    const { prisma } = await import('@/lib/prisma');

    try {
        return await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: true }
        }) as any; // Cast for now as include changes the type
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function AdminArticlesPage() {
    const articles = await getArticles();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Articles</h2>
                <Link
                    href="/admin/articles/new"
                    className="px-4 py-2 bg-[var(--neon-pink)] text-white font-semibold rounded-full hover:bg-pink-400 transition-colors"
                >
                    + New Article
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white/60 font-medium">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{article.title}</td>
                                <td className="p-4 text-white/70">
                                    <span className="px-2 py-1 rounded-md bg-white/10 text-xs">
                                        {article.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td className="p-4 text-white/70">{article.author?.name || 'Unknown'}</td>
                                <td className="p-4 text-white/50">{new Date(article.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right space-x-2">
                                    <Link href={`/admin/articles/${article.id}/edit`} className="text-blue-400 hover:underline">Edit</Link>
                                    <DeleteButton
                                        endpoint={`/api/articles/${article.slug}`}
                                        resourceName="article"
                                    />
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-white/50">
                                    No articles found. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
