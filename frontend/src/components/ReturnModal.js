import React, { useState } from 'react';
import { useOrderContext } from '../context/order_context';

const ReturnModal = ({ orderId, onClose }) => {
    const { requestReturn } = useOrderContext();
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const reasons = [
        'Size Issue - Too Small',
        'Size Issue - Too Large',
        'Defective / Damaged Piece',
        'Quality Not as Expected',
        'Received Wrong Item',
        'Changed My Mind',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) return;
        setLoading(true);
        const res = await requestReturn(orderId, reason);
        setLoading(false);
        if (res.success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
            <div
                className="absolute inset-0 bg-bronze/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-champagne rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="p-12 lg:p-16 space-y-12">
                    <div className="text-center space-y-4">
                        <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block">
                            Archival Assistance
                        </span>
                        <h2 className="text-4xl lg:text-6xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
                            Request<br />Return
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-bronze/40 block px-2">
                                Reason for Return
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {reasons.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setReason(r)}
                                        className={`text-left px-6 py-4 rounded-2xl text-xs font-bold transition-all border ${reason === r
                                                ? 'bg-bronze text-champagne border-bronze shadow-lg'
                                                : 'bg-white text-bronze border-bronze/5 hover:border-gold/30'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-5 border border-bronze/10 text-bronze text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!reason || loading}
                                className="flex-1 py-5 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold transition-all shadow-xl shadow-bronze/10 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Confirm Return'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReturnModal;
