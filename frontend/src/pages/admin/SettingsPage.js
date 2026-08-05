import React, { useEffect, useState } from 'react';
import SidebarWithHeader from '../../components/admin/SidebarWithHeader';
import { useSettingsContext } from '../../context/settings_context';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const { settings, loading, updateSettings } = useSettingsContext();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  // Hydrate the form once settings load.
  useEffect(() => {
    if (!loading) setForm(settings);
  }, [loading, settings]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async () => {
    setSaving(true);
    const res = await updateSettings({
      standardShippingPrice: Number(form.standardShippingPrice) || 0,
      expressShippingPrice: Number(form.expressShippingPrice) || 0,
      expressEnabled: !!form.expressEnabled,
      freeShippingThreshold: Number(form.freeShippingThreshold) || 0,
      gstRate: Number(form.gstRate) || 0,
      announcementText: form.announcementText || '',
    });
    setSaving(false);
    if (res.success) toast.success('Store settings saved', { position: 'top-center' });
    else toast.error(res.message || 'Failed to save settings', { position: 'top-center' });
  };

  const inputClass = 'w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2';
  const moneyField = (name, label, hint) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-bronze/40 text-sm">$</span>
        <input className={`${inputClass} pl-8`} type="number" min="0" value={form[name] ?? ''} onChange={(e) => setField(name, e.target.value)} />
      </div>
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
              <input className={inputClass} type="number" min="0" value={form.gstRate ?? ''} onChange={(e) => setField('gstRate', e.target.value)} />
              <p className="text-[9px] text-bronze/40 mt-1">Prices are GST-inclusive; this is shown as "Includes GST" on invoices.</p>
            </div>
          </div>

          {/* Announcement */}
          <div className={card}>
            <h4 className={heading}>Announcement Bar</h4>
            <textarea
              className={`${inputClass} min-h-[90px] resize-y`}
              value={form.announcementText ?? ''}
              onChange={(e) => setField('announcementText', e.target.value)}
              placeholder="e.g. Complimentary shipping on all domestic orders."
            />
          </div>
        </div>
      )}
    </SidebarWithHeader>
  );
};

export default SettingsPage;
