import React from "react";

export default function Footer() {
    return (
        <footer className="fixed bottom-4 w-full text-center text-white z-50 pointer-events-none">
            <div className="container mx-auto px-4">
                <p className="text-sm font-medium opacity-80">
                    &copy; {new Date().getFullYear()} Piggy News Network. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
