'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface CharacterLibraryLayoutProps {
    children: ReactNode;
    sidebarContent?: ReactNode;
}

export function CharacterLibraryLayout({ children, sidebarContent }: CharacterLibraryLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen relative">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/bg-2.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Content Column (75%) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 lg:w-3/4 space-y-8"
                    >
                        {children}
                    </motion.div>

                    {/* Right Assets Column (25%) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-1/4 space-y-6"
                    >
                        {sidebarContent}
                    </motion.div>

                </div>
            </div>

            {/* Mobile Asset Toggle (Floating Action Button style if needed, or handled within content) */}
        </div>
    );
}
