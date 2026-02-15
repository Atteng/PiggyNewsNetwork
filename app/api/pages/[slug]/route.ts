import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const page = await prisma.staticPage.findUnique({
            where: { slug },
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error fetching static page:', error);
        return NextResponse.json({ error: 'Failed to fetch static page' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const session = await auth();
    // Basic Role Check: Only Admin can update pages
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    try {
        const body = await request.json();

        // Upsert logic: Create if not exists, Update if exists
        const page = await prisma.staticPage.upsert({
            where: { slug },
            update: {
                title: body.title,
                sections: body.sections, // JSONB
            },
            create: {
                slug: slug,
                title: body.title || slug,
                sections: body.sections || [],
            },
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error updating static page:', error);
        return NextResponse.json({ error: 'Failed to update static page' }, { status: 500 });
    }
}
