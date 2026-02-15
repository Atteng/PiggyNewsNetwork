'use client';

import { TocItem } from '@/lib/markdownUtils';
import { useEffect, useState } from 'react';

interface TableOfContentsProps {
    headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Reset active state when headings change (page navigation)
        setActiveId('');

        // Small delay to let the new content render
        const timeoutId = setTimeout(() => {
            const visibleHeadings = new Set<string>();

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            visibleHeadings.add(entry.target.id);
                        } else {
                            visibleHeadings.delete(entry.target.id);
                        }
                    });

                    // Find the first visible heading from our headings list
                    // This ensures we always highlight the top-most visible section
                    const visibleId = headings.find(h => visibleHeadings.has(h.id))?.id;

                    if (visibleId) {
                        setActiveId(visibleId);
                    }
                },
                { rootMargin: '-80px 0px -40% 0px' } // Adjusted margin to trigger earlier at top
            );

            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) observer.observe(element);
            });

            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="text-sm font-bold text-white/40 uppercase tracking-wider">
                On This Page
            </div>
            <nav className="space-y-1 border-l border-white/5 pl-4">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({
                                behavior: 'smooth'
                            });
                            setActiveId(heading.id);
                        }}
                        className={`block text-sm py-1 transition-colors border-l-2 -ml-[17px] pl-4 ${activeId === heading.id
                            ? 'text-[#ff2f7a] border-[#ff2f7a] font-medium'
                            : 'text-white/40 border-transparent hover:text-white hover:border-white/20'
                            }`}
                        style={{
                            paddingLeft: heading.level === 3 ? '24px' : '16px'
                        }}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
