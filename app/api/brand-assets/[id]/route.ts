import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { auth } from "@/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || !session.user || !['admin', 'editor'].includes((session.user as any).role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const asset = await prisma.brandAsset.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                category: body.category as any,
                thumbnailUrl: body.thumbnailUrl,
            },
        });

        return NextResponse.json(asset);
    } catch (error: any) {
        console.error('Error updating brand asset:', error);
        return NextResponse.json({ error: 'Failed to update brand asset' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.brandAsset.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Brand asset deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting brand asset:', error);
        return NextResponse.json({ error: 'Failed to delete brand asset' }, { status: 500 });
    }
}
