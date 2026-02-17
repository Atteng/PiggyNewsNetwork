import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';
import { prisma } from '@/lib/prisma';

export default async function AdminAssetsPage() {
    const assets = await prisma.brandAsset.findMany({
        orderBy: { createdAt: 'desc' },
        include: { files: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Brand Assets</h2>
                <Link
                    href="/admin/assets/upload"
                    className="px-4 py-2 bg-[var(--neon-pink)] text-white font-semibold rounded-full hover:bg-pink-400 transition-colors"
                >
                    + Upload Asset
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(assets as any[]).map((asset) => (
                    <div key={asset.id} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all">
                        <div className="aspect-square bg-black/20 relative">
                            {asset.thumbnailUrl ? (
                                <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                    No Preview
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Link
                                    href={`/admin/assets/${asset.id}/edit`}
                                    className="px-3 py-1 bg-piggy-deep-pink text-white text-xs font-bold rounded hover:bg-pink-600 shadow-lg shadow-pink-500/20"
                                >
                                    Edit
                                </Link>
                                <DeleteButton
                                    endpoint={`/api/brand-assets/${asset.id}`}
                                    resourceName="asset"
                                    variant="button"
                                />
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-white truncate">{asset.title}</h3>
                            <p className="text-xs text-white/50 capitalize">{asset.category.replace('_', ' ')}</p>
                        </div>
                    </div>
                ))}
                {assets.length === 0 && (
                    <div className="col-span-full p-12 text-center text-white/50 bg-white/5 rounded-xl border border-white/10 border-dashed">
                        No assets found. Upload some branding materials!
                    </div>
                )}
            </div>
        </div>
    );
}
