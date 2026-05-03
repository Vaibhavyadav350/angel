import React, { useEffect, useState } from 'react';
import SidebarWithHeader from '../../components/admin/SidebarWithHeader';
import { useCollectionContext } from '../../context/admin_collection_context';
import { toast } from 'react-toastify';

const emptyCollection = {
    name: '',
    description: '',
    imageUrl: '',
    ctaLink: '',
    sortOrder: 1,
    isVisible: true,
};

const CollectionFormModal = ({ collection, onClose, onSave }) => {
    const [form, setForm] = useState(collection || emptyCollection);
    const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name) { toast.error('Collection name is required.'); return; }
        onSave(form);
    };

    const inputClass = "w-full bg-white border border-bronze/20 px-4 py-3 text-sm font-medium text-bronze focus:outline-none focus:border-gold rounded transition-colors";
    const labelClass = "block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-8 border-b border-bronze/10 flex items-center justify-between">
                    <h2 className="text-2xl font-editorial font-black text-bronze uppercase tracking-tighter">
                        {collection?._id ? 'Edit Collection' : 'New Collection'}
                    </h2>
                    <button onClick={onClose} className="text-bronze/40 hover:text-bronze"><span className="material-symbols-outlined">close</span></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className={labelClass}>Collection Name *</label>
                        <input className={inputClass} value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="The Bridal Edit" />
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea className={`${inputClass} resize-none`} rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Handpicked bespoke bridal collections..." />
                    </div>
                    <div>
                        <label className={labelClass}>Cover Image URL</label>
                        <input className={inputClass} value={form.imageUrl} onChange={e => handleChange('imageUrl', e.target.value)} placeholder="/assets/landing/hero-lehenga.jpg" />
                        {form.imageUrl && (
                            <div className="mt-3 h-36 overflow-hidden rounded border border-bronze/10">
                                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>CTA Link</label>
                            <input className={inputClass} value={form.ctaLink} onChange={e => handleChange('ctaLink', e.target.value)} placeholder="/products?collection=Bridal" />
                        </div>
                        <div>
                            <label className={labelClass}>Sort Order</label>
                            <input type="number" min="1" className={inputClass} value={form.sortOrder} onChange={e => handleChange('sortOrder', parseInt(e.target.value))} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.isVisible} onChange={e => handleChange('isVisible', e.target.checked)} />
                            <div className="w-11 h-6 bg-bronze/20 rounded-full peer peer-checked:bg-gold after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                        </label>
                        <span className="text-sm font-bold text-bronze">Visible on Landing Page</span>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button type="submit" className="flex-1 py-4 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors rounded">
                            {collection?._id ? 'Save Changes' : 'Create Collection'}
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

const CollectionsPage = () => {
    const { collections, getCollections, createCollection, updateCollection, deleteCollection, toggleVisibility } = useCollectionContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);

    useEffect(() => { getCollections(); }, [getCollections]);

    const handleSave = (data) => {
        if (editingCollection?._id) {
            updateCollection(editingCollection._id, data);
            toast.success('Collection updated!');
        } else {
            createCollection(data);
            toast.success('Collection created!');
        }
        setModalOpen(false);
        setEditingCollection(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this collection? Products will not be affected.')) {
            deleteCollection(id);
            toast.success('Collection deleted.');
        }
    };

    return (
        <SidebarWithHeader>
            <div className="bg-champagne min-h-screen p-8">
                <div className="flex items-start justify-between mb-10">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-2">Content Management</p>
                        <h1 className="text-5xl font-editorial font-black text-bronze uppercase tracking-tighter">Collections</h1>
                        <p className="text-sm text-bronze/50 mt-2">{collections.length} collections · {collections.filter(c => c.isVisible).length} visible</p>
                    </div>
                    <button
                        onClick={() => { setEditingCollection(null); setModalOpen(true); }}
                        className="flex items-center gap-3 px-6 py-3 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors rounded"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Collection
                    </button>
                </div>

                {/* Collections Table */}
                <div className="bg-white rounded-lg border border-bronze/10 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 px-6 py-4 border-b border-bronze/10 text-[9px] font-bold uppercase tracking-[0.4em] text-bronze/40">
                        <div>Collection</div>
                        <div className="text-center">Products</div>
                        <div className="text-center">Sort Order</div>
                        <div className="text-center">Status</div>
                        <div className="text-right">Actions</div>
                    </div>
                    {collections.sort((a, b) => a.sortOrder - b.sortOrder).map(col => (
                        <div key={col._id} className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 px-6 py-5 border-b border-bronze/5 last:border-0 items-center hover:bg-champagne/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded overflow-hidden bg-bronze/5 shrink-0">
                                    <img src={col.imageUrl} alt={col.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                </div>
                                <div>
                                    <p className="font-editorial font-bold text-bronze text-base">{col.name}</p>
                                    <p className="text-[11px] text-bronze/40 mt-0.5 line-clamp-1">{col.description}</p>
                                </div>
                            </div>
                            <div className="text-center text-sm font-bold text-bronze">{col.productCount ?? 0}</div>
                            <div className="text-center text-sm text-bronze/60">#{col.sortOrder}</div>
                            <div className="flex justify-center">
                                <span className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded ${col.isVisible ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                                    {col.isVisible ? 'Visible' : 'Hidden'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setEditingCollection(col); setModalOpen(true); }} className="p-2 hover:bg-gold/10 rounded transition-colors text-bronze/60 hover:text-gold">
                                    <span className="material-symbols-outlined text-base">edit</span>
                                </button>
                                <button onClick={() => toggleVisibility(col._id)} className="p-2 hover:bg-gold/10 rounded transition-colors text-bronze/60 hover:text-gold">
                                    <span className="material-symbols-outlined text-base">{col.isVisible ? 'visibility_off' : 'visibility'}</span>
                                </button>
                                <button onClick={() => handleDelete(col._id)} className="p-2 hover:bg-red-50 rounded transition-colors text-bronze/40 hover:text-red-500">
                                    <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && (
                <CollectionFormModal
                    collection={editingCollection}
                    onClose={() => { setModalOpen(false); setEditingCollection(null); }}
                    onSave={handleSave}
                />
            )}
        </SidebarWithHeader>
    );
};

export default CollectionsPage;
