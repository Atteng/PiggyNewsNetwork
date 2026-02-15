'use client';

import { Article } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProposalCardProps {
    proposal: Article;
    status?: 'PENDING' | 'ACTIVE' | 'CLOSED';
    votesFor?: number;
    votesAgainst?: number;
}

export function ProposalCard({ proposal, status = 'PENDING', votesFor = 0, votesAgainst = 0 }: ProposalCardProps) {
    const totalVotes = votesFor + votesAgainst;
    const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0;

    const statusStyles = {
        PENDING: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
        CLOSED: 'bg-[#ff2f7a]/20 text-[#ff2f7a] border-[#ff2f7a]/30'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-[#ff2f7a]/30 transition-all group flex flex-col justify-between h-auto"
        >
            {/* Header with Proposal # and Status */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
                    PROP {proposal.id.length > 8 ? `${proposal.id.slice(0, 6)}...` : proposal.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusStyles[status]}`}>
                    {status}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#ff2f7a] transition-colors">
                {proposal.title}
            </h3>

            {/* Description */}
            <div className="flex-1">
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {proposal.excerpt || 'This proposal seeks approval from PiggyDAO...'}
                </p>

                {/* Voting Progress */}
                {status !== 'PENDING' && totalVotes > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-white/60">{Math.round(forPercentage)}% for</span>
                            <span className="text-white/60">{Math.round(againstPercentage)}% Against</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                            <div
                                className="bg-gradient-to-r from-[#ff2f7a] to-pink-400 transition-all"
                                style={{ width: `${forPercentage}%` }}
                            />
                            <div
                                className="bg-gray-600 transition-all"
                                style={{ width: `${againstPercentage}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
                {status === 'ACTIVE' && (
                    <a
                        href="https://snapshot.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] py-2.5 px-6 rounded-xl font-medium bg-[#ff2f7a] text-white hover:bg-[#ff2f7a]/90 transition-colors text-center text-sm whitespace-nowrap"
                    >
                        Vote on Snapshot
                    </a>
                )}
                <Link
                    href={`/governance/${proposal.id}`}
                    className={`${status === 'ACTIVE' ? 'flex-1 min-w-[140px]' : 'w-full'} py-2.5 rounded-xl font-medium bg-white/10 text-white hover:bg-white/20 transition-colors text-center text-sm whitespace-nowrap`}
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
}
