'use client';

import { ContentArea } from '@/app/components/documentation/ContentArea';
import { useDocContext } from '@/app/context/DocSidebarContext';
import { DocPage } from '@/lib/types';
import { TocItem } from '@/lib/markdownUtils';
import { useEffect } from 'react';

interface DocContentClientProps {
    page: DocPage;
    headings: TocItem[];
}

export default function DocContentClient({ page, headings }: DocContentClientProps) {
    const { setActivePageId, setHeadings } = useDocContext();

    useEffect(() => {
        setActivePageId(page.id);
        setHeadings(headings);
    }, [page.id, headings, setActivePageId, setHeadings]);

    return <ContentArea page={page} />;
}
