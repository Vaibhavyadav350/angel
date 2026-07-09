import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { categoryData, COLLECTION_OPTIONS } from '../../../utils/categoryData';
import { formatPrice } from '../../../utils/helpers';
import { unitSellingPrice } from '../../../utils/pricing';
import TagInput from './TagInput';
import ColorPicker from './ColorPicker';
import { useVariantMatrix } from './useVariantMatrix';

const inputClass =
  'w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors';
const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2';
const sectionHeading = 'text-[11px] font-black uppercase tracking-widest text-bronze';

/**
 * The full product form body, shared by the Create and Edit modals.
 *
 * Fully controlled and context-agnostic: it reads from `form` and reports every
 * change through `onField(name, value)` with already-typed values. This is the
 * single place product fields are defined, so Create and Edit can never drift.
 */
function ProductFormFields({ form, onField, imageList, onAddFiles, onRemoveImage }) {
  const {
    name = '',
    price = '',
    company = '',
    description = '',
    category = '',
    subCategory = '',
    productType = '',
    collections = [],
    colors = [],
    sizes = [],
    variants = [],
    shipping = false,
    featured = false,
    discountPercent = 0,
    badgeText = '',
    leadTimeDays = '',
    composition = '',
    careInstructions = '',
  } = form;

  const { setVariantField, totalStock } = useVariantMatrix(colors, sizes, variants, category, onField);

  const onDrop = useCallback((acceptedFiles) => onAddFiles(acceptedFiles), [onAddFiles]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
  });

  const toggleCollection = (value, checked) => {
    const next = checked ? [...collections, value] : collections.filter((c) => c !== value);
    onField('collections', next);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left column: core data & logistics */}
      <div className="space-y-8">
        <div className="border-b border-bronze/10 pb-2 mb-4">
          <h4 className={sectionHeading}>1. Core Information</h4>
        </div>

        <div>
          <label className={labelClass}>Product Name</label>
          <input className={inputClass} placeholder="e.g. The Celestial Lehenga" value={name} onChange={(e) => onField('name', e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Recommended Price (AUD · incl. GST)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-bronze/40 text-sm">$</span>
            <input className={`${inputClass} pl-8`} type="number" placeholder="0.00" value={price} onChange={(e) => onField('price', Number(e.target.value))} />
          </div>
          <p className="text-[9px] text-bronze/40 mt-1">The RRP, GST included. Apply a markdown below; coupon codes stack on top at checkout.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Discount (%)</label>
            <input className={inputClass} type="number" min="0" max="100" placeholder="0" value={discountPercent} onChange={(e) => onField('discountPercent', Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Selling Price</label>
            <input className={`${inputClass} bg-white/50 cursor-not-allowed`} disabled value={formatPrice(unitSellingPrice({ price, discountPercent }))} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Brand / Designer</label>
          <input className={inputClass} placeholder="Angel Fashion Studio" value={company} onChange={(e) => onField('company', e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Description / Materials</label>
          <textarea className={`${inputClass} min-h-[120px] resize-y`} placeholder="Describe the materials, craftsmanship, and story..." value={description} onChange={(e) => onField('description', e.target.value)} />
        </div>

        {/* Section 2: Logistics & Marketing */}
        <div className="border-b border-bronze/10 pb-2 mb-4 mt-8">
          <h4 className={sectionHeading}>2. Logistics & Marketing</h4>
        </div>

        <div className="flex gap-6 p-4 bg-bronze/5 rounded-lg border border-bronze/10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={shipping} onChange={(e) => onField('shipping', e.target.checked)} className="accent-bronze" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/70">Free Shipping</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => onField('featured', e.target.checked)} className="accent-bronze" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/70">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isTrending} onChange={(e) => onField('isTrending', e.target.checked)} className="accent-bronze" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/70">Trending</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Lead Time (Days)</label>
            <input className={inputClass} type="number" placeholder="0 = Ready to Ship" value={leadTimeDays} onChange={(e) => onField('leadTimeDays', Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Badge Text</label>
            <input className={inputClass} placeholder="e.g. Bestseller, New Arrival" value={badgeText} onChange={(e) => onField('badgeText', e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Fabric Composition</label>
          <input className={inputClass} value={composition} onChange={(e) => onField('composition', e.target.value)} placeholder="100% Pure Silk, Velvet + Zari border..." />
        </div>

        <div>
          <label className={labelClass}>Care Instructions</label>
          <textarea className={`${inputClass} min-h-[80px] resize-y`} value={careInstructions} onChange={(e) => onField('careInstructions', e.target.value)} placeholder="Dry Clean Only. Store in muslin bag..." />
        </div>
      </div>

      {/* Right column: media, taxonomy & variant matrix */}
      <div className="space-y-8">
        {/* Section 3: Media Gallery */}
        <div className="border-b border-bronze/10 pb-2 mb-4">
          <h4 className={sectionHeading}>3. Media Gallery</h4>
        </div>
        
        <div>
          <div
            className="flex flex-col items-center justify-center min-h-[140px] border-2 border-dashed border-bronze/30 rounded-xl bg-champagne/20 cursor-pointer hover:border-gold hover:bg-champagne/40 transition-all duration-300"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-sm font-bold text-bronze uppercase tracking-widest">Drop images here...</p>
            ) : (
              <div className="text-center">
                <span className="text-2xl opacity-50 block mb-2">📸</span>
                <p className="text-xs font-bold text-bronze uppercase tracking-widest mb-1">Upload Product Images</p>
                <p className="text-[10px] text-bronze/50">Drag & drop or click to browse</p>
              </div>
            )}
          </div>

          {imageList.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {imageList.map((img, index) => {
                const src = img.url || (img instanceof File ? URL.createObjectURL(img) : '');
                return (
                  <div key={index} className="relative aspect-[3/4] group rounded-lg overflow-hidden border border-bronze/20 shadow-sm">
                    <img src={src} alt="Upload preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 hover:text-red-700 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110"
                    >
                      ✕
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-bronze/90 text-white text-[9px] font-bold uppercase tracking-widest text-center py-1">
                        Primary Cover
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Taxonomy & Routing */}
        <div className="border-b border-bronze/10 pb-2 mb-4">
          <h4 className={sectionHeading}>4. Taxonomy & Routing</h4>
        </div>

        <div>
          <label className={labelClass}>Primary Category</label>
          <select className={inputClass} value={category} onChange={(e) => {
            onField('category', e.target.value);
            onField('subCategory', '');
            onField('productType', '');
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
            <select className={inputClass} value={subCategory} disabled={!category} onChange={(e) => {
              const subCat = e.target.value;
              onField('subCategory', subCat);
              if (category && subCat && categoryData[category]?.[subCat]?.length === 1) {
                onField('productType', categoryData[category][subCat][0]);
              } else {
                onField('productType', '');
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
            <select className={inputClass} value={productType} disabled={!subCategory} onChange={(e) => onField('productType', e.target.value)}>
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
            {COLLECTION_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer bg-champagne/20 px-3 py-1.5 rounded border border-bronze/5">
                <input
                  type="checkbox"
                  checked={collections.includes(value)}
                  onChange={(e) => toggleCollection(value, e.target.checked)}
                  className="accent-bronze"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/70">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-6 p-4 bg-bronze/5 rounded-lg border border-bronze/10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={shipping} onChange={(e) => onField('shipping', e.target.checked)} className="accent-bronze w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/80">Requires Shipping</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => onField('featured', e.target.checked)} className="accent-bronze w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/80">Highlight as Featured</span>
          </label>
        </div>

        <div className="border-b border-bronze/10 pb-2 mb-4 mt-8">
          <h4 className={sectionHeading}>3. Merchandising & Fulfilment</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Badge Text</label>
            <input className={inputClass} value={badgeText} onChange={(e) => onField('badgeText', e.target.value)} placeholder="Online Exclusive, Pre-Order..." />
          </div>
          <div>
            <label className={labelClass}>Lead Time (Days to Dispatch)</label>
            <input type="number" min="0" className={inputClass} value={leadTimeDays} onChange={(e) => onField('leadTimeDays', e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 7" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Fabric Composition</label>
          <input className={inputClass} value={composition} onChange={(e) => onField('composition', e.target.value)} placeholder="100% Pure Silk, Velvet + Zari border..." />
        </div>

        <div>
          <label className={labelClass}>Care Instructions</label>
          <textarea className={`${inputClass} min-h-[80px] resize-y`} value={careInstructions} onChange={(e) => onField('careInstructions', e.target.value)} placeholder="Dry Clean Only. Store in muslin bag..." />
        </div>
      </div>

      {/* Right column: variant matrix & media */}
      <div className="lg:col-span-7 space-y-6">
        <div className="border-b border-bronze/10 pb-2 mb-4">
          <h4 className={sectionHeading}>4. Variant Matrix & Inventory</h4>
          <p className="text-[9px] text-bronze/50 italic mt-1">Add sizes and colors below; the SKU matrix is generated automatically.</p>
        </div>

        {category === 'Jewelry' ? (
          <div className="bg-champagne/10 p-5 rounded border border-bronze/10 mb-6">
            <div className="mb-4">
              <label className={labelClass}>Available Colors</label>
              <ColorPicker value={colors} onChange={(next) => onField('colors', next)} />
            </div>
            {colors.length === 0 && (
              <p className="text-[9px] text-bronze/50 mt-2">Jewelry items default to a single stock value below. Select colors above to track stock by color.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-champagne/10 p-5 rounded border border-bronze/10 mb-6">
            <div>
              <label className={labelClass}>Available Sizes</label>
              <TagInput value={sizes} onChange={(next) => onField('sizes', next)} placeholder="S, M, L, XL" hint="Press Enter or comma to add each size" />
            </div>
            <div>
              <label className={labelClass}>Available Colors</label>
              <ColorPicker value={colors} onChange={(next) => onField('colors', next)} />
            </div>
          </div>
        )}

        {variants.length > 0 ? (
              <div className="bg-white border border-bronze/20 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-bronze text-white px-4 py-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Stock Matrix Mapping</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Total Units: {totalStock}</span>
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
                      {variants.map((v, index) => (
                        <tr key={`${v.size}-${v.color}-${index}`} className="border-b border-bronze/5 hover:bg-champagne/5 transition-colors">
                          <td className="p-3 font-medium text-bronze">{v.size}</td>
                          <td className="p-3 font-medium text-bronze">
                            <div className="flex items-center gap-2">
                              {typeof v.color === 'string' && v.color.startsWith('#') && <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: v.color }} />}
                              {v.color}
                            </div>
                          </td>
                          <td className="p-2">
                            <input
                              className="w-full bg-transparent border-b border-transparent hover:border-bronze/20 focus:border-bronze outline-none px-2 py-1 text-xs text-bronze"
                              placeholder="Auto-generate"
                              value={v.sku || ''}
                              onChange={(e) => setVariantField(index, 'sku', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              className="w-full border border-bronze/20 rounded px-2 py-1 outline-none focus:border-gold text-bronze text-center font-bold"
                              value={v.stock}
                              min="0"
                              onChange={(e) => setVariantField(index, 'stock', Number(e.target.value))}
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
                <p className="text-xs text-bronze/50 font-medium">Variant matrix will be generated once you add sizes and/or colors above.</p>
                <p className="text-[10px] text-bronze/30 uppercase tracking-widest font-black mt-2">Required for checkout</p>
              </div>
            )}
        )}

        <div className="border-b border-bronze/10 pb-2 mb-4 mt-8">
          <h4 className={sectionHeading}>5. Media Gallery</h4>
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
              {isDragActive ? 'Drop files to upload' : 'Click or drag files to upload primary & gallery images'}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-bronze/30 mt-2 font-black">Supports JPEG, PNG (Max 5MB)</p>
          </div>
          <input {...getInputProps()} />

          {imageList.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-4">
              {imageList.map((image, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm border border-bronze/10 aspect-square">
                  <img src={image?.url ? image.url : image} alt={`media-${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-bronze/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => onRemoveImage(index)} className="bg-white text-red-500 rounded p-1.5 transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all shadow-lg">
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
  );
}

export default ProductFormFields;
