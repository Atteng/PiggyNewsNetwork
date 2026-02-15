import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ articleId: string }> }
) {
    const { articleId } = await params;

    try {
        const proposal = await prisma.proposal.findUnique({
            where: { articleId },
            include: {
                article: {
                    select: { title: true, slug: true }
                }
            }
        });

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal data not found' }, { status: 404 });
        }

        return NextResponse.json(proposal);
    } catch (error) {
        console.error('Error fetching proposal:', error);
        return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ articleId: string }> }
) {
    const session = await auth();
    const { articleId } = await params;
    // Basic Role Check: Only Admin can update proposals
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    try {
        const body = await request.json();

        const proposal = await prisma.proposal.upsert({
            where: { articleId },
            update: {
                snapshotUrl: body.snapshotUrl,
                votesFor: body.votesFor,
                votesAgainst: body.votesAgainst,
                quorum: body.quorum,
                status: body.status,
                startDate: body.startDate,
                endDate: body.endDate,
            },
            create: {
                articleId,
                snapshotUrl: body.snapshotUrl,
                votesFor: body.votesFor,
                votesAgainst: body.votesAgainst,
                quorum: body.quorum,
                status: body.status || 'PENDING',
                startDate: body.startDate,
                endDate: body.endDate,
            },
        });

        return NextResponse.json(proposal);
    } catch (error) {
        console.error('Error updating proposal:', error);
        return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
    }
}
