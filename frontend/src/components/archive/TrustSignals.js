import React from 'react';
import { SectionContainer } from './shared';

const trustItems = [
    {
        icon: "straighten",
        title: "Bespoke Stitching",
        desc: "Custom measurements on all garments"
    },
    {
        icon: "flight_takeoff",
        title: "Global Shipping",
        desc: "Complimentary heritage delivery"
    },
    {
        icon: "cached",
        title: "Easy Returns",
        desc: "30 days free exchange policy"
    },
    {
        icon: "handshake",
        title: "Heritage Craft",
        desc: "Handwoven by artisans since 2024"
    }
];

const TrustSignals = () => {
    return (
        <SectionContainer bgColor="bg-chocolate" className="py-16 md:py-20 border-b border-light-gold/10">
            <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 divide-y sm:divide-y-0 sm:divide-x divide-champagne/10">
                    {trustItems.map((item, idx) => (
                        <div key={idx} className={`flex flex-col items-center text-center ${idx !== 0 ? 'pt-12 sm:pt-0' : ''}`}>
                            <span className="material-symbols-outlined text-gold text-4xl mb-6 font-light">
                                {item.icon}
                            </span>
                            <h4 className="text-xs md:text-[10px] font-black uppercase tracking-[0.3em] text-champagne mb-3">
                                {item.title}
                            </h4>
                            <p className="text-[11px] uppercase tracking-widest text-champagne/40 max-w-[200px]">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </SectionContainer>
    );
};

export default TrustSignals;
