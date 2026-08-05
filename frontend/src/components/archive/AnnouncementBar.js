import React from 'react';

const AnnouncementBar = () => {
    const message = '✦ COMPLIMENTARY GLOBAL SHIPPING ON HERITAGE ORDERS ✦ EST. 2024 — MELBOURNE ✦ BESPOKE CUSTOM STITCHING AVAILABLE ON ALL GARMENTS ✦';

    return (
        <div className="fixed top-0 left-0 right-0 z-[200] h-10 bg-chocolate overflow-hidden flex items-center border-b border-champagne/10">
            <div
                className="flex whitespace-nowrap animate-marquee"
                style={{ animation: 'marquee 35s linear infinite' }}
            >
                {[...Array(3)].map((_, i) => (
                    <span
                        key={i}
                        className="text-[9px] font-bold uppercase tracking-[0.35em] text-champagne/80 px-16"
                    >
                        {message}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementBar;
