'use client';

import { useState } from 'react';
import { ProposalCard } from '@/app/components/governance/ProposalCard';
import { ProposalFilter } from '@/app/components/governance/ProposalFilter';
import { Article } from '@/lib/types';

type ProposalStatus = 'ALL' | 'ACTIVE' | 'PENDING' | 'CLOSED';

export interface MappedProposal {
    article: Article;
    status: 'ACTIVE' | 'PENDING' | 'CLOSED';
    votesFor: number;
    votesAgainst: number;
    snapshotLink?: string;
}

interface GovernanceClientProps {
    initialProposals: MappedProposal[];
}

export function GovernanceClient({ initialProposals }: GovernanceClientProps) {
    const [activeFilter, setActiveFilter] = useState<ProposalStatus>('ALL');

    // Filter by status
    const filteredProposals = activeFilter === 'ALL'
        ? initialProposals
        : initialProposals.filter(p => p.status === activeFilter);

    return (
        <div className="min-h-screen relative">
            {/* Page-specific background */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/bg-2.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT SIDEBAR: Filter */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <ProposalFilter
                            activeFilter={activeFilter}
                            onChange={setActiveFilter}
                        />
                    </div>

                    {/* MAIN CONTENT: Proposal Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProposals.map((proposal) => (
                                <ProposalCard
                                    key={proposal.article.id}
                                    proposal={proposal.article}
                                    status={proposal.status}
                                    votesFor={proposal.votesFor}
                                    votesAgainst={proposal.votesAgainst}
                                />
                            ))}
                        </div>

                        {filteredProposals.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-white/40 text-lg">No proposals found for this filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
