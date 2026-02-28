import React from 'react';
import { useUserContext } from '../context/user_context';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/archive/shared';
import { formatPrice } from '../utils/helpers';

const WishlistPage = () => {
    const { wishlist, userLoading, currentUser } = useUserContext();

    if (userLoading) {
        return (
            <main className="bg-champagne min-h-screen pt-40 pb-20 px-8 text-center">
                <p className="text-bronze font-editorial text-2xl animate-pulse">Consulting the Archives...</p>
            </main>
        );
    }

    if (!currentUser) {
        return (
            <main className="bg-champagne min-h-screen flex items-center justify-center p-8">
                <div className="text-center space-y-8 max-w-md">
                    <h2 className="text-4xl font-editorial font-bold text-bronze uppercase">Private Collection</h2>
                    <p className="text-bronze/60 text-sm leading-relaxed">
                        Please sign in to view your personally curated archive of heritage artifacts.
                    </p>
                    <Link to="/login" className="inline-block px-10 py-4 bg-bronze text-champagne font-bold uppercase tracking-widest text-[10px] hover:bg-gold transition-all duration-500">
                        Sign In
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-champagne min-h-screen pt-40 pb-20 px-8 lg:px-24">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-20 text-center lg:text-left">
                    <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] mb-4 block">Personal Archive</span>
                    <h1 className="text-5xl lg:text-7xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
                        Your<br />Wishlist
                    </h1>
                </header>

                {wishlist.length === 0 ? (
                    <div className="py-20 text-center bg-white/30 border border-bronze/5 rounded-2xl">
                        <p className="text-bronze/40 font-editorial text-xl mb-8 uppercase">Your curation is empty</p>
                        <Link to="/products" className="text-gold font-bold uppercase tracking-widest text-xs hover:underline decoration-gold underline-offset-8">
                            Explore the Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
                        {wishlist.map((item) => (
                            <Link to={`/products/${item._id || item.id}`} key={item._id || item.id} className="group block">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                                    <OptimizedImage
                                        src={item.image || item.images?.[0]?.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-xl font-editorial font-bold text-bronze uppercase">{item.name}</h3>
                                <p className="text-gold font-bold text-sm">{formatPrice(item.price)}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default WishlistPage;
