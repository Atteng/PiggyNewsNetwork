'use client';

import { motion } from 'framer-motion';
import { AlignLeft } from 'lucide-react';

type ProposalStatus = 'ALL' | 'ACTIVE' | 'PENDING' | 'CLOSED';

interface ProposalFilterProps {
    activeFilter: ProposalStatus;
    onChange: (status: ProposalStatus) => void;
}

export function ProposalFilter({ activeFilter, onChange }: ProposalFilterProps) {
    const filters: ProposalStatus[] = ['ALL', 'ACTIVE', 'PENDING', 'CLOSED'];

    return (
        <div className="sticky top-28">
            <h3 className="flex items-center gap-2 font-bold text-white mb-6">
                <AlignLeft className="w-5 h-5" /> Categories
            </h3>

            <div className="flex flex-col gap-2 p-4 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onChange(filter)}
                        className={`
                            text-left px-4 py-3 rounded-lg font-medium text-sm transition-all
                            ${activeFilter === filter
                                ? 'bg-[#ff2f7a]/10 text-[#ff2f7a] border-l-2 border-[#ff2f7a]'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                            }
                        `}
                    >
                        {filter.charAt(0) + filter.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}
