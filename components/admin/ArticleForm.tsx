"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamic import for the markdown editor to avoid SSR issues
const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

interface ArticleFormProps {
    initialData?: any; // Type properly later
    isEditing?: boolean;
}

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [category, setCategory] = useState(initialData?.category || "General");
    const [content, setContent] = useState(initialData?.content || "");
    const [status, setStatus] = useState(initialData?.status || "draft");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");

    // Proposal-specific states
    const [isProposal, setIsProposal] = useState(!!initialData?.proposal || category === 'Proposal');
    const [snapshotUrl, setSnapshotUrl] = useState(initialData?.proposal?.snapshotUrl || "");
    const [quorum, setQuorum] = useState(initialData?.proposal?.quorum || "");
    const [proposalStatus, setProposalStatus] = useState(initialData?.proposal?.status || "PENDING");

    // Basic slug generator
    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const data = {
            title,
            slug: slug || generateSlug(title),
            category,
            content,
            status,
            excerpt,
            thumbnailUrl,
            // Proposal data
            isProposal,
            proposal: isProposal ? {
                snapshotUrl,
                quorum: quorum ? Number(quorum) : null,
                status: proposalStatus
            } : null
        };

        try {
            const url = isEditing
                ? `/api/articles/${initialData.slug}`
                : '/api/articles';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to save article');
            }

            router.push('/admin/articles');
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
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (!isEditing && !slug) setSlug(generateSlug(e.target.value));
                            }}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[var(--neon-pink)] transition-colors text-lg"
                            placeholder="Article Title"
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Excerpt (SEO Description)</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[var(--neon-pink)] transition-colors h-24"
                            placeholder="Brief summary..."
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-6">
                        <h3 className="font-semibold text-white">Publishing</h3>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white"
                            >
                                <option value="General">General</option>
                                <option value="Proposal">Proposal</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operations">Operations</option>
                                <option value="Temp_Check">Temp Check</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white font-mono text-xs"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-[var(--neon-pink)] text-white font-bold rounded-lg hover:bg-pink-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (isEditing ? 'Update Article' : 'Create Article')}
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
                        <h3 className="font-semibold text-white">Featured Image</h3>
                        <input
                            type="text"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            placeholder="Image URL"
                            className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white text-sm"
                        />
                        {thumbnailUrl && (
                            <img src={thumbnailUrl} alt="Preview" className="w-full aspect-video object-cover rounded-md border border-white/10" />
                        )}
                    </div>

                    {/* Proposal Section */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white text-sm">Governance Proposal</h3>
                            <input
                                type="checkbox"
                                checked={isProposal}
                                onChange={(e) => setIsProposal(e.target.checked)}
                                className="w-4 h-4 accent-[var(--neon-pink)]"
                            />
                        </div>

                        {isProposal && (
                            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-white/40 font-bold">Snapshot URL</label>
                                    <input
                                        type="url"
                                        value={snapshotUrl}
                                        onChange={(e) => setSnapshotUrl(e.target.value)}
                                        placeholder="https://snapshot.org/..."
                                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-white/40 font-bold">Quorum</label>
                                    <input
                                        type="number"
                                        value={quorum}
                                        onChange={(e) => setQuorum(e.target.value)}
                                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-white/40 font-bold">Proposal Status</label>
                                    <select
                                        value={proposalStatus}
                                        onChange={(e) => setProposalStatus(e.target.value)}
                                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white text-xs"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
