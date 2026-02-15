import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category, Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get('category');
  const featuredParam = searchParams.get('featured');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  // Build filter conditions
  const where: Prisma.ArticleWhereInput = {
    status: 'published', // Default to published only for public API
  };

  if (categoryParam && categoryParam !== 'All') {
    // Map string to enum, handling potential mismatches safely
    const categoryEnum = Object.values(Category).find(c => c === categoryParam);
    if (categoryEnum) {
      where.category = categoryEnum as Category;
    }
  }

  if (featuredParam === 'true') {
    where.featured = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    const [articles, total] = await prisma.$transaction([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { name: true, avatarUrl: true }
          }
        }
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();

  // Basic Role Check: Only Admin/Editor can create articles
  if (!session || !session.user || !['admin', 'editor'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Basic validation (should be replaced with Zod)
    if (!body.title || !body.slug || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category as Category,
        excerpt: body.excerpt,
        content: body.content,
        thumbnailUrl: body.thumbnailUrl,
        featured: body.featured || false,
        status: body.status || 'draft',
        publishedAt: body.status === 'published' ? new Date() : null,
        authorId: session.user.id, // Connect to authenticated user
        proposal: body.isProposal ? {
          create: {
            snapshotUrl: body.proposal?.snapshotUrl,
            quorum: body.proposal?.quorum,
            status: body.proposal?.status || 'PENDING',
          }
        } : undefined
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
