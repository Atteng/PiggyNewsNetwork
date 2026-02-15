import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    const { key } = await params;

    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key },
        });

        if (!setting) {
            return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
        }

        return NextResponse.json(setting);
    } catch (error) {
        console.error('Error fetching setting:', error);
        return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    const { key } = await params;
    // TODO: Add Authentication Check

    try {
        const body = await request.json();
        const value = body.value; // Expect { value: "..." }

        const setting = await prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });

        return NextResponse.json(setting);
    } catch (error) {
        console.error('Error updating setting:', error);
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }
}
