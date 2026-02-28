import React, { useState } from 'react';
import { useProductsContext } from '../context/products_context';
import { toast } from 'react-toastify';
import { MdEmail, MdClose } from 'react-icons/md';

const NotifyMeModal = ({ productId, productName, onClose }) => {
    const { subscribeToRestock } = useProductsContext();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await subscribeToRestock(productId, email);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            onClose();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bronze/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-bronze/10 animate-in zoom-in-95 duration-300">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-bronze/30 hover:text-bronze transition-colors"
                    >
                        <MdClose className="text-2xl" />
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-editorial font-black text-bronze uppercase tracking-widest mb-2">Back in Archive</h2>
                        <p className="text-xs text-bronze/50 font-bold uppercase tracking-[0.1em]">Notify me when {productName} returns</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-bronze/40 ml-1">Your Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bronze/30">
                                    <MdEmail className="text-xl" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="archivist@heritage.com"
                                    className="w-full pl-12 pr-4 py-4 bg-champagne/10 border border-bronze/10 rounded-xl focus:border-gold outline-none transition-all text-sm font-medium text-bronze"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-bronze text-champagne text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gold transition-all active:scale-[0.98] shadow-xl shadow-bronze/20 disabled:opacity-50"
                        >
                            {loading ? 'Processing Engagement...' : 'Register for Restock Alert'}
                        </button>
                    </form>

                    <p className="mt-8 text-[9px] text-center text-bronze/30 font-bold uppercase tracking-widest leading-relaxed">
                        By joining our archival waitlist, you agree to receive a one-time notification when this heritage item is reclaimed.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotifyMeModal;
