"use client";

import React from "react";
import { ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavScrollIndicatorProps {
    show: boolean;
}

export default function NavScrollIndicator({ show }: NavScrollIndicatorProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden flex flex-col items-center justify-center py-4"
                >
                    <style jsx>{`
                        @keyframes pulse-soft {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.3; }
                        }
                        .animate-pulse-soft {
                            animation: pulse-soft 3s ease-in-out infinite;
                        }
                    `}</style>
                    <div className="flex items-center gap-2 mb-2 animate-pulse-soft">
                        <ArrowLeft className="w-3 h-3 text-white/40" />
                        <div className="relative animate-bounce-slow">
                            <MousePointer2 className="w-6 h-6 text-white rotate-[15deg]" />
                        </div>
                        <ArrowRight className="w-3 h-3 text-white/40" />
                    </div>
                    <div className="flex flex-col items-center leading-none animate-pulse-soft">
                        <span className="text-[10px] font-bold tracking-[0.05em] text-white/80">Slide navigation bar</span>
                        <span className="text-[10px] font-bold tracking-[0.05em] text-white/80">to explore</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
