import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    try {
        const docs = await prisma.docPage.findMany({
            where,
            orderBy: [
                { category: 'asc' },
                { orderIndex: 'asc' }
            ]
        });

        return NextResponse.json(docs);
    } catch (error) {
        console.error('Error fetching docs:', error);
        return NextResponse.json({ error: 'Failed to fetch docs' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function POST(request: Request) {
    const session = await auth();
    // Basic Role Check: Only Admin can create docs
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.title || !body.slug || !body.category || !body.content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const doc = await prisma.docPage.create({
            data: {
                title: body.title,
                slug: body.slug,
                category: body.category,
                content: body.content,
                description: body.description,
                icon: body.icon,
                orderIndex: body.orderIndex || 0,
                parentId: body.parentId // Optional nesting
            },
        });

        return NextResponse.json(doc, { status: 201 });
    } catch (error) {
        console.error('Error creating doc:', error);
        return NextResponse.json({ error: 'Failed to create doc' }, { status: 500 });
    }
}
