"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

interface DocFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function DocForm({ initialData, isEditing = false }: DocFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [category, setCategory] = useState(initialData?.category || "Getting Started");
    const [content, setContent] = useState(initialData?.content || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [orderIndex, setOrderIndex] = useState(initialData?.orderIndex || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const data = {
            title,
            slug,
            category,
            content,
            description,
            orderIndex: Number(orderIndex),
        };

        try {
            const url = isEditing
                ? `/api/docs/${initialData.slug}`
                : '/api/docs';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to save doc');
            }

            router.push('/admin/docs');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            {error && (
                <div className="p-4 bg-red-400/10 text-red-400 rounded-lg border border-red-400/20">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[var(--neon-pink)]"
                            required
                        />
                    </div>

                    <div className="space-y-2" data-color-mode="dark">
                        <label className="text-sm font-medium text-white/70">Content</label>
                        <MDEditor
                            value={content}
                            onChange={(val) => setContent(val || "")}
                            height={500}
                            className="bg-transparent border border-white/10 rounded-lg overflow-hidden"
                            preview="live"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
                        <h3 className="font-semibold text-white">Metadata</h3>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white font-mono text-xs"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white"
                                placeholder="e.g. Getting Started"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Order Index</label>
                            <input
                                type="number"
                                value={orderIndex}
                                onChange={(e) => setOrderIndex(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white h-24 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 px-4 py-3 bg-[var(--neon-pink)] text-white font-bold rounded-lg hover:bg-pink-400 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Page'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
