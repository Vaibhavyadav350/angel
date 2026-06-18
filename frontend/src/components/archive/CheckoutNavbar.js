import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import logo from '../../assets/logo.png';

const CheckoutNavbar = () => {
    return (
        <header className="sticky top-0 z-50 bg-champagne border-b border-bronze/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
                <div className="w-12"></div> {/* Spacer for perfect centering */}

                {/* Centered Brand Logo */}
                <Link to="/" className="text-center group flex items-center justify-center">
                    <img src={logo} alt="Angel Fashion Studio Logo" className="h-14 sm:h-20 object-contain" />
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
