import React, { useEffect, useState } from 'react';
import { useProductsContext } from '../../context/products_context';
import { Link } from 'react-router-dom';
import { OptimizedImage } from './shared';

const RecentlyViewed = () => {
    const { products } = useProductsContext();
    const [viewedProducts, setViewedProducts] = useState([]);

    useEffect(() => {
        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (recentlyViewedIds.length > 0 && products.length > 0) {
            const list = recentlyViewedIds
                .map(id => products.find(p => (p._id || p.id) === id))
                .filter(Boolean)
                .slice(0, 4); // Show top 4
            setViewedProducts(list);
        }
    }, [products]);

    if (viewedProducts.length === 0) return null;

    return (
        <section className="py-24 px-8 lg:px-24 bg-white border-t border-bronze/5">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block mb-4">Your Journey</span>
                        <h2 className="text-4xl lg:text-6xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
                            Recently<br />Browsed
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {viewedProducts.map((p) => (
                        <Link to={`/products/${p._id || p.id}`} key={p._id || p.id} className="group block">
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 rounded-[2px]">
                                <OptimizedImage
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-bronze/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <h3 className="text-xs font-bold text-bronze uppercase tracking-widest mb-1 truncate">{p.name}</h3>
                            <span className="text-[10px] font-medium text-gold uppercase tracking-[0.2em]">View Artifact</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewed;
