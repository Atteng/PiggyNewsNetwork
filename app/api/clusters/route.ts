import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const clusters = await prisma.cluster.findMany({
            include: {
                subCircles: true,
            },
            orderBy: {
                radius: 'desc', // Or created_at, but D3 might like deterministic order
            }
        });

        return NextResponse.json(clusters);
    } catch (error: any) {
        console.error('Error fetching clusters:', error);
        return NextResponse.json({ error: 'Failed to fetch clusters' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function POST(request: Request) {
    const session = await auth();
    // Basic Role Check: Only Admin can create clusters
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const cluster = await prisma.cluster.create({
            data: {
                name: body.name,
                description: body.description,
                radius: body.radius || 80,
            },
        });

        return NextResponse.json(cluster, { status: 201 });
    } catch (error: any) {
        console.error('Error creating cluster:', error);
        return NextResponse.json({ error: 'Failed to create cluster' }, { status: 500 });
    }
}
