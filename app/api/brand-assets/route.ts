import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const assets = await prisma.brandAsset.findMany({
            include: {
                files: true,
            },
            orderBy: {
                title: 'asc',
            }
        });

        return NextResponse.json(assets);
    } catch (error) {
        console.error('Error fetching brand assets:', error);
        return NextResponse.json({ error: 'Failed to fetch brand assets' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function POST(request: Request) {
    const session = await auth();
    // Basic Role Check: Only Admin/Editor can create assets
    if (!session || !session.user || !['admin', 'editor'].includes((session.user as any).role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.title || !body.category) {
            return NextResponse.json({ error: 'Title and Category are required' }, { status: 400 });
        }

        const asset = await prisma.brandAsset.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category as any,
                thumbnailUrl: body.thumbnailUrl,
                // Optionally create files in the same transaction if provided
                files: body.files ? {
                    create: body.files.map((f: any) => ({
                        name: f.name,
                        fileUrl: f.fileUrl,
                        format: f.format,
                        fileSize: f.fileSize
                    }))
                } : undefined
            },
            include: {
                files: true
            }
        });

        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        console.error('Error creating brand asset:', error);
        return NextResponse.json({ error: 'Failed to create brand asset' }, { status: 500 });
    }
}
