'use client';

import { BrandAsset } from '@/lib/mockBrandAssets';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Image as ImageIcon, FileCode } from 'lucide-react';
import { useEffect } from 'react';

interface AssetModalProps {
    asset: BrandAsset | null;
    onClose: () => void;
}

export function AssetModal({ asset, onClose }: AssetModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (asset) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [asset]);

    if (!asset) return null;

    const getFileIcon = (format: string) => {
        switch (format) {
            case 'SVG':
            case 'AI':
                return <FileCode className="w-5 h-5 text-blue-400" />;
            case 'PDF':
                return <FileText className="w-5 h-5 text-red-400" />;
            default:
                return <ImageIcon className="w-5 h-5 text-green-400" />;
        }
    };

    return (
        <AnimatePresence>
            {asset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#1a0b0b] border border-[#ff2f7a]/20 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#ff2f7a]/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Preview Section (Left/Top) */}
                        <div className="w-full md:w-3/5 bg-black/50 p-8 flex items-center justify-center relative overflow-hidden">
                            <img
                                src={asset.thumbnail}
                                alt={asset.title}
                                className="max-w-full max-h-[50vh] md:max-h-full object-contain rounded-lg shadow-lg"
                            />
                            {/* Decorative background blur */}
                            <img
                                src={asset.thumbnail}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover opacity-10 blur-3xl -z-10"
                            />
                        </div>

                        {/* Details Section (Right/Bottom) */}
                        <div className="w-full md:w-2/5 p-8 overflow-y-auto bg-[#2a1515]">
                            <div className="mb-6">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#ff2f7a] bg-[#ff2f7a]/10 px-3 py-1 rounded-full mb-3 inline-block">
                                    {asset.category.replace('-', ' ')}
                                </span>
                                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                                    {asset.title}
                                </h2>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {asset.description}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 opacity-50">
                                    Available Files
                                </h3>
                                {asset.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-[#ff2f7a]/30 hover:bg-black/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                                {getFileIcon(file.format)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-medium text-sm truncate group-hover:text-[#ff2f7a] transition-colors">
                                                    {file.name}
                                                </p>
                                                <p className="text-white/40 text-xs">
                                                    {file.format} • {file.size}
                                                </p>
                                            </div>
                                        </div>

                                        <a
                                            href={file.url}
                                            download
                                            className="p-2 rounded-full text-white/40 hover:text-[#ff2f7a] hover:bg-[#ff2f7a]/10 transition-colors"
                                            title="Download File"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`Downloading ${file.name}`);
                                            }}
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
