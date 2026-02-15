"use client";

import { ThemeProvider } from "next-themes";
import { AIProvider } from "./context/AIContext";
import { DocProvider } from "./context/DocSidebarContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
            <AIProvider>
                <DocProvider>{children}</DocProvider>
            </AIProvider>
        </ThemeProvider>
    );
}
