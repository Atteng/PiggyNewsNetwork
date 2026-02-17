import { GovernanceClient, MappedProposal } from '@/app/components/governance/GovernanceClient';
import { fetchProposals } from '@/lib/snapshot';
import { Article } from '@/lib/types';

import { cleanProposalBody } from '@/lib/utils'; // Import helper

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function GovernancePage() {
    const proposals = await fetchProposals();

    const mappedProposals: MappedProposal[] = proposals.map(p => {
        // Map Snapshot status (active, closed, pending) to our internal upper case status
        const statusMap: Record<string, 'ACTIVE' | 'CLOSED' | 'PENDING'> = {
            'active': 'ACTIVE',
            'closed': 'CLOSED',
            'pending': 'PENDING'
        };

        // Construct Article-compatible object
        const cleanExcerpt = cleanProposalBody(p.body).slice(0, 150) + '...';

        const article: Article = {
            id: p.id,
            title: p.title,
            category: 'Proposal',
            thumbnail: '/api/placeholder/400/320', // Default thumbnail 
            excerpt: cleanExcerpt,
            timeAgo: new Date(p.start * 1000).toLocaleDateString(),
            views: p.votes.toString(),
            featured: false,
            author: p.author.slice(0, 6) + '...' + p.author.slice(-4),
            readTime: '5 min'
        };

        // Simple vote mapping (first choice = For, second = Against, roughly)
        // Or better: Use scores directly. Usually [For, Against, Abstain] dependent on strategy
        // We will just use the first two for visualization if available
        const votesFor = p.scores[0] || 0;
        const votesAgainst = p.scores[1] || 0;

        return {
            article,
            status: statusMap[p.state] || 'CLOSED',
            votesFor,
            votesAgainst,
            snapshotLink: p.link
        };
    });

    return <GovernanceClient initialProposals={mappedProposals} />;
}
