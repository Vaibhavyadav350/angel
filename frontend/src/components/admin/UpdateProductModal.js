import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useProductContext } from '../../context/admin_product_context';
import { categoryData } from '../../utils/categoryData';
import { toast } from 'react-toastify';

function UpdateProductModal({ id, externalOpen, onClose }) {
  const {
    single_product: {
      name = '',
      price = '',
      stock = 0,
      description = '',
      colors = [],
      sizes = [],
      category = '',
      subCategory = '',
      productType = '',
      company = '',
      images = [],
      shipping = false,
      featured = false,
    },
    single_product,
    single_product_loading,
    fetchProducts,
    fetchSingleProduct,
    updateExistingProductDetails,
    updateProduct,
  } = useProductContext();

  const [imageList, setImageList] = useState(images);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImageList((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
  });

  const removeImage = (index) => {
    setImageList((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  const handleSubmit = async () => {
    if (
      !name || !price || !stock || !description ||
      colors.length < 1 || sizes.length < 1 ||
      !category || !subCategory || !company
    ) {
      return toast.error('Please provide all the details', { position: 'top-center' });
    }
    if (imageList.length < 1) {
      return toast.error('Add at least one image', { position: 'top-center' });
    }
    setLoading(true);
    const product = {
      name, price, stock, description, colors, sizes, category,
      subCategory, productType,
      collections: single_product.collections,
      company, shipping, featured,
      images: imageList,
    };
    const responseCreate = await updateProduct(id, product);
    setLoading(false);
    if (responseCreate.success) {
      toast.success('Product updated', { position: 'top-center' });
      await fetchProducts();
      onClose();
    } else {
      toast.error(responseCreate.message, { position: 'top-center' });
    }
  };

  useEffect(() => {
    if (externalOpen && id) {
      fetchSingleProduct(id);
    }
  }, [externalOpen, id, fetchSingleProduct]);

  useEffect(() => {
    setImageList(images);
    // eslint-disable-next-line
  }, [single_product_loading]);

  if (!externalOpen) return null;

  const inputClass = "w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-bronze/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-bronze/10 rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bronze/10 sticky top-0 bg-white z-10">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-bronze">Update Product</h3>
          <button onClick={onClose} className="text-bronze/40 hover:text-bronze transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {single_product_loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-bronze/10 border-t-gold rounded-full animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Fetching product details...</p>
            </div>
          ) : (
            <>
              <div>
                <label className={labelClass}>Name</label>
                <input className={inputClass} placeholder="Product Name" name="name" value={name} onChange={updateExistingProductDetails} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Base Price (AUD)</label>
                  <input className={inputClass} type="number" placeholder="Price" name="price" value={price} onChange={updateExistingProductDetails} />
                </div>
                <div>
                  <label className={labelClass}>Stock Level</label>
                  <input className={inputClass} type="number" placeholder="Stock" name="stock" value={stock} onChange={updateExistingProductDetails} />
                </div>
              </div>

              {/* Pricing & Tax Section */}
              <div className="bg-bronze/5 p-4 rounded-lg space-y-4 border border-bronze/10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold block mb-2">Pricing & Tax Archival</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Archival Discount (%)</label>
                    <input className={inputClass} type="number" name="discountPercent" value={single_product.discountPercent || 0} onChange={updateExistingProductDetails} />
                  </div>
                  <div>
                    <label className={labelClass}>Regional GST (%)</label>
                    <input className={inputClass} type="number" name="taxPercent" value={single_product.taxPercent || 0} onChange={updateExistingProductDetails} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Calculated Tax Amount (AUD)</label>
                  <input
                    className={`${inputClass} bg-white/80`}
                    type="number"
                    value={((price * (single_product.taxPercent || 0)) / 100).toFixed(2)}
                    onChange={(e) => {
                      const amount = Number(e.target.value);
                      const newPercent = price > 0 ? (amount / price) * 100 : 0;
                      updateExistingProductDetails({ target: { name: 'taxPercent', value: newPercent } });
                    }}
                  />
                  <p className="text-[9px] text-bronze/40 mt-1 italic">Automated calculation based on regional flagship rates. Editable for manual override.</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea className={`${inputClass} min-h-[80px] resize-y`} placeholder="Product Description" name="description" value={description} onChange={updateExistingProductDetails} />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} name="category" value={category} onChange={(e) => {
                  updateExistingProductDetails(e);
                  updateExistingProductDetails({ target: { name: 'subCategory', value: '' } });
                  updateExistingProductDetails({ target: { name: 'productType', value: '' } });
                }}>
                  <option value="">Select Category</option>
                  {Object.keys(categoryData).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Sub-Category</label>
                  <select className={inputClass} name="subCategory" value={subCategory} disabled={!category} onChange={(e) => {
                    updateExistingProductDetails(e);
                    updateExistingProductDetails({ target: { name: 'productType', value: '' } });
                    const subCat = e.target.value;
                    if (category && subCat && categoryData[category]?.[subCat]?.length === 1) {
                      updateExistingProductDetails({ target: { name: 'productType', value: categoryData[category][subCat][0] } });
                    }
                  }}>
                    <option value="">Select</option>
                    {category && categoryData[category] && Object.keys(categoryData[category]).map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Product Type</label>
                  <select className={inputClass} name="productType" value={productType} disabled={!subCategory} onChange={updateExistingProductDetails}>
                    <option value="">Optional</option>
                    {category && subCategory && categoryData[category]?.[subCategory]?.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Collections</label>
                <div className="flex flex-wrap gap-3">
                  {['New Arrivals', 'Ready To Ship', 'Best Sellers', 'Sale', 'Plus Sizes'].map((col) => (
                    <label key={col} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={single_product.collections && single_product.collections.includes(col)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          let newCollections = single_product.collections ? [...single_product.collections] : [];
                          if (checked) { newCollections.push(col); } else { newCollections = newCollections.filter(c => c !== col); }
                          updateExistingProductDetails({ target: { name: 'collections', value: newCollections } });
                        }}
                        className="accent-bronze"
                      />
                      <span className="text-xs text-bronze/70">{col}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Company</label>
                <input className={inputClass} placeholder="Company" name="company" value={company} onChange={updateExistingProductDetails} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Sizes</label>
                  <input className={inputClass} placeholder="m, l, xl" name="sizes" value={sizes} onChange={updateExistingProductDetails} />
                  <p className="text-[9px] text-bronze/30 mt-1">Eg: m, l, xl, xxl</p>
                </div>
                <div>
                  <label className={labelClass}>Colors</label>
                  <input className={inputClass} placeholder="red,blue" name="colors" value={colors} onChange={updateExistingProductDetails} />
                  <p className="text-[9px] text-bronze/30 mt-1">Eg: red,green or #FF0000</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Images</label>
                <div
                  className="flex items-center justify-center min-h-[100px] my-2 border-2 border-dashed border-bronze/20 rounded-lg bg-champagne/30 cursor-pointer hover:border-gold transition-colors"
                  {...getRootProps()}
                >
                  <p className="text-xs text-bronze/40 text-center p-4">
                    {isDragActive ? 'Drop files here...' : 'Drag & drop images, or click to select'}
                  </p>
                </div>
                <input {...getInputProps()} />
                {imageList.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {imageList.map((image, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <img src={image?.url ? image.url : image} alt={`img-${index}`} className="w-16 h-16 object-cover rounded-md" />
                        <button
                          onClick={() => removeImage(index)}
                          className="text-[9px] font-bold uppercase text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="shipping" checked={shipping} onChange={updateExistingProductDetails} className="accent-bronze" />
                  <span className="text-xs text-bronze/70">Shipping</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={featured} onChange={updateExistingProductDetails} className="accent-bronze" />
                  <span className="text-xs text-bronze/70">Featured</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-bronze/10 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 hover:text-bronze border border-bronze/20 rounded transition-colors"
          >
            Cancel
          </button>
          {!single_product_loading && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateProductModal;
