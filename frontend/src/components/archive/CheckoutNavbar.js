import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

const CheckoutNavbar = () => {
    return (
        <header className="sticky top-0 z-50 bg-champagne border-b border-bronze/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
                <div className="w-12"></div> {/* Spacer for perfect centering */}

                {/* Centered Brand Logo */}
                <Link to="/" className="text-center group flex flex-col items-center">
                    <h1 className="font-editorial text-3xl sm:text-4xl text-bronze uppercase font-black tracking-tighter hover:text-gold transition-colors duration-500">
                        ANGEL
                    </h1>
                    <p className="font-editorial text-[9px] sm:text-[10px] text-bronze/60 uppercase tracking-[0.4em] font-medium mt-1">
                        Fashion Studio
                    </p>
                </Link>

                {/* Secure Marker */}
                <div className="flex items-center gap-2 text-bronze/60">
                    <FiLock className="text-xl" />
                    <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-bronze/40">Secure</span>
                </div>
            </div>
        </header>
    );
};

export default CheckoutNavbar;
