import React, { useState, useEffect } from 'react';
import { useProductContext } from '../../context/admin_product_context';
import { toast } from 'react-toastify';
import ProductFormFields from './product-form/ProductFormFields';
import ProductFormModalShell from './product-form/ProductFormModalShell';
import { useImageList } from './product-form/useImageList';
import { validateProduct, buildProductPayload } from './product-form/productPayload';

function UpdateProductModal({ id, externalOpen, onClose }) {
  const {
    single_product,
    single_product_loading,
    fetchProducts,
    fetchSingleProduct,
    setExistingProductField,
    updateProduct,
  } = useProductContext();

  const { imageList, setImageList, addFiles, removeImage } = useImageList([]);
  const [loading, setLoading] = useState(false);

  // Load the product when the modal opens.
  useEffect(() => {
    if (externalOpen && id) {
      fetchSingleProduct(id);
    }
  }, [externalOpen, id, fetchSingleProduct]);

  // Sync the working image list once the product has loaded.
  useEffect(() => {
    if (!single_product_loading) {
      setImageList(single_product.images || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [single_product_loading]);

  const handleSubmit = async () => {
    const error = validateProduct(single_product, imageList);
    if (error) return toast.error(error, { position: 'top-center' });

    setLoading(true);
    const res = await updateProduct(id, buildProductPayload(single_product, imageList));
    setLoading(false);
    if (res.success) {
      toast.success('Product completely updated', { position: 'top-center' });
      await fetchProducts(true);
      onClose();
    } else {
      toast.error(res.message, { position: 'top-center' });
    }
  };

  if (!externalOpen) return null;

  const footer = (
    <div className="flex justify-end gap-4 items-center">
      <button
        onClick={onClose}
        className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/70 hover:text-bronze hover:bg-bronze/5 rounded-lg transition-colors border border-transparent hover:border-bronze/10"
      >
        Cancel Edit
      </button>
      {!single_product_loading && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-lg hover:bg-gold hover:text-bronze shadow-lg shadow-bronze/20 transition-all duration-300 disabled:opacity-50 disabled:shadow-none min-w-[180px]"
        >
          {loading ? 'Updating...' : 'Commit Changes'}
        </button>
      )}
    </div>
  );

  return (
    <ProductFormModalShell
      title="Enterprise Product Editor"
      subtitle={`Editing SKU: ${id}`}
      onClose={onClose}
      footer={footer}
      zClass="z-[100]"
    >
      {single_product_loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-2 border-bronze/10 border-t-gold rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Fetching Product Genome...</p>
        </div>
      ) : (
        <ProductFormFields
          form={single_product}
          onField={setExistingProductField}
          imageList={imageList}
          onAddFiles={addFiles}
          onRemoveImage={removeImage}
        />
      )}
    </ProductFormModalShell>
  );
}

export default UpdateProductModal;
