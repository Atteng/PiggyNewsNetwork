'use client';

import { PorktocracyVisualization } from '@/app/components/porktocracy/PorktocracyVisualization';
import { ClusterDetailModal } from '@/app/components/porktocracy/ClusterDetailModal';
import { Cluster } from '@/lib/types';
import { useState } from 'react';

interface PorktocracyClientProps {
    clusters: Cluster[];
}

export function PorktocracyClient({ clusters }: PorktocracyClientProps) {
    const [expandedCluster, setExpandedCluster] = useState<Cluster | null>(null);
    const [selectedSubCircle, setSelectedSubCircle] = useState<Cluster | null>(null);

    const handleClusterClick = (cluster: Cluster) => {
        // Check if this is a sub-circle click (isSubCircle property added by D3 event)
        if ((cluster as any).isSubCircle) {
            // Sub-circle clicked - delay modal opening to let highlight animation complete
            setTimeout(() => {
                setSelectedSubCircle(cluster);
            }, 250);
        } else {
            // Main cluster clicked - expand/collapse
            const isCurrentlyExpanded = expandedCluster?.id === cluster.id;

            if (isCurrentlyExpanded) {
                // Collapse the currently expanded cluster
                setExpandedCluster(null);
                setSelectedSubCircle(null); // Also close modal
            } else {
                // Expand new cluster and close any open modal
                setExpandedCluster(cluster);
                setSelectedSubCircle(null); // Close modal when switching clusters
            }
        }
    };

    const handleCloseModal = () => {
        setSelectedSubCircle(null);
    };

    return (
        <div className="fixed inset-0 top-[66px] w-full overflow-hidden">
            {/* Page-specific background - bg-2.jpg */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/bg-2.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Main Visualization Canvas */}
            <div className="absolute inset-0 z-10 top-0">
                <PorktocracyVisualization
                    clusters={clusters}
                    onClusterClick={handleClusterClick}
                    selectedCluster={expandedCluster}
                    selectedSubCircleName={(selectedSubCircle as any)?.subCircleName || null}
                />
            </div>

            {/* Cluster Detail Modal - only shows for sub-circle clicks */}
            <ClusterDetailModal cluster={selectedSubCircle} onClose={handleCloseModal} />
        </div>
    );
}
