import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useProductContext } from '../../context/admin_product_context';
import { categoryData } from '../../utils/categoryData';
import { toast } from 'react-toastify';

function CreateNewProductModal() {
  const {
    new_product: {
      name,
      price,
      stock,
      description,
      colors,
      sizes,
      category,
      company,
      shipping,
      featured,
    },
    new_product,
    updateNewProductDetails,
    createNewProduct,
  } = useProductContext();

  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      !category || !new_product.subCategory || !company
    ) {
      return toast.error('Please provide all the details', { position: 'top-center' });
    }
    if (imageList.length < 1) {
      return toast.error('Add at least one image', { position: 'top-center' });
    }
    setLoading(true);
    const product = {
      name, price, stock, description, colors, sizes, category,
      subCategory: new_product.subCategory,
      productType: new_product.productType,
      collections: new_product.collections,
      company, shipping, featured,
      images: imageList,
    };
    const responseCreate = await createNewProduct(product);
    setLoading(false);
    if (responseCreate.success) {
      setIsOpen(false);
      toast.success('Product created', { position: 'top-center' });
    } else {
      toast.error(responseCreate.message, { position: 'top-center' });
    }
  };

  const inputClass = "w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/90 transition-colors"
      >
        Create New Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-bronze/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white border border-bronze/10 rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-bronze/10 sticky top-0 bg-white z-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-bronze">Create New Product</h3>
              <button onClick={() => setIsOpen(false)} className="text-bronze/40 hover:text-bronze transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className={labelClass}>Name</label>
                <input className={inputClass} placeholder="Product Name" name="name" value={name} onChange={updateNewProductDetails} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Base Price (AUD)</label>
                  <input className={inputClass} type="number" placeholder="Base Price" name="price" value={price} onChange={updateNewProductDetails} />
                </div>
                <div>
                  <label className={labelClass}>Stock Level</label>
                  <input className={inputClass} type="number" placeholder="Stock" name="stock" value={stock} onChange={updateNewProductDetails} />
                </div>
              </div>

              {/* Pricing & Tax Section */}
              <div className="bg-bronze/5 p-4 rounded-lg space-y-4 border border-bronze/10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold block mb-2">Pricing & Tax Archival</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Archival Discount (%)</label>
                    <input className={inputClass} type="number" name="discountPercent" value={new_product.discountPercent} onChange={updateNewProductDetails} />
                  </div>
                  <div>
                    <label className={labelClass}>Regional GST (%)</label>
                    <input className={inputClass} type="number" name="taxPercent" value={new_product.taxPercent} onChange={updateNewProductDetails} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Calculated Tax Amount (AUD)</label>
                  <input
                    className={`${inputClass} bg-white/80`}
                    type="number"
                    value={((price * (new_product.taxPercent || 0)) / 100).toFixed(2)}
                    onChange={(e) => {
                      const amount = Number(e.target.value);
                      const newPercent = price > 0 ? (amount / price) * 100 : 0;
                      updateNewProductDetails({ target: { name: 'taxPercent', value: newPercent } });
                    }}
                  />
                  <p className="text-[9px] text-bronze/40 mt-1 italic">Automated calculation based on regional flagship rates. Editable for manual override.</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea className={`${inputClass} min-h-[80px] resize-y`} placeholder="Product Description" name="description" value={description} onChange={updateNewProductDetails} />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} name="category" value={category} onChange={(e) => {
                  updateNewProductDetails(e);
                  updateNewProductDetails({ target: { name: 'subCategory', value: '' } });
                  updateNewProductDetails({ target: { name: 'productType', value: '' } });
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
                  <select className={inputClass} name="subCategory" value={new_product.subCategory} disabled={!category} onChange={(e) => {
                    updateNewProductDetails(e);
                    updateNewProductDetails({ target: { name: 'productType', value: '' } });
                    const subCat = e.target.value;
                    if (category && subCat && categoryData[category]?.[subCat]?.length === 1) {
                      updateNewProductDetails({ target: { name: 'productType', value: categoryData[category][subCat][0] } });
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
                  <select className={inputClass} name="productType" value={new_product.productType} disabled={!new_product.subCategory} onChange={updateNewProductDetails}>
                    <option value="">Optional</option>
                    {category && new_product.subCategory && categoryData[category]?.[new_product.subCategory]?.map((type) => (
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
                        checked={new_product.collections.includes(col)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          let newCollections = [...new_product.collections];
                          if (checked) { newCollections.push(col); } else { newCollections = newCollections.filter(c => c !== col); }
                          updateNewProductDetails({ target: { name: 'collections', value: newCollections } });
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
                <input className={inputClass} placeholder="Company" name="company" value={company} onChange={updateNewProductDetails} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Sizes</label>
                  <input className={inputClass} placeholder="m, l, xl" name="sizes" value={sizes} onChange={updateNewProductDetails} />
                  <p className="text-[9px] text-bronze/30 mt-1">Eg: m, l, xl, xxl</p>
                </div>
                <div>
                  <label className={labelClass}>Colors</label>
                  <input className={inputClass} placeholder="red,blue" name="colors" value={colors} onChange={updateNewProductDetails} />
                  <p className="text-[9px] text-bronze/30 mt-1">Eg: red,green or #FF0000,#00FF00</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Images</label>
                <div
                  className="flex items-center justify-center min-h-[100px] my-2 border-2 border-dashed border-bronze/20 rounded-lg bg-champagne/30 cursor-pointer hover:border-gold transition-colors"
                  {...getRootProps()}
                >
                  <p className="text-xs text-bronze/40 text-center p-4">
                    {isDragActive ? 'Drop files here...' : 'Drag & drop images, or click to select\n(*.jpeg, *.png)'}
                  </p>
                </div>
                <input {...getInputProps()} />
                {imageList.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {imageList.map((image, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <img src={image} alt={`upload-${index}`} className="w-16 h-16 object-cover rounded-md" />
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
                  <input type="checkbox" name="shipping" checked={shipping} onChange={updateNewProductDetails} className="accent-bronze" />
                  <span className="text-xs text-bronze/70">Shipping</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={featured} onChange={updateNewProductDetails} className="accent-bronze" />
                  <span className="text-xs text-bronze/70">Featured</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-bronze/10 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 hover:text-bronze border border-bronze/20 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2.5 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateNewProductModal;
