'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggle: () => void;
    initialQuery: string;
    openWithQuery: (query: string) => void;
    clearQuery: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialQuery, setInitialQuery] = useState('');

    const toggle = () => setIsOpen(prev => !prev);

    const openWithQuery = (query: string) => {
        setInitialQuery(query);
        setIsOpen(true);
    };

    const clearQuery = () => {
        setInitialQuery('');
    };

    return (
        <AIContext.Provider value={{ isOpen, setIsOpen, toggle, initialQuery, openWithQuery, clearQuery }}>
            {children}
        </AIContext.Provider>
    );
}

export function useAI() {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
}
