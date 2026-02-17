import { prisma } from '@/lib/prisma';
import { PorktocracyClient } from '@/app/components/porktocracy/PorktocracyClient';
import { Cluster } from '@/lib/types';

export const revalidate = 60;

export default async function PorktocracyPage() {
    const clustersData = await prisma.cluster.findMany({
        include: {
            subCircles: true
        }
    });

    // Map to Cluster type
    const clusters: Cluster[] = clustersData.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        memberCount: c.memberCount,
        proposalCount: c.proposalCount,
        radius: c.radius,
        subCircles: c.subCircles.map((s: any) => s.name),
    }));

    return (
        <PorktocracyClient clusters={clusters} />
    );
}
