import React from 'react';
import { SectionContainer } from './shared';

const diaries = [
    {
        name: "Aanya & Rahul",
        location: "Udaipur, India",
        img: "/assets/landing/client-udaipur.jpg",
        colSpan: "col-span-1 md:col-span-2",
        aspect: "aspect-[4/3]"
    },
    {
        name: "The Royal Mehendi",
        location: "Jaipur, India",
        img: "/assets/landing/client-mehendi.jpg",
        colSpan: "col-span-1",
        aspect: "aspect-[3/4]"
    },
    {
        name: "Priya's Sangeet",
        location: "London, UK",
        img: "/assets/landing/client-sangeet.jpg",
        colSpan: "col-span-1",
        aspect: "aspect-[3/4]"
    },
    {
        name: "Bespoke Sherwani",
        location: "Mumbai, India",
        img: "/assets/landing/client-groomsquad.jpg",
        colSpan: "col-span-1 md:col-span-2",
        aspect: "aspect-[4/3]"
    }
];

const ClientDiaries = () => {
    return (
        <SectionContainer bgColor="bg-white" className="py-24 lg:py-32">
            <div className="container mx-auto px-4 lg:px-12 max-w-7xl">

                {/* Header Sequence */}
                <div className="text-center mb-16 lg:mb-24">
                    <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold block mb-4">
                        Social Proof
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-editorial font-black text-bronze uppercase leading-none tracking-tighter">
                        Client <span className="text-gold italic font-light">Diaries</span>
                    </h2>
                    <p className="mt-6 text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-bronze/40 max-w-lg mx-auto">
                        Real brides and grooms celebrating their finest moments in Royal Heritage attire.
                    </p>
                </div>

                {/* Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(250px,_1fr)]">
                    {diaries.map((diary, idx) => (
                        <div key={idx} className={`group relative overflow-hidden rounded-xl ${diary.colSpan}`}>
                            <div className={`w-full h-full min-h-[300px] bg-champagne ${diary.aspect}`}>
                                <img
                                    src={diary.img}
                                    alt={diary.name}
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <h3 className="text-xl md:text-2xl font-editorial font-bold text-white uppercase mb-1">
                                        {diary.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[10px] text-gold">location_on</span>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-champagne/80">
                                            {diary.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-bronze hover:text-gold transition-colors pb-2 border-b border-bronze/20 hover:border-gold">
                        Follow on Instagram
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                </div>

            </div>
        </SectionContainer>
    );
};

export default ClientDiaries;
