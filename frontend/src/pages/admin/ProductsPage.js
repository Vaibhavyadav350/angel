import React from 'react';
import {
  ProductsTable,
  SidebarWithHeader,
  CreateNewProductModal,
} from '../../components/admin';
import { MdRefresh } from 'react-icons/md';
import { useProductContext } from '../../context/admin_product_context';
import { toast } from 'react-toastify';

function ProductsPage() {
  const {
    products,
    products_loading: loading,
    products_error: error,
    fetchProducts,
    exportProductsToExcel,
  } = useProductContext();

  const [exporting, setExporting] = React.useState(false);

  const handleRefresh = async () => {
    await fetchProducts();
  };

  const handleExport = async () => {
    setExporting(true);
    const res = await exportProductsToExcel();
    setExporting(false);
    if (!res.success) toast.error(res.message);
  };

  return (
    <SidebarWithHeader>
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-bronze/10">
          <div>
            <h1 className="text-3xl font-editorial font-black text-bronze uppercase tracking-widest">Inventory Archive</h1>
            <p className="text-[10px] text-bronze/40 mt-2 font-bold uppercase tracking-[0.3em]">Manage Heritage Products & Stock Levels</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              {exporting ? 'Exporting...' : 'Mass Export'}
            </button>
            <CreateNewProductModal />
            <button
              onClick={handleRefresh}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-bronze/20 text-bronze text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-bronze/5 transition-all active:scale-95"
            >
              <MdRefresh className="text-lg" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg font-editorial text-red-500">There was an error loading products</p>
        </div>
      ) : (
        <ProductsTable products={products} />
      )}
    </SidebarWithHeader>
  );
}

export default ProductsPage;
