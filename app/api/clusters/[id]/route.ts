import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const cluster = await prisma.cluster.findUnique({
            where: { id },
            include: {
                subCircles: true,
            },
        });

        if (!cluster) {
            return NextResponse.json({ error: 'Cluster not found' }, { status: 404 });
        }

        return NextResponse.json(cluster);
    } catch (error) {
        console.error('Error fetching cluster:', error);
        return NextResponse.json({ error: 'Failed to fetch cluster' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    // Basic Role Check: Only Admin can update clusters
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    try {
        const body = await request.json();

        // Update cluster fields
        const cluster = await prisma.cluster.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                radius: body.radius,
                // Handling subCircles updates is complex. 
                // For simple CMS, we might delete all and recreate, or update individually.
                // Prisma supports nested writes.
                // If body.subCircles is provided, we can use deleteMany + createMany or upsert.
                // For now, let's just update main fields.
            },
        });

        return NextResponse.json(cluster);
    } catch (error) {
        console.error('Error updating cluster:', error);
        return NextResponse.json({ error: 'Failed to update cluster' }, { status: 500 });
    }
}
