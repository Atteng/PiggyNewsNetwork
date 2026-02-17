import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        // Determine if slug is an array (catch-all) or string
        // In app directory [slug] is string, [[...slug]] is array
        // Our route file is named [slug] so it should be a single segment.
        // Wait, the plan said `/documentation/[[...slug]]` frontend maps to `/api/docs/[slug]` backend?
        // If the backend route is `[slug]`, it handles one level.
        // Ideally backend should handle full path or just unique slug.
        // Our schema has `slug` as unique string (e.g. 'intro', 'setup').
        // So `GET /api/docs/intro` works.

        // BUT if the frontend uses nested paths like `/docs/getting-started/installation`,
        // the slug might be 'installation' uniquely?
        // Or we store full path as slug?
        // Let's assume unique slug for now.

        const doc = await prisma.docPage.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: true
            }
        });

        if (!doc) {
            return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
        }

        return NextResponse.json(doc);
    } catch (error) {
        console.error('Error fetching doc:', error);
        return NextResponse.json({ error: 'Failed to fetch doc' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const session = await auth();
    // Basic Role Check: Only Admin can update docs
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    try {
        const body = await request.json();

        const doc = await prisma.docPage.update({
            where: { slug },
            data: {
                title: body.title,
                content: body.content,
                // Allow updating other fields too
                slug: body.slug,
                category: body.category,
                description: body.description,
                icon: body.icon,
                orderIndex: body.orderIndex,
                parentId: body.parentId
            },
        });

        return NextResponse.json(doc);
    } catch (error) {
        console.error('Error updating doc:', error);
        return NextResponse.json({ error: 'Failed to update doc' }, { status: 500 });
    }
}
