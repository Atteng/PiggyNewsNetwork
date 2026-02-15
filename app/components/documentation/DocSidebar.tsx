'use client';

import { DocNavItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FileText, Waves, Wrench, Scale, Library } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
    navigation: DocNavItem[];
    activePageId: string;
}

export function DocSidebar({ navigation, activePageId }: SidebarProps) {
    return (
        <nav className="space-y-6">
            {navigation.map((section) => (
                <SidebarSection
                    key={section.id}
                    section={section}
                    activePageId={activePageId}
                />
            ))}
        </nav>
    );
}

// Icon mapping helper
// We use 'any' to avoid strict type checking on the component map for now
const IconMap: Record<string, any> = {
    'Waves': Waves,
    'Wrench': Wrench,
    'Scale': Scale,
    'Library': Library
};

function SidebarSection({ section, activePageId }: { section: DocNavItem; activePageId: string }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = section.children && section.children.length > 0;

    // Resolve icon component
    const IconComponent = section.icon && IconMap[section.icon] ? IconMap[section.icon] : FileText;

    return (
        <div>
            {/* Section Header */}
            <button
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 w-full text-left mb-2 transition-colors group ${hasChildren ? "cursor-pointer" : "cursor-default"
                    }`}
            >
                {/* Icon or Chevron */}
                <div className="w-5 h-5 flex items-center justify-center shrink-0 text-white/40 group-hover:text-piggy-deep-pink transition-colors">
                    <IconComponent className="w-4 h-4" />
                </div>

                <span className="font-bold text-white/80 text-sm uppercase tracking-wider group-hover:text-white transition-colors">
                    {section.label}
                </span>

                {hasChildren && (
                    <ChevronRight
                        className={`w-3 h-3 text-white/30 ml-auto transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                            }`}
                    />
                )}
            </button>

            {/* Children */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <ul className="space-y-1 pl-2 border-l border-white/10 ml-2.5">
                            {section.children!.map((child) => (
                                <SidebarLink
                                    key={child.id}
                                    item={child}
                                    isActive={activePageId === child.id}
                                />
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarLink({ item, isActive }: { item: DocNavItem; isActive: boolean }) {
    return (
        <li>
            <Link
                href={item.href || '#'}
                className={`block py-1.5 px-3 rounded-lg text-sm transition-all relative overflow-hidden ${isActive
                    ? "text-white font-medium bg-[#ff2f7a]/10 border border-[#ff2f7a]/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
            >
                <span className="relative z-10">{item.label}</span>
            </Link>
        </li>
    );
}
