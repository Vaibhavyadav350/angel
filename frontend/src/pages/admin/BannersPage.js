import React, { useEffect, useState } from 'react';
import SidebarWithHeader from '../../components/admin/SidebarWithHeader';
import { useBannerContext } from '../../context/admin_banner_context';
import { toast } from 'react-toastify';

const PLACEMENTS = ['hero', 'promotional', 'announcement'];

const emptyBanner = {
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    placement: 'hero',
    isActive: true,
    sortOrder: 1,
};

const BannerFormModal = ({ banner, onClose, onSave }) => {
    const [form, setForm] = useState(banner || emptyBanner);
    const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.imageUrl) {
            toast.error('Title and Image URL are required.');
            return;
        }
        onSave(form);
    };

    const inputClass = "w-full bg-white border border-bronze/20 px-4 py-3 text-sm font-medium text-bronze focus:outline-none focus:border-gold rounded transition-colors";
    const labelClass = "block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-8 border-b border-bronze/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-editorial font-black text-bronze uppercase tracking-tighter">
                            {banner?._id ? 'Edit Banner' : 'New Banner'}
                        </h2>
                        <button onClick={onClose} className="text-bronze/40 hover:text-bronze transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Title *</label>
                            <input className={inputClass} value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="The Bridal Edit 2025" />
                        </div>
                        <div>
                            <label className={labelClass}>Subtitle</label>
                            <input className={inputClass} value={form.subtitle} onChange={e => handleChange('subtitle', e.target.value)} placeholder="Exclusive Handcrafted Lehengas" />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Image URL *</label>
                        <input className={inputClass} value={form.imageUrl} onChange={e => handleChange('imageUrl', e.target.value)} placeholder="/assets/landing/hero-lehenga.jpg or https://..." />
                        {form.imageUrl && (
                            <div className="mt-3 h-40 overflow-hidden rounded border border-bronze/10">
                                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>CTA Button Text</label>
                            <input className={inputClass} value={form.ctaText} onChange={e => handleChange('ctaText', e.target.value)} placeholder="Shop Now" />
                        </div>
                        <div>
                            <label className={labelClass}>CTA Link</label>
                            <input className={inputClass} value={form.ctaLink} onChange={e => handleChange('ctaLink', e.target.value)} placeholder="/products?category=Women" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Placement</label>
                            <select className={inputClass} value={form.placement} onChange={e => handleChange('placement', e.target.value)}>
                                {PLACEMENTS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Sort Order</label>
                            <input type="number" className={inputClass} value={form.sortOrder} min="1" onChange={e => handleChange('sortOrder', parseInt(e.target.value))} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => handleChange('isActive', e.target.checked)} />
                            <div className="w-11 h-6 bg-bronze/20 rounded-full peer peer-checked:bg-gold after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                        </label>
                        <span className="text-sm font-bold text-bronze">Active / Visible on Site</span>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button type="submit" className="flex-1 py-4 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors rounded">
                            {banner?._id ? 'Save Changes' : 'Create Banner'}
                        </button>
                        <button type="button" onClick={onClose} className="px-8 py-4 border border-bronze/20 text-bronze text-[10px] font-bold uppercase tracking-[0.3em] hover:border-gold transition-colors rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BannersPage = () => {
    const { banners, getBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus } = useBannerContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    useEffect(() => { getBanners(); }, [getBanners]);

    const handleSave = async (data) => {
        const isEdit = Boolean(editingBanner?._id);
        const res = isEdit
            ? await updateBanner(editingBanner._id, data)
            : await createBanner(data);
        if (res?.success) {
            toast.success(isEdit ? 'Banner updated successfully!' : 'Banner created successfully!');
            setModalOpen(false);
            setEditingBanner(null);
        } else {
            toast.error(res?.message || 'Failed to save banner');
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this banner permanently?')) {
            const res = await deleteBanner(id);
            if (res?.success) {
                toast.success('Banner deleted.');
            } else {
                toast.error(res?.message || 'Failed to delete banner');
            }
        }
    };

    const PLACEMENT_COLORS = {
        hero: 'bg-gold/10 text-gold border-gold/20',
        promotional: 'bg-green-50 text-green-700 border-green-200',
        announcement: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    return (
        <SidebarWithHeader>
            <div className="bg-champagne min-h-screen p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-10">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-2">Content Management</p>
                        <h1 className="text-5xl font-editorial font-black text-bronze uppercase tracking-tighter">Banners</h1>
                        <p className="text-sm text-bronze/50 mt-2">{banners.length} banners configured · {banners.filter(b => b.isActive).length} active</p>
                    </div>
                    <button
                        onClick={() => { setEditingBanner(null); setModalOpen(true); }}
                        className="flex items-center gap-3 px-6 py-3 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors rounded"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Banner
                    </button>
                </div>

                {/* Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...banners].sort((a, b) => a.sortOrder - b.sortOrder).map(banner => (
                        <div key={banner._id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-bronze/10 flex flex-col">
                            <div className="relative h-40 bg-bronze/5 overflow-hidden">
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                                <div className="absolute inset-0 items-center justify-center text-bronze/20 hidden">
                                    <span className="material-symbols-outlined text-4xl">image</span>
                                </div>
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider border rounded ${PLACEMENT_COLORS[banner.placement] || 'bg-bronze/10 text-bronze border-bronze/20'}`}>
                                        {banner.placement}
                                    </span>
                                    <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider border rounded ${banner.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                        {banner.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-bronze text-[10px] font-bold w-7 h-7 rounded-full flex items-center justify-center border border-bronze/10">
                                    #{banner.sortOrder}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <p className="font-editorial font-black text-bronze text-lg leading-tight">{banner.title}</p>
                                {banner.subtitle && <p className="text-[11px] text-bronze/50 mt-1">{banner.subtitle}</p>}
                                {banner.ctaText && (
                                    <div className="mt-3 flex items-center gap-2 text-[10px] text-bronze/60">
                                        <span className="material-symbols-outlined text-sm">link</span>
                                        {banner.ctaText} → {banner.ctaLink}
                                    </div>
                                )}
                            </div>
                            <div className="px-5 pb-5 flex items-center gap-3">
                                <button onClick={() => handleEdit(banner)} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-bronze/20 text-bronze text-[9px] font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors rounded">
                                    <span className="material-symbols-outlined text-sm">edit</span> Edit
                                </button>
                                <button onClick={() => toggleBannerStatus(banner._id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-bronze/20 text-bronze text-[9px] font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors rounded">
                                    <span className="material-symbols-outlined text-sm">{banner.isActive ? 'visibility_off' : 'visibility'}</span>
                                    {banner.isActive ? 'Hide' : 'Show'}
                                </button>
                                <button onClick={() => handleDelete(banner._id)} className="px-4 py-2.5 border border-red-200 text-red-500 text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors rounded">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {banners.length === 0 && (
                    <div className="text-center py-32">
                        <span className="material-symbols-outlined text-6xl text-bronze/20">image</span>
                        <p className="text-bronze/40 font-editorial text-2xl font-bold mt-4">No banners configured</p>
                        <p className="text-bronze/30 text-sm mt-2">Create your first banner to control the hero carousel.</p>
                    </div>
                )}
            </div>

            {modalOpen && (
                <BannerFormModal
                    banner={editingBanner}
                    onClose={() => { setModalOpen(false); setEditingBanner(null); }}
                    onSave={handleSave}
                />
            )}
        </SidebarWithHeader>
    );
};

export default BannersPage;
