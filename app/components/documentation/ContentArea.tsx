'use client';

import ReactMarkdown from 'react-markdown';
import { DocPage } from '@/lib/types';

interface ContentAreaProps {
    page: DocPage;
}

// Helper function to generate slug from heading text
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export function ContentArea({ page }: ContentAreaProps) {
    return (
        <div className="max-w-4xl">
            <div className="mb-2 border-b border-white/10 pb-2">
                <span className="text-[#ff2f7a] font-bold text-xs uppercase tracking-widest mb-0.5 block">
                    {page.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
                    {page.title}
                </h1>
                <p className="text-base text-white/60 font-medium leading-snug">
                    {page.description}
                </p>
            </div>

            <div className="prose prose-invert prose-pink max-w-none 
                prose-p:!text-white/60 prose-p:font-medium prose-p:leading-relaxed prose-p:my-4
                prose-li:!text-white/60 prose-li:my-2
                prose-strong:text-white 
                prose-code:text-[#ff2f7a] prose-code:bg-[#ff2f7a]/10 prose-code:px-1 prose-code:rounded 
                prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:my-6">
                <ReactMarkdown
                    components={{
                        h1: () => null, // Hidden because we render the title in the header above
                        h2: ({ children }) => {
                            const text = String(children);
                            const id = slugify(text);
                            // H2: White, bold, text-base, consistent spacing
                            return (
                                <h2 id={id} className="scroll-mt-32 text-base font-bold text-white mt-12 mb-2">
                                    {children}
                                </h2>
                            );
                        },
                        h3: ({ children }) => {
                            const text = String(children);
                            const id = slugify(text);
                            // H3: White, bold, text-base, consistent spacing
                            return <h3 id={id} className="scroll-mt-32 text-base font-bold text-white mt-12 mb-2">{children}</h3>;
                        },
                        p: ({ children }) => {
                            // Custom paragraph styling to match description
                            return <p className="text-white/60 font-medium leading-relaxed my-4">{children}</p>;
                        },
                        li: ({ children }) => {
                            // Custom list item styling to match paragraphs
                            return <li className="text-white/60 font-medium my-2">{children}</li>;
                        },
                    }}
                >
                    {page.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

