import { prisma } from '@/lib/prisma';
import { DocNavItem } from '@/lib/types';
import { DocumentationLayout } from '@/app/components/documentation/DocumentationLayout';
import { DocProvider } from '@/app/context/DocSidebarContext';

async function getDocNavigation(): Promise<DocNavItem[]> {
    try {
        const docs = await prisma.docPage.findMany({
            select: {
                id: true,
                title: true, // Use title as label
                slug: true,
                category: true,
                orderIndex: true
            },
            orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }]
        });

        // Group by category to build similar structure to Mock
        const categories: Record<string, DocNavItem> = {};

        docs.forEach(doc => {
            if (!categories[doc.category]) {
                categories[doc.category] = {
                    id: doc.category,
                    label: doc.category,
                    // Map common categories to icons if needed
                    icon: getIconForCategory(doc.category),
                    children: []
                };
            }
            categories[doc.category].children?.push({
                id: doc.id,
                label: doc.title,
                href: `/documentation/${doc.category}/${doc.slug}`
            });
        });

        return Object.values(categories);

    } catch (e) {
        console.error("Failed to load doc nav", e);
        return [];
    }
}

function getIconForCategory(category: string): string {
    const map: Record<string, string> = {
        'Getting Started': 'Waves',
        'Core Concepts': 'Library',
        'Governance': 'Scale',
        'Developers': 'Wrench'
    };
    return map[category] || 'FileText';
}

export default async function Layout({ children }: { children: React.ReactNode }) {
    const navigation = await getDocNavigation();

    return (
        <DocProvider>
            {/* We pass initial navigation. Active page ID is handled by the Page component updating context */}
            <DocumentationLayout navigation={navigation}>
                {children}
            </DocumentationLayout>
        </DocProvider>
    );
}
