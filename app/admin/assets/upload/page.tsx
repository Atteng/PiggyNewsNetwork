import Link from 'next/link';
import AssetUploadForm from "@/components/admin/AssetUploadForm";

export default function NewAssetPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Upload New Asset</h2>
                <Link href="/admin/assets" className="text-sm text-white/50 hover:text-white">
                    &larr; Back to Library
                </Link>
            </div>
            <AssetUploadForm />
        </div>
    );
}
