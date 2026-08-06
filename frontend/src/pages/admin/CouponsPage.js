import React, { useState, useEffect } from 'react';
import { SidebarWithHeader } from '../../components/admin';
import { DataTable, ConfirmDialog } from '../../components/admin/ui';
import { useAdminCouponStore } from '../../stores';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EMPTY_FORM = {
  code: '',
  discountType: 'PERCENTAGE',
  amount: '',
  expiryDate: '',
  minPurchase: 0,
  usageLimit: 100,
  perCustomerLimit: 1,
  excludeDiscountedItems: true,
  firstOrderOnly: false,
};

const CouponsPage = () => {
  const { coupons, coupons_loading, fetchCoupons, createCoupon, deleteCoupon } = useAdminCouponStore();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { success } = await createCoupon({
      ...form,
      amount: Number(form.amount) || 0,
      minPurchase: Number(form.minPurchase) || 0,
      usageLimit: Number(form.usageLimit) || 0,
      perCustomerLimit: Number(form.perCustomerLimit) || 0,
    });
    setSaving(false);
    if (success) {
      setShowModal(false);
      setForm(EMPTY_FORM);
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setSaving(true);
    await deleteCoupon(confirmTarget._id);
    setSaving(false);
    setConfirmTarget(null);
  };

  // A coupon is only usable if it is active, unexpired AND has uses left —
  // showing "Active" on an exhausted code sends the owner chasing a phantom bug.
  const statusOf = (c) => {
    if (c.active === false) return { label: 'Disabled', tone: 'bg-gray-100 text-gray-600' };
    if (new Date(c.expiryDate) <= new Date()) return { label: 'Expired', tone: 'bg-red-100 text-red-700' };
    if ((c.usedCount || 0) >= (c.usageLimit || 0)) return { label: 'Fully Used', tone: 'bg-amber-100 text-amber-700' };
    return { label: 'Active', tone: 'bg-emerald-100 text-emerald-700' };
  };

  const valueOf = (c) => {
    if (c.discountType === 'FREE_SHIPPING') return 'Free delivery';
    return c.discountType === 'PERCENTAGE' ? `${c.amount}% off` : `$${c.amount} off`;
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (c) => (
        <span className="bg-bronze/10 text-bronze px-3 py-1 rounded font-bold text-xs uppercase tracking-widest">
          {c.code}
        </span>
      ),
    },
    { key: 'discount', header: 'Discount', render: (c) => <span className="text-xs font-bold text-bronze">{valueOf(c)}</span> },
    {
      key: 'conditions',
      header: 'Conditions',
      render: (c) => (
        <span className="text-[10px] text-bronze/50 leading-relaxed">
          {Number(c.minPurchase) > 0 ? `Min spend $${c.minPurchase}` : 'No minimum'}
          {c.excludeDiscountedItems ? ' · Full-price items only' : ' · Includes sale items'}
          {c.firstOrderOnly ? ' · First order only' : ''}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const s = statusOf(c);
        return <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${s.tone}`}>{s.label}</span>;
      },
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (c) => (
        <span className="text-xs text-bronze/60 font-medium">
          {c.usedCount || 0} / {c.usageLimit}
          {Number(c.perCustomerLimit) > 0 && (
            <span className="block text-[9px] text-bronze/40">max {c.perCustomerLimit} per customer</span>
          )}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (c) => (
        <button
          onClick={() => setConfirmTarget(c)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label={`Delete ${c.code}`}
        >
          <FaTrash />
        </button>
      ),
    },
  ];

  const inputClass =
    'w-full bg-champagne/10 border border-bronze/10 p-3 rounded-lg text-xs font-bold text-bronze outline-none focus:border-bronze transition-colors';
  const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-bronze/40 mb-2';

  return (
    <SidebarWithHeader>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-editorial font-black text-bronze uppercase tracking-widest">Promotions</h1>
          <p className="text-xs text-bronze/40 mt-2 font-bold uppercase tracking-[0.2em]">Manage Discount Codes &amp; Coupons</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-bronze text-white px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-bronze/90 transition-colors"
        >
          <FaPlus /> Create Coupon
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={coupons}
        loading={coupons_loading}
        emptyMessage="No coupons yet"
        emptyHint="Create a discount code and it will be available at checkout straight away."
        onRetry={fetchCoupons}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete this coupon?"
        message={
          confirmTarget
            ? `"${confirmTarget.code}" will stop working immediately for any customer who tries to use it. This cannot be undone.`
            : ''
        }
        busy={saving}
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />

      {showModal && (
        <div className="fixed inset-0 bg-bronze/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-xl p-8 border border-bronze/10 shadow-2xl my-8">
            <h2 className="text-xl font-editorial font-black text-bronze uppercase tracking-widest mb-6 text-center">New Coupon</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Coupon Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setField('code', e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="e.g. SUMMER25"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Discount Type</label>
                  <select value={form.discountType} onChange={(e) => setField('discountType', e.target.value)} className={inputClass}>
                    <option value="PERCENTAGE">Percentage off</option>
                    <option value="FIXED_AMOUNT">Fixed amount off</option>
                    <option value="FREE_SHIPPING">Free delivery</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    {form.discountType === 'PERCENTAGE' ? 'Percent (%)' : form.discountType === 'FIXED_AMOUNT' ? 'Amount ($)' : 'Not needed'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setField('amount', e.target.value)}
                    className={inputClass}
                    disabled={form.discountType === 'FREE_SHIPPING'}
                    required={form.discountType !== 'FREE_SHIPPING'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setField('expiryDate', e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Minimum Spend ($)</label>
                  <input type="number" min="0" value={form.minPurchase} onChange={(e) => setField('minPurchase', e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Total Uses Allowed</label>
                  <input type="number" min="1" value={form.usageLimit} onChange={(e) => setField('usageLimit', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Uses Per Customer</label>
                  <input type="number" min="0" value={form.perCustomerLimit} onChange={(e) => setField('perCustomerLimit', e.target.value)} className={inputClass} />
                  <p className="text-[9px] text-bronze/40 mt-1">0 means unlimited</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-bronze/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.excludeDiscountedItems}
                    onChange={(e) => setField('excludeDiscountedItems', e.target.checked)}
                    className="accent-bronze"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/70">Full-price items only</span>
                </label>
                <p className="text-[9px] text-bronze/40 pl-6">
                  Recommended. Stops the coupon stacking on products that are already marked down.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input type="checkbox" checked={form.firstOrderOnly} onChange={(e) => setField('firstOrderOnly', e.target.checked)} className="accent-bronze" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/70">First order only</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-bronze/10 text-[10px] font-bold uppercase tracking-widest text-bronze/40 hover:bg-champagne/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-bronze text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-bronze/90 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarWithHeader>
  );
};

export default CouponsPage;
