export interface TocItem {
    id: string;
    text: string;
    level: number;
}

// Helper function to generate slug from heading text (matches ContentArea slugify)
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export function extractHeadings(markdown: string): TocItem[] {
    const headingRegex = /^(#{1,6})\s+(.*)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugify(text);

        // Only include h1, h2, h3
        if (level <= 3) {
            headings.push({ id, text, level });
        }
    }

    return headings;
}
