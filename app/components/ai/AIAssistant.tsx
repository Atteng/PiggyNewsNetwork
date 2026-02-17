'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowUp, Trash2 } from 'lucide-react';
import { useAI } from '@/app/context/AIContext';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function AIAssistant() {
    const { isOpen, setIsOpen, initialQuery, clearQuery } = useAI();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I can help you navigate PiggyDAO, explain proposals, or answer questions about the ecosystem. What would you like to know?'
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-populate input if initialQuery exists
    useEffect(() => {
        if (initialQuery && isOpen) {
            setInput(initialQuery);
            clearQuery(); // Clear it so it doesn't reappear
        }
    }, [initialQuery, isOpen, clearQuery]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Send to actual API
        setMessages(prev => [...prev, { id: 'loading', role: 'assistant', content: 'Thinking...' }]);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            const data = await response.json();

            setMessages(prev => prev.filter(m => m.id !== 'loading'));
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.content || "I'm having trouble connecting to my central brain. Please check your internet or try again later!"
            }]);
        } catch (error) {
            setMessages(prev => prev.filter(m => m.id !== 'loading'));
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Oink! Something went wrong. I couldn't reach the server."
            }]);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setIsOpen(false)} />

                    {/* Slide-up Panel */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 top-20 z-[70] bg-[#1a0f0f] rounded-t-2xl shadow-2xl flex flex-col border-t border-[#ff2f7a]/20 md:w-[400px] md:right-4 md:left-auto md:bottom-4 md:top-auto md:h-[600px] md:rounded-2xl md:border"
                    >
                        {/* Drag Handle (Mobile only visually) */}
                        <div className="flex justify-center pt-3 pb-1 md:hidden">
                            <div className="w-12 h-1 bg-white/20 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#ff2f7a]" />
                                <span className="font-semibold text-white">Assistant</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                            ? 'bg-[#2a1a1a] text-white'
                                            : 'bg-transparent text-gray-300'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5">
                            <form
                                onSubmit={handleSubmit}
                                className="relative bg-[#0f0f0f] rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 pr-12 rounded-2xl focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#3a2a2a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ff2f7a] transition-colors"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
