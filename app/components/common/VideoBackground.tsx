'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface VideoBackgroundProps {
    desktopVideoWebm?: string;
    desktopVideoMp4?: string;
    mobileVideoWebm?: string;
    mobileVideoMp4?: string;
    posterDesktop?: string;
    posterMobile?: string;
    fallbackImage: string;
    overlay?: boolean;
    overlayOpacity?: number;
    className?: string;
}

export function VideoBackground({
    desktopVideoWebm,
    desktopVideoMp4,
    mobileVideoWebm,
    mobileVideoMp4,
    posterDesktop,
    posterMobile,
    fallbackImage,
    overlay = true,
    overlayOpacity = 0.4,
    className = '',
}: VideoBackgroundProps) {
    const [videoSupported, setVideoSupported] = useState(true);

    useEffect(() => {
        // Check video support
        const video = document.createElement('video');
        setVideoSupported(!!video.canPlayType);
    }, []);

    // If no video sources provided or video not supported, show fallback image
    if (!videoSupported || ((!mobileVideoWebm && !mobileVideoMp4) && (!desktopVideoWebm && !desktopVideoMp4))) {
        return (
            <div className={`fixed inset-0 z-0 ${className}`}>
                <Image
                    src={fallbackImage}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                {overlay && (
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 z-0 ${className}`}>
            {/* Desktop Video */}
            {(desktopVideoWebm || desktopVideoMp4) && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={posterDesktop}
                    className="hidden md:block absolute inset-0 w-full h-full object-cover"
                >
                    {desktopVideoWebm && <source src={desktopVideoWebm} type="video/webm" />}
                    {desktopVideoMp4 && <source src={desktopVideoMp4} type="video/mp4" />}
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Mobile Video */}
            {(mobileVideoWebm || mobileVideoMp4) && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={posterMobile}
                    className="md:hidden absolute inset-0 w-full h-full object-cover"
                >
                    {mobileVideoWebm && <source src={mobileVideoWebm} type="video/webm" />}
                    {mobileVideoMp4 && <source src={mobileVideoMp4} type="video/mp4" />}
                    Your browser does not support the video tag.
                </video>
            )}

            {overlay && (
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
                />
            )}
        </div>
    );
}
