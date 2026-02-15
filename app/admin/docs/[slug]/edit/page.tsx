import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocForm from "@/components/admin/DocForm";
import { prisma } from '@/lib/prisma';

interface EditDocPageProps {
    params: Promise<{ slug: string }>;
}

export default async function EditDocPage({ params }: EditDocPageProps) {
    const { slug } = await params;
    const doc = await prisma.docPage.findUnique({
        where: { slug },
    });

    if (!doc) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Edit Documentation</h2>
                <Link href="/admin/docs" className="text-sm text-white/50 hover:text-white">
                    &larr; Back to Docs
                </Link>
            </div>
            <DocForm initialData={doc} isEditing />
        </div>
    );
}
