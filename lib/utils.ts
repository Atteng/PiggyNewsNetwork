import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function cleanProposalBody(body: string): string {
    if (!body) return '';

    // 1. Remove Markdown headers (lines starting with #)
    let clean = body.replace(/#+\s?.*(\n|$)/g, '');

    // 2. Remove URLs (optional, but good for summary)
    // clean = clean.replace(/https?:\/\/[^\s]+/g, '');

    // 3. Remove excessive newlines and trim
    clean = clean.replace(/\n+/g, ' ').trim();

    // 4. Remove bold/italic markers if needed, but they might be okay. 
    // Let's keep them or strip them. Stripping ** is safer for plain text excerpt.
    clean = clean.replace(/\*\*/g, '').replace(/__/g, '');

    return clean;
}
