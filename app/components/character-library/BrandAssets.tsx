'use client';

import { BrandAsset, AssetCategory } from '@/lib/mockBrandAssets';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface BrandAssetCardProps {
    asset: BrandAsset;
}

export function BrandAssetCard({ asset }: BrandAssetCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            layout
            className="group relative bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Header / Thumbnail */}
            <div className="flex gap-3 p-3 items-center">
                <div className="w-16 h-10 shrink-0 relative rounded-lg overflow-hidden">
                    <img
                        src={asset.thumbnail}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white line-clamp-1 text-sm">{asset.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                            {asset.category.replace('-', ' ')}
                        </span>
                        <span className="text-[10px] text-white/40">{asset.files.length} Files</span>
                    </div>
                </div>
                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 space-y-2 border-t border-white/5 mt-1">
                            <p className="text-xs text-white/50 py-2">
                                {asset.description}
                            </p>

                            {/* File List */}
                            <div className="space-y-2">
                                {asset.files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs group/file bg-white/5 p-2 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/70 font-medium">{file.name}</span>
                                            <span className="text-white/30 text-[10px] uppercase">{file.format}</span>
                                        </div>
                                        <a
                                            href={file.url}
                                            download
                                            className="p-1.5 hover:bg-[#ff2f7a] rounded transition-all text-white/50 hover:text-white"
                                            title="Download"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Download className="w-3 h-3" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Brand Folders Component (The Asset Browser)
export function BrandFolders({ assets }: { assets: BrandAsset[] }) {

    return (
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/5 sticky top-28">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderOpen className="text-[#ff2f7a] w-5 h-5" /> Brand Assets
                </h3>
            </div>

            {/* Asset Grid (Sidebar) */}
            <div className="grid grid-cols-1 gap-3">
                {assets.map((asset) => (
                    <BrandAssetCard
                        key={asset.id}
                        asset={asset}
                    />
                ))}

                {assets.length === 0 && (
                    <div className="text-center py-8 text-white/30 text-sm">
                        No assets found in this folder.
                    </div>
                )}
            </div>
        </div>
    );
}
