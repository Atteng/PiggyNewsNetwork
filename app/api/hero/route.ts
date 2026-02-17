import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch the single hero record (or first one)
        const hero = await prisma.heroContent.findFirst();

        if (!hero) {
            // Return default if empty? Or 404? 
            // Better to return empty object or default structure
            return NextResponse.json({});
        }

        return NextResponse.json(hero);
    } catch (error: any) {
        console.error('Error fetching hero content:', error);
        return NextResponse.json({ error: 'Failed to fetch hero content' }, { status: 500 });
    }
}

import { auth } from "@/auth";

export async function PUT(request: Request) {
    const session = await auth();
    // Basic Role Check: Only Admin can update hero
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Check if exists
        const existing = await prisma.heroContent.findFirst();

        let hero;
        if (existing) {
            hero = await prisma.heroContent.update({
                where: { id: existing.id },
                data: {
                    badgeText: body.badgeText,
                    headlineLine1: body.headlineLine1,
                    headlineLine2: body.headlineLine2,
                    headlineLine3: body.headlineLine3,
                    tagline: body.tagline,
                },
            });
        } else {
            hero = await prisma.heroContent.create({
                data: {
                    badgeText: body.badgeText,
                    headlineLine1: body.headlineLine1,
                    headlineLine2: body.headlineLine2,
                    headlineLine3: body.headlineLine3,
                    tagline: body.tagline,
                },
            });
        }

        return NextResponse.json(hero);
    } catch (error: any) {
        console.error('Error updating hero content:', error);
        return NextResponse.json({ error: 'Failed to update hero content' }, { status: 500 });
    }
}
