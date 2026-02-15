export type AssetCategory = 'banners' | 'brand-kit' | 'mascot-kit';

export interface BrandAssetFile {
    name: string;
    url: string;
    format: 'PNG' | 'SVG' | 'AI' | 'PDF' | 'JPG';
    size: string;
}

export interface BrandAsset {
    id: string;
    title: string;
    category: AssetCategory;
    description?: string;
    thumbnail: string;
    files: BrandAssetFile[];
}

export const mockBrandAssets: BrandAsset[] = [
    {
        id: '1',
        title: 'Logo Pack',
        category: 'brand-kit',
        description: 'Primary, secondary, and monochrome logo variations.',
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b7993143a4d?auto=format&fit=crop&q=80&w=2600',
        files: [
            { name: 'Primary Logo', url: '#', format: 'SVG', size: '12KB' },
            { name: 'Primary Logo', url: '#', format: 'PNG', size: '1.2MB' },
            { name: 'Monochrome Logo', url: '#', format: 'SVG', size: '10KB' },
        ]
    },
    {
        id: '2',
        title: 'Agent Characters',
        category: 'mascot-kit',
        description: 'High-res renders of the Piggy Agent in various poses.',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2564',
        files: [
            { name: 'Piggy Agent - Standing', url: '#', format: 'PNG', size: '4.5MB' },
            { name: 'Piggy Agent - Thinking', url: '#', format: 'PNG', size: '4.2MB' },
            { name: 'Piggy Agent - Flying', url: '#', format: 'PNG', size: '4.8MB' },
        ]
    },
    {
        id: '3',
        title: 'Banner Kit',
        category: 'banners',
        description: 'Ready-to-use banners for Twitter, Discord, and LinkedIn.',
        thumbnail: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80&w=2929',
        files: [
            { name: 'Twitter Header', url: '#', format: 'JPG', size: '800KB' },
            { name: 'Discord Banner', url: '#', format: 'JPG', size: '650KB' },
        ]
    },
    {
        id: '4',
        title: 'Brand Styles',
        category: 'brand-kit',
        description: 'Official fonts and color codes for PiggyDAO branding.',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=2000',
        files: [
            { name: 'Brand Guide 2024', url: '#', format: 'PDF', size: '12MB' },
        ]
    },
];
