import React, { useState } from 'react';
import { useProductContext } from '../../context/admin_product_context';
import { toast } from 'react-toastify';
import ProductFormFields from './product-form/ProductFormFields';
import ProductFormModalShell from './product-form/ProductFormModalShell';
import { useImageList } from './product-form/useImageList';
import { validateProduct, buildProductPayload } from './product-form/productPayload';

function CreateNewProductModal() {
  const { new_product, setNewProductField, resetNewProduct, createNewProduct } = useProductContext();
  const { imageList, setImageList, addFiles, removeImage } = useImageList([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeAndReset = () => {
    setIsOpen(false);
    setImageList([]);
    resetNewProduct();
  };

  const handleSubmit = async () => {
    const error = validateProduct(new_product, imageList);
    if (error) return toast.error(error, { position: 'top-center' });

    setLoading(true);
    const res = await createNewProduct(buildProductPayload(new_product, imageList));
    setLoading(false);
    if (res.success) {
      toast.success('Product completely mapped and created', { position: 'top-center' });
      closeAndReset();
    } else {
      toast.error(res.message, { position: 'top-center' });
    }
  };

  const footer = (
    <div className="flex justify-between items-center">
      <p className="text-[10px] text-bronze/40 font-bold uppercase tracking-widest">
        Check all requirements before compiling block.
      </p>
      <div className="flex gap-4">
        <button
          onClick={closeAndReset}
          className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/70 hover:text-bronze hover:bg-bronze/5 rounded-lg transition-colors border border-transparent hover:border-bronze/10"
        >
          Discard Draft
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-lg hover:bg-gold hover:text-bronze shadow-lg shadow-bronze/20 transition-all duration-300 disabled:opacity-50 disabled:shadow-none min-w-[180px]"
        >
          {loading ? 'Compiling...' : 'Compile Product'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/90 transition-colors shadow-lg shadow-bronze/20"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Product & Variants
        </span>
      </button>

      {isOpen && (
        <ProductFormModalShell
          title="Enterprise Product Creator"
          subtitle="Configure Details, Taxonomy, and Inventory Matrix"
          onClose={closeAndReset}
          footer={footer}
        >
          <ProductFormFields
            form={new_product}
            onField={setNewProductField}
            imageList={imageList}
            onAddFiles={addFiles}
            onRemoveImage={removeImage}
          />
        </ProductFormModalShell>
      )}
    </>
  );
}

export default CreateNewProductModal;
