import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const allDocs = await prisma.docPage.findMany({
            orderBy: [
                { category: 'asc' },
                { orderIndex: 'asc' }
            ]
        });

        // Transform flat list into tree
        // 1. Group by category? 
        // The current frontend uses sidebar sections.
        // Let's return a structured object: { [category]: rootPages[] } where rootPages have children.

        // First, map ID to doc for easy lookup
        const docsMap = new Map();
        (allDocs as any[]).forEach(doc => {
            docsMap.set(doc.id, { ...doc, children: [] });
        });

        const rootDocs: any[] = [];

        (allDocs as any[]).forEach(doc => {
            const docWithChildren = docsMap.get(doc.id);
            if (doc.parentId) {
                const parent = docsMap.get(doc.parentId);
                if (parent) {
                    parent.children.push(docWithChildren);
                } else {
                    // Parent not found (orphan), maybe treat as root?
                    rootDocs.push(docWithChildren);
                }
            } else {
                rootDocs.push(docWithChildren);
            }
        });

        // Now organize roots by category
        const navigation: Record<string, any[]> = {};
        rootDocs.forEach((doc: any) => {
            if (!navigation[doc.category]) {
                navigation[doc.category] = [];
            }
            navigation[doc.category].push(doc);
        });

        return NextResponse.json(navigation);
    } catch (error) {
        console.error('Error fetching navigation:', error);
        return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
    }
}
