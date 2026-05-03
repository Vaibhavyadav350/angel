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
      description = '',
      colors = [],
      sizes = [],
      variants = [],
      category = '',
      subCategory = '',
      productType = '',
      company = '',
      images = [],
      shipping = false,
      featured = false,
      discountPercent = 0,
      taxPercent = 0,
      badgeText = '',
      leadTimeDays = '',
      composition = '',
      careInstructions = '',
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

  // --- Variant Matrix Logic for Edit ---
  useEffect(() => {
    // When colors or sizes change, auto-generate/update the variant grid.
    if (!single_product_loading && externalOpen && (colors.length > 0 || sizes.length > 0)) {
      const newVariants = [];
      const currentVariants = [...(variants || [])];

      const sizeList = sizes.length > 0 ? sizes : ['One Size'];
      const colorList = colors.length > 0 ? colors : ['Standard'];

      sizeList.forEach(size => {
        colorList.forEach(color => {
          // Preserve existing stock/sku
          const existing = currentVariants.find(v => v.size === size && v.color === color);
          newVariants.push({
            size,
            color,
            stock: existing ? existing.stock : 0,
            sku: existing && existing.sku ? existing.sku : ''
          });
        });
      });

      // We only update context if the lengths differ or matrix structure changed heavily, 
      // preventing infinite loops on every keystroke. Simple length check usually suffices for mapping.
      if (newVariants.length !== (variants || []).length) {
        updateExistingProductDetails({ target: { name: 'variants', value: newVariants } });
      }
    }
    // eslint-disable-next-line
  }, [colors.length, sizes.length, single_product_loading, externalOpen]);

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...(variants || [])];
    updatedVariants[index][field] = value;
    updateExistingProductDetails({ target: { name: 'variants', value: updatedVariants } });
  };

  const calculateTotalStock = () => {
    return (variants || []).reduce((total, v) => total + (Number(v.stock) || 0), 0);
  };
  // -----------------------------

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
      !name || !price || !description ||
      !category || !subCategory || !company
    ) {
      return toast.error('Please provide all primary details', { position: 'top-center' });
    }
    if ((variants || []).length === 0) {
      return toast.error('Please define at least one Color or Size to generate Inventory Variants.', { position: 'top-center' });
    }
    if (imageList.length < 1) {
      return toast.error('Add at least one image', { position: 'top-center' });
    }

    setLoading(true);
    // Submit global stock calculated from variants matrix
    const product = {
      name, price, stock: calculateTotalStock(), description, colors, sizes, variants, category,
      subCategory, productType,
      collections: single_product.collections,
      company, shipping, featured,
      discountPercent, taxPercent,
      images: imageList,
      badgeText: badgeText || '',
      leadTimeDays: leadTimeDays || 0,
      composition: composition || '',
      careInstructions: careInstructions || '',
    };

    const responseCreate = await updateProduct(id, product);
    setLoading(false);

    if (responseCreate.success) {
      toast.success('Product completely updated', { position: 'top-center' });
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
    if (!single_product_loading) {
      setImageList(images || []);
    }
    // eslint-disable-next-line
  }, [single_product_loading]);

  if (!externalOpen) return null;

  const inputClass = "w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-bronze/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur shadow-2xl border border-bronze/20 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col z-50 overflow-hidden">

        {/* Header */}
        <div className="flex bg-champagne/10 items-center justify-between px-8 py-5 border-b border-bronze/10">
          <div>
            <h3 className="text-sm font-editorial font-black uppercase tracking-[0.4em] text-bronze">Enterprise Product Editor</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-bronze/40 mt-1">Editing SKU: {id}</p>
          </div>
          <button onClick={onClose} className="text-bronze/40 hover:text-bronze bg-white p-2 rounded-full shadow-sm border border-bronze/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 layout-grid">
          {single_product_loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-bronze/10 border-t-gold rounded-full animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Fetching Product Genome...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* Left Column: Core Data */}
              <div className="lg:col-span-5 space-y-6">

                <div className="border-b border-bronze/10 pb-2 mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-bronze">1. Core Information</h4>
                </div>

                <div>
                  <label className={labelClass}>Product Name</label>
                  <input className={inputClass} placeholder="Product Name" name="name" value={name} onChange={updateExistingProductDetails} />
                </div>

                <div>
                  <label className={labelClass}>Base Price (AUD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-bronze/40 text-sm">$</span>
                    <input className={`${inputClass} pl-8`} type="number" placeholder="Price" name="price" value={price} onChange={updateExistingProductDetails} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Brand / Designer</label>
                  <input className={inputClass} placeholder="Company" name="company" value={company} onChange={updateExistingProductDetails} />
                </div>

                <div className="bg-bronze/5 p-4 rounded-lg space-y-4 border border-bronze/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold block mb-2">Pricing & Tax Archival</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Archival Discount (%)</label>
                      <input className={inputClass} type="number" name="discountPercent" value={discountPercent} onChange={updateExistingProductDetails} />
                    </div>
                    <div>
                      <label className={labelClass}>Regional GST (%)</label>
                      <input className={inputClass} type="number" name="taxPercent" value={taxPercent} onChange={updateExistingProductDetails} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Calculated Tax (AUD)</label>
                    <input
                      className={`${inputClass} bg-white/50 cursor-not-allowed`}
                      type="number"
                      disabled
                      value={((price * (taxPercent || 0)) / 100).toFixed(2)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description / Materials</label>
                  <textarea className={`${inputClass} min-h-[120px] resize-y`} placeholder="Product Description" name="description" value={description} onChange={updateExistingProductDetails} />
                </div>

                <div className="border-b border-bronze/10 pb-2 mb-4 mt-8">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-bronze">2. Taxonomy & Routing</h4>
                </div>

                <div>
                  <label className={labelClass}>Primary Category</label>
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
                    <label className={labelClass}>Classification</label>
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
                    <label className={labelClass}>Specifics</label>
                    <select className={inputClass} name="productType" value={productType} disabled={!subCategory} onChange={updateExistingProductDetails}>
                      <option value="">Optional</option>
                      {category && subCategory && categoryData[category]?.[subCategory]?.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Curated Collections</label>
                  <div className="flex flex-wrap gap-2">
                    {['New Arrivals', 'Ready To Ship', 'Best Sellers', 'Sale', 'Plus Sizes'].map((col) => (
                      <label key={col} className="flex items-center gap-2 cursor-pointer bg-champagne/20 px-3 py-1.5 rounded border border-bronze/5">
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
                        <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/70">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6 p-4 bg-bronze/5 rounded-lg border border-bronze/10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="shipping" checked={shipping} onChange={updateExistingProductDetails} className="accent-bronze w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/80">Requires Shipping</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={featured} onChange={updateExistingProductDetails} className="accent-bronze w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/80">Highlight as Featured</span>
                  </label>
                </div>

                {/* --- Phase B: Merchandising & Fulfilment Fields --- */}
                <div className="border-b border-bronze/10 pb-2 mb-4 mt-8">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-bronze">3. Merchandising & Fulfilment</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2">Badge Text</label>
                    <input className="w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors" name="badgeText" value={badgeText} onChange={updateExistingProductDetails} placeholder="Online Exclusive, Pre-Order..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2">Lead Time (Days to Dispatch)</label>
                    <input type="number" min="0" className="w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors" name="leadTimeDays" value={leadTimeDays} onChange={updateExistingProductDetails} placeholder="e.g. 7" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2">Fabric Composition</label>
                  <input className="w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors" name="composition" value={composition} onChange={updateExistingProductDetails} placeholder="100% Pure Silk, Velvet + Zari border..." />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2">Care Instructions</label>
                  <textarea className="w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors min-h-[80px] resize-y" name="careInstructions" value={careInstructions} onChange={updateExistingProductDetails} placeholder="Dry Clean Only. Store in muslin bag..." />
                </div>
                {/* --- End Phase B --- */}

              </div>

              {/* Right Column: Inventory Variants & Media */}
              <div className="lg:col-span-7 space-y-6">

                <div className="border-b border-bronze/10 pb-2 mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-bronze">3. Variant Matrix & Inventory</h4>
                  <p className="text-[9px] text-bronze/50 italic mt-1">If you update sizes or colors, new permutations will be added mapping to zero stock.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-champagne/10 p-5 rounded border border-bronze/10">
                  <div>
                    <label className={labelClass}>Available Sizes</label>
                    <input className={inputClass} placeholder="S, M, L" name="sizes" value={sizes} onChange={updateExistingProductDetails} />
                  </div>
                  <div>
                    <label className={labelClass}>Available Colors</label>
                    <input className={inputClass} placeholder="Red, Gold" name="colors" value={colors} onChange={updateExistingProductDetails} />
                  </div>
                </div>

                {/* Dynamic Variant Table */}
                {(variants || []).length > 0 ? (
                  <div className="bg-white border border-bronze/20 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-bronze text-white px-4 py-2 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Stock Matrix Mapping</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Total Units: {calculateTotalStock()}</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-champagne/20 sticky top-0">
                          <tr>
                            <th className="p-3 text-[10px] font-black uppercase tracking-widest text-bronze border-b border-bronze/10">Size</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-widest text-bronze border-b border-bronze/10">Color</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-widest text-bronze border-b border-bronze/10">Variant SKU (Opt)</th>
                            <th className="p-3 text-[10px] font-black uppercase tracking-widest text-bronze border-b border-bronze/10 w-24">Stock LvL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(variants || []).map((v, index) => (
                            <tr key={index} className="border-b border-bronze/5 hover:bg-champagne/5 transition-colors">
                              <td className="p-3 font-medium text-bronze">{v.size}</td>
                              <td className="p-3 font-medium text-bronze">
                                <div className="flex items-center gap-2">
                                  {v.color.startsWith('#') && <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: v.color }}></span>}
                                  {v.color}
                                </div>
                              </td>
                              <td className="p-2">
                                <input
                                  className="w-full bg-transparent border-b border-transparent hover:border-bronze/20 focus:border-bronze outline-none px-2 py-1 text-xs text-bronze"
                                  placeholder="Auto-generate"
                                  value={v.sku || ''}
                                  onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full border border-bronze/20 rounded px-2 py-1 outline-none focus:border-gold text-bronze text-center font-bold"
                                  value={v.stock}
                                  min="0"
                                  onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-bronze/20 rounded-lg text-center bg-champagne/5">
                    <p className="text-xs text-bronze/50 font-medium">Variant Matrix missing. Ensure sizes and colors are set.</p>
                  </div>
                )}

                <div className="border-b border-bronze/10 pb-2 mb-4 mt-8">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-bronze">4. Media Gallery</h4>
                </div>

                <div>
                  <div
                    className="flex flex-col items-center justify-center min-h-[140px] border-2 border-dashed border-bronze/30 rounded-xl bg-champagne/20 cursor-pointer hover:border-gold hover:bg-champagne/40 transition-all duration-300"
                    {...getRootProps()}
                  >
                    <svg className="w-8 h-8 text-bronze/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-bold text-bronze/60 text-center">
                      {isDragActive ? 'Drop files to upload' : 'Click or drag files to append gallery images'}
                    </p>
                  </div>
                  <input {...getInputProps()} />

                  {imageList.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-4">
                      {imageList.map((image, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm border border-bronze/10 aspect-square">
                          <img src={image?.url ? image.url : image} alt={`img-${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-bronze/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => removeImage(index)} className="bg-white text-red-500 rounded p-1.5 transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all shadow-lg">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          {index === 0 && <span className="absolute top-1 left-1 bg-bronze text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow">Cover</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-champagne/10 flex justify-end gap-4 items-center px-8 py-5 border-t border-bronze/10">
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
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : 'Commit Changes'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default UpdateProductModal;
