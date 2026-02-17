import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        let content = await prisma.heroContent.findFirst();

        if (!content) {
            // Default initial content
            content = await prisma.heroContent.create({
                data: {
                    badgeText: "The Source of Truth for PiggyDAO",
                    headlineLine1: "The Art of",
                    headlineLine2: "Financial",
                    headlineLine3: "Independence",
                    tagline: "Now fully documented and archived for your perusal"
                }
            });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error("Failed to fetch hero content:", error);
        return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        const content = await prisma.heroContent.findFirst();

        let updated;
        if (content) {
            updated = await prisma.heroContent.update({
                where: { id: content.id },
                data: {
                    badgeText: data.badgeText,
                    headlineLine1: data.headlineLine1,
                    headlineLine2: data.headlineLine2,
                    headlineLine3: data.headlineLine3,
                    tagline: data.tagline
                }
            });
        } else {
            updated = await prisma.heroContent.create({
                data: {
                    badgeText: data.badgeText,
                    headlineLine1: data.headlineLine1,
                    headlineLine2: data.headlineLine2,
                    headlineLine3: data.headlineLine3,
                    tagline: data.tagline
                }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update hero content:", error);
        return NextResponse.json({ error: "Failed to update hero content" }, { status: 500 });
    }
}
