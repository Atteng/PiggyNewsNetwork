'use client';

import { motion } from 'framer-motion';

interface ContentSectionProps {
    title: string;
    children: React.ReactNode;
}

export function ContentSection({ title, children }: ContentSectionProps) {
    return (
        <section className="mb-6">
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-white mb-1 border-b-4 border-[#ff2f7a] inline-block pb-1"
            >
                {title}
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base leading-relaxed font-light text-gray-300"
            >
                {children}
            </motion.div>
        </section>
    );
}
