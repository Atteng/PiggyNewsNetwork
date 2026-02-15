import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleForm from "@/components/admin/ArticleForm";
import { prisma } from '@/lib/prisma';

interface EditArticlePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const { id } = await params;
    const article = await prisma.article.findUnique({
        where: { id },
    });

    if (!article) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Edit Article</h2>
                <Link href="/admin/articles" className="text-sm text-white/50 hover:text-white">
                    &larr; Back to Articles
                </Link>
            </div>
            <ArticleForm initialData={article} isEditing />
        </div>
    );
}
