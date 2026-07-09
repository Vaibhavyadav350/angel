import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BiChevronDown } from 'react-icons/bi';
import { formatPrice } from '../../utils/helpers';
import { useAdminProductStore, useAdminAuthStore } from '../../stores';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdateProductModal from './UpdateProductModal';

function ProductsTable({ products }) {
  const { currentAdmin: currentUser } = useAdminAuthStore();
  const { fetchProducts, deleteProduct } = useAdminProductStore();
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const buttonRefs = useRef({});

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await deleteProduct(id);
    setLoading(false);
    if (response.success) {
      toast.success(response.message, { position: 'top-center' });
      return await fetchProducts(true);
    } else {
      toast.error(response.message, { position: 'top-center' });
    }
  };

  const toggleMenu = (id) => {
    if (menuOpenId === id) {
      setMenuOpenId(null);
    } else {
      const button = buttonRefs.current[id];
      if (!button) return; // ref not attached yet — avoid throwing and killing the handler
      const rect = button.getBoundingClientRect();
      // Menu is position:fixed (viewport-relative), so use rect coords directly.
      // Adding scrollX/Y here pushed the menu off-screen once the page was scrolled.
      const MENU_HEIGHT = 180; // approx dropdown height; flip up if it would overflow the viewport
      const openUp = rect.bottom + MENU_HEIGHT > window.innerHeight;
      setMenuPosition({
        top: openUp ? Math.max(8, rect.top - MENU_HEIGHT) : rect.bottom,
        left: rect.right - 160, // 160 is w-40 (dropdown width)
      });
      setMenuOpenId(id);
    }
  };

  const openEditModal = (id) => {
    setEditingProductId(id);
    setIsEditModalOpen(true);
    setMenuOpenId(null);
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-bronze/10 rounded-lg p-10">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-editorial text-bronze/50">No products found</p>
          <p className="text-sm text-bronze/30 mt-2">
            Create your first product to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-bronze/10 rounded-lg overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bronze/10 bg-champagne/10">
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Artifact</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Category</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Stock</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const { image, name, price, stock, category, company, id } = product;
                return (
                  <tr key={index} className="border-b border-bronze/5 hover:bg-champagne/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={image}
                          alt={name}
                          className="w-14 h-14 object-cover rounded-lg shadow-sm border border-bronze/5"
                        />
                        <div>
                          <p className="text-[11px] font-black text-bronze uppercase tracking-widest">{name.substring(0, 25)}{name.length > 25 ? '...' : ''}</p>
                          <p className="text-[10px] text-gold font-bold mt-1 tracking-wider">{formatPrice(price)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-bronze">{category}</p>
                        <p className="text-[9px] text-bronze/50 font-bold uppercase tracking-tight mt-1">{company}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black ${stock > 10 ? 'text-emerald-600' : stock > 5 ? 'text-amber-600' : 'text-red-500'}`}>
                          {stock}
                        </span>
                        {stock > 0 && stock < 5 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black uppercase tracking-tighter rounded border border-red-200 animate-pulse">
                            Low
                          </span>
                        )}
                        {stock === 0 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-black uppercase tracking-tighter rounded border border-gray-200">
                            OOS
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          ref={(el) => (buttonRefs.current[id] = el)}
                          onClick={() => toggleMenu(id)}
                          className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-bronze/60 hover:text-bronze hover:bg-bronze/5 rounded transition-colors"
                        >
                          Actions <BiChevronDown />
                        </button>
                        {menuOpenId === id && createPortal(
                          <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setMenuOpenId(null)} />
                            <div
                              className="fixed w-40 bg-white border border-bronze/10 rounded-lg shadow-xl z-[70] py-1 pointer-events-auto"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`
                              }}
                            >
                              <Link to={`/admin/products/${id}`} onClick={() => setMenuOpenId(null)}>
                                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-bronze/70 hover:bg-bronze/5 cursor-pointer">
                                  View Archive
                                </div>
                              </Link>
                              <div
                                className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-bronze/70 hover:bg-bronze/5 cursor-pointer"
                                onClick={() => openEditModal(id)}
                              >
                                Edit Heritage
                              </div>
                              {currentUser.privilege !== 'low' && (
                                <div
                                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 cursor-pointer"
                                  onClick={() => { handleDelete(id); setMenuOpenId(null); }}
                                >
                                  Delete
                                </div>
                              )}
                            </div>
                          </>,
                          document.body
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <UpdateProductModal
        id={editingProductId}
        externalOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

export default ProductsTable;
