"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssetUploadForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("brand_kit");
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    // For now, we simulate file upload by asking for a URL, 
    // since we haven't set up Vercel Blob/S3 yet.
    const [fileUrl, setFileUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/brand-assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    thumbnailUrl: thumbnailUrl || fileUrl, // Use file as thumb if no thumb
                    files: [{
                        name: 'Main File',
                        fileUrl: fileUrl,
                        format: 'unknown',
                        fileSize: '0kb'
                    }]
                }),
            });

            if (!res.ok) throw new Error('Failed to create asset');

            router.push('/admin/assets');
            router.refresh();
        } catch (error) {
            alert('Error creating asset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
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

            <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white appearance-none"
                >
                    <option value="brand_kit">Brand Kit</option>
                    <option value="mascot_kit">Mascot Kit</option>
                    <option value="banners">Banners</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[var(--neon-pink)] h-32"
                />
            </div>

            <div className="p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-[var(--neon-pink)]/50 transition-colors">
                <label className="block text-center cursor-pointer">
                    <span className="block text-sm font-medium text-white/90 mb-1">Asset URL</span>
                    <span className="block text-xs text-white/50 mb-4">Enter a direct link to the image/file</span>
                    <input
                        type="url"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                        placeholder="https://..."
                        required
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--neon-pink)] text-white font-bold rounded-lg hover:bg-pink-400 transition-colors disabled:opacity-50"
            >
                {loading ? 'Uploading...' : 'Save Asset'}
            </button>
        </form>
    );
}
