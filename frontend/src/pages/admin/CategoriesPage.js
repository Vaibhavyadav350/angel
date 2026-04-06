import React, { useEffect, useState } from 'react';
import SidebarWithHeader from '../../components/admin/SidebarWithHeader';
import { useCategoryContext } from '../../context/admin_category_context';
import { toast } from 'react-toastify';

const CategoryRow = ({ category, onEdit, onDelete, onAddSub, onDeleteSub }) => {
    const [expanded, setExpanded] = useState(false);
    const [newSubName, setNewSubName] = useState('');

    const handleAddSub = () => {
        if (!newSubName.trim()) return;
        onAddSub(category._id, newSubName.trim());
        setNewSubName('');
        toast.success(`Subcategory "${newSubName.trim()}" added.`);
    };

    return (
        <div className="border border-bronze/10 rounded-lg overflow-hidden mb-4">
            {/* Category Header */}
            <div className="flex items-center justify-between bg-white px-6 py-4 hover:bg-champagne/30 transition-colors">
                <button className="flex items-center gap-4 flex-1 text-left" onClick={() => setExpanded(!expanded)}>
                    <div className="w-8 h-8 rounded-full bg-bronze/10 flex items-center justify-center text-bronze">
                        <span className="material-symbols-outlined text-sm">{category.icon || 'folder'}</span>
                    </div>
                    <div>
                        <p className="font-editorial font-bold text-bronze text-lg">{category.name}</p>
                        <p className="text-[10px] text-bronze/40 uppercase tracking-wider">{category.subcategories?.length || 0} subcategories</p>
                    </div>
                    <span className="material-symbols-outlined text-bronze/30 ml-2 transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                        expand_more
                    </span>
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(category)} className="p-2 hover:bg-gold/10 rounded transition-colors text-bronze/50 hover:text-gold">
                        <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button onClick={() => onDelete(category._id)} className="p-2 hover:bg-red-50 rounded transition-colors text-bronze/30 hover:text-red-500">
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            </div>

            {/* Expanded Subcategories */}
            {expanded && (
                <div className="bg-champagne/20 px-6 pb-5 pt-3 border-t border-bronze/5">
                    <div className="space-y-2 mb-4">
                        {(category.subcategories || []).map(sub => (
                            <div key={sub._id} className="flex items-center justify-between bg-white px-4 py-3 rounded border border-bronze/10">
                                <div className="flex items-center gap-3">
                                    <span className="text-bronze/30 text-sm">↳</span>
                                    <span className="text-sm font-medium text-bronze">{sub.name}</span>
                                    <span className="text-[9px] font-mono text-bronze/30 bg-bronze/5 px-2 py-0.5 rounded">{sub.slug}</span>
                                </div>
                                <button onClick={() => onDeleteSub(category._id, sub._id)} className="p-1 hover:bg-red-50 rounded transition-colors text-bronze/30 hover:text-red-400">
                                    <span className="material-symbols-outlined text-sm">remove_circle</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add Subcategory */}
                    <div className="flex gap-3">
                        <input
                            className="flex-1 bg-white border border-bronze/20 px-4 py-2.5 text-sm font-medium text-bronze focus:outline-none focus:border-gold rounded transition-colors placeholder:text-bronze/30"
                            placeholder="New subcategory name (e.g. Anarkali)"
                            value={newSubName}
                            onChange={e => setNewSubName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddSub()}
                        />
                        <button
                            onClick={handleAddSub}
                            className="px-5 py-2.5 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold transition-colors rounded"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CategoryFormModal = ({ category, onClose, onSave }) => {
    const [form, setForm] = useState(category || { name: '', slug: '', icon: 'folder', sortOrder: 1, isVisible: true });
    const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-editorial font-black text-bronze uppercase tracking-tighter">
                        {category ? 'Edit Category' : 'New Category'}
                    </h2>
                    <button onClick={onClose}><span className="material-symbols-outlined text-bronze/40">close</span></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2">Name *</label>
                        <input className="w-full border border-bronze/20 px-4 py-3 text-sm text-bronze focus:outline-none focus:border-gold rounded" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Women" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2">Icon (Material Symbol name)</label>
                        <input className="w-full border border-bronze/20 px-4 py-3 text-sm text-bronze focus:outline-none focus:border-gold rounded" value={form.icon} onChange={e => handleChange('icon', e.target.value)} placeholder="female, male, diamond, child_care" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2">Sort Order</label>
                            <input type="number" min="1" className="w-full border border-bronze/20 px-4 py-3 text-sm text-bronze focus:outline-none focus:border-gold rounded" value={form.sortOrder} onChange={e => handleChange('sortOrder', parseInt(e.target.value))} />
                        </div>
                        <div className="flex items-end pb-0.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isVisible} onChange={e => handleChange('isVisible', e.target.checked)} className="rounded" />
                                <span className="text-sm font-bold text-bronze">Visible</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button onClick={() => onSave(form)} className="flex-1 py-3.5 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors rounded">
                        Save
                    </button>
                    <button onClick={onClose} className="px-6 border border-bronze/20 text-bronze text-[10px] font-bold uppercase tracking-[0.3em] hover:border-gold transition-colors rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const CategoriesPage = () => {
    const { categories, getCategories, createCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory } = useCategoryContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => { getCategories(); }, []);

    const handleSave = (data) => {
        if (editingCategory?._id) {
            updateCategory(editingCategory._id, data);
            toast.success('Category updated!');
        } else {
            createCategory(data);
            toast.success('Category created!');
        }
        setModalOpen(false);
        setEditingCategory(null);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Delete this category? This will not delete the products, but filters may break.')) {
            deleteCategory(id);
            toast.success('Category deleted.');
        }
    };

    const totalSubcategories = categories.reduce((t, c) => t + (c.subcategories?.length || 0), 0);

    return (
        <SidebarWithHeader>
            <div className="bg-champagne min-h-screen p-8">
                <div className="flex items-start justify-between mb-10">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-2">Navigation Structure</p>
                        <h1 className="text-5xl font-editorial font-black text-bronze uppercase tracking-tighter">Categories</h1>
                        <p className="text-sm text-bronze/50 mt-2">{categories.length} categories · {totalSubcategories} subcategories</p>
                    </div>
                    <button
                        onClick={() => { setEditingCategory(null); setModalOpen(true); }}
                        className="flex items-center gap-3 px-6 py-3 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors rounded"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Category
                    </button>
                </div>

                {/* Info Banner */}
                <div className="bg-gold/10 border border-gold/20 rounded-lg px-6 py-4 mb-8 flex items-start gap-3">
                    <span className="material-symbols-outlined text-gold mt-0.5">info</span>
                    <p className="text-sm text-bronze/70">
                        Categories power the navigation menu and product filters. Click a category to expand and manage its subcategories. Changes here are reflected site-wide. <strong>Backend sync coming in Phase 3.</strong>
                    </p>
                </div>

                {/* Category Tree */}
                <div>
                    {categories.sort((a, b) => a.sortOrder - b.sortOrder).map(cat => (
                        <CategoryRow
                            key={cat._id}
                            category={cat}
                            onEdit={(c) => { setEditingCategory(c); setModalOpen(true); }}
                            onDelete={handleDeleteCategory}
                            onAddSub={addSubcategory}
                            onDeleteSub={deleteSubcategory}
                        />
                    ))}
                </div>
            </div>

            {modalOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    onClose={() => { setModalOpen(false); setEditingCategory(null); }}
                    onSave={handleSave}
                />
            )}
        </SidebarWithHeader>
    );
};

export default CategoriesPage;
