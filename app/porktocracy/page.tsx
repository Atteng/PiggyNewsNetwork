import { prisma } from '@/lib/prisma';
import { PorktocracyClient } from '@/app/components/porktocracy/PorktocracyClient';
import { Cluster } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function PorktocracyPage() {
    const clustersData = await prisma.cluster.findMany({
        include: {
            subCircles: true
        }
    });

    // Map to Cluster type
    const clusters: Cluster[] = clustersData.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        memberCount: c.memberCount,
        proposalCount: c.proposalCount,
        radius: c.radius,
        subCircles: c.subCircles.map(s => s.name),
    }));

    return (
        <PorktocracyClient clusters={clusters} />
    );
}
