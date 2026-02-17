import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const article = await prisma.article.findUnique({
            where: { slug },
            include: {
                author: {
                    select: { name: true, avatarUrl: true }
                }
            }
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Increment view count asynchronously (fire and forget)
        prisma.article.update({
            where: { id: article.id },
            data: { views: { increment: 1 } }
        }).catch(console.error);

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const session = await auth();
    // Basic Role Check: Only Admin/Editor can update articles
    if (!session || !session.user || !['admin', 'editor'].includes((session.user as any).role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const article = await prisma.article.update({
            where: { slug },
            data: {
                title: body.title,
                slug: body.slug,
                category: body.category as any,
                excerpt: body.excerpt,
                content: body.content,
                thumbnailUrl: body.thumbnailUrl,
                featured: body.featured,
                status: body.status,
                publishedAt: body.status === 'published' ? new Date() : undefined,
                // Handle Proposal upsert
                proposal: body.isProposal ? {
                    upsert: {
                        create: {
                            snapshotUrl: body.proposal?.snapshotUrl,
                            quorum: body.proposal?.quorum,
                            status: body.proposal?.status || 'PENDING',
                        },
                        update: {
                            snapshotUrl: body.proposal?.snapshotUrl,
                            quorum: body.proposal?.quorum,
                            status: body.proposal?.status || 'PENDING',
                        }
                    }
                } : {
                    delete: true // If not a proposal anymore, delete record if exists
                }
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const session = await auth();
    // Basic Role Check: Only Admin can delete articles
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    try {
        await prisma.article.delete({
            where: { slug },
        });

        return NextResponse.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
