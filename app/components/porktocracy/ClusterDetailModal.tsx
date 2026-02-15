'use client';

import { Cluster, ClusterMember, ClusterProposal } from '@/lib/types';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClusterDetailModalProps {
    cluster: Cluster | null;
    onClose: () => void;
}

export function ClusterDetailModal({ cluster, onClose }: ClusterDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'members' | 'proposals'>('members');

    if (!cluster) return null;

    // Mock data for demonstration
    const mockMembers: ClusterMember[] = Array.from({ length: cluster.memberCount }, (_, i) => ({
        id: `member-${i}`,
        name: `Monster${18 + i}`,
        role: 'Head Hog',
        avatar: '/placeholder-avatar.png',
        subCircle: cluster.subCircles && cluster.subCircles.length > 0
            ? cluster.subCircles[Math.floor(Math.random() * cluster.subCircles.length)]
            : 'General'
    }));

    const mockProposals: ClusterProposal[] = Array.from({ length: cluster.proposalCount }, (_, i) => ({
        id: `proposal-${i}`,
        title: `Proposal ${i + 1} for ${cluster.name}`,
        status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Passed' : 'Failed',
        date: '2024-01-15'
    }));

    return (
        <AnimatePresence>
            {cluster && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed right-4 top-[120px] md:top-[140px] bottom-4 w-[90vw] max-w-[400px] md:w-[400px] bg-[#1a0d0d]/60 backdrop-blur-lg border border-[#ff2f7a]/20 shadow-2xl z-[60] flex flex-col rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div>
                            <h2 className="text-white font-bold text-base font-mono">{cluster.name}</h2>
                            {(cluster as any).isSubCircle && (cluster as any).subCircleName && (
                                <p className="text-white/50 text-xs mt-0.5 font-mono truncate">{(cluster as any).subCircleName}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4 text-white/50 group-hover:text-[#ff2f7a] transition-colors" />
                        </button>
                    </div>

                    {/* Cluster Stats */}
                    <div className="px-6 py-3 flex gap-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ff2f7a]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span className="text-white/60 text-xs font-mono">{cluster.memberCount} Members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ff2f7a]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-white/60 text-xs font-mono">{cluster.proposalCount} Proposals</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/10 px-6">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`py-3 px-2 font-mono text-xs tracking-wide transition-colors relative ${activeTab === 'members'
                                ? 'text-[#ff2f7a]'
                                : 'text-white/50 hover:text-white/80'
                                }`}
                        >
                            Members
                            {activeTab === 'members' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2f7a]"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('proposals')}
                            className={`py-3 px-2 font-mono text-xs tracking-wide transition-colors relative ml-6 ${activeTab === 'proposals'
                                ? 'text-[#ff2f7a]'
                                : 'text-white/50 hover:text-white/80'
                                }`}
                        >
                            Proposals
                            {activeTab === 'proposals' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2f7a]"
                                />
                            )}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        {activeTab === 'members' ? (
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-[1.5fr_1fr] gap-3 text-[10px] font-mono text-[#ff2f7a] mb-3 pb-1.5 border-b border-white/10 opacity-80 uppercase tracking-wider">
                                    <div>User</div>
                                    <div>Role</div>
                                </div>
                                {mockMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="grid grid-cols-[1.5fr_1fr] gap-3 text-xs font-mono text-white/80 py-2.5 hover:bg-white/5 px-2 -mx-2 rounded transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div>{member.name}</div>
                                        <div>{member.role}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {mockProposals.map((proposal) => (
                                    <Link
                                        key={proposal.id}
                                        href={`/governance/${proposal.id}`}
                                        className="block p-3 bg-white/5 rounded border border-white/10 hover:border-[#ff2f7a]/30 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-white font-mono text-xs group-hover:text-[#ff2f7a] transition-colors line-clamp-2">
                                                {proposal.title}
                                            </h3>
                                            <span className="text-[10px] text-white/40 font-mono shrink-0 ml-3">{proposal.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span
                                                className={`px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm ${proposal.status === 'Active'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : proposal.status === 'Passed'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}
                                            >
                                                {proposal.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
