import React, { useState } from 'react';
import { formatPrice, truncate } from '../../utils/helpers';
import ActionMenu, { ActionMenuItem, ActionMenuDivider } from './ActionMenu';
import { useAdminProductStore, useAdminAuthStore } from '../../stores';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdateProductModal from './UpdateProductModal';

function ProductsTable({ products }) {
  const { currentAdmin: currentUser } = useAdminAuthStore();
  const { fetchProducts, deleteProduct } = useAdminProductStore();
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

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


  const openEditModal = (id) => {
    setEditingProductId(id);
    setIsEditModalOpen(true);
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
                          <p className="text-[11px] font-black text-bronze uppercase tracking-widest">{truncate(name, 25)}</p>
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
                      <ActionMenu width={168}>
                        {(close) => (
                          <>
                            <Link to={`/admin/products/${id}`} onClick={close}>
                              <ActionMenuItem icon="visibility">View Archive</ActionMenuItem>
                            </Link>
                            <ActionMenuItem icon="edit" onClick={() => { openEditModal(id); close(); }}>
                              Edit Heritage
                            </ActionMenuItem>
                            {currentUser.privilege !== 'low' && (
                              <>
                                <ActionMenuDivider />
                                <ActionMenuItem tone="danger" icon="delete" onClick={() => { handleDelete(id); close(); }}>
                                  Delete
                                </ActionMenuItem>
                              </>
                            )}
                          </>
                        )}
                      </ActionMenu>
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
