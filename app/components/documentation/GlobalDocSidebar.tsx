'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useDocSidebar } from '@/app/context/DocSidebarContext';
import { DocSidebar } from './DocSidebar';

export function GlobalDocSidebar() {
    const { isOpen, setIsOpen, navigation, activePageId } = useDocSidebar();

    if (navigation.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[9999] lg:hidden"
                        style={{ zIndex: 9999 }}
                    />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 w-80 bg-[#1a0f0f] border-r border-white/10 p-6 overflow-y-auto lg:hidden"
                        style={{ zIndex: 9999 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xl font-black text-white">DOCS</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-white/50 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <DocSidebar navigation={navigation} activePageId={activePageId} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
