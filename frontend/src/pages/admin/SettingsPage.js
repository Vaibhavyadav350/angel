import React, { useEffect, useState } from 'react';
import SidebarWithHeader from '../../components/admin/SidebarWithHeader';
import { useSettingsContext } from '../../context/settings_context';
import { toast } from 'react-toastify';
import shippingConfig from '../../utils/shipping.json';
import NumberField from '../../components/admin/ui/NumberField';

const SettingsPage = () => {
  const { settings, loading, updateSettings } = useSettingsContext();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  // Hydrate the form once settings load.
  useEffect(() => {
    if (!loading) setForm(settings);
  }, [loading, settings]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  // Weight bands. Falls back to the shipped defaults until she saves her own.
  const bands =
    Array.isArray(form.shippingBands) && form.shippingBands.length > 0
      ? form.shippingBands
      : shippingConfig.bands;

  const setBand = (index, key, value) =>
    setForm((f) => {
      const current =
        Array.isArray(f.shippingBands) && f.shippingBands.length > 0
          ? f.shippingBands
          : shippingConfig.bands;
      const next = current.map((b, i) => (i === index ? { ...b, [key]: value } : b));
      return { ...f, shippingBands: next };
    });

  // `|| 0` is wrong for any setting where 0 is a meaningful (and dangerous) value.
  // quoteAboveGrams = 0 means "every order is too heavy to ship", which would have
  // blocked the whole checkout the first time this page was saved.
  const num = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateSettings({
      standardShippingPrice: num(form.standardShippingPrice, 8),
      expressShippingPrice: num(form.expressShippingPrice, 18),
      expressEnabled: !!form.expressEnabled,
      // 0 is legitimate here — it switches free shipping off.
      freeShippingThreshold: Math.max(0, Number(form.freeShippingThreshold) || 0),
      shippingBands: bands
        .map((b) => ({
          maxGrams: num(b.maxGrams, 0),
          standard: Math.max(0, Number(b.standard) || 0),
          express: Math.max(0, Number(b.express) || 0),
          label: b.label || '',
        }))
        .filter((b) => b.maxGrams > 0),
      // 0 is legitimate — it switches the surcharge off.
      remoteSurcharge: Math.max(0, Number(form.remoteSurcharge) || 0),
      quoteAboveGrams: num(form.quoteAboveGrams, shippingConfig.quoteAboveGrams),
      maxShippingCharge: num(form.maxShippingCharge, shippingConfig.maxShippingCharge),
      gstRate: num(form.gstRate, 10),
    });
    setSaving(false);
    if (res.success) toast.success('Store settings saved', { position: 'top-center' });
    else toast.error(res.message || 'Failed to save settings', { position: 'top-center' });
  };

  const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2';
  const moneyField = (name, label, hint) => (
    <div>
      <label className={labelClass}>{label}</label>
      <NumberField prefix="$" min={0} placeholder="0" value={form[name]} onChange={(v) => setField(name, v)} blankWhenZero={false} />
      {hint && <p className="text-[9px] text-bronze/40 mt-1">{hint}</p>}
    </div>
  );

  const card = 'bg-white border border-bronze/10 rounded-lg p-6';
  const heading = 'text-[11px] font-black uppercase tracking-widest text-bronze border-b border-bronze/10 pb-2 mb-5';

  return (
    <SidebarWithHeader>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-editorial font-black text-bronze uppercase tracking-widest">Store Settings</h1>
          <p className="text-[10px] text-bronze/40 mt-2 font-bold uppercase tracking-[0.3em]">Shipping · Tax · Announcement</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-8 py-3 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-lg hover:bg-gold hover:text-bronze shadow-lg shadow-bronze/20 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping */}
          <div className={card}>
            <h4 className={heading}>Shipping (AUD · incl. GST)</h4>
            <div className="grid grid-cols-2 gap-4">
              {moneyField('standardShippingPrice', 'Standard Fee')}
              {moneyField('expressShippingPrice', 'Express Fee')}
            </div>
            <div className="mt-4">
              {moneyField('freeShippingThreshold', 'Free Standard Over', '0 disables free shipping')}
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-5 p-3 bg-bronze/5 rounded-lg border border-bronze/10">
              <input type="checkbox" checked={!!form.expressEnabled} onChange={(e) => setField('expressEnabled', e.target.checked)} className="accent-bronze w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/80">Offer Express delivery at checkout</span>
            </label>
          </div>

          {/* Tax */}
          <div className={card}>
            <h4 className={heading}>Tax</h4>
            <div>
              <label className={labelClass}>GST Rate (%)</label>
              <NumberField suffix="%" min={0} max={100} placeholder="10" blankWhenZero={false} value={form.gstRate} onChange={(v) => setField('gstRate', v)} />
              <p className="text-[9px] text-bronze/40 mt-1">Prices are GST-inclusive; this is shown as "Includes GST" on invoices.</p>
            </div>
          </div>

          {/* Delivery pricing by parcel weight */}
          <div className={card}>
            <h4 className={heading}>Delivery Price by Parcel Weight (AUD · incl. GST)</h4>
            <p className="text-[10px] text-bronze/50 mb-4 leading-relaxed">
              The weight of each order is worked out automatically from what the customer bought,
              so you never enter a weight yourself. A single garment or a handful of jewellery
              pieces falls into the smallest bands. Only genuinely bulky orders move up.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[9px] font-black uppercase tracking-widest text-bronze/50">
                    <th className="pb-2">Parcel Size</th>
                    <th className="pb-2">Regular Post</th>
                    <th className="pb-2">Express Post</th>
                  </tr>
                </thead>
                <tbody>
                  {bands.map((b, i) => (
                    <tr key={i} className="border-t border-bronze/5">
                      <td className="py-2 pr-4 text-bronze/70 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                        {b.label || `Up to ${(Number(b.maxGrams) / 1000).toFixed(1)} kg`}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="w-28">
                          <NumberField prefix="$" min={0} placeholder="0" blankWhenZero={false}
                            value={b.standard} onChange={(v) => setBand(i, 'standard', v)} />
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="w-28">
                          <NumberField prefix="$" min={0} placeholder="0" blankWhenZero={false}
                            value={b.express} onChange={(v) => setBand(i, 'express', v)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-bronze/10">
              {moneyField('remoteSurcharge', 'WA / NT / TAS Surcharge', 'Added to Regular Post for those states. 0 = off.')}
              {moneyField('maxShippingCharge', 'Maximum Delivery Charge', 'Safety cap — no order can ever be charged more than this.')}
              <div>
                <label className={labelClass}>Ask For A Quote Above</label>
                <div className="relative">
                  <NumberField
                    suffix="kg"
                    min={1}
                    placeholder={String(shippingConfig.quoteAboveGrams / 1000)}
                    value={Number(form.quoteAboveGrams ?? shippingConfig.quoteAboveGrams) / 1000}
                    onChange={(v) => setField('quoteAboveGrams', Math.round(v * 1000))}
                  />
                </div>
                <p className="text-[9px] text-bronze/40 mt-1">Orders heavier than this cannot check out — the customer is asked to contact you for a delivery quote.</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </SidebarWithHeader>
  );
};

export default SettingsPage;
