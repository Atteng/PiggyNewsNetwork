"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteButtonProps {
    endpoint: string;
    resourceName: string;
    onSuccess?: () => void;
    variant?: 'text' | 'icon' | 'button';
    className?: string;
}

export default function DeleteButton({
    endpoint,
    resourceName,
    onSuccess,
    variant = 'text',
    className = ""
}: DeleteButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(endpoint, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || `Failed to delete ${resourceName}`);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.refresh();
            }
            setShowConfirm(false);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 italic whitespace-nowrap">Are you sure?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-xs text-red-400 font-bold hover:underline disabled:opacity-50 flex items-center gap-1"
                >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="text-xs text-white/50 hover:underline disabled:opacity-50"
                >
                    No
                </button>
            </div>
        );
    }

    if (variant === 'icon') {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className={`p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all ${className}`}
                title={`Delete ${resourceName}`}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        );
    }

    if (variant === 'button') {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className={`px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors ${className}`}
            >
                Delete
            </button>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className={`text-red-400 hover:text-red-300 transition-colors ${className}`}
        >
            Delete
        </button>
    );
}
