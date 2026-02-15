import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';
import { prisma } from '@/lib/prisma';
import { CornerDownRight } from 'lucide-react';

export default async function AdminDocsPage() {
    const docs = await prisma.docPage.findMany({
        orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }]
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Documentation</h2>
                <Link
                    href="/admin/docs/new"
                    className="px-4 py-2 bg-[var(--neon-pink)] text-black font-semibold rounded-full hover:bg-pink-400 transition-colors"
                >
                    + New Page
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white/60 font-medium">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Order</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {docs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white pl-4">
                                    {/* Visual nesting indicator if parentId exists */}
                                    {doc.parentId ? <CornerDownRight className="w-4 h-4 text-white/30 mr-2 inline-block" /> : ''}
                                    {doc.title}
                                </td>
                                <td className="p-4 text-white/70 font-mono text-xs">{doc.slug}</td>
                                <td className="p-4 text-white/70">{doc.category}</td>
                                <td className="p-4 text-white/70">{doc.orderIndex}</td>
                                <td className="p-4 text-right space-x-2">
                                    <Link href={`/admin/docs/${doc.slug}/edit`} className="text-blue-400 hover:underline">Edit</Link>
                                    <DeleteButton
                                        endpoint={`/api/docs/${doc.slug}`}
                                        resourceName="page"
                                    />
                                </td>
                            </tr>
                        ))}
                        {docs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-white/50">
                                    No documentation pages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
