'use client';

import { DocNavItem } from '@/lib/types';
import { TocItem } from '@/lib/markdownUtils';
import { createContext, useContext, useState, ReactNode } from 'react';

interface DocContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigation: DocNavItem[];
    setNavigation: (nav: DocNavItem[]) => void;
    activePageId: string;
    setActivePageId: (id: string) => void;
    headings: TocItem[];
    setHeadings: (headings: TocItem[]) => void;
}

const DocContext = createContext<DocContextType | undefined>(undefined);

export function DocProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [navigation, setNavigation] = useState<DocNavItem[]>([]);
    const [activePageId, setActivePageId] = useState('');
    const [headings, setHeadings] = useState<TocItem[]>([]);

    return (
        <DocContext.Provider value={{
            isOpen, setIsOpen,
            navigation, setNavigation,
            activePageId, setActivePageId,
            headings, setHeadings
        }}>
            {children}
        </DocContext.Provider>
    );
}

export function useDocContext() {
    const context = useContext(DocContext);
    if (context === undefined) {
        throw new Error('useDocContext must be used within a DocProvider');
    }
    return context;
}

// Backward compatibility if needed, or just replace usage
export const useDocSidebar = useDocContext;
