import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Create New Article</h2>
            </div>
            <ArticleForm />
        </div>
    );
}
