import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';
import { prisma } from '@/lib/prisma';

export default async function AdminClustersPage() {
    const clusters = await prisma.cluster.findMany({
        include: { subCircles: true },
        orderBy: { radius: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Clusters (Porktocracy)</h2>
                <button className="px-4 py-2 bg-[var(--neon-pink)] text-black font-semibold rounded-full hover:bg-pink-400 transition-colors opacity-50 cursor-not-allowed" title="Not implemented yet">
                    + New Cluster
                </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white/60 font-medium">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Radius (Size)</th>
                            <th className="p-4">Members</th>
                            <th className="p-4">Proposals</th>
                            <th className="p-4">Sub-Circles</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {(clusters as any[]).map((cluster) => (
                            <tr key={cluster.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{cluster.name}</td>
                                <td className="p-4 text-white/70">{cluster.radius}</td>
                                <td className="p-4 text-white/70">{cluster.memberCount}</td>
                                <td className="p-4 text-white/70">{cluster.proposalCount}</td>
                                <td className="p-4 text-white/70">
                                    <div className="flex flex-wrap gap-1">
                                        {(cluster.subCircles as any[]).map(sc => (
                                            <span key={sc.id} className="px-1.5 py-0.5 bg-white/10 rounded text-xs">{sc.name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button className="text-blue-400 hover:underline">Edit</button>
                                    <DeleteButton
                                        endpoint={`/api/clusters/${cluster.id}`}
                                        resourceName="cluster"
                                    />
                                </td>
                            </tr>
                        ))}
                        {clusters.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-white/50">
                                    No clusters found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
