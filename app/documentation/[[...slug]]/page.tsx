import { prisma } from '@/lib/prisma';
import { extractHeadings } from '@/lib/markdownUtils';
import { notFound, redirect } from 'next/navigation';
import DocContentClient from '@/app/components/documentation/DocContentClient';
import { DocPage } from '@/lib/types';

export default async function DocumentationPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;

    // 1. Handle Root /documentation -> Redirect to first page (order by category, index)
    if (!slug || slug.length === 0) {
        const firstPage = await prisma.docPage.findFirst({
            orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }]
        });

        if (firstPage) {
            redirect(`/documentation/${firstPage.category}/${firstPage.slug}`);
        } else {
            // Fallback if DB is empty
            return (
                <div className="flex items-center justify-center h-[50vh] text-white/50">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">No Documentation Found</h1>
                        <p>Please log in to the admin dashboard to add content.</p>
                    </div>
                </div>
            );
        }
    }

    // 2. Find page based on slug
    // URL structure: /documentation/[category]/[slug]

    let doc;

    if (slug.length >= 2) {
        // We have category and slug.
        // Actually, our routes define [[...slug]].
        // So params.slug is an array.
        // slug[0] = category, slug[1] = pageSlug
        // Note: Category in DB might have spaces "Getting Started", URL "Getting%20Started".
        // Decode URI component just in case, though Next.js handles it.
        const category = decodeURIComponent(slug[0]);
        const pageSlug = slug[1];

        doc = await prisma.docPage.findFirst({
            where: {
                category: category,
                slug: pageSlug
            }
        });
    } else if (slug.length === 1) {
        // Maybe legacy link or just slug provided. Try to find by slug.
        const pageSlug = slug[0];
        doc = await prisma.docPage.findUnique({
            where: { slug: pageSlug }
        });

        // If found, cannonicalize URL? Or just show it? 
        // Better to redirect to full path for consistency
        if (doc) {
            redirect(`/documentation/${doc.category}/${doc.slug}`);
        }
    }

    if (!doc) {
        notFound();
    }

    // 3. Extract Headings
    const headings = extractHeadings(doc.content);

    // 4. Map to Frontend Type (if needed)
    // Our DocPage type in lib/types.ts: id, slug, category, title, description, content
    // Prisma model: id, slug, category, title, description, content, orderIndex...
    // Matches well.

    return <DocContentClient page={doc as DocPage} headings={headings} />;
}
