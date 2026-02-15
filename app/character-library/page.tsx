import { CharacterLibraryLayout } from '@/app/components/character-library/CharacterLibraryLayout';
import { ContentSection } from '@/app/components/character-library/ContentSection';
import { BrandFolders } from '@/app/components/character-library/BrandAssets';
import { prisma } from '@/lib/prisma';
import { BrandAsset } from '@/lib/mockBrandAssets'; // Import existing type for casting
import ReactMarkdown from 'react-markdown';

export default async function CharacterLibraryPage() {
    const assetsData = await prisma.brandAsset.findMany({
        include: {
            files: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Transform Prisma data to match the component's expected interface
    const assets: BrandAsset[] = assetsData.map(asset => ({
        id: asset.id,
        title: asset.title,
        category: asset.category as any, // Cast enum strictly if needed, or map it
        description: asset.description || undefined,
        thumbnail: asset.thumbnailUrl || '', // Fallback for thumbnail
        files: asset.files.map(f => ({
            name: f.name,
            url: f.fileUrl,
            format: f.format as any, // Verify formats match
            size: f.fileSize
        }))
    }));

    // Fetch static content
    const staticContent = await prisma.staticPage.findUnique({
        where: { slug: 'character-library' }
    });

    const sections = (staticContent?.sections as any[]) || [
        { title: "About the DAO", content: "Content not found." }
    ];

    return (
        <CharacterLibraryLayout
            sidebarContent={<BrandFolders assets={assets} />}
        >
            {sections.map((section, index) => (
                <ContentSection key={index} title={section.title}>
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                strong: (props) => <strong className="text-white block mb-1" {...props} />,
                                li: (props) => <li className="mb-2" {...props} />,
                                ul: (props) => <ul className="list-disc pl-6 space-y-4 marker:text-[#ff2f7a]" {...props} />
                            }}
                        >
                            {section.content}
                        </ReactMarkdown>
                    </div>
                </ContentSection>
            ))}
        </CharacterLibraryLayout>
    );
}
