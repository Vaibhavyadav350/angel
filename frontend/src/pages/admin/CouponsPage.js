import React, { useState, useEffect } from 'react';
import { SidebarWithHeader } from '../../components/admin';
import { useAdminCouponStore } from '../../stores';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CouponsPage = () => {
    const { coupons, fetchCoupons, createCoupon, deleteCoupon } = useAdminCouponStore();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        amount: '',
        expiryDate: '',
        minPurchase: 0,
        usageLimit: 100
    });

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success } = await createCoupon(formData);
        if (success) {
            setShowModal(false);
            setFormData({ code: '', discountType: 'PERCENTAGE', amount: '', expiryDate: '', minPurchase: 0, usageLimit: 100 });
        }
    };

    return (
        <SidebarWithHeader>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-editorial font-black text-bronze uppercase tracking-widest">Promotions</h1>
                    <p className="text-xs text-bronze/40 mt-2 font-bold uppercase tracking-[0.2em]">Manage Discount Codes & Coupons</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-bronze text-white px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-bronze/90 transition-all"
                >
                    <FaPlus /> Create Coupon
                </button>
            </div>

            <div className="bg-white border border-bronze/10 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-bronze/5 bg-champagne/10">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-bronze/40">Code</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-bronze/40">Discount</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-bronze/40">Status</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-bronze/40">Usage</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-bronze/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id} className="border-b border-bronze/5 hover:bg-champagne/5 transition-all">
                                <td className="p-4">
                                    <span className="bg-bronze/10 text-bronze px-3 py-1 rounded font-bold text-xs uppercase tracking-widest">{coupon.code}</span>
                                </td>
                                <td className="p-4 text-xs font-bold text-bronze">
                                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.amount}%` : `$${coupon.amount}`}
                                </td>
                                <td className="p-4">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${new Date(coupon.expiryDate) > new Date() ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-bronze/60 italic font-medium">
                                    {coupon.usedCount} / {coupon.usageLimit}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => deleteCoupon(coupon._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Integration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-bronze/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-md rounded-xl p-8 border border-bronze/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-editorial font-black text-bronze uppercase tracking-widest mb-6 text-center">New Creative Coupon</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-bronze/40 mb-2">Coupon Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full bg-champagne/10 border border-bronze/10 p-3 rounded-lg text-xs font-bold text-bronze outline-none focus:border-bronze transition-all"
                                    placeholder="e.g. SUMMER25"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-bronze/40 mb-2">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full bg-champagne/10 border border-bronze/10 p-3 rounded-lg text-xs font-bold text-bronze outline-none"
                                    >
                                        <option value="PERCENTAGE">Percentage</option>
                                        <option value="FIXED_AMOUNT">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-bronze/40 mb-2">Amount</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        className="w-full bg-champagne/10 border border-bronze/10 p-3 rounded-lg text-xs font-bold text-bronze outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-bronze/40 mb-2">Expiry Date</label>
                                <input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="w-full bg-champagne/10 border border-bronze/10 p-3 rounded-lg text-xs font-bold text-bronze outline-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border border-bronze/10 text-[10px] font-bold uppercase tracking-widest text-bronze/40 hover:bg-champagne/5 rounded-lg transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-bronze text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-bronze/90 transition-all">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SidebarWithHeader>
    );
};

export default CouponsPage;
